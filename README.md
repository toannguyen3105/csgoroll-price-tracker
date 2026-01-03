# CSGORoll Price Tracker Crawler

This is a Chrome Extension designed to crawl and track item prices on [CSGORoll](https://www.csgoroll.com/). It allows users to set up price ranges and target items, and sends notifications via a Telegram Bot when a matching item is found.

## Features

- **Automated Crawling**: Continuously scrapes the CSGORoll "Withdraw" marketplace for new trades.
- **Price Range Configuration**: Define specific price ranges (Min/Max) to scan for.
- **Target Item Watchlist**: Specify item names to watch for.
- **Telegram Notifications**: Sends real-time alerts to a configured Telegram Chat when a target item is found within the specified price range.
- **Customizable Intervals**: Adjust scanning intervals and batch delays to manage rate limits.
- **Dashboard UI**: A user-friendly React-based dashboard to manage settings, view logs, and control the crawler.

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/) with [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)

## Project Structure

```
src/
├── api/             # API definitions
├── assets/          # Static assets
├── components/      # React UI components
├── constants/       # App constants
├── crawler/         # Core Crawler Logic
│   ├── engine.ts       # Main crawling loop
│   ├── api.ts          # CSGORoll GraphQL API interaction
│   └── itemMatcher.ts  # Logic to match items against targets
├── hooks/           # Custom React Hooks
├── notifier/        # Notification services (Telegram)
├── utils/           # Utility functions
├── background.ts    # Chrome Extension Service Worker (Entry point for crawler)
├── content.ts       # Content scripts (if any)
└── App.tsx          # Main Dashboard UI
```

## Installation & Development

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

### Setup

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

### Development Mode

To run in development mode with HMR (Hot Module Replacement):

```bash
pnpm dev
```

This will generate a `dist` folder. You can load this folder as an "Unpacked Extension" in Chrome.

### Building for Production

To build the extension for production:

```bash
pnpm build
```

This creates an optimized build in the `dist` directory.

## Loading into Chrome

1.  Open Chrome and navigate to `chrome://extensions/`.
2.  Enable **Developer mode** in the top-right corner.
3.  Click **Load unpacked**.
4.  Select the `dist` directory created by the build command.

## Configuration

Once installed:

1.  Click the extension icon to open the Dashboard.
2.  **Settings Tab**:
    - **Telegram Config**: Enter your Bot Token and Chat ID.
    - **Intervals**: Configure crawl speed (Range Interval, Batch Interval, Cycle Delay).
    - **Price Ranges**: Add price ranges (Min/Max) you want to scan.
3.  **Target Items Tab**:
    - Add item names you are looking for (e.g., "AWP | Asiimov").
4.  The crawler runs in the background. Check the logs/status in the dashboard.
