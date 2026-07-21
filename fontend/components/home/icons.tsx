export function LeafIcon({ size = 24, color = "#2D5A27" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 4 5 4 13C4 17.4 7.6 21 12 21C16.4 21 20 17.4 20 13C20 5 12 2 12 2Z" fill={color} opacity="0.9" />
      <path d="M12 21V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 15L8 11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 12L16 8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function WaterDroplet({ size = 32, color = "#6BBDE3" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2C12 2 5 10 5 15C5 18.87 8.13 22 12 22C15.87 22 19 18.87 19 15C19 10 12 2 12 2Z" />
      <path d="M9 15C9 16.66 10.34 18 12 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SunIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#F5C842">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="21" x2="12" y2="23" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" />
      <line x1="1" y1="12" x2="3" y2="12" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" />
      <line x1="21" y1="12" x2="23" y2="12" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CloudIcon() {
  return (
    <svg width="60" height="40" viewBox="0 0 80 50" fill="white">
      <ellipse cx="40" cy="35" rx="35" ry="14" />
      <ellipse cx="28" cy="28" rx="18" ry="16" />
      <ellipse cx="50" cy="26" rx="20" ry="18" />
    </svg>
  );
}

export function LeafShape({ color = "#A8C5A0", width = 40, height = 55, rotate = 0, opacity = 0.6 }: {
  color?: string; width?: number; height?: number; rotate?: number; opacity?: number;
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 40 55" style={{ opacity, transform: `rotate(${rotate}deg)` }}>
      <path d="M20 50 C20 50 5 35 5 20 C5 8 12 2 20 2 C28 2 35 8 35 20 C35 35 20 50 20 50Z" fill={color} />
      <path d="M20 50 L20 5" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  );
}



/* ═══════════════════════════════════════════════════
   HERO SECTION — per-slide unique right-column visuals
═══════════════════════════════════════════════════ */

