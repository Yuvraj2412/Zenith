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
      {/* Official Uploaded Zenith Logo — Transparent Background, True Aspect Ratio, No Distortion */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/zenith-logo.png"
        alt="ZENITH — IIST Sports Fest"
        className={`shrink-0 object-contain p-0.5 transition-transform duration-300 group-hover:scale-105 ${
          isLg ? "h-12 w-auto" : "h-9 w-auto sm:h-10"
        }`}
      />

      {showText && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-display text-base font-bold tracking-wider ${
              light ? "text-white" : "text-[#061329]"
            }`}
          >
            ZENITH <span className="text-[#E86C1F]">2027</span>
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-200/80">
            Beyond the Horizon
          </span>
        </span>
      )}
    </span>
  );
}
