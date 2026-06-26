// ─── PLP Data Layer ─────────────────────────────────────────────────────────
// Mock products + filter/sort utilities for the Plants Product Listing Page

export type PlantTag =
  | "indoor"
  | "outdoor"
  | "flowering"
  | "succulents"
  | "low-maintenance"
  | "air-purifying"
  | "pet-friendly"
  | "gifting"
  | "rare"
  | "climber"
  | "herb"
  | "vegetable"
  | "cactus";

export type PlantSize = "XS" | "S" | "M" | "L" | "XL";
export type LightReq = "Full Sun" | "Partial Sun" | "Low Light" | "Shade";
export type WateringFreq = "Daily" | "Weekly" | "Bi-weekly" | "Monthly";
export type BadgeType = "bestseller" | "new" | "low-stock" | "sold-out";

export interface PlantProduct {
  id: string;
  slug: string;
  name: string;
  secondaryName: string;
  price: number;
  originalPrice: number | null;
  discount: number; // percentage, 0 if no discount
  rating: number;
  reviewCount: number;
  sizes: PlantSize[];
  tags: PlantTag[];
  lightReq: LightReq;
  watering: WateringFreq;
  badge: BadgeType | null;
  stockCount: number; // 0 = sold out
  isNew: boolean; // added within last 30 days
  primaryImage: string;
  secondaryImage: string;
}

export type SortOption =
  | "bestselling"
  | "new-arrivals"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "alphabetical";

export interface FilterState {
  category: PlantTag | "all";
  plantTypes: PlantTag[];
  priceMin: number;
  priceMax: number;
  sizes: PlantSize[];
  lightReqs: LightReq[];
  watering: WateringFreq[];
  specialTags: PlantTag[];
  minRating: number | null;
  inStockOnly: boolean;
  discounts: number[];
}

export const DEFAULT_FILTER: FilterState = {
  category: "all",
  plantTypes: [],
  priceMin: 0,
  priceMax: 5000,
  sizes: [],
  lightReqs: [],
  watering: [],
  specialTags: [],
  minRating: null,
  inStockOnly: false,
  discounts: [],
};

// ── Placeholder image palette (Picsum-style stable seeds) ───────────────────
const PIC = (seed: number, w = 400, h = 400) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

// ── 24 Mock Products ─────────────────────────────────────────────────────────
export const ALL_PRODUCTS: PlantProduct[] = [
  {
    id: "1",
    slug: "monstera-deliciosa",
    name: "Monstera Deliciosa",
    secondaryName: "Swiss Cheese Plant",
    price: 399,
    originalPrice: 599,
    discount: 33,
    rating: 4.3,
    reviewCount: 1204,
    sizes: ["S", "M", "L"],
    tags: ["indoor", "air-purifying", "gifting"],
    lightReq: "Partial Sun",
    watering: "Weekly",
    badge: "bestseller",
    stockCount: 120,
    isNew: false,
    primaryImage: PIC(10),
    secondaryImage: PIC(11),
  },
  {
    id: "2",
    slug: "snake-plant",
    name: "Snake Plant",
    secondaryName: "Sansevieria trifasciata",
    price: 249,
    originalPrice: 349,
    discount: 29,
    rating: 4.7,
    reviewCount: 2891,
    sizes: ["S", "M", "L", "XL"],
    tags: ["indoor", "low-maintenance", "air-purifying"],
    lightReq: "Low Light",
    watering: "Monthly",
    badge: "bestseller",
    stockCount: 87,
    isNew: false,
    primaryImage: PIC(20),
    secondaryImage: PIC(21),
  },
  {
    id: "3",
    slug: "pothos-golden",
    name: "Golden Pothos",
    secondaryName: "Devil's Ivy",
    price: 149,
    originalPrice: null,
    discount: 0,
    rating: 4.5,
    reviewCount: 3102,
    sizes: ["S", "M"],
    tags: ["indoor", "low-maintenance", "air-purifying", "pet-friendly"],
    lightReq: "Low Light",
    watering: "Weekly",
    badge: "bestseller",
    stockCount: 200,
    isNew: false,
    primaryImage: PIC(30),
    secondaryImage: PIC(31),
  },
  {
    id: "4",
    slug: "fiddle-leaf-fig",
    name: "Fiddle Leaf Fig",
    secondaryName: "Ficus lyrata",
    price: 799,
    originalPrice: 1199,
    discount: 33,
    rating: 4.1,
    reviewCount: 672,
    sizes: ["M", "L", "XL"],
    tags: ["indoor", "gifting", "rare"],
    lightReq: "Partial Sun",
    watering: "Weekly",
    badge: null,
    stockCount: 18,
    isNew: false,
    primaryImage: PIC(40),
    secondaryImage: PIC(41),
  },
  {
    id: "5",
    slug: "peace-lily",
    name: "Peace Lily",
    secondaryName: "Spathiphyllum",
    price: 299,
    originalPrice: 449,
    discount: 33,
    rating: 4.6,
    reviewCount: 1567,
    sizes: ["S", "M"],
    tags: ["indoor", "flowering", "air-purifying", "gifting"],
    lightReq: "Low Light",
    watering: "Weekly",
    badge: "bestseller",
    stockCount: 54,
    isNew: false,
    primaryImage: PIC(50),
    secondaryImage: PIC(51),
  },
  {
    id: "6",
    slug: "aloe-vera",
    name: "Aloe Vera",
    secondaryName: "True Aloe",
    price: 129,
    originalPrice: null,
    discount: 0,
    rating: 4.8,
    reviewCount: 4321,
    sizes: ["XS", "S", "M"],
    tags: ["indoor", "outdoor", "succulents", "low-maintenance", "pet-friendly"],
    lightReq: "Full Sun",
    watering: "Bi-weekly",
    badge: "bestseller",
    stockCount: 340,
    isNew: false,
    primaryImage: PIC(60),
    secondaryImage: PIC(61),
  },
  {
    id: "7",
    slug: "zz-plant",
    name: "ZZ Plant",
    secondaryName: "Zamioculcas zamiifolia",
    price: 349,
    originalPrice: 499,
    discount: 30,
    rating: 4.4,
    reviewCount: 891,
    sizes: ["S", "M", "L"],
    tags: ["indoor", "low-maintenance", "air-purifying"],
    lightReq: "Low Light",
    watering: "Monthly",
    badge: null,
    stockCount: 67,
    isNew: false,
    primaryImage: PIC(70),
    secondaryImage: PIC(71),
  },
  {
    id: "8",
    slug: "rubber-plant",
    name: "Rubber Plant",
    secondaryName: "Ficus elastica",
    price: 449,
    originalPrice: 649,
    discount: 31,
    rating: 4.2,
    reviewCount: 543,
    sizes: ["S", "M", "L"],
    tags: ["indoor", "air-purifying", "gifting"],
    lightReq: "Partial Sun",
    watering: "Weekly",
    badge: null,
    stockCount: 42,
    isNew: false,
    primaryImage: PIC(80),
    secondaryImage: PIC(81),
  },
  {
    id: "9",
    slug: "money-plant",
    name: "Money Plant",
    secondaryName: "Epipremnum aureum",
    price: 99,
    originalPrice: 149,
    discount: 34,
    rating: 4.9,
    reviewCount: 5678,
    sizes: ["XS", "S"],
    tags: ["indoor", "low-maintenance", "air-purifying", "gifting"],
    lightReq: "Partial Sun",
    watering: "Weekly",
    badge: "bestseller",
    stockCount: 500,
    isNew: false,
    primaryImage: PIC(90),
    secondaryImage: PIC(91),
  },
  {
    id: "10",
    slug: "jade-plant",
    name: "Jade Plant",
    secondaryName: "Crassula ovata",
    price: 199,
    originalPrice: null,
    discount: 0,
    rating: 4.5,
    reviewCount: 1023,
    sizes: ["XS", "S", "M"],
    tags: ["indoor", "succulents", "low-maintenance"],
    lightReq: "Full Sun",
    watering: "Bi-weekly",
    badge: null,
    stockCount: 89,
    isNew: false,
    primaryImage: PIC(100),
    secondaryImage: PIC(101),
  },
  {
    id: "11",
    slug: "bird-of-paradise",
    name: "Bird of Paradise",
    secondaryName: "Strelitzia reginae",
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    rating: 4.6,
    reviewCount: 342,
    sizes: ["L", "XL"],
    tags: ["indoor", "outdoor", "flowering", "rare", "gifting"],
    lightReq: "Full Sun",
    watering: "Weekly",
    badge: "low-stock",
    stockCount: 4,
    isNew: false,
    primaryImage: PIC(110),
    secondaryImage: PIC(111),
  },
  {
    id: "12",
    slug: "string-of-pearls",
    name: "String of Pearls",
    secondaryName: "Senecio rowleyanus",
    price: 279,
    originalPrice: 399,
    discount: 30,
    rating: 4.3,
    reviewCount: 788,
    sizes: ["XS", "S"],
    tags: ["indoor", "succulents", "rare"],
    lightReq: "Partial Sun",
    watering: "Bi-weekly",
    badge: "new",
    stockCount: 32,
    isNew: true,
    primaryImage: PIC(120),
    secondaryImage: PIC(121),
  },
  {
    id: "13",
    slug: "boston-fern",
    name: "Boston Fern",
    secondaryName: "Nephrolepis exaltata",
    price: 219,
    originalPrice: 299,
    discount: 27,
    rating: 4.0,
    reviewCount: 456,
    sizes: ["S", "M", "L"],
    tags: ["indoor", "outdoor", "air-purifying", "pet-friendly"],
    lightReq: "Partial Sun",
    watering: "Daily",
    badge: null,
    stockCount: 71,
    isNew: false,
    primaryImage: PIC(130),
    secondaryImage: PIC(131),
  },
  {
    id: "14",
    slug: "christmas-cactus",
    name: "Christmas Cactus",
    secondaryName: "Schlumbergera bridgesii",
    price: 179,
    originalPrice: null,
    discount: 0,
    rating: 4.7,
    reviewCount: 923,
    sizes: ["XS", "S"],
    tags: ["indoor", "flowering", "succulents", "gifting"],
    lightReq: "Partial Sun",
    watering: "Bi-weekly",
    badge: "new",
    stockCount: 56,
    isNew: true,
    primaryImage: PIC(140),
    secondaryImage: PIC(141),
  },
  {
    id: "15",
    slug: "philodendron-heartleaf",
    name: "Heartleaf Philodendron",
    secondaryName: "Philodendron hederaceum",
    price: 329,
    originalPrice: 449,
    discount: 27,
    rating: 4.5,
    reviewCount: 1123,
    sizes: ["S", "M"],
    tags: ["indoor", "air-purifying", "low-maintenance", "climber"],
    lightReq: "Low Light",
    watering: "Weekly",
    badge: null,
    stockCount: 94,
    isNew: false,
    primaryImage: PIC(150),
    secondaryImage: PIC(151),
  },
  {
    id: "16",
    slug: "lavender-outdoor",
    name: "English Lavender",
    secondaryName: "Lavandula angustifolia",
    price: 249,
    originalPrice: 349,
    discount: 29,
    rating: 4.8,
    reviewCount: 2134,
    sizes: ["S", "M"],
    tags: ["outdoor", "flowering", "low-maintenance", "pet-friendly", "gifting"],
    lightReq: "Full Sun",
    watering: "Weekly",
    badge: "bestseller",
    stockCount: 160,
    isNew: false,
    primaryImage: PIC(160),
    secondaryImage: PIC(161),
  },
  {
    id: "17",
    slug: "calathea-orbifolia",
    name: "Calathea Orbifolia",
    secondaryName: "Prayer Plant",
    price: 599,
    originalPrice: 899,
    discount: 33,
    rating: 4.2,
    reviewCount: 387,
    sizes: ["S", "M"],
    tags: ["indoor", "rare", "pet-friendly", "air-purifying"],
    lightReq: "Low Light",
    watering: "Weekly",
    badge: "new",
    stockCount: 21,
    isNew: true,
    primaryImage: PIC(170),
    secondaryImage: PIC(171),
  },
  {
    id: "18",
    slug: "basil-herb",
    name: "Sweet Basil",
    secondaryName: "Ocimum basilicum",
    price: 79,
    originalPrice: null,
    discount: 0,
    rating: 4.6,
    reviewCount: 3456,
    sizes: ["XS", "S"],
    tags: ["outdoor", "herb", "low-maintenance", "pet-friendly"],
    lightReq: "Full Sun",
    watering: "Daily",
    badge: "bestseller",
    stockCount: 420,
    isNew: false,
    primaryImage: PIC(180),
    secondaryImage: PIC(181),
  },
  {
    id: "19",
    slug: "alocasia-amazonica",
    name: "Alocasia Amazonica",
    secondaryName: "African Mask Plant",
    price: 749,
    originalPrice: 999,
    discount: 25,
    rating: 4.4,
    reviewCount: 567,
    sizes: ["S", "M", "L"],
    tags: ["indoor", "rare", "gifting"],
    lightReq: "Partial Sun",
    watering: "Weekly",
    badge: "low-stock",
    stockCount: 3,
    isNew: false,
    primaryImage: PIC(190),
    secondaryImage: PIC(191),
  },
  {
    id: "20",
    slug: "cherry-tomato",
    name: "Cherry Tomato Plant",
    secondaryName: "Solanum lycopersicum",
    price: 149,
    originalPrice: null,
    discount: 0,
    rating: 4.5,
    reviewCount: 1876,
    sizes: ["S", "M"],
    tags: ["outdoor", "vegetable", "low-maintenance"],
    lightReq: "Full Sun",
    watering: "Daily",
    badge: null,
    stockCount: 0,
    isNew: false,
    primaryImage: PIC(200),
    secondaryImage: PIC(201),
  },
  {
    id: "21",
    slug: "dracaena-marginata",
    name: "Dracaena Marginata",
    secondaryName: "Dragon Tree",
    price: 499,
    originalPrice: 699,
    discount: 29,
    rating: 4.3,
    reviewCount: 734,
    sizes: ["M", "L", "XL"],
    tags: ["indoor", "air-purifying", "low-maintenance"],
    lightReq: "Partial Sun",
    watering: "Bi-weekly",
    badge: null,
    stockCount: 48,
    isNew: false,
    primaryImage: PIC(210),
    secondaryImage: PIC(211),
  },
  {
    id: "22",
    slug: "echeveria-succulent",
    name: "Echeveria Elegans",
    secondaryName: "Mexican Snowball",
    price: 119,
    originalPrice: 179,
    discount: 34,
    rating: 4.9,
    reviewCount: 2098,
    sizes: ["XS", "S"],
    tags: ["indoor", "outdoor", "succulents", "low-maintenance", "gifting"],
    lightReq: "Full Sun",
    watering: "Bi-weekly",
    badge: "bestseller",
    stockCount: 290,
    isNew: false,
    primaryImage: PIC(220),
    secondaryImage: PIC(221),
  },
  {
    id: "23",
    slug: "hibiscus-flowering",
    name: "Hibiscus Rosa-sinensis",
    secondaryName: "Chinese Hibiscus",
    price: 349,
    originalPrice: 499,
    discount: 30,
    rating: 4.4,
    reviewCount: 512,
    sizes: ["S", "M", "L"],
    tags: ["outdoor", "flowering", "low-maintenance", "gifting"],
    lightReq: "Full Sun",
    watering: "Daily",
    badge: "new",
    stockCount: 76,
    isNew: true,
    primaryImage: PIC(230),
    secondaryImage: PIC(231),
  },
  {
    id: "24",
    slug: "spider-plant",
    name: "Spider Plant",
    secondaryName: "Chlorophytum comosum",
    price: 169,
    originalPrice: 249,
    discount: 32,
    rating: 4.7,
    reviewCount: 3210,
    sizes: ["S", "M"],
    tags: ["indoor", "air-purifying", "pet-friendly", "low-maintenance"],
    lightReq: "Partial Sun",
    watering: "Weekly",
    badge: "bestseller",
    stockCount: 185,
    isNew: false,
    primaryImage: PIC(240),
    secondaryImage: PIC(241),
  },
];

// ── Filter helpers ────────────────────────────────────────────────────────────
export function applyFilters(
  products: PlantProduct[],
  filters: FilterState
): PlantProduct[] {
  return products.filter((p) => {
    // Category pill
    if (filters.category !== "all" && !p.tags.includes(filters.category))
      return false;
    // Plant types
    if (
      filters.plantTypes.length > 0 &&
      !filters.plantTypes.some((t) => p.tags.includes(t))
    )
      return false;
    // Price
    if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
    // Size
    if (
      filters.sizes.length > 0 &&
      !filters.sizes.some((s) => p.sizes.includes(s))
    )
      return false;
    // Light
    if (filters.lightReqs.length > 0 && !filters.lightReqs.includes(p.lightReq))
      return false;
    // Watering
    if (
      filters.watering.length > 0 &&
      !filters.watering.includes(p.watering)
    )
      return false;
    // Special tags
    if (
      filters.specialTags.length > 0 &&
      !filters.specialTags.some((t) => p.tags.includes(t))
    )
      return false;
    // Rating
    if (filters.minRating !== null && p.rating < filters.minRating) return false;
    // In stock
    if (filters.inStockOnly && p.stockCount === 0) return false;
    // Discount
    if (
      filters.discounts.length > 0 &&
      !filters.discounts.some((d) => p.discount >= d)
    )
      return false;
    return true;
  });
}

export function sortProducts(
  products: PlantProduct[],
  sort: SortOption
): PlantProduct[] {
  const arr = [...products];
  switch (sort) {
    case "bestselling":
      return arr.sort((a, b) => b.reviewCount - a.reviewCount);
    case "new-arrivals":
      return arr.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "rating-desc":
      return arr.sort((a, b) => b.rating - a.rating);
    case "alphabetical":
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return arr;
  }
}

export const SORT_LABELS: Record<SortOption, string> = {
  bestselling: "Bestselling",
  "new-arrivals": "New Arrivals",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "rating-desc": "Rating: High to Low",
  alphabetical: "Alphabetical: A–Z",
};

export const CATEGORY_PILLS: { label: string; tag: PlantTag | "all" }[] = [
  { label: "All", tag: "all" },
  { label: "Indoor Plants", tag: "indoor" },
  { label: "Outdoor Plants", tag: "outdoor" },
  { label: "Flowering Plants", tag: "flowering" },
  { label: "Succulents & Cacti", tag: "succulents" },
  { label: "Low Maintenance", tag: "low-maintenance" },
  { label: "Air Purifying", tag: "air-purifying" },
  { label: "Pet Friendly", tag: "pet-friendly" },
  { label: "Gifting", tag: "gifting" },
];
