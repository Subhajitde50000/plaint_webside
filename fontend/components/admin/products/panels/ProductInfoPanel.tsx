'use client';

import React from 'react';
import { ProductFormData, ValidationErrors } from '../types';
import { Panel, PanelHeading, FieldLabel, HelpText, Input, CharCounter, Divider, RichTextEditor } from '../ui';

interface Props {
  data: ProductFormData;
  errors: ValidationErrors;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

export function ProductInfoPanel({ data, errors, onChange }: Props) {
  return (
    <Panel>
      <PanelHeading>Product Information</PanelHeading>

      {/* Title */}
      <div style={{ marginBottom: 16 }}>
        <FieldLabel required>Title</FieldLabel>
        <Input
          id="product-title"
          type="text"
          placeholder="e.g. Monstera Deliciosa"
          value={data.title}
          maxLength={120}
          aria-label="Product title"
          aria-required="true"
          error={errors.title}
          onChange={e => onChange('title', e.target.value)}
          autoFocus
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {!errors.title && <span />}
          <CharCounter current={data.title.length} max={120} />
        </div>
      </div>

      {/* Short Description */}
      <div style={{ marginBottom: 16 }}>
        <FieldLabel>Short Description</FieldLabel>
        <Input
          type="text"
          placeholder="A statement indoor plant with iconic split leaves..."
          value={data.shortDescription}
          maxLength={160}
          onChange={e => onChange('shortDescription', e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <HelpText>Appears below the product title in the storefront PDP.</HelpText>
          <CharCounter current={data.shortDescription.length} max={160} />
        </div>
      </div>

      {/* Full Description */}
      <div style={{ marginBottom: 16 }}>
        <FieldLabel>Full Description</FieldLabel>
        <RichTextEditor
          value={data.fullDescription}
          onChange={v => onChange('fullDescription', v)}
          placeholder="Write a detailed description of this plant..."
          minHeight={200}
          id="full-description-editor"
        />
        <HelpText>Renders in the &quot;About This Plant&quot; tab body text on the PDP.</HelpText>
      </div>

      <Divider />

      {/* Botanical Name */}
      <div style={{ marginBottom: 16 }}>
        <FieldLabel>Botanical Name / Scientific Name</FieldLabel>
        <Input
          type="text"
          placeholder="e.g. Monstera deliciosa"
          value={data.botanicalName}
          onChange={e => onChange('botanicalName', e.target.value)}
          style={{ fontStyle: 'italic', fontFamily: 'JetBrains Mono, monospace' }}
        />
        <HelpText>Used in the About tab specifications card. Italicised on storefront.</HelpText>
      </div>

      {/* Common Name */}
      <div>
        <FieldLabel>Subspecies / Common Name</FieldLabel>
        <Input
          type="text"
          placeholder="e.g. Swiss Cheese Plant"
          value={data.commonName}
          onChange={e => onChange('commonName', e.target.value)}
        />
        <HelpText>Shown below the product title on the PDP in smaller text.</HelpText>
      </div>
    </Panel>
  );
}

