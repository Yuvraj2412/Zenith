import Link from "next/link";
import { Handshake, Phone, Sparkles, Trophy, Users } from "lucide-react";
import { FEST_INFO } from "@/data/sports";
import { ScrollHorizonOverlay } from "@/components/ScrollHorizonOverlay";

const SPONSOR_TIERS = [
  {
    tier: "Title Sponsor",
    highlight: "Exclusive Main-Stage & Jersey Branding",
    perks: [
      "ZENITH 2027 'Presented By' branding across all banners, jerseys & digital portals",
      "Prime main-arena stall & product experience zone at IIST Campus",
      "trophy presentation rights at the Grand Finale",
    ],
  },
  {
    tier: "Associate & Powered-By Partners",
    highlight: "Individual Sport & Arena Branding",
    perks: [
      "Dedicated branding across Football, Cricket, Basketball, Volleyball, Chess, Badminton & TT arenas",
      "On-campus activation booth and direct student engagement",
      "Logo placement on official certificates, social reels & rulebooks",
    ],
  },
  {
    tier: "Hydration, Apparel & Tech Partners",
    highlight: "Official Kit & Athlete Experience",
    perks: [
      "Official kit, beverage, or equipment partner recognition across all matches",
      "Custom giveaways in welcome kits for visiting university teams",
      "Dedicated shoutouts across @zenith.iist social channels",
    ],
  },
];

export default function SponsorsPage() {
  return (
    <div className="relative min-h-[100svh] bg-gradient-to-b from-[#071A3E] via-[#0B2559] to-[#071A3E] pb-20 pt-28 text-white">
      <ScrollHorizonOverlay />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur-md">
            <Handshake className="h-3.5 w-3.5 text-[#FF7A00]" />
            <span className="label !text-[0.62rem] text-[#38BDF8]">
              ZENITH 2027 • Official Partnerships
            </span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-medium text-white sm:text-5xl">
            Our <span className="text-[#FF7A00]">Sponsors</span> &amp; Partners
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-blue-100/85 sm:text-base">
            Partner with {FEST_INFO.institute} to connect with top university
            athletes, space-tech innovators, and student leaders from across
            India.
          </p>
        </div>

        {/* Impact Numbers */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
            <Trophy className="h-6 w-6 text-[#FF7A00]" />
            <p className="mt-3 font-display text-3xl font-medium text-white">
              {FEST_INFO.totalPrizePoolDisplay}
            </p>
            <p className="mt-1 text-xs text-blue-200">
              Total Championship Prize Pool*
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
            <Users className="h-6 w-6 text-[#38BDF8]" />
            <p className="mt-3 font-display text-3xl font-medium text-white">
              50+ Colleges
            </p>
            <p className="mt-1 text-xs text-blue-200">
              University delegations &amp; student spectators
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
            <Sparkles className="h-6 w-6 text-[#FF7A00]" />
            <p className="mt-3 font-display text-3xl font-medium text-white">
              {FEST_INFO.isroAlumniCount} Alumni
            </p>
            <p className="mt-1 text-xs text-blue-200">
              IIST graduates serving in ISRO missions
            </p>
          </div>
        </div>

        {/* Sponsorship Tiers */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {SPONSOR_TIERS.map((item) => (
            <div
              key={item.tier}
              className="flex flex-col justify-between rounded-2xl border border-white/15 bg-[#0B1F47]/90 p-6 shadow-xl backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#FF7A00]"
            >
              <div>
                <span className="label !text-[0.6rem] text-[#FF7A00]">
                  Partnership Tier
                </span>
                <h2 className="mt-2 font-display text-2xl font-medium text-white">
                  {item.tier}
                </h2>
                <p className="mt-1 text-xs font-semibold text-[#38BDF8]">
                  {item.highlight}
                </p>

                <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-xs leading-relaxed text-blue-100/85">
                  {item.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF7A00]" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Direct Sponsor Contact Box */}
        <div className="mt-12 rounded-2xl border border-white/20 bg-gradient-to-r from-[#071A3E] via-[#0E2F6B] to-[#0099FF]/40 p-7 shadow-2xl backdrop-blur-md sm:p-9">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <span className="label text-[#FF7A00]">
                Become an Official Partner
              </span>
              <h2 className="mt-2 font-display text-2xl font-medium text-white sm:text-3xl">
                Interested in Sponsoring ZENITH 2027?
              </h2>
              <p className="mt-2 text-sm text-blue-100/85">
                Reach out to our organizing committee for the sponsorship
                brochure and custom branding packages.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${FEST_INFO.chiefCoordinator.phone.replace(
                  /\s+/g,
                  ""
                )}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF7A00] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF7A00]/30 transition hover:bg-[#E66E00]"
              >
                <Phone className="h-4 w-4" />
                Call {FEST_INFO.chiefCoordinator.name}
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-[#071A3E]"
              >
                All Contacts →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
