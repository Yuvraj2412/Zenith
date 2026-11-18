"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileImage,
  Loader2,
  Phone,
  Trophy,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import { SPORTS } from "@/data/sports";
import { createClient } from "@/lib/supabase/client";
import { buildScreenshotPath, validateScreenshotFile } from "@/lib/storage";
import type { PaymentStatus, Profile } from "@/types/database";
import { UpiQrCard } from "./UpiQrCard";

type ActiveRegistrationMap = Record<string, PaymentStatus>;

type Props = {
  profile: Profile;
  initialSportSlug?: string;
  initialCategoryId?: string;
  activeRegistrations: ActiveRegistrationMap;
  paymentConfig: {
    upiId: string;
    upiName: string;
    note: string;
  };
};

export function RegisterClient({
  profile,
  initialSportSlug,
  initialCategoryId,
  activeRegistrations,
  paymentConfig,
}: Props) {
  const router = useRouter();

  const defaultSport =
    SPORTS.find((s) => s.slug === initialSportSlug) ?? SPORTS[0];
  const [sportSlug, setSportSlug] = useState(defaultSport.slug);

  const selectedSport =
    SPORTS.find((s) => s.slug === sportSlug) ?? SPORTS[0];

  const defaultCategory =
    selectedSport.categories.find((c) => c.id === initialCategoryId) ??
    selectedSport.categories[0];

  const [categoryId, setCategoryId] = useState(defaultCategory.id);

  const selectedCategory =
    selectedSport.categories.find((c) => c.id === categoryId) ??
    selectedSport.categories[0];

  const [teamName, setTeamName] = useState(
    selectedCategory.entryType === "Individual"
      ? profile.full_name
      : `${profile.college} Team`
  );
  const [squadCount, setSquadCount] = useState<number>(
    selectedCategory.minPlayers
  );
  const [playerNames, setPlayerNames] = useState(profile.full_name || "");
  const [utrNumber, setUtrNumber] = useState("");
  const [eligibilityConfirmed, setEligibilityConfirmed] = useState(false);

  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc);
    };
  }, [previewSrc]);

  function handleSelectSport(nextSlug: string) {
    const nextSport = SPORTS.find((s) => s.slug === nextSlug) ?? SPORTS[0];
    const nextCat = nextSport.categories[0];
    setSportSlug(nextSport.slug);
    setCategoryId(nextCat.id);
    setSquadCount(nextCat.minPlayers);
    if (nextCat.entryType === "Individual") {
      setTeamName(profile.full_name);
    } else if (teamName === profile.full_name) {
      setTeamName(`${profile.college} ${nextSport.name}`);
    }
    setError(null);
  }

  function handleSelectCategory(nextCatId: string) {
    const nextCat =
      selectedSport.categories.find((c) => c.id === nextCatId) ??
      selectedSport.categories[0];
    setCategoryId(nextCat.id);
    setSquadCount(nextCat.minPlayers);
    if (nextCat.entryType === "Individual") {
      setTeamName(profile.full_name);
    } else if (teamName === profile.full_name) {
      setTeamName(`${profile.college} ${selectedSport.name}`);
    }
    setError(null);
  }

  function handleFileChange(file: File | null) {
    if (!file) return;
    const fileError = validateScreenshotFile(file);
    if (fileError) {
      setError(fileError);
      return;
    }
    if (previewSrc) URL.revokeObjectURL(previewSrc);
    setScreenshotFile(file);
    setPreviewSrc(URL.createObjectURL(file));
    setError(null);
  }

  const activeKey = `${selectedSport.slug}:${selectedCategory.id}`;
  const alreadyRegisteredStatus = activeRegistrations[activeKey];
  const ageWarning =
    profile.age !== null && profile.age > selectedSport.ageLimit;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (alreadyRegisteredStatus) return;

    if (!eligibilityConfirmed) {
      setError(
        "Please confirm that all participants meet the university student, age, College ID, and Aadhar ID eligibility rules."
      );
      return;
    }
    if (utrNumber.trim().length < 4) {
      setError("Please enter your UPI Transaction ID / UTR reference number.");
      return;
    }
    if (!screenshotFile) {
      setError("Please attach and upload your payment screenshot.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const filePath = buildScreenshotPath(
        profile.id,
        `${selectedSport.slug}-${selectedCategory.id}`,
        screenshotFile.name
      );

      const { error: uploadErr } = await supabase.storage
        .from("payment-screenshots")
        .upload(filePath, screenshotFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadErr) {
        setError(`Screenshot upload failed: ${uploadErr.message}`);
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport_slug: selectedSport.slug,
          category_id: selectedCategory.id,
          team_name: teamName.trim(),
          squad_count: Number(squadCount),
          player_names: playerNames.trim(),
          utr_number: utrNumber.trim(),
          payment_screenshot_path: filePath,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not complete registration.");
        setSubmitting(false);
        return;
      }

      router.push("/profile?submitted=1");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* 7 Sports Selector Strip */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
          1. Select Sport (7 Official Events)
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SPORTS.map((sport) => {
            const active = sport.slug === selectedSport.slug;
            return (
              <button
                key={sport.slug}
                type="button"
                onClick={() => handleSelectSport(sport.slug)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  active
                    ? "bg-blue-700 text-white shadow-sm"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {sport.name}
              </button>
            );
          })}
        </div>

        {/* Category Selector if sport has Men's & Women's */}
        {selectedSport.categories.length > 1 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <span className="mr-2 text-xs font-semibold text-slate-500">
              Category:
            </span>
            {selectedSport.categories.map((cat) => {
              const active = cat.id === selectedCategory.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    active
                      ? "bg-orange-500 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-orange-300"
                  }`}
                >
                  {cat.label} ({cat.feeDisplay})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Already Registered Notice */}
      {alreadyRegisteredStatus && (
        <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-bold text-emerald-950">
                Already Registered for {selectedSport.name} (
                {selectedCategory.label})
              </p>
              <p className="text-xs text-emerald-800">
                Your current payment status is{" "}
                <strong className="uppercase">{alreadyRegisteredStatus}</strong>.
                View your entry or pick another sport above.
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
          >
            View in Profile
          </Link>
        </div>
      )}

      {/* Main Registration + Payment Form */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-12 lg:items-start"
      >
        {/* Left Column: Event Summary + Team Details */}
        <div className="space-y-6 lg:col-span-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  {selectedCategory.label}
                </span>
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  {selectedSport.name}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase text-slate-400">
                  Reg. Fee
                </p>
                <p className="font-display text-2xl font-bold text-orange-600">
                  {selectedCategory.feeDisplay}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="flex items-center gap-1 text-slate-500">
                  <Trophy className="h-3.5 w-3.5 text-orange-500" />
                  Prize Pool*
                </span>
                <p className="mt-1 font-display text-base font-bold text-slate-900">
                  {selectedCategory.prizePoolDisplay}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="flex items-center gap-1 text-slate-500">
                  <Users className="h-3.5 w-3.5 text-blue-600" />
                  Squad Limit
                </span>
                <p className="mt-1 font-semibold text-slate-900">
                  {selectedCategory.squadRuleLabel}
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600">
              <p>
                <strong>Format:</strong> {selectedCategory.format}
              </p>
              <p>
                <strong>Age Limit:</strong> {selectedSport.ageLimit} Years •
                University Students Only
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                <span className="font-semibold text-slate-700">
                  Coordinators:
                </span>
                {selectedSport.coordinators.map((c) => (
                  <a
                    key={c.phone}
                    href={`tel:${c.phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-1 text-blue-700 hover:underline"
                  >
                    <Phone className="h-3 w-3" />
                    {c.name} ({c.phone})
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900">
              2. {selectedCategory.entryType === "Individual" ? "Participant" : "Team"} Details
            </h3>

            {ageWarning && (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  Note: Your profile age ({profile.age}) exceeds the{" "}
                  {selectedSport.ageLimit}-year player age limit. Ensure all
                  competing players meet the age rule.
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                {selectedCategory.entryType === "Individual"
                  ? "Player Name *"
                  : "Team Name *"}
              </label>
              <input
                type="text"
                required
                disabled={Boolean(alreadyRegisteredStatus)}
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. IIST Mavericks"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Captain / Contact (From Profile)
                </label>
                <input
                  type="text"
                  disabled
                  value={`${profile.full_name} (${profile.phone})`}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-xs text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Total Players ({selectedCategory.minPlayers}–
                  {selectedCategory.maxPlayers}) *
                </label>
                <input
                  type="number"
                  required
                  disabled={
                    Boolean(alreadyRegisteredStatus) ||
                    selectedCategory.minPlayers === selectedCategory.maxPlayers
                  }
                  min={selectedCategory.minPlayers}
                  max={selectedCategory.maxPlayers}
                  value={squadCount}
                  onChange={(e) => setSquadCount(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Squad Player Names (comma or line separated)
              </label>
              <textarea
                rows={3}
                disabled={Boolean(alreadyRegisteredStatus)}
                value={playerNames}
                onChange={(e) => setPlayerNames(e.target.value)}
                placeholder="List player names (optional if finalizing roster before arrival)"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            <label className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={eligibilityConfirmed}
                disabled={Boolean(alreadyRegisteredStatus)}
                onChange={(e) => setEligibilityConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
              />
              <span>
                I confirm all participants are university students within the{" "}
                {selectedSport.ageLimit}-year age limit and will carry original
                College ID & Aadhar ID at ZENITH 2027.
              </span>
            </label>
          </div>
        </div>

        {/* Right Column: Payment QR & Screenshot Upload */}
        <div className="space-y-6 lg:col-span-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                3. Pay Fee & Attach Screenshot
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Pay{" "}
                <strong className="text-slate-800">
                  {selectedCategory.feeDisplay}
                </strong>{" "}
                and upload the payment confirmation screenshot. Admin approval
                will change your status from Pending to Success.
              </p>
            </div>

            <UpiQrCard
              upiId={paymentConfig.upiId}
              upiName={paymentConfig.upiName}
              paymentNote={paymentConfig.note}
              amountInr={selectedCategory.feeInr}
              sportLabel={`${selectedSport.name} (${selectedCategory.label})`}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                UPI Transaction ID / UTR Number *
              </label>
              <input
                type="text"
                required
                disabled={Boolean(alreadyRegisteredStatus)}
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 432198765432"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Upload Payment Screenshot (PNG, JPG, WEBP • Max 5 MB) *
              </label>

              {!previewSrc ? (
                <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-orange-400 hover:bg-orange-50/40">
                  <UploadCloud className="h-8 w-8 text-blue-700" />
                  <span className="mt-2 text-sm font-semibold text-slate-800">
                    Click to attach payment screenshot
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    Make sure the UTR / Transaction ID and amount are clearly
                    visible
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    disabled={Boolean(alreadyRegisteredStatus)}
                    onChange={(e) =>
                      handleFileChange(e.target.files?.[0] ?? null)
                    }
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2 pb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 truncate">
                      <FileImage className="h-4 w-4 text-blue-700 shrink-0" />
                      {screenshotFile?.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (previewSrc) URL.revokeObjectURL(previewSrc);
                        setPreviewSrc(null);
                        setScreenshotFile(null);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-red-600 border border-slate-200 hover:bg-red-50 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewSrc}
                    alt="Selected payment screenshot preview"
                    className="max-h-64 w-full rounded-xl border border-slate-200 bg-white object-contain"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || Boolean(alreadyRegisteredStatus)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting
                ? "Uploading Screenshot & Submitting..."
                : `Submit Registration (${selectedCategory.feeDisplay})`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
