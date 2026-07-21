import { api } from "@/lib/axios";
import type { HomepageData } from "../types/homepage.types";

export const getHomepageApi = async (): Promise<HomepageData> => {
  const res = await api.get("/homepage/");
  return res.data;
};
