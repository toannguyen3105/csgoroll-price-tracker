import type { Intervals, LiveItem, PriceRange, TargetItem, TelegramConfig } from "@/types";

export const mockPriceRanges: PriceRange[] = [
  { id: "1", min: 10, max: 100 },
  { id: "2", min: 200, max: 500 },
];

export const mockIntervals: Intervals = {
  rangeInterval: 5,
  batchInterval: 2,
  cycleDelay: 0.5,
};

export const mockTelegramConfig: TelegramConfig = {
  botToken: "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
  chatId: "987654321",
};

export const mockTargetItems: TargetItem[] = [
  {
    id: "t1",
    name: "AWP | Asiimov (Field-Tested)",
    targetPrice: 50.0,
    isActive: true,
    enabled: true,
    price: 50.0,
    createdAt: Date.now(),
    matchCount: 5,
    lastMatchTime: new Date().toISOString(),
  },
  {
    id: "t2",
    name: "AK-47 | Redline (Minimal Wear)",
    targetPrice: 25.5,
    isActive: false,
    enabled: false,
    price: 25.5,
    createdAt: Date.now() - 100000,
  },
];

export const mockLiveResults: LiveItem[] = [
  {
    id: "l1",
    name: "AWP | Asiimov (Field-Tested)",
    price: 45.0,
    markup: -10,
    isMatch: true,
    timestamp: new Date().toISOString(),
  },
  {
    id: "l2",
    name: "M4A4 | Howl (Factory New)",
    price: 5000.0,
    markup: 5,
    isMatch: false,
    timestamp: new Date(Date.now() - 5000).toISOString(),
  },
  {
    id: "l3",
    name: "Glock-18 | Fade (Factory New)",
    price: 1200.0,
    markup: 0,
    isMatch: false,
    timestamp: new Date(Date.now() - 10000).toISOString(),
  },
];
