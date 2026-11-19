"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Info,
  Phone,
  Trophy,
  Users,
} from "lucide-react";
import { SPORTS } from "@/data/sports";
import type { PaymentStatus, Profile } from "@/types/database";

type ActiveRegistrationMap = Record<string, PaymentStatus>;

type Props = {
  profile: Profile;
  initialSportSlug?: string;
  initialCategoryId?: string;
  activeRegistrations: ActiveRegistrationMap;
};

export function RegisterClient({
  profile,
  initialSportSlug,
  initialCategoryId,
  activeRegistrations,
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
  const [accommodationRequired, setAccommodationRequired] = useState(false);
  const [accommodationPlayers, setAccommodationPlayers] = useState<number>(
    selectedCategory.minPlayers
  );
  const [eligibilityConfirmed, setEligibilityConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSelectSport(nextSlug: string) {
    const nextSport = SPORTS.find((s) => s.slug === nextSlug) ?? SPORTS[0];
    const nextCat = nextSport.categories[0];
    setSportSlug(nextSport.slug);
    setCategoryId(nextCat.id);
    setSquadCount(nextCat.minPlayers);
    setAccommodationPlayers(nextCat.minPlayers);
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
    setAccommodationPlayers(nextCat.minPlayers);
    if (nextCat.entryType === "Individual") {
      setTeamName(profile.full_name);
    } else if (teamName === profile.full_name) {
      setTeamName(`${profile.college} ${selectedSport.name}`);
    }
    setError(null);
  }

  const activeKey = `${selectedSport.slug}:${selectedCategory.id}`;
  const alreadyRegisteredStatus = activeRegistrations[activeKey];
  const ageWarning =
    profile.age !== null && profile.age > selectedSport.ageLimit;

  function handleProceedToPayment(e: FormEvent) {
    e.preventDefault();
    if (alreadyRegisteredStatus) return;

    if (teamName.trim().length < 2) {
      setError("Please enter a valid team name.");
      return;
    }

    if (
      !Number.isInteger(squadCount) ||
      squadCount < selectedCategory.minPlayers ||
      squadCount > selectedCategory.maxPlayers
    ) {
      setError(
        `Squad size must be between ${selectedCategory.minPlayers} and ${selectedCategory.maxPlayers} players.`
      );
      return;
    }

    if (!eligibilityConfirmed) {
      setError(
        "Please confirm that only one member per team is registering and all players meet the eligibility rules."
      );
      return;
    }

    setError(null);

    const params = new URLSearchParams({
      sport: selectedSport.slug,
      category: selectedCategory.id,
      team: teamName.trim(),
      squad: String(squadCount),
      players: playerNames.trim(),
      acc: accommodationRequired ? "1" : "0",
      accPlayers: accommodationRequired
        ? String(
            Math.max(1, Math.min(squadCount, accommodationPlayers || squadCount))
          )
        : "0",
    });

    router.push(`/payment?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      {/* One Member Per Team Policy Strip */}
      <div className="flex items-start gap-3 rounded-sm border border-[#16408B]/20 border-l-4 border-l-[#16408B] bg-white px-5 py-4 shadow-xs">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#16408B]" />
        <p className="text-xs leading-relaxed text-[#091930]/80 sm:text-sm">
          <strong className="font-semibold text-[#091930]">
            Team Registration Rule:
          </strong>{" "}
          Only <strong>one member (captain or representative) per team</strong>{" "}
          should register for an event. Do not submit duplicate registrations for
          the same team.
        </p>
      </div>

      {/* Sports Selector Strip */}
      <div className="rounded-sm border border-slate-200 bg-white p-5 shadow-xs">
        <p className="label text-[#16408B]">1. Select Sport</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SPORTS.map((sport) => {
            const active = sport.slug === selectedSport.slug;
            return (
              <button
                key={sport.slug}
                type="button"
                onClick={() => handleSelectSport(sport.slug)}
                className={`rounded-sm px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  active
                    ? "bg-[#16408B] text-white shadow-sm"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-[#16408B]/40 hover:bg-blue-50"
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
              Division:
            </span>
            {selectedSport.categories.map((cat) => {
              const active = cat.id === selectedCategory.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`rounded-sm px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    active
                      ? "bg-[#D9531E] text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-[#D9531E]"
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
        <div className="flex flex-col gap-3 rounded-sm border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between">
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
                View your entry in Profile or choose another sport above.
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="inline-flex shrink-0 items-center justify-center rounded-sm bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
          >
            View in Profile
          </Link>
        </div>
      )}

      {/* Team & Accommodation Form */}
      <form
        onSubmit={handleProceedToPayment}
        className="grid gap-6 lg:grid-cols-12 lg:items-start"
      >
        {/* Left: Sport Summary Card */}
        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-xs lg:col-span-5">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="label !text-[0.62rem] text-[#D9531E]">
                {selectedCategory.label}
              </span>
              <h2 className="mt-1 font-display text-2xl font-medium text-[#091930]">
                {selectedSport.name}
              </h2>
            </div>
            <div className="text-right">
              <p className="label !text-[0.6rem] text-slate-400">Entry Fee</p>
              <p className="font-display text-2xl font-medium text-[#D9531E]">
                {selectedCategory.feeDisplay}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-sm bg-[#F5F7FB] p-3">
              <span className="flex items-center gap-1 text-slate-500">
                <Trophy className="h-3.5 w-3.5 text-[#D9531E]" />
                Prize Pool*
              </span>
              <p className="mt-1 font-display text-lg font-medium text-[#091930]">
                {selectedCategory.prizePoolDisplay}
              </p>
            </div>
            <div className="rounded-sm bg-[#F5F7FB] p-3">
              <span className="flex items-center gap-1 text-slate-500">
                <Users className="h-3.5 w-3.5 text-[#16408B]" />
                Squad Limit
              </span>
              <p className="mt-1 font-semibold text-[#091930]">
                {selectedCategory.squadRuleLabel}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-xs text-slate-600">
            <p>
              <strong>Format:</strong> {selectedCategory.format}
            </p>
            <p>
              <strong>Age Limit:</strong> {selectedSport.ageLimit} Years •
              University Students Only
            </p>
            <div className="border-t border-slate-100 pt-3">
              <p className="font-semibold text-[#091930]">Coordinators:</p>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                {selectedSport.coordinators.map((c) => (
                  <a
                    key={c.phone}
                    href={`tel:${c.phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-1 text-[#16408B] hover:underline"
                  >
                    <Phone className="h-3 w-3 text-[#D9531E]" />
                    {c.name} ({c.phone})
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Team Details + Accommodation Dropdown */}
        <div className="space-y-5 rounded-sm border border-slate-200 bg-white p-6 shadow-xs lg:col-span-7">
          <h3 className="font-display text-xl font-medium text-[#091930]">
            2. Team &amp; Accommodation Details
          </h3>

          {ageWarning && (
            <div className="flex items-start gap-2.5 rounded-sm border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
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
                ? "Participant / Team Name *"
                : "Team Name *"}
            </label>
            <input
              type="text"
              required
              disabled={Boolean(alreadyRegisteredStatus)}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. IIST Mavericks"
              className="mt-1.5 w-full rounded-sm border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#16408B] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Team Representative (From Profile)
              </label>
              <input
                type="text"
                disabled
                value={`${profile.full_name} (${profile.phone})`}
                className="mt-1.5 w-full rounded-sm border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-xs text-slate-600"
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
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSquadCount(val);
                  if (accommodationPlayers > val) {
                    setAccommodationPlayers(val);
                  }
                }}
                className="mt-1.5 w-full rounded-sm border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#16408B] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
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
              placeholder="List squad members"
              className="mt-1.5 w-full rounded-sm border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#16408B] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          {/* Accommodation Checkbox + Dropdown Note */}
          <div className="rounded-sm border border-blue-200/80 bg-[#F5F7FB] p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accommodationRequired}
                disabled={Boolean(alreadyRegisteredStatus)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setAccommodationRequired(checked);
                  if (checked && accommodationPlayers < 1) {
                    setAccommodationPlayers(squadCount);
                  }
                }}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#16408B] focus:ring-[#16408B]"
              />
              <div className="flex-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#091930] sm:text-sm">
                  <Building2 className="h-4 w-4 text-[#D9531E]" />
                  Require Campus Accommodation?
                </span>
                <p className="mt-0.5 text-xs text-slate-600">
                  Check this if your team needs on-campus accommodation during
                  ZENITH 2027.
                </p>
              </div>
            </label>

            {accommodationRequired && (
              <div className="mt-3 space-y-3 border-t border-blue-200/70 pt-3 text-xs text-[#091930]/85">
                <p className="rounded-sm border-l-2 border-[#D9531E] bg-white px-3 py-2 font-medium text-[#091930]">
                  Accommodation will be provided in campus. Further details will
                  be shown on the payment page.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="font-semibold text-slate-700">
                    Members needing accommodation:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={squadCount}
                    value={accommodationPlayers}
                    onChange={(e) =>
                      setAccommodationPlayers(Number(e.target.value))
                    }
                    className="w-24 rounded-sm border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#16408B]"
                  />
                </div>
              </div>
            )}
          </div>

          <label className="flex items-start gap-2.5 rounded-sm border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={eligibilityConfirmed}
              disabled={Boolean(alreadyRegisteredStatus)}
              onChange={(e) => setEligibilityConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#16408B] focus:ring-[#16408B]"
            />
            <span>
              I confirm I am the single representative registering for my team,
              and all players are university students within the{" "}
              {selectedSport.ageLimit}-year age limit with valid College ID
              &amp; Aadhar ID.
            </span>
          </label>

          {error && (
            <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={Boolean(alreadyRegisteredStatus)}
            className="label flex w-full items-center justify-center gap-2 rounded-sm bg-[#D9531E] px-6 py-3.5 text-white shadow-lg shadow-[#D9531E]/25 transition hover:bg-[#BE4414] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            Proceed to Payment Page ({selectedCategory.feeDisplay})
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
