import { useState, useCallback, useRef } from "react";
import { aiChatApi, aiChatWithPhotoApi, SuggestedProduct } from "../api/ai-care.api";

export interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  time: string;
  attachment?: string;
  products?: SuggestedProduct[];
  identifiedPlant?: string | null;
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function useAiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionUuid = useRef<string | null>(null);

  const sendMessage = useCallback(async (text: string, file?: File | null) => {
    if (!text.trim() && !file) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: text || "(photo attached)",
      time: nowTime(),
      attachment: file?.name,
    };
    setMessages((p) => [...p, userMsg]);
    setSending(true);
    setError(null);

    try {
      let data;
      if (file) {
        data = await aiChatWithPhotoApi(file, text || "What plant is this?", sessionUuid.current);
        sessionUuid.current = data.session_uuid;
      } else {
        data = await aiChatApi(text, sessionUuid.current);
        sessionUuid.current = data.session_uuid;
      }

      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: data.reply,
        time: nowTime(),
        products: data.suggested_products?.length ? data.suggested_products : undefined,
        identifiedPlant: (data as any).identified_plant ?? null,
      };
      setMessages((p) => [...p, aiMsg]);
    } catch (err: any) {
      const errText = err?.response?.data?.detail ?? "Something went wrong. Please try again.";
      setError(errText);
      const errMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: `⚠️ ${errText}`,
        time: nowTime(),
      };
      setMessages((p) => [...p, errMsg]);
    } finally {
      setSending(false);
    }
  }, []);

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
    sessionUuid.current = null;
  }, []);

  return { messages, sending, error, sessionUuid: sessionUuid.current, sendMessage, reset };
}
