'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/* ─── Mock Data ──────────────────────────────────────────────────────────────── */
interface ProductRow {
  id: string;
  title: string;
  sku: string;
  status: 'active' | 'draft' | 'archived';
  type: string;
  category: string;
  price: string;
  stock: number;
  image: string;
  updatedAt: string;
}

const MOCK_PRODUCTS: ProductRow[] = [
  { id: '1', title: 'Monstera Deliciosa', sku: 'SKU-MM-001', status: 'active', type: 'Plant', category: 'Indoor Plants', price: '₹399', stock: 346, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=48&q=70', updatedAt: '5 mins ago' },
  { id: '2', title: 'Fiddle Leaf Fig', sku: 'SKU-FF-002', status: 'active', type: 'Plant', category: 'Indoor Plants', price: '₹649', stock: 124, image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=48&q=70', updatedAt: '2 hrs ago' },
  { id: '3', title: 'Snake Plant', sku: 'SKU-SP-003', status: 'draft', type: 'Plant', category: 'Indoor Plants', price: '₹299', stock: 512, image: 'https://images.unsplash.com/photo-1599598425947-5202edd56fec?w=48&q=70', updatedAt: 'Yesterday' },
  { id: '4', title: 'Peace Lily', sku: 'SKU-PL-004', status: 'active', type: 'Plant', category: 'Flowering Plants', price: '₹349', stock: 89, image: 'https://images.unsplash.com/photo-1616500102856-fe2d95cbcf00?w=48&q=70', updatedAt: '3 days ago' },
  { id: '5', title: 'Terracotta Pot 6"', sku: 'SKU-TP-005', status: 'active', type: 'Pot', category: 'Pots & Planters', price: '₹249', stock: 1200, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=48&q=70', updatedAt: '1 week ago' },
  { id: '6', title: 'Premium Potting Mix', sku: 'SKU-PM-006', status: 'draft', type: 'Soil', category: 'Soil & Fertiliser', price: '₹199', stock: 430, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=48&q=70', updatedAt: '2 weeks ago' },
  { id: '7', title: 'Bird of Paradise', sku: 'SKU-BP-007', status: 'archived', type: 'Plant', category: 'Indoor Plants', price: '₹899', stock: 0, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=48&q=70', updatedAt: '1 month ago' },
  { id: '8', title: 'Pothos Golden', sku: 'SKU-PG-008', status: 'active', type: 'Plant', category: 'Indoor Plants', price: '₹179', stock: 678, image: 'https://images.unsplash.com/photo-1502810190503-8303352d0dd1?w=48&q=70', updatedAt: '3 hrs ago' },
];

const STATUS_STYLES: Record<string, React.CSSProperties> = {
  active: { background: 'rgba(87,171,90,0.15)', color: '#57ab5a', border: '1px solid rgba(87,171,90,0.3)' },
  draft: { background: 'rgba(198,144,38,0.15)', color: '#c69026', border: '1px solid rgba(198,144,38,0.3)' },
  archived: { background: 'rgba(118,131,144,0.15)', color: '#768390', border: '1px solid rgba(118,131,144,0.3)' },
};

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = MOCK_PRODUCTS.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(p => p.id));

  const stats = {
    total: MOCK_PRODUCTS.length,
    active: MOCK_PRODUCTS.filter(p => p.status === 'active').length,
    draft: MOCK_PRODUCTS.filter(p => p.status === 'draft').length,
    archived: MOCK_PRODUCTS.filter(p => p.status === 'archived').length,
    lowStock: MOCK_PRODUCTS.filter(p => p.stock < 50 && p.stock > 0).length,
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#cdd9e5', margin: 0 }}>Products</h1>
          <p style={{ fontSize: 12, color: '#768390', marginTop: 4 }}>
            {stats.total} products · {stats.active} active · {stats.draft} draft
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" style={{
            background: 'transparent', border: '1px solid #444c56', borderRadius: 6,
            color: '#adbac7', fontSize: 12, fontWeight: 600, padding: '8px 14px', cursor: 'pointer',
          }}>Export CSV</button>
          <Link href="/admin/products/new" style={{
            background: '#00b566', border: 'none', borderRadius: 6,
            color: '#fff', fontSize: 12, fontWeight: 600, padding: '8px 18px',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            + Add Product
          </Link>
        </div>
      </div>

      {/* ── Stats Cards ──────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Products', value: stats.total, color: '#539bf5' },
          { label: 'Active', value: stats.active, color: '#57ab5a' },
          { label: 'Draft', value: stats.draft, color: '#c69026' },
          { label: 'Low Stock (< 50)', value: stats.lowStock, color: '#e5534b' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#1c2128', border: '1px solid #444c56', borderRadius: 8,
            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ width: 3, height: 36, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#cdd9e5', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: '#768390', marginTop: 3 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters + Search ─────────────────────────────────────────── */}
      <div style={{
        background: '#1c2128', border: '1px solid #444c56', borderRadius: '8px 8px 0 0',
        padding: '14px 20px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#545d68', fontSize: 12 }}>🔍</span>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products, SKU…"
            style={{
              width: '100%', height: 34, background: '#22272e', border: '1px solid #444c56',
              borderRadius: 6, color: '#cdd9e5', fontSize: 12,
              fontFamily: "'Outfit', sans-serif", paddingLeft: 30, paddingRight: 12, outline: 'none',
            }}
          />
        </div>
        {/* Status Filter */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'active', 'draft', 'archived'].map(s => (
            <button key={s} type="button" onClick={() => setFilterStatus(s)} style={{
              background: filterStatus === s ? 'rgba(0,181,102,0.12)' : 'transparent',
              border: `1px solid ${filterStatus === s ? '#00b566' : '#444c56'}`,
              color: filterStatus === s ? '#00b566' : '#768390',
              borderRadius: 6, fontSize: 11, fontWeight: 600, padding: '5px 12px',
              cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'Outfit', sans-serif",
              textTransform: 'capitalize',
            }}>{s}</button>
          ))}
        </div>
        {/* Bulk actions */}
        {selected.length > 0 && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }}>
            <span style={{ fontSize: 11, color: '#768390' }}>{selected.length} selected</span>
            <button type="button" style={{
              background: 'rgba(229,83,75,0.1)', border: '1px solid rgba(229,83,75,0.3)',
              borderRadius: 6, color: '#e5534b', fontSize: 11, fontWeight: 600, padding: '5px 12px', cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
            }}>Delete Selected</button>
          </div>
        )}
      </div>

      {/* ── Table ────────────────────────────────────────────────────── */}
      <div style={{
        background: '#1c2128', border: '1px solid #444c56', borderTop: 'none',
        borderRadius: '0 0 8px 8px', overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #444c56', background: '#161b22' }}>
              <th style={{ ...th, width: 40 }}>
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={toggleAll} style={{ cursor: 'pointer', accentColor: '#00b566' }} />
              </th>
              <th style={th}>Product</th>
              <th style={th}>Status</th>
              <th style={th}>Category</th>
              <th style={th}>Price</th>
              <th style={th}>Stock</th>
              <th style={th}>Updated</th>
              <th style={{ ...th, width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '48px 20px', textAlign: 'center', color: '#545d68', fontSize: 13 }}>
                  No products found. <Link href="/admin/products/new" style={{ color: '#00b566', textDecoration: 'none' }}>Create one →</Link>
                </td>
              </tr>
            ) : (
              filtered.map(product => (
                <tr
                  key={product.id}
                  style={{
                    borderBottom: '1px solid rgba(68,76,86,0.4)',
                    transition: 'background 0.12s',
                    background: selected.includes(product.id) ? 'rgba(0,181,102,0.05)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!selected.includes(product.id)) (e.currentTarget as HTMLTableRowElement).style.background = '#22272e'; }}
                  onMouseLeave={e => { if (!selected.includes(product.id)) (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                >
                  {/* Checkbox */}
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <input type="checkbox" checked={selected.includes(product.id)}
                      onChange={() => toggleSelect(product.id)} style={{ cursor: 'pointer', accentColor: '#00b566' }} />
                  </td>

                  {/* Product */}
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.image} alt={product.title} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                      <div>
                        <Link href={`/admin/products/${product.id}/edit`} style={{ fontSize: 13, fontWeight: 600, color: '#cdd9e5', textDecoration: 'none' }}>
                          {product.title}
                        </Link>
                        <p style={{ fontSize: 10, color: '#768390', marginTop: 1, fontFamily: 'JetBrains Mono, monospace' }}>{product.sku}</p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      ...STATUS_STYLES[product.status],
                      borderRadius: 9999, padding: '3px 9px', fontSize: 10, fontWeight: 700,
                      display: 'inline-block', textTransform: 'capitalize',
                    }}>{product.status}</span>
                  </td>

                  {/* Category */}
                  <td style={{ padding: '12px 14px', color: '#768390', fontSize: 11 }}>{product.category}</td>

                  {/* Price */}
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#cdd9e5' }}>{product.price}</td>

                  {/* Stock */}
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      color: product.stock === 0 ? '#e5534b' : product.stock < 50 ? '#c69026' : '#cdd9e5',
                      fontWeight: product.stock < 50 ? 700 : 400,
                    }}>
                      {product.stock === 0 ? 'Sold Out' : product.stock < 50 ? `⚠ ${product.stock}` : product.stock}
                    </span>
                  </td>

                  {/* Updated */}
                  <td style={{ padding: '12px 14px', color: '#768390', fontSize: 11 }}>{product.updatedAt}</td>

                  {/* Actions */}
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link href={`/admin/products/${product.id}/edit`} style={{
                        background: 'transparent', border: '1px solid #444c56', borderRadius: 5,
                        color: '#adbac7', fontSize: 11, fontWeight: 600, padding: '4px 10px',
                        textDecoration: 'none', display: 'inline-block',
                      }}>Edit</Link>
                      <button type="button" title="View on storefront" style={{
                        background: 'transparent', border: '1px solid #444c56', borderRadius: 5,
                        color: '#768390', fontSize: 11, padding: '4px 7px', cursor: 'pointer',
                      }}>↗</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div style={{
            padding: '12px 20px', borderTop: '1px solid rgba(68,76,86,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 11, color: '#768390' }}>
              Showing {filtered.length} of {MOCK_PRODUCTS.length} products
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3].map(p => (
                <button key={p} type="button" style={{
                  width: 30, height: 30,
                  background: p === 1 ? '#00b566' : 'transparent',
                  border: `1px solid ${p === 1 ? '#00b566' : '#444c56'}`,
                  borderRadius: 6, color: p === 1 ? '#fff' : '#768390',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif",
                }}>{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: '10px 14px',
  textAlign: 'left',
  fontSize: 10,
  fontWeight: 700,
  color: '#768390',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  whiteSpace: 'nowrap',
};
