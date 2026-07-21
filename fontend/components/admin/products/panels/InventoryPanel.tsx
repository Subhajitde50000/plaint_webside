'use client';

import React from 'react';
import { ProductFormData, ValidationErrors } from '../types';
import { Panel, PanelHeading, FieldLabel, HelpText, Input, Select, Checkbox, Divider } from '../ui';
import { WAREHOUSE_OPTIONS } from '../types';

interface Props {
  data: ProductFormData;
  errors: ValidationErrors;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

export function InventoryPanel({ data, errors, onChange }: Props) {
  return (
    <Panel>
      <PanelHeading>Inventory</PanelHeading>

      {/* SKU + Barcode */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <FieldLabel>SKU (Base)</FieldLabel>
          <Input
            type="text"
            placeholder="SKU-MM-001"
            value={data.baseSku}
            error={errors.baseSku}
            onChange={e => onChange('baseSku', e.target.value)}
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
          />
        </div>
        <div>
          <FieldLabel>Barcode / ISBN</FieldLabel>
          <Input
            type="text"
            placeholder="8901234567890"
            value={data.barcode}
            onChange={e => onChange('barcode', e.target.value)}
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
          />
        </div>
      </div>

      {/* Track Inventory */}
      <div style={{ marginBottom: 16 }}>
        <Checkbox
          id="track-inventory"
          label="Track inventory for this product"
          checked={data.trackInventory}
          onChange={v => onChange('trackInventory', v)}
        />
      </div>

      {/* Stock Per Variant */}
      {data.trackInventory && data.variants.length > 1 && (
        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Stock Quantity (per variant)</FieldLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
            {data.variants.map(v => (
              <div key={v.id} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#768390' }}>{v.sizeName || 'Variant'}</span>
                <input
                  type="number"
                  value={v.stock}
                  min={0}
                  onChange={e => {
                    const updated = data.variants.map(vv => vv.id === v.id ? { ...vv, stock: parseInt(e.target.value) || 0 } : vv);
                    onChange('variants', updated);
                  }}
                  style={{
                    width: 72, height: 36,
                    background: '#22272e', border: '1px solid #444c56',
                    borderRadius: 6, color: '#cdd9e5', fontSize: 12,
                    fontFamily: "'Outfit', sans-serif",
                    textAlign: 'center', outline: 'none', padding: '0 8px',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simple Product Stock Input (when 0 or 1 standard variant exists) */}
      {data.trackInventory && (data.variants.length === 0 || (data.variants.length === 1 && data.variants[0].sizeName === 'Standard')) && (
        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Stock Quantity</FieldLabel>
          <input
            type="number"
            value={data.variants[0]?.stock ?? 0}
            min={0}
            onChange={e => {
              const stockVal = parseInt(e.target.value) || 0;
              onChange('variants', [{
                id: data.variants[0]?.id || 'new-standard',
                sizeName: 'Standard',
                range: '',
                price: data.currentPrice || '0',
                sku: data.baseSku || '',
                stock: stockVal,
                bestFor: '',
                potDiameter: '',
                dispatch: '',
              }]);
            }}
            style={{
              width: 120, height: 36,
              background: '#22272e', border: '1px solid #444c56',
              borderRadius: 6, color: '#cdd9e5', fontSize: 12,
              fontFamily: "'Outfit', sans-serif",
              outline: 'none', padding: '0 12px', marginTop: 8,
            }}
          />
        </div>
      )}

      <Divider />

      {/* Reorder Level + Low Stock Alert */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <FieldLabel>Reorder Level</FieldLabel>
          <Input
            type="number"
            min="0"
            placeholder="20"
            value={data.reorderLevel}
            onChange={e => onChange('reorderLevel', e.target.value)}
          />
          <HelpText>A low stock alert appears on the dashboard when stock falls below this number.</HelpText>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
          <Checkbox
            id="low-stock-alert"
            label="Notify when below level"
            checked={data.lowStockAlert}
            onChange={v => onChange('lowStockAlert', v)}
          />
        </div>
      </div>

      <Divider />

      {/* Stock Policy */}
      <div style={{ marginBottom: 16 }}>
        <FieldLabel>Stock Policy</FieldLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {([
            { value: 'deny', label: 'Deny orders when out of stock', hint: 'Shows "Sold Out" on PDP' },
            { value: 'backorder', label: 'Allow backorders', hint: 'Shows "Pre-order" badge on PDP' },
            { value: 'continue', label: 'Continue selling', hint: 'No stock warning on PDP' },
          ] as const).map(opt => (
            <label key={opt.value} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <div
                onClick={() => onChange('stockPolicy', opt.value)}
                style={{
                  width: 16, height: 16, borderRadius: '50%', marginTop: 1,
                  border: `2px solid ${data.stockPolicy === opt.value ? '#00b566' : '#444c56'}`,
                  background: data.stockPolicy === opt.value ? '#00b566' : 'transparent',
                  flexShrink: 0, cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {data.stockPolicy === opt.value && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'block' }} />}
              </div>
              <div>
                <span style={{ fontSize: 12, color: '#cdd9e5' }}>{opt.label}</span>
                <span style={{ fontSize: 11, color: '#768390', marginLeft: 6 }}>— {opt.hint}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <Divider />

      {/* Warehouse */}
      <div>
        <FieldLabel>Warehouse / Location</FieldLabel>
        <Select
          value={data.warehouse}
          onChange={e => onChange('warehouse', e.target.value)}
        >
          {WAREHOUSE_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
        </Select>
      </div>
    </Panel>
  );
}

