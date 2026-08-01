"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPlantApi, updatePlantApi, PlantPayload } from "../api/plants.api";

const plantSchema = z.object({
  plantName:            z.string().min(2, "Name must be at least 2 characters"),
  nickname:             z.string().optional(),
  location:             z.string().optional(),
  addedAt:              z.string().min(1, "Date added is required"),
  heightCm:             z.number().min(0).max(999).optional(),
  growthStage:          z.enum(["seedling", "juvenile", "adolescent", "mature", "dormant"]).optional(),
  potSizeCm:            z.number().min(1).max(200).optional(),
  soilType:             z.string().optional(),
  sunlightExposure:     z.enum(["full_sun", "partial_sun", "indirect_bright", "low_light", "artificial_only"]).optional(),
  healthStatus:         z.enum(["thriving", "healthy", "needs_attention", "sick", "recovering"]).optional(),
  isPetHousehold:       z.boolean().default(false),
  lastWateredAt:        z.string().optional(),
  wateringIntervalDays: z.number().min(1).max(365).default(7),
  lastFertilisedAt:     z.string().optional(),
  lastRepottedAt:       z.string().optional(),
  userNotes:            z.string().max(1000).optional(),
});

type PlantFormData = z.infer<typeof plantSchema>;

interface Props {
  plant?: any;
  onSuccess?: () => void;
}

export function PlantForm({ plant, onSuccess }: Props) {
  const qc = useQueryClient();
  const isEdit = !!plant;
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    plant?.photo_url ?? null
  );
  const [activeSection, setActiveSection] = useState<
    "basic" | "growth" | "care" | "notes"
  >("basic");

  const form = useForm<PlantFormData>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      plantName:            plant?.plant_name            ?? "",
      nickname:             plant?.nickname              ?? "",
      location:             plant?.location              ?? "",
      addedAt:              plant?.added_at              ?? new Date().toISOString().split("T")[0],
      heightCm:             plant?.height_cm             ? Number(plant.height_cm) : undefined,
      growthStage:          plant?.growth_stage          ?? undefined,
      potSizeCm:            plant?.pot_size_cm           ? Number(plant.pot_size_cm) : undefined,
      soilType:             plant?.soil_type             ?? "",
      sunlightExposure:     plant?.sunlight_exposure     ?? undefined,
      healthStatus:         plant?.health_status         ?? "healthy",
      isPetHousehold:       plant?.is_pet_household      ?? false,
      lastWateredAt:        plant?.last_watered_at       ?? "",
      wateringIntervalDays: plant?.watering_interval_days ?? 7,
      lastFertilisedAt:     plant?.last_fertilised_at    ?? "",
      lastRepottedAt:       plant?.last_repotted_at      ?? "",
      userNotes:            plant?.user_notes            ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: PlantFormData) => {
      const payload: PlantPayload = {
        ...data,
        photo: photo ?? undefined,
      };
      return isEdit
        ? updatePlantApi(plant.id, payload)
        : addPlantApi(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-plants"] });
      qc.invalidateQueries({ queryKey: ["ai-care-plants"] });
      onSuccess?.();
    },
  });

  const sections = [
    { id: "basic",  label: "Basic Info",    icon: "🌿" },
    { id: "growth", label: "Growth",        icon: "📏" },
    { id: "care",   label: "Care Schedule", icon: "💧" },
    { id: "notes",  label: "My Notes",      icon: "📝" },
  ] as const;

  return (
    <form
      onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
      aria-label={isEdit ? "Edit plant" : "Add new plant"}
      noValidate
    >
      {/* Section tabs */}
      <div
        className="flex gap-1 mb-6 bg-gray-50 p-1 rounded-xl"
        role="tablist"
        aria-label="Plant form sections"
      >
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-selected={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg transition-all ${
              activeSection === section.id
                ? "bg-white text-[#00b566] shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span aria-hidden="true">{section.icon}</span>
            <span className="hidden sm:inline">{section.label}</span>
          </button>
        ))}
      </div>

      {/* SECTION 1: Basic Info */}
      {activeSection === "basic" && (
        <div className="space-y-4" role="tabpanel" aria-label="Basic info">
          {/* Photo upload */}
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl bg-[#00b566]/10 border-2 border-dashed border-[#00b566]/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#00b566]/60 transition-colors"
              onClick={() =>
                document.getElementById("plant-photo-input")?.click()
              }
              role="button"
              aria-label="Upload plant photo"
              tabIndex={0}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Plant preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">📷</span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1c1c1c]">Plant photo</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Helps the AI identify your plant visually
              </p>
              <input
                id="plant-photo-input"
                type="file"
                accept="image/*"
                className="hidden"
                aria-hidden="true"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setPhoto(f);
                  setPhotoPreview(URL.createObjectURL(f));
                }}
              />
            </div>
          </div>

          {/* Plant name */}
          <FormField
            label="Plant Name"
            required
            error={form.formState.errors.plantName?.message}
          >
            <input
              {...form.register("plantName")}
              type="text"
              placeholder="e.g. Monstera Deliciosa"
              className={inputClass(!!form.formState.errors.plantName)}
              aria-required="true"
              autoComplete="off"
            />
          </FormField>

          {/* Nickname */}
          <FormField label="Nickname" hint="What do you call it?">
            <input
              {...form.register("nickname")}
              type="text"
              placeholder="e.g. Monty, Big Leaf"
              className={inputClass(false)}
            />
          </FormField>

          {/* Location */}
          <FormField label="Location" hint="Where in your home?">
            <input
              {...form.register("location")}
              type="text"
              placeholder="e.g. Living Room, Balcony, Bedroom"
              className={inputClass(false)}
            />
          </FormField>

          {/* Date added */}
          <FormField
            label="Date Added"
            required
            error={form.formState.errors.addedAt?.message}
          >
            <input
              {...form.register("addedAt")}
              type="date"
              className={inputClass(!!form.formState.errors.addedAt)}
              aria-required="true"
            />
          </FormField>

          {/* Health status */}
          <FormField label="Current Health Status">
            <Controller
              name="healthStatus"
              control={form.control}
              render={({ field }) => (
                <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Health status">
                  {[
                    { value: "thriving",        label: "Thriving",   icon: "🌟" },
                    { value: "healthy",         label: "Healthy",    icon: "✅" },
                    { value: "needs_attention", label: "Needs care", icon: "⚠️" },
                    { value: "sick",            label: "Sick",       icon: "🤒" },
                    { value: "recovering",      label: "Recovering", icon: "💪" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={field.value === opt.value}
                      onClick={() => field.onChange(opt.value)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all ${
                        field.value === opt.value
                          ? "border-[#00b566] bg-[#00b566]/10 text-[#00b566]"
                          : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-xl" aria-hidden="true">{opt.icon}</span>
                      <span className="text-[9px] font-semibold leading-tight">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            />
          </FormField>

          {/* Pet household toggle */}
          <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#1c1c1c]">
                🐾 Pet household
              </p>
              <p className="text-xs text-gray-500">
                AI will avoid recommending toxic treatments
              </p>
            </div>
            <Controller
              name="isPetHousehold"
              control={form.control}
              render={({ field }) => (
                <button
                  type="button"
                  role="switch"
                  aria-checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    field.value ? "bg-[#00b566]" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${
                      field.value ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              )}
            />
          </div>
        </div>
      )}

      {/* SECTION 2: Growth */}
      {activeSection === "growth" && (
        <div className="space-y-4" role="tabpanel" aria-label="Growth info">
          <FormField label="Current Height (cm)" hint="Helps AI give size-appropriate advice">
            <div className="flex items-center gap-2">
              <input
                {...form.register("heightCm", { valueAsNumber: true })}
                type="number"
                min="0"
                max="999"
                step="0.5"
                placeholder="e.g. 45"
                className={`${inputClass(false)} flex-1`}
              />
              <span className="text-sm text-gray-400 font-medium w-8">cm</span>
            </div>
          </FormField>

          <FormField label="Growth Stage">
            <Controller
              name="growthStage"
              control={form.control}
              render={({ field }) => (
                <div className="grid grid-cols-5 gap-2" role="radiogroup">
                  {[
                    { value: "seedling",   label: "Seedling", icon: "🌱" },
                    { value: "juvenile",   label: "Juvenile", icon: "🌿" },
                    { value: "adolescent", label: "Young",    icon: "🪴" },
                    { value: "mature",     label: "Mature",   icon: "🌳" },
                    { value: "dormant",    label: "Dormant",  icon: "😴" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={field.value === opt.value}
                      onClick={() => field.onChange(opt.value)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all ${
                        field.value === opt.value
                          ? "border-[#00b566] bg-[#00b566]/10"
                          : "border-gray-200 bg-gray-50 text-gray-400"
                      }`}
                    >
                      <span className="text-xl" aria-hidden="true">{opt.icon}</span>
                      <span className="text-[9px] font-semibold leading-tight text-[#1c1c1c]">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            />
          </FormField>

          <FormField label="Pot Diameter (cm)">
            <input
              {...form.register("potSizeCm", { valueAsNumber: true })}
              type="number"
              min="5"
              max="200"
              step="1"
              placeholder="e.g. 14"
              className={inputClass(false)}
            />
          </FormField>

          <FormField label="Soil / Growing Media">
            <select {...form.register("soilType")} className={inputClass(false)}>
              <option value="">Select soil type</option>
              <option value="General potting mix">General potting mix</option>
              <option value="Cactus & succulent mix">Cactus & succulent mix</option>
              <option value="Cocopeat">Cocopeat</option>
              <option value="Peat-based mix">Peat-based mix</option>
              <option value="Loamy garden soil">Loamy garden soil</option>
              <option value="Bark & perlite mix">Bark & perlite mix</option>
              <option value="Hydroponics">Hydroponics</option>
              <option value="Custom mix">Custom mix</option>
            </select>
          </FormField>

          <FormField label="Sunlight Exposure">
            <div className="space-y-2" role="radiogroup" aria-label="Sunlight exposure">
              {[
                { value: "full_sun",        label: "Full Sun",        desc: "6+ hours direct sun",         icon: "☀️" },
                { value: "partial_sun",     label: "Partial Sun",     desc: "3–6 hours direct sun",        icon: "🌤️" },
                { value: "indirect_bright", label: "Indirect Bright", desc: "Bright room, no direct rays", icon: "💡" },
                { value: "low_light",       label: "Low Light",       desc: "Away from windows",            icon: "🌑" },
                { value: "artificial_only", label: "Artificial Light",desc: "Grow lights only",            icon: "💡" },
              ].map((opt) => (
                <Controller
                  key={opt.value}
                  name="sunlightExposure"
                  control={form.control}
                  render={({ field }) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={field.value === opt.value}
                      onClick={() => field.onChange(opt.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        field.value === opt.value
                          ? "border-[#00b566] bg-[#00b566]/10"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-xl w-7" aria-hidden="true">{opt.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-[#1c1c1c]">{opt.label}</p>
                        <p className="text-xs text-gray-400">{opt.desc}</p>
                      </div>
                    </button>
                  )}
                />
              ))}
            </div>
          </FormField>
        </div>
      )}

      {/* SECTION 3: Care Schedule */}
      {activeSection === "care" && (
        <div className="space-y-4" role="tabpanel" aria-label="Care schedule">
          <FormField label="Last Watered">
            <input
              {...form.register("lastWateredAt")}
              type="date"
              className={inputClass(false)}
              max={new Date().toISOString().split("T")[0]}
            />
          </FormField>

          <FormField
            label="Water every (days)"
            hint="AI uses this to compute next watering date"
          >
            <div className="flex items-center gap-3">
              <input
                {...form.register("wateringIntervalDays", { valueAsNumber: true })}
                type="range"
                min="1"
                max="30"
                step="1"
                className="flex-1 accent-[#00b566]"
                aria-label="Watering interval in days"
              />
              <span className="text-sm font-bold text-[#00b566] w-16 text-right">
                {form.watch("wateringIntervalDays")} day
                {form.watch("wateringIntervalDays") !== 1 ? "s" : ""}
              </span>
            </div>
          </FormField>

          <FormField label="Last Fertilised">
            <input
              {...form.register("lastFertilisedAt")}
              type="date"
              className={inputClass(false)}
              max={new Date().toISOString().split("T")[0]}
            />
          </FormField>

          <FormField label="Last Repotted">
            <input
              {...form.register("lastRepottedAt")}
              type="date"
              className={inputClass(false)}
              max={new Date().toISOString().split("T")[0]}
            />
          </FormField>
        </div>
      )}

      {/* SECTION 4: Notes */}
      {activeSection === "notes" && (
        <div role="tabpanel" aria-label="Personal notes">
          <FormField
            label="Your Notes"
            hint="The AI reads these notes to give personalised advice"
          >
            <textarea
              {...form.register("userNotes")}
              rows={6}
              placeholder={
                "Add anything useful about this plant:\n" +
                "• Leaves turned yellow last winter\n" +
                "• Moved from balcony to bedroom in June\n" +
                "• Reacted badly to direct afternoon sun\n" +
                "• Used neem oil for pests in March — worked well"
              }
              className={`${inputClass(false)} resize-none leading-relaxed`}
              aria-describedby="notes-hint"
            />
            <p id="notes-hint" className="text-xs text-gray-400 mt-1.5">
              {form.watch("userNotes")?.length ?? 0} / 1000 characters
            </p>
          </FormField>
        </div>
      )}

      {/* Navigation + Submit */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        {activeSection !== "basic" && (
          <button
            type="button"
            onClick={() => {
              const order = ["basic", "growth", "care", "notes"] as const;
              const idx = order.indexOf(activeSection);
              setActiveSection(order[idx - 1]);
            }}
            className="text-sm font-semibold text-gray-400 hover:text-gray-600"
          >
            ← Back
          </button>
        )}
        {activeSection === "basic" && <div />}

        {activeSection !== "notes" ? (
          <button
            type="button"
            onClick={() => {
              const order = ["basic", "growth", "care", "notes"] as const;
              const idx = order.indexOf(activeSection);
              setActiveSection(order[idx + 1]);
            }}
            className="bg-[#00b566] text-white text-sm font-semibold rounded-full px-5 py-2.5 hover:bg-[#009959] transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            type="submit"
            disabled={mutation.isPending}
            aria-busy={mutation.isPending}
            className="bg-[#00b566] text-white text-sm font-semibold rounded-full px-6 py-2.5 hover:bg-[#009959] disabled:opacity-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00b566]"
          >
            {mutation.isPending
              ? isEdit ? "Saving…" : "Adding plant…"
              : isEdit ? "Save Changes" : "Add Plant 🌿"}
          </button>
        )}
      </div>

      {mutation.isError && (
        <p role="alert" className="text-xs text-red-500 mt-3 text-center">
          ⚠ {(mutation.error as any)?.response?.data?.detail ?? "Something went wrong. Please try again."}
        </p>
      )}
    </form>
  );
}

function inputClass(hasError: boolean) {
  return `w-full h-11 px-4 border rounded-xl text-sm text-[#1c1c1c] bg-white placeholder-gray-400 transition-all outline-none focus:border-[#00b566] focus:ring-2 focus:ring-[#00b566]/20 ${
    hasError ? "border-red-400 bg-red-50" : "border-gray-200"
  }`;
}

function FormField({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
        {label}
        {required && (
          <span className="text-red-500 ml-0.5" aria-label="required">*</span>
        )}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      {children}
      {error && <p role="alert" className="text-xs text-red-500 mt-1">⚠ {error}</p>}
    </div>
  );
}
