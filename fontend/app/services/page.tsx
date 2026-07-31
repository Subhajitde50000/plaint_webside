"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SharedNavbar from "@/components/Navbar";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

interface GardenServiceType {
  id: number;
  name: string;
  slug: string;
  description: string;
  duration_hours: number;
  base_price: number;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

interface ServiceBooking {
  id: number;
  uuid: string;
  booking_number: string;
  scheduled_date: string;
  scheduled_time_from: string;
  amount: number;
  status: string;
  payment_status: string;
  city: string;
  service_type?: GardenServiceType;
}

const FALLBACK_SERVICES: GardenServiceType[] = [
  {
    id: 1,
    name: "Balcony & Terrace Garden Setup",
    slug: "balcony-terrace-setup",
    description: "Complete design, plant selection, pot placement, and drip layout for outdoor balcony & terrace spaces.",
    duration_hours: 4.0,
    base_price: 4999,
    image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    sort_order: 1,
  },
  {
    id: 2,
    name: "Lawn Maintenance & Care",
    slug: "lawn-maintenance",
    description: "Professional lawn mowing, weed control, aeration, edging, and seasonal fertilization service.",
    duration_hours: 2.0,
    base_price: 1999,
    image_url: "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    sort_order: 2,
  },
  {
    id: 3,
    name: "Indoor Plant Styling & Setup",
    slug: "indoor-plant-styling",
    description: "Aesthetic plant arrangement, decorative pot selection, and light assessment for home or office spaces.",
    duration_hours: 2.5,
    base_price: 2499,
    image_url: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    sort_order: 3,
  },
  {
    id: 4,
    name: "Vertical Garden Installation",
    slug: "vertical-garden",
    description: "Custom living green wall installation with automated drip irrigation and foliage arrangement.",
    duration_hours: 6.0,
    base_price: 7999,
    image_url: "https://images.unsplash.com/photo-1534710961216-b5c8d4529031?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    sort_order: 4,
  },
  {
    id: 5,
    name: "Pest & Disease Treatment",
    slug: "pest-treatment",
    description: "Organic pest treatment, fungal spray, root health assessment, and plant revitalization treatment.",
    duration_hours: 1.5,
    base_price: 1299,
    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    sort_order: 5,
  },
  {
    id: 6,
    name: "Seasonal Plant Repotting",
    slug: "seasonal-repotting",
    description: "Root pruning, nutrient-rich soil mix upgrade, fresh container fitting, and post-potting care.",
    duration_hours: 1.0,
    base_price: 999,
    image_url: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    sort_order: 6,
  },
];

const TIME_SLOTS = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

export default function ServicesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [services, setServices] = useState<GardenServiceType[]>(FALLBACK_SERVICES);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal & Booking states
  const [bookingService, setBookingService] = useState<GardenServiceType | null>(null);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  // Form Fields
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("10:00 AM");
  const [guestName, setGuestName] = useState(user?.first_name ? `${user.first_name} ${user.last_name || ""}` : "");
  const [guestEmail, setGuestEmail] = useState(user?.email || "");
  const [guestPhone, setGuestPhone] = useState(user?.phone || "");
  const [city, setCity] = useState("Mumbai");
  const [state, setState] = useState("Maharashtra");
  const [pincode, setPincode] = useState("400001");
  const [addressFull, setAddressFull] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [formError, setFormError] = useState("");

  // My Bookings Drawer
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [myBookings, setMyBookings] = useState<ServiceBooking[]>([]);
  const [fetchingBookings, setFetchingBookings] = useState(false);

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.first_name) setGuestName(`${user.first_name} ${user.last_name || ""}`.trim());
      if (user.email) setGuestEmail(user.email);
      if (user.phone) setGuestPhone(user.phone);
    }
  }, [user]);

  const fetchServiceTypes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/garden-services/types");
      if (Array.isArray(res.data) && res.data.length > 0) {
        setServices(res.data);
      }
    } catch (err) {
      console.warn("Could not load services from API, using defaults:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      setFetchingBookings(true);
      const res = await api.get("/garden-services/my-bookings");
      setMyBookings(res.data || []);
    } catch (err) {
      console.error("Error fetching my bookings:", err);
    } finally {
      setFetchingBookings(false);
    }
  };

  const handleOpenMyBookings = () => {
    setShowMyBookings(true);
    fetchMyBookings();
  };

  const openBookingModal = (service: GardenServiceType) => {
    setBookingService(service);
    setBookingStep(1);
    setConfirmedBooking(null);
    setFormError("");
    // Default tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduledDate(tomorrow.toISOString().split("T")[0]);
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestPhone || guestPhone.length < 10) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!addressFull || addressFull.trim().length < 5) {
      setFormError("Please enter your complete service address.");
      return;
    }
    if (!scheduledDate) {
      setFormError("Please select a date for the service.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      const payload = {
        service_type_id: bookingService!.id,
        guest_name: guestName || "Valued Customer",
        guest_email: guestEmail || undefined,
        guest_phone: guestPhone,
        scheduled_date: scheduledDate,
        scheduled_time_from: scheduledTime,
        city: city || "Mumbai",
        state: state || "Maharashtra",
        pincode: pincode || "400001",
        address_full: addressFull,
        customer_notes: customerNotes || undefined,
      };

      const res = await api.post("/garden-services/bookings", payload);
      setConfirmedBooking(res.data);
    } catch (err: any) {
      console.error("Booking error:", err);
      setFormError(err.response?.data?.detail || "Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f6", color: "#1c1c1c", fontFamily: "Inter, sans-serif" }}>
      <SharedNavbar />

      {/* ── HERO SECTION ────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          background: "linear-gradient(135deg, #052e16 0%, #064e3b 50%, #022c22 100%)",
          color: "#ffffff",
          padding: "72px 24px 80px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "400px",
            background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(0,0,0,0) 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "880px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              fontSize: "13px",
              fontWeight: 600,
              color: "#6ee7b7",
              marginBottom: "20px",
            }}
          >
            <span>✨ Professional Garden & Plant Care Services</span>
          </div>

          <h1
            style={{
              margin: "0 0 16px",
              fontSize: "clamp(32px, 5vw, 54px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#ffffff",
            }}
          >
            Transform Your Living Spaces into <span style={{ color: "#34d399" }}>Lush Green Sanctuaries</span>
          </h1>

          <p
            style={{
              margin: "0 auto 32px",
              maxWidth: "640px",
              fontSize: "17px",
              lineHeight: 1.6,
              color: "#d1fae5",
            }}
          >
            From balcony makeovers and vertical gardens to lawn care and pest treatments, our certified horticulturists bring expert plant care right to your doorstep.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
            <a
              href="#services-catalog"
              style={{
                padding: "14px 28px",
                borderRadius: "12px",
                background: "#10b981",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
                boxShadow: "0 10px 25px -5px rgba(16,185,129,0.4)",
                transition: "all 0.2s ease",
              }}
            >
              Explore Services ↓
            </a>
            {isAuthenticated && (
              <button
                onClick={handleOpenMyBookings}
                style={{
                  padding: "14px 28px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "15px",
                  cursor: "pointer",
                  backdropFilter: "blur(6px)",
                }}
              >
                📋 My Bookings
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────────────── */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e5e7eb", padding: "24px 20px" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "24px",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#059669" }}>1,200+</div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>Gardens Transformed</div>
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#059669" }}>4.9 ★</div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>Average Rating</div>
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#059669" }}>100% Organic</div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>Eco-friendly Fertilizers</div>
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#059669" }}>On-Time</div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>Guaranteed Service</div>
          </div>
        </div>
      </div>

      {/* ── SERVICES CATALOG ────────────────────────────────────────────── */}
      <section id="services-catalog" style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#059669" }}>
            Our Offerings
          </span>
          <h2 style={{ margin: "8px 0 12px", fontSize: "32px", fontWeight: 800, color: "#111827" }}>
            Choose Your Gardening Service
          </h2>
          <p style={{ margin: "0 auto", maxWidth: "560px", color: "#6b7280", fontSize: "15px", lineHeight: 1.5 }}>
            Book a single service session or recurring care. Every service is backed by our plant happiness guarantee.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: "480px", margin: "0 auto 40px", display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="Search service (e.g. Lawn, Balcony, Repotting)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "12px 18px",
              borderRadius: "12px",
              border: "1.5px solid #d1d5db",
              fontSize: "14px",
              outline: "none",
              background: "#ffffff",
            }}
          />
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
            Loading available services...
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "28px" }}>
            {filteredServices.map((service) => (
              <div
                key={service.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  border: "1px solid #e5e7eb",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div style={{ position: "relative", height: "200px", width: "100%", background: "#e5e7eb" }}>
                  <img
                    src={service.image_url || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80"}
                    alt={service.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "rgba(0,0,0,0.7)",
                      backdropFilter: "blur(4px)",
                      color: "#ffffff",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    ⏱ ~{service.duration_hours} hrs
                  </div>
                </div>

                <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: 700, color: "#111827" }}>
                    {service.name}
                  </h3>
                  <p style={{ margin: "0 0 20px", fontSize: "14px", color: "#4b5563", lineHeight: 1.6, flex: 1 }}>
                    {service.description}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid #f3f4f6" }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "#6b7280", display: "block" }}>Starting Price</span>
                      <span style={{ fontSize: "22px", fontWeight: 800, color: "#059669" }}>
                        ₹{Number(service.base_price).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <button
                      onClick={() => openBookingModal(service)}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "10px",
                        background: "#059669",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "14px",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(5,150,105,0.25)",
                      }}
                    >
                      Book Now →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section style={{ background: "#ffffff", padding: "64px 20px", borderTop: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#059669" }}>
              Simple Process
            </span>
            <h2 style={{ margin: "8px 0 0", fontSize: "28px", fontWeight: 800, color: "#111827" }}>
              How Our Service Works
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "32px" }}>
            {[
              { step: "01", title: "Select Service", desc: "Choose from our specialized indoor, outdoor, or maintenance packages." },
              { step: "02", title: "Pick Date & Time", desc: "Select a convenient time slot for our team to visit your site." },
              { step: "03", title: "Expert Visit", desc: "Our trained gardeners arrive with eco-friendly tools and premium nutrients." },
              { step: "04", title: "Enjoy Your Oasis", desc: "Sit back and enjoy a pristine, healthy green setup in your home." },
            ].map((s) => (
              <div key={s.step} style={{ textAlign: "center", padding: "20px", background: "#faf9f6", borderRadius: "16px" }}>
                <div style={{ fontSize: "32px", fontWeight: 900, color: "#10b981", marginBottom: "12px" }}>{s.step}</div>
                <h4 style={{ margin: "0 0 8px", fontSize: "17px", fontWeight: 700, color: "#111827" }}>{s.title}</h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#6b7280", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING MODAL ───────────────────────────────────────────────── */}
      {bookingService && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "grid",
            placeItems: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              background: "#ffffff",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: "20px 24px", background: "#052e16", color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#34d399" }}>
                  Service Booking
                </span>
                <h3 style={{ margin: "4px 0 0", fontSize: "18px", fontWeight: 700 }}>{bookingService.name}</h3>
              </div>
              <button
                onClick={() => setBookingService(null)}
                style={{ background: "none", border: "none", color: "#ffffff", fontSize: "24px", cursor: "pointer", opacity: 0.8 }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
              {confirmedBooking ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎉</div>
                  <h3 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: 800, color: "#059669" }}>
                    Booking Confirmed!
                  </h3>
                  <p style={{ margin: "0 0 20px", color: "#4b5563", fontSize: "14px" }}>
                    Your booking reference number is:
                  </p>

                  <div
                    style={{
                      display: "inline-block",
                      padding: "12px 24px",
                      borderRadius: "12px",
                      background: "#ecfdf5",
                      border: "1.5px dashed #10b981",
                      fontSize: "20px",
                      fontWeight: 800,
                      color: "#047857",
                      letterSpacing: "0.05em",
                      marginBottom: "24px",
                    }}
                  >
                    {confirmedBooking.booking_number}
                  </div>

                  <div style={{ textAlign: "left", background: "#f9fafb", padding: "16px", borderRadius: "12px", fontSize: "13px", color: "#374151", marginBottom: "24px" }}>
                    <div><strong>Service:</strong> {bookingService.name}</div>
                    <div style={{ marginTop: "6px" }}><strong>Scheduled Date:</strong> {scheduledDate} ({scheduledTime})</div>
                    <div style={{ marginTop: "6px" }}><strong>Amount:</strong> ₹{Number(confirmedBooking.amount).toLocaleString("en-IN")}</div>
                    <div style={{ marginTop: "6px" }}><strong>Status:</strong> {confirmedBooking.status?.toUpperCase()}</div>
                  </div>

                  <button
                    onClick={() => setBookingService(null)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      background: "#059669",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "15px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateBooking}>
                  {formError && (
                    <div style={{ padding: "12px", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fca5a5", color: "#991b1b", fontSize: "13px", marginBottom: "16px" }}>
                      ⚠️ {formError}
                    </div>
                  )}

                  {/* Step 1: Date & Time */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>
                      📅 Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>
                      ⏰ Preferred Time Slot *
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setScheduledTime(slot)}
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: scheduledTime === slot ? "2px solid #059669" : "1px solid #d1d5db",
                            background: scheduledTime === slot ? "#ecfdf5" : "#ffffff",
                            color: scheduledTime === slot ? "#047857" : "#374151",
                            fontWeight: scheduledTime === slot ? 700 : 500,
                            fontSize: "13px",
                            cursor: "pointer",
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="John Doe"
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                        Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="9876543210"
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="john@example.com"
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px" }}
                    />
                  </div>

                  {/* Address */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                      Full Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={addressFull}
                      onChange={(e) => setAddressFull(e.target.value)}
                      placeholder="Flat No., Building Name, Street..."
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px", resize: "vertical" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                      Special Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder="E.g. Gate code, pet instructions..."
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px" }}
                    />
                  </div>

                  <div style={{ background: "#faf9f6", padding: "12px 16px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>Total Service Charge</span>
                    <span style={{ fontSize: "20px", fontWeight: 800, color: "#059669" }}>
                      ₹{Number(bookingService.base_price).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "12px",
                      background: "#059669",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "15px",
                      border: "none",
                      cursor: submitting ? "not-allowed" : "pointer",
                      opacity: submitting ? 0.7 : 1,
                    }}
                  >
                    {submitting ? "Booking Service..." : "Confirm & Book Service →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MY BOOKINGS DRAWER ─────────────────────────────────────────── */}
      {showMyBookings && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "480px",
              background: "#ffffff",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-10px 0 25px rgba(0,0,0,0.15)",
            }}
          >
            <div style={{ padding: "20px 24px", background: "#052e16", color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>My Service Bookings</h3>
              <button onClick={() => setShowMyBookings(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: "22px", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
              {fetchingBookings ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>Fetching your bookings...</div>
              ) : myBookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                  No active or past bookings found.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {myBookings.map((b) => (
                    <div key={b.uuid} style={{ padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb", background: "#faf9f6" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ fontWeight: 800, fontSize: "14px", color: "#059669" }}>{b.booking_number}</span>
                        <span style={{ fontSize: "12px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: "#d1fae5", color: "#047857", textTransform: "capitalize" }}>
                          {b.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>{b.service_type?.name || "Garden Service"}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>📅 Date: {b.scheduled_date} ({b.scheduled_time_from})</div>
                      <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>📍 City: {b.city}</div>
                      <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, color: "#111827" }}>
                        <span>Amount:</span>
                        <span>₹{Number(b.amount).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
