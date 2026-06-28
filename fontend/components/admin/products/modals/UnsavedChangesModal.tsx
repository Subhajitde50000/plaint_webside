'use client';

import React from 'react';
import { PrimaryButton, SecondaryButton } from '../ui';

interface Props {
  onStay: () => void;
  onLeave: () => void;
}

export function UnsavedChangesModal({ onStay, onLeave }: Props) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300,
    }}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="unsaved-title"
        style={{
          background: '#1c2128', border: '1px solid #444c56', borderRadius: 8,
          padding: 28, width: 440, maxWidth: '90vw',
        }}
      >
        <h2 id="unsaved-title" style={{ fontSize: 18, fontWeight: 700, color: '#cdd9e5', fontFamily: "'Outfit', sans-serif", marginBottom: 12 }}>
          Leave without saving?
        </h2>
        <p style={{ fontSize: 13, color: '#768390', lineHeight: 1.6, marginBottom: 24 }}>
          You have unsaved changes to this product.<br />
          They will be lost if you leave.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onLeave} style={{
            background: 'transparent', border: '1px solid #444c56',
            borderRadius: 6, color: '#e5534b', fontSize: 12, fontWeight: 600,
            fontFamily: "'Outfit', sans-serif", padding: '7px 16px', cursor: 'pointer',
          }}>Leave without saving</button>
          <PrimaryButton onClick={onStay}>Stay on page</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

