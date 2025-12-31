import type { TargetItem, TelegramConfig } from "@/types";
import { sendTelegramAlert } from "@/notifier/telegram";

export interface MatchContext {
  tradeValue: number;
  itemName: string;
  itemId: string;
  markup: number;
}

/**
 * Unified matching logic: EXACT name match (case-insensitive) + Price check
 */
export const isItemMatch = (
  itemName: string,
  price: number,
  targetItems: TargetItem[],
): boolean => {
  return targetItems.some(
    (target) =>
      target.isActive &&
      target.name.trim().toLowerCase() === itemName.trim().toLowerCase() &&
      price <= target.targetPrice,
  );
};

export const processItemMatch = async (
  ctx: MatchContext,
  targetItems: TargetItem[],
  processedItems: Set<string>,
  telegramConfig: TelegramConfig,
  range: { min: number; max: number },
) => {
  // Deduplication
  if (processedItems.has(ctx.itemId)) return;

  const trackedPrice = ctx.tradeValue;
  // Use unified helper for boolean check
  const isMatch = isItemMatch(ctx.itemName, trackedPrice, targetItems);
  
  // Find specific target for notification logic
  const targetMatch = targetItems.find(
    (t) =>
      t.isActive &&
      t.name.trim().toLowerCase() === ctx.itemName.trim().toLowerCase(),
  );

  // Broadcast to UI
  try {
    chrome.runtime.sendMessage(
      {
        type: "ITEM_SCANNED",
        payload: {
          id: ctx.itemId,
          name: ctx.itemName,
          price: trackedPrice,
          markup: ctx.markup,
          timestamp: new Date().toISOString(),
          isTarget: isMatch,
        },
      },
      () => {
        // Suppress "Receiving end does not exist" error when popup is closed
        if (chrome.runtime.lastError) {
          // ignore
        }
      },
    );
  } catch {
    // Ignore extension context invalidated errors
  }

  if (isMatch && targetMatch) {
    processedItems.add(ctx.itemId);

    const alertItem = {
      id: ctx.itemId,
      price: trackedPrice,
      markup: ctx.markup,
      assets: [{ name: ctx.itemName }],
    };

    await sendTelegramAlert(alertItem, telegramConfig, {
      type: "TARGET",
      targetPrice: targetMatch.targetPrice,
    });
  } else {
    // General range tracking
    if (trackedPrice >= range.min && trackedPrice <= range.max) {
      processedItems.add(ctx.itemId);
    }
  }
};
