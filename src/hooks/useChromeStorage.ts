import { useEffect, useState } from "react";

import { storageHelper } from "@/storage_helper";

import type {
  AppState,
  Intervals,
  Language,
  PriceRange,
  SaveStatus,
  TargetItem,
  TelegramConfig,
} from "@/types";
import {
  mockIntervals,
  mockPriceRanges,
  mockTargetItems,
  mockTelegramConfig,
} from "@/mocks/data";

export const useChromeStorage = () => {
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
  const [intervals, setIntervals] = useState<Intervals>({
    rangeInterval: 10,
    batchInterval: 10,
    cycleDelay: 1.1,
  });
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>({
    botToken: "",
    chatId: "",
  });
  const [targetItems, setTargetItems] = useState<TargetItem[]>([]);
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const loadData = async () => {
      try {
        if (import.meta.env.VITE_USE_MOCK_DATA === "true") {
           console.log("Mock Mode Active: Loading mock data...");
           setPriceRanges(mockPriceRanges);
           setIntervals(mockIntervals);
           setTelegramConfig(mockTelegramConfig);
           setTargetItems(mockTargetItems);
           setLanguage("en");
           setLoading(false);
           return;
        }

        const data = await storageHelper.get([
          "priceRanges",
          "intervals",
          "telegramConfig",
          "targetItems",
          "language",
        ]);
        if (data.priceRanges) setPriceRanges(data.priceRanges);
        if (data.intervals) setIntervals(data.intervals);
        if (data.telegramConfig) setTelegramConfig(data.telegramConfig);
        if (data.targetItems) setTargetItems(data.targetItems);
        if (data.language) setLanguage(data.language);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const saveSettings = async (onSuccess?: () => void) => {
    setSaveStatus("saving");
    try {
      const state: AppState = {
        priceRanges,
        intervals,
        telegramConfig,
        targetItems,
        language,
      };
      await storageHelper.set(state);
      
      if (onSuccess) {
        onSuccess();
      }

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveStatus("error");
    }
  };

  return {
    loading,
    saveStatus,
    priceRanges,
    setPriceRanges,
    intervals,
    setIntervals,
    telegramConfig,
    setTelegramConfig,
    targetItems,
    setTargetItems,
    language,
    setLanguage,
    saveSettings,
  };
};
