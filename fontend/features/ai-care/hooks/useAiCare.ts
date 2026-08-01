"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useRef } from "react";
import {
  getMyPlantsForAiApi,
  getPlantAiContextApi,
  aiCareChatApi,
  saveAiGuideApi,
  resolveCareGuideApi,
  rateAiSessionApi,
  ChatMessage,
  UserPlantSummary,
} from "../api/ai-care.api";

// ── 1. Plants dropdown hook ────────────────────────────────────────────
export function useMyPlantsForAi() {
  return useQuery({
    queryKey:  ["ai-care-plants"],
    queryFn:   getMyPlantsForAiApi,
    staleTime: 2 * 60 * 1000,
    select:    (data) => data.plants,
  });
}

// ── 2. Plant context hook (fires when plant selected) ──────────────────
export function usePlantAiContext(plantId: number | null) {
  return useQuery({
    queryKey: ["ai-care-plant-context", plantId],
    queryFn:  () => getPlantAiContextApi(plantId!),
    enabled:  !!plantId,
    staleTime: 60 * 1000,
  });
}

// ── 3. Main AI chat hook ───────────────────────────────────────────────
export function useAiCareChat() {
  const qc = useQueryClient();

  const [sessionUuid,     setSessionUuid]     = useState<string | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [messages,        setMessages]        = useState<ChatMessage[]>([]);
  const [isTyping,        setIsTyping]        = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  // Select a plant — resets chat for new context
  const selectPlant = useCallback((plant: UserPlantSummary | null) => {
    setSelectedPlantId(plant?.id ?? null);
    setSessionUuid(null);
    setMessages(
      plant
        ? [{
            role:      "assistant",
            content:   `Hi! I can see you've selected **${plant.nickname || plant.plantName}** 🌿\n\nI have full access to its care history, notes, and health status. What would you like to know?`,
            timestamp: new Date(),
          }]
        : []
    );
  }, []);

  // Send a message
  const sendMutation = useMutation({
    mutationFn: (data: { message: string; photo?: File }) =>
      aiCareChatApi({
        message:     data.message,
        sessionUuid: sessionUuid,
        plantId:     selectedPlantId,
        photo:       data.photo,
      }),

    onMutate: ({ message }) => {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: message, timestamp: new Date() },
      ]);
      setIsTyping(true);
      scrollToBottom();
    },

    onSuccess: (data) => {
      if (!sessionUuid) setSessionUuid(data.sessionUuid);

      setMessages((prev) => [
        ...prev,
        {
          role:              "assistant",
          content:           data.response,
          suggestedProducts: data.suggestedProducts,
          savedGuide:        data.savedGuide,
          timestamp:         new Date(),
        },
      ]);

      if (data.savedGuide && selectedPlantId) {
        qc.invalidateQueries({ queryKey: ["ai-care-plant-context", selectedPlantId] });
      }

      setIsTyping(false);
      scrollToBottom();
    },

    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role:      "assistant",
          content:   "Sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    },
  });

  // Manually save a message to care guide
  const saveGuideMutation = useMutation({
    mutationFn: (data: {
      messageContent: string;
      category:       string;
      title:          string;
      severity:       string;
    }) => {
      if (!sessionUuid || !selectedPlantId) {
        throw new Error("No active session or plant selected.");
      }
      return saveAiGuideApi(sessionUuid, {
        plantId:        selectedPlantId,
        messageContent: data.messageContent,
        category:       data.category,
        title:          data.title,
        severity:       data.severity,
      });
    },
    onSuccess: () => {
      if (selectedPlantId) {
        qc.invalidateQueries({ queryKey: ["ai-care-plant-context", selectedPlantId] });
      }
    },
  });

  // Rate session
  const rateMutation = useMutation({
    mutationFn: (rating: "helpful" | "not_helpful") => {
      if (!sessionUuid) throw new Error("No active session.");
      return rateAiSessionApi(sessionUuid, rating);
    },
  });

  return {
    sessionUuid,
    selectedPlantId,
    messages,
    isTyping,
    bottomRef,
    selectPlant,
    sendMessage:      (message: string, photo?: File) => sendMutation.mutate({ message, photo }),
    saveToGuide:      saveGuideMutation.mutate,
    rateSession:      rateMutation.mutate,
    isSending:        sendMutation.isPending,
    isSavingGuide:    saveGuideMutation.isPending,
    sendError:        sendMutation.error,
    saveGuideSuccess: saveGuideMutation.isSuccess,
  };
}

// ── 4. Resolve care guide hook ─────────────────────────────────────────
export function useResolveCareGuide(plantId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ guideId, note }: { guideId: number; note?: string }) =>
      resolveCareGuideApi(guideId, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai-care-plant-context", plantId] });
    },
  });
}
