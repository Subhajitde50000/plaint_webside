import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().min(2, "Please enter your first name.").max(100),
  lastName: z.string().min(2, "Please enter your last name.").max(100),
  email: z.string().email("Enter a valid email address."),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[6-9]\d{9}$/.test(val), {
      message: "Enter a valid 10-digit phone number.",
    }),
  password: z.string().min(8, "Password must be at least 8 characters."),
  terms: z.literal(true, {
    message: "Please accept the terms to continue.",
  }),
  marketing: z.boolean(),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm Password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const otpSchema = z.object({
  otp: z.string().length(6, "Verification code must be exactly 6 digits."),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type OtpInputType = z.infer<typeof otpSchema>;
