import type { TelegramConfig } from "../types";

interface TradeItem {
  id: string;
  price: number;
  markup?: number;
  assets?: { name: string }[];
}

interface AlertOptions {
  type: "GENERIC" | "TARGET";
  targetPrice?: number;
}

export interface BatchAlertItem {
  id: string;
  name: string;
  price: number;
  markup: number;
  targetPrice: number;
  withdrawLink: string;
}

export const sendTelegramAlert = async (
  item: TradeItem,
  config: TelegramConfig,
  options: AlertOptions = { type: "GENERIC" },
) => {
  if (!config.botToken || !config.chatId) {
    console.warn("Telegram alerts cached: Missing configuration.");
    return;
  }

  const name = item.assets?.[0]?.name || "Unknown Item";
  const price = item.price.toFixed(2);
  const markup = item.markup ? item.markup.toFixed(2) : "N/A";
  const encodedName = encodeURIComponent(name);
  const withdrawLink = `https://csgoroll.com/en/withdraw/crypto/csgo?search=${encodedName}`;

  let message = "";

  if (options.type === "TARGET") {
    const targetPrice = options.targetPrice
      ? options.targetPrice.toFixed(2)
      : "N/A";
    message = `
<b>🎯 KÈO THƠM: ${name}</b>
- Giá Web: $${price}
- Mục tiêu: $${targetPrice}
- Markup: ${markup}%
<a href="${withdrawLink}">Mua ngay</a>
        `.trim();
  } else {
    message = `
<b>🚨 NEW ITEM FOUND!</b>
- Name: ${name}
- Price: $${price}
- Markup: ${markup}%
<a href="${withdrawLink}">View on Withdraw</a>
        `.trim();
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${config.botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: config.chatId,
          text: message,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram API Error:", JSON.stringify(errorData, null, 2));
    }
  } catch (error) {
    console.error("Failed to send Telegram alert:", error);
  }
};

export const sendBatchTelegramAlert = async (
  items: BatchAlertItem[],
  config: TelegramConfig,
) => {
  if (!config.botToken || !config.chatId || items.length === 0) return;

  const title = `<b>🎯 TÌM THẤY ${items.length} ITEM!</b>`;
  const lines = items.map((item, index) => {
    const price = item.price.toFixed(2);
    const target = item.targetPrice.toFixed(2);
    const markup = item.markup.toFixed(2);
    // Format: 1. [Name] - $Price (Target: $Target) - Markup%
    return `${index + 1}. <b>${item.name}</b> - $${price} (Target: $${target}) - ${markup}%`;
  });

  const message = `${title}\n${lines.join("\n")}`;

  try {
    await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
  } catch (error) {
    console.error("Failed to send batch Telegram alert:", error);
  }
};
