"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
import { SportIcon } from "./SportIcon";

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

  useEffect(() => {
    if (!activeSportSlug) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [activeSportSlug]);

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
        <div className="flex flex-col gap-3 rounded-xl border border-white/15 border-l-4 border-l-[#FF7A00] bg-[#0B1B36]/85 px-4 py-3.5 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-start gap-2.5">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#FF7A00]" />
            <p className="text-xs leading-relaxed text-slate-200 sm:text-sm">
              <strong className="font-semibold text-white">
                Guest Mode:
              </strong>{" "}
              Click any sport to see rules and prize pools. Sign in with Google
              to register your team.
            </p>
          </div>
          <Link
            href="/login"
            className="label inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#FF7A00] px-5 py-2.5 text-white shadow-md shadow-[#FF7A00]/30 transition duration-300 hover:-translate-y-0.5 hover:bg-[#E66E00] sm:w-auto"
          >
            Sign in with Google →
          </Link>
        </div>
      )}

      {authMode === "incomplete-profile" && (
        <div className="flex flex-col gap-3 rounded-xl border border-[#FF7A00]/40 border-l-4 border-l-[#FF7A00] bg-[#FF7A00]/15 px-4 py-3.5 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#FF7A00]" />
            <p className="text-xs leading-relaxed text-orange-100 sm:text-sm">
              <strong className="font-semibold text-white">
                One Step Left:
              </strong>{" "}
              Fill in your player profile once to unlock team registration.
            </p>
          </div>
          <Link
            href="/profile?onboarding=1"
            className="label inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#FF7A00] px-5 py-2.5 text-white shadow-md shadow-[#FF7A00]/30 transition duration-300 hover:-translate-y-0.5 hover:bg-[#E66E00] sm:w-auto"
          >
            Complete Profile →
          </Link>
        </div>
      )}

      {/* Clean Underline Filter Tabs */}
      <div className="flex flex-col justify-between gap-2 border-b border-white/15 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-5 sm:gap-8">
          {[
            { id: "all", label: "All Sports" },
            { id: "team", label: "Team Sports" },
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
                    ? "border-[#FF7A00] text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <p className="label hidden pb-3 !text-[0.62rem] text-slate-300 sm:block">
          Hover to preview · Click any sport for details
        </p>
      </div>

      {/* Unified Midnight-Navy Sports List with Clear Action Pill */}
      <ul className="border-b border-white/15">
        {filteredSports.map((sport, index) => {
          const sportNumber = String(
            sports.findIndex((s) => s.slug === sport.slug) + 1
          ).padStart(2, "0");
          const previewCategory = getSelectedCategory(sport);

          return (
            <li
              key={sport.slug}
              style={{ animationDelay: `${index * 60}ms` }}
              className="animate-hero-rise group relative border-t border-white/15 transition-all duration-300 ease-out hover:z-20 hover:bg-[#0B1B36]/95 hover:shadow-2xl hover:shadow-black/40"
            >
              {/* Left Orange-to-Sky Kinetic Bar */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-gradient-to-b from-[#FF7A00] to-[#0099FF] transition-all duration-300 ease-out group-hover:w-1.5"
              />

              <button
                type="button"
                onClick={() => setActiveSportSlug(sport.slug)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-2.5 py-4 text-left transition-all duration-300 ease-out sm:gap-4 sm:px-5 sm:py-6 sm:group-hover:pl-6"
              >
                <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                  <span className="label shrink-0 text-[#FF7A00] transition-transform duration-300 group-hover:scale-110">
                    {sportNumber}
                  </span>
                  <div className="hidden shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 sm:block">
                    <SportIcon slug={sport.slug} />
                  </div>
                  <h3 className="truncate font-display text-xl font-medium leading-tight text-white transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[#FF7A00] sm:text-3xl">
                    {sport.name}
                  </h3>
                </div>

                <div className="flex shrink-0 items-center gap-2.5 sm:gap-5">
                  <div className="text-right">
                    <span className="font-display text-base font-medium tabular-nums text-[#FDBA74] transition-colors duration-200 group-hover:text-[#E86C1F] sm:text-2xl">
                      {getPrizeDisplay(sport)}
                    </span>
                    <span className="ml-2 hidden text-xs font-medium text-slate-300 sm:inline">
                      Prize Pool*
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors duration-200 group-hover:border-[#E86C1F] group-hover:bg-[#E86C1F]">
                    <span className="hidden sm:inline">View Details</span>
                    <span aria-hidden="true">→</span>
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

      {/* Interactive Frosted-Glass Popup Modal (Portaled to document.body for True Viewport Scroll) */}
      {typeof document !== "undefined" &&
        activeSport &&
        activeCategory &&
        createPortal(
          <div
            className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-[#07162C]/65 backdrop-blur-sm"
            onClick={() => setActiveSportSlug(null)}
          >
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="sport-modal-title"
                className="relative w-full max-w-xl overflow-hidden rounded-sm border border-blue-900/30 bg-white shadow-2xl shadow-blue-950/35"
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
        </div>,
          document.body
        )}
    </div>
  );
}
