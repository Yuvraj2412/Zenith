"use client";

import { useEffect, useRef, type ReactNode } from "react";

const WATERMARK_BANDS = [
  {
    top: "4%",
    dir: 1,
    speed: 0.2,
    baseOffset: -200,
    color: "text-white/[0.045]",
    text: "BEYOND THE HORIZON • ZENITH 2027 • IIST SPORTS CHAMPIONSHIP • BEYOND THE HORIZON",
  },
  {
    top: "20%",
    dir: -1,
    speed: 0.18,
    baseOffset: 140,
    color: "text-[#FDBA74]/[0.045]",
    text: "FOOTBALL • CRICKET • BASKETBALL • VOLLEYBALL • BADMINTON • TABLE TENNIS • CHESS",
  },
  {
    top: "36%",
    dir: 1,
    speed: 0.2,
    baseOffset: -220,
    color: "text-[#38BDF8]/[0.045]",
    text: "IIST THIRUVANANTHAPURAM • DEPARTMENT OF SPACE • ANNUAL INTER-COLLEGE SPORTS FEST",
  },
  {
    top: "52%",
    dir: -1,
    speed: 0.18,
    baseOffset: 160,
    color: "text-white/[0.04]",
    text: "CHAMPIONSHIP ARENA • ₹3,62,500 PRIZE POOL • LEAGUE & KNOCKOUT • ZENITH 2027",
  },
  {
    top: "68%",
    dir: 1,
    speed: 0.19,
    baseOffset: -170,
    color: "text-[#FDBA74]/[0.045]",
    text: "VALIAMALA CAMPUS • KERALA • ATHLETIC EXCELLENCE • ONE CAPTAIN REGISTRATION",
  },
  {
    top: "84%",
    dir: -1,
    speed: 0.17,
    baseOffset: 150,
    color: "text-[#38BDF8]/[0.045]",
    text: "JANUARY 21, 2027 • KICKOFF AT IIST • COMPETE BEYOND THE HORIZON • ZENITH 2027",
  },
];

/**
 * Lightweight 60fps Below-the-Fold Parallax Stage:
 * - Single ultra-dispersed elliptical sunlight wash that glides smoothly on scroll (no visible hard shade edges)
 * - 6 gliding background watermark text bands
 */
export function HomeBelowFoldParallax({ children }: { children: ReactNode }) {
  const bandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dispersedRayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId = 0;

    function updateParallax() {
      rafId = 0;
      const scrollY = window.scrollY || 0;
      const vh = window.innerHeight || 800;
      const belowScroll = Math.max(0, scrollY - vh * 0.25);

      for (let i = 0; i < WATERMARK_BANDS.length; i++) {
        const el = bandRefs.current[i];
        if (!el) continue;
        const band = WATERMARK_BANDS[i];
        const x = band.baseOffset + belowScroll * band.speed * band.dir;
        el.style.transform = `translate3d(${x.toFixed(1)}px, 0px, 0)`;
      }

      if (dispersedRayRef.current) {
        const y = Math.min(belowScroll * 0.22, 340);
        const angle = -22 + belowScroll * 0.02;
        dispersedRayRef.current.style.transform = `translate3d(-50%, ${y.toFixed(
          1
        )}px, 0) rotate(${angle.toFixed(1)}deg)`;
      }
    }

    function onScroll() {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateParallax);
      }
    }

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative z-10 overflow-hidden bg-[#051229]/50 backdrop-blur-md">
      {/* 1. Single Ultra-Dispersed Elliptical Sunlight Wash (No Visible Hard Edges, Zero Lag) */}
      <div
        ref={dispersedRayRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -top-32 z-0 h-[980px] w-[1600px] will-change-transform"
        style={{
          transform: "translate3d(-50%, 0px, 0) rotate(-22deg)",
          background:
            "radial-gradient(ellipse 48% 22% at 50% 50%, rgba(255,235,180,0.18) 0%, rgba(232,108,31,0.09) 38%, rgba(56,189,248,0.04) 68%, transparent 100%)",
        }}
      />

      {/* 2. 6 Gliding Watermark Text Bands Covering the Background */}
      {WATERMARK_BANDS.map((band, idx) => (
        <div
          key={band.top}
          ref={(el) => {
            bandRefs.current[idx] = el;
          }}
          aria-hidden="true"
          style={{ top: band.top }}
          className={`pointer-events-none absolute -left-32 z-0 select-none whitespace-nowrap font-display text-[4.25rem] font-semibold uppercase tracking-[0.16em] ${band.color} will-change-transform sm:text-[7rem] lg:text-[8.75rem]`}
        >
          {band.text}
        </div>
      ))}

      {/* Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Pure CSS Hover Lift Card (Zero JS pointermove listeners = zero lag).
 */
export function InteractiveTiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden transition-transform duration-200 ease-out hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
}
