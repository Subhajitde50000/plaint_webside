import type { Metadata } from "next";
import type { ReactNode } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const formatted = slug.charAt(0).toUpperCase() + slug.slice(1);
  const title = `${formatted} — Shop Online | plant byst`;
  const description = `Explore our collection of premium ${slug}. Buy high-quality indoor and outdoor gardening essentials online at plant byst.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function CategoryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
