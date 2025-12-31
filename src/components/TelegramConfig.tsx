import React, { useState } from "react";
import type { TelegramConfig as ITelegramConfig } from "../types";
import { Send, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface Props {
  config: ITelegramConfig;
  setConfig: React.Dispatch<React.SetStateAction<ITelegramConfig>>;
}

export const TelegramConfig: React.FC<Props> = ({ config, setConfig }) => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (field: keyof ITelegramConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setStatus("idle");
  };

  const testConnection = async () => {
    if (!config.botToken) {
      setErrorMessage("Bot Token is required");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${config.botToken}/getMe`,
      );
      const data = await response.json();

      if (data.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.description || "Failed to connect");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Network error or invalid token format");
    }
  };

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div className="flex items-center gap-2 mb-4">
        <Send className="text-cyan-500" size={18} />
        <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
          Telegram Integration
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">
            Bot Token
          </label>
          <input
            type="password"
            value={config.botToken}
            onChange={(e) => handleChange("botToken", e.target.value)}
            placeholder="123456789:ABCdef..."
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-600 transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">
            Chat ID
          </label>
          <input
            type="text"
            value={config.chatId}
            onChange={(e) => handleChange("chatId", e.target.value)}
            placeholder="-100123456789"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-600 transition-all font-mono"
          />
        </div>

        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={testConnection}
            disabled={status === "loading"}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition disabled:opacity-50 shadow-[0_0_10px_rgba(8,145,178,0.3)] hover:shadow-[0_0_15px_rgba(8,145,178,0.5)]"
          >
            {status === "loading" ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <CheckCircle size={16} />
            )}
            TEST CONNECTION
          </button>

          {status === "success" && (
            <span className="flex items-center gap-1 text-sm text-emerald-400 font-medium animate-pulse">
              <CheckCircle size={16} /> Connected as Bot
            </span>
          )}

          {status === "error" && (
            <span className="flex items-center gap-1 text-sm text-rose-500 font-medium">
              <XCircle size={16} /> {errorMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
