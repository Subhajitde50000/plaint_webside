'use client';

import React from 'react';
import { ProductFormData, ProductType, ValidationErrors } from '../types';
import { Panel, PanelHeading, FieldLabel } from '../ui';

interface Props {
  data: ProductFormData;
  errors: ValidationErrors;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

const PRODUCT_TYPES: { value: ProductType; emoji: string; label: string; hint: string }[] = [
  { value: 'plant', emoji: '🌿', label: 'Plant (bare-root)', hint: 'Enables Care Info, Pot Upsell, and Size/Height variants' },
  { value: 'pot', emoji: '🪴', label: 'Pot / Planter', hint: 'Diameter variant type. No care or upsell panels.' },
  { value: 'seed', emoji: '🌱', label: 'Seed / Bulb', hint: 'Pack size variant. Care info shown.' },
  { value: 'soil', emoji: '🧱', label: 'Soil / Fertiliser', hint: 'Weight/Volume variant. No care panel.' },
  { value: 'tool', emoji: '🔧', label: 'Tool / Accessory', hint: 'Optional variants. No care or upsell.' },
];

const RULES: Record<ProductType, { yes: string[]; no: string[] }> = {
  plant: {
    yes: ['Size/Height variant type auto-set', 'Pot Upsell Strip panel shown', 'Care Info panel shown', '"Pot not included" hint on size pills'],
    no: ['Pot selector never shown as variant'],
  },
  pot: {
    yes: ['Diameter variant type auto-set'],
    no: ['Care Info panel hidden', 'Pot Upsell hidden'],
  },
  seed: {
    yes: ['Pack size variant auto-set', 'Care Info panel shown'],
    no: ['Pot Upsell hidden'],
  },
  soil: {
    yes: ['Weight/Volume variant auto-set'],
    no: ['Care Info panel hidden', 'Pot Upsell hidden'],
  },
  tool: {
    yes: ['Custom variant type (optional)'],
    no: ['Care Info panel hidden', 'Pot Upsell hidden'],
  },
};

export function ProductTypePanel({ data, errors, onChange }: Props) {
  const handleTypeChange = (type: ProductType) => {
    onChange('productType', type);
    // Auto-set variant type based on product type
    const variantMap: Record<ProductType, string> = {
      plant: 'size',
      pot: 'diameter',
      seed: 'pack',
      soil: 'weight',
      tool: 'custom',
    };
    onChange('variantType', variantMap[type]);
  };

  const rules = RULES[data.productType];

  return (
    <Panel>
      <PanelHeading>Product Type <span style={{ color: '#e5534b', marginLeft: 4 }}>*</span></PanelHeading>
      {errors.productType && (
        <p role="alert" style={{ fontSize: 11, color: '#e5534b', marginBottom: 10, fontWeight: 500 }}>⚠ {errors.productType}</p>
      )}

      <div
        role="radiogroup"
        aria-label="Product type"
        aria-required="true"
        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        {PRODUCT_TYPES.map(pt => {
          const isActive = data.productType === pt.value;
          return (
            <label key={pt.value} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '10px 12px', borderRadius: 6,
              background: isActive ? 'rgba(0,181,102,0.08)' : 'transparent',
              border: `1px solid ${isActive ? '#00b566' : '#444c56'}`,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              <div
                onClick={() => handleTypeChange(pt.value)}
                style={{
                  width: 16, height: 16, borderRadius: '50%', marginTop: 2, flexShrink: 0,
                  border: `2px solid ${isActive ? '#00b566' : '#444c56'}`,
                  background: isActive ? '#00b566' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {isActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'block' }} />}
              </div>
              <input type="radio" name="productType" value={pt.value} checked={isActive}
                onChange={() => handleTypeChange(pt.value)} style={{ display: 'none' }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? '#cdd9e5' : '#adbac7' }}>
                  {pt.emoji} {pt.label}
                </div>
                <div style={{ fontSize: 11, color: '#545d68', marginTop: 2 }}>{pt.hint}</div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Rules preview */}
      <div style={{
        marginTop: 14, padding: '10px 12px',
        background: '#0f1117', borderRadius: 6,
        border: '1px solid rgba(68,76,86,0.5)',
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#adbac7', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Active Rules
        </p>
        {rules.yes.map(r => (
          <p key={r} style={{ fontSize: 11, color: '#57ab5a', marginBottom: 2 }}>✓ {r}</p>
        ))}
        {rules.no.map(r => (
          <p key={r} style={{ fontSize: 11, color: '#768390', marginBottom: 2 }}>✗ {r}</p>
        ))}
      </div>
    </Panel>
  );
}

