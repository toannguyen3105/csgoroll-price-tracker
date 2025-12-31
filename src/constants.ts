export const CRAWLER_COMMANDS = {
  START: "START_CRAWLER",
  STOP: "STOP_CRAWLER",
} as const;

export type CrawlerCommand = (typeof CRAWLER_COMMANDS)[keyof typeof CRAWLER_COMMANDS];
