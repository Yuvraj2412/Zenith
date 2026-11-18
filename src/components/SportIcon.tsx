import type { ReactNode } from "react";

const SPORT_GLYPHS: Record<string, ReactNode> = {
  football: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7l3.5 2.5-1.3 4h-4.4l-1.3-4L12 7z" />
      <path d="M12 3v4M20.5 9.5l-5 1.5M17.5 19.5l-3.3-3M6.5 19.5l3.3-3M3.5 9.5l5 1.5" />
    </svg>
  ),
  cricket: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4.5l5 5-9.5 9.5-3.5 1.5 1.5-3.5 6.5-12.5z" />
      <path d="M5 19l-2 2" />
      <circle cx="18" cy="18" r="2.5" />
    </svg>
  ),
  basketball: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9h16.8M3.6 15h16.8M12 3v18" />
    </svg>
  ),
  volleyball: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12c0-4.5 2.5-7.5 6-8.3M12 12c-4 2.2-5.5 6-4.2 9.2M12 12c4 2.2 7.5 1.5 9-1.5" />
    </svg>
  ),
  chess: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5h6l-1 4h3l-1.5 7H8.5L7 9h3L9 5z" />
      <path d="M12 2v3M7 19h10M6 21h12" />
    </svg>
  ),
  badminton: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="14.5" cy="9.5" rx="4.5" ry="6" transform="rotate(45 14.5 9.5)" />
      <path d="M10 14l-6 6M7 17l-1.5 1.5" />
    </svg>
  ),
  "table-tennis": (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="10" r="6" />
      <path d="M6.5 14.5L3 18l3 3 3.5-3.5" />
      <circle cx="19" cy="16" r="2.2" />
    </svg>
  ),
};

export function SportIcon({ slug }: { slug: string }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-950 text-orange-400 shadow-sm">
      {SPORT_GLYPHS[slug] ?? SPORT_GLYPHS.football}
    </div>
  );
}
