"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Globe, Menu, Phone, X } from "lucide-react";
import { FEST_INFO } from "@/data/sports";
import { ZenithLogo } from "./ZenithLogo";

const emptySubscribe = () => () => {};

const NAV_LINKS = [
  {
    num: "01",
    href: "/",
    label: "Home",
    desc: "Overview, Prize Pool & Campus Map",
  },
  {
    num: "02",
    href: "/tournaments",
    label: "Tournaments",
    desc: "All Sports, Rules & Prize Breakdown",
  },
  {
    num: "03",
    href: "/accommodations",
    label: "Accommodations",
    desc: "Book Campus Stay via Team ID",
  },
  {
    num: "04",
    href: "/sponsors",
    label: "Sponsors",
    desc: "Official Partners & Tiers",
  },
  {
    num: "05",
    href: "/register",
    label: "Register Team",
    desc: "Team Representative Entry Portal",
  },
  {
    num: "06",
    href: "/#contact",
    label: "Contact Us",
    desc: "Organizing Committee & Helplines",
  },
];

const BOTTOM_QUICK_LINKS = [
  { href: "/profile", label: "My Profile" },
  { href: "/register", label: "Team Entry" },
  { href: "/accommodations", label: "Team ID Stay" },
  { href: "/#about", label: "IIST Map" },
];

export function NavMenuDrawerButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-label="Open navigation menu"
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition duration-200 cursor-pointer sm:px-3.5 sm:py-2 ${
          open
            ? "border-[#E86C1F] bg-[#E86C1F]"
            : "border-white/25 bg-white/10 hover:border-white/50 hover:bg-white/15"
        }`}
      >
        {open ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
        <span>Menu</span>
      </button>

      {isHydrated &&
        createPortal(
          <div
            aria-hidden={!open}
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${
              open
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[#030A18]/70 backdrop-blur-xs"
              onClick={() => setOpen(false)}
            />

            {/* Slide-In Right Side Drawer */}
            <aside
              aria-label="Site Navigation Drawer"
              className={`absolute inset-y-0 right-0 flex w-[min(88vw,25rem)] flex-col justify-between border-l border-white/15 bg-[#051229] text-white shadow-[-24px_0_60px_rgba(2,8,22,0.85)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {/* Top Accent Bar */}
              <div className="h-1 w-full bg-gradient-to-r from-[#E86C1F] via-[#F59E0B] to-[#38BDF8]" />

              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/12 px-6 py-4">
                <div className="flex items-center gap-3">
                  <ZenithLogo size="md" />
                  <div>
                    <p className="font-display text-base font-medium tracking-tight text-white">
                      ZENITH <span className="text-[#E86C1F]">2027</span>
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Navigation Directory
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation drawer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-white/5 text-slate-300 transition hover:border-[#E86C1F] hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Main Numbered Navigation Links */}
              <nav
                aria-label="Primary Navigation"
                className="flex-1 divide-y divide-white/10 overflow-y-auto"
              >
                {NAV_LINKS.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : !item.href.startsWith("/#") &&
                        pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`group flex items-baseline justify-between gap-4 border-l-2 px-6 py-4 transition-colors duration-150 ${
                        active
                          ? "border-l-[#E86C1F] bg-white/[0.06]"
                          : "border-l-transparent hover:border-l-[#E86C1F]/70 hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-baseline gap-4">
                        <span
                          className={`font-mono text-xs tracking-widest ${
                            active
                              ? "text-[#E86C1F]"
                              : "text-slate-400 group-hover:text-[#E86C1F]"
                          }`}
                        >
                          {item.num}
                        </span>
                        <div>
                          <p
                            className={`font-display text-xl font-medium tracking-tight transition-colors ${
                              active
                                ? "text-[#E86C1F]"
                                : "text-white group-hover:text-[#FDBA74]"
                            }`}
                          >
                            {item.label}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-300/75">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <ArrowUpRight
                        className={`h-4 w-4 shrink-0 self-center transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                          active
                            ? "text-[#E86C1F]"
                            : "text-slate-500 group-hover:text-white"
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>

              {/* Anchored Bottom Quick Links, Socials & Helpline */}
              <div className="border-t border-white/15 bg-[#030C1D] px-6 py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#38BDF8]">
                  Quick Access &amp; Official Links
                </p>

                {/* Bottom Quick Portal Links */}
                <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 border-b border-white/10 pb-3.5 text-xs font-medium text-slate-200">
                  {BOTTOM_QUICK_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-1 transition hover:text-[#E86C1F]"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-3 w-3 text-[#E86C1F]" />
                    </Link>
                  ))}
                </div>

                {/* Bottom Social & Helpline Links */}
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={FEST_INFO.socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-white transition hover:text-[#E86C1F]"
                    >
                      Instagram
                    </a>
                    <span className="text-white/25">•</span>
                    <a
                      href={FEST_INFO.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-white transition hover:text-[#38BDF8]"
                    >
                      LinkedIn
                    </a>
                    <span className="text-white/25">•</span>
                    <a
                      href={FEST_INFO.socials.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-white transition hover:text-[#38BDF8]"
                    >
                      <Globe className="h-3 w-3" />
                      iist.ac.in
                    </a>
                  </div>

                  <a
                    href={`tel:${FEST_INFO.chiefCoordinator.phone.replace(
                      /\s+/g,
                      ""
                    )}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#E86C1F] hover:underline"
                  >
                    <Phone className="h-3 w-3" />
                    {FEST_INFO.chiefCoordinator.phone}
                  </a>
                </div>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </div>
  );
}
