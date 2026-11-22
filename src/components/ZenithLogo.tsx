export function ZenithLogo({
  size = "md",
  showText = false,
  light = true,
}: {
  light?: boolean;
  size?: "md" | "lg";
  showText?: boolean;
}) {
  const isLg = size === "lg";
  return (
    <span className="group inline-flex items-center gap-3">
      {/* Official Uploaded Zenith Logo As-Is */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/zenith-logo.png"
        alt="ZENITH — IIST Sports Fest"
        className={`shrink-0 rounded-lg object-cover shadow-md ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-105 ${
          isLg ? "h-12 w-14" : "h-9 w-11 sm:h-10 sm:w-12"
        }`}
      />

      {showText && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-display text-lg font-medium tracking-tight ${
              light ? "text-white" : "text-[#061329]"
            }`}
          >
            ZENITH <span className="text-[#E86C1F]">2027</span>
          </span>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-200/80">
            Beyond the Horizon
          </span>
        </span>
      )}
    </span>
  );
}
