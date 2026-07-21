'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminProducts, useDeleteProduct } from '@/features/admin/hooks/useAdminProducts';
import { AdminProductListItem } from '@/features/admin/api/admin-products.api';

const STATUS_STYLES: Record<string, React.CSSProperties> = {
  active: { background: 'rgba(87,171,90,0.15)', color: '#57ab5a', border: '1px solid rgba(87,171,90,0.3)' },
  draft: { background: 'rgba(198,144,38,0.15)', color: '#c69026', border: '1px solid rgba(198,144,38,0.3)' },
  archived: { background: 'rgba(118,131,144,0.15)', color: '#768390', border: '1px solid rgba(118,131,144,0.3)' },
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const { data, isLoading, isError, refetch } = useAdminProducts({
    status: filterStatus === 'all' ? undefined : filterStatus,
    q: search.trim() || undefined,
    page,
    pageSize: 25,
  });

  const deleteMutation = useDeleteProduct();

  const products: AdminProductListItem[] = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  const toggleSelect = (id: string) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const toggleAll = () => {
    setSelected(s => s.length === products.length ? [] : products.map(p => String(p.id)));
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to archive/delete this product?')) return;
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      setSelected(s => s.filter(x => x !== String(id)));
    } catch (err: any) {
      alert('Failed to delete product: ' + (err?.response?.data?.detail || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selected.length} selected products?`)) return;
    for (const id of selected) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error(`Failed to delete product ${id}`, err);
      }
    }
    setSelected([]);
    refetch();
  };

  const handleExportCSV = () => {
    if (!products.length) return alert('No products to export');
    const headers = ['ID', 'Title', 'Slug', 'Status', 'Product Type', 'Price', 'Care Skill', 'Rating'];
    const rows = products.map(p => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.slug,
      p.status,
      p.product_type,
      p.base_price,
      p.care_skill || '',
      p.rating_average || 0
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `products_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = {
    total,
    active: products.filter(p => p.status === 'active').length,
    draft: products.filter(p => p.status === 'draft').length,
    archived: products.filter(p => p.status === 'archived').length,
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#cdd9e5', margin: 0 }}>Products</h1>
          <p style={{ fontSize: 12, color: '#768390', marginTop: 4 }}>
            {stats.total} total products in database
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={handleExportCSV}
            style={{
              background: 'transparent', border: '1px solid #444c56', borderRadius: 6,
              color: '#adbac7', fontSize: 12, fontWeight: 600, padding: '8px 14px', cursor: 'pointer',
            }}
          >
            Export CSV
          </button>
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
          { label: 'Total Products', value: total, color: '#539bf5' },
          { label: 'Page Active', value: stats.active, color: '#57ab5a' },
          { label: 'Page Draft', value: stats.draft, color: '#c69026' },
          { label: 'Page Archived', value: stats.archived, color: '#768390' },
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
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products by title…"
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
            <button
              key={s}
              type="button"
              onClick={() => { setFilterStatus(s); setPage(1); }}
              style={{
                background: filterStatus === s ? 'rgba(0,181,102,0.12)' : 'transparent',
                border: `1px solid ${filterStatus === s ? '#00b566' : '#444c56'}`,
                color: filterStatus === s ? '#00b566' : '#768390',
                borderRadius: 6, fontSize: 11, fontWeight: 600, padding: '5px 12px',
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'Outfit', sans-serif",
                textTransform: 'capitalize',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Bulk actions */}
        {selected.length > 0 && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }}>
            <span style={{ fontSize: 11, color: '#768390' }}>{selected.length} selected</span>
            <button
              type="button"
              onClick={handleBulkDelete}
              style={{
                background: 'rgba(229,83,75,0.1)', border: '1px solid rgba(229,83,75,0.3)',
                borderRadius: 6, color: '#e5534b', fontSize: 11, fontWeight: 600, padding: '5px 12px', cursor: 'pointer',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Delete Selected
            </button>
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
                <input
                  type="checkbox"
                  checked={selected.length === products.length && products.length > 0}
                  onChange={toggleAll}
                  style={{ cursor: 'pointer', accentColor: '#00b566' }}
                />
              </th>
              <th style={th}>Product</th>
              <th style={th}>Status</th>
              <th style={th}>Type</th>
              <th style={th}>Base Price</th>
              <th style={th}>Care Skill</th>
              <th style={{ ...th, width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(68,76,86,0.4)' }}>
                  <td colSpan={7} style={{ padding: '16px 20px' }}>
                    <div style={{ height: 20, background: '#22272e', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                  </td>
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={7} style={{ padding: '36px 20px', textAlign: 'center', color: '#e5534b', fontSize: 13 }}>
                  Failed to load products from server. Make sure backend API is running.
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#545d68', fontSize: 13 }}>
                  No products found. <Link href="/admin/products/new" style={{ color: '#00b566', textDecoration: 'none' }}>Create one →</Link>
                </td>
              </tr>
            ) : (
              products.map(product => {
                const strId = String(product.id);
                const isSelected = selected.includes(strId);
                const primaryImg = product.images?.find(i => i.is_primary)?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=48&q=70';

                return (
                  <tr
                    key={product.id}
                    style={{
                      borderBottom: '1px solid rgba(68,76,86,0.4)',
                      transition: 'background 0.12s',
                      background: isSelected ? 'rgba(0,181,102,0.05)' : 'transparent',
                    }}
                  >
                    {/* Checkbox */}
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(strId)}
                        style={{ cursor: 'pointer', accentColor: '#00b566' }}
                      />
                    </td>

                    {/* Product */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={primaryImg}
                          alt={product.title}
                          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0, background: '#22272e' }}
                        />
                        <div>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            style={{ fontSize: 13, fontWeight: 600, color: '#cdd9e5', textDecoration: 'none' }}
                          >
                            {product.title}
                          </Link>
                          <p style={{ fontSize: 10, color: '#768390', marginTop: 1, fontFamily: 'JetBrains Mono, monospace' }}>
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        ...(STATUS_STYLES[product.status] || STATUS_STYLES.draft),
                        borderRadius: 9999, padding: '3px 9px', fontSize: 10, fontWeight: 700,
                        display: 'inline-block', textTransform: 'capitalize',
                      }}>
                        {product.status}
                      </span>
                    </td>

                    {/* Type */}
                    <td style={{ padding: '12px 14px', color: '#768390', fontSize: 11 }}>{product.product_type}</td>

                    {/* Base Price */}
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#cdd9e5' }}>
                      ₹{product.base_price}
                    </td>

                    {/* Care Skill */}
                    <td style={{ padding: '12px 14px', color: '#768390', fontSize: 11 }}>
                      {product.care_skill || 'N/A'}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link href={`/admin/products/${product.id}/edit`} style={{
                          background: 'transparent', border: '1px solid #444c56', borderRadius: 5,
                          color: '#adbac7', fontSize: 11, fontWeight: 600, padding: '4px 10px',
                          textDecoration: 'none', display: 'inline-block',
                        }}>Edit</Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          title="Delete / Archive Product"
                          style={{
                            background: 'rgba(229,83,75,0.1)', border: '1px solid rgba(229,83,75,0.3)',
                            borderRadius: 5, color: '#e5534b', fontSize: 11, fontWeight: 600,
                            padding: '4px 8px', cursor: 'pointer', opacity: deletingId === product.id ? 0.5 : 1,
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pages > 1 && (
          <div style={{
            padding: '12px 20px', borderTop: '1px solid rgba(68,76,86,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 11, color: '#768390' }}>
              Page {page} of {pages} ({total} total items)
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  style={{
                    width: 30, height: 30,
                    background: p === page ? '#00b566' : 'transparent',
                    border: `1px solid ${p === page ? '#00b566' : '#444c56'}`,
                    borderRadius: 6, color: p === page ? '#fff' : '#768390',
                    fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {p}
                </button>
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
