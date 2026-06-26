import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Plants — Indoor, Outdoor & Flowering Plants | plant byst",
  description:
    "Explore 500+ indoor plants, outdoor plants, flowering plants, and succulents. Shop Monstera, Pothos, Peace Lily, Snake Plant and more. Free shipping on orders ₹499+. 10M+ customers, 4.5★ rated.",
  keywords:
    "indoor plants, outdoor plants, flowering plants, succulents, buy plants online, plant delivery, Monstera, Snake Plant",
  openGraph: {
    title: "Plants — Indoor, Outdoor & Flowering Plants | plant byst",
    description:
      "Explore 500+ indoor plants for home, office, and gifting. Trusted by 10M+ plant lovers.",
    type: "website",
  },
};

export default function PlantsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
