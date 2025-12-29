import { crawler } from './crawler/engine';

console.log('Background Service Worker Loaded');

// Start crawling on startup
chrome.runtime.onStartup.addListener(() => {
    console.log('Extension started, initializing crawler...');
    crawler.start();
});

// Also start immediately when installed/reloaded
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed/updated, initializing crawler...');
    crawler.start();
});

// Listen for messages if we add UI controls later
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.command === 'start_crawling') {
        crawler.start();
        sendResponse({ status: 'started' });
    } else if (message.command === 'stop_crawling') {
        crawler.stop();
        sendResponse({ status: 'stopping' });
    }
});
