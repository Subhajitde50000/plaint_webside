"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ─── tokens ─────────────────────────────────────────────────────────────── */
const T = {
  bg: "#0f1117", card: "#1c2128", elevated: "#22272e", overlay: "#2d333b",
  text: "#cdd9e5", muted: "#768390", label: "#adbac7",
  border: "#444c56", borderMuted: "rgba(68,76,86,0.5)", borderActive: "#00b566",
  accent: "#00b566", accentBg: "rgba(0,181,102,0.12)",
  error: "#e5534b", errorBg: "rgba(229,83,75,0.15)",
  shadow: "0 2px 8px rgba(0,0,0,0.35)",
  focus: "0 0 0 3px rgba(0,181,102,0.25)",
};

/* ─── helpers ─────────────────────────────────────────────────────────────── */
interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, required, hint, error, children }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{
        fontSize: 11, fontWeight: 700, color: error ? T.error : T.label,
        textTransform: "uppercase", letterSpacing: "0.06em",
      }}>
        {label}{required && <span style={{ color: T.error, marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && !error && <span style={{ fontSize: 11, color: T.muted }}>{hint}</span>}
      {error && <span style={{ fontSize: 11, color: T.error }}>{error}</span>}
    </div>
  );
}

const inputStyle = (hasError?: boolean): React.CSSProperties => ({
  padding: "9px 12px", borderRadius: 6,
  background: T.elevated,
  border: `1px solid ${hasError ? T.error : T.border}`,
  color: T.text, fontSize: 13, outline: "none",
  fontFamily: "inherit", width: "100%", boxSizing: "border-box" as const,
  transition: "border-color 150ms",
});

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  const { hasError, ...rest } = props;
  return (
    <input
      {...rest}
      style={inputStyle(hasError)}
      onFocus={e => { e.currentTarget.style.borderColor = T.borderActive; e.currentTarget.style.boxShadow = T.focus; }}
      onBlur={e => { e.currentTarget.style.borderColor = hasError ? T.error : T.border; e.currentTarget.style.boxShadow = "none"; }}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{ ...inputStyle(), cursor: "pointer" }}
      onFocus={e => { e.currentTarget.style.borderColor = T.borderActive; e.currentTarget.style.boxShadow = T.focus; }}
      onBlur={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{ ...inputStyle(), resize: "vertical" as const, minHeight: 80, fontFamily: "inherit" }}
      onFocus={e => { e.currentTarget.style.borderColor = T.borderActive; e.currentTarget.style.boxShadow = T.focus; }}
      onBlur={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}
    />
  );
}

function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div style={{
      background: T.card, borderRadius: 8, border: `1px solid ${T.border}`,
      boxShadow: T.shadow, overflow: "hidden",
    }}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}` }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{title}</span>
      </div>
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {children}
      </div>
    </div>
  );
}

function SectionRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 14 }}>
      {children}
    </div>
  );
}

function CheckOption({ label, checked, onChange, description }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; description?: string;
}) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 16, height: 16, marginTop: 2, borderRadius: 4, flexShrink: 0,
          border: `1.5px solid ${checked ? T.accent : T.border}`,
          background: checked ? T.accent : T.elevated,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 150ms", cursor: "pointer",
        }}
      >
        {checked && <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>✓</span>}
      </div>
      <div>
        <div style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{label}</div>
        {description && <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{description}</div>}
      </div>
    </label>
  );
}

/* ─── Tag input ───────────────────────────────────────────────────────────── */
const SUGGESTED_TAGS = ["VIP", "Corporate", "Gifting", "Wholesale", "Press"];

function TagInput({ tags, setTags }: { tags: string[]; setTags: (t: string[]) => void }) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = SUGGESTED_TAGS.filter(t =>
    t.toLowerCase().includes(input.toLowerCase()) && !tags.includes(t)
  );

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) setTags([...tags, trimmed]);
    setInput("");
    setShowSuggestions(false);
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {tags.map(tag => (
          <span key={tag} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: T.elevated, border: `1px solid ${T.border}`,
            borderRadius: 9999, padding: "3px 10px", fontSize: 12, color: T.text,
          }}>
            {tag}
            <button onClick={() => setTags(tags.filter(t => t !== tag))} style={{
              background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 13, padding: 0,
            }}>×</button>
          </span>
        ))}
      </div>
      <div style={{ position: "relative" }}>
        <Input
          value={input}
          onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(input); } }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Type and press Enter..."
          aria-label="Add tag"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
            background: T.overlay, border: `1px solid ${T.border}`, borderRadius: 6,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 50, overflow: "hidden",
          }}>
            {suggestions.map(s => (
              <button key={s} onMouseDown={() => addTag(s)} style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "8px 12px", background: "transparent", border: "none",
                color: T.text, fontSize: 13, cursor: "pointer",
              }}
                onMouseEnter={e => e.currentTarget.style.background = T.elevated}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >{s}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Address Form ────────────────────────────────────────────────────────── */
function AddressForm() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        style={{
          background: "none", border: "none", color: T.accent,
          fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0,
          display: "flex", alignItems: "center", gap: 6,
        }}
      >
        <span style={{ fontSize: 16 }}>{expanded ? "−" : "+"}</span>
        {expanded ? "Hide address form" : "Add default address (optional)"}
      </button>

      {expanded && (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Address Line 1">
            <Input placeholder="Street address, apartment, etc." />
          </Field>
          <SectionRow>
            <div style={{ flex: 1 }}>
              <Field label="City"><Input placeholder="City" /></Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="State"><Input placeholder="State" /></Field>
            </div>
          </SectionRow>
          <SectionRow>
            <div style={{ flex: 1 }}>
              <Field label="Pincode"><Input placeholder="6-digit pincode" maxLength={6} /></Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="Type">
                <Select>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </Select>
              </Field>
            </div>
          </SectionRow>
        </div>
      )}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export default function NewCustomerPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [dob, setDob]             = useState("");
  const [gender, setGender]       = useState("");
  const [tags, setTags]           = useState<string[]>([]);
  const [notes, setNotes]         = useState("");
  const [tier, setTier]           = useState("plant_lover");
  const [points, setPoints]       = useState("0");
  const [sendWelcome, setSendWelcome] = useState(true);
  const [sendSetup, setSendSetup] = useState(true);
  const [marketingEmail, setMarketingEmail] = useState(false);
  const [marketingSms, setMarketingSms]     = useState(false);
  const [errors, setErrors]       = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim())  newErrors.lastName  = "Last name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (phone && !/^\+?[\d\s\-()]{10,15}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate API call
    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => router.push("/admin/customers"), 1500);
  }

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: 16 }}>
        <div style={{ fontSize: 48 }}>✅</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: T.text }}>Customer Created!</div>
        <div style={{ fontSize: 14, color: T.muted }}>Redirecting to customers list...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ fontSize: 12, color: T.muted, display: "flex", alignItems: "center", gap: 6 }}>
        <Link href="/admin" style={{ color: T.muted, textDecoration: "none" }}>Admin</Link>
        <span>/</span>
        <Link href="/admin/customers" style={{ color: T.muted, textDecoration: "none" }}>Customers</Link>
        <span>/</span>
        <span style={{ color: T.text }} aria-current="page">Add New Customer</span>
      </nav>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: T.text }}>Add New Customer</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: T.muted }}>Create a customer account manually</p>
        </div>
        <Link href="/admin/customers" style={{
          fontSize: 13, color: T.muted, textDecoration: "none",
          display: "flex", alignItems: "center", gap: 5,
        }}>← Cancel</Link>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

        {/* Left column */}
        <div style={{ flex: "0 0 calc(60% - 12px)", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Personal Info */}
          <Card title="Personal Information">
            <SectionRow>
              <div style={{ flex: 1 }}>
                <Field label="First Name" required error={errors.firstName}>
                  <Input
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="First name"
                    hasError={!!errors.firstName}
                    autoFocus
                  />
                </Field>
              </div>
              <div style={{ flex: 1 }}>
                <Field label="Last Name" required error={errors.lastName}>
                  <Input
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Last name"
                    hasError={!!errors.lastName}
                  />
                </Field>
              </div>
            </SectionRow>

            <Field label="Email Address" required error={errors.email} hint="Used for login and communication">
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="customer@email.com"
                hasError={!!errors.email}
              />
            </Field>

            <Field label="Phone Number" error={errors.phone} hint="Optional · Indian format: +91 XXXXX XXXXX">
              <Input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                hasError={!!errors.phone}
              />
            </Field>

            <SectionRow>
              <div style={{ flex: 1 }}>
                <Field label="Date of Birth" hint="DD/MM/YYYY">
                  <Input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                  />
                </Field>
              </div>
              <div style={{ flex: 1 }}>
                <Field label="Gender">
                  <Select value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="">Select (optional)</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not">Prefer not to say</option>
                  </Select>
                </Field>
              </div>
            </SectionRow>
          </Card>

          {/* Address */}
          <Card title="Default Address">
            <AddressForm />
          </Card>

          {/* Tags */}
          <Card title="Tags">
            <Field label="Customer Tags" hint="Press Enter or click a suggestion to add">
              <TagInput tags={tags} setTags={setTags} />
            </Field>
          </Card>

          {/* Internal Notes */}
          <Card title="Internal Notes">
            <Field label="Admin Note" hint="Internal only — not visible to the customer">
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add any internal notes about this customer..."
                rows={3}
              />
            </Field>
          </Card>
        </div>

        {/* Right column */}
        <div style={{ flex: "0 0 calc(40% - 12px)", display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 80 }}>

          {/* Loyalty & Account */}
          <Card title="Account Options">
            <Field label="Initial Loyalty Tier">
              <Select value={tier} onChange={e => setTier(e.target.value)}>
                <option value="plant_lover">🌿 Plant Lover</option>
                <option value="silver">🥈 Silver</option>
                <option value="gold">🥇 Gold</option>
              </Select>
            </Field>
            <Field label="Initial Points Balance" hint="Points to grant on account creation">
              <Input
                type="number"
                value={points}
                onChange={e => setPoints(e.target.value)}
                min={0}
                placeholder="0"
              />
            </Field>
          </Card>

          {/* Email & Setup */}
          <Card title="Notifications">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <CheckOption
                label="Send welcome email"
                description="Send a welcome message to the customer's inbox."
                checked={sendWelcome}
                onChange={setSendWelcome}
              />
              <CheckOption
                label="Send password setup link"
                description="Let the customer set their own password via email."
                checked={sendSetup}
                onChange={setSendSetup}
              />
            </div>
          </Card>

          {/* Marketing */}
          <Card title="Marketing Preferences">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <CheckOption
                label="Opted in to marketing emails"
                description="Customer has given consent for promotional emails."
                checked={marketingEmail}
                onChange={setMarketingEmail}
              />
              <CheckOption
                label="Opted in to SMS marketing"
                description="Customer has given consent for SMS promotions."
                checked={marketingSms}
                onChange={setMarketingSms}
              />
            </div>
          </Card>

          {/* Submit */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%", padding: "12px", borderRadius: 6,
                background: submitting ? T.elevated : T.accent,
                border: "none", color: submitting ? T.muted : "#fff",
                fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 150ms",
              }}
            >
              {submitting ? (
                <>
                  <span style={{
                    width: 16, height: 16, borderRadius: "50%",
                    border: `2px solid ${T.muted}`, borderTopColor: T.accent,
                    animation: "spin 0.7s linear infinite", display: "inline-block",
                  }} />
                  Creating Customer...
                </>
              ) : "✓ Create Customer"}
            </button>
            <Link href="/admin/customers" style={{
              width: "100%", padding: "10px", borderRadius: 6, boxSizing: "border-box",
              background: "transparent", border: `1px solid ${T.border}`,
              color: T.text, fontSize: 13, fontWeight: 600, cursor: "pointer",
              textDecoration: "none", textAlign: "center", display: "block",
            }}>Cancel</Link>
          </div>

          {/* Validation summary */}
          {Object.keys(errors).length > 0 && (
            <div style={{
              padding: "12px 14px", borderRadius: 6,
              background: T.errorBg, border: `1px solid ${T.error}`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.error, marginBottom: 6 }}>Please fix the following:</div>
              {Object.values(errors).map((msg, i) => (
                <div key={i} style={{ fontSize: 12, color: T.error }}>• {msg}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
