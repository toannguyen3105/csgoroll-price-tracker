import React, { useState } from 'react';
import type { TelegramConfig as ITelegramConfig } from '../types';
import { Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface Props {
    config: ITelegramConfig;
    setConfig: React.Dispatch<React.SetStateAction<ITelegramConfig>>;
}

export const TelegramConfig: React.FC<Props> = ({ config, setConfig }) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleChange = (field: keyof ITelegramConfig, value: string) => {
        setConfig(prev => ({ ...prev, [field]: value }));
        setStatus('idle');
    };

    const testConnection = async () => {
        if (!config.botToken) {
            setErrorMessage('Bot Token is required');
            setStatus('error');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch(`https://api.telegram.org/bot${config.botToken}/getMe`);
            const data = await response.json();

            if (data.ok) {
                setStatus('success');
            } else {
                setStatus('error');
                setErrorMessage(data.description || 'Failed to connect');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('Network error or invalid token format');
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <Send className="text-gray-500" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">Telegram Integration</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bot Token
                    </label>
                    <input
                        type="password"
                        value={config.botToken}
                        onChange={(e) => handleChange('botToken', e.target.value)}
                        placeholder="123456789:ABCdef..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chat ID
                    </label>
                    <input
                        type="text"
                        value={config.chatId}
                        onChange={(e) => handleChange('chatId', e.target.value)}
                        placeholder="-100123456789"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                <div className="flex items-center gap-4 mt-2">
                    <button
                        onClick={testConnection}
                        disabled={status === 'loading'}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {status === 'loading' ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                        Test Connection
                    </button>

                    {status === 'success' && (
                        <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                            <CheckCircle size={16} /> Connected as Bot
                        </span>
                    )}

                    {status === 'error' && (
                        <span className="flex items-center gap-1 text-sm text-red-600 font-medium">
                            <XCircle size={16} /> {errorMessage}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
