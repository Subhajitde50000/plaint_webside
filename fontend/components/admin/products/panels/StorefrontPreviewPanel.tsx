'use client';

import React from 'react';
import { ProductFormData } from '../types';
import { Panel } from '../ui';

interface Props {
  data: ProductFormData;
  isNew: boolean;
}

export function StorefrontPreviewPanel({ data, isNew }: Props) {
  const primaryImage = data.images[0]?.url;
  const title = data.title || 'Product Name';
  const common = data.commonName;
  const price = data.currentPrice ? `₹${data.currentPrice}` : '—';
  const compareAt = data.compareAtPrice ? `₹${data.compareAtPrice}` : '';

  const slug = data.urlHandle || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '');
  const canOpen = !!slug && data.productStatus === 'active';

  let discount = '';
  if (data.currentPrice && data.compareAtPrice) {
    const c = parseFloat(data.currentPrice);
    const co = parseFloat(data.compareAtPrice);
    if (co > c) discount = `−${Math.round(((co - c) / co) * 100)}% off`;
  }

  return (
    <Panel>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#cdd9e5', fontFamily: "'Outfit', sans-serif" }}>
          Storefront Preview
        </p>
        {!isNew && (
          <a
            href={canOpen ? `/products/${slug}` : '#'}
            target={canOpen ? '_blank' : undefined}
            rel="noopener noreferrer"
            onClick={e => { if (!canOpen) e.preventDefault(); }}
            title={!slug ? 'Add a title first' : !canOpen ? 'Publish product first to view on storefront' : `Open /products/${slug}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'transparent', border: '1px solid #444c56',
              borderRadius: 6, color: canOpen ? '#adbac7' : '#545d68',
              fontSize: 11, fontWeight: 600, padding: '5px 10px',
              textDecoration: 'none', cursor: canOpen ? 'pointer' : 'not-allowed',
              opacity: canOpen ? 1 : 0.5, transition: 'all 0.15s',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Open ↗
          </a>
        )}
      </div>

      {/* Mini PDP Card */}
      <div style={{
        background: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
      }}>
        {/* Image */}
        <div style={{
          width: '100%', aspectRatio: '1/1',
          background: primaryImage ? 'transparent' : '#f5f5f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={primaryImage} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#ccc' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span style={{ fontSize: 11 }}>No image yet</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '12px 14px 14px' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#2D3A2E', lineHeight: 1.3 }}>{title}</p>
          {common && <p style={{ fontSize: 11, color: '#6B7C6D', marginTop: 2 }}>{common}</p>}

          {/* Rating mock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
            <span style={{ color: '#F5C842', fontSize: 11 }}>★★★★☆</span>
            <span style={{ fontSize: 10, color: '#6B7C6D' }}>4.3 (1,204)</span>
          </div>

          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#2D5A27' }}>{price}</span>
            {compareAt && <span style={{ fontSize: 12, color: '#999', textDecoration: 'line-through' }}>{compareAt}</span>}
            {discount && (
              <span style={{
                background: '#fff0c2', color: '#8a6200',
                borderRadius: 9999, padding: '2px 7px', fontSize: 10, fontWeight: 700,
              }}>{discount}</span>
            )}
          </div>

          {/* Size pills */}
          {data.variants.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {data.variants.slice(0, 4).map((v, i) => (
                <span key={v.id} style={{
                  padding: '4px 10px', borderRadius: 6,
                  background: i === 0 ? '#2D5A27' : 'transparent',
                  color: i === 0 ? '#fff' : '#2D3A2E',
                  border: `1px solid ${i === 0 ? '#2D5A27' : '#ccc'}`,
                  fontSize: 11, fontWeight: 600,
                }}>{v.sizeName || `Size ${i + 1}`}</span>
              ))}
            </div>
          )}

          {/* CTA */}
          <button type="button" style={{
            width: '100%', marginTop: 10, height: 36,
            background: '#2D5A27', border: 'none', borderRadius: 8,
            color: '#fff', fontSize: 12, fontWeight: 700,
            fontFamily: "'Outfit', sans-serif", cursor: 'default',
          }}>
            + Add to Cart
          </button>
        </div>
      </div>

      <p style={{ fontSize: 11, color: '#545d68', textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
        Preview reflects current unsaved form data in real-time.
      </p>

      {/* Preview links */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {[
          { label: 'Preview PDP →', href: slug ? `/products/${slug}` : '#' },
          { label: 'Preview PLP Card', href: slug ? `/collections/plants` : '#' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target={slug ? '_blank' : undefined}
            rel="noopener noreferrer"
            onClick={e => { if (!slug) e.preventDefault(); }}
            title={slug ? `Open ${href}` : 'Add a product title first'}
            style={{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: '1px solid #444c56',
              borderRadius: 6, color: slug ? '#adbac7' : '#545d68',
              fontSize: 11, fontWeight: 600, padding: '6px 8px',
              textDecoration: 'none', cursor: slug ? 'pointer' : 'not-allowed',
              opacity: slug ? 1 : 0.5, transition: 'all 0.15s',
              fontFamily: "'Outfit', sans-serif",
            }}
          >{label}</a>
        ))}
      </div>
    </Panel>
  );
}

