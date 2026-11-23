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
  { num: "01", href: "/", label: "Home" },
  { num: "02", href: "/tournaments", label: "Events" },
  { num: "03", href: "/accommodations", label: "Accommodations" },
  { num: "04", href: "/sponsors", label: "Sponsors" },
  { num: "05", href: "/register", label: "Register Team" },
  { num: "06", href: "/#contact", label: "Contact Us" },
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
            {/* Soft Translucent Backdrop */}
            <div
              className="absolute inset-0 bg-[#020816]/45 backdrop-blur-xs"
              onClick={() => setOpen(false)}
            />

            {/* Translucent, Blurry & Glassy Slide-In Right Drawer (No Dividing Lines) */}
            <aside
              aria-label="Site Navigation Drawer"
              className={`absolute inset-y-0 right-0 flex w-[min(86vw,23rem)] flex-col justify-between border-l border-white/20 bg-[#071A3E]/55 text-white shadow-[-24px_0_64px_rgba(2,8,22,0.65)] backdrop-blur-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <div className="flex items-center gap-3">
                  <ZenithLogo size="md" />
                  <p className="font-display text-sm font-bold tracking-[0.12em] text-white">
                    ZENITH <span className="font-extrabold text-[#E86C1F]">2027</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation drawer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-slate-200 transition hover:bg-white/20 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Clean Navigation Links — No Descriptions, No Divider Lines, Hover Glass Box Only */}
              <nav
                aria-label="Primary Navigation"
                className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6"
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
                      className={`group flex items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-200 ${
                        active
                          ? "bg-white/16 text-[#FDBA74] shadow-sm backdrop-blur-md"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-baseline gap-3.5">
                        <span
                          className={`font-akira text-[10px] tracking-widest transition-colors ${
                            active
                              ? "text-[#E86C1F]"
                              : "text-blue-200/55 group-hover:text-[#E86C1F]"
                          }`}
                        >
                          {item.num}
                        </span>
                        <span className="font-display text-base font-medium uppercase tracking-wider sm:text-lg">
                          {item.label}
                        </span>
                      </div>

                      <ArrowUpRight
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                          active
                            ? "text-[#E86C1F]"
                            : "text-white/40 group-hover:text-white"
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>

              {/* Anchored Bottom Quick Links & Social Icons */}
              <div className="mx-4 mb-5 rounded-xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-xl">
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-blue-100/90">
                  {BOTTOM_QUICK_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-1 transition hover:text-[#FDBA74]"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-3 w-3 text-[#E86C1F]" />
                    </Link>
                  ))}
                </div>

                <div className="mt-3.5 flex items-center justify-between gap-2 pt-1 text-xs text-blue-100/80">
                  <div className="flex items-center gap-2.5">
                    <a
                      href={FEST_INFO.socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#E86C1F]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </a>
                    <a
                      href={FEST_INFO.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#38BDF8] hover:text-[#051229]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                    <a
                      href={FEST_INFO.socials.website}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Official Website"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#38BDF8] hover:text-[#051229]"
                    >
                      <Globe className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  <a
                    href={`tel:${FEST_INFO.chiefCoordinator.phone.replace(
                      /\s+/g,
                      ""
                    )}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#FDBA74] hover:text-[#E86C1F]"
                  >
                    <Phone className="h-3 w-3 text-[#E86C1F]" />
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
