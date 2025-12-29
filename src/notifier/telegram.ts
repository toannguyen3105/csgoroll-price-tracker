import type { TelegramConfig } from '../types';

interface TradeItem {
    id: string;
    price: number;
    markup?: number;
    assets?: { name: string }[];
}

interface AlertOptions {
    type: 'GENERIC' | 'TARGET';
    targetPrice?: number;
}

export const sendTelegramAlert = async (item: TradeItem, config: TelegramConfig, options: AlertOptions = { type: 'GENERIC' }) => {
    if (!config.botToken || !config.chatId) {
        console.warn('Telegram alerts cached: Missing configuration.');
        return;
    }

    const name = item.assets?.[0]?.name || 'Unknown Item';
    const price = item.price.toFixed(2);
    const markup = item.markup ? item.markup.toFixed(2) : 'N/A';
    const encodedName = encodeURIComponent(name);
    const withdrawLink = `https://csgoroll.com/en/withdraw/crypto/csgo?search=${encodedName}`;

    let message = '';

    if (options.type === 'TARGET') {
        const targetPrice = options.targetPrice ? options.targetPrice.toFixed(2) : 'N/A';
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
        const response = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: config.chatId,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Telegram API Error:', errorData);
        }
    } catch (error) {
        console.error('Failed to send Telegram alert:', error);
    }
};
