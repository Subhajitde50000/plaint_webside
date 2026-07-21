import HomePageClient from "@/components/home/HomePageClient";
import type { HomepageData } from "@/features/homepage";

export const dynamic = "force-dynamic";

async function getHomepage(): Promise<HomepageData | null> {
  const apiUrl = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  try {
    const response = await fetch(apiUrl + "/api/v1/homepage/", { next: { revalidate: 300 } });
    return response.ok ? (await response.json() as HomepageData) : null;
  } catch {
    return null;
  }
}

export default async function Home() {
  return <HomePageClient initialData={await getHomepage()} />;
}

