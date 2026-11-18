"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  Phone,
  Trophy,
  Users,
  XCircle,
  ShieldAlert,
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
  const [filter, setFilter] = useState<"all" | "team" | "mixed-or-women">("all");

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

  return (
    <div className="space-y-8">
      {/* Access Mode Banner */}
      {authMode === "guest" && (
        <div className="flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50/90 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
            <div>
              <p className="text-sm font-semibold text-blue-950">
                Browsing Sports Only — Sign in to Register
              </p>
              <p className="text-xs text-blue-800">
                You can view all 7 sports below. Sign in with Google and complete your profile details to unlock registration & payment upload.
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
          >
            Sign in with Google
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {authMode === "incomplete-profile" && (
        <div className="flex flex-col gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-orange-950">
                Complete Your Profile to Unlock Registration
              </p>
              <p className="text-xs text-orange-800">
                Your Google account is connected. Fill in your college & player details once before registering for any sport.
              </p>
            </div>
          </div>
          <Link
            href="/profile?onboarding=1"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
          >
            Complete Profile Now
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Simple Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All 7 Sports" },
            { id: "team", label: "Team Events" },
            { id: "mixed-or-women", label: "Women's & Mixed Events" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setFilter(tab.id as "all" | "team" | "mixed-or-women")
              }
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                filter === tab.id
                  ? "bg-blue-700 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="text-xs font-medium text-slate-500">
          Showing {filteredSports.length} of 7 official ZENITH 2027 sports
        </p>
      </div>

      {/* 7 Sports Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSports.map((sport) => {
          const activeCategory = getSelectedCategory(sport);
          const statusKey = `${sport.slug}:${activeCategory.id}`;
          const existingStatus = registrationStatuses[statusKey];
          const registerUrl = `/register?sport=${encodeURIComponent(sport.slug)}&category=${encodeURIComponent(activeCategory.id)}`;

          return (
            <article
              key={sport.slug}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <SportIcon slug={sport.slug} />
                    <div>
                      <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                        {sport.badge}
                      </span>
                      <h3 className="mt-1 font-display text-xl font-bold text-slate-900">
                        {sport.name}
                      </h3>
                    </div>
                  </div>

                  {/* Existing status badge if registered */}
                  {existingStatus === "success" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Success
                    </span>
                  )}
                  {existingStatus === "pending" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-200">
                      <Clock className="h-3.5 w-3.5" />
                      Pending
                    </span>
                  )}
                  {existingStatus === "rejected" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700 border border-red-200">
                      <XCircle className="h-3.5 w-3.5" />
                      Rejected
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm text-slate-600">{sport.tagline}</p>

                {/* Category Tabs for Basketball & Table Tennis */}
                {sport.categories.length > 1 && (
                  <div className="mt-4 grid grid-cols-2 gap-1.5 rounded-xl bg-slate-100 p-1">
                    {sport.categories.map((category) => {
                      const active = category.id === activeCategory.id;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() =>
                            setSelectedCategories((prev) => ({
                              ...prev,
                              [sport.slug]: category.id,
                            }))
                          }
                          className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                            active
                              ? "bg-white text-blue-800 shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {category.id === "mens" ? "Men's" : "Women's"}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Key Numbers: Prize Pool & Fee */}
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      <Trophy className="h-3.5 w-3.5 text-orange-500" />
                      Prize Pool*
                    </div>
                    <div className="mt-0.5 font-display text-xl font-bold text-slate-900">
                      {activeCategory.prizePoolDisplay}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Reg. Fee
                    </div>
                    <div className="mt-0.5 font-display text-xl font-bold text-orange-600">
                      {activeCategory.feeDisplay}
                      <span className="ml-1 text-xs font-medium text-slate-500">
                        {activeCategory.entryType === "Individual"
                          ? "/ player"
                          : "/ team"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rules & Eligibility */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-medium text-slate-500">Format</span>
                    <span className="font-semibold text-blue-800">
                      {activeCategory.format}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="flex items-center gap-1 font-medium text-slate-500">
                      <Users className="h-3.5 w-3.5" />
                      Squad Size
                    </span>
                    <span className="font-semibold text-slate-800">
                      {activeCategory.squadRuleLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-medium text-slate-500">Age Limit</span>
                    <span className="font-semibold text-slate-800">
                      {sport.ageLimit} Years (Univ. Students)
                    </span>
                  </div>
                  <p className="pt-1 text-[11px] text-slate-500">
                    Valid College ID & Aadhar ID mandatory at venue.
                    {sport.slug === "badminton"
                      ? " Max 1M & 1W can play 2 formats."
                      : ""}
                  </p>
                </div>
              </div>

              {/* Coordinators + Register Button */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Sport Coordinators
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                    {sport.coordinators.map((coord) => (
                      <a
                        key={coord.phone}
                        href={`tel:${coord.phone.replace(/\s+/g, "")}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-blue-700"
                      >
                        <Phone className="h-3 w-3 text-orange-500" />
                        <span>{coord.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {authMode === "guest" && (
                  <Link
                    href={`/login?next=${encodeURIComponent(registerUrl)}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-800 transition hover:bg-blue-100"
                  >
                    <Lock className="h-4 w-4" />
                    Sign in to Register
                  </Link>
                )}

                {authMode === "incomplete-profile" && (
                  <Link
                    href={`/profile?onboarding=1&next=${encodeURIComponent(registerUrl)}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    Complete Profile to Register
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}

                {authMode === "ready" && (
                  <Link
                    href={existingStatus ? "/profile" : registerUrl}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      existingStatus
                        ? "border border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200"
                        : "bg-orange-500 text-white shadow-sm hover:bg-orange-600"
                    }`}
                  >
                    {existingStatus
                      ? "View Status in Profile"
                      : `Register (${activeCategory.feeDisplay})`}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
