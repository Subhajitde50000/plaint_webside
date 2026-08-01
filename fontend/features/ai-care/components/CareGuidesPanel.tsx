"use client";

import { useState } from "react";
import { useResolveCareGuide } from "../hooks/useAiCare";
import { CareGuide } from "../api/ai-care.api";

const SEVERITY_STYLES: Record<string, string> = {
  info:    "border-blue-200 bg-blue-50",
  warning: "border-amber-200 bg-amber-50",
  urgent:  "border-red-200 bg-red-50",
};
const SEVERITY_BADGE: Record<string, string> = {
  info:    "bg-blue-100 text-blue-700",
  warning: "bg-amber-100 text-amber-700",
  urgent:  "bg-red-100 text-red-600",
};
const CATEGORY_ICONS: Record<string, string> = {
  disease: "🦠",
  pest: "🐛",
  watering: "💧",
  fertilising: "🌱",
  repotting: "🪴",
  pruning: "✂️",
  light: "☀️",
  temperature: "🌡️",
  general: "📝",
};

export function CareGuidesPanel({
  guides,
  plantId,
}: {
  guides: CareGuide[];
  plantId: number;
}) {
  const resolve = useResolveCareGuide(plantId);
  const active = guides.filter((g) => !g.isResolved);
  const resolved = guides.filter((g) => g.isResolved);

  if (guides.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-2xl mb-2">📋</p>
        <p className="text-sm font-semibold text-gray-600">No care guides yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Ask the AI about your plant's health and save its advice here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {active.length > 0 && (
        <>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Active ({active.length})
          </p>
          {active.map((guide) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              onResolve={(note) =>
                resolve.mutate({ guideId: guide.id, note })
              }
              isResolving={resolve.isPending}
            />
          ))}
        </>
      )}

      {resolved.length > 0 && (
        <>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-4">
            Resolved ({resolved.length})
          </p>
          {resolved.map((guide) => (
            <GuideCard key={guide.id} guide={guide} resolved />
          ))}
        </>
      )}
    </div>
  );
}

function GuideCard({
  guide,
  onResolve,
  isResolving,
  resolved = false,
}: {
  guide: CareGuide;
  onResolve?: (note?: string) => void;
  isResolving?: boolean;
  resolved?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [resolveNote, setResolveNote] = useState("");

  return (
    <div
      className={`border rounded-xl overflow-hidden ${
        resolved
          ? "opacity-60 border-gray-200 bg-gray-50"
          : SEVERITY_STYLES[guide.severity] ?? "border-gray-200 bg-gray-50"
      }`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left"
        aria-expanded={expanded}
      >
        <span className="text-base" aria-hidden="true">
          {CATEGORY_ICONS[guide.category] ?? "📝"}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#1c1c1c] truncate">
            {guide.title}
          </p>
          <p className="text-[10px] text-gray-400 capitalize">
            {guide.category} · {guide.createdBy === "ai" ? "🤖 AI" : "✍️ You"}
            {guide.createdAt
              ? ` · ${new Date(guide.createdAt).toLocaleDateString("en-IN")}`
              : ""}
          </p>
        </div>
        {!resolved && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              SEVERITY_BADGE[guide.severity] ?? ""
            }`}
          >
            {guide.severity}
          </span>
        )}
        {resolved && (
          <span className="text-[10px] text-green-600 font-semibold">✓ Resolved</span>
        )}
        <span className="text-gray-400 text-xs ml-1">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-white/60">
          <p className="text-xs text-[#1c1c1c] leading-relaxed mt-2 whitespace-pre-wrap">
            {guide.content}
          </p>

          {/* Resolve controls */}
          {!resolved && onResolve && (
            <div className="mt-3">
              {!resolving ? (
                <button
                  onClick={() => setResolving(true)}
                  className="text-xs text-green-600 font-semibold border border-green-200 rounded-full px-3 py-1 hover:bg-green-50 transition-colors"
                >
                  ✓ Mark as resolved
                </button>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={resolveNote}
                    onChange={(e) => setResolveNote(e.target.value)}
                    placeholder="Optional: how did you resolve this? (e.g. Treated with neem oil)"
                    rows={2}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-[#00b566]"
                    aria-label="Resolution note (optional)"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => onResolve(resolveNote || undefined)}
                      disabled={isResolving}
                      className="text-xs bg-green-600 text-white rounded-full px-3 py-1 font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {isResolving ? "Saving…" : "Confirm"}
                    </button>
                    <button
                      onClick={() => setResolving(false)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
