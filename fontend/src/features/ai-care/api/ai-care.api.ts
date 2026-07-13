import { api } from "@/lib/axios";

// ─── AI Care Chat ─────────────────────────────────────────────────────────────

export const aiCareChatApi = async (data: {
  message: string;
  sessionUuid?: string;
  photo?: File;
}) => {
  const form = new FormData();
  form.append("message", data.message);
  if (data.sessionUuid) form.append("session_uuid", data.sessionUuid);
  if (data.photo) form.append("photo", data.photo);

  const res = await api.post("/ai-care/chat", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // Returns: { session_uuid, response, plant_identified, plant_confidence, suggested_products }
  return res.data;
};

// ─── Rate AI Session ──────────────────────────────────────────────────────────

export const rateAiSessionApi = async (
  sessionUuid: string,
  rating: "helpful" | "not_helpful"
) => {
  const res = await api.post(`/ai-care/sessions/${sessionUuid}/rate`, {
    rating,
  });
  return res.data;
};
