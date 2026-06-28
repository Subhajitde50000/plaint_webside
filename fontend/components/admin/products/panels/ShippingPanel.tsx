'use client';

import React from 'react';
import { ProductFormData, ValidationErrors } from '../types';
import { Panel, PanelHeading, FieldLabel, HelpText, Input, Select, Checkbox, Divider, InfoBanner } from '../ui';

interface Props {
  data: ProductFormData;
  errors: ValidationErrors;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

export function ShippingPanel({ data, errors, onChange }: Props) {
  return (
    <Panel>
      <PanelHeading>Shipping</PanelHeading>

      <div style={{ marginBottom: 16 }}>
        <Checkbox
          id="is-physical"
          label="This is a physical product"
          checked={data.isPhysical}
          onChange={v => onChange('isPhysical', v)}
        />
      </div>

      {data.isPhysical && (
        <>
          {/* Weight */}
          <div style={{ marginBottom: 16 }}>
            <FieldLabel>Weight (per unit, for shipping calculation)</FieldLabel>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={data.weight}
                onChange={e => onChange('weight', e.target.value)}
                style={{ width: 120 }}
              />
              <Select
                value={data.weightUnit}
                onChange={e => onChange('weightUnit', e.target.value)}
                style={{ width: 80 }}
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lb">lb</option>
              </Select>
            </div>
          </div>

          {/* Dimensions */}
          <div style={{ marginBottom: 16 }}>
            <FieldLabel>Dimensions</FieldLabel>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Input type="number" min="0" placeholder="Length" value={data.dimLength}
                onChange={e => onChange('dimLength', e.target.value)} style={{ width: 90 }} />
              <span style={{ color: '#768390', fontSize: 14 }}>×</span>
              <Input type="number" min="0" placeholder="Width" value={data.dimWidth}
                onChange={e => onChange('dimWidth', e.target.value)} style={{ width: 90 }} />
              <span style={{ color: '#768390', fontSize: 14 }}>×</span>
              <Input type="number" min="0" placeholder="Height" value={data.dimHeight}
                onChange={e => onChange('dimHeight', e.target.value)} style={{ width: 90 }} />
              <span style={{ color: '#768390', fontSize: 12 }}>cm</span>
            </div>
          </div>

          <Divider />

          {/* Delivery Info */}
          <div style={{
            marginBottom: 16,
            paddingBottom: 4,
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#adbac7', marginBottom: 12 }}>
              Delivery Info <span style={{ fontSize: 11, color: '#768390', fontWeight: 400 }}>(shown in PDP Delivery Box)</span>
            </p>

            <div style={{ marginBottom: 12 }}>
              <Checkbox
                id="free-delivery"
                label="This product qualifies for free delivery above ₹499"
                checked={data.freeDelivery}
                onChange={v => onChange('freeDelivery', v)}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <FieldLabel>Delivery ETA Label</FieldLabel>
              <Input
                type="text"
                placeholder="3–5 business days"
                value={data.deliveryEta}
                onChange={e => onChange('deliveryEta', e.target.value)}
              />
              <HelpText>🚚 Shown as first row in PDP delivery box</HelpText>
            </div>

            <div style={{ marginBottom: 12 }}>
              <FieldLabel>Health Guarantee Label</FieldLabel>
              <Input
                type="text"
                placeholder="7-day health guarantee"
                value={data.healthGuarantee}
                onChange={e => onChange('healthGuarantee', e.target.value)}
              />
              <HelpText>🔄 Shown as second row in PDP delivery box</HelpText>
            </div>

            <div>
              <FieldLabel>Packaging Label</FieldLabel>
              <Input
                type="text"
                placeholder="Eco-friendly packaging"
                value={data.packagingLabel}
                onChange={e => onChange('packagingLabel', e.target.value)}
              />
              <HelpText>📦 Shown as third row in PDP delivery box</HelpText>
            </div>
          </div>

          <InfoBanner>
            These three labels map directly to the three rows in the PDP Delivery Info Box: 🚚 ETA · 🔄 Guarantee · 📦 Packaging
          </InfoBanner>
        </>
      )}
    </Panel>
  );
}

