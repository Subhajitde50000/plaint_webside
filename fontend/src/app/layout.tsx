import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "sonner";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Hero — Grow Your Green Space | Plants, Seeds & AI Plant Care",
  description:
    "Hero is your ultimate destination for plants, seeds, and expert AI-powered plant care. Shop our curated collection of indoor plants, flower plants, and balcony decor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <Providers>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </Providers>
        </ErrorBoundary>
        {/* Razorpay checkout script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
