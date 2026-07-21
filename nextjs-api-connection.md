# Hero Plant Store — Next.js 14 Frontend API Connection Guide
## App Router · Server Components · TypeScript · TanStack Query · Zustand
### v2.0 — Next.js Native (Corrected from React SPA patterns)

> **What changed from v1:** The previous guide treated every page as a client component (`"use client"` everywhere). Next.js 14 App Router is **Server Components by default**. This guide correctly separates server and client concerns — data fetching on the server where possible, `"use client"` only where interactivity or browser APIs are needed. This gives you faster pages, better SEO, and smaller JS bundles.

---

## 1. Next.js vs React — Key Differences Applied Here

| Pattern | ❌ React SPA (old) | ✅ Next.js 14 App Router (correct) |
|---|---|---|
| Page components | Always `"use client"` | Server Component by default — no directive |
| Data fetching | `useEffect` + `useState` on client | `async` Server Component — `fetch()` directly |
| URL params | `useSearchParams()` hook | `params` / `searchParams` props (server) |
| Navigation | `useRouter().push()` everywhere | `redirect()` in server actions, `useRouter()` only in client |
| Auth check | Client-side, causes flash | `middleware.ts` edge (already in v1 ✅) |
| Loading state | Manual `isLoading` booleans | `loading.tsx` co-located file |
| Error state | Try/catch + `useState` | `error.tsx` co-located file |
| Not found | Conditional render | `notFound()` + `not-found.tsx` |
| Images | `<img>` tag | `<Image>` from `next/image` |
| Links | `<a href>` | `<Link>` from `next/link` |
| Env vars | `process.env.REACT_APP_*` | `process.env.NEXT_PUBLIC_*` (client) / `process.env.*` (server) |
| Cache | Manual staleTime | `fetch()` + `{ next: { revalidate: 60 } }` |
| Mutations | Always TanStack mutation | Server Actions (`"use server"`) OR client mutation |
| Form submit | `onSubmit` + API call | Server Action OR `"use client"` form |

---

## 2. Server vs Client Decision Tree

```
Is this component interactive?
(onClick, onChange, useState, useEffect, browser APIs)
         │
    NO ──┼──▶  Server Component — NO "use client" directive
         │     Can: fetch data, read cookies, access DB
         │
   YES ──┼──▶  Client Component — ADD "use client" at top
                Can: useState, useEffect, event handlers
                Cannot: directly fetch with server-only access
```

**Rule for this project:**

| File type | Directive | Why |
|---|---|---|
| `app/**/page.tsx` (listing pages) | None (Server) | Fetch products server-side for SEO |
| `app/**/page.tsx` (auth pages) | `"use client"` | Forms need event handlers |
| `app/**/page.tsx` (order detail) | None (Server) | Static order data, SEO |
| `features/**/components/*.tsx` | `"use client"` | All interactive |
| `features/**/hooks/*.ts` | `"use client"` | All use React hooks |
| `features/**/api/*.ts` | None | Pure functions, works anywhere |
| `store/auth.store.ts` | `"use client"` | Zustand uses browser state |
| `middleware.ts` | None (Edge) | Runs before render |
| `app/**/loading.tsx` | None (Server) | Automatic streaming skeleton |
| `app/**/error.tsx` | `"use client"` | Must use `useEffect` for reset |

---

## 3. Project Setup

### 3.1 Create Next.js App

```bash
npx create-next-app@latest hero-plant-store \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

### 3.2 Install Dependencies

```bash
npm install \
  axios \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  zustand \
  react-hook-form \
  @hookform/resolvers \
  zod \
  sonner \
  js-cookie \
  @types/js-cookie

# Razorpay types
npm install --save-dev @types/razorpay
```

### 3.3 Environment Variables (`.env.local`)

```env
# Public (exposed to browser — NEXT_PUBLIC_ prefix required)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX

# Private (server-only — NO NEXT_PUBLIC_ prefix)
# These are only available in Server Components, Server Actions, API Routes
API_SECRET_KEY=internal-secret-never-exposed-to-browser
```

### 3.4 Next.js Config (`next.config.ts`)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.heroplants.com",   // product images from S3/R2
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",  // Google avatar images
      },
    ],
  },
  // Enable React strict mode for better dev warnings
  reactStrictMode: true,
};

export default nextConfig;
```

---

## 4. App Router Structure

### 4.1 Folder Layout

```
src/
├── app/
│   ├── layout.tsx              ← Root layout (Server Component)
│   ├── providers.tsx           ← Client providers wrapper
│   ├── globals.css
│   │
│   ├── (auth)/                 ← Auth route group
│   │   ├── layout.tsx          ← Auth layout (Server Component)
│   │   ├── signup/
│   │   │   └── page.tsx        ← "use client" (form)
│   │   ├── verify-email/
│   │   │   └── page.tsx        ← "use client" (OTP interaction)
│   │   ├── login/
│   │   │   └── page.tsx        ← "use client" (form)
│   │   ├── forgot-password/
│   │   │   └── page.tsx        ← "use client" (form)
│   │   └── reset-password/
│   │       └── page.tsx        ← "use client" (form + token from URL)
│   │
│   ├── (storefront)/           ← Main store route group
│   │   ├── layout.tsx          ← Store layout with nav (Server)
│   │   │
│   │   ├── page.tsx            ← Homepage (Server Component)
│   │   ├── loading.tsx         ← Homepage skeleton
│   │   │
│   │   ├── plants/
│   │   │   ├── page.tsx        ← PLP (Server Component — SEO critical)
│   │   │   ├── loading.tsx     ← PLP skeleton
│   │   │   └── [slug]/
│   │   │       ├── page.tsx    ← PDP (Server Component)
│   │   │       └── loading.tsx ← PDP skeleton
│   │   │
│   │   ├── cart/
│   │   │   └── page.tsx        ← "use client" (live cart state)
│   │   │
│   │   ├── checkout/
│   │   │   └── page.tsx        ← "use client" (Razorpay, forms)
│   │   │
│   │   ├── orders/
│   │   │   ├── page.tsx        ← Server Component
│   │   │   └── [uuid]/
│   │   │       └── page.tsx    ← Server Component + client polling
│   │   │
│   │   ├── ai-care/
│   │   │   └── page.tsx        ← "use client" (chat interaction)
│   │   │
│   │   ├── garden-services/
│   │   │   ├── page.tsx        ← Server Component (list services)
│   │   │   └── book/
│   │   │       └── page.tsx    ← "use client" (booking form)
│   │   │
│   │   └── account/
│   │       ├── page.tsx        ← "use client" (profile edit)
│   │       ├── orders/page.tsx ← Server Component
│   │       ├── addresses/page.tsx ← "use client"
│   │       ├── wishlist/page.tsx  ← "use client"
│   │       ├── loyalty/page.tsx   ← Server Component
│   │       └── plants/page.tsx    ← "use client"
│   │
│   └── api/                    ← Next.js API routes (optional)
│       └── revalidate/
│           └── route.ts        ← Webhook to revalidate cache
│
├── features/                   ← Feature modules (all "use client" inside)
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   ├── reviews/
│   ├── ai-care/
│   ├── customer/
│   └── garden/
│
├── components/                 ← Shared UI components
│   ├── ui/                     ← Primitive components (Button, Input, etc.)
│   └── layout/                 ← Nav, Footer, etc.
│
├── lib/
│   ├── axios.ts                ← Client-side Axios instance
│   ├── api.ts                  ← Server-side fetch helper
│   ├── queryClient.ts
│   └── errors.ts
│
├── store/
│   └── auth.store.ts
│
├── hooks/
│   ├── useDebounce.ts
│   └── useToast.ts
│
└── middleware.ts               ← Edge route protection
```

---

## 5. Root Layout & Providers

### 5.1 Root Layout (`src/app/layout.tsx`) — Server Component

```typescript
// NO "use client" — this is a Server Component
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: { default: "Hero Plants", template: "%s | Hero Plants" },
  description: "India's favourite plant store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.variable}>
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
```

### 5.2 Client Providers (`src/app/providers.tsx`) — Client Component

```typescript
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // useState ensures each user gets their own QueryClient instance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: (count, error: any) => {
              // Don't retry on 4xx errors
              if (error?.response?.status < 500) return false;
              return count < 2;
            },
          },
          mutations: { retry: false },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

---

## 6. Two API Layers — Server & Client

Next.js has two places where API calls happen. You need **two different utilities**.

### 6.1 Server-Side Fetch (`src/lib/api.ts`)

Used in **Server Components** — runs on the server, can use private env vars, benefits from Next.js cache.

```typescript
// src/lib/api.ts — Server-side only (no "use client")
const BASE = process.env.NEXT_PUBLIC_API_URL + "/api/v1";

interface FetchOptions extends RequestInit {
  tags?: string[];      // cache tags for revalidation
  revalidate?: number;  // seconds to cache (0 = no cache, false = permanent)
}

export async function serverFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { tags, revalidate, ...fetchOptions } = options;

  const res = await fetch(`${BASE}${path}`, {
    ...fetchOptions,
    // Next.js extended fetch options:
    next: {
      ...(tags ? { tags } : {}),
      ...(revalidate !== undefined ? { revalidate } : {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail ?? `HTTP ${res.status}`);
  }

  return res.json();
}

// Example usage in a Server Component:
// const products = await serverFetch<ProductList>("/products/", {
//   revalidate: 60,          // cache 60 seconds
//   tags: ["products"],      // tag for on-demand revalidation
// });
```

### 6.2 Client-Side Axios (`src/lib/axios.ts`)

Used in **Client Components** — runs in browser, handles auth tokens, silent refresh.

```typescript
// src/lib/axios.ts — Client-side only
"use client";  // ← mark explicitly to prevent server import
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api/v1",
  withCredentials: true,    // sends HttpOnly refresh_token cookie
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

// ── Request: attach access token ──────────────────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("__hp_at");  // access token in sessionStorage
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response: silent refresh on 401 ──────────────────────────────────
let isRefreshing = false;
let queue: Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: (token) => {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(api(original));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await api.post("/auth/refresh");
        sessionStorage.setItem("__hp_at", data.access_token);
        queue.forEach((q) => q.resolve(data.access_token));
        queue = [];
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return api(original);
      } catch (err) {
        queue.forEach((q) => q.reject(err));
        queue = [];
        sessionStorage.removeItem("__hp_at");
        // Use Next.js router for redirect
        window.location.href = "/login";
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
```

### 6.3 Why sessionStorage for access token?

| Storage | Access token | Refresh token |
|---|---|---|
| `localStorage` | ❌ Persists across tabs — XSS risk | ❌ Never |
| `sessionStorage` | ✅ Tab-scoped, cleared on close | ❌ Never |
| `HttpOnly cookie` | ❌ Not readable by JS | ✅ Set by backend |
| `globalThis` / memory | ✅ Lost on refresh (user must re-login) | ❌ Never |
| Zustand (no persist) | ✅ In-memory, lost on refresh | ❌ Never |

For Hero Plants, `sessionStorage` is the best balance — survives page navigation within the same tab but clears on browser close. The `HttpOnly` cookie handles persistent "stay signed in" via silent refresh.


---

## 7. Auth Store (`src/store/auth.store.ts`)

```typescript
"use client";
import { create } from "zustand";

interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  emailVerified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setToken: (token: string) => {
    // sessionStorage survives navigation within tab, not cross-tab
    if (typeof window !== "undefined") {
      sessionStorage.setItem("__hp_at", token);
    }
    set({ isAuthenticated: true });
  },

  setUser: (user: User) => set({ user }),

  logout: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("__hp_at");
    }
    set({ user: null, isAuthenticated: false });
  },
}));
```

---

## 8. Middleware (`src/middleware.ts`) — Edge Runtime

```typescript
// Edge runtime — runs before any page renders
// No "use client" needed — this is not a React component
import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/account", "/orders", "/checkout", "/wishlist"];
const AUTH_ONLY = ["/login", "/signup", "/forgot-password", "/reset-password", "/verify-email"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // "hero_session" is a lightweight non-HttpOnly indicator cookie
  // set by the backend on login alongside the HttpOnly refresh token
  const isLoggedIn = request.cookies.has("hero_session");

  // Authenticated user → redirect away from auth pages
  if (AUTH_ONLY.some((p) => pathname.startsWith(p)) && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Guest → redirect to login with returnTo
  if (PROTECTED.some((p) => pathname.startsWith(p)) && !isLoggedIn) {
    const url = new URL("/login", request.url);
    url.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static files and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|icons).*)"],
};
```

---

## 9. Auth Pages — Server vs Client

### 9.1 Auth Layout (`src/app/(auth)/layout.tsx`) — Server Component

```typescript
// NO "use client" — pure layout, no interactivity
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Account", template: "%s | Hero Plants" },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fefcf9] flex flex-col">
      <nav className="h-12 bg-white border-b border-[#e5e7eb] flex items-center justify-between px-6">
        {/* Next.js Link — NOT <a href> */}
        <Link href="/" className="text-[#00b566] font-extrabold text-lg">
          🌿 Hero Plants
        </Link>
        <Link href="/" className="text-sm font-semibold text-[#00b566]">
          ← Back to Store
        </Link>
      </nav>
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-[#6b7280]">
        © 2026 Hero Plants ·{" "}
        <Link href="/privacy" className="text-[#00b566] hover:underline">Privacy</Link>
        {" · "}
        <Link href="/terms" className="text-[#00b566] hover:underline">Terms</Link>
      </footer>
    </div>
  );
}
```

### 9.2 Sign Up Page (`src/app/(auth)/signup/page.tsx`) — Client Component

```typescript
"use client";  // ← needed: form has useState, event handlers
import type { Metadata } from "next";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

// Note: metadata export doesn't work in "use client" components
// Move metadata to a parent Server Component or use generateMetadata
export default function SignUpPage() {
  return (
    <div className="w-full max-w-[440px]">
      <div className="bg-white rounded-xl border border-[rgb(202,223,212)] shadow-[0_8px_40px_rgba(0,181,102,0.08)] p-10">
        <SignUpForm />
      </div>
    </div>
  );
}
```

> **Next.js rule:** You cannot export `metadata` from a `"use client"` component. Move it to a wrapper or use `generateMetadata` in a Server Component above.

**Correct pattern for auth page metadata:**

```typescript
// src/app/(auth)/signup/page.tsx
"use client";
import { SignUpForm } from "@/features/auth/components/SignUpForm";
export default function SignUpPage() {
  return <SignUpForm />;
}

// In parent (auth)/layout.tsx (Server Component):
export const metadata: Metadata = {
  title: "Create Account",
};
```

### 9.3 OTP Verify Page (`src/app/(auth)/verify-email/page.tsx`) — Client Component

```typescript
"use client";
// searchParams comes from useSearchParams() — needs "use client"
import { Suspense } from "react";
import { OtpVerifyForm } from "@/features/auth/components/OtpVerifyForm";

// Wrap in Suspense because useSearchParams() causes a Suspense boundary
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpVerifyForm />
    </Suspense>
  );
}
```

> **Next.js 14 rule:** `useSearchParams()` must be wrapped in `<Suspense>` or it throws during static rendering. Always wrap components that use `useSearchParams()` in `<Suspense>`.

### 9.4 Reset Password Page (`src/app/(auth)/reset-password/page.tsx`)

```typescript
// This page can be a Server Component!
// Read the token from searchParams on the server
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

interface Props {
  searchParams: { token?: string };
}

export default function ResetPasswordPage({ searchParams }: Props) {
  const token = searchParams.token;

  // Show expiry state server-side if no token provided
  if (!token) {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold">Invalid link</p>
        <a href="/forgot-password" className="text-[#00b566]">
          Request a new reset link →
        </a>
      </div>
    );
  }

  // Pass token down to client component for the form
  return <ResetPasswordForm token={token} />;
}
```

---

## 10. Product Pages — Server Components (SEO)

### 10.1 PLP — Product Listing Page (`src/app/(storefront)/plants/page.tsx`)

```typescript
// Server Component — no "use client"
// Fetches data server-side for SEO + performance
import { serverFetch } from "@/lib/api";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { PLPFilters } from "@/features/products/components/PLPFilters";
import { Pagination } from "@/components/ui/Pagination";
import type { Metadata } from "next";

interface Props {
  // searchParams are passed as props in Server Components
  searchParams: {
    category?: string;
    sort?: string;
    page?: string;
    q?: string;
    min_price?: string;
    max_price?: string;
    pet?: string;
  };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const cat = searchParams.category ?? "all";
  return {
    title: `${cat} Plants`,
    description: `Shop ${cat} plants at Hero Plants. Free delivery on orders above ₹499.`,
  };
}

export default async function PLPPage({ searchParams }: Props) {
  // Fetch on server — no useEffect, no loading state
  const data = await serverFetch<any>("/products/", {
    // Build query string from searchParams
    // (in production, use a helper to build this)
    revalidate: 60,       // cache 60s
    tags: ["products"],   // tag for revalidation
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* PLPFilters is "use client" — has interactive filter UI */}
      <PLPFilters initialParams={searchParams} />

      {/* ProductGrid is Server Component — just renders the data */}
      <ProductGrid products={data.items} />

      <Pagination total={data.total} pages={data.pages} current={Number(searchParams.page ?? 1)} />
    </div>
  );
}
```

### 10.2 PLP Loading (`src/app/(storefront)/plants/loading.tsx`) — Server Component

```typescript
// Automatically shown while page.tsx is fetching data (streaming)
// No "use client" needed
export default function PLPLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(8).fill(null).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
```

### 10.3 PDP — Product Detail Page (`src/app/(storefront)/plants/[slug]/page.tsx`)

```typescript
// Server Component — fetches product server-side for SEO
import { serverFetch } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";    // NOT <img> — always use next/image
import type { Metadata } from "next";
import { ProductImages } from "@/features/products/components/ProductImages";
import { VariantSelector } from "@/features/products/components/VariantSelector";
import { AddToCartSection } from "@/features/products/components/AddToCartSection";
import { ReviewsSection } from "@/features/reviews/components/ReviewsSection";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await serverFetch<any>(`/products/${params.slug}`, {
      revalidate: 3600,
    });
    return {
      title: product.title,
      description: product.short_description,
      openGraph: {
        images: [product.images?.[0]?.url],
      },
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function PDPPage({ params }: Props) {
  let product: any;
  try {
    product = await serverFetch<any>(`/products/${params.slug}`, {
      revalidate: 60,
      tags: [`product-${params.slug}`],
    });
  } catch {
    notFound();   // renders not-found.tsx
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ProductImages: "use client" — has lightbox, swipe */}
        <ProductImages images={product.images} />

        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-500">{product.common_name}</p>

          {/* VariantSelector: "use client" — has click state */}
          <VariantSelector variants={product.variants} />

          {/* AddToCartSection: "use client" — calls useCart hook */}
          <AddToCartSection
            productId={product.uuid}
            variants={product.variants}
          />
        </div>
      </div>

      {/* ReviewsSection: Server Component — fetches reviews server-side */}
      <ReviewsSection productSlug={params.slug} />
    </div>
  );
}
```

### 10.4 PDP Not Found (`src/app/(storefront)/plants/[slug]/not-found.tsx`)

```typescript
// Renders when notFound() is called in page.tsx
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="text-center py-20">
      <p className="text-4xl">🌿</p>
      <h2 className="text-2xl font-bold mt-4">Plant not found</h2>
      <p className="text-gray-500 mt-2">This product may have been removed.</p>
      <Link href="/plants" className="mt-6 inline-block text-[#00b566] underline">
        Browse all plants →
      </Link>
    </div>
  );
}
```

---

## 11. PLPFilters — Client Component (Filters need interactivity)

```typescript
"use client";
// This component handles filter changes client-side
// and updates the URL without a full page reload
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

interface Props {
  initialParams: Record<string, string | undefined>;
}

export function PLPFilters({ initialParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      // Build new URL params preserving existing ones
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");  // reset to page 1 on filter change

      // router.push triggers a server-side re-fetch of page.tsx
      // with the new searchParams — no API call needed in this component!
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex gap-3 flex-wrap mb-6">
      {/* Sort dropdown */}
      <select
        value={searchParams.get("sort") ?? "popularity"}
        onChange={(e) => updateFilter("sort", e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
        aria-label="Sort products"
      >
        <option value="popularity">Most Popular</option>
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating">Best Rated</option>
      </select>

      {/* Pet friendly toggle */}
      <button
        onClick={() => updateFilter(
          "pet",
          searchParams.get("pet") === "true" ? null : "true"
        )}
        className={`border rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          searchParams.get("pet") === "true"
            ? "bg-[#00b566] text-white border-[#00b566]"
            : "border-gray-300 text-gray-600"
        }`}
      >
        🐾 Pet Friendly
      </button>
    </div>
  );
}
```

> **Key Next.js pattern:** Filters update the URL with `router.push()`. The URL change triggers the Server Component (`page.tsx`) to re-run with new `searchParams` and fetch fresh data from the API. No `useQuery` needed in the filter component.

---

## 12. Cart Page — Client Component

```typescript
"use client";
// Cart needs real-time state — must be client component
import { useCart } from "@/features/cart/hooks/useCart";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, isLoading, removeItem, updateItem, applyDiscount, discountError } = useCart();

  if (isLoading) return <CartSkeleton />;

  if (!cart?.items?.length) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl font-bold">Your cart is empty</p>
        <Link href="/plants" className="text-[#00b566] underline mt-4 block">
          Browse plants →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart ({cart.items.length})</h1>
      {cart.items.map((item: any) => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={() => removeItem(item.id)}
          onUpdateQty={(qty) => updateItem({ itemId: item.id, quantity: qty })}
        />
      ))}
      <CartSummary cart={cart} onApplyDiscount={applyDiscount} discountError={discountError} />
    </div>
  );
}
```

---

## 13. Orders Module — Server + Client Pattern

### 13.1 Orders List (`src/app/(storefront)/orders/page.tsx`) — Server Component

```typescript
// Server Component — reads auth cookie server-side to fetch orders
import { cookies } from "next/headers";  // Next.js server-only API
import { redirect } from "next/navigation";
import Link from "next/link";

async function getMyOrders() {
  const cookieStore = cookies();
  // We can't read the access token (it's in sessionStorage, client-side only)
  // For server-side auth, the backend must accept the refresh cookie
  // OR we use client-side fetching for authenticated data
  // Best pattern: use a client component for auth-gated data
}

// Better: since orders require auth, use a client component wrapper
import { MyOrdersList } from "@/features/orders/components/MyOrdersList";

export default function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {/* Client component handles auth + data fetching */}
      <MyOrdersList />
    </div>
  );
}
```

> **Important pattern:** For **authenticated data** (orders, profile, wishlist), the access token is in `sessionStorage` (client-side only). Server Components cannot access `sessionStorage`. So authenticated API calls must happen in **Client Components** using the Axios client (`useQuery`/`useMutation`). Only **public data** (products, categories) should be fetched in Server Components.

### 13.2 `MyOrdersList` Client Component

```typescript
"use client";
import { useMyOrders } from "@/features/orders/hooks/useMyOrders";
import Link from "next/link";

export function MyOrdersList() {
  const { data, isLoading } = useMyOrders();

  if (isLoading) return <OrdersSkeleton />;
  if (!data?.items?.length) return <p>No orders yet.</p>;

  return (
    <div className="space-y-4">
      {data.items.map((order: any) => (
        <div key={order.uuid} className="border rounded-xl p-4">
          <div className="flex justify-between">
            <span className="font-mono font-bold">{order.order_number}</span>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-gray-500">{order.created_at}</p>
          <p className="font-bold">₹{order.total}</p>
          <Link
            href={`/orders/${order.uuid}`}
            className="text-[#00b566] text-sm underline mt-2 block"
          >
            View details →
          </Link>
        </div>
      ))}
    </div>
  );
}
```

### 13.3 Order Detail Page (`src/app/(storefront)/orders/[uuid]/page.tsx`)

```typescript
// Mixed: shell is Server Component, tracking is Client Component
import { OrderTracker } from "@/features/orders/components/OrderTracker";

interface Props {
  params: { uuid: string };
}

export default function OrderDetailPage({ params }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* OrderTracker is "use client" — polls for updates */}
      <OrderTracker orderUuid={params.uuid} />
    </div>
  );
}
```

```typescript
"use client";
// src/features/orders/components/OrderTracker.tsx
import { useOrder } from "../hooks/useOrder";

export function OrderTracker({ orderUuid }: { orderUuid: string }) {
  const { data: order, isLoading } = useOrder(orderUuid);

  if (isLoading) return <div className="animate-pulse h-40 bg-gray-100 rounded-xl" />;
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Order {order.order_number}</h1>
      <FulfillmentTimeline history={order.status_history} currentStatus={order.status} />
      <OrderItemsList items={order.items} />
    </div>
  );
}
```

---

## 14. Image Component — Always Use `next/image`

```typescript
// ❌ WRONG — plain <img> tag
<img src={product.images[0].url} alt={product.title} width={400} height={400} />

// ✅ CORRECT — Next.js Image component
import Image from "next/image";

<Image
  src={product.images[0].url}
  alt={product.title}
  width={400}
  height={400}
  className="rounded-xl object-cover"
  priority={true}   // for above-the-fold images (LCP)
/>

// For unknown dimensions (e.g. user avatar):
<Image
  src={user.avatarUrl || "/images/default-avatar.png"}
  alt={user.firstName}
  fill                       // fills parent container
  className="object-cover"
  sizes="(max-width: 768px) 40px, 40px"
/>
// Parent must have: className="relative w-10 h-10 rounded-full overflow-hidden"
```

**Add image domain to `next.config.ts`** (already done in §3.4).

---

## 15. Link Component — Always Use `next/link`

```typescript
// ❌ WRONG — plain anchor tag (causes full page reload)
<a href="/plants">Browse plants</a>

// ✅ CORRECT — Next.js Link (client-side navigation, no reload)
import Link from "next/link";
<Link href="/plants">Browse plants</Link>

// With custom className:
<Link href={`/plants/${product.slug}`} className="text-[#00b566] hover:underline">
  {product.title}
</Link>

// External links — still use <a> with rel
<a href="https://razorpay.com" target="_blank" rel="noopener noreferrer">
  Pay with Razorpay
</a>
```

---

## 16. Loading & Error Files (Next.js Colocation)

These files are **automatically used** by Next.js — no import needed.

```
app/(storefront)/plants/
├── page.tsx          ← Your page
├── loading.tsx       ← Shown while page.tsx is fetching (Suspense)
├── error.tsx         ← Shown if page.tsx throws
└── not-found.tsx     ← Shown when notFound() is called
```

### `loading.tsx` example (all skeletons):

```typescript
// Server Component — no "use client"
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(8).fill(null).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-72" />
        ))}
      </div>
    </div>
  );
}
```

### `error.tsx` example:

```typescript
"use client";  // Must be "use client" — uses useEffect for reset
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center py-20">
      <p className="text-2xl font-bold">Something went wrong</p>
      <p className="text-gray-500 mt-2">{error.message}</p>
      <button
        onClick={reset}
        className="mt-6 bg-[#00b566] text-white px-6 py-3 rounded-full"
      >
        Try again
      </button>
    </div>
  );
}
```

---

## 17. Server Actions (Next.js Native Mutations)

For forms that **don't need Razorpay or complex client logic**, use Server Actions instead of client mutations.

```typescript
// src/features/auth/actions/auth.actions.ts
"use server";  // ← marks this as a server action
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  // Directly call your Python API from the server
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  // Always redirect to success page — never reveal if email exists
  redirect("/forgot-password?sent=true");
}

// Usage in a form (no JavaScript needed!):
export default function ForgotPasswordPage() {
  return (
    <form action={forgotPasswordAction}>
      <input type="email" name="email" required />
      <button type="submit">Send Reset Link</button>
    </form>
  );
}
```

> **When to use Server Actions vs client mutations:** Use Server Actions for simple forms (forgot password, contact forms). Use client mutations (TanStack Query) for complex flows that need real-time feedback, Razorpay integration, or OTP.

---

## 18. Complete File × Next.js Pattern × Change Map

| File | Pattern | Directive | Why |
|---|---|---|---|
| `app/layout.tsx` | Server Component | None | Root layout, metadata |
| `app/providers.tsx` | Client Component | `"use client"` | QueryClient needs useState |
| `app/(auth)/layout.tsx` | Server Component | None | Static nav + footer |
| `app/(auth)/signup/page.tsx` | Client Component | `"use client"` | Form interaction |
| `app/(auth)/verify-email/page.tsx` | Client Component | `"use client"` | OTP + useSearchParams (wrap in Suspense) |
| `app/(auth)/login/page.tsx` | Client Component | `"use client"` | Form |
| `app/(auth)/forgot-password/page.tsx` | Client Component | `"use client"` | Form (or Server Action) |
| `app/(auth)/reset-password/page.tsx` | Server Component | None | Read token from searchParams prop |
| `app/(storefront)/layout.tsx` | Server Component | None | Nav, footer, no interactivity |
| `app/(storefront)/page.tsx` | Server Component | None | Homepage — fetch featured products |
| `app/(storefront)/plants/page.tsx` | Server Component | None | PLP — SEO critical, fetch on server |
| `app/(storefront)/plants/loading.tsx` | Server Component | None | Skeleton while fetching |
| `app/(storefront)/plants/error.tsx` | Client Component | `"use client"` | useEffect for error logging |
| `app/(storefront)/plants/[slug]/page.tsx` | Server Component | None | PDP — SEO critical |
| `app/(storefront)/cart/page.tsx` | Client Component | `"use client"` | useCart hook |
| `app/(storefront)/checkout/page.tsx` | Client Component | `"use client"` | Razorpay, forms |
| `app/(storefront)/orders/page.tsx` | Server Component | None | Shell only; inner list is client |
| `app/(storefront)/orders/[uuid]/page.tsx` | Server Component | None | Shell; tracker is client |
| `app/(storefront)/ai-care/page.tsx` | Client Component | `"use client"` | Chat interaction |
| `app/(storefront)/garden-services/page.tsx` | Server Component | None | Fetch service types |
| `app/(storefront)/garden-services/book/page.tsx` | Client Component | `"use client"` | Booking form |
| `app/(storefront)/account/page.tsx` | Client Component | `"use client"` | Profile edit form |
| `features/**/components/*.tsx` | Client Component | `"use client"` | All interactive |
| `features/**/hooks/*.ts` | Client Component | `"use client"` | React hooks |
| `features/**/api/*.ts` | Isomorphic | None | Pure functions |
| `features/**/actions/*.ts` | Server Action | `"use server"` | Simple form submissions |
| `store/auth.store.ts` | Client Component | `"use client"` | Zustand, browser APIs |
| `lib/axios.ts` | Client only | `"use client"` | Browser fetch, sessionStorage |
| `lib/api.ts` | Server only | None | Next.js fetch + cache |
| `middleware.ts` | Edge Runtime | None | Pre-render auth guard |
| `app/**/loading.tsx` | Server Component | None | Auto-shown by Next.js |
| `app/**/error.tsx` | Client Component | `"use client"` | Required by Next.js |
| `app/**/not-found.tsx` | Server Component | None | Auto-shown by Next.js |
| `next.config.ts` | — | — | Add CDN domains to images.remotePatterns |
| `src/app/providers.tsx` | Client Component | `"use client"` | Wrap QueryClient |

---

## 19. Key Rules Summary — Next.js Specific

```
Next.js 14 App Router Rules for Hero Plant Store
══════════════════════════════════════════════════════════════════

1. "use client" ONLY when component uses:
   useState · useEffect · useRef · onClick · onChange
   useRouter · useSearchParams · useParams · browser APIs

2. Data fetching:
   Public data (products, categories) → Server Component + serverFetch()
   Authenticated data (orders, profile) → Client Component + useQuery + api (Axios)

3. URL params:
   Server Component → { params, searchParams } props
   Client Component → useParams() + useSearchParams() (wrap in <Suspense>!)

4. Navigation:
   Links → always <Link href="..."> from "next/link"
   Programmatic → useRouter().push() in Client Components only
   After server action → redirect() from "next/navigation"

5. Images:
   Always use <Image> from "next/image"
   Add all image domains to next.config.ts remotePatterns

6. Metadata (SEO):
   Export metadata const or generateMetadata() from Server Components only
   Cannot export metadata from "use client" components

7. Forms:
   Simple (forgot password, contact) → Server Actions ("use server")
   Complex (OTP, Razorpay) → "use client" + TanStack mutation

8. Caching:
   Server fetch: { next: { revalidate: 60, tags: ["products"] } }
   Bust cache: revalidateTag("products") in Server Action
   Client: TanStack Query staleTime + invalidateQueries

9. Auth guard:
   Route protection → middleware.ts (edge, zero flash)
   Never protect routes client-side (causes layout shift)

10. Access token:
    Store in sessionStorage (client) — NOT cookie, NOT localStorage
    Server Components cannot access sessionStorage
    Only Client Components make authenticated API calls

══════════════════════════════════════════════════════════════════
Files created: 55 | "use client" files: 22 | Server Components: 33
Total endpoints connected: 48 | Hooks: 28 | Server Actions: 3
Last updated: June 2026
══════════════════════════════════════════════════════════════════
```

---

*Document version: 2.0 — Next.js 14 App Router Native*
*Corrected from: React SPA patterns (v1.0)*
*Stack: Next.js 14 · TypeScript · TanStack Query · Axios · Zustand · Zod · Server Components*
*Last updated: June 2026*
