import { crawler } from "@/crawler";
import { CRAWLER_COMMANDS } from "@/constants";

console.log("Background Service Worker Loaded");

chrome.runtime.onStartup.addListener(() => {
  console.log("Extension started, initializing crawler...");
  crawler.start();
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed/updated, initializing crawler...");
  crawler.start();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.command === CRAWLER_COMMANDS.START) {
    console.log("Starting crawler...");
    crawler.start();
    sendResponse({ status: "started" });
  } else if (message.command === CRAWLER_COMMANDS.STOP) {
    console.log("Stopping crawler...");
    crawler.stop();
    sendResponse({ status: "stopped" });
  }
  return true;
});

chrome.action.onClicked.addListener(async () => {
  const url = chrome.runtime.getURL("index.html");
  const tabs = await chrome.tabs.query({ url: url });

  if (tabs.length > 0 && tabs[0].id) {
    chrome.tabs.update(tabs[0].id, { active: true });
    if (tabs[0].windowId) {
      chrome.windows.update(tabs[0].windowId, { focused: true });
    }
  } else {
    chrome.tabs.create({ url });
  }
});
