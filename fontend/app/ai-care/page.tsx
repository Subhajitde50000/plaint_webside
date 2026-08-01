"use client";

import { useState, useRef } from "react";
import {
  useMyPlantsForAi,
  usePlantAiContext,
  useAiCareChat,
} from "@/features/ai-care/hooks/useAiCare";
import { MessageBubble } from "@/features/ai-care/components/MessageBubble";
import { PlantInfoPanel, PlantInfoSkeleton } from "@/features/ai-care/components/PlantInfoPanel";
import { CareGuidesPanel } from "@/features/ai-care/components/CareGuidesPanel";
import { CareLogsPanel } from "@/features/ai-care/components/CareLogsPanel";
import { TypingIndicator } from "@/features/ai-care/components/TypingIndicator";
import { EmptyChatState } from "@/features/ai-care/components/EmptyChatState";

export default function AiCarePage() {
  const { data: plants = [], isLoading: plantsLoading } = useMyPlantsForAi();
  const {
    selectedPlantId,
    messages,
    isTyping,
    bottomRef,
    selectPlant,
    sendMessage,
    saveToGuide,
    rateSession,
    isSending,
    isSavingGuide,
  } = useAiCareChat();

  const { data: plantContext, isLoading: contextLoading } =
    usePlantAiContext(selectedPlantId);

  const [input, setInput] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "guides" | "logs">("chat");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim() && !photo) return;
    sendMessage(input.trim(), photo ?? undefined);
    setInput("");
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-[#fefcf9]">
      {/* Page header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-2xl font-extrabold text-[#1c1c1c]">
          🌿 AI Plant Care
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Ask anything about your plants — personalised advice based on their actual care history.
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6 h-[calc(100vh-96px)]">

        {/* ── LEFT: Plant selector + context panel ──────────────────── */}
        <aside className="w-72 flex-shrink-0 flex flex-col gap-4">

          {/* Plant dropdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <label
              htmlFor="plant-select"
              className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"
            >
              Select your plant
            </label>

            {plantsLoading ? (
              <div className="h-11 bg-gray-100 rounded-lg animate-pulse" />
            ) : plants.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No plants saved yet.</p>
                <a
                  href="/profile"
                  className="text-sm font-semibold text-[#00b566] mt-1 block hover:underline"
                >
                  + Add a plant →
                </a>
              </div>
            ) : (
              <select
                id="plant-select"
                aria-label="Select your plant for AI care advice"
                className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm font-medium text-[#1c1c1c] bg-white focus:outline-none focus:border-[#00b566] focus:ring-2 focus:ring-[#00b566]/20"
                value={selectedPlantId ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  const plant = plants.find((p) => p.id === id) ?? null;
                  selectPlant(plant);
                  setActiveTab("chat");
                }}
              >
                <option value="">— Choose a plant —</option>
                {plants.map((plant) => (
                  <option key={plant.id} value={plant.id}>
                    {plant.nickname
                      ? `${plant.nickname} (${plant.plantName})`
                      : plant.plantName}
                    {plant.careGuideCount > 0
                      ? ` · ${plant.careGuideCount} guide${plant.careGuideCount > 1 ? "s" : ""}`
                      : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Plant context panel (shows after selection) */}
          {selectedPlantId && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 overflow-hidden flex flex-col">

              {/* Tabs */}
              <div
                className="flex border-b border-gray-100"
                role="tablist"
                aria-label="Plant information tabs"
              >
                {(["chat", "guides", "logs"] as const).map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={activeTab === tab}
                    aria-controls={`tab-panel-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors ${
                      activeTab === tab
                        ? "text-[#00b566] border-b-2 border-[#00b566]"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab === "guides" &&
                    plantContext?.careGuides?.filter((g) => !g.isResolved).length
                      ? `Guides (${plantContext.careGuides.filter((g) => !g.isResolved).length})`
                      : tab === "chat"
                      ? "Info"
                      : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab panels */}
              <div className="flex-1 overflow-y-auto p-4">

                {/* Plant info tab */}
                {activeTab === "chat" && plantContext && (
                  <PlantInfoPanel plant={plantContext.plant} />
                )}
                {activeTab === "chat" && contextLoading && (
                  <PlantInfoSkeleton />
                )}

                {/* Care guides tab */}
                {activeTab === "guides" && plantContext && (
                  <CareGuidesPanel
                    guides={plantContext.careGuides}
                    plantId={selectedPlantId}
                  />
                )}

                {/* Care logs tab */}
                {activeTab === "logs" && plantContext && (
                  <CareLogsPanel logs={plantContext.careLogs} />
                )}
              </div>
            </div>
          )}
        </aside>

        {/* ── RIGHT: Chat interface ─────────────────────────────────── */}
        <main
          className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden"
          aria-label="AI Care chat"
        >
          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-5 py-5 space-y-4"
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
          >
            {messages.length === 0 && !selectedPlantId && (
              <EmptyChatState plants={plants} onSelectPlant={selectPlant} />
            )}

            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                message={msg}
                sessionUuid={null}
                selectedPlantId={selectedPlantId}
                onSaveGuide={saveToGuide}
                isSavingGuide={isSavingGuide}
              />
            ))}

            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} aria-hidden="true" />
          </div>

          {/* Photo preview */}
          {photoPreview && (
            <div className="px-5 pb-2 flex items-center gap-2">
              <img
                src={photoPreview}
                alt="Selected photo preview"
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
              />
              <button
                onClick={() => {
                  setPhoto(null);
                  setPhotoPreview(null);
                }}
                className="text-xs text-red-500 font-semibold hover:underline"
                aria-label="Remove selected photo"
              >
                Remove
              </button>
            </div>
          )}

          {/* Input bar */}
          <div className="border-t border-gray-100 px-4 py-3">
            {!selectedPlantId && plants.length > 0 && (
              <p
                className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-2 font-medium"
                role="status"
                aria-live="polite"
              >
                💡 Select a plant above for personalised advice
              </p>
            )}
            <div className="flex items-end gap-2">
              {/* Photo upload */}
              <button
                onClick={() => fileRef.current?.click()}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-400 hover:bg-[#00b566]/10 hover:border-[#00b566]/30 hover:text-[#00b566] transition-colors"
                aria-label="Upload a photo of your plant"
              >
                📷
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                aria-hidden="true"
                onChange={handlePhotoSelect}
              />

              {/* Text input */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={
                  selectedPlantId
                    ? "Ask about your plant's care, health, growth..."
                    : "Ask anything about plant care..."
                }
                rows={1}
                className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1c1c1c] placeholder-gray-400 focus:outline-none focus:border-[#00b566] focus:ring-2 focus:ring-[#00b566]/20 max-h-32 overflow-y-auto"
                aria-label="Type your plant care question"
              />

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={isSending || (!input.trim() && !photo)}
                aria-label="Send message"
                aria-busy={isSending}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-[#00b566] text-white font-bold text-lg hover:bg-[#009959] disabled:opacity-40 disabled:cursor-not-allowed transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00b566]"
              >
                {isSending ? "⏳" : "↑"}
              </button>
            </div>

            {/* Rating (shows after 3+ messages) */}
            {messages.length >= 3 && (
              <div className="flex items-center gap-2 mt-2 justify-end">
                <span className="text-xs text-gray-400">Was this helpful?</span>
                <button
                  onClick={() => rateSession("helpful")}
                  className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                  aria-label="Rate as helpful"
                >
                  👍
                </button>
                <button
                  onClick={() => rateSession("not_helpful")}
                  className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  aria-label="Rate as not helpful"
                >
                  👎
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
