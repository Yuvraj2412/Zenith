export function ZenithLogo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        width="36"
        height="36"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <rect
          width="40"
          height="40"
          rx="10"
          fill={light ? "#1E3A8A" : "#0A1D37"}
        />
        <path
          d="M9 28L20 12L26 20L31 14"
          stroke="#3B82F6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="25" cy="11" r="3" fill="#F97316" />
        <path
          d="M14 29L21 18.5L26.5 23L22.5 30"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 16H24.5"
          stroke="#F97316"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-lg font-bold tracking-tight ${
            light ? "text-white" : "text-slate-900"
          }`}
        >
          ZENITH <span className="text-orange-500">2027</span>
        </span>
        <span
          className={`text-[10px] font-semibold uppercase tracking-widest ${
            light ? "text-blue-200" : "text-blue-700"
          }`}
        >
          IIST Sports Fest
        </span>
      </span>
    </span>
  );
}
