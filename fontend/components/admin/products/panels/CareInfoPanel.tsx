'use client';

import React from 'react';
import { ProductFormData, ValidationErrors } from '../types';
import { Panel, PanelHeading, FieldLabel, HelpText, Select, Input, Checkbox, Divider } from '../ui';
import { LIGHT_OPTIONS, WATER_OPTIONS, SKILL_OPTIONS } from '../types';

interface Props {
  data: ProductFormData;
  errors: ValidationErrors;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

export function CareInfoPanel({ data, errors, onChange }: Props) {
  const chips = [
    { icon: '☀️', label: data.lightRequirement || 'Light', key: 'light' },
    { icon: '💧', label: data.waterFrequency || 'Water', key: 'water' },
    { icon: '🌡️', label: data.temperatureRange || 'Temp', key: 'temp' },
    { icon: '🌿', label: data.skillLevel || 'Skill', key: 'skill' },
  ];

  return (
    <Panel>
      <div style={{ marginBottom: 4 }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#cdd9e5', fontFamily: "'Outfit', sans-serif", marginBottom: 2 }}>
          Care Quick-Chips
        </p>
        <p style={{ fontSize: 11, color: '#768390' }}>4-column grid shown on storefront PDP</p>
      </div>

      <Divider />

      {/* Light */}
      <div style={{ marginBottom: 12 }}>
        <FieldLabel>Light</FieldLabel>
        <Select value={data.lightRequirement} onChange={e => onChange('lightRequirement', e.target.value)}>
          <option value="">Select light requirement…</option>
          {LIGHT_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
        </Select>
      </div>

      {/* Water */}
      <div style={{ marginBottom: 12 }}>
        <FieldLabel>Water Frequency</FieldLabel>
        <Select value={data.waterFrequency} onChange={e => onChange('waterFrequency', e.target.value)}>
          <option value="">Select water frequency…</option>
          {WATER_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
        </Select>
      </div>

      {/* Temperature */}
      <div style={{ marginBottom: 12 }}>
        <FieldLabel>Temperature Range</FieldLabel>
        <Input
          type="text"
          placeholder="e.g. 18–27°C"
          value={data.temperatureRange}
          onChange={e => onChange('temperatureRange', e.target.value)}
        />
      </div>

      {/* Skill Level */}
      <div style={{ marginBottom: 12 }}>
        <FieldLabel>Skill Level</FieldLabel>
        <Select value={data.skillLevel} onChange={e => onChange('skillLevel', e.target.value)}>
          <option value="">Select skill level…</option>
          {SKILL_OPTIONS.map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
        </Select>
      </div>

      <Divider />

      {/* Pet Friendly + Air Purifying */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <Checkbox id="pet-friendly" label="Safe for pets" checked={data.petFriendly} onChange={v => onChange('petFriendly', v)} />
        <Checkbox id="air-purifying" label="Air purifying plant" checked={data.airPurifying} onChange={v => onChange('airPurifying', v)} />
      </div>

      <Divider />

      {/* Live Mini Preview */}
      <div>
        <p style={{ fontSize: 11, color: '#768390', marginBottom: 8 }}>Preview</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {chips.map(chip => (
            <div key={chip.key} style={{
              background: '#22272e', border: '1px solid #444c56',
              borderRadius: 6, padding: '8px 6px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <span style={{ fontSize: 20 }}>{chip.icon}</span>
              <span style={{
                fontSize: 10, color: '#adbac7', fontWeight: 600,
                textAlign: 'center', lineHeight: 1.3,
                overflow: 'hidden', textOverflow: 'ellipsis',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                maxWidth: '100%',
              }}>{chip.label}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10, color: '#545d68', textAlign: 'center', marginTop: 6 }}>
          Live preview of PDP care chips
        </p>
      </div>
    </Panel>
  );
}

