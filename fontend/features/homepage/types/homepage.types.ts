export interface HeroBanner {
  title: string;
  subtitle: string;
  ctaText?: string;
  cta_text?: string;
  ctaLink?: string;
  cta_link?: string;
  imageUrl?: string;
  image_url?: string;
  badge?: string | null;
}

export interface CategorySummary {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  image_url?: string | null;
  itemCount?: number;
  item_count?: number;
  icon?: string | null;
}

export interface ProductSummary {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  basePrice?: number;
  base_price?: number;
  compareAtPrice?: number | null;
  compare_at_price?: number | null;
  primaryImage?: string | null;
  primary_image?: string | null;
  ratingAverage?: number;
  rating_average?: number;
  ratingCount?: number;
  rating_count?: number;
  inStock?: boolean;
  in_stock?: boolean;
  badge?: string | null;
}

export interface FlashSale {
  title: string;
  subtitle: string;
  endTime?: string;
  end_time?: string;
  bannerUrl?: string | null;
  banner_url?: string | null;
  items: ProductSummary[];
}

export interface AICareSummary {
  title: string;
  subtitle: string;
  featurePoints?: string[];
  feature_points?: string[];
  ctaText?: string;
  cta_text?: string;
  ctaLink?: string;
  cta_link?: string;
  imageUrl?: string | null;
  image_url?: string | null;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  priceStart?: number;
  price_start?: number;
}

export interface GardenServicesSummary {
  title: string;
  subtitle: string;
  services: ServiceItem[];
  ctaText?: string;
  cta_text?: string;
  ctaLink?: string;
  cta_link?: string;
}

export interface Testimonial {
  id: number;
  customerName?: string;
  customer_name?: string;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  rating: number;
  reviewText?: string;
  review_text?: string;
  plantPurchased?: string | null;
  plant_purchased?: string | null;
}

export interface BlogSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl?: string | null;
  image_url?: string | null;
  readTime?: string;
  read_time?: string;
  publishedAt?: string | null;
  published_at?: string | null;
}

export interface Newsletter {
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText?: string;
  button_text?: string;
  discountNote?: string | null;
  discount_note?: string | null;
}

export interface HomepageData {
  hero: HeroBanner;
  categories: CategorySummary[];
  featuredProducts?: ProductSummary[];
  featured_products?: ProductSummary[];
  bestSellers?: ProductSummary[];
  best_sellers?: ProductSummary[];
  newArrivals?: ProductSummary[];
  new_arrivals?: ProductSummary[];
  flashSale?: FlashSale;
  flash_sale?: FlashSale;
  aiCare?: AICareSummary;
  ai_care?: AICareSummary;
  gardenServices?: GardenServicesSummary;
  garden_services?: GardenServicesSummary;
  testimonials: Testimonial[];
  blogs: BlogSummary[];
  newsletter: Newsletter;
}
