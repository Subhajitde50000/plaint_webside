'use client';

import React, { useState } from 'react';
import { ProductFormData, ValidationErrors, CATEGORIES, SUBCATEGORIES, COLLECTIONS_LIST } from '../types';
import { Panel, PanelHeading, FieldLabel, HelpText, Select, Checkbox, Divider } from '../ui';

interface Props {
  data: ProductFormData;
  errors: ValidationErrors;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

export function OrganisationPanel({ data, errors, onChange }: Props) {
  const [tagInput, setTagInput] = useState('');

  const addTag = (val: string) => {
    const t = val.trim().toLowerCase().replace(/\s+/g, '-');
    if (!t || data.tags.includes(t)) return;
    onChange('tags', [...data.tags, t]);
    setTagInput('');
  };

  const removeTag = (t: string) => onChange('tags', data.tags.filter(tag => tag !== t));

  const toggleCollection = (c: string) => {
    if (data.collections.includes(c)) {
      onChange('collections', data.collections.filter(col => col !== c));
    } else {
      onChange('collections', [...data.collections, c]);
    }
  };

  const subcats = SUBCATEGORIES[data.category] ?? [];

  return (
    <Panel>
      <PanelHeading>Organisation</PanelHeading>

      {/* Category */}
      <div style={{ marginBottom: 14 }}>
        <FieldLabel required>Category</FieldLabel>
        <Select
          value={data.category}
          error={errors.category}
          onChange={e => { onChange('category', e.target.value); onChange('subcategory', ''); }}
        >
          <option value="">Select category…</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
        <HelpText>Controls which category filter this product appears under on the PLP.</HelpText>
      </div>

      {/* Subcategory */}
      {subcats.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <FieldLabel>Subcategory</FieldLabel>
          <Select value={data.subcategory} onChange={e => onChange('subcategory', e.target.value)}>
            <option value="">Select subcategory…</option>
            {subcats.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
      )}

      <Divider />

      {/* Tags */}
      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Tags</FieldLabel>
        {/* Tag chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {data.tags.map(t => (
            <span key={t} style={{
              background: '#22272e', border: '1px solid #444c56',
              borderRadius: 9999, padding: '3px 10px',
              fontSize: 11, color: '#adbac7', display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {t}
              <button type="button" onClick={() => removeTag(t)} style={{
                background: 'transparent', border: 'none', color: '#768390',
                fontSize: 11, cursor: 'pointer', padding: 0, lineHeight: 1,
              }}>✕</button>
            </span>
          ))}
        </div>
        {/* Tag input */}
        <input
          type="text"
          value={tagInput}
          placeholder="Add tag and press Enter…"
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); }
            if (e.key === ',') { e.preventDefault(); addTag(tagInput); }
          }}
          style={{
            width: '100%', height: 34, background: '#22272e', border: '1px solid #444c56',
            borderRadius: 6, color: '#cdd9e5', fontSize: 12,
            fontFamily: "'Outfit', sans-serif", padding: '0 10px', outline: 'none',
          }}
        />
        <HelpText>Press Enter or comma to add. Free-text.</HelpText>
      </div>

      <Divider />

      {/* Collections */}
      <div>
        <FieldLabel>Collections</FieldLabel>
        <div
          role="group"
          aria-label="Collections"
          style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}
        >
          {COLLECTIONS_LIST.map(c => (
            <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#cdd9e5' }}>
              <div
                onClick={() => toggleCollection(c)}
                style={{
                  width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                  border: `1px solid ${data.collections.includes(c) ? '#00b566' : '#444c56'}`,
                  background: data.collections.includes(c) ? '#00b566' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {data.collections.includes(c) && <span style={{ color: '#fff', fontSize: 10, lineHeight: 1 }}>✓</span>}
              </div>
              {c}
            </label>
          ))}
        </div>
      </div>
    </Panel>
  );
}

