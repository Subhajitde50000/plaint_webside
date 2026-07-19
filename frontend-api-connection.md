# Hero Plant Store — Frontend ↔ Backend API Connection Map
## Complete Integration Guide v1.0
### Every file · Every endpoint · Every change needed

> **Purpose:** This document is the definitive handoff guide for connecting the Next.js storefront frontend to the FastAPI backend. Every API endpoint is mapped to the exact frontend file that calls it, what request it sends, what response it expects, what state it updates, and what UI changes on success/error.

---

## 1. Setup — Environment & Base Config

### 1.1 Environment Variables (`/.env.local`)

```env
# API base URL — all API calls prefix with this
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production
# NEXT_PUBLIC_API_URL=https://api.heroplants.com

# Google OAuth Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Razorpay publishable key (for checkout)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
```

### 1.2 Packages to Install

```bash
npm install \
  axios \
  @tanstack/react-query \
  zustand \
  react-hook-form \
  @hookform/resolvers \
  zod \
  js-cookie \
  razorpay
```

### 1.3 Axios Base Instance (`src/lib/axios.ts`)

**Changes needed:** Create this file from scratch.

```typescript
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api/v1",
  withCredentials: true,           // sends HttpOnly refresh cookie
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach access token on every request
api.interceptors.request.use((config) => {
  // Token is stored in memory via Zustand
  const token = (globalThis as any).__accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Silent refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        (globalThis as any).__accessToken = data.access_token;
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return api(original);
      } catch {
        // Refresh failed → clear state, go to login
        (globalThis as any).__accessToken = null;
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
```

### 1.4 TanStack Query Provider (`src/app/providers.tsx`)

**Changes needed:** Create this file. Wrap in root `layout.tsx`.

```typescript
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 5 * 60 * 1000, retry: 1 },
      mutations: { retry: false },
    },
  }));
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**In `src/app/layout.tsx` — change needed:**

```typescript
// ADD THIS IMPORT
import { Providers } from "./providers";

// WRAP children
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>   {/* ← ADD */}
      </body>
    </html>
  );
}
```

---

## 2. Auth Module — File × Endpoint × Change Map

### 2.1 SIGN UP

| Property | Value |
|---|---|
| **Page file** | `src/app/(auth)/signup/page.tsx` |
| **Form component** | `src/features/auth/components/SignUpForm.tsx` |
| **Hook** | `src/features/auth/hooks/useSignUp.ts` |
| **API function** | `src/features/auth/api/auth.api.ts → registerApi()` |
| **Backend endpoint** | `POST /api/v1/auth/register` |
| **Request body** | `{ first_name, last_name, email, phone, password }` |
| **Success response** | `{ message: "Account created. Check your email to verify." }` |
| **Error responses** | `409` → email exists · `422` → validation error |

**Frontend changes needed:**

```typescript
// src/features/auth/api/auth.api.ts
// ADD THIS FUNCTION
export const registerApi = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email.toLowerCase().trim(),
    phone: data.phone || undefined,
    password: data.password,
  });
  return res.data;
};

// src/features/auth/hooks/useSignUp.ts
// ADD THIS HOOK
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerApi } from "../api/auth.api";

export function useSignUp() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (_, vars) => {
      // On success: redirect to OTP page with email in query
      router.push(`/verify-email?email=${encodeURIComponent(vars.email)}`);
    },
  });
  return {
    signUp: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    // Extract readable error from FastAPI response
    error: (mutation.error as any)?.response?.data?.detail as string | undefined,
    statusCode: (mutation.error as any)?.response?.status as number | undefined,
  };
}

// src/features/auth/components/SignUpForm.tsx
// CHANGES NEEDED — wire up hook to form
import { useSignUp } from "../hooks/useSignUp";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../schemas/auth.schema";

export function SignUpForm() {
  const { signUp, isLoading, error, statusCode } = useSignUp();
  const form = useForm({ resolver: zodResolver(signUpSchema) });

  const onSubmit = (data) => signUp(data);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Show 409 error inline on email field */}
      {statusCode === 409 && (
        <p role="alert" className="text-red-500 text-sm">
          An account with this email already exists.{" "}
          <a href="/login">Sign in instead →</a>
        </p>
      )}
      {/* ... form fields ... */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account →"}
      </button>
    </form>
  );
}
```

---

### 2.2 OTP VERIFICATION

| Property | Value |
|---|---|
| **Page file** | `src/app/(auth)/verify-email/page.tsx` |
| **Component** | `src/features/auth/components/OtpInput.tsx` |
| **Hook** | `src/features/auth/hooks/useVerifyOtp.ts` |
| **API functions** | `verifyOtpApi()` · `resendOtpApi()` |
| **Verify endpoint** | `POST /api/v1/auth/verify-otp` |
| **Resend endpoint** | `POST /api/v1/auth/resend-otp` |
| **Verify request** | `{ email: string, otp: string }` |
| **Verify success** | `{ message: "Email verified." }` |
| **Verify errors** | `400` → wrong OTP · `410` → expired · `429` → too many attempts |
| **Resend request** | `{ email: string }` |
| **Resend success** | `{ message: "New OTP sent." }` |

**Frontend changes needed:**

```typescript
// src/features/auth/api/auth.api.ts — ADD THESE FUNCTIONS

export const verifyOtpApi = async (email: string, otp: string) => {
  const res = await api.post("/auth/verify-otp", { email, otp });
  return res.data;
};

export const resendOtpApi = async (email: string) => {
  const res = await api.post("/auth/resend-otp", { email });
  return res.data;
};

// src/features/auth/hooks/useVerifyOtp.ts — ADD THIS HOOK
import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export function useVerifyOtp() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";

  // OTP expiry timer (10 min)
  const [timeLeft, setTimeLeft] = useState(600);
  // Resend cooldown (60s)
  const [resendIn, setResendIn] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (resendIn <= 0) { setCanResend(true); return; }
    const t = setInterval(() => setResendIn((n) => n - 1), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const verify = useMutation({
    mutationFn: (otp: string) => verifyOtpApi(email, otp),
    onSuccess: () => router.push("/"),  // → homepage after verification
  });

  const resend = useMutation({
    mutationFn: () => resendOtpApi(email),
    onSuccess: () => {
      setTimeLeft(600);    // reset OTP timer
      setResendIn(60);     // reset cooldown
      setCanResend(false);
    },
  });

  return {
    email,
    verify: (otp: string) => verify.mutate(otp),
    resend: () => resend.mutate(),
    isVerifying: verify.isPending,
    isResending: resend.isPending,
    isSuccess: verify.isSuccess,
    isExpired: timeLeft === 0,
    verifyError: (verify.error as any)?.response?.data?.detail as string | undefined,
    verifyErrorCode: (verify.error as any)?.response?.status as number | undefined,
    resendSuccess: resend.isSuccess,
    timeLeft,
    formattedTime: `${Math.floor(timeLeft/60)}:${String(timeLeft%60).padStart(2,"0")}`,
    canResend,
    resendIn,
  };
}

// src/app/(auth)/verify-email/page.tsx — CHANGES NEEDED
// Read email from URL, pass to OtpInput, wire up hook
"use client";
import { useVerifyOtp } from "@/features/auth/hooks/useVerifyOtp";
import { OtpInput } from "@/features/auth/components/OtpInput";
import { useState } from "react";

export default function VerifyEmailPage() {
  const [otpValue, setOtpValue] = useState<string[]>(Array(6).fill(""));
  const {
    email, verify, resend, isVerifying, isSuccess,
    verifyError, verifyErrorCode, isExpired,
    formattedTime, canResend, resendIn, resendSuccess,
  } = useVerifyOtp();

  if (isSuccess) return <SuccessCard />;  // show success state

  return (
    <AuthCard>
      <p>Code sent to <strong>{email}</strong></p>
      <OtpInput
        value={otpValue}
        onChange={setOtpValue}
        onComplete={(otp) => verify(otp)}   // ← calls API on 6th digit
        hasError={!!verifyError}
        disabled={isVerifying || isExpired}
      />
      {verifyError && (
        <p role="alert" aria-live="assertive" className="text-red-500 text-sm">
          {verifyErrorCode === 429
            ? "Too many attempts. Please resend a new code."
            : verifyError}
        </p>
      )}
      {!isExpired && (
        <p className="text-sm text-gray-500">
          Code expires in <span className={timeLeft < 30 ? "text-red-500" : ""}>
            {formattedTime}
          </span>
        </p>
      )}
      {isExpired && (
        <p role="alert" className="text-red-500 text-sm">
          Code expired. Please resend.
        </p>
      )}
      <button
        onClick={() => resend()}
        disabled={!canResend}
        aria-disabled={!canResend}
        aria-label={canResend ? "Resend code" : `Resend in ${resendIn} seconds`}
      >
        {canResend ? "Resend code" : `Resend in ${resendIn}s`}
      </button>
      {resendSuccess && (
        <p role="status" aria-live="polite" className="text-green-600 text-sm">
          ✓ New code sent!
        </p>
      )}
    </AuthCard>
  );
}
```

---

### 2.3 LOGIN

| Property | Value |
|---|---|
| **Page file** | `src/app/(auth)/login/page.tsx` |
| **Component** | `src/features/auth/components/LoginForm.tsx` |
| **Hook** | `src/features/auth/hooks/useLogin.ts` |
| **API functions** | `loginApi()` → `getMeApi()` |
| **Login endpoint** | `POST /api/v1/auth/login` |
| **Profile endpoint** | `GET /api/v1/customers/me` |
| **Login request** | `application/x-www-form-urlencoded` → `username=[email]&password=[pass]` |
| **Login success** | `{ access_token: string, token_type: "bearer" }` |
| **Login errors** | `401` → wrong credentials · `403` → blocked/unverified |

**Frontend changes needed:**

```typescript
// src/features/auth/api/auth.api.ts — ADD THESE FUNCTIONS

export const loginApi = async (email: string, password: string) => {
  // FastAPI OAuth2 needs form-encoded, not JSON
  const form = new URLSearchParams({ username: email, password });
  const res = await api.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data as { access_token: string; token_type: string };
};

export const getMeApi = async () => {
  const res = await api.get("/customers/me");
  return res.data;
};

// src/store/auth.store.ts — CHANGE NEEDED
// Add setAccessToken that also stores to globalThis for Axios interceptor
import { create } from "zustand";

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setAccessToken: (token) => {
    (globalThis as any).__accessToken = token;  // used by Axios interceptor
    set({ isAuthenticated: true });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    (globalThis as any).__accessToken = null;
    set({ user: null, isAuthenticated: false });
  },
}));

// src/features/auth/hooks/useLogin.ts — ADD THIS HOOK
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { loginApi, getMeApi } from "../api/auth.api";
import { useAuthStore } from "@/store/auth.store";

export function useLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = params.get("returnTo") ?? "/";
  const { setAccessToken, setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),

    onSuccess: async (data) => {
      setAccessToken(data.access_token);  // store in memory + globalThis
      const user = await getMeApi();       // fetch profile with new token
      setUser(user);
      router.push(returnTo);              // redirect to intended page
    },
  });

  const errorStatus = (mutation.error as any)?.response?.status;
  const errorDetail = (mutation.error as any)?.response?.data?.detail;

  return {
    login: (email: string, password: string) =>
      mutation.mutate({ email, password }),
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    // Map status codes to user-facing messages
    error:
      errorStatus === 401 ? "Incorrect email or password." :
      errorStatus === 403 && errorDetail?.includes("blocked") ? "Your account has been blocked." :
      errorStatus === 403 ? "Please verify your email before signing in." :
      errorDetail ?? undefined,
    errorStatus,
    isBlocked: errorStatus === 403 && errorDetail?.includes("blocked"),
    isUnverified: errorStatus === 403 && !errorDetail?.includes("blocked"),
  };
}
```

---

### 2.4 FORGOT PASSWORD

| Property | Value |
|---|---|
| **Page file** | `src/app/(auth)/forgot-password/page.tsx` |
| **Component** | `src/features/auth/components/ForgotPasswordForm.tsx` |
| **Hook** | `src/features/auth/hooks/useForgotPassword.ts` |
| **API function** | `forgotPasswordApi()` |
| **Endpoint** | `POST /api/v1/auth/forgot-password` |
| **Request** | `{ email: string }` |
| **Response** | Always `200` → `{ message: string }` — never reveals if email exists |

**Frontend changes needed:**

```typescript
// src/features/auth/api/auth.api.ts — ADD
export const forgotPasswordApi = async (email: string) => {
  // Note: this ALWAYS returns 200 even for unknown emails (security)
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

// src/features/auth/hooks/useForgotPassword.ts — ADD
import { useMutation } from "@tanstack/react-query";

export function useForgotPassword() {
  const mutation = useMutation({
    mutationFn: forgotPasswordApi,
    // Even on error, show success to prevent email enumeration
    onError: () => {},
  });

  return {
    submit: (email: string) => mutation.mutate(email),
    isLoading: mutation.isPending,
    // isSuccess is TRUE even after error — always show "check your email"
    showSuccess: mutation.isSuccess || mutation.isError,
  };
}
```

---

### 2.5 RESET PASSWORD

| Property | Value |
|---|---|
| **Page file** | `src/app/(auth)/reset-password/page.tsx` |
| **Component** | `src/features/auth/components/ResetPasswordForm.tsx` |
| **Hook** | `src/features/auth/hooks/useResetPassword.ts` |
| **API function** | `resetPasswordApi()` |
| **Endpoint** | `POST /api/v1/auth/reset-password` |
| **Request** | `{ token: string, new_password: string }` |
| **Success** | `{ message: string }` |
| **Errors** | `400` → invalid/expired token |

**Frontend changes needed:**

```typescript
// src/features/auth/api/auth.api.ts — ADD
export const resetPasswordApi = async (token: string, newPassword: string) => {
  const res = await api.post("/auth/reset-password", {
    token,
    new_password: newPassword,
  });
  return res.data;
};

// src/features/auth/hooks/useResetPassword.ts — ADD
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export function useResetPassword() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const mutation = useMutation({
    mutationFn: (newPassword: string) => resetPasswordApi(token, newPassword),
    onSuccess: () => router.push("/login?reset=success"),
  });

  return {
    submit: (newPassword: string) => mutation.mutate(newPassword),
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isInvalidToken: (mutation.error as any)?.response?.status === 400,
    error: (mutation.error as any)?.response?.data?.detail as string | undefined,
    hasToken: !!token,
  };
}
```


---

## 3. Products Module — File × Endpoint × Change Map

### 3.1 Product Listing Page (PLP)

| Property | Value |
|---|---|
| **Page file** | `src/app/categories/[slug]/page.tsx` |
| **Hook** | `src/features/products/hooks/useProducts.ts` |
| **API function** | `src/features/products/api/products.api.ts → getProductsApi()` |
| **Endpoint** | `GET /api/v1/products/` |
| **Query params** | `?category_slug=&sort=popularity&page=1&page_size=20&q=&min_price=&max_price=&is_pet_friendly=&care_skill=` |
| **Response** | `{ items: Product[], total, page, page_size, pages }` |

**Frontend changes needed:**

```typescript
// src/features/products/api/products.api.ts — CREATE FILE
import { api } from "@/lib/axios";

export interface ProductFilters {
  categorySlug?: string;
  collectionSlug?: string;
  productType?: string;
  minPrice?: number;
  maxPrice?: number;
  isPetFriendly?: boolean;
  isAirPurifying?: boolean;
  careSkill?: "beginner" | "intermediate" | "expert";
  sort?: "popularity" | "newest" | "price_asc" | "price_desc" | "rating" | "name_asc";
  page?: number;
  pageSize?: number;
  q?: string;
}

export const getProductsApi = async (filters: ProductFilters = {}) => {
  const res = await api.get("/products/", {
    params: {
      category_slug: filters.categorySlug,
      collection_slug: filters.collectionSlug,
      product_type: filters.productType,
      min_price: filters.minPrice,
      max_price: filters.maxPrice,
      is_pet_friendly: filters.isPetFriendly,
      is_air_purifying: filters.isAirPurifying,
      care_skill: filters.careSkill,
      sort: filters.sort ?? "popularity",
      page: filters.page ?? 1,
      page_size: filters.pageSize ?? 20,
      q: filters.q,
    },
  });
  return res.data;
};

// src/features/products/hooks/useProducts.ts — CREATE FILE
import { useQuery } from "@tanstack/react-query";
import { getProductsApi, ProductFilters } from "../api/products.api";

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],            // re-fetches when filters change
    queryFn: () => getProductsApi(filters),
    staleTime: 2 * 60 * 1000,                  // 2 min cache
    placeholderData: (prev) => prev,            // keep old data while loading new
  });
}

// src/app/(storefront)/plants/page.tsx — CHANGES NEEDED
// Wire up hook to URL search params
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "@/features/products/hooks/useProducts";

export default function PLPPage() {
  const params = useSearchParams();
  const { data, isLoading, isError } = useProducts({
    categorySlug: params.get("category") ?? undefined,
    sort: (params.get("sort") as any) ?? "popularity",
    page: Number(params.get("page") ?? 1),
    q: params.get("q") ?? undefined,
    minPrice: params.get("min_price") ? Number(params.get("min_price")) : undefined,
    maxPrice: params.get("max_price") ? Number(params.get("max_price")) : undefined,
    isPetFriendly: params.get("pet") === "true" ? true : undefined,
  });

  if (isLoading) return <ProductGridSkeleton />;
  if (isError)   return <ErrorState />;

  return (
    <div>
      <ProductGrid products={data.items} />
      <Pagination total={data.total} pages={data.pages} current={data.page} />
    </div>
  );
}
```

---

### 3.2 Product Detail Page (PDP)

| Property | Value |
|---|---|
| **Page file** | `src/app/(storefront)/plants/[slug]/page.tsx` |
| **Hook** | `src/features/products/hooks/useProduct.ts` |
| **API function** | `getProductBySlugApi()` |
| **Endpoint** | `GET /api/v1/products/{slug}` |
| **Response** | Full product object: images, variants, care_cards, features, specs, pot_upsells |

**Frontend changes needed:**

```typescript
// src/features/products/api/products.api.ts — ADD
export const getProductBySlugApi = async (slug: string) => {
  const res = await api.get(`/products/${slug}`);
  return res.data;
};

// src/features/products/hooks/useProduct.ts — CREATE FILE
import { useQuery } from "@tanstack/react-query";
import { getProductBySlugApi } from "../api/products.api";

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlugApi(slug),
    staleTime: 60 * 1000,
    enabled: !!slug,
  });
}

// src/app/(storefront)/plants/[slug]/page.tsx — CHANGES NEEDED
"use client";
import { useParams } from "next/navigation";
import { useProduct } from "@/features/products/hooks/useProduct";

export default function PDPPage() {
  const { slug } = useParams();
  const { data: product, isLoading, isError } = useProduct(slug as string);

  if (isLoading) return <PDPSkeleton />;
  if (isError || !product) return <NotFoundState />;

  return (
    <div>
      <ProductImages images={product.images} />
      <ProductInfo product={product} />
      <VariantSelector variants={product.variants} />
      <CareChips product={product} />
      <PotUpsellStrip pots={product.pot_upsells} />
      <AboutTabs product={product} />
    </div>
  );
}
```

---

### 3.3 Search

| Property | Value |
|---|---|
| **Component** | `src/features/search/components/SearchBar.tsx` |
| **Hook** | `src/features/search/hooks/useSearch.ts` |
| **API function** | `searchApi()` |
| **Endpoint** | `GET /api/v1/search/?q=monstera&page=1` |
| **Response** | Same as products list |

**Frontend changes needed:**

```typescript
// src/features/search/api/search.api.ts — CREATE
import { api } from "@/lib/axios";
export const searchApi = async (q: string, page = 1) => {
  const res = await api.get("/search/", { params: { q, page } });
  return res.data;
};

// src/features/search/hooks/useSearch.ts — CREATE
import { useQuery } from "@tanstack/react-query";
import { searchApi } from "../api/search.api";

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchApi(query),
    enabled: query.length >= 2,       // only search if 2+ chars typed
    staleTime: 30 * 1000,
  });
}

// src/features/search/components/SearchBar.tsx — CHANGES NEEDED
// Debounce input → call useSearch → show results dropdown
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";  // 300ms debounce
import { useSearch } from "../hooks/useSearch";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const { data, isLoading } = useSearch(debouncedQuery);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search plants..."
        aria-label="Search"
        aria-autocomplete="list"
        aria-controls="search-results"
      />
      {data?.items?.length > 0 && (
        <ul id="search-results" role="listbox">
          {data.items.map((p) => (
            <li key={p.uuid} role="option">
              <a href={`/plants/${p.slug}`}>{p.title}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## 4. Cart Module — File × Endpoint × Change Map

| Endpoint | Method | Hook | API Function |
|---|---|---|---|
| `/cart/` | GET | `useCart.ts` | `getCartApi()` |
| `/cart/items/` | POST | `useAddToCart.ts` | `addToCartApi()` |
| `/cart/items/{id}` | PATCH | `useUpdateCartItem.ts` | `updateCartItemApi()` |
| `/cart/items/{id}` | DELETE | `useRemoveCartItem.ts` | `removeCartItemApi()` |
| `/cart/apply-discount` | POST | `useApplyDiscount.ts` | `applyDiscountApi()` |
| `/cart/remove-discount` | DELETE | `useRemoveDiscount.ts` | `removeDiscountApi()` |

**Frontend changes needed:**

```typescript
// src/features/cart/api/cart.api.ts — CREATE FILE
import { api } from "@/lib/axios";

export const getCartApi = async () => {
  const res = await api.get("/cart/");
  return res.data;
};

export const addToCartApi = async (variantId: string, quantity: number) => {
  const res = await api.post("/cart/items/", { variant_id: variantId, quantity });
  return res.data;
};

export const updateCartItemApi = async (itemId: string, quantity: number) => {
  const res = await api.patch(`/cart/items/${itemId}`, { quantity });
  return res.data;
};

export const removeCartItemApi = async (itemId: string) => {
  const res = await api.delete(`/cart/items/${itemId}`);
  return res.data;
};

export const applyDiscountApi = async (code: string) => {
  const res = await api.post("/cart/apply-discount", { code });
  return res.data;
};

export const removeDiscountApi = async () => {
  const res = await api.delete("/cart/remove-discount");
  return res.data;
};

// src/features/cart/hooks/useCart.ts — CREATE FILE
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCartApi, addToCartApi, updateCartItemApi,
  removeCartItemApi, applyDiscountApi, removeDiscountApi,
} from "../api/cart.api";

const CART_KEY = ["cart"];

export function useCart() {
  const qc = useQueryClient();

  // Fetch cart
  const cart = useQuery({
    queryKey: CART_KEY,
    queryFn: getCartApi,
    staleTime: 0,  // always fresh
  });

  // Add item — invalidates cart after success
  const addItem = useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) =>
      addToCartApi(variantId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });

  // Update item quantity
  const updateItem = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItemApi(itemId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });

  // Remove item
  const removeItem = useMutation({
    mutationFn: (itemId: string) => removeCartItemApi(itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });

  // Apply discount
  const applyDiscount = useMutation({
    mutationFn: (code: string) => applyDiscountApi(code),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });

  // Remove discount
  const removeDiscount = useMutation({
    mutationFn: removeDiscountApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });

  return {
    cart: cart.data,
    isLoading: cart.isLoading,
    addItem: addItem.mutate,
    updateItem: updateItem.mutate,
    removeItem: removeItem.mutate,
    applyDiscount: applyDiscount.mutate,
    removeDiscount: removeDiscount.mutate,
    discountError: (applyDiscount.error as any)?.response?.data?.detail,
    isAddingItem: addItem.isPending,
  };
}

// src/app/(storefront)/plants/[slug]/page.tsx — ADD TO CART WIRING
// In PDP, connect "Add to Cart" button to useCart hook
import { useCart } from "@/features/cart/hooks/useCart";

function AddToCartButton({ variantId }: { variantId: string }) {
  const { addItem, isAddingItem } = useCart();
  return (
    <button
      onClick={() => addItem({ variantId, quantity: 1 })}
      disabled={isAddingItem}
      aria-busy={isAddingItem}
    >
      {isAddingItem ? "Adding..." : "Add to Cart"}
    </button>
  );
}
```

---

## 5. Orders Module — File × Endpoint × Change Map

| Endpoint | Method | File | What it does |
|---|---|---|---|
| `/orders/` | POST | `useCreateOrder.ts` | Creates order + gets Razorpay order ID |
| `/orders/{uuid}/verify-payment` | POST | `useVerifyPayment.ts` | Verifies Razorpay signature |
| `/orders/` | GET | `useMyOrders.ts` | Lists customer orders |
| `/orders/{uuid}` | GET | `useOrder.ts` | Order detail + tracking |
| `/orders/{uuid}/cancel` | POST | `useCancelOrder.ts` | Cancel an order |
| `/orders/{uuid}/return` | POST | `useReturnOrder.ts` | Request return |

**Frontend changes needed:**

```typescript
// src/features/orders/api/orders.api.ts — CREATE FILE
import { api } from "@/lib/axios";

export const createOrderApi = async (payload: {
  addressId: string;
  discountCode?: string;
  loyaltyPointsToUse?: number;
  notes?: string;
  giftMessage?: string;
}) => {
  const res = await api.post("/orders/", {
    address_id: payload.addressId,
    discount_code: payload.discountCode,
    loyalty_points_to_use: payload.loyaltyPointsToUse,
    notes: payload.notes,
    gift_message: payload.giftMessage,
  });
  return res.data;  // { order_id, order_number, total, razorpay_order_id, razorpay_key_id }
};

export const verifyPaymentApi = async (
  orderUuid: string,
  razorpayData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
) => {
  const res = await api.post(`/orders/${orderUuid}/verify-payment`, razorpayData);
  return res.data;
};

export const getMyOrdersApi = async (page = 1) => {
  const res = await api.get("/orders/", { params: { page } });
  return res.data;
};

export const getOrderApi = async (orderUuid: string) => {
  const res = await api.get(`/orders/${orderUuid}`);
  return res.data;
};

export const cancelOrderApi = async (orderUuid: string, reason: string) => {
  const res = await api.post(`/orders/${orderUuid}/cancel`, { reason });
  return res.data;
};

// src/features/orders/hooks/useCheckout.ts — CREATE FILE
// Full checkout flow: create order → open Razorpay → verify payment
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createOrderApi, verifyPaymentApi } from "../api/orders.api";

export function useCheckout() {
  const router = useRouter();
  const qc = useQueryClient();

  const checkout = useMutation({
    mutationFn: createOrderApi,

    onSuccess: async (data) => {
      // Open Razorpay payment modal
      await openRazorpay({
        key: data.razorpay_key_id,
        amount: Number(data.total) * 100,   // paise
        order_id: data.razorpay_order_id,
        name: "Hero Plants",
        description: `Order ${data.order_number}`,
        theme: { color: "#00b566" },
        handler: async (paymentData: any) => {
          // Verify payment with backend
          await verifyPaymentApi(data.order_id, {
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_signature: paymentData.razorpay_signature,
          });
          // Clear cart + redirect to success page
          qc.invalidateQueries({ queryKey: ["cart"] });
          router.push(`/orders/${data.order_id}/success`);
        },
      });
    },
  });

  return {
    placeOrder: checkout.mutate,
    isPlacing: checkout.isPending,
    error: (checkout.error as any)?.response?.data?.detail,
  };
}

// Razorpay helper
function openRazorpay(options: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const rzp = new (window as any).Razorpay({
      ...options,
      modal: { ondismiss: reject },
    });
    rzp.on("payment.failed", reject);
    rzp.open();
    options.handler = async (data: any) => {
      await options.handler(data);
      resolve();
    };
  });
}

// src/features/orders/hooks/useMyOrders.ts — CREATE FILE
import { useQuery } from "@tanstack/react-query";
import { getMyOrdersApi } from "../api/orders.api";

export function useMyOrders(page = 1) {
  return useQuery({
    queryKey: ["orders", "my", page],
    queryFn: () => getMyOrdersApi(page),
    staleTime: 30 * 1000,
  });
}

// src/features/orders/hooks/useOrder.ts — CREATE FILE
import { useQuery } from "@tanstack/react-query";
import { getOrderApi } from "../api/orders.api";

export function useOrder(orderUuid: string) {
  return useQuery({
    queryKey: ["order", orderUuid],
    queryFn: () => getOrderApi(orderUuid),
    enabled: !!orderUuid,
    refetchInterval: (query) => {
      // Poll every 30s while order is in transit states
      const transitStatuses = ["dispatched", "in_transit", "out_for_delivery"];
      if (transitStatuses.includes(query.state.data?.status)) return 30000;
      return false;
    },
  });
}
```

---

## 6. Reviews Module — File × Endpoint × Change Map

| Endpoint | Method | Hook | Purpose |
|---|---|---|---|
| `/products/{slug}/reviews` | GET | `useProductReviews` | Reviews on PDP |
| `/reviews/` | POST | `useSubmitReview` | Submit new review |
| `/reviews/{id}/helpful` | POST | `useMarkHelpful` | Mark helpful/not |
| `/reviews/{id}/flag` | POST | `useFlagReview` | Report review |

**Frontend changes needed:**

```typescript
// src/features/reviews/api/reviews.api.ts — CREATE FILE
import { api } from "@/lib/axios";

export const getProductReviewsApi = async (slug: string, page = 1) => {
  const res = await api.get(`/products/${slug}/reviews`, { params: { page } });
  return res.data;
};

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

export const markHelpfulApi = async (reviewId: string, rating: "helpful" | "not_helpful") => {
  const res = await api.post(`/reviews/${reviewId}/helpful`, { rating });
  return res.data;
};

export const flagReviewApi = async (reviewId: string, reason: string) => {
  const res = await api.post(`/reviews/${reviewId}/flag`, { reason });
  return res.data;
};

// src/features/reviews/hooks/useProductReviews.ts — CREATE
import { useQuery } from "@tanstack/react-query";
import { getProductReviewsApi } from "../api/reviews.api";

export function useProductReviews(slug: string, page = 1) {
  return useQuery({
    queryKey: ["reviews", slug, page],
    queryFn: () => getProductReviewsApi(slug, page),
    enabled: !!slug,
    staleTime: 60 * 1000,
  });
}

// src/features/reviews/hooks/useSubmitReview.ts — CREATE
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitReviewApi } from "../api/reviews.api";

export function useSubmitReview(productSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitReviewApi,
    onSuccess: () => {
      // Invalidate reviews so new one shows after moderation
      qc.invalidateQueries({ queryKey: ["reviews", productSlug] });
    },
  });
}
```

---

## 7. AI Care Module — File × Endpoint × Change Map

| Endpoint | Method | Hook | Purpose |
|---|---|---|---|
| `/ai-care/chat` | POST | `useAiCareChat` | Send message / photo |
| `/ai-care/sessions/{uuid}/rate` | POST | `useRateSession` | Rate as helpful/not |

**Frontend changes needed:**

```typescript
// src/features/ai-care/api/ai-care.api.ts — CREATE FILE
import { api } from "@/lib/axios";

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
  return res.data;
  // Returns: { session_uuid, response, plant_identified, plant_confidence, suggested_products }
};

export const rateAiSessionApi = async (
  sessionUuid: string,
  rating: "helpful" | "not_helpful"
) => {
  const res = await api.post(`/ai-care/sessions/${sessionUuid}/rate`, { rating });
  return res.data;
};

// src/features/ai-care/hooks/useAiCareChat.ts — CREATE FILE
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { aiCareChatApi } from "../api/ai-care.api";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestedProducts?: any[];
  plantIdentified?: string;
}

export function useAiCareChat() {
  const [sessionUuid, setSessionUuid] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const mutation = useMutation({
    mutationFn: aiCareChatApi,
    onSuccess: (data, variables) => {
      // Save session UUID from first response
      if (!sessionUuid) setSessionUuid(data.session_uuid);

      // Add user message + AI response to local state
      setMessages((prev) => [
        ...prev,
        { role: "user", content: variables.message },
        {
          role: "assistant",
          content: data.response,
          suggestedProducts: data.suggested_products,
          plantIdentified: data.plant_identified,
        },
      ]);
    },
  });

  return {
    messages,
    sessionUuid,
    sendMessage: (message: string, photo?: File) =>
      mutation.mutate({ message, sessionUuid: sessionUuid ?? undefined, photo }),
    isLoading: mutation.isPending,
    error: (mutation.error as any)?.response?.data?.detail,
  };
}
```

---

## 8. Customer / Profile Module — File × Endpoint × Change Map

| Endpoint | Method | Hook | Purpose |
|---|---|---|---|
| `/customers/me` | GET | `useMe` | Get profile |
| `/customers/me` | PATCH | `useUpdateProfile` | Update profile |
| `/customers/me/addresses` | GET | `useAddresses` | List addresses |
| `/customers/me/addresses` | POST | `useAddAddress` | Add address |
| `/customers/me/addresses/{id}` | PATCH | `useUpdateAddress` | Update address |
| `/customers/me/addresses/{id}` | DELETE | `useDeleteAddress` | Delete address |
| `/customers/me/loyalty` | GET | `useLoyalty` | Points + tier |
| `/customers/me/wishlist` | GET | `useWishlist` | Wishlist |
| `/customers/me/wishlist/{id}` | POST | `useAddToWishlist` | Add to wishlist |
| `/customers/me/wishlist/{id}` | DELETE | `useRemoveWishlist` | Remove from wishlist |
| `/customers/me/plants` | GET | `useMyPlants` | My plants diary |
| `/customers/me/plants` | POST | `useAddPlant` | Add plant |
| `/customers/me/plants/{id}/log` | POST | `useAddPlantLog` | Log care action |

**Frontend changes needed:**

```typescript
// src/features/customer/api/customer.api.ts — CREATE FILE
import { api } from "@/lib/axios";

export const getProfileApi = async () => {
  const res = await api.get("/customers/me");
  return res.data;
};

export const updateProfileApi = async (data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dob?: string;
  aboutMe?: string;
}) => {
  const res = await api.patch("/customers/me", {
    first_name: data.firstName,
    last_name: data.lastName,
    phone: data.phone,
    dob: data.dob,
    about_me: data.aboutMe,
  });
  return res.data;
};

export const getAddressesApi = async () => {
  const res = await api.get("/customers/me/addresses");
  return res.data;
};

export const addAddressApi = async (address: {
  type: "home" | "work" | "other";
  label?: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}) => {
  const res = await api.post("/customers/me/addresses", {
    type: address.type,
    label: address.label,
    recipient_name: address.recipientName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    is_default: address.isDefault,
  });
  return res.data;
};

export const getLoyaltyApi = async () => {
  const res = await api.get("/customers/me/loyalty");
  return res.data;  // { points_balance, tier, lifetime_points, next_tier, points_to_next }
};

export const getWishlistApi = async () => {
  const res = await api.get("/customers/me/wishlist");
  return res.data;
};

export const addToWishlistApi = async (productId: string) => {
  const res = await api.post(`/customers/me/wishlist/${productId}`);
  return res.data;
};

export const removeFromWishlistApi = async (productId: string) => {
  const res = await api.delete(`/customers/me/wishlist/${productId}`);
  return res.data;
};

// src/features/customer/hooks/useWishlist.ts — CREATE FILE
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWishlistApi, addToWishlistApi, removeFromWishlistApi } from "../api/customer.api";

const WISHLIST_KEY = ["wishlist"];

export function useWishlist() {
  const qc = useQueryClient();

  const wishlist = useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: getWishlistApi,
    staleTime: 2 * 60 * 1000,
  });

  const add = useMutation({
    mutationFn: addToWishlistApi,
    // Optimistic update: add to local wishlist immediately
    onMutate: async (productId) => {
      await qc.cancelQueries({ queryKey: WISHLIST_KEY });
      const prev = qc.getQueryData(WISHLIST_KEY);
      qc.setQueryData(WISHLIST_KEY, (old: any) => ({
        ...old,
        items: [...(old?.items ?? []), { product_id: productId }],
      }));
      return { prev };
    },
    onError: (_, __, ctx) => qc.setQueryData(WISHLIST_KEY, ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: WISHLIST_KEY }),
  });

  const remove = useMutation({
    mutationFn: removeFromWishlistApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: WISHLIST_KEY }),
  });

  const isWishlisted = (productId: string) =>
    wishlist.data?.items?.some((i: any) => i.product_id === productId) ?? false;

  return {
    wishlist: wishlist.data,
    isWishlisted,
    addToWishlist: add.mutate,
    removeFromWishlist: remove.mutate,
    isLoading: wishlist.isLoading,
    isAdding: add.isPending,
    isRemoving: remove.isPending,
  };
}
```

---

## 9. Garden Services Module — File × Endpoint × Change Map

| Endpoint | Method | Hook | Purpose |
|---|---|---|---|
| `/garden-services/types` | GET | `useServiceTypes` | List service types |
| `/garden-services/bookings` | POST | `useCreateBooking` | Create booking |
| `/garden-services/bookings/{uuid}` | GET | `useBooking` | Booking detail |

**Frontend changes needed:**

```typescript
// src/features/garden/api/garden.api.ts — CREATE FILE
import { api } from "@/lib/axios";

export const getServiceTypesApi = async () => {
  const res = await api.get("/garden-services/types");
  return res.data;
};

export const createBookingApi = async (data: {
  serviceTypeId: number;
  guestName?: string;
  guestPhone: string;
  addressId?: string;
  scheduledDate: string;
  scheduledTimeFrom: string;
  city: string;
  pincode: string;
  addressFull: string;
  customerNotes?: string;
}) => {
  const res = await api.post("/garden-services/bookings", {
    service_type_id: data.serviceTypeId,
    guest_name: data.guestName,
    guest_phone: data.guestPhone,
    address_id: data.addressId,
    scheduled_date: data.scheduledDate,
    scheduled_time_from: data.scheduledTimeFrom,
    city: data.city,
    pincode: data.pincode,
    address_full: data.addressFull,
    customer_notes: data.customerNotes,
  });
  return res.data;
};

// src/features/garden/hooks/useGardenBooking.ts — CREATE FILE
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createBookingApi } from "../api/garden.api";

export function useGardenBooking() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: createBookingApi,
    onSuccess: (data) => router.push(`/garden-services/bookings/${data.uuid}`),
  });
  return {
    createBooking: mutation.mutate,
    isLoading: mutation.isPending,
    error: (mutation.error as any)?.response?.data?.detail,
  };
}
```


---

## 10. Complete File × Endpoint × Change Map (Master Table)

> Every frontend file, what backend endpoint it connects to, what the request looks like, and exactly what needs to change.

| # | Frontend File | Endpoint | Method | Request | Response Key Fields | What Changes |
|---|---|---|---|---|---|---|
| **AUTH** | | | | | | |
| 1 | `features/auth/api/auth.api.ts` | `/auth/register` | POST | `{first_name, last_name, email, phone, password}` | `{message}` | Create `registerApi()` function |
| 2 | `features/auth/api/auth.api.ts` | `/auth/login` | POST | form-encoded `username=&password=` | `{access_token, token_type}` | Create `loginApi()` — must use URLSearchParams |
| 3 | `features/auth/api/auth.api.ts` | `/auth/verify-otp` | POST | `{email, otp}` | `{message}` | Create `verifyOtpApi()` |
| 4 | `features/auth/api/auth.api.ts` | `/auth/resend-otp` | POST | `{email}` | `{message}` | Create `resendOtpApi()` |
| 5 | `features/auth/api/auth.api.ts` | `/auth/forgot-password` | POST | `{email}` | `{message}` (always 200) | Create `forgotPasswordApi()` |
| 6 | `features/auth/api/auth.api.ts` | `/auth/reset-password` | POST | `{token, new_password}` | `{message}` | Create `resetPasswordApi()` |
| 7 | `features/auth/api/auth.api.ts` | `/auth/refresh` | POST | cookie (HttpOnly) | `{access_token}` | Create `refreshTokenApi()` — called by Axios interceptor |
| 8 | `features/auth/api/auth.api.ts` | `/auth/logout` | POST | — | `{message}` | Create `logoutApi()` |
| 9 | `features/auth/api/auth.api.ts` | `/customers/me` | GET | — (Bearer token) | `{uuid, first_name, email...}` | Create `getMeApi()` — called after login |
| 10 | `features/auth/hooks/useSignUp.ts` | via `registerApi` | — | — | — | Create hook; redirect to `/verify-email?email=` on success |
| 11 | `features/auth/hooks/useVerifyOtp.ts` | via `verifyOtpApi` | — | — | — | Create hook; manage OTP timer + resend cooldown |
| 12 | `features/auth/hooks/useLogin.ts` | via `loginApi` + `getMeApi` | — | — | — | Create hook; store token; fetch profile; redirect to `returnTo` |
| 13 | `features/auth/hooks/useForgotPassword.ts` | via `forgotPasswordApi` | — | — | — | Create hook; always show success (anti-enumeration) |
| 14 | `features/auth/hooks/useResetPassword.ts` | via `resetPasswordApi` | — | — | — | Create hook; read token from URL; handle 400 = expired |
| 15 | `features/auth/components/SignUpForm.tsx` | — | — | — | — | Wire `useSignUp` hook; map `statusCode === 409` to email field error |
| 16 | `features/auth/components/OtpInput.tsx` | — | — | — | — | Auto-advance; paste; `onComplete` calls `verify(otp)` |
| 17 | `features/auth/components/LoginForm.tsx` | — | — | — | — | Wire `useLogin`; show global error banner (not field-level) |
| 18 | `features/auth/schemas/auth.schema.ts` | — | — | — | — | Create all 5 Zod schemas |
| 19 | `store/auth.store.ts` | — | — | — | — | Create Zustand store; `setAccessToken` writes to `globalThis.__accessToken` |
| 20 | `lib/axios.ts` | — | — | — | — | Create Axios instance; request interceptor (token); response interceptor (silent refresh) |
| 21 | `middleware.ts` | — | — | — | — | Create Next.js edge middleware for route protection |
| **PRODUCTS** | | | | | | |
| 22 | `features/products/api/products.api.ts` | `/products/` | GET | query params (filters, sort, page) | `{items[], total, pages}` | Create `getProductsApi(filters)` |
| 23 | `features/products/api/products.api.ts` | `/products/{slug}` | GET | — | full product + images + variants + care | Create `getProductBySlugApi(slug)` |
| 24 | `features/products/api/products.api.ts` | `/categories/` | GET | — | `{categories[]}` | Create `getCategoriesApi()` |
| 25 | `features/products/api/products.api.ts` | `/collections/` | GET | — | `{collections[]}` | Create `getCollectionsApi()` |
| 26 | `features/products/api/products.api.ts` | `/collections/{slug}` | GET | — | `{items[]}` | Create `getCollectionProductsApi(slug)` |
| 27 | `features/products/hooks/useProducts.ts` | via `getProductsApi` | — | — | — | Create hook; `queryKey: ["products", filters]`; auto-refetch on filter change |
| 28 | `features/products/hooks/useProduct.ts` | via `getProductBySlugApi` | — | — | — | Create hook; `staleTime: 60s` |
| 29 | `features/search/api/search.api.ts` | `/search/` | GET | `?q=&page=` | `{items[]}` | Create `searchApi()` |
| 30 | `features/search/hooks/useSearch.ts` | via `searchApi` | — | — | — | Create hook; `enabled: query.length >= 2`; 300ms debounce |
| 31 | `app/(storefront)/plants/page.tsx` | via `useProducts` | — | — | — | Read filters from URL params; pass to hook |
| 32 | `app/(storefront)/plants/[slug]/page.tsx` | via `useProduct` | — | — | — | Read `slug` from params; render all PDP sections |
| **CART** | | | | | | |
| 33 | `features/cart/api/cart.api.ts` | `/cart/` | GET | — (Bearer) | `{items[], subtotal, total, discount}` | Create `getCartApi()` |
| 34 | `features/cart/api/cart.api.ts` | `/cart/items/` | POST | `{variant_id, quantity}` | updated cart | Create `addToCartApi()` |
| 35 | `features/cart/api/cart.api.ts` | `/cart/items/{id}` | PATCH | `{quantity}` | updated cart | Create `updateCartItemApi()` |
| 36 | `features/cart/api/cart.api.ts` | `/cart/items/{id}` | DELETE | — | updated cart | Create `removeCartItemApi()` |
| 37 | `features/cart/api/cart.api.ts` | `/cart/apply-discount` | POST | `{code}` | `{discount_amount, discount_code}` | Create `applyDiscountApi()` |
| 38 | `features/cart/api/cart.api.ts` | `/cart/remove-discount` | DELETE | — | updated cart | Create `removeDiscountApi()` |
| 39 | `features/cart/hooks/useCart.ts` | all cart APIs | — | — | — | Create unified hook; `qc.invalidateQueries(["cart"])` after every mutation |
| 40 | `components/cart/CartSidebar.tsx` | via `useCart` | — | — | — | Wire up; show items, totals, discount field |
| 41 | `components/cart/AddToCartButton.tsx` | via `useCart.addItem` | — | — | — | Wire up; pass `variantId`; show loading state |
| **ORDERS** | | | | | | |
| 42 | `features/orders/api/orders.api.ts` | `/orders/` | POST | `{address_id, discount_code, loyalty_points_to_use}` | `{order_id, razorpay_order_id, razorpay_key_id, total}` | Create `createOrderApi()` |
| 43 | `features/orders/api/orders.api.ts` | `/orders/{uuid}/verify-payment` | POST | `{razorpay_order_id, razorpay_payment_id, razorpay_signature}` | `{message, order_number}` | Create `verifyPaymentApi()` |
| 44 | `features/orders/api/orders.api.ts` | `/orders/` | GET | `?page=&status=` | `{items[], total}` | Create `getMyOrdersApi()` |
| 45 | `features/orders/api/orders.api.ts` | `/orders/{uuid}` | GET | — | full order + items + status_history | Create `getOrderApi()` |
| 46 | `features/orders/api/orders.api.ts` | `/orders/{uuid}/cancel` | POST | `{reason}` | `{message}` | Create `cancelOrderApi()` |
| 47 | `features/orders/api/orders.api.ts` | `/orders/{uuid}/return` | POST | `{reason, return_type}` | `{message}` | Create `createReturnApi()` |
| 48 | `features/orders/hooks/useCheckout.ts` | via `createOrderApi` + Razorpay | — | — | — | Create hook; open Razorpay modal; verify on success; clear cart |
| 49 | `features/orders/hooks/useMyOrders.ts` | via `getMyOrdersApi` | — | — | — | Create hook |
| 50 | `features/orders/hooks/useOrder.ts` | via `getOrderApi` | — | — | — | Create hook; poll every 30s while in-transit |
| 51 | `app/(storefront)/checkout/page.tsx` | via `useCheckout` | — | — | — | Wire checkout form; call `placeOrder()` |
| 52 | `app/(storefront)/orders/page.tsx` | via `useMyOrders` | — | — | — | List orders with status badges |
| 53 | `app/(storefront)/orders/[uuid]/page.tsx` | via `useOrder` | — | — | — | Show timeline, items, tracking |
| **REVIEWS** | | | | | | |
| 54 | `features/reviews/api/reviews.api.ts` | `/products/{slug}/reviews` | GET | `?page=&rating=` | `{items[], total}` | Create `getProductReviewsApi()` |
| 55 | `features/reviews/api/reviews.api.ts` | `/reviews/` | POST | FormData: `{product_id, rating, body, photos[]}` | `{message}` | Create `submitReviewApi()` — multipart |
| 56 | `features/reviews/api/reviews.api.ts` | `/reviews/{id}/helpful` | POST | `{rating}` | `{message}` | Create `markHelpfulApi()` |
| 57 | `features/reviews/api/reviews.api.ts` | `/reviews/{id}/flag` | POST | `{reason}` | `{message}` | Create `flagReviewApi()` |
| 58 | `features/reviews/hooks/useProductReviews.ts` | via `getProductReviewsApi` | — | — | — | Create hook |
| 59 | `features/reviews/hooks/useSubmitReview.ts` | via `submitReviewApi` | — | — | — | Create hook; invalidate reviews on success |
| **AI CARE** | | | | | | |
| 60 | `features/ai-care/api/ai-care.api.ts` | `/ai-care/chat` | POST | FormData: `{message, session_uuid?, photo?}` | `{session_uuid, response, plant_identified, suggested_products[]}` | Create `aiCareChatApi()` — multipart |
| 61 | `features/ai-care/api/ai-care.api.ts` | `/ai-care/sessions/{uuid}/rate` | POST | `{rating}` | `{message}` | Create `rateAiSessionApi()` |
| 62 | `features/ai-care/hooks/useAiCareChat.ts` | via `aiCareChatApi` | — | — | — | Create hook; manage `messages[]` state + `sessionUuid` |
| 63 | `app/(storefront)/ai-care/page.tsx` | via `useAiCareChat` | — | — | — | Wire chat UI; photo upload; show suggestions |
| **CUSTOMER** | | | | | | |
| 64 | `features/customer/api/customer.api.ts` | `/customers/me` | GET | — | profile object | Create `getProfileApi()` |
| 65 | `features/customer/api/customer.api.ts` | `/customers/me` | PATCH | profile fields | updated profile | Create `updateProfileApi()` |
| 66 | `features/customer/api/customer.api.ts` | `/customers/me/addresses` | GET | — | `{addresses[]}` | Create `getAddressesApi()` |
| 67 | `features/customer/api/customer.api.ts` | `/customers/me/addresses` | POST | address fields | new address | Create `addAddressApi()` |
| 68 | `features/customer/api/customer.api.ts` | `/customers/me/addresses/{id}` | PATCH | address fields | updated | Create `updateAddressApi()` |
| 69 | `features/customer/api/customer.api.ts` | `/customers/me/addresses/{id}` | DELETE | — | `{message}` | Create `deleteAddressApi()` |
| 70 | `features/customer/api/customer.api.ts` | `/customers/me/loyalty` | GET | — | `{points_balance, tier}` | Create `getLoyaltyApi()` |
| 71 | `features/customer/api/customer.api.ts` | `/customers/me/wishlist` | GET | — | `{items[]}` | Create `getWishlistApi()` |
| 72 | `features/customer/api/customer.api.ts` | `/customers/me/wishlist/{id}` | POST | — | `{message}` | Create `addToWishlistApi()` |
| 73 | `features/customer/api/customer.api.ts` | `/customers/me/wishlist/{id}` | DELETE | — | `{message}` | Create `removeFromWishlistApi()` |
| 74 | `features/customer/api/customer.api.ts` | `/customers/me/plants` | GET | — | `{plants[]}` | Create `getMyPlantsApi()` |
| 75 | `features/customer/api/customer.api.ts` | `/customers/me/plants` | POST | plant data | new plant | Create `addPlantApi()` |
| 76 | `features/customer/api/customer.api.ts` | `/customers/me/plants/{id}/log` | POST | `{type, note}` | care log | Create `addPlantLogApi()` |
| 77 | `features/customer/hooks/useWishlist.ts` | all wishlist APIs | — | — | — | Create hook with optimistic updates |
| 78 | `features/customer/hooks/useProfile.ts` | `getProfileApi` + `updateProfileApi` | — | — | — | Create hook; `queryKey: ["me"]` |
| 79 | `features/customer/hooks/useLoyalty.ts` | `getLoyaltyApi` | — | — | — | Create hook |
| 80 | `app/(storefront)/account/page.tsx` | via `useProfile` | — | — | — | Render profile form |
| 81 | `app/(storefront)/account/addresses/page.tsx` | via `useAddresses` | — | — | — | Render address list |
| **GARDEN SERVICES** | | | | | | |
| 82 | `features/garden/api/garden.api.ts` | `/garden-services/types` | GET | — | `{types[]}` | Create `getServiceTypesApi()` |
| 83 | `features/garden/api/garden.api.ts` | `/garden-services/bookings` | POST | booking data | `{uuid, booking_number}` | Create `createBookingApi()` |
| 84 | `features/garden/api/garden.api.ts` | `/garden-services/bookings/{uuid}` | GET | — | full booking | Create `getBookingApi()` |
| 85 | `features/garden/hooks/useGardenBooking.ts` | via `createBookingApi` | — | — | — | Create hook; redirect to booking detail on success |

---

## 11. Global Error Handling

### 11.1 Centralised Error Types

```typescript
// src/lib/errors.ts — CREATE FILE
export interface ApiError {
  detail: string;           // FastAPI error message
  status: number;           // HTTP status code
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
  if (status >= 500)  return "Something went wrong. Please try again.";

  // Use FastAPI detail message if available
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    // Pydantic validation errors — format the first one
    return detail[0]?.msg ?? "Validation error.";
  }

  return "An unexpected error occurred.";
}
```

### 11.2 Global Error Boundary (`src/components/ErrorBoundary.tsx`)

```typescript
// ADD to root layout — catches any unhandled render errors
"use client";
import { Component, ReactNode } from "react";

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-bold text-[#1c1c1c]">Something went wrong.</p>
            <button onClick={() => this.setState({ hasError: false })}
              className="mt-4 text-[#00b566] underline">
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### 11.3 Toast Notification Hook (`src/hooks/useToast.ts`)

```typescript
// Lightweight toast hook — no extra library needed
// ADD: integrate with any toast library (react-hot-toast, sonner)
import { toast } from "sonner";  // or react-hot-toast

export function useToast() {
  return {
    success: (msg: string) => toast.success(msg),
    error: (msg: string) => toast.error(msg),
    info: (msg: string) => toast(msg),
  };
}

// USE IN MUTATIONS:
// In useCart.ts addItem mutation:
const { success, error } = useToast();
const addItem = useMutation({
  mutationFn: addToCartApi,
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: CART_KEY });
    success("Added to cart! 🌿");
  },
  onError: (err) => error(getErrorMessage(err)),
});
```

---

## 12. Data Flow Diagrams

### 12.1 Sign Up → OTP → Verified Flow

```
User fills SignUpForm
       │
       ▼ onSubmit
useSignUp.signUp(data)
       │
       ▼ calls
registerApi() → POST /auth/register
       │
  ┌────┴────────────────────┐
  │ 201 OK                  │ 409 Conflict
  ▼                         ▼
router.push(              SignUpForm shows
  /verify-email           email field error:
  ?email=...              "Email already exists"
)
       │
       ▼ User on OTP page
useVerifyOtp hook starts
OTP timer (600s)
Resend cooldown (60s)
       │
User types 6 digits
OtpInput auto-calls
onComplete(otp)
       │
       ▼ calls
verifyOtpApi(email, otp) → POST /auth/verify-otp
       │
  ┌────┴────────────────────┐
  │ 200 OK                  │ 400 Wrong OTP
  ▼                         ▼
router.push("/")          OtpInput shakes
(homepage)                Boxes clear
                          Error msg shown
                          Focus → box 1
```

### 12.2 Login → Protected Page Flow

```
User fills LoginForm
       │
       ▼ onSubmit
useLogin.login(email, password)
       │
       ▼ calls (form-encoded!)
loginApi() → POST /auth/login
       │
  ┌────┴────────────────────────────┐
  │ 200 OK                          │ 401 / 403
  │ { access_token }                ▼
  ▼                         Global error banner
setAccessToken(token)       shown above form
globalThis.__accessToken = token
       │
       ▼ then
getMeApi() → GET /customers/me
(token now in Axios interceptor)
       │
       ▼
setUser(profile)
       │
       ▼
router.push(returnTo)  ← "/checkout", "/account", etc.
```

### 12.3 Add to Cart → Checkout → Payment Flow

```
User clicks [Add to Cart]
       │
       ▼
useCart.addItem({ variantId, quantity: 1 })
       │
       ▼ calls
addToCartApi() → POST /cart/items/
       │
       ▼ onSuccess
qc.invalidateQueries(["cart"])
CartSidebar refetches → shows updated cart
Toast: "Added to cart! 🌿"
       │
       ▼ User clicks [Checkout]
app/checkout/page.tsx
       │
       ▼ User fills address, clicks [Place Order]
useCheckout.placeOrder(payload)
       │
       ▼ calls
createOrderApi() → POST /orders/
       │
       ▼ Response includes
{ razorpay_order_id, razorpay_key_id, total }
       │
       ▼ Opens Razorpay modal
new Razorpay({ key, order_id, amount ... }).open()
       │
  ┌────┴──────────────────────────────┐
  │ Payment success                   │ Payment failed / dismissed
  │ handler(paymentData)              ▼
  ▼                           Show error: "Payment failed"
verifyPaymentApi(uuid, data)  User can retry
→ POST /orders/{uuid}/verify-payment
       │
       ▼ onSuccess
qc.invalidateQueries(["cart"])  ← clear cart
router.push(/orders/{uuid}/success)
```

### 12.4 Silent Token Refresh Flow (Axios Interceptor)

```
Any API call with expired access_token
       │
       ▼ Server returns 401
Axios response interceptor catches it
       │
isRefreshing = false? → true
       │
       ▼ calls
POST /auth/refresh (with HttpOnly cookie)
       │
  ┌────┴──────────────────────────────┐
  │ 200 OK                            │ 401 (refresh expired)
  │ { access_token: newToken }        ▼
  ▼                           clearToken()
globalThis.__accessToken = newToken   router.push("/login")
processQueue(null, newToken)
       │
       ▼
All queued requests replay
with new Authorization header
isRefreshing = false
```

---

## 13. Complete Folder Structure (What to Create)

```
src/
├── app/
│   ├── layout.tsx                      CHANGE: wrap with <Providers>
│   ├── providers.tsx                   CREATE: TanStack Query + Zustand provider
│   ├── (auth)/
│   │   ├── layout.tsx                  CREATE: slim nav + footer
│   │   ├── signup/page.tsx             CREATE: renders SignUpForm
│   │   ├── verify-email/page.tsx       CREATE: renders OtpInput + useVerifyOtp
│   │   ├── login/page.tsx              CREATE: renders LoginForm
│   │   ├── forgot-password/page.tsx    CREATE: renders ForgotPasswordForm
│   │   └── reset-password/page.tsx     CREATE: renders ResetPasswordForm
│   └── (storefront)/
│       ├── page.tsx                    CHANGE: homepage — add useProducts for featured
│       ├── plants/
│       │   ├── page.tsx                CHANGE: wire useProducts + filter params
│       │   └── [slug]/page.tsx         CHANGE: wire useProduct
│       ├── cart/page.tsx               CHANGE: wire useCart
│       ├── checkout/page.tsx           CHANGE: wire useCheckout + Razorpay
│       ├── orders/
│       │   ├── page.tsx                CREATE: wire useMyOrders
│       │   └── [uuid]/page.tsx         CREATE: wire useOrder
│       ├── ai-care/page.tsx            CHANGE: wire useAiCareChat
│       ├── garden-services/
│       │   ├── page.tsx                CHANGE: wire useServiceTypes
│       │   └── book/page.tsx           CREATE: wire useGardenBooking
│       └── account/
│           ├── page.tsx                CHANGE: wire useProfile
│           ├── orders/page.tsx         CHANGE: wire useMyOrders
│           ├── addresses/page.tsx      CHANGE: wire useAddresses
│           ├── wishlist/page.tsx       CHANGE: wire useWishlist
│           ├── loyalty/page.tsx        CREATE: wire useLoyalty
│           └── plants/page.tsx         CREATE: wire useMyPlants
│
├── features/
│   ├── auth/
│   │   ├── api/auth.api.ts             CREATE: 10 API functions
│   │   ├── components/
│   │   │   ├── SignUpForm.tsx           CREATE: wire useSignUp
│   │   │   ├── OtpInput.tsx            CREATE: 6-box component
│   │   │   ├── LoginForm.tsx           CREATE: wire useLogin
│   │   │   ├── ForgotPasswordForm.tsx  CREATE: wire useForgotPassword
│   │   │   ├── ResetPasswordForm.tsx   CREATE: wire useResetPassword
│   │   │   └── PasswordStrengthBar.tsx CREATE: 4-level bar
│   │   ├── hooks/
│   │   │   ├── useSignUp.ts            CREATE
│   │   │   ├── useVerifyOtp.ts         CREATE: timers + mutations
│   │   │   ├── useLogin.ts             CREATE
│   │   │   ├── useForgotPassword.ts    CREATE
│   │   │   └── useResetPassword.ts     CREATE
│   │   └── schemas/auth.schema.ts      CREATE: 5 Zod schemas
│   │
│   ├── products/
│   │   ├── api/products.api.ts         CREATE: getProducts, getProduct, getCategories
│   │   └── hooks/
│   │       ├── useProducts.ts          CREATE
│   │       └── useProduct.ts           CREATE
│   │
│   ├── search/
│   │   ├── api/search.api.ts           CREATE
│   │   └── hooks/useSearch.ts          CREATE
│   │
│   ├── cart/
│   │   ├── api/cart.api.ts             CREATE: 6 cart API functions
│   │   └── hooks/useCart.ts            CREATE: unified cart hook
│   │
│   ├── orders/
│   │   ├── api/orders.api.ts           CREATE: 6 order API functions
│   │   └── hooks/
│   │       ├── useCheckout.ts          CREATE: Razorpay integration
│   │       ├── useMyOrders.ts          CREATE
│   │       └── useOrder.ts             CREATE: polling
│   │
│   ├── reviews/
│   │   ├── api/reviews.api.ts          CREATE: 4 review API functions
│   │   └── hooks/
│   │       ├── useProductReviews.ts    CREATE
│   │       └── useSubmitReview.ts      CREATE
│   │
│   ├── ai-care/
│   │   ├── api/ai-care.api.ts          CREATE: chat + rate
│   │   └── hooks/useAiCareChat.ts      CREATE: messages state + session
│   │
│   ├── customer/
│   │   ├── api/customer.api.ts         CREATE: 13 customer API functions
│   │   └── hooks/
│   │       ├── useProfile.ts           CREATE
│   │       ├── useAddresses.ts         CREATE
│   │       ├── useWishlist.ts          CREATE: optimistic updates
│   │       ├── useLoyalty.ts           CREATE
│   │       └── useMyPlants.ts          CREATE
│   │
│   └── garden/
│       ├── api/garden.api.ts           CREATE: 3 garden API functions
│       └── hooks/useGardenBooking.ts   CREATE
│
├── store/
│   └── auth.store.ts                   CREATE: Zustand auth state
│
├── lib/
│   ├── axios.ts                        CREATE: base instance + interceptors
│   ├── queryClient.ts                  CREATE: TanStack Query client
│   └── errors.ts                       CREATE: error message mapping
│
├── hooks/
│   ├── useDebounce.ts                  CREATE: 300ms debounce for search
│   └── useToast.ts                     CREATE: toast notifications
│
├── components/
│   └── ErrorBoundary.tsx               CREATE
│
└── middleware.ts                       CREATE: route protection
```

---

## 14. Quick Reference — API Base URLs & Headers

```typescript
// Every request goes to:
BASE: process.env.NEXT_PUBLIC_API_URL + "/api/v1"

// ── Headers per endpoint type ─────────────────────────────────────────
// Standard JSON request (most endpoints):
headers: { "Content-Type": "application/json" }

// Login ONLY (FastAPI OAuth2 form):
headers: { "Content-Type": "application/x-www-form-urlencoded" }
body: new URLSearchParams({ username: email, password })

// File upload (review photos, AI care photos):
headers: { "Content-Type": "multipart/form-data" }
body: FormData

// Authenticated requests (added by Axios interceptor automatically):
headers: { "Authorization": "Bearer <access_token>" }

// ── Cookie ────────────────────────────────────────────────────────────
// refresh_token is sent automatically via:
withCredentials: true  // on the Axios instance

// ── Backend expects snake_case; Frontend uses camelCase ───────────────
// Always convert in API layer:
// firstName → first_name
// addressId → address_id
// newPassword → new_password
```

---

## 15. Final Connection Summary

```
Hero Plant Store — Frontend ↔ Backend API Connection Map v1.0
════════════════════════════════════════════════════════════════
FILES TO CREATE:  52 new files
FILES TO CHANGE:  8 existing files
TOTAL ENDPOINTS:  48 backend endpoints connected
TOTAL API FUNCS:  48 typed API functions
TOTAL HOOKS:      28 custom React hooks
TOTAL SCHEMAS:    5 Zod validation schemas
TOTAL STORES:     1 Zustand store (auth)

MODULE BREAKDOWN:
  Auth           10 endpoints · 5 hooks · 5 schemas · 6 components
  Products        5 endpoints · 2 hooks
  Search          1 endpoint  · 1 hook
  Cart            6 endpoints · 1 hook
  Orders          6 endpoints · 3 hooks (incl. Razorpay)
  Reviews         4 endpoints · 2 hooks
  AI Care         2 endpoints · 1 hook
  Customer       13 endpoints · 5 hooks
  Garden          3 endpoints · 1 hook

KEY ARCHITECTURAL RULES:
  ✓ All API calls go through src/lib/axios.ts (single instance)
  ✓ Access token stored in memory only (globalThis.__accessToken)
  ✓ Refresh token in HttpOnly cookie (sent via withCredentials: true)
  ✓ Silent refresh handled by Axios response interceptor (no manual logic in components)
  ✓ All mutations use useMutation from TanStack Query
  ✓ All queries use useQuery (auto-caching, background refetch)
  ✓ Cart/wishlist use invalidateQueries after every mutation
  ✓ Wishlist uses optimistic updates for instant UI feedback
  ✓ Order tracking uses polling (30s) while in-transit
  ✓ Login uses application/x-www-form-urlencoded (FastAPI OAuth2)
  ✓ File uploads use FormData (reviews, AI care photos)
  ✓ Backend snake_case ↔ Frontend camelCase conversion in API layer only
  ✓ Error messages extracted in hooks; never raw in components
  ✓ Route protection in middleware.ts (edge, no client-side flash)
  ✓ Forgot password always shows success (anti-email-enumeration)

════════════════════════════════════════════════════════════════
Last updated: June 2026
```

---

*Document version: 1.0 (complete)*
*Frontend API Connection Map — Hero Plant Store*
*Stack: Next.js 14 · TypeScript · TanStack Query · Axios · Zustand · Zod*
*Backend: FastAPI · MySQL 8.0 · Redis · Celery*
*Last updated: June 2026*
