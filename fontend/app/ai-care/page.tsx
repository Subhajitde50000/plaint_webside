"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import SharedNavbar from "@/components/Navbar";
import { useAiChat } from "@/features/ai-care/hooks/useAiChat";
import { useProducts } from "@/features/products/hooks/useProducts";
import { ApiProduct } from "@/features/products/api/products.api";
import { useMyPlants } from "@/features/profile";

/* ═══════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════ */
const G = "#00b566";
const GDK = "#009952";
const BG = "#fefcf9";
const TEXT = "#1c1c1c";
const WHITE = "#ffffff";
const S2 = "rgb(202,223,212) 0px 0px 0px 1px inset";
const S3 = "rgb(212,212,212) 0px 0px 0px 1px inset";
const S4 = "rgb(0,146,82) 0px 0px 0px 1px inset";

const CATEGORIES = ["All", "Indoor", "Outdoor", "Flowering", "Succulents"];

const POTS = [
  { id: "terracotta", name: "Terracotta", emoji: "🪴", tint: "rgba(193,120,72,0.20)" },
  { id: "white",      name: "White",      emoji: "⬜", tint: "rgba(230,228,220,0.25)" },
  { id: "black",      name: "Dark",       emoji: "⬛", tint: "rgba(32,32,32,0.22)"  },
  { id: "woven",      name: "Woven",      emoji: "🧺", tint: "rgba(180,145,70,0.22)" },
];

const SUGGESTIONS = [
  "Why are my leaves turning yellow?",
  "How often should I water this?",
  "Best soil mix for this plant?",
  "Is this plant safe for pets?",
  "How much light does it need?",
  "Help me identify this plant",
  "Signs of overwatering?",
  "When should I repot?",
];

type CanvasPlant = {
  id: string;
  productId: number;
  img: string;
  name: string;
  x: number; y: number;
  scale: number;
  pot: string;
  flipped: boolean;
  zIndex: number;
};

/* ═══════════════════════════════════════════
   ICONS
═══════════════════════════════════════════ */
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

/* ═══════════════════════════════════════════
   TOAST
═══════════════════════════════════════════ */
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div role="status" aria-live="polite" style={{ position: "fixed", bottom: "32px", left: "50%", transform: "translateX(-50%)", background: TEXT, color: WHITE, borderRadius: "12px", padding: "12px 24px", fontSize: "14px", fontWeight: 500, zIndex: 300, animation: "slideUp 250ms ease both", boxShadow: `0 6px 24px rgba(0,181,102,0.3)`, borderLeft: `4px solid ${G}`, fontFamily: "Outfit, sans-serif" }}>
      {msg}
    </div>
  );
}

/* ═══════════════════════════════════════════
   TYPING INDICATOR
═══════════════════════════════════════════ */
function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", background: `${G}15`, border: `1px solid ${G}40`, borderRadius: "12px 12px 12px 4px", width: "fit-content" }} aria-label="AI is thinking" aria-live="polite">
      {[0,1,2].map(i => (
        <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: `${G}80`, animation: `bounce 400ms ${i * 100}ms ease-in-out infinite` }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MESSAGE BUBBLE
═══════════════════════════════════════════ */
function MessageBubble({ msg, onAddToCart }: { msg: ReturnType<typeof useAiChat>["messages"][0]; onAddToCart: (id: string, name: string) => void }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", marginBottom: "20px", animation: "fadeSlideIn 250ms ease both" }}>
      {!isUser && (
        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: G, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "6px", fontSize: "14px" }}>🌿</div>
      )}
      <div style={{ maxWidth: isUser ? "75%" : "85%", background: isUser ? G : `${G}15`, border: isUser ? "none" : `1px solid ${G}40`, borderRadius: isUser ? "12px 12px 4px 12px" : "12px 12px 12px 4px", padding: "12px 16px", color: isUser ? WHITE : TEXT }}>
        {msg.attachment && (
          <div style={{ marginBottom: "10px", background: `${G}20`, borderRadius: "8px", padding: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: isUser ? "rgba(255,255,255,0.85)" : TEXT }}>
            📎 {msg.attachment}
          </div>
        )}
        {msg.identifiedPlant && (
          <div style={{ marginBottom: "10px", background: "rgba(0,181,102,0.1)", borderRadius: "8px", padding: "8px 10px", fontSize: "12px", fontWeight: 600, color: GDK }}>
            🔍 Identified: <span style={{ textTransform: "capitalize" }}>{msg.identifiedPlant}</span>
          </div>
        )}
        <p style={{ fontSize: "14px", lineHeight: 1.6, whiteSpace: "pre-line", margin: 0 }}>{msg.text}</p>

        {msg.products && msg.products.length > 0 && (
          <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {msg.products.map((p) => (
              <div key={p.id} style={{ background: BG, border: S2, borderRadius: "10px", padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "box-shadow 200ms" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.boxShadow = S4)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.boxShadow = S2)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {p.image_url && (
                    <div style={{ width: 40, height: 40, borderRadius: 6, overflow: "hidden", flexShrink: 0, position: "relative" }}>
                      <Image src={p.image_url} alt={p.name} fill sizes="40px" style={{ objectFit: "cover" }} />
                    </div>
                  )}
                  <div>
                    {p.slug ? (
                      <Link href={`/products/${p.slug}`} style={{ fontSize: "13px", fontWeight: 600, color: TEXT, textDecoration: "none" }}>🛒 {p.name}</Link>
                    ) : (
                      <p style={{ fontSize: "13px", fontWeight: 600, color: TEXT, marginBottom: "1px" }}>🛒 {p.name}</p>
                    )}
                    <p style={{ fontSize: "12px", color: GDK, fontWeight: 600, margin: 0 }}>₹{p.price.toFixed(0)}</p>
                  </div>
                </div>
                <button onClick={() => onAddToCart(p.id, p.name)} style={{ background: G, color: WHITE, border: "none", borderRadius: "9999px", padding: "5px 12px", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "Outfit, sans-serif", flexShrink: 0 }}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <span style={{ fontSize: "9px", color: "rgba(28,28,28,0.4)", marginTop: "4px" }}>{msg.time}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function AiCarePage() {
  const [mode, setMode] = useState<"ask" | "visualise">("ask");
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // AI Chat
  const { messages, sending, sendMessage } = useAiChat();
  const { plants: savedPlants } = useMyPlants();
  const [selectedPlantId, setSelectedPlantId] = useState<string>("");


  // Visualiser state
  const [plantSearch, setPlantSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [canvasPlants, setCanvasPlants] = useState<CanvasPlant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const [activePot, setActivePot] = useState("terracotta");
  const [roomPhoto, setRoomPhoto] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [historyStack, setHistoryStack] = useState<CanvasPlant[][]>([[]]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const msgEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const roomFileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ id: string; ox: number; oy: number } | null>(null);

  // Load products for visualiser
  const { data: productsData } = useProducts({ pageSize: 24, sort: "popularity" });
  const productList: ApiProduct[] = productsData?.items || [];

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, sending]);

  const handleSend = useCallback(async () => {
    const q = input.trim();
    if (!q && !attachment) return;
    await sendMessage(q, attachment);
    setInput("");
    setAttachment(null);
    setAttachmentName(null);
  }, [input, attachment, sendMessage]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleAddToCart = (id: string, name: string) => {
    // suggested_products.id is the product uuid; find first variant on the cart API
    // For now navigate user to product page for adding to cart
    setToast(`🛒 View "${name}" to add it to your cart!`);
  };

  // Filter products for visualiser
  const filteredProducts = productList.filter((p: ApiProduct) => {
    const matchName = p.title.toLowerCase().includes(plantSearch.toLowerCase());
    if (activeCategory === "All") return matchName;
    const type = (p.product_type || "").toLowerCase();
    if (activeCategory === "Indoor") return matchName && (type.includes("indoor") || type.includes("foliage") || type.includes("tropical"));
    if (activeCategory === "Outdoor") return matchName && type.includes("outdoor");
    if (activeCategory === "Flowering") return matchName && type.includes("flower");
    if (activeCategory === "Succulents") return matchName && (type.includes("succulent") || type.includes("cactus"));
    return matchName;
  });

  const pushHistory = useCallback((plants: CanvasPlant[]) => {
    setHistoryStack(h => { const next = [...h.slice(0, historyIdx + 1), [...plants]]; setHistoryIdx(next.length - 1); return next; });
  }, [historyIdx]);

  const addPlantToCanvas = (product: ApiProduct) => {
    const img = product.images?.find((i: { is_primary?: boolean; url: string }) => i.is_primary)?.url || product.images?.[0]?.url || "";
    const newPlant: CanvasPlant = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      img,
      name: product.title,
      x: 40 + Math.random() * 20, y: 30 + Math.random() * 20,
      scale: 75, pot: activePot, flipped: false, zIndex: canvasPlants.length + 1,
    };
    const next = [...canvasPlants, newPlant];
    setCanvasPlants(next);
    pushHistory(next);
    setSelectedPlant(newPlant.id);
    setToast(`🌿 ${product.title} added to canvas!`);
  };

  const removePlant = (id: string) => {
    const next = canvasPlants.filter(p => p.id !== id);
    setCanvasPlants(next);
    pushHistory(next);
    setSelectedPlant(null);
  };

  const updateSelected = (patch: Partial<CanvasPlant>) => {
    if (!selectedPlant) return;
    const next = canvasPlants.map(p => p.id === selectedPlant ? { ...p, ...patch } : p);
    setCanvasPlants(next);
  };

  const undo = () => {
    if (historyIdx <= 0) return;
    const ni = historyIdx - 1;
    setHistoryIdx(ni);
    setCanvasPlants([...historyStack[ni]]);
    setSelectedPlant(null);
  };
  const redo = () => {
    if (historyIdx >= historyStack.length - 1) return;
    const ni = historyIdx + 1;
    setHistoryIdx(ni);
    setCanvasPlants([...historyStack[ni]]);
    setSelectedPlant(null);
  };

  const selPlant = canvasPlants.find(p => p.id === selectedPlant);

  const handleFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { setToast("That file is over 10MB. Try a smaller photo."); return; }
    setAttachment(file);
    setAttachmentName(file.name);
  };

  const handleRoomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setRoomPhoto(URL.createObjectURL(file));
  };

  const clearAll = () => { const next: CanvasPlant[] = []; setCanvasPlants(next); pushHistory(next); setSelectedPlant(null); };

  // Canvas drag
  const handleDragStart = (id: string, clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const plant = canvasPlants.find(p => p.id === id)!;
    dragging.current = { id, ox: clientX - (plant.x / 100) * rect.width, oy: clientY - (plant.y / 100) * rect.height };
    setSelectedPlant(id);
  };

  const onMouseDown = (e: React.MouseEvent, id: string) => { e.preventDefault(); handleDragStart(id, e.clientX, e.clientY); };
  const onTouchStart = (e: React.TouchEvent, id: string) => { e.stopPropagation(); if (e.touches[0]) handleDragStart(id, e.touches[0].clientX, e.touches[0].clientY); };

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!dragging.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.min(90, Math.max(5, ((clientX - dragging.current.ox) / rect.width) * 100));
    const y = Math.min(85, Math.max(5, ((clientY - dragging.current.oy) / rect.height) * 100));
    setCanvasPlants(prev => prev.map(p => p.id === dragging.current!.id ? { ...p, x, y } : p));
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => { handleDragMove(e.clientX, e.clientY); }, [handleDragMove]);
  const onTouchMove = useCallback((e: TouchEvent) => { if (!dragging.current) return; if (e.cancelable) e.preventDefault(); if (e.touches[0]) handleDragMove(e.touches[0].clientX, e.touches[0].clientY); }, [handleDragMove]);
  const onDragEnd = useCallback(() => { dragging.current = null; }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onDragEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onDragEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onDragEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onDragEnd);
    };
  }, [onMouseMove, onTouchMove, onDragEnd]);

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Outfit, sans-serif", color: TEXT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :focus-visible { outline: 2px solid ${G} !important; outline-offset: 2px !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,181,102,0.3); border-radius: 9999px; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateX(-50%) translateY(12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes sway { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
        @keyframes fabPulse { 0%,100%{box-shadow:0 0 0 0 rgba(0,181,102,0.4)} 50%{box-shadow:0 0 0 10px rgba(0,181,102,0)} }
        .two-panel { display: grid; grid-template-columns: 44% 56%; gap: 24px; }
        .ac-canvas { height: 520px; }
        @media (max-width: 1023px) { .two-panel { grid-template-columns: 1fr !important; } }
        @media (max-width: 767px) {
          .ac-wrap { padding: 0 16px !important; }
          .ac-canvas { height: 380px !important; }
        }
      `}</style>

      <SharedNavbar />
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      {/* ── HERO STRIP ── */}
      <div style={{ background: `linear-gradient(135deg, ${G} 0%, #006b3d 100%)`, padding: "0 48px", height: "120px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden" }} className="ac-wrap">
        {[{t:"8px",l:"10%",r:0,s:1.2},{t:"40px",l:"25%",r:-30,s:0.8},{t:"20px",r:"8%",l:"auto",s:1}].map((s, i) => (
          <div key={i} style={{ position: "absolute", top: s.t, left: s.l, right: s.r as any, fontSize: "48px", opacity: 0.08, transform: `rotate(${s.r}deg) scale(${s.s})`, animation: "sway 3s ease-in-out infinite", pointerEvents: "none" }}>🌿</div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", zIndex: 1 }}>
          <div style={{ fontSize: "40px", animation: "sway 3s ease-in-out infinite" }}>🤖🌿</div>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: "clamp(22px,3vw,36px)", color: WHITE, lineHeight: 1.15 }}>AI Plant Care</h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.82)", marginTop: "4px" }}>Your smart plant companion — ask, upload, visualise</p>
          </div>
        </div>
        <button onClick={() => { setMode("ask"); inputRef.current?.focus(); }}
          style={{ background: BG, color: G, fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "15px", border: "none", borderRadius: "9999px", padding: "12px 28px", cursor: "pointer", transition: "opacity 200ms", zIndex: 1, whiteSpace: "nowrap" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.9")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
        >Start Asking →</button>
      </div>

      {/* ── MODE TABS ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }} className="ac-wrap">
        <div role="tablist" style={{ display: "flex", background: BG, boxShadow: S3, borderRadius: "9999px", padding: "4px", margin: "24px 0", height: "52px" }}>
          {[
            { id: "ask", label: "💬 Ask About Plants" },
            { id: "visualise", label: "🪴 Room Visualiser" },
          ].map((tab) => (
            <button key={tab.id} role="tab" id={`tab-${tab.id}`} aria-selected={mode === tab.id} aria-controls={`panel-${tab.id}`}
              onClick={() => setMode(tab.id as "ask" | "visualise")}
              style={{ flex: 1, borderRadius: "9999px", border: "none", background: mode === tab.id ? G : "transparent", color: mode === tab.id ? WHITE : `rgba(28,28,28,0.6)`, fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "15px", cursor: "pointer", transition: "all 250ms", outline: "none" }}
              onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${G}`)}
              onBlur={(e) => (e.currentTarget.style.outline = "none")}
            >{tab.label}</button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════
          MAIN PANELS
      ════════════════════════════════ */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px 80px" }} className="ac-wrap">

        {/* ── MODE A: ASK ABOUT PLANTS ── */}
        {mode === "ask" && (
          <div className="two-panel" role="tabpanel" id="panel-ask" aria-labelledby="tab-ask">

            {/* LEFT: Input panel */}
            <div style={{ background: BG, boxShadow: S2, borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Saved Plants Dropdown */}
              {savedPlants && savedPlants.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", background: "rgba(0,181,102,0.05)", border: "1px solid rgba(0,181,102,0.2)", padding: "12px 14px", borderRadius: "16px" }}>
                  <label htmlFor="saved-plant-select" style={{ fontSize: "13px", fontWeight: 700, color: GDK, display: "flex", alignItems: "center", gap: "6px" }}>
                    🪴 Ask about one of your saved plants:
                  </label>
                  <select
                    id="saved-plant-select"
                    value={selectedPlantId}
                    onChange={(e) => {
                      const pId = e.target.value;
                      setSelectedPlantId(pId);
                      if (pId) {
                        const plant = savedPlants.find((sp: any) => String(sp.id) === pId);
                        if (plant) {
                          const plantName = plant.nickname || plant.plant_name || "My Plant";
                          const promptPrefix = `Regarding my plant "${plantName}" (${plant.location || "Indoor"}): `;
                          setInput((prev) => {
                            if (!prev || prev.startsWith("Regarding my plant")) {
                              return promptPrefix;
                            }
                            return `${promptPrefix}${prev}`;
                          });
                          inputRef.current?.focus();
                        }
                      }
                    }}
                    style={{
                      width: "100%",
                      height: "42px",
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: S3,
                      background: BG,
                      padding: "0 12px",
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: TEXT,
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="">-- Select from your saved plants ({savedPlants.length}) --</option>
                    {savedPlants.map((plant: any) => (
                      <option key={plant.id} value={plant.id}>
                        🌿 {plant.nickname || plant.plant_name} ({plant.location || "Indoor"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Upload zone */}
              {!attachmentName ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileUpload(f); }}
                  onClick={() => fileRef.current?.click()}
                  aria-label="Upload plant photo"
                  role="button" tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}
                  style={{ height: dragOver ? "240px" : "180px", border: `2px dashed ${dragOver ? G : `${G}60`}`, borderRadius: "20px", background: dragOver ? `${G}10` : `${G}06`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 200ms", transform: dragOver ? "scale(1.01)" : "scale(1)" }}
                >
                  <span style={{ fontSize: "40px", color: G, marginBottom: "10px" }}>📷</span>
                  <p style={{ fontWeight: 600, fontSize: "15px", color: TEXT, marginBottom: "4px" }}>Drop a photo here, or click to upload</p>
                  <p style={{ fontSize: "12px", color: "rgba(28,28,28,0.55)", marginBottom: "12px" }}>Plants · Soil · Seeds · Leaves · Pots</p>
                  <div style={{ height: "1px", background: "rgba(28,28,28,0.12)", width: "60%", marginBottom: "12px" }} />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                      style={{ boxShadow: S3, border: "none", borderRadius: "9999px", background: BG, color: TEXT, fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "13px", height: "38px", padding: "0 16px", cursor: "pointer" }}>
                      📷 Take Photo
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                      style={{ background: G, color: WHITE, border: "none", borderRadius: "9999px", fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "13px", height: "38px", padding: "0 16px", cursor: "pointer" }}>
                      🖼 Choose File
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ background: `${G}10`, border: S4, borderRadius: "12px", padding: "12px", display: "flex", alignItems: "center", gap: "12px", animation: "fadeSlideIn 250ms ease both" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "8px", background: `${G}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", flexShrink: 0 }}>🌿</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 500, fontSize: "13px", color: TEXT }}>{attachmentName}</p>
                    <p style={{ fontSize: "11px", color: "rgba(28,28,28,0.5)", marginTop: "2px" }}>Ready to attach</p>
                  </div>
                  <button onClick={() => { setAttachment(null); setAttachmentName(null); }}
                    style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "rgba(28,28,28,0.4)", padding: "4px" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#dc2626")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(28,28,28,0.4)")}
                  >✕</button>
                </div>
              )}
              <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />

              {/* Chat input */}
              <div style={{ position: "relative" }}>
                {attachmentName && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: `${G}15`, border: S4, borderRadius: "9999px", padding: "4px 12px", fontSize: "12px", color: TEXT, marginBottom: "6px" }}>
                    📎 {attachmentName}
                    <button onClick={() => { setAttachment(null); setAttachmentName(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "rgba(28,28,28,0.5)", padding: "0 2px" }}>✕</button>
                  </div>
                )}
                <div style={{ position: "relative" }}>
                  <textarea
                    ref={inputRef}
                    id="chat-input"
                    aria-label="Plant question"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask anything about your plant..."
                    rows={1}
                    style={{ width: "100%", minHeight: "56px", maxHeight: "120px", padding: "16px 52px 16px 16px", borderRadius: "9999px", border: "none", boxShadow: S3, background: BG, fontFamily: "Outfit, sans-serif", fontSize: "16px", color: TEXT, resize: "none", outline: "none", overflow: "hidden", lineHeight: "24px", transition: "box-shadow 200ms" }}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = S4)}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = S3)}
                  />
                  <button
                    aria-label="Send message"
                    aria-disabled={!input.trim() && !attachment}
                    onClick={handleSend}
                    disabled={sending}
                    style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", width: "40px", height: "40px", borderRadius: "50px", background: (!input.trim() && !attachment) ? `${G}50` : G, border: "none", cursor: (!input.trim() && !attachment) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: WHITE, transition: "background 200ms" }}
                  >
                    {sending ? <div style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: WHITE, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> : <SendIcon />}
                  </button>
                </div>
              </div>

              {/* Quick prompts */}
              <div>
                <p style={{ fontSize: "12px", fontWeight: 500, color: "rgba(28,28,28,0.55)", marginBottom: "8px" }}>Try asking:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                      style={{ boxShadow: S3, border: "none", borderRadius: "9999px", background: BG, color: TEXT, fontFamily: "Outfit, sans-serif", fontWeight: 500, fontSize: "12px", height: "32px", padding: "0 12px", cursor: "pointer", transition: "all 200ms", outline: "none" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${G}12`; (e.currentTarget as HTMLButtonElement).style.boxShadow = S4; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = BG; (e.currentTarget as HTMLButtonElement).style.boxShadow = S3; }}
                      onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${G}`)}
                      onBlur={(e) => (e.currentTarget.style.outline = "none")}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Conversation panel */}
            <div style={{ background: BG, boxShadow: S2, borderRadius: "24px", padding: "24px", minHeight: "500px", display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }} role="log" aria-live="polite" aria-atomic="false">
                {messages.length === 0 ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "32px 16px" }}>
                    <div style={{ width: "72px", height: "72px", borderRadius: "50px", background: G, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", marginBottom: "20px", animation: "sway 3s ease-in-out infinite" }}>🤖</div>
                    <h2 style={{ fontWeight: 600, fontSize: "17px", color: TEXT, marginBottom: "8px" }}>Hi! I&apos;m your AI Plant Care assistant.</h2>
                    <p style={{ fontSize: "14px", color: "rgba(28,28,28,0.65)", maxWidth: "320px", lineHeight: 1.6, marginBottom: "24px" }}>Ask me anything — or upload a photo to identify your plant and get personalised care tips.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: "320px" }}>
                      {["Why are my leaves turning yellow?", "Identify this plant →", "Best plants for low light?"].map((s) => (
                        <button key={s} onClick={() => sendMessage(s)}
                          style={{ boxShadow: S3, border: "none", borderRadius: "12px", background: BG, color: TEXT, fontFamily: "Outfit, sans-serif", fontWeight: 500, fontSize: "14px", padding: "12px 16px", cursor: "pointer", textAlign: "left", transition: "box-shadow 200ms" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.boxShadow = S4)}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.boxShadow = S3)}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} onAddToCart={handleAddToCart} />)}
                    {sending && <div style={{ marginBottom: "16px" }}><TypingDots /></div>}
                    <div ref={msgEndRef} />
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── MODE B: ROOM VISUALISER ── */}
        {mode === "visualise" && (
          <div className="two-panel" role="tabpanel" id="panel-visualise" aria-labelledby="tab-visualise">

            {/* LEFT: Plant sidebar */}
            <div style={{ background: BG, boxShadow: S2, borderRadius: "24px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Room photo upload */}
              {!roomPhoto ? (
                <div onClick={() => roomFileRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") roomFileRef.current?.click(); }}
                  style={{ border: `2px dashed ${G}60`, borderRadius: "16px", background: `${G}06`, padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", gap: "6px" }}>
                  <span style={{ fontSize: "32px" }}>🏠</span>
                  <p style={{ fontWeight: 600, fontSize: "14px", color: TEXT, textAlign: "center" }}>Upload your room or space photo</p>
                  <p style={{ fontSize: "12px", color: "rgba(28,28,28,0.5)", textAlign: "center" }}>Balcony · Living Room · Office · Garden</p>
                  <button onClick={(e) => { e.stopPropagation(); roomFileRef.current?.click(); }}
                    style={{ marginTop: "8px", background: G, color: WHITE, border: "none", borderRadius: "9999px", padding: "8px 20px", fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
                    🖼 Upload Photo
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "12px", alignItems: "center", background: `${G}08`, borderRadius: "12px", padding: "10px" }}>
                  <div style={{ width: "80px", height: "56px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, position: "relative" }}>
                    <img src={roomPhoto} alt="Room" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: "13px", color: TEXT }}>Your Space</p>
                    <button onClick={() => { setRoomPhoto(null); setCanvasPlants([]); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: G, textDecoration: "underline", fontFamily: "Outfit, sans-serif", padding: 0 }}>Change photo</button>
                  </div>
                </div>
              )}
              <input ref={roomFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleRoomUpload} />

              {/* Plant search */}
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "rgba(28,28,28,0.4)" }}>🔍</span>
                <input value={plantSearch} onChange={(e) => setPlantSearch(e.target.value)} placeholder="Search plants..."
                  style={{ width: "100%", height: "44px", paddingLeft: "38px", paddingRight: "12px", borderRadius: "9999px", border: "none", boxShadow: S3, background: BG, fontFamily: "Outfit, sans-serif", fontSize: "14px", color: TEXT, outline: "none" }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = S4)}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = S3)}
                />
              </div>

              {/* Category filter */}
              <div role="radiogroup" style={{ display: "flex", gap: "6px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "2px" }}>
                {CATEGORIES.map((cat) => (
                  <button key={cat} role="radio" aria-checked={activeCategory === cat} onClick={() => setActiveCategory(cat)}
                    style={{ flexShrink: 0, height: "32px", padding: "0 14px", borderRadius: "9999px", border: "none", background: activeCategory === cat ? G : BG, color: activeCategory === cat ? WHITE : TEXT, fontFamily: "Outfit, sans-serif", fontWeight: 500, fontSize: "12px", cursor: "pointer", boxShadow: activeCategory === cat ? S4 : S3, transition: "all 200ms", outline: "none" }}
                    onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${G}`)}
                    onBlur={(e) => (e.currentTarget.style.outline = "none")}
                  >{cat}</button>
                ))}
              </div>

              {/* Plant grid from API */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", maxHeight: "340px" }}>
                {filteredProducts.length === 0 ? (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "24px", color: "rgba(28,28,28,0.4)", fontSize: "13px" }}>
                    No plants found
                  </div>
                ) : filteredProducts.slice(0, 20).map((product: ApiProduct) => {
                  const img = product.images?.find((i: { is_primary?: boolean; url: string }) => i.is_primary)?.url || product.images?.[0]?.url;
                  const onCanvas = canvasPlants.some(cp => cp.productId === product.id);
                  return (
                    <div key={product.id} aria-label={`Add ${product.title} to your room`} aria-pressed={onCanvas}
                      style={{ background: BG, border: onCanvas ? `2px solid ${G}` : "none", boxShadow: onCanvas ? S4 : S2, borderRadius: "12px", padding: "10px", cursor: "pointer", transition: "all 200ms" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px rgba(0,181,102,0.15)`; (e.currentTarget as HTMLDivElement).style.transform = "scale(1.01)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = onCanvas ? S4 : S2; (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; }}
                    >
                      <div style={{ height: "100px", borderRadius: "8px", background: "#f0ece2", position: "relative", overflow: "hidden", marginBottom: "8px" }}>
                        {img ? (
                          <Image src={img} alt={product.title} fill sizes="120px" style={{ objectFit: "contain", padding: "4px" }} />
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "36px" }}>🪴</div>
                        )}
                      </div>
                      <p style={{ fontWeight: 600, fontSize: "13px", color: TEXT, marginBottom: "2px" }}>{product.title}</p>
                      <p style={{ fontSize: "11px", color: "rgba(28,28,28,0.55)", marginBottom: "8px" }}>₹{product.base_price}</p>
                      <button onClick={() => addPlantToCanvas(product)}
                        style={{ width: "100%", height: "32px", background: G, color: WHITE, border: "none", borderRadius: "9999px", fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "12px", cursor: "pointer", transition: "background 200ms" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = GDK)}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = G)}
                      >+ Add</button>
                    </div>
                  );
                })}
              </div>

              {/* Active plant controls */}
              {selPlant && (
                <div style={{ background: `${G}08`, border: S4, borderRadius: "16px", padding: "16px", animation: "fadeSlideIn 250ms ease both" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <span style={{ fontWeight: 600, fontSize: "14px", color: TEXT }}>🪴 {selPlant.name}</span>
                    <button onClick={() => removePlant(selPlant.id)}
                      style={{ background: "none", border: "none", fontSize: "12px", color: "rgba(28,28,28,0.5)", cursor: "pointer", fontFamily: "Outfit, sans-serif" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#dc2626")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(28,28,28,0.5)")}
                    >✕ Remove</button>
                  </div>

                  <p style={{ fontSize: "12px", fontWeight: 500, color: "rgba(28,28,28,0.55)", marginBottom: "7px" }}>Size</p>
                  <div role="radiogroup" style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
                    {[["XS", 40], ["S", 55], ["M", 70], ["L", 90], ["XL", 110]].map(([label, sc]) => (
                      <button key={label} role="radio" aria-checked={selPlant.scale === sc}
                        onClick={() => updateSelected({ scale: sc as number })}
                        style={{ flex: 1, height: "34px", borderRadius: "9999px", border: "none", background: selPlant.scale === sc ? G : BG, color: selPlant.scale === sc ? WHITE : TEXT, fontFamily: "Outfit, sans-serif", fontWeight: 500, fontSize: "11px", cursor: "pointer", boxShadow: selPlant.scale === sc ? S4 : S3, transition: "all 200ms", outline: "none" }}
                      >{label}</button>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <input type="range" min={20} max={130} step={5} value={selPlant.scale}
                      onChange={(e) => updateSelected({ scale: Number(e.target.value) })}
                      aria-label={`Plant size: ${selPlant.scale}%`}
                      style={{ flex: 1, accentColor: G, cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "12px", fontWeight: 600, color: G, minWidth: "36px", textAlign: "right" }}>{selPlant.scale}%</span>
                  </div>

                  <p style={{ fontSize: "12px", fontWeight: 500, color: "rgba(28,28,28,0.55)", marginBottom: "7px" }}>Pot</p>
                  <div role="radiogroup" style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
                    {POTS.map((p) => (
                      <div key={p.id} role="radio" aria-checked={selPlant.pot === p.id}
                        onClick={() => updateSelected({ pot: p.id })}
                        style={{ flex: 1, height: "52px", borderRadius: "10px", background: BG, boxShadow: selPlant.pot === p.id ? `${S4}, 0 0 0 2px ${G}` : S3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "18px", gap: "2px", transition: "all 200ms" }}
                      >
                        {p.emoji}
                        <span style={{ fontSize: "9px", color: TEXT }}>{p.name}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "6px" }}>
                    {[
                      { label: "↔ Flip", fn: () => updateSelected({ flipped: !selPlant.flipped }) },
                      { label: "⧉ Duplicate", fn: () => { const dup = { ...selPlant, id: `${selPlant.productId}-${Date.now()}`, x: selPlant.x + 5, y: selPlant.y + 3, zIndex: canvasPlants.length + 1 }; const next = [...canvasPlants, dup]; setCanvasPlants(next); pushHistory(next); } },
                      { label: "⬒ Back", fn: () => updateSelected({ zIndex: Math.max(0, selPlant.zIndex - 1) }) },
                    ].map(({ label, fn }) => (
                      <button key={label} onClick={fn}
                        style={{ flex: 1, height: "36px", borderRadius: "10px", border: "none", boxShadow: S3, background: BG, color: TEXT, fontFamily: "Outfit, sans-serif", fontWeight: 500, fontSize: "11px", cursor: "pointer", transition: "box-shadow 200ms", outline: "none" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.boxShadow = S4)}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.boxShadow = S3)}
                      >{label}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Canvas */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              <div style={{ background: "rgba(254,252,249,0.95)", backdropFilter: "blur(8px)", boxShadow: S2, borderRadius: "20px 20px 0 0", height: "52px", padding: "0 16px", display: "flex", alignItems: "center", gap: "4px" }}>
                {[
                  { label: "↩ Undo", fn: undo, disabled: historyIdx <= 0, aria: "Undo last action" },
                  { label: "↪ Redo", fn: redo, disabled: historyIdx >= historyStack.length - 1, aria: "Redo last action" },
                  { label: "🗑 Clear", fn: clearAll, disabled: canvasPlants.length === 0, aria: "Clear all plants" },
                ].map(({ label, fn, disabled, aria }) => (
                  <button key={label} onClick={fn} disabled={disabled} aria-label={aria}
                    style={{ height: "40px", padding: "0 14px", borderRadius: "10px", border: "none", background: "transparent", color: disabled ? "rgba(28,28,28,0.3)" : TEXT, fontFamily: "Outfit, sans-serif", fontWeight: 500, fontSize: "12px", cursor: disabled ? "not-allowed" : "pointer", transition: "background 200ms", outline: "none" }}
                    onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = `${G}12`; }}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
                    onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${G}`)}
                    onBlur={(e) => (e.currentTarget.style.outline = "none")}
                  >{label}</button>
                ))}
                <div style={{ flex: 1 }} />
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "rgba(28,28,28,0.6)", cursor: "pointer" }}>
                    <input type="checkbox" style={{ accentColor: G }} /> Show names
                  </label>
                </div>
              </div>

              <div ref={canvasRef}
                role="application" aria-label="Plant visualiser canvas"
                onClick={(e) => { if (e.target === canvasRef.current) setSelectedPlant(null); }}
                className="ac-canvas"
                style={{ position: "relative", background: roomPhoto ? "transparent" : "rgba(28,28,28,0.04)", borderRadius: "0 0 24px 24px", overflow: "hidden", boxShadow: S2, cursor: "default", backgroundImage: roomPhoto ? "none" : "radial-gradient(rgba(28,28,28,0.08) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>

                {roomPhoto && <img src={roomPhoto} alt="Room" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}

                {!roomPhoto && canvasPlants.length === 0 && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "32px" }}>
                    <div style={{ fontSize: "56px", color: `${G}60`, marginBottom: "16px" }}>📷</div>
                    <p style={{ fontWeight: 600, fontSize: "15px", color: "rgba(28,28,28,0.45)", marginBottom: "6px" }}>Upload a room photo to get started</p>
                    <p style={{ fontSize: "13px", color: "rgba(28,28,28,0.35)", maxWidth: "280px", lineHeight: 1.5, marginBottom: "20px" }}>Then drag plants from the sidebar onto your space</p>
                    <button onClick={() => roomFileRef.current?.click()}
                      style={{ background: G, color: WHITE, border: "none", borderRadius: "9999px", padding: "12px 24px", fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
                      Upload Room Photo
                    </button>
                  </div>
                )}

                {canvasPlants.map((cp) => {
                  const pot = POTS.find(p => p.id === cp.pot) || POTS[0];
                  const isSelected = selectedPlant === cp.id;
                  return (
                    <div key={cp.id}
                      onMouseDown={(e) => onMouseDown(e, cp.id)}
                      onTouchStart={(e) => onTouchStart(e, cp.id)}
                      style={{
                        position: "absolute",
                        left: `${cp.x}%`, top: `${cp.y}%`,
                        width: `${cp.scale * 1.2}px`, height: `${cp.scale * 1.5}px`,
                        transform: `translate(-50%, -50%) ${cp.flipped ? "scaleX(-1)" : ""}`,
                        zIndex: cp.zIndex,
                        cursor: "grab",
                        outline: isSelected ? `2px dashed ${G}` : "none",
                        boxShadow: isSelected ? `0 8px 32px rgba(0,181,102,0.2)` : "0 4px 16px rgba(28,28,28,0.12)",
                        borderRadius: "8px",
                        userSelect: "none",
                        transition: "outline 200ms, box-shadow 200ms",
                      }}
                    >
                      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: "40%", background: `radial-gradient(ellipse, ${pot.tint}, transparent 70%)`, borderRadius: "50% 50% 40% 40% / 30% 30% 70% 70%", pointerEvents: "none", zIndex: 2 }} />
                      {cp.img ? (
                        <Image src={cp.img} alt={cp.name} fill sizes={`${cp.scale * 1.2}px`} style={{ objectFit: "contain" }} />
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: `${cp.scale * 0.5}px` }}>🪴</div>
                      )}
                      {isSelected && [[`0%`,`0%`],[`100%`,`0%`],[`0%`,`100%`],[`100%`,`100%`]].map(([r, b], i) => (
                        <div key={i} style={{ position: "absolute", right: r === "100%" ? "-4px" : "auto", left: r === "0%" ? "-4px" : "auto", top: b === "0%" ? "-4px" : "auto", bottom: b === "100%" ? "-4px" : "auto", width: "8px", height: "8px", background: G, borderRadius: "2px", zIndex: 3 }} />
                      ))}
                    </div>
                  );
                })}

                <div style={{ position: "absolute", bottom: "16px", right: "16px", background: "rgba(254,252,249,0.95)", boxShadow: S3, borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" }}>
                  {[
                    { label: "+", fn: () => setZoom(z => Math.min(200, z + 10)) },
                    { label: `${zoom}%`, fn: () => setZoom(100), isLabel: true },
                    { label: "−", fn: () => setZoom(z => Math.max(50, z - 10)) },
                  ].map(({ label, fn, isLabel }) => (
                    <button key={label} onClick={fn}
                      style={{ width: "36px", height: "36px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "Outfit, sans-serif", fontWeight: isLabel ? 600 : 400, fontSize: isLabel ? "9px" : "18px", color: isLabel ? G : TEXT, borderBottom: label !== "−" ? S3 : "none", outline: "none" }}
                      aria-label={isLabel ? "Reset zoom" : label === "+" ? "Zoom in" : "Zoom out"}
                    >{label}</button>
                  ))}
                </div>

                {canvasPlants.length > 0 && (
                  <div aria-live="polite" style={{ position: "absolute", bottom: "16px", left: "16px", background: "rgba(28,28,28,0.7)", color: WHITE, borderRadius: "9999px", padding: "5px 14px", fontSize: "12px", fontWeight: 500 }}>
                    {canvasPlants.length} plant{canvasPlants.length !== 1 ? "s" : ""} added
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat FAB */}
      <button aria-label="Open live chat"
        style={{ position: "fixed", bottom: "28px", right: "28px", zIndex: 200, width: "52px", height: "52px", borderRadius: "50px", background: G, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", animation: "fabPulse 4s ease-in-out infinite", fontSize: "22px" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
      >💬</button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fabPulse { 0%,100%{box-shadow:0 0 0 0 rgba(0,181,102,0.4)} 50%{box-shadow:0 0 0 10px rgba(0,181,102,0)} }`}</style>
    </div>
  );
}
