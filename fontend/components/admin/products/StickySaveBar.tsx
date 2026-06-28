'use client';

import React from 'react';
import { PrimaryButton, SecondaryButton } from './ui';

interface Props {
  isDirty: boolean;
  isSavingDraft: boolean;
  isPublishing: boolean;
  lastSaved: string | null;
  onDiscard: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export function StickySaveBar({ isDirty, isSavingDraft, isPublishing, lastSaved, onDiscard, onSaveDraft, onPublish }: Props) {
  return (
    <div
      role="region"
      aria-label="Save actions"
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 50,
        background: 'rgba(22,27,34,0.92)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid #444c56',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      {/* Left: Discard */}
      <button
        type="button"
        onClick={onDiscard}
        disabled={!isDirty}
        aria-label="Discard all unsaved changes"
        style={{
          background: 'transparent', border: 'none',
          color: isDirty ? '#e5534b' : '#545d68',
          fontSize: 12, fontWeight: 600,
          fontFamily: "'Outfit', sans-serif",
          cursor: isDirty ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', gap: 6,
          transition: 'color 0.15s',
          flexShrink: 0,
        }}
      >
        ← Discard Changes
      </button>

      {/* Centre: Last saved indicator */}
      <div
        aria-live="polite"
        style={{ fontSize: 11, color: '#768390', textAlign: 'center', flex: 1 }}
      >
        {isPublishing || isSavingDraft
          ? <span style={{ color: '#adbac7' }}>Saving…</span>
          : isDirty
            ? <span style={{ color: '#c69026' }}>● Unsaved changes</span>
            : lastSaved
              ? `Last saved: ${lastSaved}`
              : <span style={{ color: '#545d68' }}>No changes yet</span>
        }
      </div>

      {/* Right: Save Draft + Publish */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <SecondaryButton onClick={onSaveDraft} loading={isSavingDraft}>
          Save Draft
        </SecondaryButton>
        <PrimaryButton onClick={onPublish} loading={isPublishing}>
          Publish
        </PrimaryButton>
      </div>
    </div>
  );
}
