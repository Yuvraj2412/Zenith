import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  CreditCard,
  Globe,
  GraduationCap,
  MapPin,
  Phone,
  ShieldCheck,
  Trophy,
  UserCheck,
} from "lucide-react";
import { FEST_INFO, SPORTS } from "@/data/sports";
import { SportsSectionServer } from "@/components/SportsSectionServer";
import { SportsShowcase } from "@/components/SportsShowcase";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#07162C] via-[#0B254B] to-[#1D4ED8] text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-orange-300">
              <span>{FEST_INFO.institute}</span>
            </div>

            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              ZENITH <span className="text-orange-400">2027</span>
            </h1>
            <p className="mt-2 font-display text-xl font-semibold text-blue-100 sm:text-2xl">
              {FEST_INFO.subtitle} —{" "}
              <span className="text-orange-300">{FEST_INFO.tagline}</span>
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-blue-100/90">
              Compete across 7 premier inter-college tournaments at IIST
              Thiruvananthapuram. Browse all sports below, sign in with Google to
              build your verified athlete profile, and submit your team entry
              with instant payment tracking.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#sports"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
              >
                Explore 7 Sports
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Register Team / Player
              </Link>
            </div>
          </div>

          {/* Key Stats Strip */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                Official Events
              </div>
              <div className="mt-1 font-display text-2xl font-bold text-white">
                7 Sports
              </div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                Total Prize Pool*
              </div>
              <div className="mt-1 font-display text-2xl font-bold text-orange-300">
                {FEST_INFO.totalPrizePoolDisplay}
              </div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                Eligibility
              </div>
              <div className="mt-1 font-display text-xl font-bold text-white">
                Univ. Students
              </div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                Verification
              </div>
              <div className="mt-1 font-display text-xl font-bold text-white">
                College & Aadhar ID
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIMPLE 3-STEP REGISTRATION FLOW */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Step 1 • Profile
                </p>
                <h2 className="font-display text-base font-bold text-slate-900">
                  Google Login & Details
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Sign in with Google and fill your college, age, and ID details
                  once to unlock registration.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Step 2 • Payment
                </p>
                <h2 className="font-display text-base font-bold text-slate-900">
                  Pay & Upload Screenshot
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Select a sport, scan the UPI QR code to pay the fee, and attach
                  your payment screenshot.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Step 3 • Approval
                </p>
                <h2 className="font-display text-base font-bold text-slate-900">
                  Pending → Success
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Once an admin verifies your screenshot, your profile status
                  updates from Pending to Success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 SPORTS SHOWCASE */}
      <section id="sports" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-orange-600">
              <Trophy className="h-4 w-4" />
              Official Brochure Events
            </span>
            <h2 className="mt-1 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
              7 Inter-College Sports
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-600">
            Browse rules, prize pools, fees, squad sizes, and sport coordinators.
            *Prize pools and schedules follow official IIST Zenith rules.
          </p>
        </div>

        <Suspense
          fallback={<SportsShowcase sports={SPORTS} authMode="guest" />}
        >
          <SportsSectionServer />
        </Suspense>
      </section>

      {/* ABOUT IIST */}
      <section id="about" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-700">
                <GraduationCap className="h-4 w-4" />
                About Host Institution
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold text-slate-900">
                Indian Institute of Space Science and Technology (IIST)
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                Located in Valiamala, Thiruvananthapuram, Kerala and established
                in 2007 under the Department of Space, Govt. of India, IIST is a
                premier academic institution working in close collaboration with
                the Indian Space Research Organisation (ISRO).
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                Currently <strong>{FEST_INFO.isroAlumniCount} Alumni</strong> of
                IIST are placed in ISRO, contributing directly to India&apos;s
                space missions while cultivating an energetic campus culture of
                athletics and sportsmanship through ZENITH.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-slate-700">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  {FEST_INFO.location}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <Award className="h-4 w-4 text-blue-700" />
                  Est. {FEST_INFO.established} • Dept. of Space
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-[#0A1D37] to-[#17396D] p-6 text-white shadow-sm lg:col-span-5">
              <h3 className="font-display text-lg font-bold text-orange-300">
                Guided by Distinguished Visionaries
              </h3>
              <p className="mt-1 text-xs text-blue-200">
                Leaders in India&apos;s space sector featured in the ZENITH IIST
                brochure:
              </p>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                {FEST_INFO.distinguishedLeaders.map((leader) => (
                  <li
                    key={leader}
                    className="flex items-center gap-2.5 rounded-xl bg-white/10 px-3.5 py-2 text-sm font-medium text-white"
                  >
                    <ShieldCheck className="h-4 w-4 shrink-0 text-orange-400" />
                    <span>{leader}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & FOOTER */}
      <footer
        id="contact"
        className="border-t border-slate-800 bg-[#07162C] text-slate-200"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-400">
                ZENITH 2027 • BEYOND HORIZON
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-white">
                Contact the Organizing Team
              </h2>
              <p className="mt-2 text-sm text-blue-200">
                Need help with team eligibility, fixture formats, or campus
                accommodation? Reach out directly to our student coordinators.
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold">
                <a
                  href={FEST_INFO.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white hover:border-orange-400 hover:text-orange-300"
                >
                  Instagram: {FEST_INFO.socials.instagramHandle}
                </a>
                <a
                  href={FEST_INFO.socials.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white hover:border-blue-400 hover:text-blue-300"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {FEST_INFO.socials.websiteLabel}
                </a>
                <a
                  href={FEST_INFO.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white hover:border-blue-400 hover:text-blue-300"
                >
                  LinkedIn: {FEST_INFO.socials.linkedinHandle}
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 md:col-span-7">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                  {FEST_INFO.chiefCoordinator.role}
                </p>
                <p className="mt-1 font-display text-base font-bold text-white">
                  {FEST_INFO.chiefCoordinator.name}
                </p>
                <a
                  href={`tel:${FEST_INFO.chiefCoordinator.phone.replace(/\s+/g, "")}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-orange-300 hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {FEST_INFO.chiefCoordinator.phone}
                </a>
              </div>

              {FEST_INFO.eventsHeads.map((head) => (
                <div
                  key={head.phone}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
                    {head.role}
                  </p>
                  <p className="mt-1 font-display text-base font-bold text-white">
                    {head.name}
                  </p>
                  <a
                    href={`tel:${head.phone.replace(/\s+/g, "")}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-blue-200 hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {head.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2027 ZENITH — IIST Inter-College Sports Fest.</p>
            <p>
              Valid College ID & Aadhar ID mandatory for all university
              participants.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
