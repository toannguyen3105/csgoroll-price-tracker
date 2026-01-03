import { useEffect, useState } from "react";
import type { CrawlerStatus, RuntimeMessage } from "@/types";

export const useCrawlerStatus = () => {
  const [status, setStatus] = useState<CrawlerStatus>({
    isRunning: false,
    nextCycleTime: null,
    cycles: 0,
  });

  useEffect(() => {
    // Mock Mode Logic
    if (import.meta.env.VITE_USE_MOCK_DATA === "true") {
      const mockNextTime = Date.now() + 60000;
      
      setTimeout(() => {
        setStatus({
          isRunning: true,
          nextCycleTime: mockNextTime,
          cycles: 12,
        });
      }, 0);

      // Simulate cycle updates
      const interval = setInterval(() => {
        setStatus((prev) => ({
          ...prev,
          cycles: prev.cycles + 1,
        }));
      }, 5000); // Increment cycle every 5 seconds

      return () => clearInterval(interval);
    }

    // Real Mode Logic
    const handleMessage = (message: RuntimeMessage) => {
      if (message && message.type === "CRAWLER_STATUS") {
        setStatus(message.payload);
      }
    };

    if (
      typeof chrome !== "undefined" &&
      chrome.runtime &&
      chrome.runtime.onMessage
    ) {
      chrome.runtime.onMessage.addListener(handleMessage);
      
      // Request initial status ? 
      // Background worker might not send it unless we ask or it changes.
      // Ideally we should pull it or the background should broadcast on connect.
      // For now, we rely on the broadcast interval or change events.
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
  }, []);

  return status;
};
