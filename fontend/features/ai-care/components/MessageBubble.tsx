"use client";
import { useState } from "react";
import { ChatMessage, SuggestedProduct } from "../api/ai-care.api";

interface Props {
  message:         ChatMessage;
  sessionUuid:     string | null;
  selectedPlantId: number | null;
  onSaveGuide:     (data: {
    messageContent: string;
    category:       string;
    title:          string;
    severity:       string;
  }) => void;
  isSavingGuide: boolean;
}

const SAVE_CATEGORIES = [
  { value: "disease",     label: "🦠 Disease" },
  { value: "pest",        label: "🐛 Pest" },
  { value: "watering",    label: "💧 Watering" },
  { value: "fertilising", label: "🌱 Fertilising" },
  { value: "repotting",   label: "🪴 Repotting" },
  { value: "light",       label: "☀️ Light" },
  { value: "general",     label: "📝 General" },
];

export function MessageBubble({
  message, sessionUuid, selectedPlantId, onSaveGuide, isSavingGuide,
}: Props) {
  const isUser = message.role === "user";
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [saveSuccess,  setSaveSuccess]  = useState(false);

  const handleSaveGuide = (category: string) => {
    onSaveGuide({
      messageContent: message.content,
      category,
      title:    `AI advice — ${category}`,
      severity: "info",
    });
    setSaveSuccess(true);
    setShowSaveMenu(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-3`}>
      {/* AI avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#00b566]/10 flex items-center justify-center flex-shrink-0 text-base">
          🌿
        </div>
      )}

      <div className="max-w-[78%] group">
        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-[#00b566] text-white rounded-br-sm"
              : "bg-gray-50 text-[#1c1c1c] rounded-bl-sm border border-gray-100"
          }`}
        >
          <FormattedMessage content={message.content} />
        </div>

        {/* Timestamp */}
        <p className={`text-[10px] text-gray-400 mt-1 ${isUser ? "text-right" : "text-left"}`}>
          {message.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </p>

        {/* AI message actions */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Auto-saved badge */}
            {message.savedGuide && (
              <span className="text-xs bg-green-50 text-green-600 border border-green-200 rounded-full px-2 py-0.5 font-medium">
                ✓ Saved to care guide
              </span>
            )}

            {/* Manual save button */}
            {!message.savedGuide && selectedPlantId && (
              <div className="relative">
                <button
                  onClick={() => setShowSaveMenu(!showSaveMenu)}
                  className="text-xs text-gray-400 hover:text-[#00b566] border border-gray-200 rounded-full px-2 py-0.5 transition-colors hover:border-[#00b566]/30"
                  aria-label="Save this advice to plant care guide"
                >
                  {saveSuccess ? "✓ Saved!" : "💾 Save to guide"}
                </button>

                {/* Category picker dropdown */}
                {showSaveMenu && (
                  <div className="absolute bottom-8 left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-2 min-w-[160px] z-10">
                    {SAVE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => handleSaveGuide(cat.value)}
                        disabled={isSavingGuide}
                        className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-[#00b566]/10 text-[#1c1c1c] transition-colors"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Suggested products */}
        {!isUser && message.suggestedProducts && message.suggestedProducts.length > 0 && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {message.suggestedProducts.map((product) => (
              <a
                key={product.uuid}
                href={`/plants/${product.uuid}`}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-[#1c1c1c] hover:border-[#00b566]/40 hover:bg-[#00b566]/5 transition-colors"
                aria-label={`View ${product.title} — ₹${product.price}`}
              >
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.title} className="w-8 h-8 rounded-lg object-cover" />
                )}
                <div>
                  <p className="font-semibold">{product.title}</p>
                  <p className="text-[#00b566]">₹{product.price}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-[#00b566] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
          You
        </div>
      )}
    </div>
  );
}

function FormattedMessage({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*|\n)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part === "\n") return <br key={i} />;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
