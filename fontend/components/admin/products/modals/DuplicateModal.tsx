'use client';

import React, { useState } from 'react';
import { Checkbox, Input } from '../ui';

interface Props {
  productTitle: string;
  onConfirm: (newTitle: string) => void;
  onCancel: () => void;
}

const DUPLICATE_OPTIONS = [
  { id: 'info', label: 'All product information and descriptions' },
  { id: 'pricing', label: 'Pricing and variants' },
  { id: 'care', label: 'Care info and specifications' },
  { id: 'seo', label: 'SEO settings' },
  { id: 'media', label: 'Media (images) — copies references, not files' },
];

export function DuplicateModal({ productTitle, onConfirm, onCancel }: Props) {
  const [newTitle, setNewTitle] = useState(`${productTitle} (Copy)`);
  const [options, setOptions] = useState<string[]>(['info', 'pricing', 'care', 'seo']);
  const [status, setStatus] = useState<'draft' | 'active'>('draft');

  const toggleOption = (id: string) => {
    setOptions(o => o.includes(id) ? o.filter(x => x !== id) : [...o, id]);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300,
    }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dup-title"
        style={{ background: '#1c2128', border: '1px solid #444c56', borderRadius: 8, padding: 28, width: 480, maxWidth: '90vw' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <h2 id="dup-title" style={{ fontSize: 18, fontWeight: 700, color: '#cdd9e5', fontFamily: "'Outfit', sans-serif" }}>
            Duplicate Product
          </h2>
          <button type="button" onClick={onCancel} style={{ background: 'transparent', border: 'none', color: '#768390', fontSize: 20, cursor: 'pointer' }}>×</button>
        </div>

        <p style={{ fontSize: 12, color: '#768390', marginBottom: 16 }}>
          This will create a copy of: <strong style={{ color: '#adbac7' }}>&quot;{productTitle}&quot;</strong>
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#adbac7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, display: 'block' }}>
            New product title:
          </label>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            style={{
              width: '100%', height: 36, background: '#22272e', border: '1px solid #444c56',
              borderRadius: 6, color: '#cdd9e5', fontSize: 12, fontFamily: "'Outfit', sans-serif",
              padding: '0 12px', outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#adbac7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Duplicate:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DUPLICATE_OPTIONS.map(opt => (
              <Checkbox key={opt.id} id={`dup-${opt.id}`} label={opt.label}
                checked={options.includes(opt.id)} onChange={() => toggleOption(opt.id)} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#adbac7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Status of duplicate:
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {(['draft', 'active'] as const).map(s => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <div onClick={() => setStatus(s)} style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: `2px solid ${status === s ? '#00b566' : '#444c56'}`,
                  background: status === s ? '#00b566' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                  {status === s && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'block' }} />}
                </div>
                <span style={{ fontSize: 12, color: '#adbac7', textTransform: 'capitalize' }}>{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel} style={{
            background: 'transparent', border: '1px solid #444c56', borderRadius: 6,
            color: '#adbac7', fontSize: 12, fontFamily: "'Outfit', sans-serif", padding: '7px 16px', cursor: 'pointer',
          }}>Cancel</button>
          <button type="button" onClick={() => onConfirm(newTitle)} style={{
            background: '#00b566', border: 'none', borderRadius: 6, color: '#fff',
            fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif", padding: '7px 18px', cursor: 'pointer',
          }}>Create Duplicate</button>
        </div>
      </div>
    </div>
  );
}

