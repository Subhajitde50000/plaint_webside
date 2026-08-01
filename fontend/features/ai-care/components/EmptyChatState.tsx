import { UserPlantSummary } from "../api/ai-care.api";

export function EmptyChatState({
  plants,
  onSelectPlant,
}: {
  plants: UserPlantSummary[];
  onSelectPlant: (p: UserPlantSummary) => void;
}) {
  const quickPrompts = [
    "Why are my plant's leaves turning yellow?",
    "How often should I water my Monstera?",
    "Best fertiliser for indoor plants?",
    "How do I identify root rot?",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
      <div className="text-5xl mb-4">🌿</div>
      <h2 className="text-lg font-bold text-[#1c1c1c] mb-2">
        AI Plant Care Assistant
      </h2>
      <p className="text-sm text-gray-500 mb-6 max-w-sm leading-relaxed">
        {plants.length > 0
          ? "Select one of your plants from the panel to get personalised advice, or ask a general question."
          : "Add plants to your profile to get personalised care advice based on their specific health and history."}
      </p>

      {/* Quick prompts */}
      <div className="space-y-2 w-full max-w-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Quick questions
        </p>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            className="w-full text-left text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1c1c1c] hover:bg-[#00b566]/5 hover:border-[#00b566]/30 transition-colors"
            onClick={() => {
              const textarea = document.querySelector(
                "textarea[aria-label='Type your plant care question']"
              ) as HTMLTextAreaElement;
              if (textarea) {
                textarea.value = prompt;
                textarea.focus();
                textarea.dispatchEvent(new Event("input", { bubbles: true }));
              }
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {plants.length === 0 && (
        <a
          href="/account/plants"
          className="mt-6 inline-flex items-center gap-2 bg-[#00b566] text-white text-sm font-semibold rounded-full px-5 py-2.5 hover:bg-[#009959] transition-colors"
        >
          + Add your first plant
        </a>
      )}
    </div>
  );
}
