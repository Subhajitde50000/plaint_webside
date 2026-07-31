"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/axios";

/* ════════════════════════════════════════════
   ADMIN DESIGN TOKENS
   ════════════════════════════════════════════ */
const T = {
  pageBg: "#0f1117",
  cardBg: "#1c2128",
  cardHover: "#22272e",
  inputBg: "#22272e",
  overlayBg: "#2d333b",
  text: "#cdd9e5",
  textMuted: "#768390",
  textLabel: "#adbac7",
  border: "#444c56",
  borderMuted: "rgba(68,76,86,0.5)",
  accent: "#00b566",
  accentBg: "rgba(0,181,102,0.15)",
  success: "#57ab5a",
  successBg: "rgba(87,171,90,0.12)",
  warning: "#c69026",
  warningBg: "rgba(198,144,38,0.12)",
  info: "#539bf5",
  infoBg: "rgba(83,155,245,0.12)",
  danger: "#e5534b",
  dangerBg: "rgba(229,83,75,0.12)",
};

interface ServiceType {
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

interface Gardener {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  specialisations: string;
  rating_average: number;
  rating_count: number;
  is_active: boolean;
}

interface Booking {
  id: number;
  uuid: string;
  booking_number: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  service_type_id: number;
  scheduled_date: string;
  scheduled_time_from: string;
  city: string;
  state: string;
  pincode: string;
  address_full: string;
  customer_notes: string;
  admin_notes: string;
  amount: number;
  payment_status: "pending" | "paid" | "refunded";
  status: "pending" | "confirmed" | "assigned" | "in_progress" | "completed" | "cancelled";
  assigned_gardener_id: number | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  created_at: string;
  service_type?: ServiceType;
  gardener?: Gardener;
}

interface Stats {
  total_bookings: number;
  pending: number;
  assigned: number;
  completed: number;
  total_revenue: number;
  active_gardeners: number;
}

export default function AdminGardenServicesPage() {
  const [activeTab, setActiveTab] = useState<"bookings" | "services" | "gardeners">("bookings");
  const [stats, setStats] = useState<Stats>({
    total_bookings: 0,
    pending: 0,
    assigned: 0,
    completed: 0,
    total_revenue: 0,
    active_gardeners: 0,
  });

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updatingBooking, setUpdatingBooking] = useState(false);

  // Edit Booking Modal Form state
  const [editStatus, setEditStatus] = useState<string>("pending");
  const [editPaymentStatus, setEditPaymentStatus] = useState<string>("pending");
  const [editGardenerId, setEditGardenerId] = useState<string>("");
  const [editAdminNotes, setEditAdminNotes] = useState<string>("");
  const [editCancelReason, setEditCancelReason] = useState<string>("");

  // Services state
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    duration_hours: "2.0",
    base_price: "1999",
    image_url: "",
    is_active: true,
  });

  // Gardeners state
  const [gardeners, setGardeners] = useState<Gardener[]>([]);
  const [loadingGardeners, setLoadingGardeners] = useState(false);
  const [editingGardener, setEditingGardener] = useState<Gardener | null>(null);
  const [showGardenerModal, setShowGardenerModal] = useState(false);
  const [gardenerForm, setGardenerForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Mumbai",
    state: "Maharashtra",
    specialisations: "1,2,3",
    is_active: true,
  });

  useEffect(() => {
    fetchStats();
    fetchBookings();
    fetchServices();
    fetchGardeners();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, searchQuery]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/garden-services/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await api.get("/admin/garden-services/bookings", {
        params: {
          status: statusFilter !== "all" ? statusFilter : undefined,
          q: searchQuery || undefined,
        },
      });
      // Handle pagination object or list
      const list = Array.isArray(res.data) ? res.data : res.data?.items || res.data?.data || [];
      setBookings(list);
    } catch (err) {
      console.error("Error fetching admin bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const res = await api.get("/admin/garden-services/types");
      setServices(res.data || []);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchGardeners = async () => {
    try {
      setLoadingGardeners(true);
      const res = await api.get("/admin/garden-services/gardeners");
      setGardeners(res.data || []);
    } catch (err) {
      console.error("Error fetching gardeners:", err);
    } finally {
      setLoadingGardeners(false);
    }
  };

  const handleOpenBookingModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditStatus(booking.status);
    setEditPaymentStatus(booking.payment_status);
    setEditGardenerId(booking.assigned_gardener_id ? String(booking.assigned_gardener_id) : "");
    setEditAdminNotes(booking.admin_notes || "");
    setEditCancelReason(booking.cancel_reason || "");
  };

  const handleSaveBooking = async () => {
    if (!selectedBooking) return;
    try {
      setUpdatingBooking(true);
      const payload = {
        status: editStatus,
        payment_status: editPaymentStatus,
        assigned_gardener_id: editGardenerId ? Number(editGardenerId) : null,
        admin_notes: editAdminNotes || undefined,
        cancel_reason: editStatus === "cancelled" ? editCancelReason || undefined : undefined,
      };

      const res = await api.patch(`/admin/garden-services/bookings/${selectedBooking.uuid}`, payload);
      
      // Update local list & state
      setBookings((prev) => prev.map((b) => (b.uuid === selectedBooking.uuid ? res.data : b)));
      setSelectedBooking(null);
      fetchStats();
    } catch (err) {
      console.error("Error updating booking:", err);
      alert("Failed to update booking.");
    } finally {
      setUpdatingBooking(false);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: serviceForm.name,
        description: serviceForm.description,
        duration_hours: Number(serviceForm.duration_hours),
        base_price: Number(serviceForm.base_price),
        image_url: serviceForm.image_url || undefined,
        is_active: serviceForm.is_active,
      };

      if (editingService) {
        await api.patch(`/admin/garden-services/types/${editingService.id}`, payload);
      } else {
        await api.post("/admin/garden-services/types", payload);
      }

      setShowServiceModal(false);
      setEditingService(null);
      fetchServices();
    } catch (err) {
      console.error("Error saving service:", err);
      alert("Failed to save service type.");
    }
  };

  const handleSaveGardener = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: gardenerForm.name,
        phone: gardenerForm.phone,
        email: gardenerForm.email || undefined,
        city: gardenerForm.city,
        state: gardenerForm.state,
        specialisations: gardenerForm.specialisations,
        is_active: gardenerForm.is_active,
      };

      if (editingGardener) {
        await api.patch(`/admin/garden-services/gardeners/${editingGardener.id}`, payload);
      } else {
        await api.post("/admin/garden-services/gardeners", payload);
      }

      setShowGardenerModal(false);
      setEditingGardener(null);
      fetchGardeners();
      fetchStats();
    } catch (err) {
      console.error("Error saving gardener:", err);
      alert("Failed to save gardener.");
    }
  };

  const getStatusBadge = (statusStr: string) => {
    switch (statusStr) {
      case "completed":
        return { bg: T.successBg, color: T.success, label: "Completed" };
      case "in_progress":
        return { bg: T.infoBg, color: T.info, label: "In Progress" };
      case "assigned":
      case "confirmed":
        return { bg: T.accentBg, color: T.accent, label: statusStr === "assigned" ? "Assigned" : "Confirmed" };
      case "cancelled":
        return { bg: T.dangerBg, color: T.danger, label: "Cancelled" };
      default:
        return { bg: T.warningBg, color: T.warning, label: "Pending" };
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.pageBg, color: T.text, padding: "32px 24px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        
        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: T.accent, marginBottom: "4px" }}>
              Management Portal
            </div>
            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#ffffff" }}>
              🌱 Garden Services
            </h1>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => {
                setEditingService(null);
                setServiceForm({ name: "", description: "", duration_hours: "2.0", base_price: "1999", image_url: "", is_active: true });
                setShowServiceModal(true);
              }}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                background: T.inputBg,
                border: `1px solid ${T.border}`,
                color: T.text,
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Add Service Type
            </button>
            <button
              onClick={() => {
                setEditingGardener(null);
                setGardenerForm({ name: "", phone: "", email: "", city: "Mumbai", state: "Maharashtra", specialisations: "1,2,3", is_active: true });
                setShowGardenerModal(true);
              }}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                background: T.accent,
                border: "none",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Add Gardener
            </button>
          </div>
        </div>

        {/* ── KPI METRICS CARDS ───────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Total Bookings", val: stats.total_bookings, sub: "All time requests", color: T.text },
            { label: "Pending Actions", val: stats.pending, sub: "Requires confirmation", color: T.warning },
            { label: "Assigned / Active", val: stats.assigned, sub: "In progress or scheduled", color: T.info },
            { label: "Completed Services", val: stats.completed, sub: "Successfully fulfilled", color: T.success },
            { label: "Total Revenue", val: `₹${stats.total_revenue.toLocaleString("en-IN")}`, sub: "From completed jobs", color: T.accent },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                background: T.cardBg,
                borderRadius: "14px",
                padding: "20px",
                border: `1px solid ${T.borderMuted}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ fontSize: "12px", color: T.textMuted, fontWeight: 600 }}>{card.label}</div>
              <div style={{ fontSize: "26px", fontWeight: 800, color: card.color, margin: "6px 0 2px" }}>{card.val}</div>
              <div style={{ fontSize: "11px", color: T.textMuted }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* ── NAVIGATION TABS ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, marginBottom: "24px", gap: "24px" }}>
          {[
            { id: "bookings", label: `Bookings (${bookings.length})` },
            { id: "services", label: `Service Catalog (${services.length})` },
            { id: "gardeners", label: `Gardeners Team (${gardeners.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "12px 4px",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab.id ? `3px solid ${T.accent}` : "3px solid transparent",
                color: activeTab === tab.id ? T.accent : T.textMuted,
                fontWeight: activeTab === tab.id ? 700 : 600,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: BOOKINGS ─────────────────────────────────────────────── */}
        {activeTab === "bookings" && (
          <div>
            {/* Filter & Search Bar */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["all", "pending", "confirmed", "assigned", "in_progress", "completed", "cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      border: `1px solid ${statusFilter === st ? T.accent : T.border}`,
                      background: statusFilter === st ? T.accentBg : T.inputBg,
                      color: statusFilter === st ? T.accent : T.textMuted,
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Search Booking #, name, phone, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: `1px solid ${T.border}`,
                  background: T.inputBg,
                  color: T.text,
                  fontSize: "13px",
                  width: "280px",
                }}
              />
            </div>

            {/* Bookings Data Table */}
            <div style={{ background: T.cardBg, borderRadius: "14px", border: `1px solid ${T.border}`, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: T.overlayBg, color: T.textLabel, borderBottom: `1px solid ${T.border}` }}>
                    <th style={{ padding: "14px 16px" }}>BOOKING #</th>
                    <th style={{ padding: "14px 16px" }}>CUSTOMER</th>
                    <th style={{ padding: "14px 16px" }}>SERVICE</th>
                    <th style={{ padding: "14px 16px" }}>SCHEDULED DATE</th>
                    <th style={{ padding: "14px 16px" }}>AMOUNT</th>
                    <th style={{ padding: "14px 16px" }}>STATUS</th>
                    <th style={{ padding: "14px 16px" }}>GARDENER</th>
                    <th style={{ padding: "14px 16px", textAlign: "right" }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingBookings ? (
                    <tr>
                      <td colSpan={8} style={{ padding: "32px", textAlign: "center", color: T.textMuted }}>
                        Loading bookings...
                      </td>
                    </tr>
                  ) : bookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: "32px", textAlign: "center", color: T.textMuted }}>
                        No garden service bookings found matching filter.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => {
                      const badge = getStatusBadge(b.status);
                      return (
                        <tr key={b.uuid} style={{ borderBottom: `1px solid ${T.borderMuted}`, background: "transparent" }}>
                          <td style={{ padding: "14px 16px", fontWeight: 700, color: T.accent }}>
                            {b.booking_number}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ fontWeight: 600, color: T.text }}>{b.guest_name || "Guest Customer"}</div>
                            <div style={{ fontSize: "11px", color: T.textMuted }}>{b.guest_phone} · {b.city}</div>
                          </td>
                          <td style={{ padding: "14px 16px", color: T.text }}>
                            {b.service_type?.name || `Service #${b.service_type_id}`}
                          </td>
                          <td style={{ padding: "14px 16px", color: T.textMuted }}>
                            {b.scheduled_date} ({b.scheduled_time_from || "Slot"})
                          </td>
                          <td style={{ padding: "14px 16px", fontWeight: 700, color: T.text }}>
                            ₹{Number(b.amount).toLocaleString("en-IN")}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span
                              style={{
                                padding: "3px 10px",
                                borderRadius: "12px",
                                background: badge.bg,
                                color: badge.color,
                                fontSize: "11px",
                                fontWeight: 700,
                              }}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px", color: T.textMuted }}>
                            {b.gardener ? b.gardener.name : <span style={{ fontStyle: "italic", opacity: 0.6 }}>Unassigned</span>}
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "right" }}>
                            <button
                              onClick={() => handleOpenBookingModal(b)}
                              style={{
                                padding: "6px 14px",
                                borderRadius: "6px",
                                background: T.inputBg,
                                border: `1px solid ${T.border}`,
                                color: T.text,
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 2: SERVICE CATALOG ──────────────────────────────────────── */}
        {activeTab === "services" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {services.map((s) => (
              <div
                key={s.id}
                style={{
                  background: T.cardBg,
                  borderRadius: "14px",
                  border: `1px solid ${T.border}`,
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "12px", color: T.textMuted, fontWeight: 700 }}>#{s.id} · Order {s.sort_order}</span>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "8px", background: s.is_active ? T.successBg : T.dangerBg, color: s.is_active ? T.success : T.danger, fontWeight: 700 }}>
                      {s.is_active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>

                  <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 700, color: "#ffffff" }}>{s.name}</h3>
                  <p style={{ margin: "0 0 16px", fontSize: "13px", color: T.textMuted, lineHeight: 1.5 }}>{s.description}</p>
                </div>

                <div style={{ borderTop: `1px solid ${T.borderMuted}`, paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "11px", color: T.textMuted, display: "block" }}>Base Price</span>
                    <span style={{ fontSize: "18px", fontWeight: 800, color: T.accent }}>₹{Number(s.base_price).toLocaleString("en-IN")}</span>
                  </div>
                  <button
                    onClick={() => {
                      setEditingService(s);
                      setServiceForm({
                        name: s.name,
                        description: s.description || "",
                        duration_hours: String(s.duration_hours || 2.0),
                        base_price: String(s.base_price),
                        image_url: s.image_url || "",
                        is_active: s.is_active,
                      });
                      setShowServiceModal(true);
                    }}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      background: T.inputBg,
                      border: `1px solid ${T.border}`,
                      color: T.text,
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 3: GARDENERS ────────────────────────────────────────────── */}
        {activeTab === "gardeners" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {gardeners.map((g) => (
              <div
                key={g.id}
                style={{
                  background: T.cardBg,
                  borderRadius: "14px",
                  border: `1px solid ${T.border}`,
                  padding: "20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 700, color: "#ffffff" }}>{g.name}</h3>
                    <span style={{ fontSize: "12px", color: T.textMuted }}>📍 {g.city}, {g.state}</span>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#f59e0b" }}>
                    ★ {g.rating_average} ({g.rating_count})
                  </span>
                </div>

                <div style={{ fontSize: "13px", color: T.text, marginBottom: "8px" }}>📞 {g.phone}</div>
                {g.email && <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "12px" }}>✉️ {g.email}</div>}

                <div style={{ borderTop: `1px solid ${T.borderMuted}`, paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "8px", background: g.is_active ? T.successBg : T.dangerBg, color: g.is_active ? T.success : T.danger, fontWeight: 700 }}>
                    {g.is_active ? "AVAILABLE" : "OFF DUTY"}
                  </span>
                  <button
                    onClick={() => {
                      setEditingGardener(g);
                      setGardenerForm({
                        name: g.name,
                        phone: g.phone,
                        email: g.email || "",
                        city: g.city,
                        state: g.state || "",
                        specialisations: g.specialisations || "",
                        is_active: g.is_active,
                      });
                      setShowGardenerModal(true);
                    }}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      background: T.inputBg,
                      border: `1px solid ${T.border}`,
                      color: T.text,
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ── BOOKING MANAGEMENT MODAL ────────────────────────────────────── */}
      {selectedBooking && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.7)", display: "grid", placeItems: "center", padding: "20px" }}>
          <div style={{ width: "100%", maxWidth: "560px", background: T.cardBg, borderRadius: "18px", border: `1px solid ${T.border}`, padding: "24px", color: T.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#ffffff" }}>
                Manage Booking {selectedBooking.booking_number}
              </h3>
              <button onClick={() => setSelectedBooking(null)} style={{ background: "none", border: "none", color: T.textMuted, fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: T.textLabel, marginBottom: "4px" }}>Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: "13px" }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: T.textLabel, marginBottom: "4px" }}>Payment Status</label>
                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: "13px" }}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", color: T.textLabel, marginBottom: "4px" }}>Assign Gardener</label>
              <select
                value={editGardenerId}
                onChange={(e) => setEditGardenerId(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: "13px" }}
              >
                <option value="">-- Select Gardener --</option>
                {gardeners.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.city})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", color: T.textLabel, marginBottom: "4px" }}>Admin Internal Notes</label>
              <textarea
                rows={2}
                value={editAdminNotes}
                onChange={(e) => setEditAdminNotes(e.target.value)}
                placeholder="Notes for staff or gardener..."
                style={{ width: "100%", padding: "8px", borderRadius: "6px", background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: "13px", resize: "vertical" }}
              />
            </div>

            {editStatus === "cancelled" && (
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", color: T.danger, marginBottom: "4px" }}>Cancellation Reason</label>
                <input
                  type="text"
                  value={editCancelReason}
                  onChange={(e) => setEditCancelReason(e.target.value)}
                  placeholder="Reason for cancellation..."
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", background: T.inputBg, border: `1px solid ${T.danger}`, color: T.text, fontSize: "13px" }}
                />
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
              <button onClick={() => setSelectedBooking(null)} style={{ padding: "8px 16px", borderRadius: "6px", background: "transparent", border: `1px solid ${T.border}`, color: T.textMuted, cursor: "pointer" }}>
                Cancel
              </button>
              <button
                onClick={handleSaveBooking}
                disabled={updatingBooking}
                style={{ padding: "8px 20px", borderRadius: "6px", background: T.accent, border: "none", color: "#ffffff", fontWeight: 700, cursor: "pointer" }}
              >
                {updatingBooking ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SERVICE TYPE MODAL ───────────────────────────────────────────── */}
      {showServiceModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.7)", display: "grid", placeItems: "center", padding: "20px" }}>
          <div style={{ width: "100%", maxWidth: "500px", background: T.cardBg, borderRadius: "18px", border: `1px solid ${T.border}`, padding: "24px", color: T.text }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: 800, color: "#ffffff" }}>
              {editingService ? "Edit Service Type" : "Add New Service Type"}
            </h3>

            <form onSubmit={handleSaveService}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", color: T.textLabel, marginBottom: "4px" }}>Service Name *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: "13px" }}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", color: T.textLabel, marginBottom: "4px" }}>Description</label>
                <textarea
                  rows={2}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: T.textLabel, marginBottom: "4px" }}>Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={serviceForm.base_price}
                    onChange={(e) => setServiceForm({ ...serviceForm, base_price: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: T.textLabel, marginBottom: "4px" }}>Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={serviceForm.duration_hours}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration_hours: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", color: T.textLabel, marginBottom: "4px" }}>Image URL</label>
                <input
                  type="url"
                  value={serviceForm.image_url}
                  onChange={(e) => setServiceForm({ ...serviceForm, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button type="button" onClick={() => setShowServiceModal(false)} style={{ padding: "8px 16px", borderRadius: "6px", background: "transparent", border: `1px solid ${T.border}`, color: T.textMuted, cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: "8px 20px", borderRadius: "6px", background: T.accent, border: "none", color: "#ffffff", fontWeight: 700, cursor: "pointer" }}>
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── GARDENER MODAL ──────────────────────────────────────────────── */}
      {showGardenerModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.7)", display: "grid", placeItems: "center", padding: "20px" }}>
          <div style={{ width: "100%", maxWidth: "500px", background: T.cardBg, borderRadius: "18px", border: `1px solid ${T.border}`, padding: "24px", color: T.text }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: 800, color: "#ffffff" }}>
              {editingGardener ? "Edit Gardener Details" : "Add New Gardener"}
            </h3>

            <form onSubmit={handleSaveGardener}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", color: T.textLabel, marginBottom: "4px" }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={gardenerForm.name}
                  onChange={(e) => setGardenerForm({ ...gardenerForm, name: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: T.textLabel, marginBottom: "4px" }}>Phone *</label>
                  <input
                    type="tel"
                    required
                    value={gardenerForm.phone}
                    onChange={(e) => setGardenerForm({ ...gardenerForm, phone: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: T.textLabel, marginBottom: "4px" }}>Email</label>
                  <input
                    type="email"
                    value={gardenerForm.email}
                    onChange={(e) => setGardenerForm({ ...gardenerForm, email: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: T.textLabel, marginBottom: "4px" }}>City *</label>
                  <input
                    type="text"
                    required
                    value={gardenerForm.city}
                    onChange={(e) => setGardenerForm({ ...gardenerForm, city: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: T.textLabel, marginBottom: "4px" }}>State</label>
                  <input
                    type="text"
                    value={gardenerForm.state}
                    onChange={(e) => setGardenerForm({ ...gardenerForm, state: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button type="button" onClick={() => setShowGardenerModal(false)} style={{ padding: "8px 16px", borderRadius: "6px", background: "transparent", border: `1px solid ${T.border}`, color: T.textMuted, cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: "8px 20px", borderRadius: "6px", background: T.accent, border: "none", color: "#ffffff", fontWeight: 700, cursor: "pointer" }}>
                  Save Gardener
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
