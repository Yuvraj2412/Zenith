import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { FEST_INFO, SPORTS } from "@/data/sports";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { HeroHorizonEffects } from "@/components/HeroHorizonEffects";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SportsSectionServer } from "@/components/SportsSectionServer";
import { SportsShowcase } from "@/components/SportsShowcase";

export default function TournamentsPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#051229] text-white">
      {/* WHOLE-PAGE SUNLIT STADIUM TRACK BACKGROUND (FIXED BEHIND ENTIRE PAGE) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-horizon.jpg')" }}
          aria-hidden="true"
        />
        <HeroHorizonEffects sunXRatio={0.29} sunYRatio={0.51} />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#041026]/80 via-[#061533]/75 to-[#041026]/92"
          aria-hidden="true"
        />
      </div>

      {/* TOURNAMENTS HEADER OVER FULL-PAGE STADIUM BACKGROUND */}
      <section className="relative z-10 border-b border-white/15 pt-24 pb-10 sm:pt-28 sm:pb-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Top Edition Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E86C1F]" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200/95">
                Official Championship Directory • ZENITH 2027
              </span>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#38BDF8]">
              {FEST_INFO.location} • Age Limit ≤ 25 Yrs
            </span>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="label text-[#38BDF8]">
                Inter-College Athletics Roster
              </p>
              <h1 className="mt-2 font-display text-2xl font-extrabold uppercase leading-[1.1] tracking-wider text-white sm:text-5xl">
                The <span className="text-[#E86C1F]">Tournaments</span> Arena
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-blue-50/90 sm:text-base">
                Inspect rules, division fees, squad limits, and prize breakdowns
                below. Only{" "}
                <strong className="text-white">
                  one representative
                </strong>{" "}
                registers per team to generate your squad&apos;s{" "}
                <strong className="text-[#FDBA74]">Team ID</strong>.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 rounded-md bg-[#E86C1F] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md transition hover:bg-[#D45F15]"
                >
                  <Trophy className="h-4 w-4" />
                  Register a Team
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/accommodations"
                  className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-[#061533]/65 px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md transition hover:border-[#38BDF8] hover:bg-[#061533]/85"
                >
                  <Building2 className="h-4 w-4 text-[#38BDF8]" />
                  Have a Team ID? Book Stay
                </Link>
              </div>
            </div>

            {/* Translucent Scoreboard Strip */}
            <div className="w-full max-w-md rounded-xl border border-white/20 bg-[#051229]/55 p-5 shadow-xl">
              <div className="flex items-baseline justify-between border-b border-white/15 pb-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#38BDF8]">
                    Combined Prize Pool*
                  </p>
                  <p className="font-akira mt-1 text-xl font-extrabold text-[#E86C1F] sm:text-2xl">
                    <AnimatedCounter
                      target={362500}
                      prefix="₹"
                      durationMs={1500}
                    />
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-300">
                    Format
                  </p>
                  <p className="mt-0.5 font-display text-lg font-medium text-white">
                    League &amp; Knockout
                  </p>
                </div>
              </div>

              <div className="mt-3.5 grid grid-cols-3 gap-2 text-[11px] text-blue-50/90">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 shrink-0 text-[#E86C1F]" />
                  <span>1 Captain Entry</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#38BDF8]" />
                  <span>College ID Req.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span>Instant Team ID</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE TOURNAMENT DIRECTORY OVER FULL-PAGE BACKGROUND */}
      <section
        id="roster"
        className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16"
      >
        <ScrollReveal>
          <div className="rounded-xl border border-white/15 bg-[#051229]/80 p-4 shadow-2xl sm:p-7">
            <Suspense
              fallback={<SportsShowcase sports={SPORTS} authMode="guest" />}
            >
              <SportsSectionServer />
            </Suspense>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
