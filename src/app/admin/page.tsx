import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { getAuthContext } from "@/lib/auth";
import { createClient, createServiceAdminClient } from "@/lib/supabase/server";
import type {
  AdminRegistrationRecord,
  PaymentStatus,
  Profile,
  Registration,
} from "@/types/database";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";

type RpcAdminRegistrationRow = {
  id: string;
  user_id: string;
  sport_slug: string;
  sport_name: string;
  category_id: string;
  category_label: string;
  team_name: string;
  squad_count: number;
  player_names: string;
  accommodation_required: boolean;
  accommodation_players: number;
  amount_inr: number;
  utr_number: string;
  payment_screenshot_path: string;
  payment_status: PaymentStatus;
  admin_note: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  profile_email: string;
  profile_full_name: string;
  profile_phone: string;
  profile_college: string;
  profile_student_id: string;
  profile_age: number | null;
  profile_gender: string;
  profile_city: string;
  profile_state: string;
  profile_aadhar_last4: string;
};

type ProfileSummary = Pick<
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
>;

async function AdminContent() {
  const { configured, user, profile, isAdmin, dbRoleIsAdmin } =
    await getAuthContext();

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
          <div className="mt-5 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs text-slate-700">
            <p className="font-bold text-slate-900">
              How to grant yourself Admin access:
            </p>
            <p>Run this in your Supabase SQL Editor:</p>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] text-orange-300">
              {`UPDATE public.profiles SET role = 'admin' WHERE lower(email) = lower('${user.email}');`}
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
  let initialAdmins: {
    id: string;
    email: string;
    full_name: string;
    role: string;
  }[] = [];
  let queryError: string | null = null;

  if (dbClient) {
    const { data: adminRows } = await dbClient
      .from("profiles")
      .select("id, email, full_name, role")
      .eq("role", "admin")
      .order("created_at", { ascending: true });
    if (adminRows) {
      initialAdmins = adminRows;
    }

    // 1. Try SECURITY DEFINER RPC first (returns all registrations + joined profiles)
    const { data: rpcRows, error: rpcErr } = await dbClient.rpc(
      "admin_get_all_registrations"
    );

    if (!rpcErr && Array.isArray(rpcRows)) {
      const typedRpcRows = rpcRows as RpcAdminRegistrationRow[];
      initialRecords = await Promise.all(
        typedRpcRows.map(async (row) => {
          const { data: signed } = await dbClient.storage
            .from("payment-screenshots")
            .createSignedUrl(row.payment_screenshot_path, 3600);

          return {
            id: row.id,
            user_id: row.user_id,
            sport_slug: row.sport_slug,
            sport_name: row.sport_name,
            category_id: row.category_id,
            category_label: row.category_label,
            team_name: row.team_name,
            squad_count: Number(row.squad_count ?? 1),
            player_names: row.player_names ?? "",
            accommodation_required: Boolean(row.accommodation_required),
            accommodation_players: Number(row.accommodation_players ?? 0),
            amount_inr: Number(row.amount_inr ?? 0),
            utr_number: row.utr_number ?? "",
            payment_screenshot_path: row.payment_screenshot_path,
            payment_status: row.payment_status,
            admin_note: row.admin_note ?? "",
            reviewed_by: row.reviewed_by,
            reviewed_at: row.reviewed_at,
            created_at: row.created_at,
            updated_at: row.updated_at,
            screenshot_url: signed?.signedUrl ?? null,
            profile: {
              id: row.user_id,
              email: row.profile_email || "",
              full_name: row.profile_full_name || "",
              phone: row.profile_phone || "",
              college: row.profile_college || "",
              student_id: row.profile_student_id || "",
              age: row.profile_age,
              gender: row.profile_gender || "",
              city: row.profile_city || "",
              state: row.profile_state || "",
              aadhar_last4: row.profile_aadhar_last4 || "",
            },
          };
        })
      );
    } else {
      // 2. Fallback: Fetch registrations and profiles in two separate queries
      // so PostgREST foreign-key ambiguity (user_id vs reviewed_by) never breaks the join.
      const { data: regRows, error: regErr } = await dbClient
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false })
        .returns<Registration[]>();

      if (regErr) {
        queryError = regErr.message;
      }

      if (regRows && regRows.length > 0) {
        const userIds = Array.from(new Set(regRows.map((r) => r.user_id)));
        const { data: profileRows } = await dbClient
          .from("profiles")
          .select(
            "id, email, full_name, phone, college, student_id, age, gender, city, state, aadhar_last4"
          )
          .in("id", userIds)
          .returns<ProfileSummary[]>();

        const profileMap = new Map<string, ProfileSummary>();
        if (profileRows) {
          for (const p of profileRows) {
            profileMap.set(p.id, p);
          }
        }
        // Always include the current logged-in admin's profile in case RLS hid other profiles
        if (profile && !profileMap.has(profile.id)) {
          profileMap.set(profile.id, {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            phone: profile.phone,
            college: profile.college,
            student_id: profile.student_id,
            age: profile.age,
            gender: profile.gender,
            city: profile.city,
            state: profile.state,
            aadhar_last4: profile.aadhar_last4,
          });
        }

        initialRecords = await Promise.all(
          regRows.map(async (row) => {
            const { data: signed } = await dbClient.storage
              .from("payment-screenshots")
              .createSignedUrl(row.payment_screenshot_path, 3600);

            return {
              ...row,
              squad_count: Number(row.squad_count ?? 1),
              player_names: row.player_names ?? "",
              accommodation_required: Boolean(row.accommodation_required),
              accommodation_players: Number(row.accommodation_players ?? 0),
              amount_inr: Number(row.amount_inr ?? 0),
              utr_number: row.utr_number ?? "",
              admin_note: row.admin_note ?? "",
              profile: profileMap.get(row.user_id) ?? null,
              screenshot_url: signed?.signedUrl ?? null,
            };
          })
        );
      }
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#38BDF8]">
            <ShieldCheck className="h-4 w-4 text-[#E86C1F]" />
            ZENITH 2027 Admin Console
          </span>
          <h1 className="mt-1 font-display text-3xl font-medium text-white sm:text-4xl">
            Payment &amp; Registration Verification
          </h1>
          <p className="mt-1 text-sm text-blue-100/85">
            Inspect uploaded payment screenshots and approve registrations to
            switch user status from <strong>Pending</strong> to{" "}
            <strong>Success</strong>.
          </p>
        </div>
      </div>

      <AdminDashboardClient
        initialRecords={initialRecords}
        initialAdmins={initialAdmins}
        dbRoleSynced={dbRoleIsAdmin}
        currentUserEmail={user.email ?? ""}
        initialQueryError={queryError}
      />
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
