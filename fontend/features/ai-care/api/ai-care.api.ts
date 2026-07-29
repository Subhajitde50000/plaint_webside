import { api } from "@/lib/axios";

export interface SuggestedProduct {
  id: string;       // uuid
  name: string;
  price: number;
  image_url?: string;
  slug?: string;
}

export interface ChatResponse {
  session_uuid: string;
  reply: string;
  suggested_products: SuggestedProduct[];
}

export interface PhotoChatResponse extends ChatResponse {
  identified_plant: string | null;
  confidence: number | null;
}

/** POST /ai-care/chat  — text message */
export const aiChatApi = async (
  message: string,
  sessionUuid?: string | null,
): Promise<ChatResponse> => {
  const params: Record<string, string> = { message };
  if (sessionUuid) params.session_uuid = sessionUuid;
  const res = await api.post("/ai-care/chat", null, { params });
  return res.data;
};

/** POST /ai-care/chat/photo  — message + photo file */
export const aiChatWithPhotoApi = async (
  file: File,
  message = "What plant is this?",
  sessionUuid?: string | null,
): Promise<PhotoChatResponse> => {
  const form = new FormData();
  form.append("photo", file);
  form.append("message", message);
  if (sessionUuid) form.append("session_uuid", sessionUuid);
  const res = await api.post("/ai-care/chat/photo", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/** POST /ai-care/sessions/{uuid}/rate */
export const rateSessionApi = async (
  sessionUuid: string,
  rating: "helpful" | "not_helpful",
): Promise<void> => {
  await api.post(`/ai-care/sessions/${sessionUuid}/rate`, null, {
    params: { rating },
  });
};
