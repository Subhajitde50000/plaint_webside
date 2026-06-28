'use client';

import React, { useRef } from 'react';

/* ─── Simple Rich Text Editor ──────────────────────────────────────────────── */
interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: number;
  id?: string;
}

export function RichTextEditor({ value, onChange, placeholder = 'Write a detailed description of this plant...', minHeight = 200, id = 'rte' }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    if (ref.current) onChange(ref.current.innerHTML);
    ref.current?.focus();
  };

  const handleInput = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const toolbarBtns = [
    { label: 'B', title: 'Bold', cmd: 'bold', style: { fontWeight: 700 } },
    { label: 'I', title: 'Italic', cmd: 'italic', style: { fontStyle: 'italic' } },
    { label: 'U', title: 'Underline', cmd: 'underline', style: { textDecoration: 'underline' } },
  ];

  return (
    <div style={{ border: '1px solid #444c56', borderRadius: 6, overflow: 'hidden', background: '#22272e' }}>
      {/* Toolbar */}
      <div style={{
        background: '#0f1117',
        borderBottom: '1px solid #444c5680',
        padding: '6px 10px',
        display: 'flex',
        gap: 4,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        {toolbarBtns.map(b => (
          <button key={b.cmd} type="button" title={b.title} onMouseDown={e => { e.preventDefault(); exec(b.cmd); }}
            style={{ ...rteToolBtn, ...b.style }}>{b.label}</button>
        ))}
        <div style={{ width: 1, height: 18, background: '#444c56', margin: '0 4px' }} />
        <button type="button" title="Heading 2" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h2'); }}
          style={rteToolBtn}>H2</button>
        <button type="button" title="Heading 3" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h3'); }}
          style={rteToolBtn}>H3</button>
        <div style={{ width: 1, height: 18, background: '#444c56', margin: '0 4px' }} />
        <button type="button" title="Bullet List" onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList'); }}
          style={rteToolBtn}>≡</button>
        <button type="button" title="Numbered List" onMouseDown={e => { e.preventDefault(); exec('insertOrderedList'); }}
          style={rteToolBtn}>1.</button>
        <div style={{ width: 1, height: 18, background: '#444c56', margin: '0 4px' }} />
        <button type="button" title="Clear formatting" onMouseDown={e => { e.preventDefault(); exec('removeFormat'); exec('formatBlock', 'p'); }}
          style={{ ...rteToolBtn, color: '#768390' }}>✕ clear</button>
      </div>
      {/* Content */}
      <div
        ref={ref}
        id={id}
        role="textbox"
        aria-multiline="true"
        aria-label="Full description"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{
          minHeight,
          padding: '12px 16px',
          color: '#cdd9e5',
          fontSize: 12,
          lineHeight: 1.7,
          outline: 'none',
          fontFamily: "'Outfit', sans-serif",
        }}
        dangerouslySetInnerHTML={value ? { __html: value } : undefined}
      />
      <style>{`
        [role="textbox"]:empty:before {
          content: attr(data-placeholder);
          color: #545d68;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

const rteToolBtn: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#adbac7',
  cursor: 'pointer',
  padding: '3px 7px',
  borderRadius: 4,
  fontSize: 11,
  fontWeight: 600,
  fontFamily: "'Outfit', sans-serif",
  transition: 'background 0.15s',
};

/* ─── Reusable Field Components ─────────────────────────────────────────────── */

export function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{
      display: 'block',
      fontSize: 11,
      fontWeight: 700,
      color: '#adbac7',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      marginBottom: 6,
    }}>
      {children}
      {required && <span style={{ color: '#e5534b', marginLeft: 4 }}>*</span>}
    </label>
  );
}

export function HelpText({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 11, color: '#768390', marginTop: 4, lineHeight: 1.5 }}>{children}</p>;
}

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export function Input({ error, prefix, suffix, style, ...props }: InputProps) {
  return (
    <div style={{ position: 'relative' }}>
      {prefix && (
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#768390', fontSize: 12, pointerEvents: 'none' }}>
          {prefix}
        </span>
      )}
      <input
        {...props}
        aria-invalid={error ? 'true' : undefined}
        style={{
          width: '100%',
          height: 36,
          background: '#22272e',
          border: `1px solid ${error ? '#e5534b' : '#444c56'}`,
          borderRadius: 6,
          color: '#cdd9e5',
          fontSize: 12,
          fontFamily: "'Outfit', sans-serif",
          padding: prefix ? '0 12px 0 26px' : suffix ? '0 36px 0 12px' : '0 12px',
          outline: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          ...(error ? { background: 'rgba(229,83,75,0.05)' } : {}),
          ...style,
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = '#00b566';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,181,102,0.25)';
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = error ? '#e5534b' : '#444c56';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      {suffix && (
        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#768390', fontSize: 12, pointerEvents: 'none' }}>
          {suffix}
        </span>
      )}
      {error && (
        <p role="alert" style={{ fontSize: 11, color: '#e5534b', marginTop: 4, fontWeight: 500 }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export function Select({ error, children, style, ...props }: SelectProps) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        {...props}
        style={{
          width: '100%',
          height: 36,
          background: '#22272e',
          border: `1px solid ${error ? '#e5534b' : '#444c56'}`,
          borderRadius: 6,
          color: '#cdd9e5',
          fontSize: 12,
          fontFamily: "'Outfit', sans-serif",
          padding: '0 32px 0 12px',
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer',
          transition: 'border-color 0.15s',
          ...style,
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = '#00b566';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,181,102,0.25)';
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = error ? '#e5534b' : '#444c56';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {children}
      </select>
      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#768390', fontSize: 10, pointerEvents: 'none' }}>▾</span>
      {error && <p role="alert" style={{ fontSize: 11, color: '#e5534b', marginTop: 4, fontWeight: 500 }}>⚠ {error}</p>}
    </div>
  );
}

export function Checkbox({ label, checked, onChange, id }: { label: string; checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <label htmlFor={id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#cdd9e5' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 16, height: 16, borderRadius: 3,
          border: `1px solid ${checked ? '#00b566' : '#444c56'}`,
          background: checked ? '#00b566' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
        }}
      >
        {checked && <span style={{ color: '#fff', fontSize: 10, lineHeight: 1 }}>✓</span>}
      </div>
      <input type="checkbox" id={id} checked={checked} onChange={e => onChange(e.target.checked)} style={{ display: 'none' }} />
      {label}
    </label>
  );
}

export function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#1c2128',
      border: '1px solid #444c56',
      borderRadius: 8,
      padding: 24,
      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function PanelHeading({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#cdd9e5', fontFamily: "'Outfit', sans-serif" }}>{children}</h2>
      {action}
    </div>
  );
}

export function GhostButton({ children, onClick, color, size = 'md', style }: {
  children: React.ReactNode;
  onClick?: () => void;
  color?: string;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}) {
  return (
    <button type="button" onClick={onClick} style={{
      background: 'transparent',
      border: `1px solid ${color || '#444c56'}`,
      borderRadius: 6,
      color: color || '#adbac7',
      fontSize: size === 'sm' ? 11 : 12,
      fontWeight: 600,
      fontFamily: "'Outfit', sans-serif",
      padding: size === 'sm' ? '4px 10px' : '7px 14px',
      cursor: 'pointer',
      transition: 'all 0.15s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      ...style,
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
    >{children}</button>
  );
}

export function PrimaryButton({ children, onClick, loading, disabled, style }: {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading}
      aria-busy={loading}
      style={{
        background: (disabled || loading) ? '#00b56699' : '#00b566',
        border: 'none',
        borderRadius: 6,
        color: '#fff',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "'Outfit', sans-serif",
        padding: '7px 18px',
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 36,
        ...style,
      }}
      onMouseEnter={e => { if (!disabled && !loading) (e.currentTarget as HTMLButtonElement).style.background = '#00c975'; }}
      onMouseLeave={e => { if (!disabled && !loading) (e.currentTarget as HTMLButtonElement).style.background = '#00b566'; }}
    >
      {loading && <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />}
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, loading, disabled }: {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading}
      aria-busy={loading}
      style={{
        background: 'transparent',
        border: '1px solid #444c56',
        borderRadius: 6,
        color: '#cdd9e5',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "'Outfit', sans-serif",
        padding: '7px 16px',
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 36,
        opacity: (disabled || loading) ? 0.6 : 1,
      }}
      onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = '#22272e'; }}
      onMouseLeave={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
    >
      {loading && <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#cdd9e5', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />}
      {children}
    </button>
  );
}

export function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(83,155,245,0.06)',
      border: '1px solid rgba(83,155,245,0.3)',
      borderRadius: 4,
      padding: 8,
      fontSize: 11,
      color: '#768390',
      display: 'flex',
      gap: 6,
      alignItems: 'flex-start',
      marginTop: 12,
    }}>
      <span style={{ color: '#539bf5', flexShrink: 0 }}>ℹ</span>
      <span>{children}</span>
    </div>
  );
}

export function Divider() {
  return <div style={{ height: 1, background: 'rgba(68,76,86,0.5)', margin: '16px 0' }} />;
}

export function CharCounter({ current, max }: { current: number; max: number }) {
  const pct = current / max;
  const color = pct >= 1 ? '#e5534b' : pct >= 0.9 ? '#c69026' : '#768390';
  return (
    <p style={{ fontSize: 11, color, textAlign: 'right', marginTop: 4 }}>
      {current} / {max} characters
    </p>
  );
}

export const SPIN_CSS = `@keyframes spin { to { transform: rotate(360deg); } }`;
