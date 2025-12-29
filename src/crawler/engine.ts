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
        const intervals: Intervals = data.intervals || { rangeInterval: 10, batchInterval: 10, cycleDelay: 65 / 60 }; // Default: 10s range, 10s batch, 65s (1.08 min) cycle
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
                    const item = edge.node; // Note: API might return item inside node.tradeItems?

                    // The user script says: edge.node.tradeItems.forEach...
                    // Let's inspect the structure. User script:
                    // const val = edge.node.totalValue;
                    // edge.node.tradeItems.forEach((item) ...

                    // We need to adapt to this structure.
                    // Let's assume the API returns a 'bundle' or 'trade' which has a totalValue and a list of items.
                    // We are tracking individual items or the whole trade?
                    // User script tracks individual items inside the trade but checks totalValue.

                    // Let's try to map it to our LogItem structure.

                    const tradeValue = item.totalValue;

                    // Iterate over items in the trade
                    const tradeItems = item.tradeItems || [];

                    for (const tradeItem of tradeItems) {
                        const itemName = tradeItem.marketName; // User script uses marketName
                        if (!itemName) continue;

                        // Use tradeValue as price ? Or tradeItem.value ? 
                        // User script matches: if (val < target). val is totalValue.
                        // So we should use tradeValue as the "Price" we track.

                        const trackedPrice = tradeValue;

                        if (!this.processedItems.has(item.id)) { // Use Trade ID for de-duplication
                            // Check if item is in user's Target List
                            const targetMatch = targetItems.find(t => t.name === itemName);

                            // Broadcast to UI
                            try {
                                chrome.runtime.sendMessage({
                                    type: 'ITEM_SCANNED',
                                    payload: {
                                        id: item.id, // Trade ID
                                        name: itemName,
                                        price: trackedPrice,
                                        markup: item.markup, // User script doesn't show markup usage, but we keep it if available
                                        timestamp: Date.now(),
                                        isTarget: !!targetMatch
                                    }
                                });
                            } catch (err) {
                            }

                            if (targetMatch) {
                                if (targetMatch.enabled && trackedPrice <= targetMatch.price) {
                                    console.log(`🎯 Target Match: ${itemName} - $${trackedPrice} (Target: $${targetMatch.price})`);
                                    // Note: We create a pseudo-ID for the item match to allow multiple items in same trade to alert?
                                    // Actually user script iterates items. processedItems is generic.
                                    // Let's stick to Trade ID for deduplication to avoid spamming same trade.
                                    this.processedItems.add(item.id);

                                    // Construct a proper item object for the alerter
                                    const alertItem = {
                                        id: item.id,
                                        price: trackedPrice,
                                        markup: item.markup,
                                        assets: [{ name: itemName }]
                                    };

                                    await sendTelegramAlert(alertItem, telegramConfig, { type: 'TARGET', targetPrice: targetMatch.price });
                                }
                            } else {
                                if (trackedPrice >= range.min && trackedPrice <= range.max) {
                                    console.log(`New Generic Item Found: ${itemName} - $${trackedPrice}`);
                                    this.processedItems.add(item.id);

                                    // User requested to ONLY send Telegram for Target Matches to avoid 429 Errors
                                    // await sendTelegramAlert(alertItem, telegramConfig, { type: 'GENERIC' });
                                }
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
