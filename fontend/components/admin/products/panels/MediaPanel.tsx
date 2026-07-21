'use client';

import React, { useRef, useState, useCallback } from 'react';
import { ProductFormData, ProductImage, ValidationErrors } from '../types';
import { Panel, PanelHeading, GhostButton, InfoBanner } from '../ui';
import { useUploadProductImage, useDeleteProductImage } from '@/features/admin/hooks/useAdminProducts';

interface Props {
  data: ProductFormData;
  errors: ValidationErrors;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
  productId?: string;
}

export function MediaPanel({ data, errors, onChange, productId }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [urlModal, setUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const uploadMutation = useUploadProductImage(productId || '');
  const deleteMutation = useDeleteProductImage(productId || '');

  const addImages = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const current = data.images;
    if (current.length >= 8) return;

    const filesArray = Array.from(files).slice(0, 8 - current.length);
    for (const file of filesArray) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} exceeds 10MB limit.`);
        continue;
      }
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
      if (!allowed.includes(file.type)) {
        alert(`${file.name} is not supported. Upload JPG, PNG, or WebP.`);
        continue;
      }

      if (productId) {
        // Edit mode: upload to server immediately
        try {
          await uploadMutation.mutateAsync({ file, isPrimary: current.length === 0 });
        } catch (err: any) {
          alert('Failed to upload image: ' + (err?.response?.data?.detail || err.message));
        }
      } else {
        // New mode: add to local queue
        const url = URL.createObjectURL(file);
        const newImg: ProductImage = {
          id: 'local-' + Date.now().toString() + '-' + Math.random(),
          url,
          filename: file.name,
          isPrimary: current.length === 0,
          file,
        };
        onChange('images', [...current, newImg]);
      }
    }
  }, [data.images, onChange, productId, uploadMutation]);

  const removeImage = async (id: string) => {
    if (productId && !id.startsWith('local-')) {
      // Edit mode: delete from server immediately
      if (!confirm('Are you sure you want to delete this image?')) return;
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: any) {
        alert('Failed to delete image: ' + (err?.response?.data?.detail || err.message));
      }
    } else {
      // New mode: remove from local queue
      const updated = data.images.filter(i => i.id !== id);
      if (updated.length > 0) {
        updated[0].isPrimary = true;
      }
      onChange('images', updated);
    }
  };

  const addFromUrl = async () => {
    if (!urlInput.trim()) return;
    if (productId) {
      try {
        const response = await fetch(urlInput.trim());
        const blob = await response.blob();
        const file = new File([blob], 'url-image.jpg', { type: blob.type || 'image/jpeg' });
        await uploadMutation.mutateAsync({ file, isPrimary: data.images.length === 0 });
      } catch (err) {
        alert('Failed to load image from URL. Make sure it is a valid, publicly accessible image address.');
      }
    } else {
      const newImg: ProductImage = {
        id: 'local-' + Date.now().toString(),
        url: urlInput.trim(),
        filename: 'external-image',
        isPrimary: data.images.length === 0,
      };
      onChange('images', [...data.images, newImg]);
    }
    setUrlInput('');
    setUrlModal(false);
  };

  const handleDragStart = (id: string) => setDraggingId(id);
  const handleDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    const imgs = [...data.images];
    const fromIdx = imgs.findIndex(i => i.id === draggingId);
    const toIdx = imgs.findIndex(i => i.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const [moved] = imgs.splice(fromIdx, 1);
    imgs.splice(toIdx, 0, moved);
    imgs.forEach((img, i) => { img.isPrimary = i === 0; });
    onChange('images', imgs);
    setDraggingId(null);
    setDragOverId(null);
  };

  return (
    <Panel>
      <PanelHeading action={
        <GhostButton size="sm" onClick={() => setUrlModal(true)}>+ Add from URL</GhostButton>
      }>Media</PanelHeading>

      {errors.images && (
        <p role="alert" style={{ fontSize: 11, color: '#e5534b', marginBottom: 12, fontWeight: 500 }}>⚠ {errors.images}</p>
      )}

      {/* Drop Zone */}
      <div
        role="button"
        aria-label="Upload product images"
        tabIndex={0}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); addImages(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
        style={{
          height: 140,
          background: dragOver ? 'rgba(0,181,102,0.08)' : '#22272e',
          border: `2px dashed ${dragOver ? '#00b566' : errors.images ? '#e5534b' : '#444c56'}`,
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          transform: dragOver ? 'scale(1.005)' : 'scale(1)',
          marginBottom: 16,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#768390" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#adbac7', marginTop: 8 }}>
          Drop files here to upload
        </p>
        <p style={{ fontSize: 11, color: '#768390', marginTop: 2 }}>
          or click to browse · JPG · PNG · WebP · max 10MB per file
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.heic"
        multiple
        style={{ display: 'none' }}
        onChange={e => addImages(e.target.files)}
      />

      {/* Image Grid */}
      {data.images.length > 0 && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
            {data.images.map((img, idx) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => handleDragStart(img.id)}
                onDragOver={e => { e.preventDefault(); setDragOverId(img.id); }}
                onDragLeave={() => setDragOverId(null)}
                onDrop={() => handleDrop(img.id)}
                aria-label={`Image ${idx + 1}: ${img.filename}. ${idx === 0 ? 'Primary' : 'Thumbnail'}. Drag to reorder.`}
                style={{
                  position: 'relative',
                  width: 96, height: 96,
                  borderRadius: 6,
                  border: `1px solid ${dragOverId === img.id ? '#00b566' : '#444c56'}`,
                  overflow: 'hidden',
                  cursor: 'grab',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                  transform: draggingId === img.id ? 'scale(1.04)' : 'scale(1)',
                  boxShadow: draggingId === img.id ? '0 4px 16px rgba(0,0,0,0.4)' : 'none',
                }}
              >
                {/* Drag handle */}
                <span style={{
                  position: 'absolute', top: 4, left: 4,
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 12,
                  lineHeight: 1,
                  zIndex: 2,
                  cursor: 'grab',
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                }}>⠿</span>

                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.filename}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Primary Badge */}
                {idx === 0 && (
                  <span style={{
                    position: 'absolute', bottom: 4, left: 4,
                    background: '#00b566',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '2px 5px',
                    borderRadius: 3,
                    letterSpacing: '0.05em',
                  }}>PRIMARY</span>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  aria-label={`Remove image ${idx + 1}`}
                  style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 20, height: 20,
                    borderRadius: '50%',
                    background: 'rgba(15,17,23,0.8)',
                    border: 'none',
                    color: '#cdd9e5',
                    fontSize: 11,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3,
                  }}
                >✕</button>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#768390' }}>← drag to reorder · {data.images.length}/8 images</p>
          <InfoBanner>
            Image order matters: #1 → Main PDP image · #2–4 → Thumbnail strip · #5+ → Gallery extras
          </InfoBanner>
        </>
      )}

      {/* Add from URL Modal */}
      {urlModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200,
        }} onClick={() => setUrlModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#1c2128', border: '1px solid #444c56', borderRadius: 8,
            padding: 24, width: 420, maxWidth: '90vw',
          }}>
            <h3 style={{ color: '#cdd9e5', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Add Image from URL</h3>
            <input
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{
                width: '100%', height: 36, background: '#22272e', border: '1px solid #444c56',
                borderRadius: 6, color: '#cdd9e5', fontSize: 12, fontFamily: "'Outfit', sans-serif",
                padding: '0 12px', outline: 'none', marginBottom: 16,
              }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setUrlModal(false)} style={{
                background: 'transparent', border: '1px solid #444c56', borderRadius: 6,
                color: '#adbac7', fontSize: 12, padding: '7px 16px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
              }}>Cancel</button>
              <button type="button" onClick={addFromUrl} style={{
                background: '#00b566', border: 'none', borderRadius: 6,
                color: '#fff', fontSize: 12, fontWeight: 600, padding: '7px 16px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
              }}>Add Image</button>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}
