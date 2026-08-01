export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3" aria-label="AI is typing" role="status">
      <div className="w-8 h-8 rounded-full bg-[#00b566]/10 flex items-center justify-center text-base">
        🌿
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-[#00b566] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
