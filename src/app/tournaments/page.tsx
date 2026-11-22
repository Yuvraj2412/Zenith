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
import { ScrollHorizonOverlay } from "@/components/ScrollHorizonOverlay";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SportsSectionServer } from "@/components/SportsSectionServer";
import { SportsShowcase } from "@/components/SportsShowcase";

export default function TournamentsPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#051229] text-white">
      <ScrollHorizonOverlay />

      {/* DISTINCT CHAMPIONSHIP ARENA SPLIT-SHOWCASE HEADER (NOT A CLONE OF HOME HERO) */}
      <section className="relative z-10 border-b border-white/15 bg-gradient-to-b from-[#040E21] via-[#071A3E] to-[#051229] pt-24 pb-12 sm:pt-28 sm:pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Top Breadcrumb / Edition Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/12 pb-4">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E86C1F]" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200/90">
                Official Championship Directory • ZENITH 2027
              </span>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#38BDF8]">
              {FEST_INFO.location} • Age Limit ≤ 25 Yrs
            </span>
          </div>

          {/* Asymmetric Split Grid: Editorial Roster Brief (Left) + Framed Sunlit Stadium Window (Right) */}
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-stretch">
            {/* Left Column: Title, Quick Sport Pills & Action Bar */}
            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                <p className="label text-[#38BDF8]">
                  Inter-College Athletics Roster
                </p>
                <h1 className="mt-2 font-display text-4xl font-medium leading-[1.06] tracking-tight text-white sm:text-6xl">
                  The <span className="italic text-[#E86C1F]">Tournaments</span>{" "}
                  Arena.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-blue-100/85 sm:text-base">
                  Inspect rules, division fees, squad limits, and prize
                  breakdowns below. Only{" "}
                  <strong className="text-white">
                    one representative (captain)
                  </strong>{" "}
                  registers per team to generate your squad&apos;s{" "}
                  <strong className="text-[#FDBA74]">Team ID</strong>.
                </p>

                {/* Discipline Quick-Jump Chips */}
                <div className="mt-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    Championship Disciplines
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {SPORTS.map((sport, i) => (
                      <a
                        key={sport.slug}
                        href="#roster"
                        className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-blue-50 transition hover:border-[#E86C1F] hover:bg-[#E86C1F]/15 hover:text-white"
                      >
                        <span className="font-mono text-[10px] text-[#E86C1F]">
                          0{i + 1}
                        </span>
                        <span>{sport.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Strip */}
              <div className="mt-8 flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 rounded-md bg-[#E86C1F] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md transition hover:bg-[#D45F15]"
                >
                  <Trophy className="h-4 w-4" />
                  Register a Team
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/accommodations"
                  className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/[0.06] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:border-[#38BDF8] hover:bg-white/10"
                >
                  <Building2 className="h-4 w-4 text-[#38BDF8]" />
                  Have a Team ID? Book Stay
                </Link>
              </div>
            </div>

            {/* Right Column: Framed Sunlit Stadium Window + Live Scoreboard Card */}
            <div className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-xl border border-white/20 border-t-2 border-t-[#E86C1F] shadow-2xl lg:col-span-5">
              {/* Sunlit Stadium Track Background Inside Framed Arena Card */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: "url('/images/hero-horizon.jpg')" }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040E21] via-[#061533]/55 to-[#040E21]/35"
                aria-hidden="true"
              />

              {/* Top Telemetry Pill inside Window */}
              <div className="relative flex items-center justify-between px-5 pt-4">
                <span className="rounded-sm border border-white/25 bg-[#040E21]/75 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200 backdrop-blur-xs">
                  IIST Arena • Track &amp; Courts
                </span>
                <span className="rounded-sm bg-[#E86C1F] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white">
                  2027 Season
                </span>
              </div>

              {/* Bottom Scoreboard Overlay Inside Framed Window */}
              <div className="relative m-4 rounded-lg border border-white/20 bg-[#051229]/90 p-4 backdrop-blur-md">
                <div className="flex items-baseline justify-between border-b border-white/12 pb-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#38BDF8]">
                      Combined Prize Pool*
                    </p>
                    <p className="mt-0.5 font-display text-3xl font-medium text-[#E86C1F] sm:text-4xl">
                      <AnimatedCounter
                        target={362500}
                        prefix="₹"
                        durationMs={1500}
                      />
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      Format
                    </p>
                    <p className="mt-0.5 font-display text-base font-medium text-white">
                      League &amp; Knockout
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-blue-100/85">
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
        </div>
      </section>

      {/* INTERACTIVE TOURNAMENT DIRECTORY */}
      <section
        id="roster"
        className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16"
      >
        <ScrollReveal>
          <Suspense
            fallback={<SportsShowcase sports={SPORTS} authMode="guest" />}
          >
            <SportsSectionServer />
          </Suspense>
        </ScrollReveal>
      </section>
    </div>
  );
}
