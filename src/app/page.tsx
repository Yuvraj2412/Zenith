import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  Globe,
  Handshake,
  KeyRound,
  MapPin,
  Phone,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { FEST_INFO } from "@/data/sports";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { CountdownTimer } from "@/components/CountdownTimer";
import { HeroHorizonEffects } from "@/components/HeroHorizonEffects";
import {
  HomeBelowFoldParallax,
  InteractiveTiltCard,
} from "@/components/HomeBelowFoldParallax";
import { ScrollHorizonOverlay } from "@/components/ScrollHorizonOverlay";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SportsTicker } from "@/components/SportsTicker";
import { ZenithLogo } from "@/components/ZenithLogo";

export default function HomePage() {
  return (
    <div className="relative flex flex-col bg-gradient-to-b from-[#071A3E] via-[#0B2559] to-[#071A3E] text-white">
      <ScrollHorizonOverlay />

      {/* 1. ORBITAL SPACE SUNRISE HERO ("BEYOND THE HORIZON") */}
      <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[#071A3E]">
        {/* Luminous Orbital Sunrise Background */}
        <div
          className="animate-horizon-drift absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-space-horizon.jpg')" }}
          aria-hidden="true"
        />

        {/* Prominent Sunburst Highlight Centered on the Orbital Sun */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,240,185,0.48)_0%,rgba(255,122,0,0.25)_34%,transparent_68%)]"
          aria-hidden="true"
        />

        {/* Interactive + Scroll-Moving Sun Rays & Falling Feathers */}
        <HeroHorizonEffects sunXRatio={0.5} sunYRatio={0.48} />

        {/* Balanced Luminous Scrim (Not Gloomy — Lets the Blue Horizon & Sun Shine) */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#071A3E]/80 via-[#071A3E]/30 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#071A3E] via-transparent to-[#071A3E]/20"
          aria-hidden="true"
        />

        {/* Hero Copy */}
        <div className="relative mx-auto my-auto w-full max-w-6xl px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
          <div className="max-w-2xl">
            <div
              className="animate-hero-rise inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/25 bg-[#071A3E]/70 px-3.5 py-1.5"
              style={{ animationDelay: "60ms" }}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E86C1F]" />
              <span className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-100/95 sm:text-[11px] sm:tracking-[0.18em]">
                {FEST_INFO.institute} • Est. {FEST_INFO.established}
              </span>
            </div>

            <h1
              className="animate-hero-rise mt-4 font-display text-[2.45rem] font-medium leading-[1.04] tracking-tight text-white sm:mt-5 sm:text-6xl lg:text-[4.5rem]"
              style={{ animationDelay: "160ms" }}
            >
              ZENITH <span className="text-[#E86C1F]">2027</span>
              <span className="mt-1 block text-2xl font-normal italic text-amber-200/95 sm:text-5xl">
                Beyond the Horizon.
              </span>
            </h1>

            {/* Compact Classic Countdown to Jan 21, 2027 (Replaces the extra text line so 100vh fits cleanly) */}
            <CountdownTimer />

            {/* Classic Refined Action Buttons */}
            <div
              className="animate-hero-rise mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5"
              style={{ animationDelay: "360ms" }}
            >
              <Link
                href="/tournaments"
                className="group inline-flex items-center justify-center gap-2.5 rounded-md bg-[#E86C1F] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md transition-colors duration-200 hover:bg-[#D45F15] sm:py-4"
              >
                Explore Tournaments
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[#071A3E] shadow-md transition-colors duration-200 hover:bg-blue-50 sm:py-4"
              >
                Register Team
              </Link>
              <Link
                href="/accommodations"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 bg-[#071A3E]/60 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:border-[#E86C1F] hover:bg-[#071A3E]/85 sm:py-4"
              >
                Book Accommodation
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Horizon Bar */}
        <div className="relative border-t border-white/15 bg-[#071A3E]/75 backdrop-blur-md">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-y divide-white/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            <div className="px-4 py-3.5 sm:px-6 sm:py-4">
              <p className="label !text-[0.58rem] text-[#38BDF8]">Event</p>
              <p className="mt-0.5 font-display text-base font-medium text-white sm:text-xl">
                Inter-College
              </p>
            </div>
            <div className="px-4 py-3.5 sm:px-6 sm:py-4">
              <p className="label !text-[0.58rem] text-[#38BDF8]">
                Total Prize Pool*
              </p>
              <p className="mt-0.5 font-display text-base font-medium text-[#FF7A00] sm:text-xl">
                <AnimatedCounter target={362500} prefix="₹" durationMs={1600} />
              </p>
            </div>
            <div className="px-4 py-3.5 sm:px-6 sm:py-4">
              <p className="label !text-[0.58rem] text-[#38BDF8]">
                Match Format
              </p>
              <p className="mt-0.5 font-display text-sm font-medium text-white sm:text-lg">
                League &amp; Knockout
              </p>
            </div>
            <div className="px-4 py-3.5 sm:px-6 sm:py-4">
              <p className="label !text-[0.58rem] text-[#38BDF8]">Location</p>
              <p className="mt-0.5 font-display text-sm font-medium text-white sm:text-lg">
                IIST, Kerala
              </p>
            </div>
          </div>
        </div>
      </section>

      <SportsTicker />

      {/* INTERACTIVE PARALLAX STAGE FOR EVERYTHING BELOW THE FIRST 100VH */}
      <HomeBelowFoldParallax>
        {/* 2. SPACIOUS MONUMENTAL PRIZE POOL & 3D-TILT PORTAL CARDS */}
        <section className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-20 sm:px-6 sm:pb-20 sm:pt-28">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-xl border border-white/20 border-t-2 border-t-[#E86C1F] bg-[#071A3E]/75 p-8 text-center shadow-[0_24px_70px_rgba(3,10,26,0.75)] backdrop-blur-md sm:p-14">
              {/* Background Sunburst Accent Inside Prize Card */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-28 left-1/2 h-72 w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,108,31,0.26)_0%,rgba(56,189,248,0.1)_48%,transparent_72%)]"
              />

              {/* Subtle Corner Telemetry Framing */}
              <div className="relative mb-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-blue-200/60">
                <span>LAT 08°37&apos;N • LON 77°02&apos;E</span>
                <span>ORBITAL EDITION • 2027</span>
              </div>

              <span className="label relative text-[#38BDF8]">
                Championship Rewards • ZENITH 2027
              </span>
              <p className="relative mt-4 font-display text-5xl font-medium tracking-tight text-[#E86C1F] drop-shadow-[0_4px_24px_rgba(232,108,31,0.35)] sm:text-7xl lg:text-8xl">
                <AnimatedCounter target={362500} prefix="₹" durationMs={1800} />
                <span className="text-3xl text-amber-200/90 sm:text-5xl">*</span>
              </p>
              <h2 className="relative mt-3 font-display text-2xl font-medium text-white sm:text-4xl">
                Total Championship Prize Pool
              </h2>
              <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-blue-100/90 sm:text-base">
                Compete across Football, Cricket, Basketball, Volleyball, Chess,
                Badminton, and Table Tennis. Register your team once to receive
                your official <strong>Team ID</strong>.
              </p>

              {/* 3D Interactive Tilt Portal Cards */}
              <div className="relative mt-10 grid gap-5 text-left sm:grid-cols-3">
                <InteractiveTiltCard className="rounded-lg border border-white/15 border-t-2 border-t-[#E86C1F] bg-[#05132E]/90 shadow-lg hover:border-[#E86C1F]">
                  <Link
                    href="/tournaments"
                    className="flex h-full flex-col justify-between p-6"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <Trophy className="h-6 w-6 text-[#E86C1F] transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-mono text-[11px] tracking-widest text-slate-400 group-hover:text-[#E86C1F]">
                          01
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-2xl font-medium text-white">
                        Tournaments
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-blue-100/80">
                        View all sports, prize pools, fees, squad rules, and
                        coordinators.
                      </p>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E86C1F]">
                      Open Tournaments
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1.5" />
                    </span>
                  </Link>
                </InteractiveTiltCard>

                <InteractiveTiltCard className="rounded-lg border border-white/15 border-t-2 border-t-[#38BDF8] bg-[#05132E]/90 shadow-lg hover:border-[#38BDF8]">
                  <Link
                    href="/accommodations"
                    className="flex h-full flex-col justify-between p-6"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <Building2 className="h-6 w-6 text-[#38BDF8] transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-mono text-[11px] tracking-widest text-slate-400 group-hover:text-[#38BDF8]">
                          02
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-2xl font-medium text-white">
                        Accommodations
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-blue-100/80">
                        Enter your matching Team ID to book on-campus stay for
                        team members.
                      </p>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
                      Book Campus Stay
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1.5" />
                    </span>
                  </Link>
                </InteractiveTiltCard>

                <InteractiveTiltCard className="rounded-lg border border-white/15 border-t-2 border-t-[#E86C1F] bg-[#05132E]/90 shadow-lg hover:border-[#E86C1F]">
                  <Link
                    href="/sponsors"
                    className="flex h-full flex-col justify-between p-6"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <Handshake className="h-6 w-6 text-[#E86C1F] transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-mono text-[11px] tracking-widest text-slate-400 group-hover:text-[#E86C1F]">
                          03
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-2xl font-medium text-white">
                        Sponsors
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-blue-100/80">
                        Explore partnership tiers and connect with our
                        organizing team.
                      </p>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E86C1F]">
                      View Sponsors
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1.5" />
                    </span>
                  </Link>
                </InteractiveTiltCard>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* 2B. INTERACTIVE 4-STEP ATHLETE & TEAM ID JOURNEY */}
        <section className="relative mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 sm:pb-24">
          <ScrollReveal>
            <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="label inline-flex items-center gap-1.5 text-[#E86C1F]">
                  <Sparkles className="h-3.5 w-3.5" />
                  How Participation Works
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-medium text-white sm:text-4xl">
                  From Squad Registration to Campus Stay
                </h2>
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#38BDF8] transition hover:text-[#E86C1F]"
              >
                Start Team Registration
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "STEP 01",
                  title: "Complete Athlete Profile",
                  desc: "Sign in with Google and save your university and contact details once.",
                  icon: Users,
                  accent: "border-t-[#38BDF8]",
                  href: "/profile",
                },
                {
                  step: "STEP 02",
                  title: "One Captain Registers",
                  desc: "Select your sport & division, enter squad size, and upload UPI fee proof.",
                  icon: Trophy,
                  accent: "border-t-[#E86C1F]",
                  href: "/register",
                },
                {
                  step: "STEP 03",
                  title: "Unlock Official Team ID",
                  desc: "Every registered squad immediately receives a unique ZEN-XXXXXX Team ID.",
                  icon: KeyRound,
                  accent: "border-t-[#38BDF8]",
                  href: "/profile",
                },
                {
                  step: "STEP 04",
                  title: "Match ID & Book Stay",
                  desc: "Anyone on your squad can enter the Team ID on Accommodations to book stay.",
                  icon: CheckCircle2,
                  accent: "border-t-[#E86C1F]",
                  href: "/accommodations",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <InteractiveTiltCard
                    key={item.step}
                    className={`rounded-lg border border-white/15 border-t-2 ${item.accent} bg-[#061533]/80 backdrop-blur-sm`}
                  >
                    <Link
                      href={item.href}
                      className="flex h-full flex-col justify-between p-5"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-[#38BDF8]">
                            {item.step}
                          </span>
                          <Icon className="h-4 w-4 text-[#E86C1F]" />
                        </div>
                        <h3 className="mt-3 font-display text-xl font-medium text-white group-hover:text-[#FDBA74]">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-blue-100/80">
                          {item.desc}
                        </p>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-300 group-hover:text-white">
                        Open Portal →
                      </span>
                    </Link>
                  </InteractiveTiltCard>
                );
              })}
            </div>
          </ScrollReveal>
        </section>

        {/* 3. ABOUT IIST (LEFT) + GOOGLE MAPS TO IIST (RIGHT) — TRANSLUCENT OVER PARALLAX STAGE */}
        <section
          id="about"
          className="relative border-t border-white/15 bg-[#061636]/55 backdrop-blur-xs"
        >
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <ScrollReveal>
              <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
                {/* Left: About IIST & Notable Space Leaders */}
                <div className="flex flex-col justify-between space-y-6 lg:col-span-6">
                  <div>
                    <p className="label text-[#38BDF8]">About the Host Campus</p>
                    <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-white sm:text-4xl">
                      Indian Institute of Space Science and Technology (IIST)
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-blue-100/90 sm:text-base">
                      Located in Valiamala, Thiruvananthapuram, Kerala and
                      founded in 2007 under the Department of Space, Government
                      of India, IIST works in close partnership with the Indian
                      Space Research Organisation (ISRO).
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-blue-100/90 sm:text-base">
                      Over{" "}
                      <strong className="text-[#E86C1F]">
                        {FEST_INFO.isroAlumniCount} IIST Alumni
                      </strong>{" "}
                      serve in ISRO, and ZENITH brings that same spirit of
                      excellence to inter-college athletics.
                    </p>

                    {/* Notable Leaders */}
                    <InteractiveTiltCard className="mt-6 rounded-xl border border-white/15 border-l-4 border-l-[#E86C1F] bg-[#05122B]/85 p-5 shadow-lg">
                      <p className="label !text-[0.6rem] text-[#E86C1F]">
                        Guided by Visionaries
                      </p>
                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {FEST_INFO.distinguishedLeaders.map((leader) => (
                          <div
                            key={leader}
                            className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-blue-50 transition hover:border-[#E86C1F]/60 hover:bg-white/10 hover:text-[#FDBA74]"
                          >
                            {leader}
                          </div>
                        ))}
                      </div>
                    </InteractiveTiltCard>
                  </div>

                  <div className="grid grid-cols-3 divide-x divide-white/15 rounded-xl border border-white/15 bg-[#05122B]/85 p-4 text-center shadow-lg">
                    <div>
                      <p className="label !text-[0.58rem] text-[#38BDF8]">
                        Founded
                      </p>
                      <p className="mt-1 font-display text-xl font-medium text-white sm:text-2xl">
                        <AnimatedCounter
                          target={FEST_INFO.established}
                          locale="en-US"
                          durationMs={1200}
                        />
                      </p>
                    </div>
                    <div>
                      <p className="label !text-[0.58rem] text-[#38BDF8]">
                        ISRO Alumni
                      </p>
                      <p className="mt-1 font-display text-xl font-medium text-[#E86C1F] sm:text-2xl">
                        <AnimatedCounter
                          target={1442}
                          suffix="+"
                          durationMs={1400}
                        />
                      </p>
                    </div>
                    <div>
                      <p className="label !text-[0.58rem] text-[#38BDF8]">
                        State
                      </p>
                      <p className="mt-1 font-display text-xl font-medium text-white sm:text-2xl">
                        Kerala
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Embedded Google Maps to IIST Valiamala */}
                <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-white/20 border-t-2 border-t-[#38BDF8] bg-[#05122B]/90 shadow-2xl lg:col-span-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#E86C1F]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        IIST Campus Location • Valiamala, Thiruvananthapuram
                      </span>
                    </div>
                    <a
                      href="https://maps.google.com/?q=Indian+Institute+of+Space+Science+and+Technology+Valiamala+Thiruvananthapuram"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#38BDF8] hover:text-[#E86C1F]"
                    >
                      Open in Google Maps
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  <div className="relative min-h-[340px] flex-1 bg-slate-900">
                    <iframe
                      title="Google Map to Indian Institute of Space Science and Technology (IIST)"
                      src="https://www.google.com/maps?q=Indian+Institute+of+Space+Science+and+Technology,+Valiamala,+Thiruvananthapuram,+Kerala+695547&output=embed"
                      className="h-full min-h-[360px] w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  <div className="border-t border-white/15 bg-[#05122B] px-5 py-3.5 text-xs text-blue-100/80">
                    <strong>Address:</strong> Valiamala Road, Valiamala,
                    Thiruvananthapuram, Kerala 695547 (~25 km from Trivandrum
                    Central Railway Station).
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </HomeBelowFoldParallax>

      {/* 4. ATTRACTIVE & INFORMATIVE FOOTER */}
      <footer
        id="contact"
        className="border-t border-white/15 bg-[#05132E] text-slate-200"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <ScrollReveal>
            <div className="grid gap-10 lg:grid-cols-12">
              {/* Brand + Venue + Socials */}
              <div className="space-y-4 lg:col-span-4">
                <ZenithLogo light size="lg" showText />
                <p className="text-sm leading-relaxed text-blue-100/80">
                  Official inter-college sports championship of the{" "}
                  {FEST_INFO.institute}, Valiamala, Thiruvananthapuram, Kerala.
                </p>

                <div className="flex flex-wrap gap-3 pt-1 text-xs font-semibold">
                  <a
                    href={FEST_INFO.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white transition hover:border-[#FF7A00] hover:text-[#FF7A00]"
                  >
                    Instagram: {FEST_INFO.socials.instagramHandle}
                  </a>
                  <a
                    href={FEST_INFO.socials.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white transition hover:border-[#38BDF8] hover:text-[#38BDF8]"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {FEST_INFO.socials.websiteLabel}
                  </a>
                  <a
                    href={FEST_INFO.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white transition hover:border-[#38BDF8] hover:text-[#38BDF8]"
                  >
                    LinkedIn: {FEST_INFO.socials.linkedinHandle}
                  </a>
                </div>
              </div>

              {/* Quick Portal Links */}
              <div className="lg:col-span-3">
                <p className="label text-[#38BDF8]">Quick Links</p>
                <ul className="mt-4 space-y-2.5 text-sm font-medium text-blue-100/85">
                  <li>
                    <Link href="/" className="transition hover:text-[#FF7A00]">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tournaments"
                      className="transition hover:text-[#FF7A00]"
                    >
                      Tournaments &amp; Rules
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/accommodations"
                      className="transition hover:text-[#FF7A00]"
                    >
                      Campus Accommodations (Team ID)
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sponsors"
                      className="transition hover:text-[#FF7A00]"
                    >
                      Sponsors &amp; Partners
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="transition hover:text-[#FF7A00]"
                    >
                      Register Team
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="transition hover:text-[#FF7A00]"
                    >
                      My Athlete Profile
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Organizing Committee Contacts */}
              <div className="lg:col-span-5">
                <p className="label text-[#FF7A00]">
                  Organizing Committee Helplines
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/15 bg-[#09204A] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#FF7A00]">
                    <p className="label !text-[0.58rem] text-[#38BDF8]">
                      {FEST_INFO.chiefCoordinator.role}
                    </p>
                    <p className="mt-1.5 font-display text-lg font-medium text-white">
                      {FEST_INFO.chiefCoordinator.name}
                    </p>
                    <a
                      href={`tel:${FEST_INFO.chiefCoordinator.phone.replace(
                        /\s+/g,
                        ""
                      )}`}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#FF7A00] hover:underline"
                    >
                      <Phone className="h-3 w-3" />
                      {FEST_INFO.chiefCoordinator.phone}
                    </a>
                  </div>

                  {FEST_INFO.eventsHeads.map((head) => (
                    <div
                      key={head.phone}
                      className="rounded-xl border border-white/15 bg-[#09204A] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#FF7A00]"
                    >
                      <p className="label !text-[0.58rem] text-[#FF7A00]">
                        {head.role}
                      </p>
                      <p className="mt-1.5 font-display text-lg font-medium text-white">
                        {head.name}
                      </p>
                      <a
                        href={`tel:${head.phone.replace(/\s+/g, "")}`}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#38BDF8] hover:underline"
                      >
                        <Phone className="h-3 w-3" />
                        {head.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-blue-200/70 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2027 ZENITH — IIST Inter-College Sports Fest.</p>
            <p>
              Valid College ID &amp; Aadhar ID required for all university
              participants.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
