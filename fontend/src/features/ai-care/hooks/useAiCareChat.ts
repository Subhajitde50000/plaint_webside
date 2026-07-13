import { useState } from "react";
import { useMutation as useRQMutation } from "@tanstack/react-query";
import { aiCareChatApi } from "../api/ai-care.api";
import { getErrorMessage } from "@/lib/errors";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  suggestedProducts?: any[];
  plantIdentified?: string;
  plantConfidence?: number;
  timestamp: Date;
}

export function useAiCareChat() {
  const [sessionUuid, setSessionUuid] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const mutation = useRQMutation({
    mutationFn: aiCareChatApi,
    onSuccess: (data, variables) => {
      // Save session UUID from first response
      if (!sessionUuid) setSessionUuid(data.session_uuid);

      // Add user message + AI response to local chat state
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: variables.message,
          timestamp: new Date(),
        },
        {
          role: "assistant",
          content: data.response,
          suggestedProducts: data.suggested_products,
          plantIdentified: data.plant_identified,
          plantConfidence: data.plant_confidence,
          timestamp: new Date(),
        },
      ]);
    },
  });

  return {
    messages,
    sessionUuid,
    sendMessage: (message: string, photo?: File) =>
      mutation.mutate({
        message,
        sessionUuid: sessionUuid ?? undefined,
        photo,
      }),
    isLoading: mutation.isPending,
    error: (mutation.error as any)?.response?.data?.detail as
      | string
      | undefined,
    clearChat: () => {
      setMessages([]);
      setSessionUuid(null);
    },
  };
}
