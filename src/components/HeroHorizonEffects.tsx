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
  const sunLeft = `${Math.round(sunXRatio * 100)}%`;
  const sunTop = `${Math.round(sunYRatio * 100)}%`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Lightweight Static Golden Sunlight Core (Zero JS CPU/GPU cost) */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: sunLeft,
          top: sunTop,
          width: "min(75vw, 680px)",
          height: "min(75vw, 680px)",
          background:
            "radial-gradient(circle, rgba(255,245,210,0.45) 0%, rgba(255,150,40,0.22) 35%, transparent 70%)",
        }}
      />

      {/* 5 Lightweight Hardware-Accelerated CSS Drifting Feathers */}
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
