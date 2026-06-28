'use client';

import React from 'react';
import { ProductFormData, ValidationErrors } from '../types';
import { Panel, PanelHeading, FieldLabel, HelpText, Input, Select, Checkbox, Divider } from '../ui';
import { TAX_OPTIONS } from '../types';

interface Props {
  data: ProductFormData;
  errors: ValidationErrors;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

function calcDiscount(current: string, compare: string): string {
  const c = parseFloat(current);
  const co = parseFloat(compare);
  if (!c || !co || co <= c) return '';
  return `${Math.round(((co - c) / co) * 100)}% off`;
}

export function PricingPanel({ data, errors, onChange }: Props) {
  const autoDiscount = calcDiscount(data.currentPrice, data.compareAtPrice);

  return (
    <Panel>
      <PanelHeading>Pricing</PanelHeading>

      {/* Three price fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <FieldLabel required>Current Price</FieldLabel>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            prefix="₹"
            value={data.currentPrice}
            error={errors.currentPrice}
            aria-label="Current price"
            onChange={e => onChange('currentPrice', e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Compare At Price</FieldLabel>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            prefix="₹"
            value={data.compareAtPrice}
            error={errors.compareAtPrice}
            aria-label="Compare at price"
            onChange={e => onChange('compareAtPrice', e.target.value)}
          />
          <HelpText>Original / strikethrough on storefront PDP</HelpText>
        </div>
        <div>
          <FieldLabel>Cost Per Unit</FieldLabel>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            prefix="₹"
            value={data.costPerUnit}
            aria-label="Cost per unit"
            onChange={e => onChange('costPerUnit', e.target.value)}
          />
        </div>
      </div>

      {/* Auto-discount preview */}
      {autoDiscount && !data.showCustomBadge && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#fff0c2', color: '#8a6200',
          borderRadius: 9999, padding: '3px 10px',
          fontSize: 11, fontWeight: 700, marginBottom: 16,
        }}>
          🏷️ Auto badge: {autoDiscount}
        </div>
      )}

      {/* Discount Badge */}
      <div style={{ marginBottom: 16 }}>
        <Checkbox
          id="show-custom-badge"
          label="Show custom discount badge text"
          checked={data.showCustomBadge}
          onChange={v => onChange('showCustomBadge', v)}
        />
        {data.showCustomBadge && (
          <div style={{ marginTop: 8 }}>
            <Input
              type="text"
              placeholder="e.g. 33% off"
              value={data.discountBadgeText}
              onChange={e => onChange('discountBadgeText', e.target.value)}
            />
            <HelpText>When blank: auto-calculates from current vs compare-at price</HelpText>
          </div>
        )}
      </div>

      <Divider />

      {/* Tax */}
      <div style={{ marginBottom: 16 }}>
        <FieldLabel>Tax</FieldLabel>
        <Checkbox
          id="taxable"
          label="This product is taxable"
          checked={data.isTaxable}
          onChange={v => onChange('isTaxable', v)}
        />
        {data.isTaxable && (
          <div style={{ marginTop: 10 }}>
            <FieldLabel>Tax Rate</FieldLabel>
            <Select
              value={data.taxRate}
              onChange={e => onChange('taxRate', e.target.value)}
              style={{ width: 200 }}
            >
              {TAX_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>
        )}
      </div>

      <Divider />

      {/* Price Note */}
      <div>
        <FieldLabel>Price Note</FieldLabel>
        <Input
          type="text"
          placeholder="incl. of all taxes"
          value={data.priceNote}
          onChange={e => onChange('priceNote', e.target.value)}
        />
        <HelpText>Shown as sub-text on the PDP below the price.</HelpText>
      </div>
    </Panel>
  );
}

