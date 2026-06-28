'use client';

import React, { useState } from 'react';
import { ProductFormData, FeaturePoint, SpecRow, CareCard, ValidationErrors } from '../types';
import { Panel, PanelHeading, FieldLabel, HelpText, GhostButton, Input, Select, Divider } from '../ui';
import { CARE_ICONS } from '../types';

interface Props {
  data: ProductFormData;
  errors: ValidationErrors;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

type TabKey = 'about' | 'care';

function genId() { return Date.now().toString() + Math.random(); }

/* ── Care Level Dots ── */
function CareLevelDots({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div
      role="slider"
      aria-valuemin={0}
      aria-valuemax={5}
      aria-valuenow={value}
      aria-label="Difficulty level"
      style={{ display: 'flex', gap: 4, alignItems: 'center' }}
      onKeyDown={e => {
        if (e.key === 'ArrowRight') onChange(Math.min(5, value + 1));
        if (e.key === 'ArrowLeft') onChange(Math.max(0, value - 1));
      }}
      tabIndex={0}
    >
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n === value ? n - 1 : n)}
          style={{
            width: 14, height: 14,
            borderRadius: '50%',
            background: n <= value ? '#00b566' : 'transparent',
            border: `2px solid ${n <= value ? '#00b566' : '#444c56'}`,
            cursor: 'pointer',
            padding: 0,
            transition: 'all 0.15s',
          }}
          aria-label={`Level ${n}`}
        />
      ))}
      <span style={{ fontSize: 11, color: '#768390', marginLeft: 4 }}>{value}/5</span>
    </div>
  );
}

export function TabsContentPanel({ data, errors, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('about');
  const [expandedCard, setExpandedCard] = useState<string | null>('1');

  /* Feature Points */
  const addFeature = () => {
    if (data.featurePoints.length >= 8) return;
    onChange('featurePoints', [...data.featurePoints, { id: genId(), text: '' }]);
  };
  const updateFeature = (id: string, text: string) => {
    onChange('featurePoints', data.featurePoints.map(f => f.id === id ? { ...f, text } : f));
  };
  const removeFeature = (id: string) => {
    onChange('featurePoints', data.featurePoints.filter(f => f.id !== id));
  };

  /* Spec Rows */
  const addSpec = () => {
    if (data.specRows.length >= 12) return;
    onChange('specRows', [...data.specRows, { id: genId(), label: '', value: '' }]);
  };
  const updateSpec = (id: string, field: 'label' | 'value', val: string) => {
    onChange('specRows', data.specRows.map(s => s.id === id ? { ...s, [field]: val } : s));
  };
  const removeSpec = (id: string) => {
    onChange('specRows', data.specRows.filter(s => s.id !== id));
  };

  /* Care Cards */
  const addCareCard = () => {
    if (data.careCards.length >= 6) return;
    onChange('careCards', [...data.careCards, { id: genId(), icon: '🌿', title: '', value: '', detail: '', level: 0 }]);
  };
  const updateCareCard = (id: string, field: keyof CareCard, val: unknown) => {
    onChange('careCards', data.careCards.map(c => c.id === id ? { ...c, [field]: val } : c));
  };
  const removeCareCard = (id: string) => {
    onChange('careCards', data.careCards.filter(c => c.id !== id));
  };

  return (
    <Panel>
      <PanelHeading>Storefront Tab Content</PanelHeading>

      {/* Tab bar */}
      <div role="tablist" style={{ display: 'flex', borderBottom: '1px solid #444c56', marginBottom: 20 }}>
        {([
          { key: 'about', label: 'About This Plant' },
          { key: 'care', label: 'Care Guide' },
        ] as const).map(tab => (
          <button
            key={tab.key}
            role="tab"
            type="button"
            aria-selected={activeTab === tab.key}
            aria-controls={`tabpanel-${tab.key}`}
            id={`tab-${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab.key ? '#00b566' : 'transparent'}`,
              color: activeTab === tab.key ? '#00b566' : '#768390',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
              padding: '8px 16px',
              cursor: 'pointer',
              marginBottom: -1,
              transition: 'all 0.15s',
            }}
          >{tab.label}</button>
        ))}
        <span style={{ fontSize: 11, color: '#545d68', alignSelf: 'center', marginLeft: 12 }}>
          Reviews — managed via Reviews module
        </span>
      </div>

      {/* ABOUT TAB */}
      {activeTab === 'about' && (
        <div role="tabpanel" id="tabpanel-about" aria-labelledby="tab-about">
          {/* Feature List */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#adbac7', marginBottom: 4 }}>Feature List</p>
            <HelpText>Yellow ✦ bullet points shown in About tab body</HelpText>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data.featurePoints.map((fp, idx) => (
                <div key={fp.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: '#c69026', fontSize: 14, flexShrink: 0 }}>✦</span>
                  <input
                    type="text"
                    value={fp.text}
                    placeholder={`e.g. Perfect for home and office spaces`}
                    onChange={e => updateFeature(fp.id, e.target.value)}
                    style={{
                      flex: 1, height: 34, background: '#22272e', border: '1px solid #444c56',
                      borderRadius: 6, color: '#cdd9e5', fontSize: 12, fontFamily: "'Outfit', sans-serif",
                      padding: '0 10px', outline: 'none',
                    }}
                  />
                  <button type="button" onClick={() => removeFeature(fp.id)} style={removeBtn}>✕</button>
                </div>
              ))}
            </div>
            <GhostButton size="sm" onClick={addFeature} style={{ marginTop: 8 }}>
              + Add feature point
            </GhostButton>
            {data.featurePoints.length >= 8 && (
              <HelpText>Maximum 8 feature points reached.</HelpText>
            )}
          </div>

          <Divider />

          {/* Plant Specifications Card */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#adbac7', marginBottom: 4 }}>Plant Specifications Card</p>
            <HelpText>Renders in the right-column spec card on the PDP About tab</HelpText>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 24px', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#768390', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Label</span>
                <span style={{ fontSize: 11, color: '#768390', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Value</span>
                <span />
              </div>
              {data.specRows.map(row => (
                <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 24px', gap: 8, alignItems: 'center' }}>
                  <input
                    type="text"
                    value={row.label}
                    placeholder="e.g. Botanical Name"
                    onChange={e => updateSpec(row.id, 'label', e.target.value)}
                    style={specInput}
                  />
                  <input
                    type="text"
                    value={row.value}
                    placeholder="Value"
                    onChange={e => updateSpec(row.id, 'value', e.target.value)}
                    style={specInput}
                  />
                  <button type="button" onClick={() => removeSpec(row.id)} style={removeBtn}>✕</button>
                </div>
              ))}
            </div>
            <GhostButton size="sm" onClick={addSpec} style={{ marginTop: 8 }}>+ Add spec row</GhostButton>
            {data.specRows.length >= 12 && <HelpText>Maximum 12 spec rows reached.</HelpText>}
          </div>
        </div>
      )}

      {/* CARE GUIDE TAB */}
      {activeTab === 'care' && (
        <div role="tabpanel" id="tabpanel-care" aria-labelledby="tab-care">
          <HelpText>Populates the 3×2 care card grid in the Care Guide tab on the PDP. Up to 6 cards.</HelpText>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.careCards.map((card, idx) => (
              <div key={card.id} style={{
                border: '1px solid #444c56', borderRadius: 6, overflow: 'hidden',
              }}>
                {/* Accordion header */}
                <button
                  type="button"
                  onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                  style={{
                    width: '100%', background: expandedCard === card.id ? '#22272e' : 'transparent',
                    border: 'none', padding: '10px 14px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#adbac7', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{card.icon}</span>
                    {card.title || `Care Card ${idx + 1}`}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#768390' }}>{expandedCard === card.id ? '▲' : '▾'}</span>
                    <button type="button" onClick={e => { e.stopPropagation(); removeCareCard(card.id); }} style={{ ...removeBtn, fontSize: 13 }}>✕</button>
                  </div>
                </button>
                {/* Expanded fields */}
                {expandedCard === card.id && (
                  <div style={{ padding: '14px 16px', borderTop: '1px solid #444c5650', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 12 }}>
                      <div>
                        <FieldLabel>Icon</FieldLabel>
                        <select
                          value={card.icon}
                          onChange={e => updateCareCard(card.id, 'icon', e.target.value)}
                          style={{ height: 36, background: '#22272e', border: '1px solid #444c56', borderRadius: 6, color: '#cdd9e5', fontSize: 18, padding: '0 8px', outline: 'none', width: '100%' }}
                        >
                          {CARE_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                      <div>
                        <FieldLabel>Title</FieldLabel>
                        <Input type="text" placeholder="e.g. Sunlight" value={card.title} onChange={e => updateCareCard(card.id, 'title', e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Value</FieldLabel>
                        <Input type="text" placeholder="e.g. Indirect bright light" value={card.value} onChange={e => updateCareCard(card.id, 'value', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Detail / Description</FieldLabel>
                      <textarea
                        value={card.detail}
                        placeholder="Expanded description text..."
                        onChange={e => updateCareCard(card.id, 'detail', e.target.value)}
                        rows={2}
                        style={{
                          width: '100%', minHeight: 64, background: '#22272e', border: '1px solid #444c56',
                          borderRadius: 6, color: '#cdd9e5', fontSize: 12, fontFamily: "'Outfit', sans-serif",
                          padding: '8px 12px', outline: 'none', resize: 'vertical',
                        }}
                      />
                    </div>
                    <div>
                      <FieldLabel>Difficulty Level (1–5)</FieldLabel>
                      <CareLevelDots value={card.level} onChange={v => updateCareCard(card.id, 'level', v)} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {data.careCards.length < 6 && (
            <GhostButton size="sm" onClick={addCareCard} style={{ marginTop: 12 }}>+ Add Care Card</GhostButton>
          )}
        </div>
      )}
    </Panel>
  );
}

const removeBtn: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#545d68',
  fontSize: 12,
  cursor: 'pointer',
  padding: '2px 4px',
  borderRadius: 4,
  lineHeight: 1,
  flexShrink: 0,
};

const specInput: React.CSSProperties = {
  width: '100%', height: 34,
  background: '#22272e', border: '1px solid #444c56',
  borderRadius: 6, color: '#cdd9e5', fontSize: 12,
  fontFamily: "'Outfit', sans-serif", padding: '0 10px', outline: 'none',
};

