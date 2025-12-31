import { useQuery } from "@tanstack/react-query";
import { useConfigStore } from "@/store/useConfigStore";
import { fetchWithdrawItems } from "@/api/withdrawApi";
import { useEffect, useRef } from "react";
import type { LiveItem } from "@/types";
import { isItemMatch } from "@/crawler";

export const useWithdrawQuery = () => {
  const isCrawling = useConfigStore((state) => state.isCrawling);
  const intervals = useConfigStore((state) => state.intervals);
  const addLiveResult = useConfigStore((state) => state.addLiveResult);
  const setLogs = useConfigStore((state) => state.setLogs);
  const targetItems = useConfigStore((state) => state.targetItems);

  // Keep track of processed item IDs to avoid duplicates/re-processing
  const processedIds = useRef<Set<string>>(new Set());

  const { data, error, isError } = useQuery({
    queryKey: ["withdraw", "poll"],
    queryFn: async ({ signal }) => {
      // Default crawling range: $0.50 to $2000.00
      // Pass signal for auto-cancellation
      return fetchWithdrawItems({ minPrice: 0.5, maxPrice: 2000, signal });
    },
    enabled: isCrawling,
    refetchInterval: isCrawling ? intervals.batchInterval * 1000 : false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 0, // Data is immediately stale
    gcTime: 0, // Do not cache garbage collected data (formerly cacheTime)
    // select gets called on every render if data is fresh, so perform transformation
  });

  // Side Effect: Sync with Store and Process Alerts
  useEffect(() => {
    if (data && data.edges) {
      let newCount = 0;
      const newItems: LiveItem[] = [];

      data.edges.forEach((edge: any) => {
        const node = edge.node;
        // Only process if not seen before (simple dedup)
        if (!processedIds.current.has(node.id)) {
          processedIds.current.add(node.id);
          // Cleanup old IDs to prevent memory leak
          if (processedIds.current.size > 1000) {
            const first = processedIds.current.values().next().value;
            if (first) processedIds.current.delete(first);
          }

          const price = node.price.amount;
          const markup = node.markup;

          // Check against Target List using unified logic
          const isMatch = isItemMatch(node.marketName, price, targetItems);

          const liveItem: LiveItem = {
            id: node.id,
            name: node.marketName,
            price: price,
            markup: markup,
            isMatch: isMatch,
            timestamp: new Date().toISOString(),
          };

          newItems.push(liveItem);
          addLiveResult(liveItem);
          newCount++;

          // Log critical matches
          if (isMatch) {
            setLogs(`🎯 MATCH FOUND: ${liveItem.name} @ $${liveItem.price}`);
            // TODO: Trigger Notification here or via store listener
          }
        }
      });

      if (newCount > 0) {
        // Optional: Log batch summary
        // setLogs(`Crawled ${newCount} new items.`);
      }
    }
  }, [data, addLiveResult, targetItems, setLogs]);

  // Error Logging
  useEffect(() => {
    if (isError && error) {
      const msg =
        error.message === "RATE_LIMIT_HIT"
          ? "⛔ RATE LIMIT HIT: Pausing..."
          : `❌ API Error: ${error.message}`;
      setLogs(msg);
    }
  }, [isError, error, setLogs]);

  return { data, isCrawling };
};
