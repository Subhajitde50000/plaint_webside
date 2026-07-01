/* ─── Types ──────────────────────────────────────────────────────────────────── */
export type ReviewStatus = "pending" | "published" | "rejected" | "flagged" | "featured";

export interface ReviewFlag {
  reason: string;
  reportedBy: string;
  date: string;
}

export interface ModerationHistoryEntry {
  action: string;
  at: string;
  by: string;
}

export interface Review {
  id: string;
  customerId: string;
  reviewerName: string;
  reviewerEmail: string;
  reviewerAvatar: string;
  orderId: string;
  productId: string;
  productName: string;
  productVariant: string;
  rating: number;
  title: string;
  body: string;
  photos: string[];
  status: ReviewStatus;
  isVerifiedPurchase: boolean;
  isFeatured: boolean;
  adminReply: string | null;
  adminReplyAt: string | null;
  adminReplyBy: string | null;
  flagCount: number;
  flags: ReviewFlag[];
  moderationHistory: ModerationHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

/* ─── Mock Data ──────────────────────────────────────────────────────────────── */
export const MOCK_REVIEWS: Review[] = [
  {
    id: "REV-08214",
    customerId: "CUS-001",
    reviewerName: "Priya Kumar",
    reviewerEmail: "priya@email.com",
    reviewerAvatar: "PK",
    orderId: "ORD-4821",
    productId: "PRD-001",
    productName: "Monstera Deliciosa",
    productVariant: "Medium",
    rating: 5,
    title: "Absolutely beautiful plant!",
    body: "Absolutely beautiful plant! Arrived in perfect condition and the packaging was excellent. Highly recommend for first-time plant owners. The leaves are huge and healthy. The soil was moist and the plant looked vibrant right out of the box.",
    photos: [],
    status: "pending",
    isVerifiedPurchase: true,
    isFeatured: false,
    adminReply: null,
    adminReplyAt: null,
    adminReplyBy: null,
    flagCount: 0,
    flags: [],
    moderationHistory: [
      { action: "Review submitted", at: "2026-06-15T10:32:00+05:30", by: "Priya K." },
    ],
    createdAt: "2026-06-15T10:32:00+05:30",
    updatedAt: "2026-06-15T10:32:00+05:30",
  },
  {
    id: "REV-08213",
    customerId: "CUS-002",
    reviewerName: "Ravi Shah",
    reviewerEmail: "ravi@email.com",
    reviewerAvatar: "RS",
    orderId: "ORD-4820",
    productId: "PRD-002",
    productName: "Peace Lily",
    productVariant: "Small",
    rating: 4,
    title: "Great plant, good packaging",
    body: "Really happy with this Peace Lily. It was well packaged and arrived in great shape. Has already bloomed once since I got it. Would buy again.",
    photos: [],
    status: "published",
    isVerifiedPurchase: true,
    isFeatured: false,
    adminReply: "Thank you for your wonderful review, Ravi! We're so glad your Peace Lily is thriving. 🌿",
    adminReplyAt: "2026-06-15T12:00:00+05:30",
    adminReplyBy: "Suresh K.",
    flagCount: 0,
    flags: [],
    moderationHistory: [
      { action: "Review submitted", at: "2026-06-14T09:15:00+05:30", by: "Ravi S." },
      { action: "Approved & published", at: "2026-06-14T11:00:00+05:30", by: "Suresh K." },
      { action: "Admin reply posted", at: "2026-06-15T12:00:00+05:30", by: "Suresh K." },
    ],
    createdAt: "2026-06-14T09:15:00+05:30",
    updatedAt: "2026-06-15T12:00:00+05:30",
  },
  {
    id: "REV-08212",
    customerId: "CUS-003",
    reviewerName: "Ananya Singh",
    reviewerEmail: "ananya@email.com",
    reviewerAvatar: "AS",
    orderId: "ORD-4819",
    productId: "PRD-003",
    productName: "Fiddle Leaf Fig",
    productVariant: "Large",
    rating: 2,
    title: "Arrived damaged",
    body: "The plant arrived with two broken stems and some yellowing leaves. Very disappointed considering the price. The packaging could be improved significantly for larger plants.",
    photos: [],
    status: "flagged",
    isVerifiedPurchase: true,
    isFeatured: false,
    adminReply: null,
    adminReplyAt: null,
    adminReplyBy: null,
    flagCount: 2,
    flags: [
      { reason: "Inappropriate language", reportedBy: "Customer (anonymous)", date: "2026-06-14T14:30:00+05:30" },
      { reason: "Suspected fake review", reportedBy: "System (AI detection)", date: "2026-06-15T08:00:00+05:30" },
    ],
    moderationHistory: [
      { action: "Review submitted", at: "2026-06-13T16:45:00+05:30", by: "Ananya S." },
      { action: "Flagged (AI: spam check, score: 0.82)", at: "2026-06-14T08:00:00+05:30", by: "System" },
      { action: "Reported by customer", at: "2026-06-14T14:30:00+05:30", by: "Anonymous" },
    ],
    createdAt: "2026-06-13T16:45:00+05:30",
    updatedAt: "2026-06-15T08:00:00+05:30",
  },
  {
    id: "REV-08211",
    customerId: "CUS-004",
    reviewerName: "Dev Patel",
    reviewerEmail: "dev@email.com",
    reviewerAvatar: "DP",
    orderId: "ORD-4818",
    productId: "PRD-004",
    productName: "Snake Plant",
    productVariant: "Medium",
    rating: 5,
    title: "Perfect for beginners!",
    body: "This snake plant is exactly what I was looking for. Very low maintenance and looks stunning in my living room. The seller communicated well and shipping was fast.",
    photos: [],
    status: "pending",
    isVerifiedPurchase: true,
    isFeatured: false,
    adminReply: null,
    adminReplyAt: null,
    adminReplyBy: null,
    flagCount: 0,
    flags: [],
    moderationHistory: [
      { action: "Review submitted", at: "2026-06-15T14:20:00+05:30", by: "Dev P." },
    ],
    createdAt: "2026-06-15T14:20:00+05:30",
    updatedAt: "2026-06-15T14:20:00+05:30",
  },
  {
    id: "REV-08210",
    customerId: "CUS-005",
    reviewerName: "Meera Nair",
    reviewerEmail: "meera@email.com",
    reviewerAvatar: "MN",
    orderId: "ORD-4817",
    productId: "PRD-005",
    productName: "Pothos Golden",
    productVariant: "Hanging",
    rating: 5,
    title: "Gorgeous trailing plant",
    body: "The pothos is absolutely gorgeous! The trailing vines are already so long and the leaves are a beautiful golden-green. This is my third plant from this store and they never disappoint.",
    photos: [],
    status: "published",
    isVerifiedPurchase: true,
    isFeatured: true,
    adminReply: "Thank you Meera! We love repeat customers — your plant family is growing beautifully! 🌿✨",
    adminReplyAt: "2026-06-12T09:30:00+05:30",
    adminReplyBy: "Suresh K.",
    flagCount: 0,
    flags: [],
    moderationHistory: [
      { action: "Review submitted", at: "2026-06-11T10:00:00+05:30", by: "Meera N." },
      { action: "Approved & published", at: "2026-06-11T11:30:00+05:30", by: "Suresh K." },
      { action: "Featured on PDP", at: "2026-06-11T11:32:00+05:30", by: "Suresh K." },
      { action: "Admin reply posted", at: "2026-06-12T09:30:00+05:30", by: "Suresh K." },
    ],
    createdAt: "2026-06-11T10:00:00+05:30",
    updatedAt: "2026-06-12T09:30:00+05:30",
  },
  {
    id: "REV-08209",
    customerId: "CUS-006",
    reviewerName: "Karthik Raj",
    reviewerEmail: "karthik@email.com",
    reviewerAvatar: "KR",
    orderId: "ORD-4816",
    productId: "PRD-006",
    productName: "Terracotta Pot 14cm",
    productVariant: "Natural",
    rating: 3,
    title: "Average quality",
    body: "The pot is okay, nothing special. Expected better quality for the price. Drainage hole is a bit small. Does the job though.",
    photos: [],
    status: "published",
    isVerifiedPurchase: false,
    isFeatured: false,
    adminReply: null,
    adminReplyAt: null,
    adminReplyBy: null,
    flagCount: 0,
    flags: [],
    moderationHistory: [
      { action: "Review submitted", at: "2026-06-10T08:45:00+05:30", by: "Karthik R." },
      { action: "Approved & published", at: "2026-06-10T10:00:00+05:30", by: "System (auto-approve)" },
    ],
    createdAt: "2026-06-10T08:45:00+05:30",
    updatedAt: "2026-06-10T10:00:00+05:30",
  },
  {
    id: "REV-08208",
    customerId: "CUS-007",
    reviewerName: "Sunita Verma",
    reviewerEmail: "sunita@email.com",
    reviewerAvatar: "SV",
    orderId: "ORD-4815",
    productId: "PRD-001",
    productName: "Monstera Deliciosa",
    productVariant: "Large",
    rating: 1,
    title: "Complete waste of money",
    body: "Buy this plant here! Amazing deals! Click the link in my bio!!! This is clearly spam and not a real review. Avoid this fake store!",
    photos: [],
    status: "rejected",
    isVerifiedPurchase: false,
    isFeatured: false,
    adminReply: null,
    adminReplyAt: null,
    adminReplyBy: null,
    flagCount: 1,
    flags: [
      { reason: "Spam/promotional content", reportedBy: "System (AI detection)", date: "2026-06-09T07:00:00+05:30" },
    ],
    moderationHistory: [
      { action: "Review submitted", at: "2026-06-09T06:50:00+05:30", by: "Sunita V." },
      { action: "Auto-flagged as spam (AI score: 0.97)", at: "2026-06-09T07:00:00+05:30", by: "System" },
      { action: "Rejected (Spam/promotional content)", at: "2026-06-09T09:15:00+05:30", by: "Admin" },
    ],
    createdAt: "2026-06-09T06:50:00+05:30",
    updatedAt: "2026-06-09T09:15:00+05:30",
  },
  {
    id: "REV-08207",
    customerId: "CUS-008",
    reviewerName: "Arjun Mehta",
    reviewerEmail: "arjun@email.com",
    reviewerAvatar: "AM",
    orderId: "ORD-4814",
    productId: "PRD-007",
    productName: "Bird of Paradise",
    productVariant: "XL",
    rating: 5,
    title: "Worth every penny",
    body: "This is truly a statement piece. The Bird of Paradise is stunning — huge, healthy leaves and it has already put out two new leaves since I got it two weeks ago. Very happy with this purchase.",
    photos: [],
    status: "pending",
    isVerifiedPurchase: true,
    isFeatured: false,
    adminReply: null,
    adminReplyAt: null,
    adminReplyBy: null,
    flagCount: 0,
    flags: [],
    moderationHistory: [
      { action: "Review submitted", at: "2026-06-15T16:00:00+05:30", by: "Arjun M." },
    ],
    createdAt: "2026-06-15T16:00:00+05:30",
    updatedAt: "2026-06-15T16:00:00+05:30",
  },
  {
    id: "REV-08206",
    customerId: "CUS-009",
    reviewerName: "Lakshmi Iyer",
    reviewerEmail: "lakshmi@email.com",
    reviewerAvatar: "LI",
    orderId: "ORD-4813",
    productId: "PRD-002",
    productName: "Peace Lily",
    productVariant: "Medium",
    rating: 4,
    title: "Beautiful and purifying",
    body: "Love this Peace Lily! It's supposed to purify air and it definitely makes my room feel fresher. A few leaves had minor browning at the tips on arrival but overall in good condition.",
    photos: [],
    status: "pending",
    isVerifiedPurchase: true,
    isFeatured: false,
    adminReply: null,
    adminReplyAt: null,
    adminReplyBy: null,
    flagCount: 0,
    flags: [],
    moderationHistory: [
      { action: "Review submitted", at: "2026-06-15T11:30:00+05:30", by: "Lakshmi I." },
    ],
    createdAt: "2026-06-15T11:30:00+05:30",
    updatedAt: "2026-06-15T11:30:00+05:30",
  },
  {
    id: "REV-08205",
    customerId: "CUS-010",
    reviewerName: "Vikram Bose",
    reviewerEmail: "vikram@email.com",
    reviewerAvatar: "VB",
    orderId: "ORD-4812",
    productId: "PRD-003",
    productName: "Fiddle Leaf Fig",
    productVariant: "Medium",
    rating: 5,
    title: "My new favourite plant",
    body: "I've been wanting a Fiddle Leaf Fig for years and this one exceeded all my expectations. Perfectly potted, beautiful shape, and the seller included a care card which was so thoughtful.",
    photos: [],
    status: "published",
    isVerifiedPurchase: true,
    isFeatured: false,
    adminReply: null,
    adminReplyAt: null,
    adminReplyBy: null,
    flagCount: 0,
    flags: [],
    moderationHistory: [
      { action: "Review submitted", at: "2026-06-08T15:00:00+05:30", by: "Vikram B." },
      { action: "Approved & published", at: "2026-06-08T16:30:00+05:30", by: "Admin" },
    ],
    createdAt: "2026-06-08T15:00:00+05:30",
    updatedAt: "2026-06-08T16:30:00+05:30",
  },
  {
    id: "REV-08204",
    customerId: "CUS-011",
    reviewerName: "Pooja Sharma",
    reviewerEmail: "pooja@email.com",
    reviewerAvatar: "PS",
    orderId: "ORD-4811",
    productId: "PRD-008",
    productName: "Rubber Plant",
    productVariant: "Medium",
    rating: 4,
    title: "Looks great in my office",
    body: "Very healthy rubber plant with glossy leaves. Exactly as described. Shipping was careful and the pot is a nice size. Will definitely order more plants from here!",
    photos: [],
    status: "pending",
    isVerifiedPurchase: true,
    isFeatured: false,
    adminReply: null,
    adminReplyAt: null,
    adminReplyBy: null,
    flagCount: 0,
    flags: [],
    moderationHistory: [
      { action: "Review submitted", at: "2026-06-15T09:00:00+05:30", by: "Pooja S." },
    ],
    createdAt: "2026-06-15T09:00:00+05:30",
    updatedAt: "2026-06-15T09:00:00+05:30",
  },
  {
    id: "REV-08203",
    customerId: "CUS-012",
    reviewerName: "Rohit Gupta",
    reviewerEmail: "rohit@email.com",
    reviewerAvatar: "RG",
    orderId: "ORD-4810",
    productId: "PRD-009",
    productName: "ZZ Plant",
    productVariant: "Small",
    rating: 5,
    title: "Indestructible and beautiful",
    body: "This ZZ plant is perfect for someone like me who forgets to water plants. It just thrives no matter what! The leaves are perfectly shiny and the plant looks full and healthy.",
    photos: [],
    status: "published",
    isVerifiedPurchase: true,
    isFeatured: false,
    adminReply: "Thank you Rohit! ZZ plants are perfect for busy plant parents. Enjoy! 🌱",
    adminReplyAt: "2026-06-06T10:00:00+05:30",
    adminReplyBy: "Suresh K.",
    flagCount: 0,
    flags: [],
    moderationHistory: [
      { action: "Review submitted", at: "2026-06-05T14:00:00+05:30", by: "Rohit G." },
      { action: "Approved & published", at: "2026-06-05T15:00:00+05:30", by: "Admin" },
      { action: "Admin reply posted", at: "2026-06-06T10:00:00+05:30", by: "Suresh K." },
    ],
    createdAt: "2026-06-05T14:00:00+05:30",
    updatedAt: "2026-06-06T10:00:00+05:30",
  },
];

export const KPI_DATA = {
  avgRating: 4.6,
  totalReviews: 4821,
  pending: 5,
  flagged: 2,
  responseRate: 68,
  ratingChange: "+0.1",
  totalChange: "+124",
};

export function countByStatus(reviews: Review[], status: ReviewStatus | "all"): number {
  if (status === "all") return reviews.length;
  return reviews.filter((r) => r.status === status).length;
}

export const REJECTION_REASONS = [
  "Inappropriate language",
  "Spam/promotional content",
  "Off-topic",
  "Fake/unverifiable purchase",
  "Personal information shared",
  "Duplicate review",
  "Other",
];

export const REPLY_TEMPLATES = {
  "Thank You": (name: string) =>
    `Thank you for the wonderful review, ${name}! We're thrilled your plant arrived happy and healthy. 🌿`,
  "Address Concern": (name: string) =>
    `Hi ${name}, thank you for your feedback. We're sorry to hear about your experience and would love to make it right. Please reach out to our support team.`,
  Apology: (name: string) =>
    `Dear ${name}, we sincerely apologise for the inconvenience. Your satisfaction is our top priority and we'll do everything we can to resolve this.`,
  Custom: () => "",
};
