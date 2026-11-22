"use client";

import { useSyncExternalStore } from "react";
import { CalendarClock } from "lucide-react";

// Target: January 21, 2027 at 09:00 AM IST (Opening Ceremony)
const TARGET_TIMESTAMP_MS = new Date("2027-01-21T09:00:00+05:30").getTime();

function subscribeToClock(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 1000);
  return () => window.clearInterval(id);
}

function getClientSnapshot(): number {
  return Math.max(0, Math.floor((TARGET_TIMESTAMP_MS - Date.now()) / 1000));
}

function getServerSnapshot(): number {
  return -1;
}

export function CountdownTimer() {
  const remainingSec = useSyncExternalStore(
    subscribeToClock,
    getClientSnapshot,
    getServerSnapshot
  );

  const isReady = remainingSec >= 0;
  const days = isReady ? Math.floor(remainingSec / 86400) : 0;
  const hours = isReady ? Math.floor((remainingSec % 86400) / 3600) : 0;
  const minutes = isReady ? Math.floor((remainingSec % 3600) / 60) : 0;
  const seconds = isReady ? remainingSec % 60 : 0;

  const units = [
    { label: "Days", value: isReady ? String(days).padStart(2, "0") : "--" },
    { label: "Hours", value: isReady ? String(hours).padStart(2, "0") : "--" },
    { label: "Mins", value: isReady ? String(minutes).padStart(2, "0") : "--" },
    { label: "Secs", value: isReady ? String(seconds).padStart(2, "0") : "--" },
  ];

  return (
    <div
      className="animate-hero-rise mt-4 inline-flex flex-wrap items-center gap-3 rounded-lg border border-white/20 border-l-2 border-l-[#E86C1F] bg-[#06142E]/75 px-3.5 py-2.5 shadow-lg backdrop-blur-md sm:mt-5 sm:gap-4 sm:px-4"
      style={{ animationDelay: "260ms" }}
    >
      <div className="flex items-center gap-2 pr-1">
        <CalendarClock className="h-4 w-4 shrink-0 text-[#E86C1F]" />
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#E86C1F]">
            Jan 21, 2027
          </p>
          <p className="text-[11px] font-medium text-blue-100/85">
            Fest Kickoff
          </p>
        </div>
      </div>

      <div className="flex items-center divide-x divide-white/15 border-l border-white/15 pl-3 sm:pl-4">
        {units.map((u) => (
          <div
            key={u.label}
            className="px-2.5 text-center first:pl-0 last:pr-0 sm:px-3.5"
          >
            <p className="font-display text-xl font-medium tabular-nums leading-none text-white sm:text-2xl">
              {u.value}
            </p>
            <p className="mt-1 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#38BDF8]">
              {u.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
