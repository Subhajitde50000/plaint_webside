import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
