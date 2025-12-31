import { CheckCircle, Loader2, Send, XCircle, Play } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { useTestBotToken, useTestChatId } from "@/hooks";
import type { TelegramConfig as ITelegramConfig } from "@/types";
import { cn } from "@/utils";

interface Props {
  config: ITelegramConfig;
  setConfig: React.Dispatch<React.SetStateAction<ITelegramConfig>>;
}

export const TelegramConfig: React.FC<Props> = ({ config, setConfig }) => {
  const { t } = useTranslation();

  // State for Bot Token Test
  const [botTokenError, setBotTokenError] = useState<string>("");
  const {
    mutate: testBotToken,
    isPending: isBotTokenPending,
    isSuccess: isBotTokenSuccess,
    isError: isBotTokenError,
  } = useTestBotToken();

  // State for Chat ID Test
  const [chatIdError, setChatIdError] = useState<string>("");
  const {
    mutate: testChatId,
    isPending: isChatIdPending,
    isSuccess: isChatIdSuccess,
    isError: isChatIdError,
  } = useTestChatId();

  const handleChange = (field: keyof ITelegramConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user types
    if (field === "botToken") {
      setBotTokenError("");
    }
    if (field === "chatId") {
      setChatIdError("");
    }
  };

  const handleTestBotToken = () => {
    setBotTokenError("");
    testBotToken(config.botToken, {
      onError: (error) => {
        const errorMap: Record<string, string> = {
          bot_token_required: "settings.bot_token_required",
          network_error: "settings.network_error",
          failed_to_connect: "settings.failed_to_connect",
        };
        const translationKey = errorMap[error.message];
        setBotTokenError(translationKey ? t(translationKey) : error.message);
      },
    });
  };

  const handleTestChatId = () => {
    setChatIdError("");
    testChatId(
      { botToken: config.botToken, chatId: config.chatId },
      {
        onError: (error) => {
          const errorMap: Record<string, string> = {
            bot_token_required: "settings.bot_token_required",
            chat_id_required: "settings.chat_id_required",
            network_error: "settings.network_error",
            failed_to_connect: "settings.failed_to_connect",
          };
          const translationKey = errorMap[error.message];
          setChatIdError(translationKey ? t(translationKey) : error.message);
        },
      }
    );
  };

  const isBotTokenValid = isBotTokenSuccess && !botTokenError;
  const isBotTokenInvalid = isBotTokenError || botTokenError;

  const isChatIdValid = isChatIdSuccess && !chatIdError;
  const isChatIdInvalid = isChatIdError || chatIdError;

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div className="flex items-center gap-2 mb-4">
        <Send className="text-cyan-500" size={18} />
        <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
          {t("settings.tg_config")}
        </h2>
      </div>

      <div className="space-y-4">
        {/* Bot Token Input Group */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">
            {t("settings.bot_token")}
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="password"
                value={config.botToken}
                onChange={(e) => handleChange("botToken", e.target.value)}
                placeholder="123456789:ABCdef..."
                className={cn(
                  "w-full px-3 py-2 bg-slate-900 border rounded-md text-slate-200 text-sm focus:outline-none transition-all font-mono",
                  {
                    "border-rose-500 focus:border-rose-500": isBotTokenInvalid,
                    "border-emerald-500 focus:border-emerald-500":
                      isBotTokenValid,
                    "border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500":
                      !isBotTokenInvalid && !isBotTokenValid,
                  }
                )}
              />
            </div>
            <button
              onClick={handleTestBotToken}
              disabled={isBotTokenPending}
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-md transition disabled:opacity-50",
                {
                  "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20":
                    isBotTokenValid,
                  "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20":
                    isBotTokenInvalid,
                  "bg-cyan-600 text-white hover:bg-cyan-500":
                    !isBotTokenValid && !isBotTokenInvalid,
                }
              )}
              title={t("settings.test_connection")}
            >
              {isBotTokenPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : isBotTokenValid ? (
                <CheckCircle size={18} />
              ) : isBotTokenInvalid ? (
                <XCircle size={18} />
              ) : (
                <Play size={16} fill="currentColor" />
              )}
            </button>
          </div>
          {isBotTokenInvalid && (
            <p className="text-xs text-rose-500 mt-1">{botTokenError}</p>
          )}
        </div>

        {/* Chat ID Input Group */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">
            {t("settings.chat_id")}
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={config.chatId}
                onChange={(e) => handleChange("chatId", e.target.value)}
                placeholder="-100123456789"
                className={cn(
                  "w-full px-3 py-2 bg-slate-900 border rounded-md text-slate-200 text-sm focus:outline-none transition-all font-mono",
                  {
                    "border-rose-500 focus:border-rose-500": isChatIdInvalid,
                    "border-emerald-500 focus:border-emerald-500":
                      isChatIdValid,
                    "border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500":
                      !isChatIdInvalid && !isChatIdValid,
                  }
                )}
              />
            </div>
            <button
              onClick={handleTestChatId}
              disabled={isChatIdPending}
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-md transition disabled:opacity-50",
                {
                  "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20":
                    isChatIdValid,
                  "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20":
                    isChatIdInvalid,
                  "bg-cyan-600 text-white hover:bg-cyan-500":
                    !isChatIdValid && !isChatIdInvalid,
                }
              )}
              title="Test Chat ID"
            >
              {isChatIdPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : isChatIdValid ? (
                <CheckCircle size={18} />
              ) : isChatIdInvalid ? (
                <XCircle size={18} />
              ) : (
                <Play size={16} fill="currentColor" />
              )}
            </button>
          </div>
          {(isChatIdError || chatIdError) && (
            <p className="text-xs text-rose-500 mt-1">{chatIdError}</p>
          )}
          {isChatIdSuccess && !chatIdError && (
            <p className="text-xs text-emerald-400 mt-1">
              {t("settings.test_message_sent")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
