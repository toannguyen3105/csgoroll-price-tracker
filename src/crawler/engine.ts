import { storageHelper } from "@/storage_helper";
import { fetchItems } from "./api";
import type {
  PriceRange,
  Intervals,
  TelegramConfig,
  TargetItem,
} from "@/types";
import { processItemMatch } from "./itemMatcher";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class CrawlerEngine {
  private isRunning: boolean = false;
  private shouldStop: boolean = false;
  private processedItems: Set<string> = new Set();

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.shouldStop = false;

    while (!this.shouldStop) {
      try {
        await this.processCycle();
      } catch (error) {
        console.error("Error in crawl cycle:", error);
        await sleep(60000);
      }
    }
    this.isRunning = false;
  }

  stop() {
    this.shouldStop = true;
  }

  private async processCycle() {
    const data = await storageHelper.get([
      "priceRanges",
      "intervals",
      "telegramConfig",
      "targetItems",
    ]);
    const ranges: PriceRange[] = data.priceRanges || [];
    const intervals: Intervals = data.intervals || {
      rangeInterval: 10,
      batchInterval: 10,
      cycleDelay: 65 / 60,
    };
    const telegramConfig: TelegramConfig = data.telegramConfig || {
      botToken: "",
      chatId: "",
    };
    const targetItems: TargetItem[] = data.targetItems || [];

    if (ranges.length === 0) {
      await sleep(60000);
      return;
    }

    for (const range of ranges) {
      if (this.shouldStop) break;
      await this.processRange(range, intervals, telegramConfig, targetItems);
      await sleep(intervals.rangeInterval * 1000);
    }
    await sleep(intervals.cycleDelay * 60 * 1000);
  }

  private async processRange(
    range: PriceRange,
    intervals: Intervals,
    telegramConfig: TelegramConfig,
    targetItems: TargetItem[],
  ) {
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage && !this.shouldStop) {
      try {
        const data = await fetchItems(range.min, range.max, cursor);

        if (!data || !data.data || !data.data.trades) {
          break;
        }

        const trades = data.data.trades;
        const items = trades.edges || [];

        console.log("Processing items:", items.length);
        console.log("Processing items:", items);

        for (const edge of items) {
          const item = edge.node;
          const tradeValue = item.totalValue;
          
          // Robust parsing: Handle bundles (tradeItems) or single items (marketName)
          // The API might return 'tradeItems' OR 'marketName' directly depending on the query/trade type
          let finalItems: { marketName: string }[] = [];

          if (item.tradeItems && item.tradeItems.length > 0) {
             finalItems = item.tradeItems;
          } else if (item.marketName) {
             finalItems = [{ marketName: item.marketName }];
          }

          if (finalItems.length === 0) {
             console.warn("Item has no tradeItems or marketName:", item.id);
             continue;
          }

          for (const tradeItem of finalItems) {
            const itemName = tradeItem.marketName;
            if (!itemName) continue;

            console.log("Processing item match:", itemName, tradeValue);

            await processItemMatch(
              {
                tradeValue,
                itemName,
                itemId: item.id,
                markup: item.markupPercent,
              },
              targetItems,
              this.processedItems,
              telegramConfig,
              range,
            );
          }
        }

        hasNextPage = trades.pageInfo?.hasNextPage;
        cursor = trades.pageInfo?.endCursor;

        if (hasNextPage) {
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
