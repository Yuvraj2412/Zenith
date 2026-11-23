"use client";

import { useEffect, useRef } from "react";

const FEATHERS = [
  { left: "12%", delay: "0s", duration: "14s", size: 22 },
  { left: "28%", delay: "3s", duration: "16s", size: 18 },
  { left: "48%", delay: "1.5s", duration: "15s", size: 24 },
  { left: "66%", delay: "4.5s", duration: "17s", size: 19 },
  { left: "82%", delay: "2s", duration: "15s", size: 21 },
];

export function HeroHorizonEffects({
  sunXRatio = 0.29,
  sunYRatio = 0.51,
}: {
  sunXRatio?: number;
  sunYRatio?: number;
} = {}) {
  const primaryRaysRef = useRef<HTMLDivElement | null>(null);
  const secondaryRaysRef = useRef<HTMLDivElement | null>(null);
  const sweepingShaftsRef = useRef<HTMLDivElement | null>(null);
  const flareCoreRef = useRef<HTMLDivElement | null>(null);

  const sunLeft = `${Math.round(sunXRatio * 100)}%`;
  const sunTop = `${Math.round(sunYRatio * 100)}%`;

  useEffect(() => {
    let rafId = 0;

    function updateSunrays() {
      rafId = 0;
      const y = window.scrollY || 0;

      // Visibly rotate and fan out natural golden sunbeams as the user scrolls
      if (primaryRaysRef.current) {
        const angle = -10 + y * 0.14;
        const scale = 1 + Math.min(y * 0.0007, 0.45);
        const shiftY = Math.min(y * 0.18, 160);
        primaryRaysRef.current.style.transform = `translate3d(-50%, calc(-50% + ${shiftY.toFixed(
          1
        )}px), 0) rotate(${angle.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      }

      if (secondaryRaysRef.current) {
        const angle = 18 - y * 0.1;
        const scale = 1 + Math.min(y * 0.0005, 0.35);
        const shiftY = Math.min(y * 0.14, 130);
        secondaryRaysRef.current.style.transform = `translate3d(-50%, calc(-50% + ${shiftY.toFixed(
          1
        )}px), 0) rotate(${angle.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      }

      if (sweepingShaftsRef.current) {
        const shiftX = (y * 0.28) % 360;
        const tilt = -18 + y * 0.035;
        sweepingShaftsRef.current.style.transform = `translate3d(${shiftX.toFixed(
          1
        )}px, 0px, 0) rotate(${tilt.toFixed(2)}deg) scale(1.35)`;
      }

      if (flareCoreRef.current) {
        const shiftY = Math.min(y * 0.14, 130);
        const scale = 1 + Math.min(y * 0.0006, 0.42);
        flareCoreRef.current.style.transform = `translate3d(-50%, calc(-50% + ${shiftY.toFixed(
          1
        )}px), 0) scale(${scale.toFixed(3)})`;
      }
    }

    function onScroll() {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateSunrays);
      }
    }

    updateSunrays();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* 1. Warm Golden Sun Core (Expands on Scroll) */}
      <div
        ref={flareCoreRef}
        className="absolute rounded-full will-change-transform"
        style={{
          left: sunLeft,
          top: sunTop,
          width: "min(88vw, 780px)",
          height: "min(88vw, 780px)",
          transform: "translate3d(-50%, -50%, 0)",
          background:
            "radial-gradient(circle, rgba(255,252,230,0.62) 0%, rgba(255,175,65,0.34) 30%, rgba(232,108,31,0.14) 54%, transparent 74%)",
        }}
      />

      {/* 2. Primary Natural Volumetric Sunbeams (Clearly Defined Golden Light Shafts Rotating on Scroll) */}
      <div
        ref={primaryRaysRef}
        className="absolute rounded-full opacity-90 blur-md will-change-transform"
        style={{
          left: sunLeft,
          top: sunTop,
          width: "min(175vw, 1680px)",
          height: "min(175vw, 1680px)",
          transform: "translate3d(-50%, -50%, 0)",
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,240,185,0.46) 10deg, transparent 24deg, rgba(255,185,80,0.34) 42deg, transparent 60deg, rgba(255,246,205,0.50) 78deg, transparent 98deg, rgba(255,175,65,0.34) 118deg, transparent 138deg, rgba(255,240,190,0.44) 158deg, transparent 180deg, rgba(255,190,85,0.36) 200deg, transparent 222deg, rgba(255,245,200,0.48) 244deg, transparent 266deg, rgba(255,180,75,0.34) 288deg, transparent 310deg, rgba(255,242,195,0.46) 332deg, transparent 360deg)",
          WebkitMaskImage:
            "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0.82) 38%, rgba(0,0,0,0) 72%)",
          maskImage:
            "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0.82) 38%, rgba(0,0,0,0) 72%)",
        }}
      />

      {/* 3. Secondary Counter-Rotating Atmospheric Sunbeams */}
      <div
        ref={secondaryRaysRef}
        className="absolute rounded-full opacity-75 blur-lg will-change-transform"
        style={{
          left: sunLeft,
          top: sunTop,
          width: "min(160vw, 1480px)",
          height: "min(160vw, 1480px)",
          transform: "translate3d(-50%, -50%, 0)",
          background:
            "conic-gradient(from 18deg at 50% 50%, transparent 0deg, rgba(255,220,145,0.36) 16deg, transparent 38deg, rgba(56,189,248,0.20) 64deg, transparent 90deg, rgba(255,235,175,0.40) 118deg, transparent 146deg, rgba(232,108,31,0.30) 176deg, transparent 206deg, rgba(255,242,195,0.38) 238deg, transparent 268deg, rgba(255,195,95,0.32) 302deg, transparent 334deg, rgba(255,238,185,0.34) 350deg, transparent 360deg)",
          WebkitMaskImage:
            "radial-gradient(circle, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 44%, rgba(0,0,0,0) 74%)",
          maskImage:
            "radial-gradient(circle, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 44%, rgba(0,0,0,0) 74%)",
        }}
      />

      {/* 4. Diagonal Sweeping Sunlight Shafts that Glide Across the Screen on Scroll */}
      <div
        ref={sweepingShaftsRef}
        className="absolute -inset-32 opacity-55 blur-xl will-change-transform"
        style={{
          background:
            "repeating-linear-gradient(108deg, transparent 0px, transparent 90px, rgba(255,232,175,0.18) 125px, rgba(232,108,31,0.12) 165px, transparent 210px)",
        }}
      />

      {/* 5. 5 Lightweight Hardware-Accelerated CSS Drifting Feathers */}
      {FEATHERS.map((f, idx) => (
        <svg
          key={idx}
          width={f.size}
          height={f.size}
          viewBox="0 0 32 16"
          fill="none"
          style={{
            left: f.left,
            animationDelay: f.delay,
            animationDuration: f.duration,
          }}
          className="animate-feather-fall absolute -top-8 opacity-60"
        >
          <path
            d="M2 8C9 2.5 20 2.5 30 8C21 13.5 10 12.5 4 9.5Z"
            fill="rgba(255, 236, 195, 0.75)"
          />
          <path
            d="M0 8.5Q15 7 29 8"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="1.1"
          />
        </svg>
      ))}
    </div>
  );
}
