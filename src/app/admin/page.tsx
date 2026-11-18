import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { getAuthContext } from "@/lib/auth";
import { createClient, createServiceAdminClient } from "@/lib/supabase/server";
import type { AdminRegistrationRecord, Profile, Registration } from "@/types/database";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";

type RawJoinedRegistration = Registration & {
  profiles: Pick<
    Profile,
    | "id"
    | "email"
    | "full_name"
    | "phone"
    | "college"
    | "student_id"
    | "age"
    | "gender"
    | "city"
    | "state"
    | "aadhar_last4"
  > | null;
};

async function AdminContent() {
  const { configured, user, isAdmin } = await getAuthContext();

  if (!configured || !user) {
    redirect("/login?next=/admin");
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-slate-900">
            Admin Access Required
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Signed in as <strong>{user.email}</strong>, which does not currently
            have admin permissions.
          </p>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs text-slate-700 space-y-2">
            <p className="font-bold text-slate-900">
              How to grant yourself Admin access:
            </p>
            <p>Run this in your Supabase SQL Editor:</p>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] text-orange-300">
              {`UPDATE public.profiles SET role = 'admin' WHERE email = '${user.email}';`}
            </pre>
          </div>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const dbClient = createServiceAdminClient() ?? (await createClient());
  let initialRecords: AdminRegistrationRecord[] = [];

  if (dbClient) {
    const { data: rows } = await dbClient
      .from("registrations")
      .select(
        `
        *,
        profiles:user_id (
          id,
          email,
          full_name,
          phone,
          college,
          student_id,
          age,
          gender,
          city,
          state,
          aadhar_last4
        )
      `
      )
      .order("created_at", { ascending: false })
      .returns<RawJoinedRegistration[]>();

    if (rows && rows.length > 0) {
      initialRecords = await Promise.all(
        rows.map(async (row) => {
          const { data: signed } = await dbClient.storage
            .from("payment-screenshots")
            .createSignedUrl(row.payment_screenshot_path, 3600);

          const { profiles: profileData, ...rest } = row;
          return {
            ...rest,
            profile: profileData,
            screenshot_url: signed?.signedUrl ?? null,
          };
        })
      );
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-700">
            <ShieldCheck className="h-4 w-4 text-orange-500" />
            ZENITH 2027 Admin Console
          </span>
          <h1 className="mt-1 font-display text-3xl font-bold text-slate-900">
            Payment & Registration Verification
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Inspect uploaded payment screenshots and approve registrations to
            switch user status from <strong>Pending</strong> to{" "}
            <strong>Success</strong>.
          </p>
        </div>
      </div>

      <AdminDashboardClient initialRecords={initialRecords} />
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
          <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
