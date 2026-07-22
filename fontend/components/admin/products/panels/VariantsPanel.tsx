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

const PRESETS: Record<VariantType, { names: string[]; ranges: string[] }> = {
  size: {
    names: ['Small', 'Medium', 'Large', 'Extra Large', 'Standard'],
    ranges: ['10–15 cm', '15–25 cm', '25–40 cm', '40–60 cm', '60–90 cm', '90–120 cm', 'Standard size']
  },
  diameter: {
    names: ['Small', 'Medium', 'Large', 'Extra Large', 'Standard', '6 cm', '8 cm', '10 cm', '12 cm', '14 cm', '16 cm', '18 cm', '20 cm'],
    ranges: ['6 cm', '8 cm', '10 cm', '12 cm', '14 cm', '16 cm', '18 cm', '20 cm', '25 cm', '30 cm', 'N/A']
  },
  pack: {
    names: ['Standard Pack', 'Value Pack', 'Bulk Pack', '5 Seeds', '10 Seeds', '20 Seeds', '50 Seeds', '100 Seeds', '200 Seeds', '500 Seeds'],
    ranges: ['5 seeds', '10 seeds', '20 seeds', '50 seeds', '100 seeds', '200 seeds', '500 seeds', '10 bulbs', '20 bulbs']
  },
  weight: {
    names: ['Small Pack', 'Medium Pack', 'Large Pack', 'Half kg', '1 kg', '2 kg', '5 kg', '10 kg', '1 Litre', '5 Litres', '10 Litres'],
    ranges: ['250 g', '500 g', '1 kg', '2 kg', '5 kg', '10 kg', '25 kg', '1 L', '2 L', '5 L', '10 L']
  },
  custom: {
    names: ['Standard', 'Single', 'Set of 2', 'Set of 5', 'Set of 10', 'Default'],
    ranges: ['Standard', 'Small', 'Medium', 'Large', 'N/A']
  }
};

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
                {['', 'Size Name', variantTypeInfo.rangeLabel, 'Price', 'SKU', 'Stock', ''].map((h, i) => {
                  const isRequired = ['Size Name', 'Price', 'SKU'].includes(h);
                  return (
                    <th key={i} style={{
                      padding: '8px 10px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                      color: '#768390', textTransform: 'uppercase', letterSpacing: '0.05em',
                      borderBottom: '1px solid #444c56',
                    }}>
                      {h}
                      {isRequired && <span style={{ color: '#e5534b', marginLeft: 4 }}>*</span>}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data.variants.map((v, idx) => {
                const presetNames = PRESETS[data.variantType]?.names || [];
                const presetRanges = PRESETS[data.variantType]?.ranges || [];
                const isCustomSizeName = v.sizeName !== '' && !presetNames.includes(v.sizeName);
                const isCustomRange = v.range !== '' && !presetRanges.includes(v.range);
                const isOnlyOneVariant = data.variants.length <= 1;

                return (
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
                      <td role="gridcell" style={{ padding: '6px 8px', minWidth: 120 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <select
                            value={isCustomSizeName ? '__custom__' : v.sizeName}
                            onChange={e => {
                              const val = e.target.value;
                              if (val === '__custom__') {
                                updateVariant(v.id, 'sizeName', 'Custom Value');
                              } else {
                                updateVariant(v.id, 'sizeName', val);
                              }
                            }}
                            style={{ ...inlineCellSelect }}
                          >
                            <option value="">Select size...</option>
                            {presetNames.map(n => <option key={n} value={n}>{n}</option>)}
                            <option value="__custom__">Custom...</option>
                          </select>
                          {(isCustomSizeName || v.sizeName === 'Custom Value') && (
                            <input
                              type="text"
                              value={v.sizeName === 'Custom Value' ? '' : v.sizeName}
                              placeholder="Enter custom size"
                              onChange={e => updateVariant(v.id, 'sizeName', e.target.value)}
                              style={{ ...inlineCellInput, border: '1px solid #444c56', padding: '2px 6px' }}
                            />
                          )}
                        </div>
                      </td>
                      <td role="gridcell" style={{ padding: '6px 8px', minWidth: 120 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <select
                            value={isCustomRange ? '__custom__' : v.range}
                            onChange={e => {
                              const val = e.target.value;
                              if (val === '__custom__') {
                                updateVariant(v.id, 'range', 'Custom Range');
                              } else {
                                updateVariant(v.id, 'range', val);
                              }
                            }}
                            style={{ ...inlineCellSelect }}
                          >
                            <option value="">Select range...</option>
                            {presetRanges.map(r => <option key={r} value={r}>{r}</option>)}
                            <option value="__custom__">Custom...</option>
                          </select>
                          {(isCustomRange || v.range === 'Custom Range') && (
                            <input
                              type="text"
                              value={v.range === 'Custom Range' ? '' : v.range}
                              placeholder="Enter custom range"
                              onChange={e => updateVariant(v.id, 'range', e.target.value)}
                              style={{ ...inlineCellInput, border: '1px solid #444c56', padding: '2px 6px' }}
                            />
                          )}
                        </div>
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
                        <button
                          type="button"
                          onClick={() => { if (!isOnlyOneVariant) removeVariant(v.id); }}
                          disabled={isOnlyOneVariant}
                          style={{
                            ...actionBtn,
                            color: isOnlyOneVariant ? '#545d68' : '#e5534b',
                            cursor: isOnlyOneVariant ? 'not-allowed' : 'pointer',
                          }}
                        >
                          ✕
                        </button>
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
                );
              })}
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

const inlineCellSelect: React.CSSProperties = {
  width: '100%',
  height: 28,
  background: '#22272e',
  border: '1px solid #444c56',
  borderRadius: 4,
  color: '#cdd9e5',
  fontSize: 12,
  fontFamily: "'Outfit', sans-serif",
  padding: '0 4px',
  outline: 'none',
  cursor: 'pointer',
};

