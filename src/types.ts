export interface PriceRange {
  id: string;
  min: number;
  max: number;
}

export interface Intervals {
  rangeInterval: number; // seconds
  batchInterval: number; // seconds
  cycleDelay: number; // minutes
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export interface TargetItem {
  id: string;
  name: string;
  targetPrice: number;
  isActive: boolean;
  enabled?: boolean; // legacy support
  price?: number; // legacy support
  createdAt?: number;
}

export interface LogItem {
  id: string;
  name: string;
  price: number;
  markup?: number;
  timestamp: number;
  isTarget: boolean;
}

export interface AppState {
  priceRanges: PriceRange[];
  intervals: Intervals;
  telegramConfig: TelegramConfig;
  targetItems: TargetItem[];
}

export type AppTab = "settings" | "monitor";

export type SaveStatus = "idle" | "saving" | "success" | "error";

export interface LogEntry {
  id: string;
  level: "info" | "success" | "warning" | "error";
  message: string;
  timestamp: string;
}

export type Language = "en" | "vi";

export interface LiveItem {
  id: string;
  name: string;
  price: number;
  markup: number;
  isMatch: boolean;
  timestamp: string;
}

export interface ScannedItemPayload {
  id?: string;
  name?: string;
  price?: number | string;
  markup?: number | string;
  isTarget?: boolean;
  timestamp?: string;
}

export interface ItemScannedMessage {
  type: "ITEM_SCANNED";
  payload: ScannedItemPayload;
}

export type RuntimeMessage = ItemScannedMessage;
