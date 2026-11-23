"use client";

import { useEffect, useRef, type ReactNode } from "react";

const WATERMARK_BANDS = [
  {
    top: "3%",
    dir: 1,
    speed: 0.26,
    baseOffset: -220,
    color: "text-white/[0.045]",
    text: "BEYOND THE HORIZON • ZENITH 2027 • IIST SPORTS CHAMPIONSHIP • BEYOND THE HORIZON • ZENITH 2027",
  },
  {
    top: "17%",
    dir: -1,
    speed: 0.22,
    baseOffset: 160,
    color: "text-[#FDBA74]/[0.045]",
    text: "FOOTBALL • CRICKET • BASKETBALL • VOLLEYBALL • BADMINTON • TABLE TENNIS • CHESS • ZENITH 2027",
  },
  {
    top: "31%",
    dir: 1,
    speed: 0.24,
    baseOffset: -260,
    color: "text-[#38BDF8]/[0.045]",
    text: "IIST THIRUVANANTHAPURAM • DEPARTMENT OF SPACE • ANNUAL INTER-COLLEGE SPORTS FEST • ZENITH 2027",
  },
  {
    top: "46%",
    dir: -1,
    speed: 0.28,
    baseOffset: 200,
    color: "text-white/[0.04]",
    text: "CHAMPIONSHIP ARENA • ₹3,62,500 PRIZE POOL • LEAGUE & KNOCKOUT • BEYOND THE HORIZON • ZENITH 2027",
  },
  {
    top: "61%",
    dir: 1,
    speed: 0.23,
    baseOffset: -180,
    color: "text-[#FDBA74]/[0.045]",
    text: "VALIAMALA CAMPUS • KERALA • ATHLETIC EXCELLENCE • ONE CAPTAIN REGISTRATION • TEAM ID PORTAL",
  },
  {
    top: "76%",
    dir: -1,
    speed: 0.25,
    baseOffset: 190,
    color: "text-[#38BDF8]/[0.045]",
    text: "BEYOND THE HORIZON • ZENITH 2027 • IIST THIRUVANANTHAPURAM • INTER-COLLEGE TOURNAMENTS",
  },
  {
    top: "90%",
    dir: 1,
    speed: 0.21,
    baseOffset: -210,
    color: "text-white/[0.04]",
    text: "JANUARY 21, 2027 • KICKOFF AT IIST • COMPETE BEYOND THE HORIZON • ZENITH 2027 CHAMPIONSHIPS",
  },
];

/**
 * Interactive Below-the-Fold Parallax Stage for the Main Home Page:
 * - 7 Full-Background Kinetic Watermark Text Bands moving horizontally on scroll
 * - Natural Volumetric Sun Rays rotating and sweeping across the background on scroll
 */
export function HomeBelowFoldParallax({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const bandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sunRaysPrimaryRef = useRef<HTMLDivElement | null>(null);
  const sunRaysSecondaryRef = useRef<HTMLDivElement | null>(null);
  const diagonalSunShaftsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId = 0;
    let scrollY = window.scrollY || 0;

    function updateParallax() {
      rafId = 0;
      const vh = window.innerHeight || 800;
      const belowScroll = Math.max(0, scrollY - vh * 0.2);

      // 1. Move all 7 background typography bands across the entire background
      for (let i = 0; i < WATERMARK_BANDS.length; i++) {
        const el = bandRefs.current[i];
        if (!el) continue;
        const band = WATERMARK_BANDS[i];
        const x = band.baseOffset + belowScroll * band.speed * band.dir;
        el.style.transform = `translate3d(${x.toFixed(1)}px, 0px, 0)`;
      }

      // 2. Rotate & sweep natural golden sun rays across the below-the-fold background on scroll
      if (sunRaysPrimaryRef.current) {
        const angle = -16 + belowScroll * 0.085;
        const shiftY = Math.min(belowScroll * 0.18, 320);
        sunRaysPrimaryRef.current.style.transform = `translate3d(-50%, ${shiftY.toFixed(
          1
        )}px, 0) rotate(${angle.toFixed(2)}deg)`;
      }

      if (sunRaysSecondaryRef.current) {
        const angle = 22 - belowScroll * 0.065;
        const shiftY = Math.min(belowScroll * 0.14, 260);
        sunRaysSecondaryRef.current.style.transform = `translate3d(-50%, ${shiftY.toFixed(
          1
        )}px, 0) rotate(${angle.toFixed(2)}deg)`;
      }

      if (diagonalSunShaftsRef.current) {
        const shiftX = -180 + ((belowScroll * 0.32) % 420);
        const shiftY = (belowScroll * 0.12) % 240;
        const tilt = -14 + Math.sin(belowScroll * 0.002) * 8;
        diagonalSunShaftsRef.current.style.transform = `translate3d(${shiftX.toFixed(
          1
        )}px, ${shiftY.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
      }
    }

    function onScroll() {
      scrollY = window.scrollY || 0;
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateParallax);
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      stageRef.current.style.setProperty("--spot-x", `${x.toFixed(0)}px`);
      stageRef.current.style.setProperty("--spot-y", `${y.toFixed(0)}px`);
    }

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative overflow-hidden"
      style={
        {
          "--spot-x": "50%",
          "--spot-y": "30%",
        } as React.CSSProperties
      }
    >
      {/* 1. Primary Volumetric Sun Rays Rotating Across Below-the-Fold Background on Scroll */}
      <div
        ref={sunRaysPrimaryRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -top-72 z-0 h-[1900px] w-[1900px] rounded-full opacity-80 blur-xl will-change-transform"
        style={{
          transform: "translate3d(-50%, 0px, 0)",
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,232,175,0.34) 12deg, transparent 28deg, rgba(232,108,31,0.26) 46deg, transparent 66deg, rgba(255,242,195,0.36) 86deg, transparent 108deg, rgba(56,189,248,0.20) 130deg, transparent 152deg, rgba(255,235,180,0.34) 174deg, transparent 198deg, rgba(232,108,31,0.28) 220deg, transparent 244deg, rgba(255,240,190,0.36) 268deg, transparent 292deg, rgba(255,185,85,0.26) 316deg, transparent 340deg, rgba(255,238,185,0.30) 352deg, transparent 360deg)",
          WebkitMaskImage:
            "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0) 76%)",
          maskImage:
            "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0) 76%)",
        }}
      />

      {/* 2. Secondary Counter-Rotating Sunburst Rays Centered Mid-Page */}
      <div
        ref={sunRaysSecondaryRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[28%] z-0 h-[1800px] w-[1800px] rounded-full opacity-70 blur-2xl will-change-transform"
        style={{
          transform: "translate3d(-50%, 0px, 0)",
          background:
            "conic-gradient(from 20deg at 50% 50%, transparent 0deg, rgba(255,225,155,0.28) 16deg, transparent 38deg, rgba(56,189,248,0.18) 64deg, transparent 92deg, rgba(255,238,185,0.32) 120deg, transparent 148deg, rgba(232,108,31,0.24) 178deg, transparent 208deg, rgba(255,240,190,0.30) 240deg, transparent 272deg, rgba(255,190,90,0.24) 306deg, transparent 338deg, rgba(255,235,180,0.28) 352deg, transparent 360deg)",
          WebkitMaskImage:
            "radial-gradient(circle, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 48%, rgba(0,0,0,0) 78%)",
          maskImage:
            "radial-gradient(circle, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 48%, rgba(0,0,0,0) 78%)",
        }}
      />

      {/* 3. Sweeping Diagonal Sunlight Shafts Gliding Across the Whole Background on Scroll */}
      <div
        ref={diagonalSunShaftsRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-48 z-0 opacity-65 blur-xl will-change-transform"
        style={{
          background:
            "repeating-linear-gradient(112deg, transparent 0px, transparent 110px, rgba(255,232,175,0.16) 150px, rgba(232,108,31,0.13) 195px, rgba(56,189,248,0.08) 235px, transparent 290px)",
        }}
      />

      {/* 4. Interactive Cursor Sunlight Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(600px circle at var(--spot-x) var(--spot-y), rgba(232, 108, 31, 0.16), rgba(56, 189, 248, 0.08) 42%, transparent 75%)",
        }}
      />

      {/* 5. 7 Full-Background Gliding Watermark Text Bands Covering Top to Bottom */}
      {WATERMARK_BANDS.map((band, idx) => (
        <div
          key={band.top}
          ref={(el) => {
            bandRefs.current[idx] = el;
          }}
          aria-hidden="true"
          style={{ top: band.top }}
          className={`pointer-events-none absolute -left-36 z-0 select-none whitespace-nowrap font-display text-[4.5rem] font-semibold uppercase tracking-[0.18em] ${band.color} will-change-transform sm:text-[7.5rem] lg:text-[9.5rem]`}
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
 * Interactive 3D-Tilt & Cursor-Spotlight Card for Below-the-Fold Sections.
 */
export function InteractiveTiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    const rotX = (relY * -7).toFixed(2);
    const rotY = (relX * 7).toFixed(2);
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    el.style.setProperty("--card-x", `${(e.clientX - rect.left).toFixed(0)}px`);
    el.style.setProperty("--card-y", `${(e.clientY - rect.top).toFixed(0)}px`);
  }

  function handlePointerLeave() {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  }

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`group relative overflow-hidden transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={
        {
          "--card-x": "50%",
          "--card-y": "50%",
        } as React.CSSProperties
      }
    >
      {/* Local Interactive Spotlight inside the Card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--card-x) var(--card-y), rgba(232,108,31,0.18), rgba(56,189,248,0.08) 50%, transparent 80%)",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
