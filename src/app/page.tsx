import Link from "next/link";
import { Suspense } from "react";
import { Globe, MapPin, Phone } from "lucide-react";
import { FEST_INFO, SPORTS } from "@/data/sports";
import { SportsSectionServer } from "@/components/SportsSectionServer";
import { SportsShowcase } from "@/components/SportsShowcase";

export default function HomePage() {
  return (
    <div className="relative flex flex-col overflow-x-clip">
      {/* Ambient Editorial Blue & Orange Blur Glows */}
      <div
        className="pointer-events-none absolute -top-28 right-0 h-[26rem] w-[26rem] rounded-full bg-[#16408B]/12 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-40 -left-24 h-72 w-72 rounded-full bg-[#D9531E]/10 blur-3xl"
        aria-hidden="true"
      />

      {/* FIRST VIEWPORT (HERO + SCOREBOARD FITS WITHIN ~90VH BELOW NAVBAR) */}
      <div className="relative flex flex-col lg:min-h-[calc(100svh-5rem)] lg:justify-between">
        {/* ASYMMETRIC EDITORIAL HERO */}
        <section className="relative mx-auto my-auto grid w-full max-w-6xl grid-cols-12 items-center gap-x-8 gap-y-6 px-4 py-8 sm:px-6 sm:py-10 lg:py-8">
          <div className="col-span-12 flex flex-col lg:col-span-7">
            <p className="label text-[#16408B]">
              {FEST_INFO.institute} — Kerala
            </p>

            <h1 className="mt-3 font-display text-3xl font-medium leading-[1.08] tracking-tight text-[#091930] sm:text-5xl lg:text-[3.35rem]">
              <span className="text-[#16408B]">ZENITH 2027</span> brings
              flagship{" "}
              <span className="italic text-[#D9531E]">inter-college</span>{" "}
              tournaments beyond the horizon.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#091930]/75 sm:text-base lg:text-lg">
              Compete across field, court, and board at IIST Thiruvananthapuram.
              Explore the tournaments below, sign in with Google to complete
              your athlete profile, and register your team.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <a
                href="#sports"
                className="label inline-flex items-center justify-center gap-3 rounded-sm bg-[#D9531E] px-6 py-3.5 text-white shadow-lg shadow-[#D9531E]/25 transition duration-300 hover:-translate-y-0.5 hover:bg-[#BE4414] hover:shadow-xl hover:shadow-[#D9531E]/30"
              >
                Explore tournaments <span aria-hidden="true">→</span>
              </a>
              <Link
                href="/register"
                className="label inline-flex items-center justify-center gap-2 rounded-sm border border-[#16408B]/25 bg-white/80 px-6 py-3.5 text-[#091930] shadow-sm shadow-blue-950/5 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#16408B] hover:bg-white"
              >
                Team registration
              </Link>
            </div>
          </div>

          {/* Framed Editorial Stadium Photograph */}
          <div className="col-span-12 flex justify-center lg:col-span-5 lg:justify-end">
            <div className="group w-full max-w-md">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-[#07162C] shadow-2xl shadow-blue-950/25 lg:aspect-[5/4] lg:max-h-[56svh]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-stadium.jpg"
                  alt="Floodlit collegiate sports stadium at twilight"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07162C]/55 via-transparent to-[#16408B]/20"
                  aria-hidden="true"
                />
                <span className="absolute inset-y-0 right-0 flex w-10 items-center justify-center border-l border-white/20 bg-[#07162C]/60 text-white backdrop-blur-md transition-colors duration-500 group-hover:bg-[#07162C]/75 sm:w-11">
                  <span className="label rotate-180 whitespace-nowrap !text-[0.6rem] text-orange-200 [writing-mode:vertical-rl] sm:!text-[0.65rem]">
                    Beyond The Horizon • IIST
                  </span>
                </span>
              </div>
              <p className="label mt-2 text-right !text-[0.62rem] text-[#091930]/55">
                Valiamala, Thiruvananthapuram • Est. {FEST_INFO.established}
              </p>
            </div>
          </div>
        </section>

        {/* FROSTED DEEP BLUE & ORANGE SCOREBOARD STRIP */}
        <section className="relative border-y border-blue-900/20 bg-gradient-to-r from-[#07162C] via-[#0E2B57] to-[#16408B] text-white shadow-xl shadow-blue-950/15">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-y divide-white/15 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            <div className="px-4 py-3.5 sm:px-6 sm:py-4">
              <p className="label !text-[0.6rem] text-blue-200">Edition</p>
              <p className="mt-0.5 font-display text-lg font-medium text-white sm:text-xl">
                Inter-College
              </p>
            </div>
            <div className="px-4 py-3.5 sm:px-6 sm:py-4">
              <p className="label !text-[0.6rem] text-blue-200">
                Total Prize Pool*
              </p>
              <p className="mt-0.5 font-display text-lg font-medium text-orange-300 sm:text-xl">
                {FEST_INFO.totalPrizePoolDisplay}
              </p>
            </div>
            <div className="px-4 py-3.5 sm:px-6 sm:py-4">
              <p className="label !text-[0.6rem] text-blue-200">Formats</p>
              <p className="mt-0.5 font-display text-base font-medium text-white sm:text-lg">
                League • Swiss • KO
              </p>
            </div>
            <div className="px-4 py-3.5 sm:px-6 sm:py-4">
              <p className="label !text-[0.6rem] text-blue-200">Verification</p>
              <p className="mt-0.5 font-display text-base font-medium text-white sm:text-lg">
                College &amp; Aadhar ID
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* SPORTS EDITORIAL DIRECTORY */}
      <section
        id="sports"
        className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-24"
      >
        <div
          className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#D9531E]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mb-8 flex flex-col justify-between gap-3 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <p className="label text-[#D9531E]">Official Prospectus</p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-[#091930] sm:text-4xl">
              Official Tournaments
            </h2>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-[#091930]/65 sm:text-sm">
            University students with valid College ID &amp; Aadhar ID only.
            *Prize pools and fixtures follow official IIST ZENITH guidelines.
          </p>
        </div>

        <div className="relative">
          <Suspense
            fallback={<SportsShowcase sports={SPORTS} authMode="guest" />}
          >
            <SportsSectionServer />
          </Suspense>
        </div>
      </section>

      {/* ABOUT IIST — EDITORIAL SPLIT */}
      <section
        id="about"
        className="border-t border-blue-950/10 bg-white/80 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
            <div className="lg:col-span-7">
              <p className="label text-[#16408B]">Host Institution</p>
              <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-[#091930] sm:text-3xl">
                Indian Institute of Space Science and Technology
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#091930]/75 sm:text-base">
                Located in Valiamala, Thiruvananthapuram, Kerala and established
                in 2007 under the Department of Space, Government of India, IIST
                is a premier academic institution working in close collaboration
                with the Indian Space Research Organisation (ISRO).
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#091930]/75 sm:text-base">
                With <strong>{FEST_INFO.isroAlumniCount} Alumni</strong> placed
                in ISRO, IIST pairs scientific excellence with a proud tradition
                of inter-collegiate athletics through ZENITH.
              </p>

              <div className="mt-7 grid grid-cols-1 divide-y divide-blue-950/10 border-y border-blue-950/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="py-3.5 sm:pr-5">
                  <p className="label !text-[0.6rem] text-[#091930]/50">
                    Established
                  </p>
                  <p className="mt-1 font-display text-xl font-medium text-[#091930]">
                    {FEST_INFO.established}
                  </p>
                </div>
                <div className="py-3.5 sm:px-5">
                  <p className="label !text-[0.6rem] text-[#091930]/50">
                    ISRO Alumni
                  </p>
                  <p className="mt-1 font-display text-xl font-medium text-[#D9531E]">
                    {FEST_INFO.isroAlumniCount}
                  </p>
                </div>
                <div className="py-3.5 sm:pl-5">
                  <p className="label !text-[0.6rem] text-[#091930]/50">
                    Campus
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-[#16408B]">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    Valiamala, Kerala
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-sm border-l-4 border-[#D9531E] bg-gradient-to-br from-[#07162C] via-[#0B234A] to-[#16408B] p-6 text-white shadow-2xl shadow-blue-950/20 sm:p-8 lg:col-span-5">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#D9531E]/25 blur-2xl"
                aria-hidden="true"
              />
              <p className="label relative !text-[0.6rem] text-orange-300">
                Leadership &amp; Inspiration
              </p>
              <h3 className="relative mt-2 font-display text-xl font-medium text-white sm:text-2xl">
                Guided by Distinguished Visionaries
              </h3>
              <ul className="relative mt-5 divide-y divide-white/10">
                {FEST_INFO.distinguishedLeaders.map((leader) => (
                  <li
                    key={leader}
                    className="py-2.5 text-sm font-normal text-blue-50/90"
                  >
                    {leader}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CLASSIC FOOTER & CONTACTS */}
      <footer
        id="contact"
        className="relative overflow-hidden border-t border-blue-900 bg-[#07162C] text-slate-200"
      >
        <div
          className="pointer-events-none absolute -bottom-24 right-1/3 h-64 w-64 rounded-full bg-[#16408B]/25 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="label text-orange-400">
                ZENITH 2027 • BEYOND HORIZON
              </p>
              <h2 className="mt-2 font-display text-2xl font-medium text-white sm:text-3xl">
                Organizing Committee
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-blue-100/75">
                For fixture queries, campus entry, or registration assistance,
                reach out to the fest coordinators directly.
              </p>

              <div className="mt-6 flex flex-wrap gap-5 text-xs font-medium text-blue-200">
                <a
                  href={FEST_INFO.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-orange-300"
                >
                  Instagram: {FEST_INFO.socials.instagramHandle}
                </a>
                <a
                  href={FEST_INFO.socials.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 transition hover:text-orange-300"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {FEST_INFO.socials.websiteLabel}
                </a>
                <a
                  href={FEST_INFO.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-orange-300"
                >
                  LinkedIn: {FEST_INFO.socials.linkedinHandle}
                </a>
              </div>
            </div>

            <div className="grid divide-y divide-white/10 rounded-sm border border-white/15 bg-white/5 shadow-xl shadow-black/25 backdrop-blur-md sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:col-span-7">
              <div className="p-5">
                <p className="label !text-[0.6rem] text-blue-300">
                  {FEST_INFO.chiefCoordinator.role}
                </p>
                <p className="mt-2 font-display text-lg font-medium text-white">
                  {FEST_INFO.chiefCoordinator.name}
                </p>
                <a
                  href={`tel:${FEST_INFO.chiefCoordinator.phone.replace(
                    /\s+/g,
                    ""
                  )}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-orange-300 hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {FEST_INFO.chiefCoordinator.phone}
                </a>
              </div>

              {FEST_INFO.eventsHeads.map((head) => (
                <div key={head.phone} className="p-5">
                  <p className="label !text-[0.6rem] text-orange-400">
                    {head.role}
                  </p>
                  <p className="mt-2 font-display text-lg font-medium text-white">
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

          <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2027 ZENITH — IIST Inter-College Sports Fest.</p>
            <p>
              Valid College ID &amp; Aadhar ID mandatory for all university
              participants.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
