import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { forgotPasswordApi } from "../api/auth.api";

export function useForgotPassword() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: forgotPasswordApi,
    onError: (err: any) => {
      const detail = err?.response?.data?.detail as string | undefined;
      // Backend sends 403 "email_not_verified" when the account exists
      // but the user never completed OTP verification.
      // We store the email on the mutation so the page can redirect.
      if (detail === "email_not_verified") {
        // Nothing to do here — page reads isUnverified + pendingEmail and shows UI
      }
    },
  });

  const rawDetail = (mutation.error as any)?.response?.data?.detail as string | undefined;
  const isUnverified = rawDetail === "email_not_verified";

  return {
    /** Call with email string — triggers POST /auth/forgot-password */
    sendResetLink: (email: string) => mutation.mutate(email),

    isLoading: mutation.isPending,

    /** true = backend responded 200, reset email queued */
    isSuccess: mutation.isSuccess,

    /** true = 403 email_not_verified — account exists but OTP never confirmed */
    isUnverified,

    /** The email most recently submitted (needed for the OTP redirect URL) */
    pendingEmail: mutation.variables as string | undefined,

    /** Any other non-403 error message to show in the form */
    error: !isUnverified ? rawDetail : undefined,

    router,
  };
}
