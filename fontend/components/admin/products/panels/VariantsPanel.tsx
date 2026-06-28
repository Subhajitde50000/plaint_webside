'use client';

import React, { useState } from 'react';
import { ProductFormData, SizeVariant, VariantType, ValidationErrors } from '../types';
import { Panel, PanelHeading, FieldLabel, HelpText, GhostButton, Input, Select, InfoBanner, Divider } from '../ui';
import { DISPATCH_OPTIONS } from '../types';

interface Props {
  data: ProductFormData;
  errors: ValidationErrors;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

const VARIANT_TYPES: { value: VariantType; label: string; rangeLabel: string }[] = [
  { value: 'size', label: 'Size / Height', rangeLabel: 'Height Range' },
  { value: 'diameter', label: 'Diameter', rangeLabel: 'Diameter (cm)' },
  { value: 'weight', label: 'Weight / Volume', rangeLabel: 'Weight / Volume' },
  { value: 'pack', label: 'Pack size', rangeLabel: 'Pack Size' },
  { value: 'custom', label: 'Custom', rangeLabel: 'Custom Range' },
];

function newVariant(baseSku: string, count: number): SizeVariant {
  return {
    id: Date.now().toString() + Math.random(),
    sizeName: '',
    range: '',
    price: '',
    sku: `${baseSku ? baseSku + '-' : 'SKU-'}${count + 1}`,
    stock: 0,
    bestFor: '',
    potDiameter: '',
    dispatch: '1–2 days',
  };
}

export function VariantsPanel({ data, errors, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const variantTypeInfo = VARIANT_TYPES.find(v => v.value === data.variantType) ?? VARIANT_TYPES[0];

  const updateVariant = (id: string, field: keyof SizeVariant, value: unknown) => {
    onChange('variants', data.variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const removeVariant = (id: string) => {
    onChange('variants', data.variants.filter(v => v.id !== id));
  };

  const addVariant = () => {
    onChange('variants', [...data.variants, newVariant(data.baseSku, data.variants.length)]);
  };

  const handleDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    const arr = [...data.variants];
    const fi = arr.findIndex(v => v.id === draggingId);
    const ti = arr.findIndex(v => v.id === targetId);
    const [moved] = arr.splice(fi, 1);
    arr.splice(ti, 0, moved);
    onChange('variants', arr);
    setDraggingId(null);
  };

  return (
    <Panel>
      <PanelHeading action={
        <GhostButton size="sm" onClick={addVariant}>+ Add Variant Option</GhostButton>
      }>Variants &amp; Sizes</PanelHeading>

      {/* Variant Type Selector */}
      <div style={{ marginBottom: 16 }}>
        <FieldLabel>Variant Type</FieldLabel>
        <div role="radiogroup" aria-label="Variant type" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {VARIANT_TYPES.map(vt => {
            const isLocked = (data.productType === 'plant' && vt.value !== 'size') ||
              (data.productType === 'pot' && vt.value !== 'diameter') ||
              (data.productType === 'seed' && vt.value !== 'pack');
            const isActive = data.variantType === vt.value;
            return (
              <label key={vt.value} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', borderRadius: 6,
                background: isActive ? 'rgba(0,181,102,0.12)' : '#22272e',
                border: `1px solid ${isActive ? '#00b566' : '#444c56'}`,
                cursor: isLocked ? 'not-allowed' : 'pointer',
                fontSize: 12, color: isLocked ? '#545d68' : isActive ? '#00b566' : '#adbac7',
                transition: 'all 0.15s',
                opacity: isLocked ? 0.5 : 1,
              }}>
                <input
                  type="radio"
                  name="variantType"
                  value={vt.value}
                  checked={isActive}
                  disabled={isLocked}
                  onChange={() => onChange('variantType', vt.value)}
                  style={{ display: 'none' }}
                />
                {isActive ? '●' : '○'} {vt.label}
              </label>
            );
          })}
        </div>
        <HelpText>This controls what size pills look like on the storefront PDP.</HelpText>
      </div>

      {errors.variants && (
        <p role="alert" style={{ fontSize: 11, color: '#e5534b', marginBottom: 12, fontWeight: 500 }}>⚠ {errors.variants}</p>
      )}

      {/* Variant Table */}
      {data.variants.length > 0 && (
        <div style={{ overflowX: 'auto', marginBottom: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }} role="grid" aria-label="Size variants">
            <thead>
              <tr>
                {['', 'Size Name', variantTypeInfo.rangeLabel, 'Price', 'SKU', 'Stock', ''].map((h, i) => (
                  <th key={i} style={{
                    padding: '8px 10px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                    color: '#768390', textTransform: 'uppercase', letterSpacing: '0.05em',
                    borderBottom: '1px solid #444c56',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.variants.map((v, idx) => (
                <React.Fragment key={v.id}>
                  <tr
                    role="row"
                    draggable
                    onDragStart={() => setDraggingId(v.id)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleDrop(v.id)}
                    style={{
                      borderBottom: '1px solid rgba(68,76,86,0.4)',
                      background: expandedId === v.id ? 'rgba(0,181,102,0.06)' : 'transparent',
                      transition: 'background 0.15s',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => { if (expandedId !== v.id) (e.currentTarget as HTMLTableRowElement).style.background = '#22272e'; }}
                    onMouseLeave={e => { if (expandedId !== v.id) (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                  >
                    <td role="gridcell" style={{ padding: '8px 6px', color: '#545d68', cursor: 'grab', width: 20 }}>⠿</td>
                    <td role="gridcell" style={{ padding: '6px 8px', minWidth: 110 }}>
                      <input
                        type="text"
                        value={v.sizeName}
                        placeholder={`e.g. ${idx === 0 ? 'Small' : idx === 1 ? 'Medium' : 'Large'}`}
                        onChange={e => updateVariant(v.id, 'sizeName', e.target.value)}
                        style={{ ...inlineCellInput }}
                      />
                    </td>
                    <td role="gridcell" style={{ padding: '6px 8px', minWidth: 110 }}>
                      <input
                        type="text"
                        value={v.range}
                        placeholder="e.g. 40–50 cm"
                        onChange={e => updateVariant(v.id, 'range', e.target.value)}
                        style={{ ...inlineCellInput }}
                      />
                    </td>
                    <td role="gridcell" style={{ padding: '6px 8px', minWidth: 90 }}>
                      <input
                        type="number"
                        value={v.price}
                        placeholder="₹0"
                        min={0}
                        onChange={e => updateVariant(v.id, 'price', e.target.value)}
                        style={{ ...inlineCellInput }}
                      />
                    </td>
                    <td role="gridcell" style={{ padding: '6px 8px', minWidth: 110 }}>
                      <input
                        type="text"
                        value={v.sku}
                        placeholder="SKU-XXX"
                        onChange={e => updateVariant(v.id, 'sku', e.target.value)}
                        style={{ ...inlineCellInput, fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
                      />
                    </td>
                    <td role="gridcell" style={{ padding: '6px 8px', width: 72 }}>
                      <input
                        type="number"
                        value={v.stock}
                        min={0}
                        onChange={e => updateVariant(v.id, 'stock', parseInt(e.target.value) || 0)}
                        style={{ ...inlineCellInput, width: 64 }}
                      />
                    </td>
                    <td style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>
                      <button type="button" onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}
                        style={{ ...actionBtn, marginRight: 4 }}>
                        {expandedId === v.id ? '▲' : '▾'} Detail
                      </button>
                      <button type="button" onClick={() => removeVariant(v.id)}
                        style={{ ...actionBtn, color: '#e5534b' }}>✕</button>
                    </td>
                  </tr>
                  {/* Expanded detail row */}
                  {expandedId === v.id && (
                    <tr style={{ background: 'rgba(0,181,102,0.04)', borderBottom: '1px solid rgba(68,76,86,0.4)' }}>
                      <td colSpan={7} style={{ padding: '12px 16px' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#adbac7', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          ▼ {v.sizeName || 'Variant'} — Size Detail Card (shown on PDP)
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                          <div>
                            <FieldLabel>Best for</FieldLabel>
                            <Input type="text" placeholder="Most popular pick" value={v.bestFor}
                              onChange={e => updateVariant(v.id, 'bestFor', e.target.value)} />
                          </div>
                          <div>
                            <FieldLabel>Pot diameter</FieldLabel>
                            <Input type="text" placeholder="14 cm" value={v.potDiameter}
                              onChange={e => updateVariant(v.id, 'potDiameter', e.target.value)} />
                          </div>
                          <div>
                            <FieldLabel>Dispatch time</FieldLabel>
                            <Select value={v.dispatch} onChange={e => updateVariant(v.id, 'dispatch', e.target.value)}>
                              {DISPATCH_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                            </Select>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <GhostButton size="sm" onClick={addVariant}>+ Add Size Variant</GhostButton>

      {data.variants.length === 0 && (
        <p style={{ fontSize: 12, color: '#545d68', marginTop: 12 }}>No variants yet. Click &quot;+ Add Size Variant&quot; to start.</p>
      )}

      <InfoBanner>
        How this appears on the storefront: Size pill order matches the row order above. Drag rows to reorder pills.
        Selected size pill shows the detail card below with: height, best-for, pot diameter, and dispatch time.
      </InfoBanner>
    </Panel>
  );
}

const inlineCellInput: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: '1px solid transparent',
  borderRadius: 4,
  color: '#cdd9e5',
  fontSize: 12,
  fontFamily: "'Outfit', sans-serif",
  padding: '4px 6px',
  outline: 'none',
  transition: 'border-color 0.15s',
};

const actionBtn: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#768390',
  fontSize: 11,
  cursor: 'pointer',
  padding: '3px 6px',
  borderRadius: 4,
  fontFamily: "'Outfit', sans-serif",
};

