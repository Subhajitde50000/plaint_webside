import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitReviewApi } from "../api/reviews.api";
import { useToast } from "@/hooks/useToast";

export function useSubmitReview(productSlug: string) {
  const qc = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: submitReviewApi,
    onSuccess: () => {
      // Invalidate reviews so updated list re-fetches after moderation
      qc.invalidateQueries({ queryKey: ["reviews", productSlug] });
      success("Review submitted! It'll appear after moderation. 🌿");
    },
  });
}
