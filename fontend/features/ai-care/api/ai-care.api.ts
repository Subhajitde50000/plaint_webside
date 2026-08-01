import { api } from "@/lib/axios";

// ── Types ──────────────────────────────────────────────────────────────

export interface UserPlantSummary {
  id:                   number;
  plantName:            string;
  nickname:             string | null;
  location:             string | null;
  photoUrl:             string | null;
  healthStatus:         "thriving" | "healthy" | "needs_attention" | "sick" | "recovering";
  heightCm:             string | null;
  growthStage:          string | null;
  lastWateredAt:        string | null;
  nextWaterDue:         string | null;
  wateringIntervalDays: number;
  userNotes:            string | null;
  careGuideCount:       number;
}

export interface PlantDetail {
  plant: {
    id:                   number;
    plantName:            string;
    nickname:             string | null;
    location:             string | null;
    photoUrl:             string | null;
    heightCm:             string | null;
    growthStage:          string | null;
    potSizeCm:            number | null;
    soilType:             string | null;
    sunlightExposure:     string | null;
    healthStatus:         string | null;
    isPetHousehold:       boolean;
    lastWateredAt:        string | null;
    nextWaterDue:         string | null;
    wateringIntervalDays: number;
    lastFertilisedAt:     string | null;
    lastRepottedAt:       string | null;
    userNotes:            string | null;
    addedAt:              string;
  };
  careLogs:   CareLog[];
  careGuides: CareGuide[];
}

export interface CareLog {
  id:           number;
  type:         string;
  source:       "user" | "ai" | "system";
  careCategory: string | null;
  note:         string | null;
  isCareGuide:  boolean;
  loggedAt:     string | null;
}

export interface CareGuide {
  id:         number;
  category:   string;
  title:      string;
  content:    string;
  severity:   "info" | "warning" | "urgent";
  isResolved: boolean;
  createdBy:  "ai" | "user";
  createdAt:  string | null;
}

export interface ChatMessage {
  role:              "user" | "assistant";
  content:           string;
  suggestedProducts?: SuggestedProduct[];
  savedGuide?:       SavedGuide | null;
  timestamp:         Date;
}

export interface SuggestedProduct {
  uuid:        string;
  title:       string;
  price:       string;
  productType: string;
  imageUrl:    string | null;
}

export interface SavedGuide {
  id:       number;
  category: string;
  title:    string;
  severity: string;
}

// ── API functions ──────────────────────────────────────────────────────

/** GET /ai-care/my-plants — returns all user plants for the dropdown selector */
export const getMyPlantsForAiApi = async (): Promise<{ plants: UserPlantSummary[] }> => {
  const res = await api.get("/ai-care/my-plants");
  return {
    plants: res.data.plants.map((p: any) => ({
      id:                   p.id,
      plantName:            p.plant_name,
      nickname:             p.nickname,
      location:             p.location,
      photoUrl:             p.photo_url,
      healthStatus:         p.health_status,
      heightCm:             p.height_cm,
      growthStage:          p.growth_stage,
      lastWateredAt:        p.last_watered_at,
      nextWaterDue:         p.next_water_due,
      wateringIntervalDays: p.watering_interval_days,
      userNotes:            p.user_notes,
      careGuideCount:       p.care_guide_count,
    })),
  };
};

/** GET /ai-care/my-plants/{id} — full plant detail + care logs + care guides */
export const getPlantAiContextApi = async (plantId: number): Promise<PlantDetail> => {
  const res = await api.get(`/ai-care/my-plants/${plantId}`);
  const d = res.data;
  return {
    plant: {
      id:                   d.plant.id,
      plantName:            d.plant.plant_name,
      nickname:             d.plant.nickname,
      location:             d.plant.location,
      photoUrl:             d.plant.photo_url,
      heightCm:             d.plant.height_cm,
      growthStage:          d.plant.growth_stage,
      potSizeCm:            d.plant.pot_size_cm,
      soilType:             d.plant.soil_type,
      sunlightExposure:     d.plant.sunlight_exposure,
      healthStatus:         d.plant.health_status,
      isPetHousehold:       d.plant.is_pet_household,
      lastWateredAt:        d.plant.last_watered_at,
      nextWaterDue:         d.plant.next_water_due,
      wateringIntervalDays: d.plant.watering_interval_days,
      lastFertilisedAt:     d.plant.last_fertilised_at,
      lastRepottedAt:       d.plant.last_repotted_at,
      userNotes:            d.plant.user_notes,
      addedAt:              d.plant.added_at,
    },
    careLogs: d.care_logs.map((l: any) => ({
      id:           l.id,
      type:         l.type,
      source:       l.source,
      careCategory: l.care_category,
      note:         l.note,
      isCareGuide:  l.is_care_guide,
      loggedAt:     l.logged_at,
    })),
    careGuides: d.care_guides.map((g: any) => ({
      id:         g.id,
      category:   g.category,
      title:      g.title,
      content:    g.content,
      severity:   g.severity,
      isResolved: g.is_resolved,
      createdBy:  g.created_by,
      createdAt:  g.created_at,
    })),
  };
};

/** POST /ai-care/chat — send message optionally with plant + photo */
export const aiCareChatApi = async (data: {
  message:     string;
  sessionUuid: string | null;
  plantId:     number | null;
  photo?:      File;
}): Promise<{
  sessionUuid:       string;
  response:          string;
  suggestedProducts: SuggestedProduct[];
  savedGuide:        SavedGuide | null;
  plantId:           number | null;
}> => {
  const form = new FormData();
  form.append("message", data.message);
  if (data.sessionUuid) form.append("session_uuid", data.sessionUuid);
  if (data.plantId)     form.append("plant_id",     String(data.plantId));
  if (data.photo)       form.append("photo",        data.photo);

  const res = await api.post("/ai-care/chat", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return {
    sessionUuid:       res.data.session_uuid,
    response:          res.data.response,
    suggestedProducts: (res.data.suggested_products ?? []).map((p: any) => ({
      uuid:        p.uuid,
      title:       p.title,
      price:       p.price,
      productType: p.product_type,
      imageUrl:    p.image_url,
    })),
    savedGuide: res.data.saved_guide ?? null,
    plantId:    res.data.plant_id ?? null,
  };
};

/** POST /ai-care/sessions/{uuid}/save-guide — manually save AI message to care guide */
export const saveAiGuideApi = async (
  sessionUuid: string,
  data: {
    plantId:        number;
    messageContent: string;
    category:       string;
    title:          string;
    severity:       string;
  }
): Promise<{ saved: boolean; guideId: number; message: string }> => {
  const res = await api.post(`/ai-care/sessions/${sessionUuid}/save-guide`, {
    plant_id:        data.plantId,
    message_content: data.messageContent,
    category:        data.category,
    title:           data.title,
    severity:        data.severity,
  });
  return {
    saved:    res.data.saved,
    guideId:  res.data.guide_id,
    message:  res.data.message,
  };
};

/** PATCH /ai-care/care-guides/{id}/resolve — mark guide as resolved */
export const resolveCareGuideApi = async (
  guideId: number,
  note?: string
): Promise<{ resolved: boolean }> => {
  const res = await api.patch(`/ai-care/care-guides/${guideId}/resolve`, { note });
  return res.data;
};

/** POST /ai-care/sessions/{uuid}/rate — rate the session */
export const rateAiSessionApi = async (
  sessionUuid: string,
  rating: "helpful" | "not_helpful"
): Promise<void> => {
  await api.post(`/ai-care/sessions/${sessionUuid}/rate`, null, {
    params: { rating },
  });
};
