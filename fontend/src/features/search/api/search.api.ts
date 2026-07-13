import { api } from "@/lib/axios";

export const searchApi = async (q: string, page = 1) => {
  const res = await api.get("/search/", { params: { q, page } });
  return res.data;
};
