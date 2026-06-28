'use client';

import React from 'react';

interface Props {
  errors: string[];
  onDismiss: () => void;
}

export function ValidationSummary({ errors, onDismiss }: Props) {
  if (errors.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        background: 'rgba(229,83,75,0.08)',
        border: '1px solid rgba(229,83,75,0.4)',
        borderRadius: 6,
        padding: '14px 16px',
        marginBottom: 16,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#e5534b', marginBottom: 8 }}>
            ✕ This product can&apos;t be published yet. Fix {errors.length} {errors.length === 1 ? 'issue' : 'issues'}:
          </p>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {errors.map((err, i) => (
              <li key={i} style={{ fontSize: 12, color: '#e5534b', marginBottom: 4, lineHeight: 1.5 }}>{err}</li>
            ))}
          </ul>
        </div>
        <button type="button" onClick={onDismiss} style={{
          background: 'transparent', border: 'none', color: '#e5534b',
          fontSize: 16, cursor: 'pointer', padding: '0 4px', marginLeft: 12, flexShrink: 0,
        }}>×</button>
      </div>
    </div>
  );
}

