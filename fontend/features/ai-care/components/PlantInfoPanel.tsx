import { PlantDetail } from "../api/ai-care.api";

interface Props {
  plant: PlantDetail["plant"];
}

const HEALTH_COLOURS: Record<string, string> = {
  thriving:        "text-green-600 bg-green-50",
  healthy:         "text-green-500 bg-green-50",
  needs_attention: "text-amber-600 bg-amber-50",
  sick:            "text-red-500 bg-red-50",
  recovering:      "text-blue-500 bg-blue-50",
};

const HEALTH_ICONS: Record<string, string> = {
  thriving: "🌟",
  healthy: "✅",
  needs_attention: "⚠️",
  sick: "🤒",
  recovering: "💪",
};

export function PlantInfoPanel({ plant }: Props) {
  const waterDue = plant.nextWaterDue ? new Date(plant.nextWaterDue) : null;
  const waterStatus = waterDue
    ? (() => {
        const days = Math.round((waterDue.getTime() - Date.now()) / 86400000);
        if (days < 0) return { label: `Overdue ${Math.abs(days)}d`, colour: "text-red-500" };
        if (days === 0) return { label: "Due today", colour: "text-amber-600" };
        return { label: `In ${days} day${days > 1 ? "s" : ""}`, colour: "text-green-600" };
      })()
    : null;

  const infoRows = [
    { icon: "📍", label: "Location",     value: plant.location },
    { icon: "📏", label: "Height",       value: plant.heightCm ? `${plant.heightCm} cm` : null },
    { icon: "🌱", label: "Growth stage", value: plant.growthStage?.replace("_", " ") },
    { icon: "🪴", label: "Pot size",     value: plant.potSizeCm ? `${plant.potSizeCm} cm` : null },
    { icon: "🌍", label: "Soil",         value: plant.soilType },
    { icon: "☀️", label: "Sunlight",     value: plant.sunlightExposure?.replace(/_/g, " ") },
    { icon: "💧", label: "Next water",   value: waterStatus?.label, colour: waterStatus?.colour },
    {
      icon: "🌿",
      label: "Fertilised",
      value: plant.lastFertilisedAt
        ? new Date(plant.lastFertilisedAt).toLocaleDateString("en-IN")
        : "Not recorded",
    },
  ].filter((r) => r.value);

  return (
    <div className="space-y-3">
      {/* Plant photo + name */}
      <div className="flex items-center gap-3">
        {plant.photoUrl ? (
          <img
            src={plant.photoUrl}
            alt={plant.plantName}
            className="w-14 h-14 rounded-xl object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-[#00b566]/10 flex items-center justify-center text-2xl">
            🌿
          </div>
        )}
        <div>
          <p className="font-bold text-[#1c1c1c] text-sm">
            {plant.nickname || plant.plantName}
          </p>
          {plant.nickname && (
            <p className="text-xs text-gray-400">{plant.plantName}</p>
          )}
          {plant.healthStatus && (
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5 mt-1 ${
                HEALTH_COLOURS[plant.healthStatus] ?? ""
              }`}
            >
              {HEALTH_ICONS[plant.healthStatus]} {plant.healthStatus.replace("_", " ")}
            </span>
          )}
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-1.5">
        {infoRows.map((row) => (
          <div key={row.label} className="flex items-center gap-2 text-xs">
            <span aria-hidden="true">{row.icon}</span>
            <span className="text-gray-400 w-20 flex-shrink-0">{row.label}</span>
            <span className={`font-medium text-[#1c1c1c] capitalize ${row.colour ?? ""}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* User notes */}
      {plant.userNotes && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <p className="text-xs font-semibold text-amber-700 mb-1">📝 Your notes</p>
          <p className="text-xs text-amber-800 leading-relaxed">{plant.userNotes}</p>
        </div>
      )}
    </div>
  );
}

export function PlantInfoSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 bg-gray-200 rounded-xl" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
      </div>
    </div>
  );
}
