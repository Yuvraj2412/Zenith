"use client";

import { useEffect, useRef } from "react";

export function NavScrollFill() {
  const lineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId = 0;

    function update() {
      const scrollTop = window.scrollY;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));

      if (lineRef.current) {
        lineRef.current.style.transform = `scaleX(${progress})`;
      }

      rafId = 0;
    }

    function onScroll() {
      if (!rafId) {
        rafId = requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
    >
      {/* Glowing bottom scroll-progress line inside the navbar */}
      <div
        ref={lineRef}
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-[#2563EB] via-[#F97316] to-[#FDBA74] will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
