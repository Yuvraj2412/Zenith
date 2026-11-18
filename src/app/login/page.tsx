import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AlertTriangle, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { getAuthContext } from "@/lib/auth";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

function sanitizeNextPath(raw?: string | string[]): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/profile";
  }
  return value;
}

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const nextPath = sanitizeNextPath(params.next);
  const authError = params.error;

  const { configured, user, profile } = await getAuthContext();

  if (user) {
    if (!profile?.profile_completed) {
      redirect(
        nextPath && nextPath !== "/profile"
          ? `/profile?onboarding=1&next=${encodeURIComponent(nextPath)}`
          : "/profile?onboarding=1"
      );
    }
    redirect(nextPath);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-14 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
          <Lock className="h-3.5 w-3.5" />
          ZENITH 2027 Participant Portal
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold text-slate-900">
          Sign in with Google
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Create your athlete profile in one minute to register for any of the 7
          IIST ZENITH sports and upload your payment screenshot.
        </p>

        {!configured && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div className="space-y-1.5">
                <p className="font-bold">Supabase setup required</p>
                <p>
                  Copy <code className="rounded bg-amber-100 px-1 py-0.5">.env.local.example</code> to{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5">.env.local</code>, add your{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> &{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and run{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5">supabase/schema.sql</code>.
                </p>
              </div>
            </div>
          </div>
        )}

        {authError && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
            Sign-in error: {authError}
          </div>
        )}

        <div className="mt-6">
          <GoogleSignInButton
            configured={configured}
            nextPath={nextPath}
            className="w-full border border-slate-300 bg-white px-5 py-3.5 text-sm text-slate-800 shadow-xs hover:border-blue-400 hover:bg-slate-50"
          />
        </div>

        <div className="mt-7 space-y-3 border-t border-slate-100 pt-6 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
            <span>
              <strong>First-time users:</strong> You&apos;ll be asked to fill
              in your college & player details before registering.
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-orange-500" />
            <span>
              <strong>Without login:</strong> You can browse all 7 sports on the
              home page anytime.
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/#sports"
            className="text-xs font-semibold text-blue-700 hover:underline"
          >
            ← Back to Browse 7 Sports
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage(props: PageProps<"/login">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-16">
          <div className="h-96 animate-pulse rounded-3xl bg-slate-200" />
        </div>
      }
    >
      <LoginContent searchParams={props.searchParams} />
    </Suspense>
  );
}
