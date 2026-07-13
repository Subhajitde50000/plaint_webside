import { api } from "@/lib/axios";

// ─── Get Reviews for a Product ────────────────────────────────────────────────

export const getProductReviewsApi = async (
  slug: string,
  page = 1,
  rating?: number
) => {
  const res = await api.get(`/products/${slug}/reviews`, {
    params: { page, rating },
  });
  return res.data;
};

// ─── Submit Review ────────────────────────────────────────────────────────────

export const submitReviewApi = async (data: {
  productId: string;
  rating: number;
  title?: string;
  body?: string;
  photos?: File[];
}) => {
  const form = new FormData();
  form.append("product_id", data.productId);
  form.append("rating", String(data.rating));
  if (data.title) form.append("title", data.title);
  if (data.body) form.append("body", data.body);
  data.photos?.forEach((f) => form.append("photos", f));

  const res = await api.post("/reviews/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ─── Mark Review Helpful ──────────────────────────────────────────────────────

export const markHelpfulApi = async (
  reviewId: string,
  rating: "helpful" | "not_helpful"
) => {
  const res = await api.post(`/reviews/${reviewId}/helpful`, { rating });
  return res.data;
};

// ─── Flag Review ──────────────────────────────────────────────────────────────

export const flagReviewApi = async (reviewId: string, reason: string) => {
  const res = await api.post(`/reviews/${reviewId}/flag`, { reason });
  return res.data;
};
