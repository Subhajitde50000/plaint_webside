'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

// Types
import { ProductFormData, ValidationErrors, DEFAULT_FORM_DATA } from './types';

// Left column panels
import { ProductInfoPanel } from './panels/ProductInfoPanel';
import { MediaPanel } from './panels/MediaPanel';
import { PricingPanel } from './panels/PricingPanel';
import { VariantsPanel } from './panels/VariantsPanel';
import { InventoryPanel } from './panels/InventoryPanel';
import { ShippingPanel } from './panels/ShippingPanel';
import { TabsContentPanel } from './panels/TabsContentPanel';
import { ActivityLogPanel } from './panels/ActivityLogPanel';

// Right column panels
import { StatusPanel } from './panels/StatusPanel';
import { OrganisationPanel } from './panels/OrganisationPanel';
import { ProductTypePanel } from './panels/ProductTypePanel';
import { CareInfoPanel } from './panels/CareInfoPanel';
import { PotUpsellPanel } from './panels/PotUpsellPanel';
import { SEOPanel } from './panels/SEOPanel';
import { StorefrontPreviewPanel } from './panels/StorefrontPreviewPanel';

// Modals & bars
import { StickySaveBar } from './StickySaveBar';
import { UnsavedChangesModal } from './modals/UnsavedChangesModal';
import { DuplicateModal } from './modals/DuplicateModal';
import { DeleteModal } from './modals/DeleteModal';
import { ValidationSummary } from './modals/ValidationSummary';
import { SPIN_CSS } from './ui';

/* ─── Types ──────────────────────────────────────────────────────────────────── */
interface Props {
  mode: 'new' | 'edit';
  productId?: string;
  initialData?: Partial<ProductFormData>;
}

/* ─── Validation ─────────────────────────────────────────────────────────────── */
function validate(data: ProductFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!data.title.trim()) errors.title = 'Product title is required.';
  if (data.title.length > 120) errors.title = 'Title must be 120 characters or fewer.';
  if (!data.currentPrice) errors.currentPrice = 'Current price is required.';
  if (data.currentPrice && parseFloat(data.currentPrice) <= 0) errors.currentPrice = 'Price must be greater than ₹0.';
  if (data.compareAtPrice && data.currentPrice && parseFloat(data.compareAtPrice) < parseFloat(data.currentPrice)) {
    errors.compareAtPrice = 'Compare-at price must be greater than the current price.';
  }
  if (data.images.length === 0) errors.images = 'Upload at least one product image.';
  if (!data.category) errors.category = 'Category is required.';
  if (!data.productType) errors.productType = 'Product type is required.';
  return errors;
}

function getPublishErrors(data: ProductFormData): string[] {
  const errs: string[] = [];
  if (!data.title.trim()) errs.push('Product title is required.');
  if (!data.currentPrice || parseFloat(data.currentPrice) <= 0) errs.push('Current price is required (must be greater than ₹0).');
  if (data.images.length === 0) errs.push('Upload at least one product image.');
  if (!data.category) errs.push('Category is required.');
  if (!data.productType) errs.push('Product type is required.');
  return errs;
}

/* ─── Toast ──────────────────────────────────────────────────────────────────── */
function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'error' | 'warning' }) {
  const bg = type === 'success' ? '#57ab5a' : type === 'error' ? '#e5534b' : '#c69026';
  return (
    <div style={{
      position: 'fixed', bottom: 80, right: 24, zIndex: 400,
      background: bg, color: '#fff',
      borderRadius: 8, padding: '10px 18px', fontSize: 12, fontWeight: 600,
      fontFamily: "'Outfit', sans-serif",
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      animation: 'slideIn 0.25s ease',
    }}>{message}</div>
  );
}

/* ─── Status Badge ───────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { color: string; label: string }> = {
    active: { color: '#57ab5a', label: 'Active' },
    draft: { color: '#c69026', label: 'Draft' },
    archived: { color: '#768390', label: 'Archived' },
  };
  const { color, label } = cfg[status] ?? cfg.draft;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: color + '20', color,
      border: `1px solid ${color}60`,
      borderRadius: 9999, padding: '3px 10px', fontSize: 11, fontWeight: 700,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      {label}
    </span>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export function ProductEditPage({ mode, productId, initialData }: Props) {
  const isNew = mode === 'new';

  /* Form state */
  const [data, setData] = useState<ProductFormData>({ ...DEFAULT_FORM_DATA, ...initialData });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [publishErrors, setPublishErrors] = useState<string[]>([]);

  /* Modal state */
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  /* Auto-save timer ref */
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  /* Field change handler */
  const onChange = useCallback((field: keyof ProductFormData, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // Clear specific field error on change
    setErrors(prev => { const e = { ...prev }; delete e[field as string]; return e; });
  }, []);

  /* Auto-save every 30s when dirty */
  useEffect(() => {
    if (!isDirty) return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(async () => {
      if (!isDirty) return;
      setIsSavingDraft(true);
      await new Promise(r => setTimeout(r, 600)); // simulate API
      setIsSavingDraft(false);
      setLastSaved('just now');
      setIsDirty(false);
    }, 30000);
    return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
  }, [isDirty, data]);

  /* Keyboard shortcuts */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Close any open modal on Escape
      if (e.key === 'Escape') {
        if (showUnsaved) { setShowUnsaved(false); return; }
        if (showDuplicate) { setShowDuplicate(false); return; }
        if (showDelete) { setShowDelete(false); return; }
      }
      // Save / Publish shortcuts (only when no modal is open)
      const modalOpen = showUnsaved || showDuplicate || showDelete;
      if (!modalOpen && (e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); handleSaveDraft(); }
      if (!modalOpen && (e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); handlePublish(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showUnsaved, showDuplicate, showDelete]);

  /* Toast auto-dismiss */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
  };

  /* Save Draft */
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    setData(prev => ({ ...prev, productStatus: 'draft' }));
    await new Promise(r => setTimeout(r, 800));
    setIsSavingDraft(false);
    setLastSaved('just now');
    setIsDirty(false);
    showToast('✓ Draft saved');
  };

  /* Publish */
  const handlePublish = async () => {
    const errs = getPublishErrors(data);
    if (errs.length > 0) {
      setPublishErrors(errs);
      const fieldErrors = validate(data);
      setErrors(fieldErrors);
      // Scroll to first error
      setTimeout(() => document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      return;
    }
    setIsPublishing(true);
    setPublishErrors([]);
    await new Promise(r => setTimeout(r, 1200));
    setIsPublishing(false);
    setData(prev => ({ ...prev, productStatus: 'active' }));
    setLastSaved('just now');
    setIsDirty(false);
    showToast('Product published successfully. 🎉');
  };

  /* Discard */
  const handleDiscard = () => {
    if (!isDirty) return;
    setShowUnsaved(true);
  };

  /* Duplicate confirm */
  const handleDuplicateConfirm = async (newTitle: string) => {
    setShowDuplicate(false);
    showToast('Duplicate created. Review and publish when ready.');
  };

  /* Delete confirm */
  const handleDeleteConfirm = async () => {
    setShowDelete(false);
    showToast('Product was deleted.', 'warning');
  };

  /* Product display name */
  const displayName = data.title || (isNew ? 'New Product' : 'Untitled Product');

  /* Show care/pot panels only for plant/seed */
  const showCarePanel = ['plant', 'seed'].includes(data.productType);
  const showPotUpsell = data.productType === 'plant';

  return (
    <>
      <style>{SPIN_CSS}{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #444c56; border-radius: 3px; }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
      `}</style>

      <div style={{ fontFamily: "'Outfit', sans-serif", color: '#cdd9e5' }}>

        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: 16 }}>
          <ol style={{ display: 'flex', gap: 6, alignItems: 'center', listStyle: 'none', margin: 0, padding: 0 }}>
            <li><Link href="/admin/products" style={{ fontSize: 12, color: '#768390', textDecoration: 'none' }}>Products</Link></li>
            <li style={{ color: 'rgba(118,131,144,0.5)', fontSize: 12 }}>/</li>
            <li aria-current="page" style={{ fontSize: 12, fontWeight: 600, color: '#cdd9e5' }}>
              {isNew ? 'Add Product' : `Edit: ${displayName}`}
            </li>
          </ol>
        </nav>

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 16, marginBottom: 24, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: '#cdd9e5', margin: 0 }}>{displayName}</h1>
              <StatusBadge status={data.productStatus} />
            </div>
            {!isNew && data.baseSku && (
              <p style={{ fontSize: 11, color: '#768390', marginTop: 4 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{data.baseSku}</span>
                {lastSaved && <span> · Last saved: {lastSaved}</span>}
              </p>
            )}
          </div>

          {/* Header actions */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* View on Storefront — always visible, uses urlHandle or slugified title */}
            {(() => {
              const slug = data.urlHandle || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '');
              const canView = !!slug && data.productStatus === 'active';
              const href = slug ? `/products/${slug}` : '#';
              return (
                <a
                  href={href}
                  target={canView ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  onClick={e => { if (!canView) e.preventDefault(); }}
                  title={
                    !slug
                      ? 'Add a product title first'
                      : data.productStatus !== 'active'
                        ? 'Product must be published (Active) to view on storefront'
                        : `Open /products/${slug}`
                  }
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: 'transparent',
                    border: `1px solid ${canView ? '#444c56' : '#2d333b'}`,
                    borderRadius: 6,
                    color: canView ? '#adbac7' : '#545d68',
                    fontSize: 12, fontWeight: 600, padding: '7px 14px',
                    textDecoration: 'none',
                    cursor: canView ? 'pointer' : 'not-allowed',
                    opacity: canView ? 1 : 0.55,
                    transition: 'all 0.15s',
                  }}
                >
                  View on Storefront ↗
                </a>
              );
            })()}
            {!isNew && (
              <>
                <button type="button" onClick={() => setShowDuplicate(true)} style={headerGhostBtn}>
                  Duplicate
                </button>
                <button type="button" onClick={() => setShowDelete(true)} style={{ ...headerGhostBtn, color: '#e5534b', borderColor: '#e5534b40' }}>
                  Delete
                </button>
              </>
            )}
            {isNew && (
              <button type="button" onClick={() => setShowUnsaved(true)} style={headerGhostBtn}>
                Discard
              </button>
            )}
            <button type="button" onClick={handleSaveDraft} disabled={isSavingDraft || isPublishing}
              style={{
                ...headerGhostBtn,
                background: isSavingDraft ? '#22272e' : 'transparent',
              }}>
              {isSavingDraft ? 'Saving…' : 'Save Draft'}
            </button>
            <button type="button" onClick={handlePublish} disabled={isPublishing}
              style={{
                background: '#00b566', border: 'none', borderRadius: 6,
                color: '#fff', fontSize: 12, fontWeight: 600, padding: '7px 18px',
                cursor: isPublishing ? 'not-allowed' : 'pointer', height: 36,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
              {isPublishing && <span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />}
              Publish
            </button>
          </div>
        </div>

        {/* ── Validation Summary ────────────────────────────────────────── */}
        {publishErrors.length > 0 && (
          <ValidationSummary errors={publishErrors} onDismiss={() => setPublishErrors([])} />
        )}

        {/* ── Two-column layout ─────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '65% 35%',
          gap: 24,
          alignItems: 'start',
        }}>
          {/* ────────────── LEFT COLUMN ────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <ProductInfoPanel data={data} errors={errors} onChange={onChange} />
            <MediaPanel data={data} errors={errors} onChange={onChange} />
            <PricingPanel data={data} errors={errors} onChange={onChange} />
            <VariantsPanel data={data} errors={errors} onChange={onChange} />
            <InventoryPanel data={data} errors={errors} onChange={onChange} />
            <ShippingPanel data={data} errors={errors} onChange={onChange} />
            <TabsContentPanel data={data} errors={errors} onChange={onChange} />
            <ActivityLogPanel isNew={isNew} />
          </div>

          {/* ────────────── RIGHT COLUMN (sticky) ──────────────────────── */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 24,
            position: 'sticky', top: 80, alignSelf: 'start',
          }}>
            <StatusPanel data={data} errors={errors} onChange={onChange} />
            <OrganisationPanel data={data} errors={errors} onChange={onChange} />
            <ProductTypePanel data={data} errors={errors} onChange={onChange} />
            {showCarePanel && <CareInfoPanel data={data} errors={errors} onChange={onChange} />}
            {showPotUpsell && <PotUpsellPanel data={data} errors={errors} onChange={onChange} />}
            <SEOPanel data={data} errors={errors} onChange={onChange} />
            <StorefrontPreviewPanel data={data} isNew={isNew} />
          </div>
        </div>
      </div>

      {/* ── Sticky Save Bar ───────────────────────────────────────────── */}
      <StickySaveBar
        isDirty={isDirty}
        isSavingDraft={isSavingDraft}
        isPublishing={isPublishing}
        lastSaved={lastSaved}
        onDiscard={handleDiscard}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />

      {/* ── Modals ───────────────────────────────────────────────────── */}
      {showUnsaved && (
        <UnsavedChangesModal
          onStay={() => setShowUnsaved(false)}
          onLeave={() => { setIsDirty(false); setData(DEFAULT_FORM_DATA); setShowUnsaved(false); }}
        />
      )}
      {showDuplicate && (
        <DuplicateModal
          productTitle={displayName}
          onConfirm={handleDuplicateConfirm}
          onCancel={() => setShowDuplicate(false)}
        />
      )}
      {showDelete && (
        <DeleteModal
          productTitle={displayName}
          orderCount={248}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {/* ── Toast ─────────────────────────────────────────────────────── */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}

const headerGhostBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #444c56',
  borderRadius: 6,
  color: '#adbac7',
  fontSize: 12,
  fontWeight: 600,
  fontFamily: "'Outfit', sans-serif",
  padding: '7px 14px',
  cursor: 'pointer',
  height: 36,
  display: 'inline-flex',
  alignItems: 'center',
};
