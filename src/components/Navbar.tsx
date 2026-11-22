import Link from "next/link";
import { Suspense } from "react";
import { ZenithLogo } from "./ZenithLogo";
import { NavbarAuth } from "./NavbarAuth";
import { NavMenuDrawerButton } from "./NavMenuClient";
import { NavScrollFill } from "./NavScrollFill";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-2.5 z-40 px-2.5 sm:top-3.5 sm:px-6">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 rounded-xl border border-white/20 bg-[#061329]/75 px-3 shadow-lg backdrop-blur-md sm:h-16 sm:gap-4 sm:px-5">
        <NavScrollFill />

        <Link href="/" className="relative z-10 shrink-0" aria-label="ZENITH Home">
          <ZenithLogo />
        </Link>

        <div className="relative z-10 flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <Suspense
            fallback={
              <div className="h-8 w-20 animate-pulse rounded-lg bg-white/15" />
            }
          >
            <NavbarAuth />
          </Suspense>

          <NavMenuDrawerButton />
        </div>
      </div>
    </header>
  );
}
