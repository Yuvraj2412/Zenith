"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Interactive Below-the-Fold Parallax & Cursor Spotlight Stage for the Home Page.
 * Uses a single passive scroll + pointermove listener updating CSS variables and
 * translate3d transforms directly on DOM refs (zero React re-renders, 60fps).
 */
export function HomeBelowFoldParallax({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const watermarkOneRef = useRef<HTMLDivElement | null>(null);
  const watermarkTwoRef = useRef<HTMLDivElement | null>(null);
  const orbitRingRef = useRef<HTMLDivElement | null>(null);
  const trackLinesRef = useRef<HTMLDivElement | null>(null);
  const sunOrbRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId = 0;
    let scrollY = window.scrollY || 0;

    function updateParallax() {
      rafId = 0;
      const vh = window.innerHeight || 800;
      // Progress after scrolling past the first hero viewport
      const belowScroll = Math.max(0, scrollY - vh * 0.35);

      if (watermarkOneRef.current) {
        const x = -120 + belowScroll * 0.22;
        const y = belowScroll * -0.12;
        watermarkOneRef.current.style.transform = `translate3d(${x.toFixed(
          1
        )}px, ${y.toFixed(1)}px, 0)`;
      }

      if (watermarkTwoRef.current) {
        const x = 140 - belowScroll * 0.2;
        const y = belowScroll * -0.15;
        watermarkTwoRef.current.style.transform = `translate3d(${x.toFixed(
          1
        )}px, ${y.toFixed(1)}px, 0)`;
      }

      if (orbitRingRef.current) {
        const y = belowScroll * -0.24;
        const rot = belowScroll * 0.035;
        orbitRingRef.current.style.transform = `translate3d(-50%, ${y.toFixed(
          1
        )}px, 0) rotate(${rot.toFixed(2)}deg)`;
      }

      if (trackLinesRef.current) {
        const y = belowScroll * -0.18;
        trackLinesRef.current.style.transform = `translate3d(0, ${y.toFixed(
          1
        )}px, 0)`;
      }

      if (sunOrbRef.current) {
        const y = belowScroll * 0.16;
        const x = Math.sin(belowScroll * 0.0025) * 90;
        sunOrbRef.current.style.transform = `translate3d(${x.toFixed(
          1
        )}px, ${y.toFixed(1)}px, 0)`;
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
      {/* 1. Fixed-Attachment Atmospheric Space & Stadium Horizon Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 22%, rgba(232,108,31,0.16) 0%, transparent 45%), radial-gradient(circle at 85% 58%, rgba(56,189,248,0.16) 0%, transparent 48%), radial-gradient(circle at 50% 88%, rgba(232,108,31,0.12) 0%, transparent 50%)",
        }}
      />

      {/* 2. Interactive Cursor Spotlight Following Mouse Across Below-the-Fold Sections */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(560px circle at var(--spot-x) var(--spot-y), rgba(232, 108, 31, 0.15), rgba(56, 189, 248, 0.08) 42%, transparent 75%)",
        }}
      />

      {/* 3. Architectural Blueprint Grid + Diagonal Horizon Rays */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* 4. Parallax Gliding Watermark Typography #1 (Moves Left -> Right on Scroll) */}
      <div
        ref={watermarkOneRef}
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-28 z-0 select-none whitespace-nowrap font-display text-[5.5rem] font-semibold uppercase tracking-[0.18em] text-white/[0.035] will-change-transform sm:text-[9rem] lg:text-[11.5rem]"
      >
        BEYOND THE HORIZON • ZENITH 2027
      </div>

      {/* 5. Parallax Gliding Watermark Typography #2 (Moves Right -> Left on Scroll) */}
      <div
        ref={watermarkTwoRef}
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-[54%] z-0 select-none whitespace-nowrap font-display text-[5.5rem] font-semibold uppercase tracking-[0.18em] text-[#38BDF8]/[0.04] will-change-transform sm:text-[9rem] lg:text-[11.5rem]"
      >
        IIST THIRUVANANTHAPURAM • SPORTS ARENA
      </div>

      {/* 6. Parallax Gliding Golden Sun Orb */}
      <div
        ref={sunOrbRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-[12%] top-44 z-0 h-[420px] w-[420px] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(232,108,31,0.20) 0%, rgba(255,210,130,0.08) 42%, transparent 72%)",
        }}
      />

      {/* 7. Parallax Rotating Orbital Compass & Stadium Track Geometry */}
      <div
        ref={orbitRingRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[22%] z-0 h-[820px] w-[820px] will-change-transform"
        style={{ transform: "translate3d(-50%, 0px, 0)" }}
      >
        <svg viewBox="0 0 800 800" className="h-full w-full opacity-25" fill="none">
          <circle
            cx="400"
            cy="400"
            r="360"
            stroke="rgba(232,108,31,0.45)"
            strokeWidth="1.2"
            strokeDasharray="8 14"
          />
          <circle
            cx="400"
            cy="400"
            r="285"
            stroke="rgba(56,189,248,0.4)"
            strokeWidth="1"
          />
          <circle
            cx="400"
            cy="400"
            r="205"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.9"
            strokeDasharray="3 10"
          />
          <path
            d="M40 400 H760 M400 40 V760"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.8"
          />
        </svg>
      </div>

      {/* 8. Parallax Stadium Track Curves Across Lower Section */}
      <div
        ref={trackLinesRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[46%] z-0 h-[900px] will-change-transform"
      >
        <svg
          viewBox="0 0 1440 900"
          className="h-full w-full opacity-25"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M-120 740 C 360 440, 1080 440, 1560 740"
            stroke="rgba(232,108,31,0.5)"
            strokeWidth="1.5"
          />
          <path
            d="M-120 790 C 360 490, 1080 490, 1560 790"
            stroke="rgba(56,189,248,0.4)"
            strokeWidth="1.2"
            strokeDasharray="10 12"
          />
          <path
            d="M-120 840 C 360 540, 1080 540, 1560 840"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1"
          />
        </svg>
      </div>

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
