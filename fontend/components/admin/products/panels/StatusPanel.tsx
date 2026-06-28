'use client';

import React from 'react';
import { ProductFormData, ProductStatus, ValidationErrors } from '../types';
import { Panel, PanelHeading, FieldLabel, HelpText, Select, Checkbox, Input, Divider } from '../ui';

interface Props {
  data: ProductFormData;
  errors: ValidationErrors;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

const STATUS_OPTIONS: { value: ProductStatus; label: string; dot: string; hint: string }[] = [
  { value: 'active', label: 'Active', dot: '#57ab5a', hint: 'Live on storefront' },
  { value: 'draft', label: 'Draft', dot: '#c69026', hint: 'Hidden from customers' },
  { value: 'archived', label: 'Archived', dot: '#768390', hint: 'Removed from all listings' },
];

export function StatusPanel({ data, errors, onChange }: Props) {
  const currentStatus = STATUS_OPTIONS.find(s => s.value === data.productStatus) ?? STATUS_OPTIONS[1];

  return (
    <Panel>
      <PanelHeading>Status</PanelHeading>

      {/* Status select */}
      <div style={{ marginBottom: 16 }}>
        <FieldLabel>Product Status</FieldLabel>
        <div style={{ position: 'relative' }}>
          <select
            value={data.productStatus}
            aria-label="Product status"
            onChange={e => onChange('productStatus', e.target.value)}
            style={{
              width: '100%', height: 36,
              background: '#22272e', border: '1px solid #444c56',
              borderRadius: 6, color: '#cdd9e5', fontSize: 12,
              fontFamily: "'Outfit', sans-serif",
              padding: '0 32px 0 30px', outline: 'none', appearance: 'none', cursor: 'pointer',
            }}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          {/* Status dot inside select */}
          <span style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            width: 8, height: 8, borderRadius: '50%', background: currentStatus.dot,
            pointerEvents: 'none',
          }} />
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#768390', fontSize: 10, pointerEvents: 'none' }}>▾</span>
        </div>

        {/* Status options with hints */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
          {STATUS_OPTIONS.map(opt => (
            <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              onClick={() => onChange('productStatus', opt.value)}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: data.productStatus === opt.value ? opt.dot : 'transparent',
                border: `2px solid ${opt.dot}`,
                flexShrink: 0, transition: 'all 0.15s',
              }} />
              <span style={{ fontSize: 12, color: data.productStatus === opt.value ? '#cdd9e5' : '#768390' }}>
                {opt.label} — {opt.hint}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Divider />

      {/* Sales Channels */}
      <div style={{ marginBottom: 16 }}>
        <FieldLabel>Sales Channels</FieldLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
          <Checkbox id="online-store" label="Online Store" checked={data.onlineStore} onChange={v => onChange('onlineStore', v)} />
          <Checkbox id="point-of-sale" label="Point of Sale" checked={data.pointOfSale} onChange={v => onChange('pointOfSale', v)} />
        </div>
      </div>

      <Divider />

      {/* Schedule Publish */}
      <div>
        <FieldLabel>Publish Date (optional)</FieldLabel>
        <Checkbox
          id="schedule-publish"
          label="Schedule publish date"
          checked={data.schedulePublish}
          onChange={v => onChange('schedulePublish', v)}
        />
        {data.schedulePublish && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
            <div>
              <FieldLabel>Date</FieldLabel>
              <Input type="date" value={data.publishDate} onChange={e => onChange('publishDate', e.target.value)} />
            </div>
            <div>
              <FieldLabel>Time</FieldLabel>
              <Input type="time" value={data.publishTime} onChange={e => onChange('publishTime', e.target.value)} />
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

