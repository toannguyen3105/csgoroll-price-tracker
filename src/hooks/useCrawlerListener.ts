import { useEffect } from "react";

import { useConfigStore } from "@/store";
import type { LiveItem, RuntimeMessage } from "@/types";

export const useCrawlerListener = () => {
  const addLiveResult = useConfigStore((state) => state.addLiveResult);

  useEffect(() => {
    const handleMessage = (message: RuntimeMessage) => {
      if (message && message.type === "ITEM_SCANNED") {
        // Ensure payload matches LiveItem structure
        const payload = message.payload;

        // Construct LiveItem with safeguards
        const newItem: LiveItem = {
          id: payload.id || crypto.randomUUID(),
          name: payload.name || "Unknown Item",
          price: Number(payload.price) || 0,
          markup: Number(payload.markup) || 0,
          isMatch: !!payload.isTarget, // Map legacy isTarget to isMatch
          timestamp: payload.timestamp || new Date().toISOString(),
        };

        addLiveResult(newItem);
      }
    };

    // Safety check for Chrome Runtime
    if (
      typeof chrome !== "undefined" &&
      chrome.runtime &&
      chrome.runtime.onMessage
    ) {
      chrome.runtime.onMessage.addListener(handleMessage);
    }

    return () => {
      if (
        typeof chrome !== "undefined" &&
        chrome.runtime &&
        chrome.runtime.onMessage
      ) {
        chrome.runtime.onMessage.removeListener(handleMessage);
      }
    };
  }, [addLiveResult]);
};
