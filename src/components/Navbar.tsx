import Link from "next/link";
import { Suspense } from "react";
import { ZenithLogo } from "./ZenithLogo";
import { NavbarAuth } from "./NavbarAuth";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0">
          <ZenithLogo />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/#sports" className="transition hover:text-blue-700">
            7 Sports
          </Link>
          <Link href="/#about" className="transition hover:text-blue-700">
            About IIST
          </Link>
          <Link href="/#contact" className="transition hover:text-blue-700">
            Contact
          </Link>
        </nav>

        <Suspense
          fallback={
            <div className="h-9 w-36 animate-pulse rounded-lg bg-slate-100" />
          }
        >
          <NavbarAuth />
        </Suspense>
      </div>
    </header>
  );
}
