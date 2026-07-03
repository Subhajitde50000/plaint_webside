"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
  ComposedChart, ScatterChart, Scatter,
} from "recharts";

/* ═══════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════ */
const T = {
  bgCanvas:    "#0f1117",
  bgSurface:   "#1c2128",
  bgElevated:  "#22272e",
  bgOverlay:   "#2d333b",
  bgSidebar:   "#161b22",
  text:        "#cdd9e5",
  textMuted:   "#768390",
  textLabel:   "#adbac7",
  border:      "#444c56",
  borderMuted: "rgba(68,76,86,0.5)",
  borderActive:"#00b566",
  accent:      "#00b566",
  accentMuted: "rgba(0,181,102,0.15)",
  positive:    "#57ab5a",
  negative:    "#e5534b",
  warning:     "#c69026",
  info:        "#539bf5",
  purple:      "#986ee2",
  chart1:      "#00b566",
  chart2:      "#539bf5",
  chart3:      "#c69026",
  chart4:      "#986ee2",
  chart5:      "#e5534b",
  chartGrid:   "rgba(68,76,86,0.4)",
  shadow:      "0 2px 8px rgba(0,0,0,0.25)",
  shadowLg:    "0 8px 32px rgba(0,0,0,0.35)",
  radiusSm:    "6px",
  radiusMd:    "10px",
  radiusLg:    "16px",
};

type Section = "overview" | "revenue" | "orders" | "products" | "customers" | "marketing" | "garden";
type Granularity = "daily" | "weekly" | "monthly";
type DateRange = "today" | "7d" | "30d" | "90d" | "month" | "last_month" | "quarter" | "ytd" | "custom";
type CompareMode = "none" | "prev_period" | "prev_year";

/* ═══════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════ */

// Overview KPIs
const OVERVIEW_KPIS = [
  { id: "total_revenue",  label: "Total Revenue",      value: "₹4,82,340",   delta: "+18.4%",   positive: true,  ctx: "vs previous period",  abbr: "₹4.8L",  spark: [40,55,48,72,62,80,92] },
  { id: "total_orders",   label: "Total Orders",       value: "4,821",        delta: "+12.3%",   positive: true,  ctx: "vs previous period",  abbr: "4.8K",   spark: [30,42,38,58,48,68,80] },
  { id: "aov",            label: "Avg Order Value",    value: "₹1,248",      delta: "−2.1%",    positive: false, ctx: "vs previous period",  abbr: "₹1.2K",  spark: [80,75,78,72,70,74,72] },
  { id: "new_customers",  label: "New Customers",      value: "342",          delta: "+8.4%",    positive: true,  ctx: "vs previous period",  abbr: "342",    spark: [20,28,24,35,32,42,38] },
  { id: "units_sold",     label: "Units Sold",         value: "6,204",        delta: "+9.2%",    positive: true,  ctx: "vs previous period",  abbr: "6.2K",   spark: [48,62,55,78,68,84,90] },
  { id: "return_rate",    label: "Return Rate",        value: "2.4%",         delta: "−0.3%",    positive: true,  ctx: "vs previous period",  abbr: "2.4%",   spark: [28,24,26,22,25,21,24] },
  { id: "garden_rev",     label: "Garden Revenue",     value: "₹2,48,000",  delta: "+24.1%",   positive: true,  ctx: "vs previous period",  abbr: "₹2.5L",  spark: [20,28,32,40,48,60,72] },
  { id: "ai_care",        label: "AI Care → Cart",     value: "12.4%",        delta: "+2.1%",    positive: true,  ctx: "vs previous period",  abbr: "12.4%",  spark: [30,34,38,36,42,40,44] },
];

// Revenue Over Time
const REVENUE_TIME_DAILY = [
  { label: "Jul 1",  revenue: 12420, orders: 42,  aov: 296,  prevRevenue: 10200 },
  { label: "Jul 3",  revenue: 18840, orders: 58,  aov: 325,  prevRevenue: 14800 },
  { label: "Jul 5",  revenue: 14200, orders: 44,  aov: 323,  prevRevenue: 12100 },
  { label: "Jul 8",  revenue: 22100, orders: 68,  aov: 325,  prevRevenue: 18200 },
  { label: "Jul 10", revenue: 19800, orders: 62,  aov: 319,  prevRevenue: 16400 },
  { label: "Jul 12", revenue: 28400, orders: 84,  aov: 338,  prevRevenue: 22800 },
  { label: "Jul 15", revenue: 24100, orders: 72,  aov: 335,  prevRevenue: 20200 },
  { label: "Jul 17", revenue: 31200, orders: 92,  aov: 339,  prevRevenue: 26400 },
  { label: "Jul 20", revenue: 26800, orders: 80,  aov: 335,  prevRevenue: 22200 },
  { label: "Jul 22", revenue: 38400, orders: 114, aov: 337,  prevRevenue: 32100 },
  { label: "Jul 25", revenue: 42800, orders: 126, aov: 340,  prevRevenue: 35800 },
  { label: "Jul 28", revenue: 48210, orders: 142, aov: 339,  prevRevenue: 40200 },
  { label: "Jul 31", revenue: 54820, orders: 162, aov: 338,  prevRevenue: 46100 },
];

// Sales by Category
const SALES_CATEGORIES = [
  { name: "Indoor Plants",  value: 47, revenue: "₹2.3L", color: T.chart1 },
  { name: "Outdoor Plants", value: 23, revenue: "₹1.1L", color: T.chart2 },
  { name: "Seeds",          value: 15, revenue: "₹0.7L", color: T.chart3 },
  { name: "Succulents",     value: 10, revenue: "₹0.5L", color: T.chart4 },
  { name: "Other",          value:  5, revenue: "₹0.2L", color: T.chart5 },
];

// Top Products
const TOP_PRODUCTS = [
  { rank: 1, name: "Monstera Deliciosa M",  revenue: "₹98,402",  units: 248, aov: "₹397", stock: 234, lowStock: false },
  { rank: 2, name: "Peace Lily S",           revenue: "₹72,180",  units: 290, aov: "₹249", stock: 89,  lowStock: false },
  { rank: 3, name: "Snake Plant",            revenue: "₹61,404",  units: 204, aov: "₹301", stock: 3,   lowStock: true  },
  { rank: 4, name: "Pothos Vine",            revenue: "₹54,210",  units: 186, aov: "₹291", stock: 42,  lowStock: false },
  { rank: 5, name: "ZZ Plant M",             revenue: "₹41,820",  units: 142, aov: "₹295", stock: 7,   lowStock: true  },
];

// Geographic Revenue
const GEO_REVENUE = [
  { city: "Mumbai",    revenue: 124820, pct: 100 },
  { city: "Pune",      revenue: 84210,  pct: 67  },
  { city: "Bangalore", revenue: 62440,  pct: 50  },
  { city: "Delhi",     revenue: 48320,  pct: 39  },
  { city: "Chennai",   revenue: 32180,  pct: 26  },
  { city: "Hyderabad", revenue: 28450,  pct: 23  },
  { city: "Kolkata",   revenue: 21200,  pct: 17  },
  { city: "Ahmedabad", revenue: 18640,  pct: 15  },
];

// Revenue section KPIs
const REVENUE_KPIS = [
  { id: "gross_rev",   label: "Gross Revenue",       value: "₹4,82,340",  delta: "+18.4%", positive: true,  ctx: "Before discounts & returns" },
  { id: "net_rev",     label: "Net Revenue",          value: "₹4,38,920",  delta: "+16.2%", positive: true,  ctx: "After discounts & returns"  },
  { id: "disc_cost",   label: "Discount Cost",        value: "₹38,420",   delta: "+4.2%",  positive: false, ctx: "Cost to business"           },
  { id: "refunds",     label: "Refunds Issued",       value: "₹12,180",   delta: "−8.1%",  positive: true,  ctx: "vs previous period"         },
  { id: "aov2",        label: "Avg Order Value",      value: "₹1,248",    delta: "−2.1%",  positive: false, ctx: "vs previous period"         },
  { id: "rpc",         label: "Revenue per Customer", value: "₹124",      delta: "+3.4%",  positive: true,  ctx: "LTV ÷ active customers"     },
];

// Gross vs Net Revenue
const GROSS_NET_DATA = [
  { label: "Jan", gross: 320000, net: 290000, discount: 22000, refund: 8000 },
  { label: "Feb", gross: 290000, net: 262000, discount: 20000, refund: 8000 },
  { label: "Mar", gross: 380000, net: 343000, discount: 27000, refund: 10000 },
  { label: "Apr", gross: 350000, net: 316000, discount: 24000, refund: 10000 },
  { label: "May", gross: 410000, net: 373000, discount: 28000, refund: 9000  },
  { label: "Jun", gross: 482340, net: 438920, discount: 30000, refund: 13000 },
];

// Revenue Sources (donut)
const REVENUE_SOURCES = [
  { name: "Direct plant sales", pct: 72, revenue: "₹3.47L", color: T.chart1 },
  { name: "Garden services",    pct: 18, revenue: "₹0.87L", color: T.chart4 },
  { name: "Pot upsells",        pct:  7, revenue: "₹0.34L", color: T.chart3 },
  { name: "Seeds/accessories",  pct:  3, revenue: "₹0.14L", color: T.chart2 },
];

// Discount Cost Analysis
const DISCOUNT_TABLE = [
  { code: "HERO20",      uses: 824,   cost: "₹16,480", revenue: "₹82,400",  roi: "5.0x" },
  { code: "WELCOME15",   uses: 612,   cost: "₹9,180",  revenue: "₹61,200",  roi: "6.7x" },
  { code: "FREESHIP499", uses: 1204,  cost: "₹12,040", revenue: "₹1,20,400",roi: "10.0x"},
  { code: "SUMMER10",    uses: 432,   cost: "₹6,480",  revenue: "₹43,200",  roi: "6.7x" },
  { code: "PLANT25",     uses: 284,   cost: "₹7,100",  revenue: "₹28,400",  roi: "4.0x" },
];

// Payment Methods
const PAYMENT_METHODS = [
  { method: "Visa/Mastercard", pct: 58, revenue: "₹2,79,757", color: T.chart1 },
  { method: "UPI (Razorpay)",  pct: 28, revenue: "₹1,35,055", color: T.chart2 },
  { method: "Net Banking",     pct:  9, revenue: "₹43,411",   color: T.chart3 },
  { method: "COD",             pct:  5, revenue: "₹24,117",   color: T.chart4 },
];

// Revenue Cohort
const COHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const REVENUE_COHORT = [
  { month: "Jan", values: [320, 80, 60, 40, 30, 20] },
  { month: "Feb", values: [null, 280, 70, 50, 30, 20] },
  { month: "Mar", values: [null, null, 360, 90, 60, 40] },
  { month: "Apr", values: [null, null, null, 310, 75, 50] },
  { month: "May", values: [null, null, null, null, 390, 95] },
  { month: "Jun", values: [null, null, null, null, null, 420] },
];

// Orders KPIs
const ORDERS_KPIS = [
  { id: "total_orders2",   label: "Total Orders",        value: "4,821", delta: "+12.3%", positive: true,  ctx: "vs previous period" },
  { id: "orders_today",    label: "Orders Today",         value: "124",   delta: "+12",    positive: true,  ctx: "vs yesterday"       },
  { id: "items_per_order", label: "Avg Items / Order",    value: "1.8",   delta: "+0.1",   positive: true,  ctx: "vs previous period" },
  { id: "cancel_rate",     label: "Cancellation Rate",    value: "2.4%",  delta: "+0.2%",  positive: false, ctx: "vs previous period" },
  { id: "return_rate2",    label: "Return Rate",          value: "1.8%",  delta: "−0.4%",  positive: true,  ctx: "vs previous period" },
];

// Orders Over Time
const ORDERS_TIME = [
  { label: "Jul 1",  total: 42, new: 28, returning: 14  },
  { label: "Jul 5",  total: 58, new: 38, returning: 20  },
  { label: "Jul 8",  total: 68, new: 44, returning: 24  },
  { label: "Jul 12", total: 84, new: 52, returning: 32  },
  { label: "Jul 15", total: 72, new: 46, returning: 26  },
  { label: "Jul 19", total: 92, new: 60, returning: 32  },
  { label: "Jul 22", total: 114, new: 72, returning: 42 },
  { label: "Jul 26", total: 126, new: 80, returning: 46 },
  { label: "Jul 31", total: 142, new: 88, returning: 54 },
];

// Order Status Breakdown
const ORDER_STATUS = [
  { status: "Delivered",  pct: 89.6, count: 4320, color: T.positive },
  { status: "Shipped",    pct:  4.8, count:  232,  color: T.info    },
  { status: "Processing", pct:  3.7, count:  178,  color: T.warning  },
  { status: "Cancelled",  pct:  1.9, count:   91,  color: T.negative },
];

// Orders by Day of Week
const DOW_DATA = [
  { day: "Mon", orders: 480  },
  { day: "Tue", orders: 612  },
  { day: "Wed", orders: 580  },
  { day: "Thu", orders: 648  },
  { day: "Fri", orders: 824  },
  { day: "Sat", orders: 1042 },
  { day: "Sun", orders: 635  },
];

// Orders by City
const ORDERS_CITY = [
  { city: "Mumbai",    orders: 1842, revenue: "₹1,24,820", aov: "₹677", pct: "38.2%" },
  { city: "Pune",      orders: 1124, revenue: "₹84,210",   aov: "₹749", pct: "23.3%" },
  { city: "Bangalore", orders: 820,  revenue: "₹62,440",   aov: "₹761", pct: "17.0%" },
  { city: "Delhi",     orders: 614,  revenue: "₹48,320",   aov: "₹787", pct: "12.7%" },
  { city: "Chennai",   orders: 421,  revenue: "₹32,180",   aov: "₹764", pct: "8.7%"  },
];

// Products KPIs
const PRODUCTS_KPIS = [
  { label: "Total Products",      value: "248",               sub: "active listings",     icon: "🌿" },
  { label: "Best-Selling",        value: "Monstera M",        sub: "₹98,402 this period", icon: "🏆" },
  { label: "Lowest Stock",        value: "Snake Plant",       sub: "3 units remaining",    icon: "⚠️" },
  { label: "Zero-Sales (30d)",    value: "12",                sub: "products need attention",icon: "📉" },
];

// Zero Sales Products
const ZERO_SALES = [
  { name: "Large Terracotta Pot 20cm",  lastSold: "45 days ago", stock: 124 },
  { name: "Moss Pole 90cm",             lastSold: "38 days ago", stock: 68  },
  { name: "Plant Mister Bottle",        lastSold: "32 days ago", stock: 200 },
  { name: "Hanging Basket 30cm",        lastSold: "41 days ago", stock: 84  },
];

// Inventory Risk
const INVENTORY_RISK = [
  { product: "Monstera M",     stock: 234, dailySell: 8.3,  days: 28, status: "OK"           },
  { product: "Peace Lily S",   stock:  89, dailySell: 9.7,  days: 9,  status: "Reorder soon" },
  { product: "Snake Plant",    stock:   3, dailySell: 6.8,  days: 0,  status: "URGENT"       },
  { product: "Pothos Vine",    stock:  42, dailySell: 4.2,  days: 10, status: "Reorder soon" },
  { product: "ZZ Plant M",     stock:   7, dailySell: 3.4,  days: 2,  status: "URGENT"       },
];

// Product categories
const PRODUCT_CATS = [
  { name: "Indoor Plants",  revenue: "₹2,26,280", units: 2840, aov: "₹797", color: T.chart1, pct: 47 },
  { name: "Outdoor Plants", revenue: "₹1,10,938", units: 1390, aov: "₹799", color: T.chart2, pct: 23 },
  { name: "Seeds",          revenue: "₹72,351",   units: 2420, aov: "₹299", color: T.chart3, pct: 15 },
  { name: "Succulents",     revenue: "₹48,234",   units: 642,  aov: "₹751", color: T.chart4, pct: 10 },
  { name: "Other",          revenue: "₹24,117",   units: 912,  aov: "₹265", color: T.chart5, pct: 5  },
];

// Customer KPIs
const CUSTOMER_KPIS = [
  { id: "total_cust",   label: "Total Customers",      value: "12,481", delta: "+8.4%",  positive: true,  ctx: "vs previous period" },
  { id: "new_cust",     label: "New This Period",       value: "342",    delta: "+12.1%", positive: true,  ctx: "vs previous period" },
  { id: "repeat_rate",  label: "Repeat Purchase Rate",  value: "38.4%",  delta: "+2.8%",  positive: true,  ctx: "vs previous period" },
  { id: "avg_ltv",      label: "Avg LTV",               value: "₹14,820",delta: "+5.2%",  positive: true,  ctx: "vs previous period" },
  { id: "at_risk",      label: "At-Risk (90d)",         value: "1,204",  delta: "+84",    positive: false, ctx: "no order in 90 days" },
];

// New vs Returning
const NEW_VS_RETURNING = [
  { label: "Jan", new: 124, returning: 188 },
  { label: "Feb", new: 108, returning: 210 },
  { label: "Mar", new: 148, returning: 224 },
  { label: "Apr", new: 132, returning: 248 },
  { label: "May", new: 172, returning: 264 },
  { label: "Jun", new: 198, returning: 290 },
];

// Acquisition Channels
const ACQ_CHANNELS = [
  { name: "Direct",         pct: 42, color: T.chart1 },
  { name: "Google Organic", pct: 24, color: T.chart2 },
  { name: "Instagram",      pct: 18, color: T.chart3 },
  { name: "Referral",       pct: 10, color: T.chart4 },
  { name: "Google Ads",     pct:  6, color: T.chart5 },
];

// LTV Distribution
const LTV_HIST = [
  { bracket: "₹0–2K",    count: 4820 },
  { bracket: "₹2K–5K",   count: 3240 },
  { bracket: "₹5K–10K",  count: 2180 },
  { bracket: "₹10K–20K", count: 1420 },
  { bracket: "₹20K+",    count: 821  },
];

// Loyalty Tiers
const LOYALTY_TIERS = [
  { tier: "🌿 Plant Lover", count: 10436, pct: 83.6, color: T.chart1 },
  { tier: "🥈 Silver",      count: 1240,  pct: 9.9,  color: T.textLabel },
  { tier: "🥇 Gold",        count: 521,   pct: 4.2,  color: T.chart3   },
  { tier: "Unregistered",   count: 284,   pct: 2.3,  color: T.textMuted },
];

// Retention Cohort
const RETENTION_COHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const RETENTION_COHORT = [
  { month: "Jan", values: [100, 42, 31, 25, 20, 16] },
  { month: "Feb", values: [null, 100, 38, 28, 22, 18] },
  { month: "Mar", values: [null, null, 100, 44, 33, 26] },
  { month: "Apr", values: [null, null, null, 100, 41, 31] },
  { month: "May", values: [null, null, null, null, 100, 38] },
  { month: "Jun", values: [null, null, null, null, null, 100] },
];

// At-Risk Customers
const AT_RISK_CUSTOMERS = [
  { name: "Rajesh Gupta",   email: "rajesh@email.com",   ltv: "₹48,240", lastOrder: "94 days ago",  tier: "Gold"   },
  { name: "Sunita Verma",   email: "sunita@email.com",   ltv: "₹38,180", lastOrder: "102 days ago", tier: "Silver" },
  { name: "Karthik Rao",    email: "karthik@email.com",  ltv: "₹32,400", lastOrder: "91 days ago",  tier: "Silver" },
  { name: "Meera Pillai",   email: "meera@email.com",    ltv: "₹28,200", lastOrder: "98 days ago",  tier: "Gold"   },
  { name: "Deepak Nair",    email: "deepak@email.com",   ltv: "₹22,840", lastOrder: "113 days ago", tier: "Plant Lover" },
];

// Marketing KPIs
const MARKETING_KPIS = [
  { label: "Discount Revenue Impact", value: "₹2,48,310", delta: "+14.2%", positive: true,  ctx: "Revenue generated via codes" },
  { label: "Discount Cost",           value: "₹38,420",   delta: "+4.2%",  positive: false, ctx: "Cost to business"            },
  { label: "Coupon Redemption Rate",  value: "18.4%",      delta: "+1.2%",  positive: true,  ctx: "vs previous period"          },
  { label: "Email Open Rate",         value: "28.4%",      delta: "+2.1%",  positive: true,  ctx: "Klaviyo (last campaign)"     },
  { label: "AI Care → Cart Rate",     value: "12.4%",      delta: "+2.1%",  positive: true,  ctx: "vs previous period"          },
];

// Campaign Performance
const CAMPAIGNS = [
  { name: "July Monstera Sale", sent: "12,481", opened: "3,541", openRate: "28%", clicked: "842", clickRate: "7%", revenue: "₹42,100" },
  { name: "Summer Plant Care",  sent: "11,200", opened: "2,920", openRate: "26%", clicked: "680", clickRate: "6%", revenue: "₹28,400" },
  { name: "New Arrivals Alert", sent: "9,840",  opened: "2,460", openRate: "25%", clicked: "524", clickRate: "5%", revenue: "₹18,200" },
];

// Traffic Funnel
const FUNNEL_DATA = [
  { stage: "Visitors",           value: 48210, pct: 100 },
  { stage: "Product Page Views", value: 18420, pct: 38  },
  { stage: "Added to Cart",      value: 4820,  pct: 10  },
  { stage: "Checkout Started",   value: 2810,  pct: 6   },
  { stage: "Orders Placed",      value: 4821,  pct: 10  },
];

// Garden Services KPIs
const GARDEN_KPIS = [
  { label: "Total Bookings",    value: "124",        delta: "+18%",   positive: true,  ctx: "vs previous period" },
  { label: "Revenue",           value: "₹2,48,000", delta: "+24.1%", positive: true,  ctx: "vs previous period" },
  { label: "Completed",         value: "89 (71.8%)", delta: "+4.2%",  positive: true,  ctx: "completion rate"    },
  { label: "Avg Booking Value", value: "₹2,000",    delta: "+2.4%",  positive: true,  ctx: "vs previous period" },
  { label: "Cancellation Rate", value: "8.1%",       delta: "+1.2%",  positive: false, ctx: "vs previous period" },
];

// Garden Bookings Over Time
const GARDEN_BOOKINGS_TIME = [
  { label: "Jul 1",  bookings: 4  },
  { label: "Jul 5",  bookings: 6  },
  { label: "Jul 8",  bookings: 8  },
  { label: "Jul 12", bookings: 10 },
  { label: "Jul 15", bookings: 7  },
  { label: "Jul 19", bookings: 12 },
  { label: "Jul 22", bookings: 14 },
  { label: "Jul 26", bookings: 11 },
  { label: "Jul 31", bookings: 16 },
];

// Garden by Service Type
const GARDEN_SERVICES_TYPE = [
  { name: "Balcony Garden Setup",  pct: 42, revenue: "₹1,04,160", color: T.chart4 },
  { name: "Lawn Maintenance",      pct: 28, revenue: "₹69,440",   color: T.chart2 },
  { name: "Plant Health Check",    pct: 18, revenue: "₹44,640",   color: T.chart1 },
  { name: "Terrace Garden",        pct: 12, revenue: "₹29,760",   color: T.chart3 },
];

// Gardener Performance
const GARDENER_PERF = [
  { name: "Ramesh Patil",  bookings: 18, revenue: "₹36,000", rating: "4.9", util: "92%" },
  { name: "Sunil Kumar",   bookings: 14, revenue: "₹28,000", rating: "4.7", util: "72%" },
  { name: "Anand Joshi",   bookings: 12, revenue: "₹24,000", rating: "4.8", util: "68%" },
  { name: "Vikram Singh",  bookings: 9,  revenue: "₹18,000", rating: "4.5", util: "58%" },
  { name: "Rajesh Iyer",   bookings: 11, revenue: "₹22,000", rating: "4.6", util: "62%" },
];

// Garden by City
const GARDEN_CITY = [
  { city: "Pune",      bookings: 48, revenue: "₹96,000",  pct: 100 },
  { city: "Mumbai",    bookings: 32, revenue: "₹64,000",  pct: 67  },
  { city: "Bangalore", bookings: 24, revenue: "₹48,000",  pct: 50  },
  { city: "Delhi",     bookings: 12, revenue: "₹24,000",  pct: 25  },
  { city: "Chennai",   bookings: 8,  revenue: "₹16,000",  pct: 17  },
];

// Auto-generated insights
const INSIGHTS = [
  { id: "ins-1", type: "positive", msg: "Revenue is up 18.4% vs last month — the highest monthly growth in 6 months. Monstera Deliciosa M drove 32% of the increase.", cta: null },
  { id: "ins-2", type: "warning",  msg: "Snake Plant has only 3 units in stock with 6.8 units/day velocity — less than 1 day of stock remaining.", cta: { label: "Manage Inventory →", href: "/admin/inventory" } },
  { id: "ins-3", type: "warning",  msg: "12 products have had zero sales in the last 30 days while carrying more than 50 units of stock. Consider running a targeted discount.", cta: { label: "Create Discount →", href: "/admin/discounts" } },
];

/* ═══════════════════════════════════════════════
   SHARED MICRO COMPONENTS
═══════════════════════════════════════════════ */

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 64; const h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} aria-hidden="true" style={{ flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KpiCard({ label, value, delta, positive, ctx, spark, abbr, compact = false }: {
  label: string; value: string; delta: string; positive: boolean; ctx: string;
  spark?: number[]; abbr?: string; compact?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const isNegativeDelta = delta.startsWith("−") || delta.startsWith("-");
  const isGood = positive;
  const deltaColor = isGood ? T.positive : T.negative;
  const deltaArrow = isGood ? "↑" : "↓";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? T.bgElevated : T.bgSurface,
        border: `1px solid ${T.borderMuted}`,
        borderRadius: T.radiusMd,
        padding: "20px",
        boxShadow: T.shadow,
        transition: "all 0.15s ease",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        minWidth: 0,
      }}
      aria-label={`${label}: ${value}. Change: ${deltaArrow} ${delta} ${ctx}.`}
    >
      <div style={{ fontSize: "11px", fontWeight: 500, color: T.textMuted, letterSpacing: "0.02em" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "8px" }}>
        <div>
          <div style={{ fontSize: compact ? "22px" : "28px", fontWeight: 800, color: T.text, lineHeight: 1.1, letterSpacing: "-0.5px" }}>
            {value}
          </div>
          <div style={{ marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: deltaColor }}>{deltaArrow} {delta}</span>
            <span style={{ fontSize: "10px", color: T.textMuted }}>{ctx}</span>
          </div>
        </div>
        {spark && <Sparkline data={spark} color={deltaColor} />}
      </div>
    </div>
  );
}

function SectionKpiCard({ label, value, delta, positive, ctx }: {
  label: string; value: string; delta?: string; positive?: boolean; ctx?: string;
}) {
  const isGood = positive !== false;
  const deltaColor = isGood ? T.positive : T.negative;
  return (
    <div style={{
      background: T.bgSurface,
      border: `1px solid ${T.borderMuted}`,
      borderRadius: T.radiusMd,
      padding: "16px 20px",
      boxShadow: T.shadow,
    }}>
      <div style={{ fontSize: "11px", fontWeight: 500, color: T.textMuted, marginBottom: "8px" }}>{label}</div>
      <div style={{ fontSize: "24px", fontWeight: 800, color: T.text, letterSpacing: "-0.4px", lineHeight: 1 }}>{value}</div>
      {delta && (
        <div style={{ marginTop: "6px", display: "flex", gap: "4px", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: deltaColor }}>
            {isGood ? "↑" : "↓"} {delta}
          </span>
          {ctx && <span style={{ fontSize: "10px", color: T.textMuted }}>{ctx}</span>}
        </div>
      )}
    </div>
  );
}

function ChartPanel({ title, children, toolbar }: {
  title: string; children: React.ReactNode; toolbar?: React.ReactNode;
}) {
  return (
    <div style={{
      background: T.bgSurface,
      border: `1px solid ${T.borderMuted}`,
      borderRadius: T.radiusMd,
      boxShadow: T.shadow,
      overflow: "hidden",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", borderBottom: `1px solid ${T.borderMuted}`,
      }}>
        <span style={{ fontSize: "14px", fontWeight: 600, color: T.text }}>{title}</span>
        {toolbar && <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>{toolbar}</div>}
      </div>
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}

function ChipBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 10px", fontSize: "11px", fontWeight: 600,
        borderRadius: "999px",
        background: active ? T.accentMuted : "transparent",
        color: active ? T.accent : T.textMuted,
        border: active ? `1px solid ${T.accent}` : `1px solid ${T.borderMuted}`,
        cursor: "pointer", transition: "all 0.15s",
      }}
    >{label}</button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    "OK":           { bg: "rgba(87,171,90,0.12)", color: T.positive },
    "Reorder soon": { bg: "rgba(198,144,38,0.12)", color: T.warning  },
    "URGENT":       { bg: "rgba(229,83,75,0.12)",  color: T.negative },
  };
  const s = map[status] || { bg: T.bgElevated, color: T.textMuted };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "2px 8px", borderRadius: "999px",
      background: s.bg, color: s.color, fontSize: "11px", fontWeight: 600,
    }}>
      {status === "URGENT" ? "⚠" : "●"} {status}
    </span>
  );
}

function InsightCard({ insight, onDismiss }: { insight: typeof INSIGHTS[0]; onDismiss: () => void }) {
  const isWarning = insight.type === "warning";
  return (
    <div
      role="region"
      aria-label="Insight"
      aria-live="polite"
      style={{
        background: isWarning ? "rgba(198,144,38,0.06)" : "rgba(87,171,90,0.06)",
        borderLeft: `4px solid ${isWarning ? T.warning : T.positive}`,
        borderRadius: T.radiusSm,
        padding: "12px 16px",
        display: "flex", alignItems: "flex-start", gap: "12px",
        fontSize: "12px", fontWeight: 600, color: T.text,
      }}
    >
      <span style={{ fontSize: "16px", lineHeight: 1 }}>{isWarning ? "⚠️" : "💡"}</span>
      <div style={{ flex: 1 }}>
        {insight.msg}
        {insight.cta && (
          <Link href={insight.cta.href} style={{
            marginLeft: "8px", color: T.accent, fontWeight: 700, textDecoration: "none",
          }}>{insight.cta.label}</Link>
        )}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss this insight"
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: T.textMuted, fontSize: "14px", lineHeight: 1, flexShrink: 0,
        }}
      >×</button>
    </div>
  );
}

const CustomTooltipStyle: React.CSSProperties = {
  background: T.bgOverlay,
  border: `1px solid ${T.border}`,
  borderRadius: T.radiusSm,
  padding: "8px 12px",
  color: T.text,
  fontSize: "12px",
  boxShadow: T.shadowLg,
};

function ChartTooltip({ active, payload, label }: {active?: boolean; payload?: {name: string; value: number; color: string}[]; label?: string}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={CustomTooltipStyle}>
      <div style={{ fontSize: "11px", color: T.textMuted, marginBottom: "6px" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "1px 0" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          <span style={{ color: T.textMuted, fontSize: "11px" }}>{p.name}:</span>
          <span style={{ fontWeight: 700 }}>{typeof p.value === "number" && p.value > 1000 ? `₹${p.value.toLocaleString("en-IN")}` : p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION COMPONENTS
═══════════════════════════════════════════════ */

function OverviewSection() {
  const [granularity, setGranularity] = useState<Granularity>("daily");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* KPI Grid */}
      <section aria-label="Overview metrics">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {OVERVIEW_KPIS.map(k => (
            <KpiCard key={k.id} {...k} />
          ))}
        </div>
      </section>

      {/* Revenue Over Time */}
      <ChartPanel
        title="Revenue Over Time"
        toolbar={
          <>
            {(["daily", "weekly", "monthly"] as Granularity[]).map(g => (
              <ChipBtn key={g} label={g.charAt(0).toUpperCase() + g.slice(1)} active={granularity === g} onClick={() => setGranularity(g)} />
            ))}
          </>
        }
      >
        <div role="img" aria-label="Revenue Over Time chart. Revenue grew from ₹12,420 on July 1 to ₹54,820 on July 31, an increase of 51.7%.">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={REVENUE_TIME_DAILY}>
              <CartesianGrid stroke={T.chartGrid} strokeDasharray="4 4" />
              <XAxis dataKey="label" tick={{ fill: T.textLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="rev" tick={{ fill: T.textLabel, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <YAxis yAxisId="orders" orientation="right" tick={{ fill: T.textLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px", color: T.textLabel, paddingTop: "12px" }} />
              <Line yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue" stroke={T.chart1} strokeWidth={2} dot={false} />
              <Line yAxisId="orders" type="monotone" dataKey="orders" name="Orders" stroke={T.chart2} strokeWidth={2} dot={false} />
              <Line yAxisId="rev" type="monotone" dataKey="prevRevenue" name="Prev Period" stroke={T.border} strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Sales by Category */}
        <ChartPanel title="Sales by Category">
          <div role="img" aria-label="Sales by Category. Indoor Plants 47%, Outdoor 23%, Seeds 15%, Succulents 10%, Other 5%">
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={SALES_CATEGORIES} dataKey="value" innerRadius={60} outerRadius={90} strokeWidth={2} stroke={T.bgSurface}>
                    {SALES_CATEGORIES.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, ""]} contentStyle={CustomTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                {SALES_CATEGORIES.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "12px", color: T.text, flex: 1 }}>{c.name}</span>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: T.textLabel }}>{c.pct}%</span>
                    <span style={{ fontSize: "11px", color: T.textMuted }}>{c.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartPanel>

        {/* Top Products */}
        <ChartPanel title="Top Products" toolbar={<Link href="/admin/products" style={{ fontSize: "11px", color: T.accent, textDecoration: "none", fontWeight: 600 }}>View All →</Link>}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr>
                {["#", "PRODUCT", "REVENUE", "UNITS"].map(h => (
                  <th key={h} style={{ textAlign: h === "#" || h === "UNITS" ? "center" : "left", color: T.textLabel, fontSize: "11px", fontWeight: 700, padding: "0 8px 8px", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_PRODUCTS.map((p, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${T.borderMuted}` }}>
                  <td style={{ textAlign: "center", padding: "10px 8px", color: T.textMuted, fontWeight: 700 }}>{p.rank}</td>
                  <td style={{ padding: "10px 8px", color: T.text }}>
                    {p.name}
                    {p.lowStock && <span style={{ marginLeft: "6px", color: T.warning, fontSize: "10px" }}>⚠ Low</span>}
                  </td>
                  <td style={{ padding: "10px 8px", color: T.positive, fontWeight: 600 }}>{p.revenue}</td>
                  <td style={{ textAlign: "center", padding: "10px 8px", color: T.textLabel }}>{p.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartPanel>
      </div>

      {/* Geographic Revenue */}
      <ChartPanel title="Revenue by City (Top 10)">
        <div role="img" aria-label="Revenue by City. Mumbai leads with ₹1,24,820.">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {GEO_REVENUE.map((g, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "12px", color: T.textLabel, width: "80px", flexShrink: 0 }}>{g.city}</span>
                <div style={{ flex: 1, background: T.bgElevated, borderRadius: "999px", height: "8px", overflow: "hidden" }}>
                  <div style={{ width: `${g.pct}%`, height: "100%", background: T.chart1, borderRadius: "999px", transition: "width 0.6s ease" }} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: 600, color: T.text, width: "80px", textAlign: "right", flexShrink: 0 }}>
                  ₹{(g.revenue/1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
        </div>
      </ChartPanel>
    </div>
  );
}

function RevenueSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {REVENUE_KPIS.map(k => (
          <SectionKpiCard key={k.id} {...k} />
        ))}
      </div>

      {/* Gross vs Net Chart */}
      <ChartPanel title="Gross vs Net Revenue">
        <div role="img" aria-label="Gross vs Net Revenue comparison over the last 6 months.">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={GROSS_NET_DATA}>
              <CartesianGrid stroke={T.chartGrid} strokeDasharray="4 4" />
              <XAxis dataKey="label" tick={{ fill: T.textLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textLabel, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px", color: T.textLabel, paddingTop: "12px" }} />
              <Area type="monotone" dataKey="gross" name="Gross Revenue" fill={`${T.chart1}20`} stroke={T.chart1} strokeWidth={2} />
              <Area type="monotone" dataKey="net" name="Net Revenue" fill={`${T.chart2}15`} stroke={T.chart2} strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Revenue Sources */}
        <ChartPanel title="Revenue Sources">
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={REVENUE_SOURCES} dataKey="pct" innerRadius={50} outerRadius={75} strokeWidth={2} stroke={T.bgSurface}>
                  {REVENUE_SOURCES.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              {REVENUE_SOURCES.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "11px", color: T.text, flex: 1 }}>{s.name}</span>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: T.textLabel }}>{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartPanel>

        {/* Payment Methods */}
        <ChartPanel title="Payment Method Breakdown">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "4px" }}>
            {PAYMENT_METHODS.map((p, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: T.text }}>{p.method}</span>
                  <span style={{ fontSize: "11px", color: T.textLabel, fontWeight: 600 }}>{p.pct}% · {p.revenue}</span>
                </div>
                <div style={{ background: T.bgElevated, borderRadius: "999px", height: "6px" }}>
                  <div style={{ width: `${p.pct}%`, height: "100%", background: p.color, borderRadius: "999px" }} />
                </div>
              </div>
            ))}
          </div>
        </ChartPanel>
      </div>

      {/* Discount Cost Analysis */}
      <ChartPanel title="Discount Usage & Cost" toolbar={<Link href="/admin/discounts" style={{ fontSize: "11px", color: T.accent, textDecoration: "none", fontWeight: 600 }}>View All Discounts →</Link>}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr>
              {["DISCOUNT CODE", "USES", "COST", "REVENUE GENERATED", "ROI"].map(h => (
                <th key={h} style={{ textAlign: "left", color: T.textLabel, fontSize: "11px", fontWeight: 700, padding: "0 12px 10px", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DISCOUNT_TABLE.map((d, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${T.borderMuted}` }}>
                <td style={{ padding: "10px 12px", fontWeight: 600, color: T.text, fontFamily: "monospace" }}>{d.code}</td>
                <td style={{ padding: "10px 12px", color: T.textLabel }}>{d.uses.toLocaleString("en-IN")}</td>
                <td style={{ padding: "10px 12px", color: T.negative, fontWeight: 600 }}>{d.cost}</td>
                <td style={{ padding: "10px 12px", color: T.positive, fontWeight: 600 }}>{d.revenue}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ background: "rgba(87,171,90,0.12)", color: T.positive, fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px" }}>{d.roi}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ChartPanel>

      {/* Revenue Cohort Table */}
      <ChartPanel title="Monthly Revenue Cohort">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "8px 12px", color: T.textLabel, fontWeight: 700, fontSize: "11px", letterSpacing: "0.05em" }}>MONTH</th>
                {COHORT_MONTHS.map(m => (
                  <th key={m} style={{ textAlign: "center", padding: "8px 12px", color: T.textLabel, fontWeight: 700, fontSize: "11px", letterSpacing: "0.05em" }}>{m.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REVENUE_COHORT.map((row, ri) => (
                <tr key={ri}>
                  <td style={{ padding: "8px 12px", fontWeight: 700, color: T.text, fontSize: "11px" }}>{row.month}</td>
                  {row.values.map((v, ci) => {
                    if (v === null) return <td key={ci} />;
                    const maxVal = 420; const intensity = v / maxVal;
                    return (
                      <td key={ci} style={{
                        padding: "8px 12px", textAlign: "center", fontSize: "11px",
                        fontWeight: ci === 0 ? 700 : 500,
                        background: `rgba(0,181,102,${intensity * 0.4})`,
                        color: intensity > 0.6 ? "#fff" : T.text,
                      }}>₹{v}K</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px", fontSize: "10px", color: T.textMuted }}>
          <span>Colour scale:</span>
          <div style={{ display: "flex", gap: "4px" }}>
            {[0.1, 0.25, 0.4, 0.55, 0.7, 0.9].map((o, i) => (
              <div key={i} style={{ width: "20px", height: "12px", background: `rgba(0,181,102,${o * 0.4})`, borderRadius: "2px" }} />
            ))}
          </div>
          <span>Low → High revenue</span>
        </div>
      </ChartPanel>
    </div>
  );
}

function OrdersSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
        {ORDERS_KPIS.map(k => (
          <SectionKpiCard key={k.id} {...k} />
        ))}
      </div>

      {/* Orders Over Time */}
      <ChartPanel title="Orders Over Time">
        <div role="img" aria-label="Orders over time showing new and returning customer orders.">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ORDERS_TIME}>
              <CartesianGrid stroke={T.chartGrid} strokeDasharray="4 4" />
              <XAxis dataKey="label" tick={{ fill: T.textLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px", color: T.textLabel, paddingTop: "12px" }} />
              <Bar dataKey="returning" name="Returning" stackId="a" fill={T.chart1} radius={[0,0,0,0]} />
              <Bar dataKey="new" name="New Customers" stackId="a" fill={T.chart2} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Order Status */}
        <ChartPanel title="Order Status Distribution">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {ORDER_STATUS.map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: T.text }}>{s.status}</span>
                  <span style={{ fontSize: "11px", color: T.textLabel }}>
                    {s.pct}% · {s.count.toLocaleString("en-IN")} orders
                  </span>
                </div>
                <div style={{ background: T.bgElevated, borderRadius: "999px", height: "7px" }}>
                  <div style={{ width: `${s.pct}%`, height: "100%", background: s.color, borderRadius: "999px", transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </ChartPanel>

        {/* Orders by Day of Week */}
        <ChartPanel title="Orders by Day of Week">
          <div role="img" aria-label="Orders by day. Saturday is peak with 1,042 orders.">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={DOW_DATA} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid stroke={T.chartGrid} strokeDasharray="4 4" />
                <XAxis dataKey="day" tick={{ fill: T.textLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.textLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="orders" name="Orders" fill={T.chart4} radius={[4,4,0,0]}>
                  {DOW_DATA.map((_, i) => (
                    <Cell key={i} fill={DOW_DATA[i].orders === Math.max(...DOW_DATA.map(d => d.orders)) ? T.chart1 : T.chart4} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      {/* Orders by City */}
      <ChartPanel title="Orders by City">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr>
              {["CITY", "ORDERS", "REVENUE", "AOV", "% OF TOTAL"].map(h => (
                <th key={h} style={{ textAlign: "left", color: T.textLabel, fontSize: "11px", fontWeight: 700, padding: "0 12px 10px", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ORDERS_CITY.map((c, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${T.borderMuted}` }}>
                <td style={{ padding: "10px 12px", fontWeight: 600, color: T.text }}>{c.city}</td>
                <td style={{ padding: "10px 12px", color: T.textLabel }}>{c.orders.toLocaleString("en-IN")}</td>
                <td style={{ padding: "10px 12px", color: T.positive, fontWeight: 600 }}>{c.revenue}</td>
                <td style={{ padding: "10px 12px", color: T.textLabel }}>{c.aov}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ fontSize: "11px", color: T.accent, fontWeight: 600 }}>{c.pct}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ChartPanel>

      {/* Fulfilment Panel */}
      <ChartPanel title="Fulfilment Performance">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {[
            { label: "Avg Fulfilment Time", value: "1.2 days", color: T.positive },
            { label: "Avg Delivery Time",   value: "3.4 days", color: T.text },
            { label: "On-Time Rate",        value: "91.2%",    color: T.positive },
            { label: "Late Deliveries",     value: "8.8%",     color: T.warning },
          ].map((f, i) => (
            <div key={i} style={{ background: T.bgElevated, borderRadius: T.radiusSm, padding: "16px" }}>
              <div style={{ fontSize: "11px", color: T.textMuted, marginBottom: "8px" }}>{f.label}</div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: f.color }}>{f.value}</div>
            </div>
          ))}
        </div>
      </ChartPanel>
    </div>
  );
}

function ProductsSection() {
  const [loadMore, setLoadMore] = useState(false);
  const displayedProducts = loadMore ? TOP_PRODUCTS : TOP_PRODUCTS.slice(0, 3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {PRODUCTS_KPIS.map((k, i) => (
          <div key={i} style={{ background: T.bgSurface, border: `1px solid ${T.borderMuted}`, borderRadius: T.radiusMd, padding: "20px", boxShadow: T.shadow }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>{k.icon}</div>
            <div style={{ fontSize: "11px", fontWeight: 500, color: T.textMuted, marginBottom: "6px" }}>{k.label}</div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: T.text, lineHeight: 1.2 }}>{k.value}</div>
            <div style={{ fontSize: "10px", color: T.textMuted, marginTop: "4px" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Top Products Table */}
      <ChartPanel title="Top Products by Revenue" toolbar={<Link href="/admin/products" style={{ fontSize: "11px", color: T.accent, textDecoration: "none", fontWeight: 600 }}>View All Products →</Link>}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr>
              {["#", "PRODUCT", "REVENUE", "UNITS", "AOV", "STOCK"].map(h => (
                <th key={h} style={{ textAlign: h === "#" || h === "UNITS" || h === "STOCK" ? "center" : "left", color: T.textLabel, fontSize: "11px", fontWeight: 700, padding: "0 12px 10px", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedProducts.map((p, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${T.borderMuted}`, cursor: "pointer" }}>
                <td style={{ textAlign: "center", padding: "10px 12px", color: T.textMuted, fontWeight: 700 }}>{p.rank}</td>
                <td style={{ padding: "10px 12px", color: T.text, fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: "10px 12px", color: T.positive, fontWeight: 600 }}>{p.revenue}</td>
                <td style={{ textAlign: "center", padding: "10px 12px", color: T.textLabel }}>{p.units}</td>
                <td style={{ padding: "10px 12px", color: T.textLabel }}>{p.aov}</td>
                <td style={{ textAlign: "center", padding: "10px 12px" }}>
                  <span style={{ color: p.lowStock ? T.warning : T.textLabel, fontWeight: p.lowStock ? 700 : 400 }}>
                    {p.stock} {p.lowStock && "⚠"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loadMore && (
          <div style={{ textAlign: "center", paddingTop: "12px" }}>
            <button onClick={() => setLoadMore(true)} style={{ fontSize: "12px", color: T.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Load more ↓</button>
          </div>
        )}
      </ChartPanel>

      {/* Zero Sales Warning Panel */}
      <div style={{
        background: T.bgSurface,
        border: `1px solid ${T.borderMuted}`,
        borderLeft: `4px solid ${T.warning}`,
        borderRadius: T.radiusMd,
        overflow: "hidden",
        boxShadow: T.shadow,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${T.borderMuted}` }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: T.text }}>
            ⚠ Zero-Sales Products ({ZERO_SALES.length}) — Needs attention
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link href="/admin/discounts" style={{ fontSize: "11px", color: T.warning, fontWeight: 600, textDecoration: "none", padding: "4px 10px", border: `1px solid ${T.warning}`, borderRadius: "999px" }}>
              Create Discount for These →
            </Link>
          </div>
        </div>
        <div style={{ padding: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr>
                {["PRODUCT", "LAST SOLD", "STOCK"].map(h => (
                  <th key={h} style={{ textAlign: "left", color: T.textLabel, fontSize: "11px", fontWeight: 700, padding: "0 12px 8px", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ZERO_SALES.map((z, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${T.borderMuted}` }}
                  aria-label={`${z.name}: zero sales in 30 days. ${z.stock} units in stock.`}>
                  <td style={{ padding: "10px 12px", color: T.text }}>{z.name}</td>
                  <td style={{ padding: "10px 12px", color: T.warning }}>{z.lastSold}</td>
                  <td style={{ padding: "10px 12px", color: T.textLabel }}>{z.stock} units</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Performance */}
      <ChartPanel title="Product Category Performance">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "center" }}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={PRODUCT_CATS} dataKey="pct" innerRadius={65} outerRadius={95} strokeWidth={2} stroke={T.bgSurface}>
                {PRODUCT_CATS.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Pie>
              <Tooltip contentStyle={CustomTooltipStyle} formatter={(v: number) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr>
                {["CATEGORY", "REVENUE", "UNITS", "AOV"].map(h => (
                  <th key={h} style={{ textAlign: "left", color: T.textLabel, fontSize: "10px", fontWeight: 700, padding: "0 8px 6px", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRODUCT_CATS.map((c, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${T.borderMuted}` }}>
                  <td style={{ padding: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "11px", color: T.text }}>{c.name}</span>
                  </td>
                  <td style={{ padding: "8px", color: T.positive, fontSize: "11px", fontWeight: 600 }}>{c.revenue}</td>
                  <td style={{ padding: "8px", color: T.textLabel, fontSize: "11px" }}>{c.units.toLocaleString("en-IN")}</td>
                  <td style={{ padding: "8px", color: T.textLabel, fontSize: "11px" }}>{c.aov}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartPanel>

      {/* Inventory Risk */}
      <ChartPanel title="Inventory Risk">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr>
              {["PRODUCT", "STOCK", "DAILY SELL", "DAYS REMAINING", "STATUS"].map(h => (
                <th key={h} style={{ textAlign: "left", color: T.textLabel, fontSize: "11px", fontWeight: 700, padding: "0 12px 10px", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVENTORY_RISK.map((r, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${T.borderMuted}` }}
                aria-label={`${r.product}: ${r.days} days of stock remaining. ${r.status}.`}>
                <td style={{ padding: "10px 12px", color: T.text, fontWeight: 500 }}>{r.product}</td>
                <td style={{ padding: "10px 12px", color: T.textLabel }}>{r.stock}</td>
                <td style={{ padding: "10px 12px", color: T.textLabel }}>{r.dailySell}/day</td>
                <td style={{ padding: "10px 12px", color: r.days < 2 ? T.negative : r.days < 10 ? T.warning : T.positive, fontWeight: 600 }}>
                  {r.days < 1 ? "<1 day" : `${r.days} days`}
                </td>
                <td style={{ padding: "10px 12px" }}><StatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </ChartPanel>
    </div>
  );
}

function CustomersSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
        {CUSTOMER_KPIS.map(k => (
          <SectionKpiCard key={k.id} {...k} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* New vs Returning */}
        <ChartPanel title="New vs Returning Customers">
          <div role="img" aria-label="New vs Returning customers stacked bar chart.">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={NEW_VS_RETURNING}>
                <CartesianGrid stroke={T.chartGrid} strokeDasharray="4 4" />
                <XAxis dataKey="label" tick={{ fill: T.textLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.textLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", color: T.textLabel, paddingTop: "12px" }} />
                <Bar dataKey="returning" name="Returning" stackId="a" fill={T.chart1} />
                <Bar dataKey="new" name="New" stackId="a" fill={T.chart2} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        {/* Acquisition Channels */}
        <ChartPanel title="Customer Acquisition Channels">
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <ResponsiveContainer width={160} height={180}>
              <PieChart>
                <Pie data={ACQ_CHANNELS} dataKey="pct" innerRadius={50} outerRadius={75} strokeWidth={2} stroke={T.bgSurface}>
                  {ACQ_CHANNELS.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              {ACQ_CHANNELS.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "11px", color: T.text, flex: 1 }}>{c.name}</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: T.textLabel }}>{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartPanel>
      </div>

      {/* LTV Distribution */}
      <ChartPanel title="Customer Lifetime Value Distribution">
        <div role="img" aria-label="LTV distribution histogram showing customer count by LTV bracket.">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={LTV_HIST}>
              <CartesianGrid stroke={T.chartGrid} strokeDasharray="4 4" />
              <XAxis dataKey="bracket" tick={{ fill: T.textLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" name="Customers" fill={T.chart2} radius={[4,4,0,0]}>
                {LTV_HIST.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? T.chart2 : i === 1 ? T.chart1 : T.chart4} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Loyalty Tiers */}
        <ChartPanel title="Loyalty Tier Distribution">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {LOYALTY_TIERS.map((t, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: T.text }}>{t.tier}</span>
                  <span style={{ fontSize: "11px", color: T.textLabel }}>{t.count.toLocaleString("en-IN")} · {t.pct}%</span>
                </div>
                <div style={{ background: T.bgElevated, borderRadius: "999px", height: "6px" }}>
                  <div style={{ width: `${t.pct}%`, height: "100%", background: t.color, borderRadius: "999px" }} />
                </div>
              </div>
            ))}
          </div>
        </ChartPanel>

        {/* Retention Cohort */}
        <ChartPanel title="Customer Retention Cohort">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "4px 8px", color: T.textLabel, fontWeight: 700, fontSize: "10px" }}>MONTH</th>
                  {RETENTION_COHORT_MONTHS.map(m => (
                    <th key={m} style={{ textAlign: "center", padding: "4px 8px", color: T.textLabel, fontWeight: 700, fontSize: "10px" }}>{m.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RETENTION_COHORT.map((row, ri) => (
                  <tr key={ri}>
                    <td style={{ padding: "6px 8px", fontWeight: 700, color: T.text, fontSize: "11px" }}>{row.month}</td>
                    {row.values.map((v, ci) => {
                      if (v === null) return <td key={ci} />;
                      const intensity = v / 100;
                      return (
                        <td key={ci} style={{
                          padding: "6px 8px", textAlign: "center", fontSize: "10px",
                          fontWeight: ci === 0 ? 700 : 500,
                          background: `rgba(0,181,102,${intensity * 0.4})`,
                          color: intensity > 0.6 ? "#fff" : T.text,
                        }}>{v}%</td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartPanel>
      </div>

      {/* At-Risk Customers */}
      <div style={{
        background: T.bgSurface,
        border: `1px solid ${T.borderMuted}`,
        borderLeft: `4px solid ${T.negative}`,
        borderRadius: T.radiusMd,
        overflow: "hidden",
        boxShadow: T.shadow,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${T.borderMuted}` }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: T.text }}>
            ⚠ At-Risk Customers (1,204) — No order in 90 days
          </span>
          <button style={{
            fontSize: "11px", color: "white", background: T.negative, border: "none",
            borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontWeight: 600,
          }}>Email All</button>
        </div>
        <div style={{ padding: "20px" }}>
          <div style={{ fontSize: "11px", color: T.textMuted, marginBottom: "12px" }}>
            Showing top 5 by LTV — highest-value customers surfaced first for win-back priority.
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr>
                {["CUSTOMER", "EMAIL", "LTV", "LAST ORDER", "TIER"].map(h => (
                  <th key={h} style={{ textAlign: "left", color: T.textLabel, fontSize: "11px", fontWeight: 700, padding: "0 12px 8px", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AT_RISK_CUSTOMERS.map((c, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${T.borderMuted}` }}>
                  <td style={{ padding: "10px 12px", color: T.text, fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: "10px 12px", color: T.textMuted }}>{c.email}</td>
                  <td style={{ padding: "10px 12px", color: T.positive, fontWeight: 600 }}>{c.ltv}</td>
                  <td style={{ padding: "10px 12px", color: T.negative }}>{c.lastOrder}</td>
                  <td style={{ padding: "10px 12px", color: T.textLabel }}>{c.tier}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ paddingTop: "12px", textAlign: "center" }}>
            <Link href="/admin/customers" style={{ fontSize: "12px", color: T.accent, fontWeight: 600, textDecoration: "none" }}>
              View all at-risk customers →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketingSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
        {MARKETING_KPIS.map((k, i) => (
          <SectionKpiCard key={i} label={k.label} value={k.value} delta={k.delta} positive={k.positive} ctx={k.ctx} />
        ))}
      </div>

      {/* Discount Performance Table */}
      <ChartPanel title="Discount Performance" toolbar={<Link href="/admin/discounts" style={{ fontSize: "11px", color: T.accent, textDecoration: "none", fontWeight: 600 }}>All Discounts →</Link>}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr>
              {["CODE", "USES", "COST", "REVENUE GENERATED", "ROI"].map(h => (
                <th key={h} style={{ textAlign: "left", color: T.textLabel, fontSize: "11px", fontWeight: 700, padding: "0 12px 10px", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DISCOUNT_TABLE.map((d, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${T.borderMuted}` }}>
                <td style={{ padding: "10px 12px", fontWeight: 600, color: T.text, fontFamily: "JetBrains Mono, monospace", fontSize: "11px" }}>{d.code}</td>
                <td style={{ padding: "10px 12px", color: T.textLabel }}>{d.uses.toLocaleString("en-IN")}</td>
                <td style={{ padding: "10px 12px", color: T.negative, fontWeight: 600 }}>{d.cost}</td>
                <td style={{ padding: "10px 12px", color: T.positive, fontWeight: 600 }}>{d.revenue}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ background: "rgba(87,171,90,0.12)", color: T.positive, fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px" }}>{d.roi}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ChartPanel>

      {/* Campaign Performance */}
      <ChartPanel title="Email Campaigns" toolbar={<span style={{ fontSize: "10px", color: T.textMuted, padding: "2px 8px", border: `1px solid ${T.info}`, borderRadius: "999px", color: T.info }}>Klaviyo Connected</span>}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr>
              {["CAMPAIGN", "SENT", "OPENED", "CLICKED", "REVENUE"].map(h => (
                <th key={h} style={{ textAlign: "left", color: T.textLabel, fontSize: "11px", fontWeight: 700, padding: "0 12px 10px", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAMPAIGNS.map((c, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${T.borderMuted}` }}>
                <td style={{ padding: "10px 12px", color: T.text, fontWeight: 500 }}>{c.name}</td>
                <td style={{ padding: "10px 12px", color: T.textLabel }}>{c.sent}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ color: T.text }}>{c.opened}</span>
                  <span style={{ color: T.textMuted, fontSize: "11px", marginLeft: "4px" }}>({c.openRate})</span>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ color: T.text }}>{c.clicked}</span>
                  <span style={{ color: T.textMuted, fontSize: "11px", marginLeft: "4px" }}>({c.clickRate})</span>
                </td>
                <td style={{ padding: "10px 12px", color: T.positive, fontWeight: 600 }}>{c.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ChartPanel>

      {/* Traffic → Revenue Funnel */}
      <ChartPanel title="Traffic to Revenue Funnel">
        <div role="img" aria-label="Conversion funnel from visitors to orders placed.">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {FUNNEL_DATA.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "12px", color: T.textLabel, width: "140px", flexShrink: 0 }}>{f.stage}</span>
                <div style={{ flex: 1, background: T.bgElevated, borderRadius: "999px", height: "28px", display: "flex", alignItems: "center" }}>
                  <div style={{
                    width: `${f.pct}%`, height: "100%",
                    background: i === 0 ? T.chart2 : i === 4 ? T.chart1 : `rgba(0,181,102,${0.3 + i * 0.1})`,
                    borderRadius: "999px",
                    display: "flex", alignItems: "center", paddingLeft: "12px",
                    minWidth: "60px",
                  }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "white", whiteSpace: "nowrap" }}>
                      {f.value.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 600, color: T.textLabel, width: "32px", textAlign: "right", flexShrink: 0 }}>{f.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </ChartPanel>
    </div>
  );
}

function GardenSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
        {GARDEN_KPIS.map((k, i) => (
          <SectionKpiCard key={i} label={k.label} value={k.value} delta={k.delta} positive={k.positive} ctx={k.ctx} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Bookings Over Time */}
        <ChartPanel title="Bookings Over Time">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={GARDEN_BOOKINGS_TIME}>
              <CartesianGrid stroke={T.chartGrid} strokeDasharray="4 4" />
              <XAxis dataKey="label" tick={{ fill: T.textLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="bookings" name="Bookings" fill={T.chart4} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        {/* Revenue by Service Type */}
        <ChartPanel title="Revenue by Service Type">
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <ResponsiveContainer width={160} height={180}>
              <PieChart>
                <Pie data={GARDEN_SERVICES_TYPE} dataKey="pct" innerRadius={50} outerRadius={75} strokeWidth={2} stroke={T.bgSurface}>
                  {GARDEN_SERVICES_TYPE.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              {GARDEN_SERVICES_TYPE.map((s, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "11px", color: T.text }}>{s.name}</span>
                  </div>
                  <div style={{ paddingLeft: "14px", fontSize: "10px", color: T.textMuted }}>{s.pct}% · {s.revenue}</div>
                </div>
              ))}
            </div>
          </div>
        </ChartPanel>
      </div>

      {/* Bookings by City */}
      <ChartPanel title="Bookings by City">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {GARDEN_CITY.map((g, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "12px", color: T.textLabel, width: "80px", flexShrink: 0 }}>{g.city}</span>
              <div style={{ flex: 1, background: T.bgElevated, borderRadius: "999px", height: "8px" }}>
                <div style={{ width: `${g.pct}%`, height: "100%", background: T.chart4, borderRadius: "999px" }} />
              </div>
              <span style={{ fontSize: "11px", color: T.textMuted, width: "48px", textAlign: "right", flexShrink: 0 }}>{g.bookings} bk</span>
              <span style={{ fontSize: "11px", fontWeight: 600, color: T.text, width: "70px", textAlign: "right", flexShrink: 0 }}>{g.revenue}</span>
            </div>
          ))}
        </div>
      </ChartPanel>

      {/* Gardener Performance */}
      <ChartPanel title="Gardener Performance">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr>
              {["GARDENER", "BOOKINGS", "REVENUE", "AVG RATING", "UTILISATION"].map(h => (
                <th key={h} style={{ textAlign: "left", color: T.textLabel, fontSize: "11px", fontWeight: 700, padding: "0 12px 10px", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GARDENER_PERF.map((g, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${T.borderMuted}` }}>
                <td style={{ padding: "10px 12px", color: T.text, fontWeight: 500 }}>{g.name}</td>
                <td style={{ padding: "10px 12px", color: T.textLabel }}>{g.bookings}</td>
                <td style={{ padding: "10px 12px", color: T.positive, fontWeight: 600 }}>{g.revenue}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ color: T.warning, fontWeight: 700 }}>★ {g.rating}</span>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "60px", background: T.bgElevated, borderRadius: "999px", height: "5px" }}>
                      <div style={{ width: g.util, height: "100%", background: parseInt(g.util) > 80 ? T.positive : T.chart2, borderRadius: "999px" }} />
                    </div>
                    <span style={{ fontSize: "11px", color: T.textLabel }}>{g.util}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ChartPanel>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   EXPORT MODAL
═══════════════════════════════════════════════ */
function ExportModal({ onClose }: { onClose: () => void }) {
  const [format, setFormat] = useState<"xlsx" | "zip">("xlsx");
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Export Analytics"
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: T.bgSurface,
        border: `1px solid ${T.border}`,
        borderRadius: T.radiusLg,
        padding: "28px",
        width: "400px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}>
        <div style={{ fontSize: "16px", fontWeight: 700, color: T.text, marginBottom: "20px" }}>Export Analytics</div>
        <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "12px" }}>Export format:</div>
        {[
          { value: "xlsx", label: "Excel (.xlsx) — all sections" },
          { value: "zip",  label: "ZIP of CSVs — all sections"  },
        ].map(opt => (
          <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", cursor: "pointer" }}>
            <input
              type="radio"
              name="export-format"
              value={opt.value}
              checked={format === opt.value}
              onChange={() => setFormat(opt.value as "xlsx" | "zip")}
              style={{ accentColor: T.accent }}
            />
            <span style={{ fontSize: "13px", color: T.text }}>{opt.label}</span>
          </label>
        ))}
        <div style={{ marginTop: "16px", padding: "12px", background: T.bgElevated, borderRadius: T.radiusSm, fontSize: "11px", color: T.textMuted }}>
          Date range: Last 30 days · File: hero-analytics-2026-07.{format}
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
          <button onClick={onClose} style={{
            padding: "8px 16px", background: "transparent", border: `1px solid ${T.border}`,
            borderRadius: T.radiusSm, color: T.textMuted, cursor: "pointer", fontSize: "12px",
          }}>Cancel</button>
          <button onClick={onClose} style={{
            padding: "8px 20px", background: T.accent, border: "none",
            borderRadius: T.radiusSm, color: "white", cursor: "pointer", fontSize: "12px", fontWeight: 700,
          }}>Export</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DATE RANGE PICKER
═══════════════════════════════════════════════ */
function DateRangePicker({ value, onChange, onClose }: {
  value: DateRange; onChange: (r: DateRange) => void; onClose: () => void;
}) {
  const options: { key: DateRange; label: string }[] = [
    { key: "today",      label: "Today"        },
    { key: "7d",         label: "Last 7 days"  },
    { key: "30d",        label: "Last 30 days" },
    { key: "90d",        label: "Last 90 days" },
    { key: "month",      label: "This month"   },
    { key: "last_month", label: "Last month"   },
    { key: "quarter",    label: "Last quarter" },
    { key: "ytd",        label: "Year to date" },
  ];
  return (
    <div style={{
      position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 500,
      background: T.bgOverlay, border: `1px solid ${T.border}`,
      borderRadius: T.radiusMd, boxShadow: T.shadowLg, padding: "12px",
      minWidth: "200px",
    }}>
      {options.map(o => (
        <button key={o.key} onClick={() => { onChange(o.key); onClose(); }} style={{
          display: "block", width: "100%", textAlign: "left",
          padding: "8px 12px", fontSize: "12px",
          background: value === o.key ? T.accentMuted : "transparent",
          color: value === o.key ? T.accent : T.text,
          border: "none", borderRadius: T.radiusSm, cursor: "pointer",
          fontWeight: value === o.key ? 700 : 400,
          marginBottom: "2px",
          transition: "all 0.1s",
        }}>{o.label}</button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE COMPONENT
═══════════════════════════════════════════════ */
const SECTIONS: { key: Section; label: string }[] = [
  { key: "overview",  label: "Overview"        },
  { key: "revenue",   label: "Revenue"         },
  { key: "orders",    label: "Orders"          },
  { key: "products",  label: "Products"        },
  { key: "customers", label: "Customers"       },
  { key: "marketing", label: "Marketing"       },
  { key: "garden",    label: "Garden Services" },
];

export default function AnalyticsPage() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [compare, setCompare] = useState<CompareMode>("none");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [dismissedInsights, setDismissedInsights] = useState<string[]>([]);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const compareRef = useRef<HTMLDivElement>(null);

  const dateRangeLabels: Record<DateRange, string> = {
    today: "Today", "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days",
    month: "This month", last_month: "Last month", quarter: "Last quarter", ytd: "Year to date", custom: "Custom",
  };
  const compareLabels: Record<CompareMode, string> = {
    none: "No comparison", prev_period: "Previous period", prev_year: "Previous year",
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) setDatePickerOpen(false);
      if (compareRef.current && !compareRef.current.contains(e.target as Node)) setCompareOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeInsights = INSIGHTS.filter(i => !dismissedInsights.includes(i.id));

  return (
    <div style={{ fontFamily: "Outfit, sans-serif", color: T.text }}>
      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: "20px" }}>
        <ol style={{ listStyle: "none", display: "flex", gap: "6px", fontSize: "12px", color: T.textMuted }}>
          <li><Link href="/admin" style={{ color: T.textMuted, textDecoration: "none" }}>Admin</Link></li>
          <li style={{ color: T.borderMuted }}>/</li>
          <li aria-current="page" style={{ color: T.text }}>Analytics</li>
        </ol>
      </nav>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: T.text, margin: 0 }}>Analytics</h1>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Date Range */}
          <div ref={datePickerRef} style={{ position: "relative" }}>
            <button
              id="date-range-btn"
              aria-label="Date range"
              aria-expanded={datePickerOpen}
              onClick={() => { setDatePickerOpen(!datePickerOpen); setCompareOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 14px", fontSize: "12px", fontWeight: 600,
                background: T.bgElevated, border: `1px solid ${datePickerOpen ? T.accent : T.border}`,
                borderRadius: T.radiusSm, color: T.text, cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              📅 {dateRangeLabels[dateRange]} ▾
            </button>
            {datePickerOpen && (
              <DateRangePicker value={dateRange} onChange={setDateRange} onClose={() => setDatePickerOpen(false)} />
            )}
          </div>

          {/* Compare */}
          <div ref={compareRef} style={{ position: "relative" }}>
            <button
              aria-label="Compare to"
              aria-expanded={compareOpen}
              onClick={() => { setCompareOpen(!compareOpen); setDatePickerOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 14px", fontSize: "12px", fontWeight: 600,
                background: compare !== "none" ? T.accentMuted : T.bgElevated,
                border: `1px solid ${compare !== "none" ? T.accent : T.border}`,
                borderRadius: T.radiusSm, color: compare !== "none" ? T.accent : T.textMuted, cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              Compare: {compareLabels[compare]} ▾
            </button>
            {compareOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 500,
                background: T.bgOverlay, border: `1px solid ${T.border}`,
                borderRadius: T.radiusMd, boxShadow: T.shadowLg, padding: "8px",
                minWidth: "180px",
              }}>
                {(["none", "prev_period", "prev_year"] as CompareMode[]).map(c => (
                  <button key={c} onClick={() => { setCompare(c); setCompareOpen(false); }} style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "8px 12px", fontSize: "12px",
                    background: compare === c ? T.accentMuted : "transparent",
                    color: compare === c ? T.accent : T.text,
                    border: "none", borderRadius: T.radiusSm, cursor: "pointer", fontWeight: compare === c ? 700 : 400,
                    marginBottom: "2px",
                  }}>{compareLabels[c]}</button>
                ))}
              </div>
            )}
          </div>

          {/* Export All */}
          <button
            id="export-all-btn"
            onClick={() => setExportOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 16px", fontSize: "12px", fontWeight: 700,
              background: T.accent, border: "none",
              borderRadius: T.radiusSm, color: "white", cursor: "pointer",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}
          >
            ↓ Export All
          </button>
        </div>
      </div>

      {/* ── Insights ── */}
      {activeInsights.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
          {activeInsights.map(ins => (
            <InsightCard key={ins.id} insight={ins} onDismiss={() => setDismissedInsights(d => [...d, ins.id])} />
          ))}
        </div>
      )}

      {/* ── Section Nav (sticky) ── */}
      <div
        style={{
          position: "sticky", top: "64px", zIndex: 50,
          background: T.bgCanvas,
          borderBottom: `1px solid ${T.borderMuted}`,
          marginBottom: "24px",
          marginLeft: "-24px", marginRight: "-24px", paddingLeft: "24px",
        }}
        role="tablist"
        aria-label="Analytics sections"
      >
        <div style={{ display: "flex", gap: "0", overflowX: "auto" }}>
          {SECTIONS.map(s => (
            <button
              key={s.key}
              id={`tab-${s.key}`}
              role="tab"
              aria-selected={activeSection === s.key}
              aria-controls={`panel-${s.key}`}
              onClick={() => setActiveSection(s.key)}
              style={{
                padding: "12px 20px",
                fontSize: "12px", fontWeight: activeSection === s.key ? 700 : 500,
                color: activeSection === s.key ? T.text : T.textMuted,
                background: "transparent", border: "none", borderBottom: activeSection === s.key ? `2px solid ${T.accent}` : "2px solid transparent",
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.15s",
                outline: "none",
              }}
              onFocus={e => (e.currentTarget as HTMLButtonElement).style.outline = `2px solid ${T.accent}`}
              onBlur={e => (e.currentTarget as HTMLButtonElement).style.outline = "none"}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Section Content ── */}
      {SECTIONS.map(s => (
        <div
          key={s.key}
          id={`panel-${s.key}`}
          role="tabpanel"
          aria-labelledby={`tab-${s.key}`}
          hidden={activeSection !== s.key}
        >
          {activeSection === s.key && (
            s.key === "overview"  ? <OverviewSection />  :
            s.key === "revenue"   ? <RevenueSection />   :
            s.key === "orders"    ? <OrdersSection />    :
            s.key === "products"  ? <ProductsSection />  :
            s.key === "customers" ? <CustomersSection /> :
            s.key === "marketing" ? <MarketingSection /> :
            <GardenSection />
          )}
        </div>
      ))}

      {/* ── Export Modal ── */}
      {exportOpen && <ExportModal onClose={() => setExportOpen(false)} />}

      {/* ── Global styles ── */}
      <style>{`
        @keyframes admin-fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        button:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; box-shadow: 0 0 0 4px rgba(0,181,102,0.2); }
        a:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${T.bgCanvas}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 999px; }
        ::-webkit-scrollbar-thumb:hover { background: ${T.textMuted}; }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
        @media (max-width: 1100px) {
          .kpi-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .kpi-grid-5 { grid-template-columns: repeat(3, 1fr) !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .kpi-grid-4 { grid-template-columns: 1fr 1fr !important; }
          .kpi-grid-5 { grid-template-columns: 1fr 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
