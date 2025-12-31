import { crawler } from "@/crawler";

console.log("Background Service Worker Loaded");

// Start crawling on startup
chrome.runtime.onStartup.addListener(() => {
  console.log("Extension started, initializing crawler...");
  crawler.start();
});

// Also start immediately when installed/reloaded
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed/updated, initializing crawler...");
  crawler.start();
});

// Listen for messages from UI
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // Legacy support or future commands
  if (message.command === "START_CRAWLER") {
    crawler.start();
    sendResponse({ status: "started" });
  } else if (message.command === "STOP_CRAWLER") {
    crawler.stop();
    sendResponse({ status: "stopped" });
  }
  return true;
});

// Open Dashboard on Icon Click
chrome.action.onClicked.addListener(async () => {
  const url = chrome.runtime.getURL("index.html");
  const tabs = await chrome.tabs.query({ url: url });

  if (tabs.length > 0 && tabs[0].id) {
    // Tab exists, focus it
    chrome.tabs.update(tabs[0].id, { active: true });
    if (tabs[0].windowId) {
      chrome.windows.update(tabs[0].windowId, { focused: true });
    }
  } else {
    // Create new tab
    chrome.tabs.create({ url });
  }
});
