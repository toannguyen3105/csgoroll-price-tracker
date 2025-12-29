import { storageHelper } from '../storage_helper';
import { fetchItems } from './api';
import type { PriceRange, Intervals, TelegramConfig, TargetItem } from '../types';
import { sendTelegramAlert } from '../notifier/telegram';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class CrawlerEngine {
    private isRunning: boolean = false;
    private shouldStop: boolean = false;
    private processedItems: Set<string> = new Set();

    async start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.shouldStop = false;
        console.log('Crawler Engine Started');

        while (!this.shouldStop) {
            try {
                await this.processCycle();
            } catch (error) {
                console.error('Error in crawl cycle:', error);
                // Safety delay on error
                await sleep(60000);
            }
        }

        this.isRunning = false;
        console.log('Crawler Engine Stopped');
    }

    stop() {
        this.shouldStop = true;
    }

    private async processCycle() {
        const data = await storageHelper.get(['priceRanges', 'intervals', 'telegramConfig', 'targetItems']);
        const ranges: PriceRange[] = data.priceRanges || [];
        const intervals: Intervals = data.intervals || { rangeInterval: 5, batchInterval: 2, cycleDelay: 10 };
        const telegramConfig: TelegramConfig = data.telegramConfig || { botToken: '', chatId: '' };
        const targetItems: TargetItem[] = data.targetItems || [];

        if (ranges.length === 0) {
            console.log('No price ranges configured. Waiting...');
            await sleep(60000); // Wait 1 min before checking again
            return;
        }

        console.log(`Starting cycle with ${ranges.length} ranges.`);

        for (const range of ranges) {
            if (this.shouldStop) break;
            await this.processRange(range, intervals, telegramConfig, targetItems);

            console.log(`Finished range ${range.min}-${range.max}. Waiting ${intervals.rangeInterval}s...`);
            await sleep(intervals.rangeInterval * 1000);
        }

        console.log(`Cycle complete. Waiting ${intervals.cycleDelay} minutes...`);
        await sleep(intervals.cycleDelay * 60 * 1000);
    }

    private async processRange(range: PriceRange, intervals: Intervals, telegramConfig: TelegramConfig, targetItems: TargetItem[]) {
        let hasNextPage = true;
        let cursor: string | null = null;
        let pageCount = 0;

        console.log(`Processing Range: ${range.min} - ${range.max}`);

        while (hasNextPage && !this.shouldStop) {
            try {
                const data = await fetchItems(range.min, range.max, cursor);

                // Validate response structure
                if (!data || !data.data || !data.data.trades) {
                    console.warn('Invalid API response structure', data);
                    break;
                }

                const trades = data.data.trades;
                const items = trades.edges || [];

                console.log(`Fetched ${items.length} items for range ${range.min}-${range.max} (Page ${pageCount + 1})`);

                for (const edge of items) {
                    const item = edge.node;
                    const itemName = item.assets?.[0]?.name;

                    if (!itemName) continue;

                    if (!this.processedItems.has(item.id)) {
                        // Check if item is in user's Target List
                        const targetMatch = targetItems.find(t => t.name === itemName);

                        if (targetMatch) {
                            // Logic: If in target list, ONLY alert if ENABLED and price <= target price
                            if (targetMatch.enabled && item.price <= targetMatch.price) {
                                console.log(`🎯 Target Match: ${itemName} - $${item.price} (Target: $${targetMatch.price})`);
                                this.processedItems.add(item.id);
                                await sendTelegramAlert(item, telegramConfig, { type: 'TARGET', targetPrice: targetMatch.price });
                            } else {
                                // Ignore item if disabled or doesn't match target price
                            }
                        } else {
                            // Generic Logic
                            // Double check if item falls within price range (optional safety)
                            if (item.price >= range.min && item.price <= range.max) {
                                console.log(`New Generic Item Found: ${itemName} - $${item.price}`);
                                this.processedItems.add(item.id);

                                // Send Alert
                                await sendTelegramAlert(item, telegramConfig, { type: 'GENERIC' });
                            }
                        }
                    }
                }

                hasNextPage = trades.pageInfo?.hasNextPage;
                cursor = trades.pageInfo?.endCursor;
                pageCount++;

                if (hasNextPage) {
                    console.log(`Waiting ${intervals.batchInterval}s before next batch...`);
                    await sleep(intervals.batchInterval * 1000);
                }
            } catch (e) {
                console.error(`Error fetching range ${range.min}-${range.max}:`, e);
                break;
            }
        }
    }
}

export const crawler = new CrawlerEngine();
