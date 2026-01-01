import { crawler } from "@/crawler";


console.log("Background Service Worker Loaded");

chrome.runtime.onStartup.addListener(() => {
  console.log("Extension started, initializing crawler...");
  crawler.start();
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed/updated, initializing crawler...");
  crawler.start();
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
