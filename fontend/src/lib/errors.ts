export interface ApiError {
  detail: string;
  status: number;
}

export function getErrorMessage(error: unknown): string {
  const err = error as any;
  const detail = err?.response?.data?.detail;
  const status = err?.response?.status;

  // Map common status codes to user-friendly messages
  if (status === 401) return "Please sign in to continue.";
  if (status === 403) return "You don't have permission to do this.";
  if (status === 404) return "Not found.";
  if (status === 422) return "Please check your input and try again.";
  if (status === 429) return "Too many requests. Please wait a moment.";
  if (status >= 500) return "Something went wrong on our end. Please try again.";

  // Use FastAPI detail message if available
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    // Pydantic validation errors — format the first one
    return detail[0]?.msg ?? "Validation error.";
  }

  if (err?.message === "Network Error")
    return "Unable to connect. Check your internet connection.";

  return "An unexpected error occurred.";
}

export function getStatusCode(error: unknown): number | undefined {
  return (error as any)?.response?.status;
}
