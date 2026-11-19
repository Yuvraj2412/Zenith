"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Lock,
  Phone,
  ShieldAlert,
  X,
  XCircle,
} from "lucide-react";
import type { Sport } from "@/data/sports";
import type { PaymentStatus } from "@/types/database";

export type RegistrationStatusMap = Record<string, PaymentStatus>;

type Props = {
  sports: Sport[];
  authMode: "guest" | "incomplete-profile" | "ready";
  registrationStatuses?: RegistrationStatusMap;
};

export function SportsShowcase({
  sports,
  authMode,
  registrationStatuses = {},
}: Props) {
  const [selectedCategories, setSelectedCategories] = useState<
    Record<string, string>
  >({});
  const [activeSportSlug, setActiveSportSlug] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "team" | "mixed-or-women">("all");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveSportSlug(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredSports = sports.filter((sport) => {
    if (filter === "all") return true;
    if (filter === "mixed-or-women") {
      return (
        sport.slug === "badminton" ||
        sport.categories.some((c) => c.id === "womens")
      );
    }
    return sport.categories.some((c) => c.entryType === "Team");
  });

  function getSelectedCategory(sport: Sport) {
    const selectedId = selectedCategories[sport.slug];
    return (
      sport.categories.find((c) => c.id === selectedId) ?? sport.categories[0]
    );
  }

  function getPrizeDisplay(sport: Sport) {
    if (sport.categories.length === 1) {
      return sport.categories[0].prizePoolDisplay;
    }
    return sport.categories.map((c) => c.prizePoolDisplay).join(" / ");
  }

  const activeSport =
    sports.find((s) => s.slug === activeSportSlug) ?? null;
  const activeCategory = activeSport ? getSelectedCategory(activeSport) : null;
  const activeStatus =
    activeSport && activeCategory
      ? registrationStatuses[`${activeSport.slug}:${activeCategory.id}`]
      : undefined;
  const activeRegisterUrl =
    activeSport && activeCategory
      ? `/register?sport=${encodeURIComponent(
          activeSport.slug
        )}&category=${encodeURIComponent(activeCategory.id)}`
      : "/register";

  return (
    <div className="space-y-6">
      {/* Subtle Access Strip */}
      {authMode === "guest" && (
        <div className="flex flex-col gap-3 rounded-sm border border-[#16408B]/20 border-l-4 border-l-[#16408B] bg-white/80 px-4 py-3.5 shadow-sm shadow-blue-950/5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-start gap-2.5">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#16408B]" />
            <p className="text-xs leading-relaxed text-[#091930]/80 sm:text-sm">
              <strong className="font-semibold text-[#091930]">
                Viewing Mode:
              </strong>{" "}
              Hover or click any sport for full details. Sign in with Google to
              register.
            </p>
          </div>
          <Link
            href="/login"
            className="label inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-sm bg-[#16408B] px-4 py-2.5 text-white shadow-md shadow-[#16408B]/20 transition hover:bg-[#0E2B57] sm:w-auto"
          >
            Sign in →
          </Link>
        </div>
      )}

      {authMode === "incomplete-profile" && (
        <div className="flex flex-col gap-3 rounded-sm border border-[#D9531E]/25 border-l-4 border-l-[#D9531E] bg-white/85 px-4 py-3.5 shadow-sm shadow-orange-950/5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#D9531E]" />
            <p className="text-xs leading-relaxed text-[#091930]/80 sm:text-sm">
              <strong className="font-semibold text-[#091930]">
                Profile Required:
              </strong>{" "}
              Complete your college &amp; player details once to unlock
              registration.
            </p>
          </div>
          <Link
            href="/profile?onboarding=1"
            className="label inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-sm bg-[#D9531E] px-4 py-2.5 text-white shadow-md shadow-[#D9531E]/25 transition hover:bg-[#BE4414] sm:w-auto"
          >
            Complete Profile →
          </Link>
        </div>
      )}

      {/* Clean Underline Filter Tabs */}
      <div className="flex flex-col justify-between gap-2 border-b border-[#16408B]/15 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-5 sm:gap-8">
          {[
            { id: "all", label: "All Sports" },
            { id: "team", label: "Team Events" },
            { id: "mixed-or-women", label: "Women's & Mixed" },
          ].map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setFilter(tab.id as "all" | "team" | "mixed-or-women")
                }
                className={`label border-b-2 pb-3 transition duration-300 cursor-pointer ${
                  active
                    ? "border-[#D9531E] text-[#091930]"
                    : "border-transparent text-[#091930]/45 hover:text-[#16408B]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <p className="label hidden pb-3 !text-[0.62rem] text-[#091930]/45 sm:block">
          Hover to preview · Click to open details
        </p>
      </div>

      {/* Minimalist List: Only Sport Name + Prize Pool */}
      <ul className="border-b-[1.5px] border-[#16408B]/20">
        {filteredSports.map((sport) => {
          const sportNumber = String(
            sports.findIndex((s) => s.slug === sport.slug) + 1
          ).padStart(2, "0");
          const previewCategory = getSelectedCategory(sport);

          return (
            <li
              key={sport.slug}
              className="group relative border-t-[1.5px] border-[#16408B]/15 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-20 hover:bg-white/90 hover:shadow-xl hover:shadow-blue-950/10 hover:backdrop-blur-md"
            >
              {/* Left Orange-to-Blue Hover Bar */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-gradient-to-b from-[#D9531E] to-[#16408B] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-1"
              />

              <button
                type="button"
                onClick={() => setActiveSportSlug(sport.slug)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-3 py-5 text-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:pl-5 sm:px-5 sm:py-7"
              >
                <div className="flex items-baseline gap-4 sm:gap-6">
                  <span className="label text-[#D9531E]">{sportNumber}</span>
                  <h3 className="font-display text-2xl font-medium leading-tight text-[#091930] transition-colors duration-300 group-hover:text-[#16408B] sm:text-3xl lg:text-4xl">
                    {sport.name}
                  </h3>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-right">
                    <span className="font-display text-xl font-medium tabular-nums text-[#091930] sm:text-2xl">
                      {getPrizeDisplay(sport)}
                    </span>
                    <span className="ml-2 hidden text-xs font-medium text-[#091930]/50 sm:inline">
                      Prize Pool*
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className="text-base font-medium text-[#D9531E] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </div>
              </button>

              {/* Desktop Hover Floating Preview Popup */}
              <div
                aria-hidden="true"
                className="pointer-events-none invisible absolute right-6 top-full z-30 mt-2 hidden w-80 translate-y-2 rounded-sm border border-[#16408B]/20 border-t-2 border-t-[#D9531E] bg-white/95 p-4 opacity-0 shadow-2xl shadow-blue-950/20 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block lg:group-hover:visible lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
              >
                <div className="flex items-center justify-between border-b border-blue-950/10 pb-2.5">
                  <span className="label !text-[0.62rem] text-[#16408B]">
                    {sport.badge}
                  </span>
                  <span className="font-display text-sm font-semibold text-[#D9531E]">
                    Fee: {previewCategory.feeDisplay}
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-[#091930]/75">
                  <p>
                    <strong className="text-[#091930]">Format:</strong>{" "}
                    {previewCategory.format}
                  </p>
                  <p>
                    <strong className="text-[#091930]">Squad:</strong>{" "}
                    {previewCategory.squadRuleLabel}
                  </p>
                  <p>
                    <strong className="text-[#091930]">Eligibility:</strong> Age
                    ≤ {sport.ageLimit} yrs • Univ. Students
                  </p>
                </div>
                <p className="label mt-3 !text-[0.58rem] text-[#16408B]">
                  Click to view coordinators &amp; register →
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Interactive Frosted-Glass Popup Modal (On Click / Tap) */}
      {activeSport && activeCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07162C]/65 p-4 backdrop-blur-sm"
          onClick={() => setActiveSportSlug(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sport-modal-title"
            className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-sm border border-blue-900/30 bg-white shadow-2xl shadow-blue-950/35"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Navy & Orange Modal Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#07162C] via-[#0E2B57] to-[#16408B] px-6 py-5 text-white">
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#D9531E]/30 blur-2xl"
                aria-hidden="true"
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="label !text-[0.62rem] text-orange-300">
                    {activeSport.badge} • ZENITH 2027
                  </p>
                  <h3
                    id="sport-modal-title"
                    className="mt-1 font-display text-3xl font-medium text-white"
                  >
                    {activeSport.name}
                  </h3>
                  <p className="mt-1 text-xs text-blue-100/80">
                    {activeSport.tagline}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSportSlug(null)}
                  aria-label="Close popup"
                  className="rounded-sm border border-white/20 bg-white/10 p-1.5 text-white transition hover:bg-white/20 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Division Switcher if Basketball or Table Tennis */}
              {activeSport.categories.length > 1 && (
                <div className="relative mt-4 flex gap-4 border-t border-white/15 pt-3">
                  {activeSport.categories.map((category) => {
                    const active = category.id === activeCategory.id;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() =>
                          setSelectedCategories((prev) => ({
                            ...prev,
                            [activeSport.slug]: category.id,
                          }))
                        }
                        className={`border-b-2 pb-1 text-xs font-semibold transition cursor-pointer ${
                          active
                            ? "border-[#D9531E] text-white"
                            : "border-transparent text-blue-200 hover:text-white"
                        }`}
                      >
                        {category.id === "mens"
                          ? "Men's Division"
                          : "Women's Division"}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="space-y-5 p-6">
              {/* Highlighted Prize Pool & Entry Fee */}
              <div className="grid grid-cols-2 divide-x divide-blue-950/10 border border-blue-950/10 bg-[#F5F7FB]">
                <div className="p-4">
                  <p className="label !text-[0.6rem] text-[#091930]/50">
                    Prize Pool*
                  </p>
                  <p className="mt-1 font-display text-2xl font-medium text-[#091930]">
                    {activeCategory.prizePoolDisplay}
                  </p>
                </div>
                <div className="p-4">
                  <p className="label !text-[0.6rem] text-[#091930]/50">
                    Registration Fee
                  </p>
                  <p className="mt-1 font-display text-2xl font-medium text-[#D9531E]">
                    {activeCategory.feeDisplay}
                    <span className="ml-1 text-xs font-normal text-[#091930]/55">
                      {activeCategory.entryType === "Individual"
                        ? "/ player"
                        : "/ team"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-1 gap-3 border-y border-blue-950/10 py-4 text-xs sm:grid-cols-2">
                <div>
                  <span className="label !text-[0.6rem] text-[#091930]/45">
                    Format
                  </span>
                  <p className="mt-0.5 font-semibold text-[#16408B]">
                    {activeCategory.format}
                  </p>
                </div>
                <div>
                  <span className="label !text-[0.6rem] text-[#091930]/45">
                    Squad Size
                  </span>
                  <p className="mt-0.5 font-semibold text-[#091930]">
                    {activeCategory.squadRuleLabel}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <span className="label !text-[0.6rem] text-[#091930]/45">
                    Eligibility
                  </span>
                  <p className="mt-0.5 text-[#091930]/80">
                    Age Limit: {activeSport.ageLimit} Years • University
                    students only • Valid College ID &amp; Aadhar ID must be
                    present.
                    {activeSport.slug === "badminton"
                      ? " Max of 1 Man & 1 Woman can play 2 formats."
                      : ""}
                  </p>
                </div>
              </div>

              {/* Coordinators */}
              <div>
                <p className="label !text-[0.6rem] text-[#091930]/45">
                  Sport Coordinators
                </p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                  {activeSport.coordinators.map((coord) => (
                    <a
                      key={coord.phone}
                      href={`tel:${coord.phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#091930] hover:text-[#16408B]"
                    >
                      <Phone className="h-3.5 w-3.5 text-[#D9531E]" />
                      {coord.name} ({coord.phone})
                    </a>
                  ))}
                </div>
              </div>

              {/* Status if already registered */}
              {activeStatus && (
                <div className="flex items-center gap-2 rounded-sm border border-blue-950/10 bg-[#F5F7FB] px-3.5 py-2.5 text-xs font-semibold">
                  {activeStatus === "success" && (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-700">
                        Your Payment Status: Success
                      </span>
                    </>
                  )}
                  {activeStatus === "pending" && (
                    <>
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span className="text-amber-700">
                        Your Payment Status: Pending Admin Approval
                      </span>
                    </>
                  )}
                  {activeStatus === "rejected" && (
                    <>
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-red-700">
                        Your Payment Status: Rejected (Re-upload in Profile)
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setActiveSportSlug(null)}
                  className="label rounded-sm border border-slate-200 px-5 py-3 text-[#091930]/70 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>

                {authMode === "guest" && (
                  <Link
                    href={`/login?next=${encodeURIComponent(activeRegisterUrl)}`}
                    className="label inline-flex items-center justify-center gap-2 rounded-sm bg-[#16408B] px-6 py-3 text-white shadow-md shadow-[#16408B]/20 hover:bg-[#0E2B57]"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Sign in to Register →
                  </Link>
                )}

                {authMode === "incomplete-profile" && (
                  <Link
                    href={`/profile?onboarding=1&next=${encodeURIComponent(
                      activeRegisterUrl
                    )}`}
                    className="label inline-flex items-center justify-center gap-2 rounded-sm bg-[#D9531E] px-6 py-3 text-white shadow-md shadow-[#D9531E]/25 hover:bg-[#BE4414]"
                  >
                    Complete Profile →
                  </Link>
                )}

                {authMode === "ready" && (
                  <Link
                    href={activeStatus ? "/profile" : activeRegisterUrl}
                    className="label inline-flex items-center justify-center gap-2 rounded-sm bg-[#D9531E] px-6 py-3 text-white shadow-lg shadow-[#D9531E]/25 hover:bg-[#BE4414]"
                  >
                    {activeStatus
                      ? "View in Profile →"
                      : `Register (${activeCategory.feeDisplay}) →`}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
