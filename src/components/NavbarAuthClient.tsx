"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  ClipboardCheck,
  LogOut,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  configured: boolean;
  userEmail: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  profileCompleted: boolean;
  isAdmin: boolean;
};

export function NavbarAuthClient({
  configured,
  userEmail,
  fullName,
  avatarUrl,
  profileCompleted,
  isAdmin,
}: Props) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (!configured) return;
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
    setSigningOut(false);
  }

  if (!userEmail) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center rounded-lg bg-[#E86C1F] px-3 py-1.5 text-xs font-semibold tracking-wide text-white shadow-sm transition hover:bg-[#D15B13] sm:px-4 sm:py-2"
      >
        Sign in
      </Link>
    );
  }

  const displayName = fullName?.trim() || userEmail.split("@")[0];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {isAdmin && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-blue-100 transition hover:bg-white/20"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-[#FDBA74]" />
          <span className="hidden sm:inline">Admin</span>
        </Link>
      )}

      {profileCompleted ? (
        <Link
          href="/register"
          className="hidden items-center gap-1.5 rounded-lg bg-[#E86C1F] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#D15B13] md:inline-flex"
        >
          <ClipboardCheck className="h-3.5 w-3.5" />
          Register
        </Link>
      ) : (
        <Link
          href="/profile?onboarding=1"
          className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Complete</span> Profile
        </Link>
      )}

      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2 py-1.5 text-xs font-semibold text-white transition hover:border-[#FDBA74]/60 hover:bg-white/15 sm:px-2.5"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-5 w-5 rounded-full object-cover"
          />
        ) : (
          <UserCheck className="h-3.5 w-3.5 text-[#FDBA74]" />
        )}
        <span className="max-w-[68px] truncate sm:max-w-[110px]">
          {displayName}
        </span>
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        title="Sign out"
        className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 p-1.5 text-blue-200 transition hover:border-red-400/40 hover:bg-red-500/20 hover:text-red-200 cursor-pointer disabled:opacity-50"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
