'use client';

import React, { useState, useEffect } from 'react';
import { ProductFormData, ValidationErrors } from '../types';
import { Panel, FieldLabel, HelpText, Input, GhostButton, CharCounter, Divider } from '../ui';

interface Props {
  data: ProductFormData;
  errors: ValidationErrors;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function SEOPanel({ data, errors, onChange }: Props) {
  const [expanded, setExpanded] = useState(false);

  // Auto-generate URL handle from title
  useEffect(() => {
    if (!data.urlHandle && data.title) {
      onChange('urlHandle', slugify(data.title));
    }
  }, [data.title]);

  // Auto-fill SEO title from product title
  const seoTitleLen = data.seoTitle.length;
  const metaDescLen = data.seoDescription.length;
  const seoTitleColor = seoTitleLen > 70 ? '#e5534b' : seoTitleLen >= 65 ? '#c69026' : '#768390';
  const metaDescColor = metaDescLen > 160 ? '#e5534b' : metaDescLen >= 150 ? '#c69026' : '#768390';

  const displayTitle = data.seoTitle || data.title || 'Product Title — Hero Plants';
  const displayDesc = data.seoDescription || data.shortDescription || 'Meta description will appear here…';
  const displayUrl = `heroplants.com/products/${data.urlHandle || 'product-url'}`;

  const seoScore = (data.seoTitle && data.seoDescription && data.urlHandle)
    ? (seoTitleLen <= 70 && metaDescLen <= 160 ? 'Good' : 'Needs improvement')
    : 'Incomplete';
  const scoreColor = seoScore === 'Good' ? '#57ab5a' : seoScore === 'Needs improvement' ? '#c69026' : '#e5534b';

  return (
    <Panel>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#cdd9e5', fontFamily: "'Outfit', sans-serif" }}>SEO &amp; Search Visibility</p>
          <span style={{
            display: 'inline-block', marginTop: 4,
            background: scoreColor + '20', color: scoreColor,
            border: `1px solid ${scoreColor}60`,
            borderRadius: 9999, padding: '2px 8px', fontSize: 10, fontWeight: 700,
          }}>{seoScore}</span>
        </div>
        <GhostButton size="sm" onClick={() => setExpanded(e => !e)}>
          {expanded ? 'Collapse' : 'Edit'}
        </GhostButton>
      </div>

      {/* Live Search Preview */}
      <div style={{
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: 6, padding: 12, marginBottom: 14,
      }}>
        <p style={{
          fontSize: 11, color: '#1a0dab', marginBottom: 2,
          textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          fontFamily: 'Arial, sans-serif',
        }}>{displayUrl}</p>
        <p style={{
          fontSize: 14, color: '#1a0dab', fontWeight: 500, marginBottom: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          fontFamily: 'Arial, sans-serif',
        }}>{displayTitle.slice(0, 60)}</p>
        <p style={{
          fontSize: 12, color: '#4d5156', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          fontFamily: 'Arial, sans-serif',
        }}>{displayDesc}</p>
      </div>

      {!expanded && (
        <p style={{ fontSize: 11, color: '#545d68', textAlign: 'center' }}>
          Click &quot;Edit&quot; to manage SEO settings
        </p>
      )}

      {expanded && (
        <>
          <Divider />

          {/* SEO Title */}
          <div style={{ marginBottom: 14 }}>
            <FieldLabel>Page Title</FieldLabel>
            <Input
              type="text"
              placeholder={`${data.title || 'Product'} — Hero Plants`}
              value={data.seoTitle}
              aria-label="SEO page title"
              error={errors.seoTitle}
              onChange={e => onChange('seoTitle', e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <HelpText>{seoTitleLen > 70 ? '⚠ Over 70 char limit' : seoTitleLen >= 65 ? 'Approaching limit' : 'Optimal length: 50–70 chars'}</HelpText>
              <span style={{ fontSize: 11, color: seoTitleColor, marginTop: 4 }}>{seoTitleLen} / 70</span>
            </div>
          </div>

          {/* Meta Description */}
          <div style={{ marginBottom: 14 }}>
            <FieldLabel>Meta Description</FieldLabel>
            <textarea
              value={data.seoDescription}
              aria-label="SEO meta description"
              placeholder="A compelling description of this product for search engines…"
              onChange={e => onChange('seoDescription', e.target.value)}
              rows={3}
              style={{
                width: '100%', minHeight: 72,
                background: '#22272e', border: '1px solid #444c56',
                borderRadius: 6, color: '#cdd9e5', fontSize: 12,
                fontFamily: "'Outfit', sans-serif", padding: '8px 12px', outline: 'none', resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <HelpText>{metaDescLen >= 150 ? '⚠ Approaching limit' : 'Optimal: 120–160 chars'}</HelpText>
              <span style={{ fontSize: 11, color: metaDescColor }}>{metaDescLen} / 160</span>
            </div>
          </div>

          {/* URL Handle */}
          <div>
            <FieldLabel>URL Handle</FieldLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <span style={{
                height: 36, padding: '0 10px',
                background: '#0f1117', border: '1px solid #444c56',
                borderRight: 'none', borderRadius: '6px 0 0 6px',
                display: 'flex', alignItems: 'center',
                fontSize: 11, color: '#545d68', whiteSpace: 'nowrap',
              }}>heroplants.com/products/</span>
              <input
                type="text"
                value={data.urlHandle}
                aria-label="URL handle"
                placeholder="product-url-handle"
                onChange={e => onChange('urlHandle', slugify(e.target.value))}
                style={{
                  flex: 1, height: 36,
                  background: '#22272e', border: '1px solid #444c56',
                  borderLeft: 'none', borderRadius: '0 6px 6px 0',
                  color: '#cdd9e5', fontSize: 12, fontFamily: "'Outfit', sans-serif",
                  padding: '0 12px', outline: 'none',
                }}
              />
            </div>
            <HelpText>Auto-generated from title. Only lowercase letters, numbers, and hyphens.</HelpText>
            {errors.urlHandle && <p role="alert" style={{ fontSize: 11, color: '#e5534b', marginTop: 4 }}>⚠ {errors.urlHandle}</p>}
          </div>
        </>
      )}
    </Panel>
  );
}

