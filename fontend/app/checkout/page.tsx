"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SharedNavbar from "@/components/Navbar";

/* ── Design Tokens ─────────────────────────────────────── */
const T = {
  bg: "#fefcf9",
  bgCard: "#FFFFFF",
  bgSection: "#f7f5f0",
  bgMuted: "#fbfaf7",
  green: "#00b566",
  greenMid: "#009952",
  greenPale: "rgba(0, 181, 102, 0.12)",
  greenLight: "rgba(0, 181, 102, 0.08)",
  heading: "#1c1c1c",
  body: "#333333",
  muted: "#7c7c7c",
  border: "rgba(0, 0, 0, 0.08)",
  borderGreen: "rgba(0, 181, 102, 0.16)",
  white: "#FFFFFF",
  red: "#dc2626",
  amber: "#d97706",
  blue: "#2563eb",
  shadow: "0 4px 20px rgba(0,0,0,0.04)",
  shadowHover: "0 8px 30px rgba(0, 181, 102, 0.08)",
  shadowBtn: "0 4px 14px rgba(0, 181, 102, 0.25)",
};

interface CheckoutItem {
  name: string;
  qty: number;
  price: number;
  options: string;
  img: string;
}

// Leaf Outline SVG for the Card visual
const PlantBystLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C12 2 4 5 4 13C4 17.4 7.6 21 12 21C16.4 21 20 17.4 20 13C20 5 12 2 12 2Z" fill="rgba(255,255,255,0.85)" />
    <path d="M12 21V10" stroke="rgba(0,181,102,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 15L8 11" stroke="rgba(0,181,102,0.6)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12 12L16 8" stroke="rgba(0,181,102,0.6)" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// Simulated QR Code SVG
const SimulatedQRCode = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ background: "white", padding: 8, borderRadius: 8, border: `1px solid ${T.border}` }}>
    <rect x="10" y="10" width="30" height="30" stroke="#1c1c1c" strokeWidth="4" fill="none" />
    <rect x="18" y="18" width="14" height="14" fill="#1c1c1c" />
    <rect x="80" y="10" width="30" height="30" stroke="#1c1c1c" strokeWidth="4" fill="none" />
    <rect x="88" y="18" width="14" height="14" fill="#1c1c1c" />
    <rect x="10" y="80" width="30" height="30" stroke="#1c1c1c" strokeWidth="4" fill="none" />
    <rect x="18" y="88" width="14" height="14" fill="#1c1c1c" />
    
    {/* Random QR code pixels */}
    <rect x="50" y="15" width="8" height="8" fill="#1c1c1c" />
    <rect x="62" y="25" width="8" height="8" fill="#1c1c1c" />
    <rect x="50" y="38" width="16" height="8" fill="#1c1c1c" />
    <rect x="55" y="55" width="8" height="16" fill="#1c1c1c" />
    <rect x="15" y="55" width="16" height="8" fill="#1c1c1c" />
    <rect x="80" y="55" width="24" height="8" fill="#1c1c1c" />
    <rect x="70" y="70" width="8" height="8" fill="#1c1c1c" />
    <rect x="50" y="80" width="16" height="16" fill="#1c1c1c" />
    <rect x="80" y="80" width="8" height="24" fill="#1c1c1c" />
    <rect x="95" y="95" width="16" height="8" fill="#1c1c1c" />
    <rect x="70" y="100" width="8" height="8" fill="#1c1c1c" />
  </svg>
);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"summary" | "payment" | "success">("summary");

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 1, label: "Home (Kolkata)", fullName: "Subhajit Ghosh", address: "12/A Park Street", city: "Kolkata", state: "West Bengal", zip: "700016", phone: "+91 98765 43210", email: "subhajit@email.com" },
    { id: 2, label: "Office (Bangalore)", fullName: "Subhajit Ghosh", address: "Tech Park Phase 2, Whitefield", city: "Bangalore", state: "Karnataka", zip: "560066", phone: "+91 98765 43210", email: "subhajit.work@email.com" },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState<number>(1);

  // Address Form States for Inline Add/Edit
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editAddressId, setEditAddressId] = useState<number | null>(null); // null means adding new
  const [addrLabel, setAddrLabel] = useState("");
  const [addrFullName, setAddrFullName] = useState("");
  const [addrEmail, setAddrEmail] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrAddress, setAddrAddress] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrZip, setAddrZip] = useState("");

  // Payment Selection Method
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking" | "emi" | "cod">("card");

  // 1. Card Form State
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [selectedSavedCard, setSelectedSavedCard] = useState<number | null>(null);

  // 2. UPI Form State
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState("");

  // 3. Net Banking State
  const [selectedBank, setSelectedBank] = useState("");

  // 4. EMI Form State
  const [selectedEmiBank, setSelectedEmiBank] = useState("");
  const [selectedEmiTenure, setSelectedEmiTenure] = useState("");

  // 5. COD Confirmation State
  const [codConfirmed, setCodConfirmed] = useState(false);

  // Mock Saved Cards
  const savedCards = [
    { id: 1, label: "Visa ending in 4820", number: "4532 7812 9012 4820", name: "Subhajit Ghosh", expiry: "12/29", type: "visa" },
    { id: 2, label: "Mastercard ending in 9851", number: "5412 8890 2314 9851", name: "Subhajit Ghosh", expiry: "06/28", type: "mastercard" },
  ];

  // List of major Net Banking banks
  const popularBanks = [
    { id: "sbi", name: "State Bank of India", short: "SBI" },
    { id: "hdfc", name: "HDFC Bank", short: "HDFC" },
    { id: "icici", name: "ICICI Bank", short: "ICICI" },
    { id: "axis", name: "Axis Bank", short: "Axis" },
  ];

  // List of EMI Banks
  const emiBanks = [
    { id: "hdfc-emi", name: "HDFC Bank Credit Card", rates: { 3: 12, 6: 13, 12: 14 } },
    { id: "icici-emi", name: "ICICI Bank Credit Card", rates: { 3: 11.5, 6: 12.5, 12: 13.5 } },
    { id: "sbi-emi", name: "SBI Credit Card", rates: { 3: 12.5, 6: 13, 12: 14.5 } },
    { id: "axis-emi", name: "Axis Bank Credit Card", rates: { 3: 12, 6: 13.5, 12: 14 } },
  ];

  // Items State (either single buyNow item or cart items)
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [isBuyNow, setIsBuyNow] = useState(false);

  useEffect(() => {
    const buyNowParam = searchParams.get("buyNow");
    if (buyNowParam === "true") {
      setIsBuyNow(true);
      setItems([
        {
          name: searchParams.get("name") || "Red Anthurium Plant",
          price: Number(searchParams.get("price")) || 25.00,
          qty: Number(searchParams.get("qty")) || 1,
          img: searchParams.get("img") || "/fern-small.png",
          options: `${searchParams.get("size") || "Medium"} size · ${searchParams.get("pot") || "Normal"} Pot`,
        }
      ]);
    } else {
      // Default checkout items (e.g. from local storage, or mock data)
      setItems([
        {
          name: "Monstera Deliciosa",
          qty: 1,
          price: 25.00,
          img: "/monstera.png",
          options: "Medium size · White Ceramic Pot",
        },
        {
          name: "Wildflower Seeds Mix",
          qty: 2,
          price: 18.00,
          img: "/cat-flowers.png",
          options: "Pack of 3 · Premium Blend",
        },
        {
          name: "Moisture Meter Pro",
          qty: 1,
          price: 15.00,
          img: "/product-spray.png",
          options: "Digital Probe · Battery Included",
        }
      ]);
    }
  }, [searchParams]);

  // Find active address details
  const activeAddress = savedAddresses.find(a => a.id === selectedAddressId) || savedAddresses[0];

  // Open forms helper
  const openAddAddress = () => {
    setEditAddressId(null);
    setAddrLabel("");
    setAddrFullName("");
    setAddrEmail("");
    setAddrPhone("");
    setAddrAddress("");
    setAddrCity("");
    setAddrState("");
    setAddrZip("");
    setShowAddressForm(true);
  };

  const openEditAddress = () => {
    if (!activeAddress) return;
    setEditAddressId(activeAddress.id);
    setAddrLabel(activeAddress.label);
    setAddrFullName(activeAddress.fullName);
    setAddrEmail(activeAddress.email);
    setAddrPhone(activeAddress.phone);
    setAddrAddress(activeAddress.address);
    setAddrCity(activeAddress.city);
    setAddrState(activeAddress.state);
    setAddrZip(activeAddress.zip);
    setShowAddressForm(true);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editAddressId !== null) {
      // Edit Address
      setSavedAddresses(prev => prev.map(a => a.id === editAddressId ? {
        id: editAddressId,
        label: addrLabel || a.label,
        fullName: addrFullName,
        email: addrEmail,
        phone: addrPhone,
        address: addrAddress,
        city: addrCity,
        state: addrState,
        zip: addrZip,
      } : a));
      setShowAddressForm(false);
    } else {
      // Add New Address
      const newId = Math.max(...savedAddresses.map(a => a.id), 0) + 1;
      const label = addrLabel || `Address ${newId}`;
      const newAddr = {
        id: newId,
        label,
        fullName: addrFullName,
        email: addrEmail,
        phone: addrPhone,
        address: addrAddress,
        city: addrCity,
        state: addrState,
        zip: addrZip,
      };
      setSavedAddresses(prev => [...prev, newAddr]);
      setSelectedAddressId(newId);
      setShowAddressForm(false);
    }
  };

  // Handle saved card selection
  const selectSavedCard = (cardId: number) => {
    const card = savedCards.find(c => c.id === cardId);
    if (card) {
      setSelectedSavedCard(cardId);
      setCardName(card.name);
      setCardNumber(card.number);
      setCardExpiry(card.expiry);
      setCardCvv("•••");
    }
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingFee = subtotal >= 50 || items.length === 0 ? 0 : 5.00;
  const taxAmount = subtotal * 0.08;
  const total = subtotal + shippingFee + taxAmount;
  const orderNumber = useRef("");

  const handleReviewConfirm = () => {
    if (!activeAddress) {
      alert("Please select or add a delivery address.");
      return;
    }
    setStep("payment");
  };

  // Submit payment form handler
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check validation based on selected payment method
    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        alert("Please fill out all Credit Card fields.");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId && !selectedUpiApp) {
        alert("Please enter a UPI ID or scan the QR Code.");
        return;
      }
    } else if (paymentMethod === "netbanking") {
      if (!selectedBank) {
        alert("Please select a bank for Net Banking.");
        return;
      }
    } else if (paymentMethod === "emi") {
      if (!selectedEmiBank || !selectedEmiTenure) {
        alert("Please select an EMI bank and installment tenure plan.");
        return;
      }
    } else if (paymentMethod === "cod") {
      if (!codConfirmed) {
        alert("Please confirm the Cash on Delivery terms by checking the box.");
        return;
      }
    }
    
    // Generate order number
    orderNumber.current = "#PB-" + Math.floor(1000 + Math.random() * 9000);
    setStep("success");
  };

  // Format Card Number (auto space)
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 16) val = val.substring(0, 16);
    let formatted = "";
    for (let i = 0; i < val.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += " ";
      formatted += val[i];
    }
    setCardNumber(formatted);
    setSelectedSavedCard(null); // clear saved card selection if manual typing occurs
  };

  // Format Expiry (auto slash)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.substring(0, 4);
    let formatted = "";
    if (val.length > 2) {
      formatted = val.substring(0, 2) + "/" + val.substring(2);
    } else {
      formatted = val;
    }
    setCardExpiry(formatted);
    setSelectedSavedCard(null);
  };

  // Helper to detect card brand based on number
  const getCardType = () => {
    const cleanNumber = cardNumber.replace(/\s+/g, "");
    if (cleanNumber.startsWith("4")) return "visa";
    if (cleanNumber.startsWith("5")) return "mastercard";
    const selected = savedCards.find(c => c.id === selectedSavedCard);
    if (selected) return selected.type;
    return "generic";
  };

  const cardType = getCardType();

  // Helper to calculate EMI options
  const calculateEMIInstallment = (ratePa: number, months: number) => {
    const r = (ratePa / 12) / 100;
    const emi = (total * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    return emi;
  };

  return (
    <div className="checkout-container fade-up">
      {/* CSS STYLING OVERRIDES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,400;1,700&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; }
        
        .checkout-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 24px;
          font-family: 'Outfit', sans-serif;
        }

        .fade-up {
          animation: fadeUp 0.45s ease-out both;
        }
        .scale-in {
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }

        /* Steps progress styling */
        .steps-header {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .step-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .step-circle.active {
          background: ${T.green};
          color: white;
          box-shadow: 0 4px 10px rgba(0, 181, 102, 0.25);
        }
        .step-circle.completed {
          background: ${T.greenPale};
          color: ${T.green};
        }
        .step-circle.inactive {
          background: rgba(0, 0, 0, 0.05);
          color: ${T.muted};
        }
        .step-label {
          font-size: 14px;
          font-weight: 600;
          transition: color 0.3s ease;
        }
        .step-label.active {
          color: ${T.heading};
        }
        .step-label.inactive {
          color: ${T.muted};
        }
        .step-divider {
          width: 36px;
          height: 2px;
          background: rgba(0, 0, 0, 0.05);
          transition: background 0.3s ease;
        }
        .step-divider.active {
          background: ${T.green};
        }

        /* Grid Layout */
        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }
          .summary-col {
            position: relative !important;
            top: 0 !important;
            width: 100% !important;
          }
        }

        /* Panel Card style */
        .panel-card {
          background: ${T.bgCard};
          border-radius: 20px;
          padding: 32px;
          border: 1px solid ${T.border};
          box-shadow: ${T.shadow};
        }

        .panel-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 20px;
          color: ${T.heading};
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Input Elements */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group.full-width {
          grid-column: span 2;
        }
        @media (max-width: 600px) {
          .form-group.full-width {
            grid-column: span 1;
          }
        }
        .input-label {
          font-size: 11px;
          font-weight: 600;
          color: ${T.muted};
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .edit-input {
          width: 100%;
          height: 44px;
          border-radius: 10px;
          border: 1.5px solid ${T.border};
          padding: 0 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          color: ${T.heading};
          background: ${T.bgMuted};
          outline: none;
          transition: all 0.2s ease;
        }
        .edit-input:focus {
          border-color: ${T.green};
          background: ${T.white};
          box-shadow: 0 0 0 3px ${T.greenLight};
        }

        /* Dropdown styling */
        .address-select {
          padding: 8px 16px;
          border-radius: 10px;
          border: 1.5px solid ${T.border};
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: ${T.heading};
          background: ${T.white};
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .address-select:focus {
          border-color: ${T.green};
        }

        /* Payment Tabs Grid */
        .payment-methods-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 10px;
          margin-bottom: 28px;
        }
        .payment-method-tab {
          background: ${T.bgMuted};
          border: 1.5px solid ${T.border};
          padding: 12px 10px;
          border-radius: 12px;
          text-align: center;
          font-weight: 600;
          font-size: 13px;
          color: ${T.body};
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          outline: none;
        }
        .payment-method-tab:hover {
          background: rgba(0, 0, 0, 0.02);
          border-color: ${T.heading};
        }
        .payment-method-tab.active {
          border-color: ${T.green};
          background: ${T.greenLight};
          color: ${T.greenMid};
          box-shadow: 0 4px 12px rgba(0, 181, 102, 0.08);
        }
        .payment-method-tab-icon {
          font-size: 20px;
        }

        /* Popular Banks selection */
        .bank-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }
        @media (max-width: 500px) {
          .bank-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .bank-item {
          background: ${T.white};
          border: 1.5px solid ${T.border};
          border-radius: 10px;
          padding: 14px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          color: ${T.heading};
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .bank-item:hover {
          border-color: ${T.heading};
        }
        .bank-item.active {
          border-color: ${T.green};
          background: ${T.greenLight};
          color: ${T.greenMid};
        }

        /* Buttons */
        .green-btn {
          background: ${T.green};
          color: ${T.white};
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 15px;
          height: 48px;
          padding: 0 28px;
          border-radius: 99px;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: ${T.shadowBtn};
        }
        .green-btn:hover {
          background: ${T.greenMid};
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(0, 181, 102, 0.3);
        }
        .green-btn:active {
          transform: translateY(0);
        }

        .outline-btn {
          background: transparent;
          color: ${T.body};
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 15px;
          height: 48px;
          padding: 0 24px;
          border-radius: 99px;
          border: 1.5px solid ${T.border};
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .outline-btn:hover {
          border-color: ${T.heading};
          background: rgba(0, 0, 0, 0.02);
        }

        /* Credit card live visual */
        .live-card-container {
          perspective: 1000px;
          margin-bottom: 28px;
        }
        .live-credit-card {
          width: 100%;
          max-width: 340px;
          height: 200px;
          border-radius: 18px;
          padding: 24px;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          user-select: none;
        }
        .live-credit-card::before {
          content: "";
          position: absolute;
          top: -50%; left: -20%;
          width: 140%; height: 140%;
          background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        /* Theme colors for credit card graphics */
        .card-bg-visa {
          background: linear-gradient(135deg, #00b566 0%, #006b3c 100%);
        }
        .card-bg-mastercard {
          background: linear-gradient(135deg, #1f3657 0%, #0b172a 100%);
        }
        .card-bg-generic {
          background: linear-gradient(135deg, #2b3a4a 0%, #171d24 100%);
        }

        .card-chip {
          width: 44px;
          height: 32px;
          background: linear-gradient(135deg, #fce074 0%, #cfa62b 100%);
          border-radius: 6px;
          position: relative;
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.1);
        }
        .card-chip::after {
          content: "";
          position: absolute;
          top: 4px; left: 8px; right: 8px; bottom: 4px;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 3px;
        }

        .card-number {
          font-size: 19px;
          font-weight: 600;
          letter-spacing: 3.5px;
          word-spacing: 2px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
          margin-top: 20px;
          font-family: monospace;
        }

        .card-holder {
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 1.5px;
          font-weight: 500;
          opacity: 0.85;
          text-shadow: 1px 1px 1px rgba(0,0,0,0.2);
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-expiry {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          text-shadow: 1px 1px 1px rgba(0,0,0,0.2);
        }

        /* Review Details Layout */
        .review-row {
          display: grid;
          grid-template-columns: 100px 1fr;
          padding: 12px 0;
          border-bottom: 1px dashed rgba(0,0,0,0.06);
          font-size: 14px;
        }
        .review-row:last-child {
          border-bottom: none;
        }
        .review-label {
          font-weight: 600;
          color: ${T.muted};
        }
        .review-value {
          color: ${T.heading};
          font-weight: 500;
        }

        .saved-cards-list {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 24px;
          padding: 16px;
          background: ${T.bgSection};
          border-radius: 14px;
          border: 1px solid ${T.border};
        }

        .saved-card-option {
          background: ${T.white};
          border: 1.5px solid ${T.border};
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 13.5px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .saved-card-option.active {
          border-color: ${T.green};
          background: ${T.greenLight};
          color: ${T.greenMid};
          box-shadow: 0 4px 10px rgba(0,181,102,0.08);
        }

        /* EMI Table */
        .emi-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 14px;
          font-size: 13.5px;
        }
        .emi-table th {
          text-align: left;
          padding: 10px;
          font-weight: 600;
          color: ${T.muted};
          border-bottom: 1.5px solid ${T.border};
        }
        .emi-table td {
          padding: 12px 10px;
          border-bottom: 1px solid ${T.border};
          color: ${T.heading};
        }
        .emi-row {
          cursor: pointer;
          transition: background 0.15s;
        }
        .emi-row:hover {
          background: ${T.bgMuted};
        }
        .emi-row.active {
          background: ${T.greenLight};
        }

        @media (max-width: 600px) {
          .checkout-container {
            padding: 24px 16px !important;
          }
          .panel-card {
            padding: 20px !important;
          }
        }
        @media (max-width: 500px) {
          .steps-header {
            gap: 8px !important;
            margin-bottom: 24px !important;
          }
          .step-label {
            font-size: 11px !important;
          }
          .step-divider {
            width: 20px !important;
          }
        }
      `}</style>

      {/* Checkout Steps Header */}
      <div className="steps-header">
        {/* Step 1: Summary */}
        <div className="step-item">
          <span className={`step-circle ${
            step === "summary" ? "active" : "completed"
          }`}>
            {step !== "summary" ? "✓" : "1"}
          </span>
          <span className={`step-label ${step === "summary" ? "active" : "inactive"}`}>Order Review</span>
        </div>
        <div className={`step-divider ${
          step !== "summary" ? "active" : ""
        }`} />

        {/* Step 2: Payment */}
        <div className="step-item">
          <span className={`step-circle ${
            step === "payment" ? "active" : (step === "success" ? "completed" : "inactive")
          }`}>
            {step === "success" ? "✓" : "2"}
          </span>
          <span className={`step-label ${step === "payment" ? "active" : "inactive"}`}>Payment</span>
        </div>
        <div className={`step-divider ${
          step === "success" ? "active" : ""
        }`} />

        {/* Step 3: Confirmation */}
        <div className="step-item">
          <span className={`step-circle ${
            step === "success" ? "active" : "inactive"
          }`}>
            3
          </span>
          <span className={`step-label ${step === "success" ? "active" : "inactive"}`}>Confirmation</span>
        </div>
      </div>

      {step !== "success" ? (
        <div className="checkout-layout">
          {/* Left Side: Review & Forms */}
          <div style={{ minWidth: 0 }}>
            {/* STEP 1: ORDER REVIEW */}
            {step === "summary" && (
              <div className="panel-card scale-in">
                <h2 className="panel-title">
                  📋 Review Your Order Details
                </h2>

                <div style={{ marginBottom: "28px" }}>
                  {/* Delivery Address Header + Dropdown selection */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: T.heading, margin: 0 }}>Delivery Address</h3>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {/* Saved addresses selector */}
                      <select 
                        className="address-select"
                        value={selectedAddressId}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === "new") {
                            openAddAddress();
                          } else {
                            setSelectedAddressId(Number(val));
                            setShowAddressForm(false);
                          }
                        }}
                      >
                        {savedAddresses.map(addr => (
                          <option key={addr.id} value={addr.id}>{addr.label}</option>
                        ))}
                        <option value="new">+ Add New Address...</option>
                      </select>

                      <button 
                        type="button" 
                        onClick={openAddAddress}
                        style={{
                          background: T.greenLight,
                          border: "none",
                          borderRadius: "8px",
                          color: T.greenMid,
                          padding: "6px 12px",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.15s ease"
                        }}
                      >
                        + Add New
                      </button>
                    </div>
                  </div>

                  {showAddressForm ? (
                    /* Inline Address Form for Adding or Editing Address */
                    <form onSubmit={handleAddressSubmit} className="scale-in" style={{ background: T.bgMuted, borderRadius: "12px", border: `1.5px dashed ${T.green}`, padding: "20px", marginBottom: "20px" }}>
                      <h4 style={{ fontSize: "14px", fontWeight: 700, color: T.heading, marginBottom: "14px", marginTop: 0 }}>
                        {editAddressId !== null ? "✏️ Edit Selected Address" : "➕ Add New Address"}
                      </h4>
                      <div className="form-grid" style={{ marginBottom: "16px" }}>
                        <div className="form-group" style={{ gridColumn: "span 2" }}>
                          <label className="input-label">Address Label (e.g. Home, Office)</label>
                          <input className="edit-input" value={addrLabel} onChange={e => setAddrLabel(e.target.value)} placeholder="e.g. My Apartment" required />
                        </div>
                        <div className="form-group">
                          <label className="input-label">Full Name</label>
                          <input className="edit-input" value={addrFullName} onChange={e => setAddrFullName(e.target.value)} required placeholder="e.g. Subhajit Ghosh" />
                        </div>
                        <div className="form-group">
                          <label className="input-label">Email Address</label>
                          <input className="edit-input" type="email" value={addrEmail} onChange={e => setAddrEmail(e.target.value)} required placeholder="e.g. subhajit@email.com" />
                        </div>
                        <div className="form-group">
                          <label className="input-label">Phone Number</label>
                          <input className="edit-input" value={addrPhone} onChange={e => setAddrPhone(e.target.value)} required placeholder="e.g. +91 98765 43210" />
                        </div>
                        <div className="form-group">
                          <label className="input-label">Address Line 1</label>
                          <input className="edit-input" value={addrAddress} onChange={e => setAddrAddress(e.target.value)} required placeholder="e.g. 12/A Park Street" />
                        </div>
                        <div className="form-group">
                          <label className="input-label">City</label>
                          <input className="edit-input" value={addrCity} onChange={e => setAddrCity(e.target.value)} required placeholder="e.g. Kolkata" />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div className="form-group">
                            <label className="input-label">State</label>
                            <input className="edit-input" value={addrState} onChange={e => setAddrState(e.target.value)} required placeholder="e.g. West Bengal" />
                          </div>
                          <div className="form-group">
                            <label className="input-label">ZIP Code</label>
                            <input className="edit-input" value={addrZip} onChange={e => setAddrZip(e.target.value)} required placeholder="e.g. 700016" />
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <button type="button" className="outline-btn" style={{ height: "38px", padding: "0 18px", fontSize: "13px" }} onClick={() => setShowAddressForm(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="green-btn" style={{ height: "38px", padding: "0 22px", fontSize: "13px" }}>
                          Save Address
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Selected Address Detail View */
                    <div className="scale-in" style={{ background: T.bgMuted, borderRadius: "12px", border: `1px solid ${T.border}`, padding: "18px", marginBottom: "20px" }}>
                      {activeAddress ? (
                        <>
                          <div className="review-row">
                            <span className="review-label">Deliver To:</span>
                            <span className="review-value" style={{ fontWeight: 600 }}>{activeAddress.fullName}</span>
                          </div>
                          <div className="review-row">
                            <span className="review-label">Address:</span>
                            <span className="review-value">{activeAddress.address}, {activeAddress.city}, {activeAddress.state} - {activeAddress.zip}</span>
                          </div>
                          <div className="review-row">
                            <span className="review-label">Contact:</span>
                            <span className="review-value">{activeAddress.phone} · {activeAddress.email}</span>
                          </div>
                          
                          <div style={{ marginTop: "14px", display: "flex", justifyContent: "flex-end" }}>
                            <button type="button" onClick={openEditAddress} style={{ background: "transparent", border: "none", color: T.green, fontWeight: 600, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                              ✏️ Edit Selected Address
                            </button>
                          </div>
                        </>
                      ) : (
                        <p style={{ margin: 0, fontSize: "14px", color: T.muted }}>No address selected. Please click "+ Add New" to add a shipping address.</p>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: "28px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: T.heading, marginBottom: "12px" }}>Products / Items</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {items.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "center", background: T.bgMuted, borderRadius: "12px", border: `1px solid ${T.border}`, padding: "12px 16px" }}>
                        <div style={{ width: "52px", height: "52px", borderRadius: "8px", overflow: "hidden", background: T.white, border: `1px solid ${T.border}`, flexShrink: 0 }}>
                          <img src={item.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "14px", fontWeight: 700, color: T.heading, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.name}
                          </p>
                          <p style={{ fontSize: "12px", color: T.muted, margin: "2px 0 0" }}>
                            {item.options}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "13px", fontWeight: 500, color: T.muted, display: "block" }}>
                            Qty {item.qty}
                          </span>
                          <span style={{ fontSize: "14px", fontWeight: 700, color: T.heading }}>
                            ${(item.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", marginTop: "32px", justifyContent: "flex-end" }}>
                  <button type="button" className="green-btn" onClick={handleReviewConfirm}>
                    Proceed to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PAYMENT SECTION */}
            {step === "payment" && (
              <div className="panel-card scale-in">
                <h2 className="panel-title">
                  💳 Select Payment Method
                </h2>

                {/* Vertical/Horizontal Payment Method Tabs */}
                <div className="payment-methods-grid">
                  <button type="button" className={`payment-method-tab ${paymentMethod === "card" ? "active" : ""}`} onClick={() => setPaymentMethod("card")}>
                    <span className="payment-method-tab-icon">💳</span>
                    <span>Card Payment</span>
                  </button>
                  <button type="button" className={`payment-method-tab ${paymentMethod === "upi" ? "active" : ""}`} onClick={() => setPaymentMethod("upi")}>
                    <span className="payment-method-tab-icon">📱</span>
                    <span>UPI / QR</span>
                  </button>
                  <button type="button" className={`payment-method-tab ${paymentMethod === "netbanking" ? "active" : ""}`} onClick={() => setPaymentMethod("netbanking")}>
                    <span className="payment-method-tab-icon">🏦</span>
                    <span>Net Banking</span>
                  </button>
                  <button type="button" className={`payment-method-tab ${paymentMethod === "emi" ? "active" : ""}`} onClick={() => setPaymentMethod("emi")}>
                    <span className="payment-method-tab-icon">📅</span>
                    <span>EMI Plans</span>
                  </button>
                  <button type="button" className={`payment-method-tab ${paymentMethod === "cod" ? "active" : ""}`} onClick={() => setPaymentMethod("cod")}>
                    <span className="payment-method-tab-icon">💵</span>
                    <span>COD</span>
                  </button>
                </div>

                <form onSubmit={handlePaymentSubmit}>
                  {/* TAB 1: CREDIT / DEBIT CARD */}
                  {paymentMethod === "card" && (
                    <div className="scale-in">
                      {/* Live Card Graphic Visual */}
                      <div className="live-card-container">
                        <div className={`live-credit-card card-bg-${cardType}`}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div className="card-chip" />
                            <PlantBystLogo />
                          </div>
                          
                          <div className="card-number">
                            {cardNumber || "•••• •••• •••• ••••"}
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                            <div className="card-holder">
                              <span style={{ fontSize: "8px", display: "block", opacity: 0.7, marginBottom: "2px" }}>CARDHOLDER</span>
                              {cardName || "NAME ON CARD"}
                            </div>
                            <div className="card-expiry">
                              <span style={{ fontSize: "8px", display: "block", opacity: 0.7, marginBottom: "2px", textAlign: "right" }}>EXPIRES</span>
                              {cardExpiry || "MM/YY"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Saved Card Selector Option */}
                      <div style={{ marginBottom: "20px" }}>
                        <p className="input-label" style={{ marginBottom: "8px" }}>Select a Saved Card</p>
                        <div className="saved-cards-list">
                          {savedCards.map(card => (
                            <button key={card.id} type="button" className={`saved-card-option ${selectedSavedCard === card.id ? "active" : ""}`} onClick={() => selectSavedCard(card.id)}>
                              💳 {card.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="form-grid">
                        <div className="form-group full-width">
                          <label className="input-label">Cardholder Name</label>
                          <input className="edit-input" value={cardName} onChange={e => setCardName(e.target.value)} required={paymentMethod === "card"} placeholder="FULL NAME ON CARD" style={{ textTransform: "uppercase" }} />
                        </div>
                        <div className="form-group full-width">
                          <label className="input-label">Card Number</label>
                          <input className="edit-input" value={cardNumber} onChange={handleNumberChange} required={paymentMethod === "card"} placeholder="4111 2222 3333 4444" />
                        </div>
                        <div className="form-group">
                          <label className="input-label">Expiry Date</label>
                          <input className="edit-input" value={cardExpiry} onChange={handleExpiryChange} required={paymentMethod === "card"} placeholder="MM/YY" />
                        </div>
                        <div className="form-group">
                          <label className="input-label">CVV</label>
                          <input className="edit-input" type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").substring(0,3))} required={paymentMethod === "card"} placeholder="•••" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: UPI / QR PAYMENT */}
                  {paymentMethod === "upi" && (
                    <div className="scale-in">
                      <div style={{ display: "flex", gap: "28px", alignItems: "center", flexWrap: "wrap", justifyContent: "center", marginBottom: "24px" }}>
                        {/* Simulated QR Code Scan */}
                        <div style={{ textAlign: "center" }}>
                          <SimulatedQRCode />
                          <p style={{ fontSize: "11px", color: T.muted, marginTop: "8px", fontWeight: 600 }}>Scan with GPay, Paytm, or PhonePe</p>
                        </div>

                        <div style={{ flex: 1, minWidth: "240px" }}>
                          <h3 style={{ fontSize: "14px", fontWeight: 700, color: T.heading, margin: "0 0 10px" }}>Simulate UPI Payment</h3>
                          <p style={{ fontSize: "13px", color: T.body, margin: "0 0 16px", lineHeight: "1.4" }}>
                            Scan the QR code to make an instant payment of <strong>${total.toFixed(2)}</strong>, or enter your UPI ID below to receive a payment request.
                          </p>

                          <div className="form-group" style={{ marginBottom: "14px" }}>
                            <label className="input-label">Enter UPI ID</label>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <input className="edit-input" value={upiId} onChange={e => { setUpiId(e.target.value); setSelectedUpiApp(""); }} placeholder="e.g. username@upi" required={paymentMethod === "upi" && !selectedUpiApp} />
                            </div>
                          </div>

                          {/* Quick UPI App buttons */}
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {["GPay (@okaxis)", "PhonePe (@ybl)", "Paytm (@paytm)"].map(app => (
                              <button key={app} type="button" className={`saved-card-option ${selectedUpiApp === app ? "active" : ""}`} onClick={() => {
                                setSelectedUpiApp(app);
                                const suffix = app.split(" ").pop()?.replace(/[()]/g, "") || "";
                                setUpiId(`subhajit${suffix}`);
                              }} style={{ padding: "8px 12px", fontSize: "12px" }}>
                                {app.split(" ")[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: NET BANKING */}
                  {paymentMethod === "netbanking" && (
                    <div className="scale-in">
                      <p className="input-label" style={{ marginBottom: "12px" }}>Select a Popular Bank</p>
                      
                      <div className="bank-grid">
                        {popularBanks.map(bank => (
                          <button key={bank.id} type="button" className={`bank-item ${selectedBank === bank.name ? "active" : ""}`} onClick={() => setSelectedBank(bank.name)}>
                            {bank.short}
                          </button>
                        ))}
                      </div>

                      <div className="form-group" style={{ marginTop: "16px" }}>
                        <label className="input-label">Or Select Other Bank</label>
                        <select className="address-select" value={selectedBank} onChange={e => setSelectedBank(e.target.value)} required={paymentMethod === "netbanking"} style={{ width: "100%", height: "44px" }}>
                          <option value="">-- Choose a Bank --</option>
                          <option value="State Bank of India">State Bank of India</option>
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                          <option value="Punjab National Bank">Punjab National Bank</option>
                          <option value="Bank of Baroda">Bank of Baroda</option>
                          <option value="Yes Bank">Yes Bank</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: EMI PAYMENT */}
                  {paymentMethod === "emi" && (
                    <div className="scale-in">
                      <div className="form-group" style={{ marginBottom: "16px" }}>
                        <label className="input-label">Select Credit Card Bank for EMI</label>
                        <select className="address-select" value={selectedEmiBank} onChange={e => { setSelectedEmiBank(e.target.value); setSelectedEmiTenure(""); }} required={paymentMethod === "emi"} style={{ width: "100%", height: "44px" }}>
                          <option value="">-- Select Bank --</option>
                          {emiBanks.map(eb => (
                            <option key={eb.id} value={eb.id}>{eb.name}</option>
                          ))}
                        </select>
                      </div>

                      {selectedEmiBank && (
                        <div className="scale-in">
                          <p className="input-label" style={{ marginBottom: "8px" }}>Select EMI Plan</p>
                          <div style={{ border: `1px solid ${T.border}`, borderRadius: "12px", overflow: "hidden" }}>
                            <table className="emi-table">
                              <thead>
                                <tr>
                                  <th>Plan</th>
                                  <th>Rate</th>
                                  <th>Monthly Installment</th>
                                  <th>Total Cost</th>
                                </tr>
                              </thead>
                              <tbody>
                                {[3, 6, 12].map(months => {
                                  const eb = emiBanks.find(b => b.id === selectedEmiBank);
                                  const rate = eb ? (eb.rates as Record<number, number>)[months] || 12 : 12;
                                  const monthly = calculateEMIInstallment(rate, months);
                                  const emiTotal = monthly * months;
                                  const planId = `${months}-month`;
                                  return (
                                    <tr key={months} className={`emi-row ${selectedEmiTenure === planId ? "active" : ""}`} onClick={() => setSelectedEmiTenure(planId)}>
                                      <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                          <input type="radio" checked={selectedEmiTenure === planId} onChange={() => setSelectedEmiTenure(planId)} style={{ cursor: "pointer" }} />
                                          <strong>{months} Months</strong>
                                        </div>
                                      </td>
                                      <td>{rate}% p.a.</td>
                                      <td style={{ fontWeight: 700, color: T.greenMid }}>${monthly.toFixed(2)} / mo</td>
                                      <td style={{ fontWeight: 600 }}>${emiTotal.toFixed(2)}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          <p style={{ fontSize: "11px", color: T.muted, marginTop: "10px", lineHeight: "1.4" }}>
                            * Note: Interest is calculated using reducing balance. Your credit limit will be blocked for the total invoice amount.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 5: CASH ON DELIVERY */}
                  {paymentMethod === "cod" && (
                    <div className="scale-in" style={{ background: T.bgSection, borderRadius: "14px", border: `1px solid ${T.border}`, padding: "20px" }}>
                      <h3 style={{ fontSize: "14px", fontWeight: 700, color: T.heading, margin: "0 0 8px" }}>📦 Cash on Delivery (COD) Guidelines</h3>
                      <p style={{ fontSize: "13.5px", color: T.body, margin: "0 0 16px", lineHeight: "1.5" }}>
                        Pay with cash or scan a delivery agent's UPI code at the time of delivery. 
                        Please ensure you have exact change of <strong>${total.toFixed(2)}</strong> ready to avoid delays.
                      </p>

                      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginTop: "12px" }}>
                        <input type="checkbox" id="cod-confirm-checkbox" checked={codConfirmed} onChange={e => setCodConfirmed(e.target.checked)} required={paymentMethod === "cod"} style={{ marginTop: "4px", cursor: "pointer" }} />
                        <label htmlFor="cod-confirm-checkbox" style={{ fontSize: "13px", color: T.body, cursor: "pointer", fontWeight: 500, userSelect: "none" }}>
                          I confirm that I will pay <strong>${total.toFixed(2)}</strong> in cash or UPI upon delivery at the registered shipping address.
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div style={{ display: "flex", gap: "12px", marginTop: "32px", justifyContent: "space-between" }}>
                    <button type="button" className="outline-btn" onClick={() => setStep("summary")}>
                      ← Back to Review
                    </button>
                    <button type="submit" className="green-btn">
                      Place Order (${total.toFixed(2)})
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Side: Order Summary Card */}
          <div className="summary-col" style={{ position: "sticky", top: "84px" }}>
            <div className="panel-card" style={{ padding: "24px" }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: T.heading, marginBottom: 18, borderBottom: `1px solid ${T.border}`, paddingBottom: "12px" }}>
                Order Summary
              </h3>

              {/* Items listing */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", background: T.bgMuted, border: `1px solid ${T.border}`, flexShrink: 0 }}>
                      <img src={item.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: T.heading, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.name}
                      </p>
                      <p style={{ fontSize: 11, color: T.muted, margin: "1px 0 0" }}>
                        Qty {item.qty} · {item.options}
                      </p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.heading }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subtotal metrics */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "14px 0", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.body }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 500 }}>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.body }}>
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? <span style={{ color: T.green, fontWeight: 600 }}>Free</span> : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.body }}>
                  <span>Tax (8%)</span>
                  <span style={{ fontWeight: 500 }}>${taxAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Final price */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: T.muted }}>Total Amount</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: T.heading }}>${total.toFixed(2)}</span>
              </div>

              {shippingFee > 0 && (
                <div style={{ marginTop: "14px", background: "rgba(0,181,102,0.06)", border: `1px dashed ${T.green}`, borderRadius: "8px", padding: "10px", fontSize: "11px", color: T.greenMid, textAlign: "center", fontWeight: 500 }}>
                  💡 Add ${(50.00 - subtotal).toFixed(2)} more for Free Shipping!
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* STEP 3: SUCCESS / CONFIRMATION */
        <div className="scale-in" style={{ background: T.bgCard, borderRadius: 24, border: `1px solid ${T.border}`, padding: "48px 32px", textAlign: "center", boxShadow: T.shadow, maxWidth: 580, margin: "20px auto 0" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.greenLight, color: T.green, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28, fontWeight: "bold" }}>
            ✓
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 26, color: T.heading, marginBottom: 8 }}>
            Order Placed Successfully!
          </h1>
          <p style={{ fontSize: 14, color: T.muted, marginBottom: 20 }}>
            Order ID: <strong style={{ color: T.heading }}>{orderNumber.current}</strong>
          </p>

          <div style={{ background: T.bgSection, borderRadius: 16, border: `1px solid ${T.border}`, padding: "20px", textAlign: "left", marginBottom: 28 }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: T.heading, marginBottom: "12px", borderBottom: `1px solid ${T.border}`, paddingBottom: "6px" }}>
              Delivery Details
            </h3>
            {activeAddress && (
              <>
                <p style={{ fontSize: "13px", color: T.body, margin: "0 0 6px" }}>
                  <strong>Deliver To:</strong> {activeAddress.fullName}
                </p>
                <p style={{ fontSize: "13px", color: T.body, margin: "0 0 6px" }}>
                  <strong>Address:</strong> {activeAddress.address}, {activeAddress.city}, {activeAddress.state} - {activeAddress.zip}
                </p>
                <p style={{ fontSize: "13px", color: T.body, margin: "0 0 12px" }}>
                  <strong>Contact:</strong> {activeAddress.phone} · {activeAddress.email}
                </p>
              </>
            )}

            <h3 style={{ fontSize: "14px", fontWeight: 700, color: T.heading, marginBottom: "12px", borderBottom: `1px solid ${T.border}`, paddingBottom: "6px" }}>
              Items Purchased
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {items.map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: T.body }}>
                  <span>{item.name} <span style={{ color: T.muted }}>x{item.qty}</span></span>
                  <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: T.heading, fontWeight: 700, marginTop: "12px", borderTop: `1px solid ${T.border}`, paddingTop: "10px" }}>
              <span>Total Paid:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <p style={{ fontSize: "12px", color: T.greenMid, fontWeight: 700, marginTop: "14px", borderTop: `1px dashed ${T.border}`, paddingTop: "12px", textAlign: "center" }}>
              {paymentMethod === "card" && `💳 Paid via Credit Card (ending in ${cardNumber.replace(/\s+/g, "").slice(-4) || "4820"})`}
              {paymentMethod === "upi" && `📱 Paid via UPI (ID: ${upiId || "Scan & Pay QR"})`}
              {paymentMethod === "netbanking" && `🏦 Paid via Net Banking (${selectedBank})`}
              {paymentMethod === "emi" && `📅 Paid via Credit Card EMI (${emiBanks.find(b => b.id === selectedEmiBank)?.name || "Credit Card"} - ${selectedEmiTenure.replace("-", " ")})`}
              {paymentMethod === "cod" && `💵 Payable via Cash on Delivery (COD) at drop-off`}
            </p>
          </div>

          <p style={{ fontSize: 14, color: T.body, maxWidth: 400, margin: "0 auto 28px", lineHeight: 1.5 }}>
            Thank you for shopping at <strong>PlantByst</strong>! We've sent a detailed confirmation invoice email to <strong>{activeAddress?.email || "your email"}</strong>.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/profile" className="green-btn">
              Go To My Garden
            </Link>
            <Link href="/" className="outline-btn">
              Back To Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Outfit, sans-serif", paddingTop: "64px" }}>
      <SharedNavbar />
      <Suspense fallback={
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <p style={{ fontSize: "16px", color: T.muted }}>Loading checkout...</p>
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
