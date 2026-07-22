// ─── Admin Product Page — Shared Types ───────────────────────────────────────

export type ProductStatus = 'active' | 'draft' | 'archived';
export type ProductType = 'plant' | 'pot' | 'seed' | 'soil' | 'tool';
export type VariantType = 'size' | 'diameter' | 'weight' | 'pack' | 'custom';
export type StockPolicy = 'deny' | 'backorder' | 'continue';

export interface ProductImage {
  id: string;
  url: string;
  filename: string;
  isPrimary: boolean;
  file?: File;
}

export interface SizeVariant {
  id: string;
  sizeName: string;
  range: string;
  price: string;
  sku: string;
  stock: number;
  bestFor: string;
  potDiameter: string;
  dispatch: string;
}

export interface FeaturePoint {
  id: string;
  text: string;
}

export interface SpecRow {
  id: string;
  label: string;
  value: string;
}

export interface CareCard {
  id: string;
  icon: string;
  title: string;
  value: string;
  detail: string;
  level: number;
}

export interface FeaturedPot {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
}

export interface ActivityLogEntry {
  id: string;
  date: string;
  admin: string;
  action: string;
}

export interface ProductFormData {
  // Product Info
  title: string;
  shortDescription: string;
  fullDescription: string;
  botanicalName: string;
  commonName: string;

  // Media
  images: ProductImage[];

  // Pricing
  currentPrice: string;
  compareAtPrice: string;
  costPerUnit: string;
  showCustomBadge: boolean;
  discountBadgeText: string;
  isTaxable: boolean;
  taxRate: string;
  priceNote: string;

  // Variants
  variantType: VariantType;
  variants: SizeVariant[];

  // Inventory
  baseSku: string;
  barcode: string;
  trackInventory: boolean;
  reorderLevel: string;
  lowStockAlert: boolean;
  stockPolicy: StockPolicy;
  warehouse: string;

  // Shipping
  isPhysical: boolean;
  weight: string;
  weightUnit: string;
  dimLength: string;
  dimWidth: string;
  dimHeight: string;
  freeDelivery: boolean;
  deliveryEta: string;
  healthGuarantee: string;
  packagingLabel: string;

  // About Tab
  featurePoints: FeaturePoint[];
  specRows: SpecRow[];

  // Care Guide Tab
  careCards: CareCard[];

  // Status
  productStatus: ProductStatus;
  onlineStore: boolean;
  pointOfSale: boolean;
  schedulePublish: boolean;
  publishDate: string;
  publishTime: string;

  // Organisation
  category: string;
  subcategory: string;
  tags: string[];
  collections: string[];

  // Product Type
  productType: ProductType;

  // Care Quick-Chips
  lightRequirement: string;
  waterFrequency: string;
  temperatureRange: string;
  skillLevel: string;
  petFriendly: boolean;
  airPurifying: boolean;

  // Pot Upsell
  potUpsellLabel: string;
  featuredPots: FeaturedPot[];
  showAllPotsLink: boolean;

  // SEO
  seoTitle: string;
  seoDescription: string;
  urlHandle: string;
}

export interface ValidationErrors {
  [field: string]: string;
}

export const COLLECTIONS_LIST = [
  'Bestsellers',
  'New Arrivals',
  'Air Purifying Plants',
  'Pet Friendly',
  'Low Maintenance',
  'Gifting',
  'Trending',
  'Rare Plants',
];

export const CATEGORIES = [
  'Indoor Plants',
  'Outdoor Plants',
  'Flowering Plants',
  'Succulents & Cacti',
  'Seeds',
  'Soil & Fertiliser',
  'Tools',
  'Pots & Planters',
];

export const SUBCATEGORIES: Record<string, string[]> = {
  'Indoor Plants': ['Foliage Plants', 'Trailing Plants', 'Tabletop Plants', 'Floor Plants'],
  'Outdoor Plants': ['Garden Plants', 'Hedge Plants', 'Climbers'],
  'Flowering Plants': ['Seasonal Flowers', 'Perennials', 'Bulbs'],
  'Succulents & Cacti': ['Succulents', 'Cacti', 'Air Plants'],
  'Seeds': ['Vegetable Seeds', 'Herb Seeds', 'Flower Seeds'],
  'Soil & Fertiliser': ['Potting Mix', 'Fertiliser', 'Compost'],
  'Tools': ['Watering', 'Pruning', 'Digging'],
  'Pots & Planters': ['Terracotta', 'Ceramic', 'Hanging', 'Grow Bags'],
};

export const CARE_ICONS = ['☀️', '💧', '🌡️', '🌿', '🌱', '✂️', '💨', '🪨', '🌸', '🔆'];
export const DISPATCH_OPTIONS = ['Same day', '1–2 days', '3–5 days', '5–7 days', '7–10 days'];
export const LIGHT_OPTIONS = ['Full Sun', 'Partial Sun', 'Indirect Bright Light', 'Low Light', 'Shade'];
export const WATER_OPTIONS = ['Daily', 'Every 2–3 days', 'Weekly', 'Bi-weekly', 'Monthly'];
export const SKILL_OPTIONS = ['Beginner', 'Intermediate', 'Expert'];
export const TAX_OPTIONS = ['GST 5%', 'GST 12%', 'GST 18%', 'GST 28%', 'Exempt'];
export const WAREHOUSE_OPTIONS = ['Pune Fulfilment Centre', 'Mumbai Warehouse', 'Delhi Hub', 'Bangalore Depot'];

export const DEFAULT_FORM_DATA: ProductFormData = {
  title: '',
  shortDescription: '',
  fullDescription: '',
  botanicalName: '',
  commonName: '',
  images: [],
  currentPrice: '',
  compareAtPrice: '',
  costPerUnit: '',
  showCustomBadge: false,
  discountBadgeText: '',
  isTaxable: true,
  taxRate: 'GST 18%',
  priceNote: 'incl. of all taxes',
  variantType: 'size',
  variants: [
    {
      id: 'default-1',
      sizeName: 'Standard',
      range: 'Standard size',
      price: '',
      sku: 'SKU-1',
      stock: 0,
      bestFor: 'Most popular pick',
      potDiameter: 'N/A',
      dispatch: '1–2 days',
    }
  ],
  baseSku: '',
  barcode: '',
  trackInventory: true,
  reorderLevel: '20',
  lowStockAlert: true,
  stockPolicy: 'deny',
  warehouse: 'Pune Fulfilment Centre',
  isPhysical: true,
  weight: '',
  weightUnit: 'kg',
  dimLength: '',
  dimWidth: '',
  dimHeight: '',
  freeDelivery: true,
  deliveryEta: '3–5 business days',
  healthGuarantee: '7-day health guarantee',
  packagingLabel: 'Eco-friendly packaging',
  featurePoints: [{ id: '1', text: '' }],
  specRows: [
    { id: '1', label: 'Botanical Name', value: '' },
    { id: '2', label: 'Family', value: '' },
    { id: '3', label: 'Origin', value: '' },
    { id: '4', label: 'Growth Rate', value: '' },
    { id: '5', label: 'Max Height', value: '' },
    { id: '6', label: 'Pot Type', value: 'Any — pot not included' },
  ],
  careCards: [
    { id: '1', icon: '☀️', title: 'Sunlight', value: '', detail: '', level: 0 },
    { id: '2', icon: '💧', title: 'Water', value: '', detail: '', level: 0 },
    { id: '3', icon: '🌡️', title: 'Temperature', value: '', detail: '', level: 0 },
  ],
  productStatus: 'draft',
  onlineStore: true,
  pointOfSale: false,
  schedulePublish: false,
  publishDate: '',
  publishTime: '',
  category: '',
  subcategory: '',
  tags: [],
  collections: [],
  productType: 'plant',
  lightRequirement: '',
  waterFrequency: '',
  temperatureRange: '',
  skillLevel: '',
  petFriendly: false,
  airPurifying: false,
  potUpsellLabel: 'Pair it with a pot',
  featuredPots: [],
  showAllPotsLink: true,
  seoTitle: '',
  seoDescription: '',
  urlHandle: '',
};
