"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, ShieldCheck, UserCheck, AlertCircle, ClipboardCheck } from "lucide-react";
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
        className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
      >
        Sign in with Google
      </Link>
    );
  }

  const displayName = fullName?.trim() || userEmail.split("@")[0];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isAdmin && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 transition hover:bg-blue-100"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-blue-700" />
          Admin
        </Link>
      )}

      {profileCompleted ? (
        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600"
        >
          <ClipboardCheck className="h-3.5 w-3.5" />
          Register Sport
        </Link>
      ) : (
        <Link
          href="/profile?onboarding=1"
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-600"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          Complete Profile
        </Link>
      )}

      <Link
        href="/profile"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-5 w-5 rounded-full object-cover"
          />
        ) : (
          <UserCheck className="h-4 w-4 text-blue-700" />
        )}
        <span className="max-w-[120px] truncate">{displayName}</span>
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        title="Sign out"
        className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
