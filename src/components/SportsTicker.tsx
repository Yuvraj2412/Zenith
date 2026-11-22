import { SPORTS } from "@/data/sports";

export function SportsTicker() {
  const items = SPORTS.map((sport) => {
    const prize =
      sport.categories.length === 1
        ? sport.categories[0].prizePoolDisplay
        : sport.categories.map((c) => c.prizePoolDisplay).join(" + ");
    return `${sport.name.toUpperCase()} · ${prize} PRIZE POOL*`;
  });

  const repeated = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-white/15 bg-[#051024] py-3 text-white">
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap hover:[animation-play-state:paused]">
        {repeated.map((text, idx) => (
          <span
            key={`${text}-${idx}`}
            className="inline-flex items-center gap-4 text-[11px] font-semibold tracking-[0.18em] text-slate-200"
          >
            <span className="h-1.5 w-1.5 rotate-45 bg-[#E86C1F]" />
            <span>{text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
