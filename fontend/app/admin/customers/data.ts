// ─── Types ────────────────────────────────────────────────────────────────────

export type CustomerStatus = "active" | "new" | "at_risk" | "blocked" | "unverified";
export type CustomerTier = "plant_lover" | "silver" | "gold";

export interface Address {
  id: string;
  type: "home" | "work" | "other";
  isDefault: boolean;
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface AdminNote {
  id: string;
  author: string;
  authorInitials: string;
  date: string;
  text: string;
}

export interface Order {
  id: string;
  date: string;
  items: number;
  total: string;
  payment: "paid" | "pending" | "failed" | "refunded";
  status: "delivered" | "shipped" | "processing" | "cancelled" | "returned";
}

export interface Review {
  id: string;
  product: string;
  productImg: string;
  rating: number;
  text: string;
  date: string;
  status: "published" | "pending" | "rejected";
}

export interface AICareQuery {
  id: string;
  datetime: string;
  query: string;
  hasPhoto: boolean;
  rating: "helpful" | "unhelpful" | null;
  converted: boolean;
}

export interface GardenBooking {
  id: string;
  service: string;
  date: string;
  status: "confirmed" | "completed" | "cancelled" | "pending";
}

export interface ActivityEntry {
  id: string;
  datetime: string;
  actor: string;
  action: string;
  type: "order" | "account" | "admin" | "system" | "loyalty";
}

export interface WishlistItem {
  id: string;
  name: string;
  price: string;
  img: string;
}

export interface Customer {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  avatar?: string;
  city: string;
  state: string;
  tier: CustomerTier;
  status: CustomerStatus;
  loyaltyPoints: number;
  loyaltyPointsToNext: number;
  nextTier: string;
  orders: number;
  ltv: string;
  ltvRaw: number;
  aov: string;
  returnRate: string;
  reviewCount: number;
  lastOrder: string;
  joined: string;
  lastLogin: string;
  tags: string[];
  marketingEmail: boolean;
  marketingSms: boolean;
  language: string;
  source: string;
  petOwner: boolean;
  aiCareUser: boolean;
  gardenClient: boolean;
  favouriteCategory: string;
  avgDaysBetweenOrders: number;
  preferredPayment: string;
  deviceUsed: string;
  discountUsage: string;
  orderHistory: Order[];
  reviews: Review[];
  aiCareQueries: AICareQuery[];
  gardenBookings: GardenBooking[];
  activityLog: ActivityEntry[];
  addresses: Address[];
  adminNotes: AdminNote[];
  wishlist: WishlistItem[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    customerId: "CST-00821",
    firstName: "Priya",
    lastName: "Kumar",
    email: "priya@email.com",
    phone: "+91 98765 43210",
    emailVerified: true,
    phoneVerified: true,
    city: "Pune",
    state: "Maharashtra",
    tier: "gold",
    status: "active",
    loyaltyPoints: 1240,
    loyaltyPointsToNext: 760,
    nextTier: "Silver",
    orders: 12,
    ltv: "₹14,820",
    ltvRaw: 14820,
    aov: "₹1,235",
    returnRate: "0%",
    reviewCount: 8,
    lastOrder: "15 Jun 2026",
    joined: "12 Jan 2025",
    lastLogin: "2 hours ago",
    tags: ["VIP", "Corporate"],
    marketingEmail: true,
    marketingSms: true,
    language: "English",
    source: "Google",
    petOwner: true,
    aiCareUser: true,
    gardenClient: true,
    favouriteCategory: "Indoor Plants (8 of 12 orders)",
    avgDaysBetweenOrders: 24,
    preferredPayment: "Visa (10 of 12)",
    deviceUsed: "Mobile (75%)",
    discountUsage: "5 of 12 orders (HERO10, WELCOME15)",
    orderHistory: [
      { id: "ORD-4821", date: "15 Jun 2026", items: 3, total: "₹1,248", payment: "paid", status: "delivered" },
      { id: "ORD-4312", date: "20 May 2026", items: 1, total: "₹399", payment: "paid", status: "delivered" },
      { id: "ORD-3998", date: "02 May 2026", items: 2, total: "₹698", payment: "paid", status: "delivered" },
      { id: "ORD-3512", date: "10 Apr 2026", items: 1, total: "₹1,299", payment: "paid", status: "delivered" },
      { id: "ORD-3100", date: "15 Mar 2026", items: 4, total: "₹2,100", payment: "paid", status: "delivered" },
    ],
    reviews: [
      { id: "R1", product: "Monstera Deliciosa", productImg: "", rating: 5, text: "Absolutely beautiful plant! Arrived in perfect condition.", date: "15 Jun 2026", status: "published" },
      { id: "R2", product: "Peace Lily", productImg: "", rating: 4, text: "Good plant, smaller than expected.", date: "20 May 2026", status: "published" },
      { id: "R3", product: "Snake Plant", productImg: "", rating: 5, text: "Very healthy and well-packaged.", date: "02 May 2026", status: "published" },
    ],
    aiCareQueries: [
      { id: "AI1", datetime: "15 Jun, 2:30 PM", query: "Why are my Monstera leaves yellow?", hasPhoto: true, rating: "helpful", converted: false },
      { id: "AI2", datetime: "12 Jun, 9:15 AM", query: "Best plants for low light?", hasPhoto: false, rating: null, converted: true },
      { id: "AI3", datetime: "05 Jun, 11:00 AM", query: "How often to water a peace lily?", hasPhoto: false, rating: "helpful", converted: false },
    ],
    gardenBookings: [
      { id: "GS-0821", service: "Balcony Garden", date: "20 Jun 2026", status: "confirmed" },
      { id: "GS-0654", service: "Lawn Maintenance", date: "15 Mar 2026", status: "completed" },
      { id: "GS-0401", service: "Terrace Setup", date: "10 Jan 2026", status: "completed" },
    ],
    activityLog: [
      { id: "L1", datetime: "Today 10:24 AM", actor: "Priya K.", action: "Order #ORD-4821 placed", type: "order" },
      { id: "L2", datetime: "15 Jun 2:11 PM", actor: "Suresh K.", action: 'Added tag "VIP"', type: "admin" },
      { id: "L3", datetime: "12 Jan 2025", actor: "System", action: "Account created", type: "system" },
    ],
    addresses: [
      { id: "A1", type: "home", isDefault: true, line1: "42 Green Park Society, Baner", city: "Pune", state: "Maharashtra", pincode: "411045" },
      { id: "A2", type: "work", isDefault: false, line1: "WeWork BKC", city: "Mumbai", state: "Maharashtra", pincode: "400051" },
    ],
    adminNotes: [
      { id: "N1", author: "Ravi K.", authorInitials: "RK", date: "10 Jun 2026", text: "Customer called about delayed delivery. Resolved with 10% discount code." },
    ],
    wishlist: [
      { id: "W1", name: "Bird of Paradise", price: "₹1,299", img: "" },
      { id: "W2", name: "Fiddle Leaf Fig", price: "₹899", img: "" },
      { id: "W3", name: "ZZ Plant", price: "₹499", img: "" },
      { id: "W4", name: "Pothos Golden", price: "₹299", img: "" },
    ],
  },
  {
    id: "2",
    customerId: "CST-00734",
    firstName: "Rahul",
    lastName: "Mehta",
    email: "rahul@email.com",
    phone: "+91 87654 32109",
    emailVerified: true,
    phoneVerified: false,
    city: "Mumbai",
    state: "Maharashtra",
    tier: "silver",
    status: "active",
    loyaltyPoints: 620,
    loyaltyPointsToNext: 380,
    nextTier: "Gold",
    orders: 8,
    ltv: "₹9,680",
    ltvRaw: 9680,
    aov: "₹1,210",
    returnRate: "5%",
    reviewCount: 5,
    lastOrder: "10 Jun 2026",
    joined: "15 Mar 2025",
    lastLogin: "1 day ago",
    tags: ["Gifting"],
    marketingEmail: true,
    marketingSms: false,
    language: "English",
    source: "Instagram",
    petOwner: false,
    aiCareUser: true,
    gardenClient: false,
    favouriteCategory: "Succulents (5 of 8 orders)",
    avgDaysBetweenOrders: 30,
    preferredPayment: "UPI (6 of 8)",
    deviceUsed: "Desktop (60%)",
    discountUsage: "2 of 8 orders (WELCOME15)",
    orderHistory: [
      { id: "ORD-4780", date: "10 Jun 2026", items: 2, total: "₹799", payment: "paid", status: "delivered" },
      { id: "ORD-4200", date: "05 May 2026", items: 3, total: "₹1,599", payment: "paid", status: "delivered" },
    ],
    reviews: [
      { id: "R4", product: "Aloe Vera", productImg: "", rating: 4, text: "Great plant for beginners!", date: "05 May 2026", status: "published" },
    ],
    aiCareQueries: [
      { id: "AI4", datetime: "08 Jun, 3:45 PM", query: "How to propagate succulents?", hasPhoto: false, rating: "helpful", converted: true },
    ],
    gardenBookings: [],
    activityLog: [
      { id: "L4", datetime: "10 Jun 2026", actor: "Rahul M.", action: "Order #ORD-4780 placed", type: "order" },
      { id: "L5", datetime: "15 Mar 2025", actor: "System", action: "Account created", type: "system" },
    ],
    addresses: [
      { id: "A3", type: "home", isDefault: true, line1: "12 Linking Road, Bandra", city: "Mumbai", state: "Maharashtra", pincode: "400050" },
    ],
    adminNotes: [],
    wishlist: [
      { id: "W5", name: "Cactus Collection", price: "₹599", img: "" },
    ],
  },
  {
    id: "3",
    customerId: "CST-00512",
    firstName: "Neha",
    lastName: "Kapoor",
    email: "neha@email.com",
    phone: "+91 76543 21098",
    emailVerified: false,
    phoneVerified: true,
    city: "Delhi",
    state: "Delhi",
    tier: "plant_lover",
    status: "new",
    loyaltyPoints: 120,
    loyaltyPointsToNext: 380,
    nextTier: "Silver",
    orders: 2,
    ltv: "₹1,599",
    ltvRaw: 1599,
    aov: "₹800",
    returnRate: "0%",
    reviewCount: 1,
    lastOrder: "01 Jun 2026",
    joined: "20 May 2026",
    lastLogin: "3 days ago",
    tags: [],
    marketingEmail: true,
    marketingSms: false,
    language: "Hindi",
    source: "Direct",
    petOwner: true,
    aiCareUser: false,
    gardenClient: false,
    favouriteCategory: "Flowering Plants",
    avgDaysBetweenOrders: 12,
    preferredPayment: "Credit Card",
    deviceUsed: "Mobile (90%)",
    discountUsage: "1 of 2 orders",
    orderHistory: [
      { id: "ORD-4650", date: "01 Jun 2026", items: 1, total: "₹899", payment: "paid", status: "delivered" },
      { id: "ORD-4400", date: "25 May 2026", items: 1, total: "₹700", payment: "paid", status: "delivered" },
    ],
    reviews: [
      { id: "R5", product: "Hibiscus Plant", productImg: "", rating: 5, text: "Beautiful flowers, love it!", date: "01 Jun 2026", status: "pending" },
    ],
    aiCareQueries: [],
    gardenBookings: [],
    activityLog: [
      { id: "L6", datetime: "01 Jun 2026", actor: "Neha K.", action: "Order #ORD-4650 placed", type: "order" },
      { id: "L7", datetime: "20 May 2026", actor: "System", action: "Account created", type: "system" },
    ],
    addresses: [
      { id: "A4", type: "home", isDefault: true, line1: "8 Connaught Place", city: "New Delhi", state: "Delhi", pincode: "110001" },
    ],
    adminNotes: [],
    wishlist: [],
  },
  {
    id: "4",
    customerId: "CST-00198",
    firstName: "Aditya",
    lastName: "Patel",
    email: "aditya@email.com",
    phone: "+91 65432 10987",
    emailVerified: true,
    phoneVerified: true,
    city: "Ahmedabad",
    state: "Gujarat",
    tier: "plant_lover",
    status: "at_risk",
    loyaltyPoints: 80,
    loyaltyPointsToNext: 420,
    nextTier: "Silver",
    orders: 3,
    ltv: "₹2,890",
    ltvRaw: 2890,
    aov: "₹963",
    returnRate: "10%",
    reviewCount: 2,
    lastOrder: "15 Feb 2026",
    joined: "10 Jun 2025",
    lastLogin: "95 days ago",
    tags: [],
    marketingEmail: false,
    marketingSms: false,
    language: "Gujarati",
    source: "Google",
    petOwner: false,
    aiCareUser: false,
    gardenClient: false,
    favouriteCategory: "Outdoor Plants",
    avgDaysBetweenOrders: 60,
    preferredPayment: "Net Banking",
    deviceUsed: "Desktop (80%)",
    discountUsage: "None",
    orderHistory: [
      { id: "ORD-3200", date: "15 Feb 2026", items: 2, total: "₹1,200", payment: "paid", status: "delivered" },
    ],
    reviews: [],
    aiCareQueries: [],
    gardenBookings: [],
    activityLog: [
      { id: "L8", datetime: "15 Feb 2026", actor: "Aditya P.", action: "Order #ORD-3200 placed", type: "order" },
    ],
    addresses: [
      { id: "A5", type: "home", isDefault: true, line1: "22 SG Highway", city: "Ahmedabad", state: "Gujarat", pincode: "380015" },
    ],
    adminNotes: [],
    wishlist: [],
  },
  {
    id: "5",
    customerId: "CST-00045",
    firstName: "Vikram",
    lastName: "Das",
    email: "vikram@email.com",
    phone: "+91 43210 98765",
    emailVerified: true,
    phoneVerified: true,
    city: "Bangalore",
    state: "Karnataka",
    tier: "gold",
    status: "active",
    loyaltyPoints: 2100,
    loyaltyPointsToNext: 0,
    nextTier: "Gold (Max)",
    orders: 28,
    ltv: "₹38,420",
    ltvRaw: 38420,
    aov: "₹1,372",
    returnRate: "3%",
    reviewCount: 18,
    lastOrder: "28 Jun 2026",
    joined: "05 Nov 2024",
    lastLogin: "30 minutes ago",
    tags: ["VIP", "Corporate", "Gifting"],
    marketingEmail: true,
    marketingSms: true,
    language: "English",
    source: "Referral",
    petOwner: true,
    aiCareUser: true,
    gardenClient: true,
    favouriteCategory: "Rare Plants (15 of 28 orders)",
    avgDaysBetweenOrders: 14,
    preferredPayment: "Amex (20 of 28)",
    deviceUsed: "Desktop (55%)",
    discountUsage: "8 of 28 orders",
    orderHistory: [
      { id: "ORD-4899", date: "28 Jun 2026", items: 5, total: "₹4,500", payment: "paid", status: "processing" },
      { id: "ORD-4845", date: "20 Jun 2026", items: 2, total: "₹1,800", payment: "paid", status: "delivered" },
    ],
    reviews: [],
    aiCareQueries: [],
    gardenBookings: [
      { id: "GS-0920", service: "Rooftop Garden Design", date: "25 Jun 2026", status: "confirmed" },
    ],
    activityLog: [],
    addresses: [
      { id: "A6", type: "home", isDefault: true, line1: "15 Indiranagar, 100 Feet Road", city: "Bangalore", state: "Karnataka", pincode: "560038" },
    ],
    adminNotes: [],
    wishlist: [],
  },
  {
    id: "6",
    customerId: "CST-00302",
    firstName: "Sunita",
    lastName: "Rao",
    email: "sunita@email.com",
    phone: "+91 54321 09876",
    emailVerified: true,
    phoneVerified: false,
    city: "Hyderabad",
    state: "Telangana",
    tier: "silver",
    status: "active",
    loyaltyPoints: 480,
    loyaltyPointsToNext: 520,
    nextTier: "Gold",
    orders: 6,
    ltv: "₹7,200",
    ltvRaw: 7200,
    aov: "₹1,200",
    returnRate: "0%",
    reviewCount: 4,
    lastOrder: "22 Jun 2026",
    joined: "08 Aug 2025",
    lastLogin: "2 days ago",
    tags: [],
    marketingEmail: true,
    marketingSms: true,
    language: "Telugu",
    source: "Instagram",
    petOwner: false,
    aiCareUser: true,
    gardenClient: false,
    favouriteCategory: "Succulents",
    avgDaysBetweenOrders: 20,
    preferredPayment: "UPI",
    deviceUsed: "Mobile (85%)",
    discountUsage: "3 of 6 orders",
    orderHistory: [],
    reviews: [],
    aiCareQueries: [],
    gardenBookings: [],
    activityLog: [],
    addresses: [{ id: "A7", type: "home", isDefault: true, line1: "5 Jubilee Hills", city: "Hyderabad", state: "Telangana", pincode: "500033" }],
    adminNotes: [],
    wishlist: [],
  },
  {
    id: "7",
    customerId: "CST-00089",
    firstName: "Asha",
    lastName: "Tiwari",
    email: "asha@email.com",
    phone: "+91 32109 87654",
    emailVerified: true,
    phoneVerified: true,
    city: "Jaipur",
    state: "Rajasthan",
    tier: "plant_lover",
    status: "blocked",
    loyaltyPoints: 0,
    loyaltyPointsToNext: 500,
    nextTier: "Silver",
    orders: 2,
    ltv: "₹699",
    ltvRaw: 699,
    aov: "₹350",
    returnRate: "50%",
    reviewCount: 0,
    lastOrder: "10 Apr 2026",
    joined: "01 Apr 2026",
    lastLogin: "90 days ago",
    tags: [],
    marketingEmail: false,
    marketingSms: false,
    language: "Hindi",
    source: "Direct",
    petOwner: false,
    aiCareUser: false,
    gardenClient: false,
    favouriteCategory: "Herbs",
    avgDaysBetweenOrders: 9,
    preferredPayment: "COD",
    deviceUsed: "Mobile (100%)",
    discountUsage: "None",
    orderHistory: [],
    reviews: [],
    aiCareQueries: [],
    gardenBookings: [],
    activityLog: [],
    addresses: [],
    adminNotes: [{ id: "N2", author: "Admin", authorInitials: "AD", date: "15 Apr 2026", text: "Account blocked due to fraudulent chargeback activity." }],
    wishlist: [],
  },
  {
    id: "8",
    customerId: "CST-00445",
    firstName: "Kiran",
    lastName: "Bose",
    email: "kiran@email.com",
    phone: "+91 21098 76543",
    emailVerified: true,
    phoneVerified: true,
    city: "Kolkata",
    state: "West Bengal",
    tier: "silver",
    status: "active",
    loyaltyPoints: 350,
    loyaltyPointsToNext: 650,
    nextTier: "Gold",
    orders: 4,
    ltv: "₹4,940",
    ltvRaw: 4940,
    aov: "₹1,235",
    returnRate: "0%",
    reviewCount: 3,
    lastOrder: "18 Jun 2026",
    joined: "20 Nov 2024",
    lastLogin: "5 hours ago",
    tags: [],
    marketingEmail: true,
    marketingSms: false,
    language: "Bengali",
    source: "Google",
    petOwner: true,
    aiCareUser: false,
    gardenClient: true,
    favouriteCategory: "Flowering Plants",
    avgDaysBetweenOrders: 45,
    preferredPayment: "Net Banking",
    deviceUsed: "Desktop (70%)",
    discountUsage: "1 of 4 orders",
    orderHistory: [],
    reviews: [],
    aiCareQueries: [],
    gardenBookings: [],
    activityLog: [],
    addresses: [{ id: "A8", type: "home", isDefault: true, line1: "33 Park Street", city: "Kolkata", state: "West Bengal", pincode: "700016" }],
    adminNotes: [],
    wishlist: [],
  },
];

export const KPI_DATA = {
  totalCustomers: { value: "12,481", delta: "+4.2%", positive: true },
  newThisMonth: { value: "342", delta: "+18 vs last", positive: true },
  active30d: { value: "4,821", delta: "38.6% rate", positive: true },
  avgLtv: { value: "₹14,820", delta: "+2.1%", positive: true },
  vipCustomers: { value: "284", delta: "🥇 Gold tier", positive: true },
  atRisk: { value: "1,204", delta: "90d no order", positive: false },
};
