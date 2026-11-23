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
  const dispersedRayRef = useRef<HTMLDivElement | null>(null);

  const sunLeft = `${Math.round(sunXRatio * 100)}%`;
  const sunTop = `${Math.round(sunYRatio * 100)}%`;

  useEffect(() => {
    let rafId = 0;

    function updateRay() {
      rafId = 0;
      if (!dispersedRayRef.current) return;
      const y = window.scrollY || 0;
      if (y > 1100) return;
      const angle = -24 + y * 0.055;
      const shiftY = y * 0.12;
      dispersedRayRef.current.style.transform = `translate3d(-50%, calc(-50% + ${shiftY.toFixed(
        1
      )}px), 0) rotate(${angle.toFixed(1)}deg)`;
    }

    function onScroll() {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateRay);
      }
    }

    updateRay();
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
      {/* 1. Soft Golden Sunlight Halo */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: sunLeft,
          top: sunTop,
          width: "min(78vw, 700px)",
          height: "min(78vw, 700px)",
          background:
            "radial-gradient(circle, rgba(255,248,220,0.42) 0%, rgba(255,155,45,0.18) 36%, rgba(232,108,31,0.05) 58%, transparent 75%)",
        }}
      />

      {/* 2. Single Ultra-Dispersed Sunlight Wash (Elliptical Radial Gradient — Zero Hard Edges, Zero Lag) */}
      <div
        ref={dispersedRayRef}
        className="absolute will-change-transform"
        style={{
          left: sunLeft,
          top: sunTop,
          width: "min(160vw, 1500px)",
          height: "min(90vw, 820px)",
          transform: "translate3d(-50%, -50%, 0) rotate(-24deg)",
          background:
            "radial-gradient(ellipse 50% 24% at 50% 50%, rgba(255,244,205,0.30) 0%, rgba(255,175,75,0.14) 38%, rgba(232,108,31,0.04) 68%, transparent 100%)",
        }}
      />

      {/* 3. 5 Lightweight Hardware-Accelerated CSS Drifting Feathers */}
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
