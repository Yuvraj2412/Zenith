import Link from "next/link";
import { Suspense } from "react";
import { ZenithLogo } from "./ZenithLogo";
import { NavbarAuth } from "./NavbarAuth";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-blue-950/10 bg-[#F5F7FB]/80 shadow-sm shadow-blue-950/5 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
        <Link href="/" className="shrink-0">
          <ZenithLogo />
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-8 md:flex"
        >
          <Link
            href="/#sports"
            className="label relative py-2 text-[#091930]/80 transition-colors duration-300 hover:text-[#D9531E]"
          >
            Tournaments
          </Link>
          <Link
            href="/#about"
            className="label relative py-2 text-[#091930]/80 transition-colors duration-300 hover:text-[#16408B]"
          >
            About IIST
          </Link>
          <Link
            href="/#contact"
            className="label relative py-2 text-[#091930]/80 transition-colors duration-300 hover:text-[#D9531E]"
          >
            Contact
          </Link>
        </nav>

        <Suspense
          fallback={
            <div className="h-9 w-32 animate-pulse rounded-md bg-blue-950/10" />
          }
        >
          <NavbarAuth />
        </Suspense>
      </div>

      {/* Mobile Navigation Strip */}
      <nav
        aria-label="Mobile"
        className="flex items-center justify-around border-t border-blue-950/10 bg-white/70 px-4 py-2 backdrop-blur-sm md:hidden"
      >
        <Link
          href="/#sports"
          className="label !text-[0.65rem] text-[#091930]/80 hover:text-[#D9531E]"
        >
          Tournaments
        </Link>
        <Link
          href="/#about"
          className="label !text-[0.65rem] text-[#091930]/80 hover:text-[#16408B]"
        >
          About IIST
        </Link>
        <Link
          href="/#contact"
          className="label !text-[0.65rem] text-[#091930]/80 hover:text-[#D9531E]"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
