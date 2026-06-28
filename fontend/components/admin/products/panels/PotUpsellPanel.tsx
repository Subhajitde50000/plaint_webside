'use client';

import React, { useState } from 'react';
import { ProductFormData, FeaturedPot, ValidationErrors } from '../types';
import { Panel, PanelHeading, FieldLabel, HelpText, GhostButton, Input, Checkbox, Divider, InfoBanner } from '../ui';

interface Props {
  data: ProductFormData;
  errors: ValidationErrors;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

/* Mock pot catalog for picker */
const POT_CATALOG: FeaturedPot[] = [
  { id: 'pot-1', name: 'Terracotta Pot', price: '₹299', imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=60&q=60' },
  { id: 'pot-2', name: 'White Minimalist Ceramic', price: '₹449', imageUrl: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=60&q=60' },
  { id: 'pot-3', name: 'Jute Basket Planter', price: '₹199', imageUrl: 'https://images.unsplash.com/photo-1605217613423-0aea4fb32906?w=60&q=60' },
  { id: 'pot-4', name: 'Black Matte Cylinder', price: '₹359', imageUrl: 'https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=60&q=60' },
  { id: 'pot-5', name: 'Hanging Macramé Pot', price: '₹279', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=60&q=60' },
  { id: 'pot-6', name: 'Metallic Gold Planter', price: '₹519', imageUrl: 'https://images.unsplash.com/photo-1591280063444-d3c514eb6e13?w=60&q=60' },
];

export function PotUpsellPanel({ data, errors, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSelected, setPickerSelected] = useState<string[]>([]);
  const [pickerSearch, setPickerSearch] = useState('');
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const removePot = (id: string) => onChange('featuredPots', data.featuredPots.filter(p => p.id !== id));

  const handleDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    const arr = [...data.featuredPots];
    const fi = arr.findIndex(p => p.id === draggingId);
    const ti = arr.findIndex(p => p.id === targetId);
    const [moved] = arr.splice(fi, 1);
    arr.splice(ti, 0, moved);
    onChange('featuredPots', arr);
    setDraggingId(null);
  };

  const confirmPicker = () => {
    const existing = data.featuredPots.map(p => p.id);
    const toAdd = POT_CATALOG.filter(p => pickerSelected.includes(p.id) && !existing.includes(p.id));
    onChange('featuredPots', [...data.featuredPots, ...toAdd].slice(0, 6));
    setShowPicker(false);
    setPickerSelected([]);
    setPickerSearch('');
  };

  const filteredCatalog = POT_CATALOG.filter(p =>
    p.name.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  return (
    <Panel>
      <div style={{ marginBottom: 4 }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#cdd9e5', fontFamily: "'Outfit', sans-serif", marginBottom: 2 }}>
          Pot Upsell Strip
        </p>
        <p style={{ fontSize: 11, color: '#768390' }}>Shown on PDP below size selector</p>
      </div>

      <Divider />

      {/* Section Label */}
      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Section Label</FieldLabel>
        <Input
          type="text"
          placeholder="Pair it with a pot"
          value={data.potUpsellLabel}
          onChange={e => onChange('potUpsellLabel', e.target.value)}
        />
        <HelpText>Shown above the pot chips on the PDP</HelpText>
      </div>

      {/* Featured Pots */}
      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Featured Pots (up to 6)</FieldLabel>
        {data.featuredPots.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10, marginTop: 8 }}>
            {data.featuredPots.map(pot => (
              <div
                key={pot.id}
                draggable
                onDragStart={() => setDraggingId(pot.id)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(pot.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: '#22272e', border: '1px solid #444c56',
                  borderRadius: 6, padding: '6px 10px',
                  cursor: 'grab',
                }}
              >
                <span style={{ color: '#545d68', fontSize: 14, cursor: 'grab' }}>⠿</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pot.imageUrl} alt={pot.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, color: '#cdd9e5', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pot.name}</p>
                  <p style={{ fontSize: 11, color: '#768390' }}>{pot.price}</p>
                </div>
                <button type="button" onClick={() => removePot(pot.id)} style={{
                  background: 'transparent', border: 'none', color: '#545d68',
                  fontSize: 14, cursor: 'pointer', padding: '2px 4px', borderRadius: 4,
                }}>✕</button>
              </div>
            ))}
          </div>
        )}
        {data.featuredPots.length < 6 && (
          <GhostButton size="sm" onClick={() => setShowPicker(true)}>+ Add Pot</GhostButton>
        )}
      </div>

      <Divider />

      {/* Show All Pots Link */}
      <Checkbox
        id="show-all-pots"
        label='Show link to all pots collection'
        checked={data.showAllPotsLink}
        onChange={v => onChange('showAllPotsLink', v)}
      />

      <InfoBanner>
        Clicking a pot chip on the storefront navigates to that pot's own PDP. Pots are never variants of this plant.
      </InfoBanner>

      {/* Pot Picker Modal */}
      {showPicker && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200,
        }} onClick={() => setShowPicker(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Select pots for upsell strip"
            onClick={e => e.stopPropagation()}
            style={{
              background: '#1c2128', border: '1px solid #444c56', borderRadius: 8,
              width: 460, maxWidth: '90vw', maxHeight: '80vh',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #444c56', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#cdd9e5', fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Select Pots for Upsell Strip</h3>
              <button type="button" onClick={() => setShowPicker(false)} style={{ background: 'transparent', border: 'none', color: '#768390', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #444c56' }}>
              <input
                type="search"
                value={pickerSearch}
                onChange={e => setPickerSearch(e.target.value)}
                placeholder="🔍 Search pots..."
                style={{
                  width: '100%', height: 34, background: '#22272e', border: '1px solid #444c56',
                  borderRadius: 6, color: '#cdd9e5', fontSize: 12, fontFamily: "'Outfit', sans-serif",
                  padding: '0 12px', outline: 'none',
                }}
              />
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
              {filteredCatalog.map(pot => {
                const isSelected = pickerSelected.includes(pot.id);
                const isAdded = data.featuredPots.some(p => p.id === pot.id);
                return (
                  <div key={pot.id} onClick={() => {
                    if (isAdded) return;
                    setPickerSelected(s => isSelected ? s.filter(id => id !== pot.id) : [...s, pot.id]);
                  }} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 20px', cursor: isAdded ? 'default' : 'pointer',
                    background: isSelected ? 'rgba(0,181,102,0.08)' : 'transparent',
                    opacity: isAdded ? 0.4 : 1,
                    transition: 'background 0.15s',
                  }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                      border: `1px solid ${isSelected ? '#00b566' : '#444c56'}`,
                      background: isSelected ? '#00b566' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isSelected && <span style={{ color: '#fff', fontSize: 10 }}>✓</span>}
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pot.imageUrl} alt={pot.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                    <div>
                      <p style={{ fontSize: 12, color: '#cdd9e5', fontWeight: 500 }}>{pot.name}</p>
                      <p style={{ fontSize: 11, color: '#768390' }}>{pot.price}</p>
                    </div>
                    {isAdded && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#57ab5a' }}>Added</span>}
                  </div>
                );
              })}
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid #444c56', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" onClick={() => setShowPicker(false)} style={{
                background: 'transparent', border: '1px solid #444c56', borderRadius: 6,
                color: '#adbac7', fontSize: 12, padding: '7px 16px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
              }}>Cancel</button>
              <button type="button" onClick={confirmPicker} disabled={pickerSelected.length === 0} style={{
                background: pickerSelected.length === 0 ? '#00b56660' : '#00b566', border: 'none',
                borderRadius: 6, color: '#fff', fontSize: 12, fontWeight: 600, padding: '7px 16px',
                cursor: pickerSelected.length === 0 ? 'not-allowed' : 'pointer', fontFamily: "'Outfit', sans-serif",
              }}>
                Add Selected ({pickerSelected.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}

