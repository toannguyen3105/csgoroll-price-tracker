import type { TargetItem, TelegramConfig } from '@/types';
import { sendTelegramAlert } from '@/notifier/telegram';

export interface MatchContext {
    tradeValue: number;
    itemName: string;
    itemId: string;
    markup: number;
}

export const processItemMatch = async (
    ctx: MatchContext,
    targetItems: TargetItem[],
    processedItems: Set<string>,
    telegramConfig: TelegramConfig,
    range: { min: number, max: number }
) => {
    // Deduplication
    if (processedItems.has(ctx.itemId)) return;

    const targetMatch = targetItems.find(t => t.name === ctx.itemName);
    const trackedPrice = ctx.tradeValue;

    // Broadcast to UI
    try {
        chrome.runtime.sendMessage({
            type: 'ITEM_SCANNED',
            payload: {
                id: ctx.itemId,
                name: ctx.itemName,
                price: trackedPrice,
                markup: ctx.markup,
                timestamp: Date.now(),
                isTarget: !!targetMatch
            }
        });
    } catch (err) {
        // Ignore extension context invalidated errors
    }

    if (targetMatch) {
        if (targetMatch.isActive && trackedPrice <= targetMatch.targetPrice) {
            processedItems.add(ctx.itemId);

            const alertItem = {
                id: ctx.itemId,
                price: trackedPrice,
                markup: ctx.markup,
                assets: [{ name: ctx.itemName }]
            };

            await sendTelegramAlert(alertItem, telegramConfig, { type: 'TARGET', targetPrice: targetMatch.targetPrice });
        }
    } else {
        if (trackedPrice >= range.min && trackedPrice <= range.max) {
            processedItems.add(ctx.itemId);
        }
    }
};
