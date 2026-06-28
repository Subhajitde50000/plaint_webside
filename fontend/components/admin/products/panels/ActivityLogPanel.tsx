'use client';

import React, { useState } from 'react';
import { ActivityLogEntry } from '../types';
import { Panel, GhostButton } from '../ui';

const MOCK_LOG: ActivityLogEntry[] = [
  { id: '1', date: 'Today 10:24 AM', admin: 'Priya K.', action: 'Changed price to ₹399' },
  { id: '2', date: 'Today 09:15 AM', admin: 'Auto-save', action: 'Auto-saved (draft)' },
  { id: '3', date: '15 Jun 3:42 PM', admin: 'Ravi S.', action: 'Published product' },
  { id: '4', date: '15 Jun 2:11 PM', admin: 'Ravi S.', action: 'Uploaded 3 images' },
  { id: '5', date: '15 Jun 1:05 PM', admin: 'Ravi S.', action: 'Created product (draft)' },
];

const AVATAR_COLORS = ['#00b566', '#539bf5', '#c69026', '#e5534b', '#768390'];

function getInitials(name: string) {
  if (name === 'Auto-save') return '⟳';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

interface Props {
  isNew?: boolean;
}

export function ActivityLogPanel({ isNew }: Props) {
  const [expanded, setExpanded] = useState(false);
  const log = isNew ? [] : MOCK_LOG;

  return (
    <Panel>
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        style={{
          background: 'transparent', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', cursor: 'pointer', padding: 0,
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 700, color: '#cdd9e5', fontFamily: "'Outfit', sans-serif" }}>
          Activity Log
        </span>
        <span style={{ fontSize: 11, color: '#768390', fontFamily: "'Outfit', sans-serif" }}>
          {expanded ? '▲ Hide' : '▾ Show activity log'}
        </span>
      </button>

      {expanded && (
        <div style={{ marginTop: 16 }}>
          {log.length === 0 ? (
            <p style={{ fontSize: 12, color: '#545d68', textAlign: 'center', padding: '20px 0' }}>
              No activity yet. Activity will appear here after saving.
            </p>
          ) : (
            <>
              <div
                role="log"
                aria-label="Product activity log"
                style={{ overflowX: 'auto' }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr>
                      {['DATE', 'ADMIN', 'ACTION'].map(h => (
                        <th key={h} style={{
                          padding: '6px 10px', textAlign: 'left', fontSize: 11,
                          fontWeight: 700, color: '#768390', textTransform: 'uppercase',
                          letterSpacing: '0.05em', borderBottom: '1px solid #444c56',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {log.map((entry, i) => (
                      <tr key={entry.id} style={{ borderBottom: i < log.length - 1 ? '1px solid rgba(68,76,86,0.4)' : 'none' }}>
                        <td style={{ padding: '8px 10px' }}>
                          <time style={{ fontSize: 11, color: '#768390' }}>{entry.date}</time>
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{
                              width: 20, height: 20, borderRadius: '50%',
                              background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0,
                            }}>{getInitials(entry.admin)}</span>
                            <span style={{ fontSize: 11, color: '#adbac7' }}>{entry.admin}</span>
                          </div>
                        </td>
                        <td style={{ padding: '8px 10px', fontSize: 12, color: '#cdd9e5' }}>{entry.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                <GhostButton size="sm">View Full Log →</GhostButton>
              </div>
            </>
          )}
        </div>
      )}
    </Panel>
  );
}

