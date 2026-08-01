import { api } from "@/lib/axios";

export interface PlantPayload {
  plantName:             string;
  nickname?:             string;
  location?:             string;
  addedAt:               string;
  heightCm?:             number;
  growthStage?:          string;
  potSizeCm?:            number;
  soilType?:             string;
  sunlightExposure?:     string;
  healthStatus?:         string;
  isPetHousehold?:       boolean;
  lastWateredAt?:        string;
  wateringIntervalDays?: number;
  lastFertilisedAt?:     string;
  lastRepottedAt?:       string;
  userNotes?:            string;
  productId?:            number;
  photo?:                File;
}

export const getMyPlantsApi = async () => {
  const res = await api.get("/customers/me/plants");
  return res.data;
};

export const addPlantApi = async (data: PlantPayload) => {
  const form = new FormData();
  form.append("plant_name", data.plantName);
  if (data.nickname) form.append("nickname", data.nickname);
  if (data.location) form.append("location", data.location);
  form.append("added_at", data.addedAt);
  if (data.heightCm) form.append("height_cm", String(data.heightCm));
  if (data.growthStage) form.append("growth_stage", data.growthStage);
  if (data.potSizeCm) form.append("pot_size_cm", String(data.potSizeCm));
  if (data.soilType) form.append("soil_type", data.soilType);
  if (data.sunlightExposure) form.append("sunlight_exposure", data.sunlightExposure);
  if (data.healthStatus) form.append("health_status", data.healthStatus);
  form.append("is_pet_household", String(data.isPetHousehold ?? false));
  if (data.lastWateredAt) form.append("last_watered_at", data.lastWateredAt);
  if (data.wateringIntervalDays) form.append("watering_interval_days", String(data.wateringIntervalDays));
  if (data.lastFertilisedAt) form.append("last_fertilised_at", data.lastFertilisedAt);
  if (data.lastRepottedAt) form.append("last_repotted_at", data.lastRepottedAt);
  if (data.userNotes) form.append("user_notes", data.userNotes);
  if (data.productId) form.append("product_id", String(data.productId));
  if (data.photo) form.append("photo", data.photo);

  const res = await api.post("/customers/me/plants", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updatePlantApi = async (
  plantId: number,
  data: Partial<PlantPayload>
) => {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    if (value instanceof File) {
      form.append(snakeKey, value);
    } else {
      form.append(snakeKey, String(value));
    }
  });
  const res = await api.patch(`/customers/me/plants/${plantId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deletePlantApi = async (plantId: number) => {
  const res = await api.delete(`/customers/me/plants/${plantId}`);
  return res.data;
};

export const addPlantCareLogApi = async (
  plantId: number,
  data: {
    type: string;
    note?: string;
    careCategory?: string;
  }
) => {
  const res = await api.post(`/customers/me/plants/${plantId}/log`, {
    type: data.type,
    note: data.note,
    care_category: data.careCategory,
  });
  return res.data;
};
