import type { TargetItem } from "@/types";
import type { BatchAlertItem } from "@/notifier/telegram";

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
  range: { min: number; max: number },
): Promise<BatchAlertItem | null> => {
  const trackedPrice = ctx.tradeValue;
  // Use unified helper for boolean check
  const isMatch = isItemMatch(ctx.itemName, trackedPrice, targetItems);
  
  // Find specific target for notification logic
  const targetMatch = targetItems.find(
    (t) =>
      t.isActive &&
      t.name.trim().toLowerCase() === ctx.itemName.trim().toLowerCase(),
  );

  // Broadcast to UI - Always send to UI for "Live Feed" visibility
  try {
    console.log("Broadcasting ITEM_SCANNED:", ctx.itemName);
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
    // Ignore extensions context invalidated errors
  }

  // Deduplication for ALERTS and LOGIC
  if (processedItems.has(ctx.itemId)) return null;

  if (isMatch && targetMatch) {
    processedItems.add(ctx.itemId);

    // Update Target Item Status in Storage
    try {
      const { storageHelper } = await import("@/storage_helper");
      const currentData = await storageHelper.get(["targetItems"]);
      if (currentData.targetItems) {
        const updatedTargets = currentData.targetItems.map((t: TargetItem) => {
          if (t.id === targetMatch.id) {
            return {
              ...t,
              lastMatchTime: new Date().toISOString(),
              matchCount: (t.matchCount || 0) + 1,
            };
          }
          return t;
        });
        await storageHelper.set({ targetItems: updatedTargets });
      }
    } catch (err) {
      console.error("Failed to update target status:", err);
    }
    
    // Return match details for batching
    return {
        id: ctx.itemId,
        name: ctx.itemName,
        price: trackedPrice,
        markup: ctx.markup,
        targetPrice: targetMatch.targetPrice,
        withdrawLink: `https://csgoroll.com/en/withdraw/crypto/csgo?search=${encodeURIComponent(ctx.itemName)}`
    };

  } else {
    // General range tracking
    if (trackedPrice >= range.min && trackedPrice <= range.max) {
      processedItems.add(ctx.itemId);
    }
  }
  
  return null;
};
