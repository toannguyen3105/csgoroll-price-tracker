import { useMutation } from "@tanstack/react-query";

interface TelegramResponse {
  ok: boolean;
  description?: string;
  result?: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
  };
}

export const useTestBotToken = () => {
  return useMutation({
    mutationFn: async (botToken: string) => {
      if (!botToken) {
        throw new Error("bot_token_required");
      }

      try {
        const response = await fetch(
          `https://api.telegram.org/bot${botToken}/getMe`
        );
        const data: TelegramResponse = await response.json();

        if (!data.ok) {
          throw new Error(data.description || "failed_to_connect");
        }

        return data;
      } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.message === "bot_token_required") {
              throw error;
            }
            if (error.message && error.message !== "failed_to_connect" && !error.message.includes("fetch")) {
                 throw error;
            }
        }
        throw new Error("network_error");
      }
    },
  });
};

export const useTestChatId = () => {
  return useMutation({
    mutationFn: async ({ botToken, chatId }: { botToken: string; chatId: string }) => {
      if (!botToken) {
        throw new Error("bot_token_required");
      }
      if (!chatId) {
        throw new Error("chat_id_required");
      }

      try {
        const response = await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: "Test message from CSGORoll Price Tracker",
            }),
          }
        );
        const data: TelegramResponse = await response.json();

        if (!data.ok) {
          throw new Error(data.description || "failed_to_connect");
        }

        return data;
      } catch (error: unknown) {
         if (error instanceof Error) {
            if (error.message === "bot_token_required" || error.message === "chat_id_required") {
              throw error;
            }
            if (error.message && error.message !== "failed_to_connect" && !error.message.includes("fetch")) {
                 throw error;
            }
        }
        throw new Error("network_error");
      }
    },
  });
};
