'use client';

import React, { useState } from 'react';

interface Props {
  productTitle: string;
  orderCount?: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ productTitle, orderCount = 0, onConfirm, onCancel }: Props) {
  const [confirmInput, setConfirmInput] = useState('');
  const isMatch = confirmInput.toLowerCase() === productTitle.toLowerCase();

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300,
    }}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        style={{ background: '#1c2128', border: '1px solid #e5534b', borderRadius: 8, padding: 28, width: 480, maxWidth: '90vw' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <h2 id="delete-title" style={{ fontSize: 18, fontWeight: 700, color: '#cdd9e5', fontFamily: "'Outfit', sans-serif" }}>
            Delete &quot;{productTitle}&quot;?
          </h2>
          <button type="button" onClick={onCancel} style={{ background: 'transparent', border: 'none', color: '#768390', fontSize: 20, cursor: 'pointer' }}>×</button>
        </div>

        {orderCount > 0 && (
          <div style={{
            background: 'rgba(198,144,38,0.08)', border: '1px solid rgba(198,144,38,0.4)',
            borderLeft: '3px solid #c69026', borderRadius: 6, padding: '10px 14px', marginBottom: 16,
          }}>
            <p style={{ fontSize: 12, color: '#c69026', fontWeight: 600, marginBottom: 4 }}>
              ⚠️ This product has been ordered {orderCount.toLocaleString()} times.
            </p>
            <p style={{ fontSize: 12, color: '#768390', lineHeight: 1.5 }}>
              Deleting it will remove it from the storefront but will not affect existing order records.
            </p>
          </div>
        )}

        <p style={{ fontSize: 12, color: '#768390', marginBottom: 6 }}>
          To confirm, type the product name:
        </p>
        <input
          type="text"
          value={confirmInput}
          aria-label="Type product name to confirm deletion"
          placeholder={productTitle}
          onChange={e => setConfirmInput(e.target.value)}
          style={{
            width: '100%', height: 36, background: '#22272e',
            border: `1px solid ${confirmInput && !isMatch ? '#e5534b' : '#444c56'}`,
            borderRadius: 6, color: '#cdd9e5', fontSize: 12, fontFamily: "'Outfit', sans-serif",
            padding: '0 12px', outline: 'none', marginBottom: 20,
          }}
        />

        <p style={{ fontSize: 11, color: '#768390', marginBottom: 16 }}>
          Consider{' '}
          <button type="button" onClick={onCancel} style={{ background: 'transparent', border: 'none', color: '#539bf5', fontSize: 11, cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Outfit', sans-serif" }}>
            archiving instead
          </button>
          {' '}— less destructive and reversible.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel} style={{
            background: 'transparent', border: '1px solid #444c56', borderRadius: 6,
            color: '#adbac7', fontSize: 12, fontFamily: "'Outfit', sans-serif", padding: '7px 16px', cursor: 'pointer',
          }}>Cancel</button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!isMatch}
            style={{
              background: isMatch ? '#e5534b' : 'rgba(229,83,75,0.3)',
              border: 'none', borderRadius: 6, color: '#fff',
              fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
              padding: '7px 18px', cursor: isMatch ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
            }}
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
}

