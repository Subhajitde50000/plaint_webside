import { CareLog } from "../api/ai-care.api";

const TYPE_ICONS: Record<string, string> = {
  watered: "💧",
  fertilised: "🌱",
  repotted: "🪴",
  pruned: "✂️",
  note: "📝",
};

export function CareLogsPanel({ logs }: { logs: CareLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-2xl mb-2">📜</p>
        <p className="text-sm font-semibold text-gray-600">No care logs recorded</p>
        <p className="text-xs text-gray-400 mt-1">
          Activity logs will appear here when you log care actions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        Activity Timeline ({logs.length})
      </p>
      <div className="relative border-l-2 border-gray-100 ml-2 space-y-4 pl-4 py-1">
        {logs.map((log) => (
          <div key={log.id} className="relative">
            {/* Timeline node */}
            <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#00b566] flex items-center justify-center text-[8px]">
              {TYPE_ICONS[log.type] ?? "📝"}
            </span>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#1c1c1c] capitalize">
                  {log.type}
                </span>
                {log.source !== "user" && (
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">
                    {log.source}
                  </span>
                )}
                {log.loggedAt && (
                  <span className="text-[10px] text-gray-400 ml-auto">
                    {new Date(log.loggedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                )}
              </div>
              {log.note && (
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  {log.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
