"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import { SPORTS } from "@/data/sports";
import { formatTeamCode } from "@/lib/teamCode";
import type { AdminRegistrationRecord, PaymentStatus } from "@/types/database";

type AdminUserSummary = {
  id: string;
  email: string;
  full_name: string;
  role: string;
};

type Props = {
  initialRecords: AdminRegistrationRecord[];
  initialAdmins?: AdminUserSummary[];
  dbRoleSynced?: boolean;
  currentUserEmail?: string;
  initialQueryError?: string | null;
};

export function AdminDashboardClient({
  initialRecords,
  initialAdmins = [],
  dbRoleSynced = true,
  currentUserEmail = "",
  initialQueryError = null,
}: Props) {
  const router = useRouter();
  const [records, setRecords] =
    useState<AdminRegistrationRecord[]>(initialRecords);
  const [admins, setAdmins] = useState<AdminUserSummary[]>(initialAdmins);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [adminMsg, setAdminMsg] = useState<string | null>(null);
  const [adminErr, setAdminErr] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>(
    "all"
  );
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(
    initialQueryError
  );
  const [copiedSql, setCopiedSql] = useState(false);

  const rlsFixSql = `-- Run this once in your Supabase SQL Editor to fix Admin Data Display & Approval RLS:
alter table public.registrations add column if not exists accommodation_required boolean not null default false;
alter table public.registrations add column if not exists accommodation_players integer not null default 0;

create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select
    lower(coalesce(auth.jwt() ->> 'email', '')) in (
      'tomaryuvraj782@gmail.com',
      'yuvraj.sc24b137@ug.iist.ac.in'${
        currentUserEmail
          ? `,\n      '${currentUserEmail.trim().toLowerCase()}'`
          : ""
      }
    )
    or exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    );
$$;
grant execute on function public.is_admin() to anon, authenticated;

update public.profiles
set role = 'admin'
where lower(email) in (
  'tomaryuvraj782@gmail.com',
  'yuvraj.sc24b137@ug.iist.ac.in'${
    currentUserEmail
      ? `,\n  '${currentUserEmail.trim().toLowerCase()}'`
      : ""
  }
);

create or replace function public.admin_review_registration(
  target_id uuid,
  next_status text,
  note text default ''
)
returns public.registrations language plpgsql security definer set search_path = public as $$
declare
  updated_row public.registrations;
begin
  if not public.is_admin() then
    raise exception 'Forbidden: Admin access required.';
  end if;
  update public.registrations
  set payment_status = next_status,
      admin_note = coalesce(note, ''),
      reviewed_by = case when next_status = 'pending' then null else auth.uid() end,
      reviewed_at = case when next_status = 'pending' then null else now() end,
      updated_at = now()
  where id = target_id
  returning * into updated_row;
  return updated_row;
end;
$$;
grant execute on function public.admin_review_registration(uuid, text, text) to authenticated;

drop policy if exists "Users view own registrations or admin views all" on public.registrations;
create policy "Users view own registrations or admin views all"
  on public.registrations for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Users can resubmit rejected or admin can update status" on public.registrations;
create policy "Users can resubmit rejected or admin can update status"
  on public.registrations for update
  using (public.is_admin() or (auth.uid() = user_id and payment_status = 'rejected'))
  with check (public.is_admin() or (auth.uid() = user_id and payment_status = 'pending'));`;

  const [inspectRecord, setInspectRecord] =
    useState<AdminRegistrationRecord | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = records.length;
    const pending = records.filter((r) => r.payment_status === "pending").length;
    const success = records.filter((r) => r.payment_status === "success").length;
    const verifiedRevenue = records
      .filter((r) => r.payment_status === "success")
      .reduce((sum, r) => sum + r.amount_inr, 0);
    return { total, pending, success, verifiedRevenue };
  }, [records]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((r) => {
      if (statusFilter !== "all" && r.payment_status !== statusFilter) {
        return false;
      }
      if (sportFilter !== "all" && r.sport_slug !== sportFilter) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        r.team_name,
        r.sport_name,
        r.category_label,
        r.utr_number,
        r.profile?.full_name,
        r.profile?.email,
        r.profile?.college,
        r.profile?.phone,
        r.profile?.student_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [records, statusFilter, sportFilter, query]);

  async function updateStatus(
    id: string,
    nextStatus: PaymentStatus,
    note = ""
  ) {
    setBusyId(id);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_status: nextStatus,
          admin_note: note,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Failed to update registration status.");
        setBusyId(null);
        return;
      }

      setRecords((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                payment_status: data.registration.payment_status,
                admin_note: data.registration.admin_note,
                reviewed_at: data.registration.reviewed_at,
              }
            : item
        )
      );

      if (inspectRecord?.id === id) {
        setInspectRecord((prev) =>
          prev
            ? {
                ...prev,
                payment_status: data.registration.payment_status,
                admin_note: data.registration.admin_note,
              }
            : null
        );
      }

      setRejectingId(null);
      setNoteInput("");
      setBusyId(null);
      router.refresh();
    } catch {
      setActionError("Network error while updating status.");
      setBusyId(null);
    }
  }

  function exportCsv() {
    const headers = [
      "Sport",
      "Category",
      "Team Name",
      "Squad Count",
      "Accommodation",
      "Accommodation Players",
      "Fee (INR)",
      "Payment ID (UTR)",
      "Payment Status",
      "Captain Name",
      "Email",
      "Phone",
      "College",
      "Student ID",
      "Age",
      "Gender",
      "City",
      "State",
      "Aadhar Last4",
      "Submitted At",
    ];

    const escapeCsv = (val: unknown) => {
      const str = String(val ?? "");
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = filtered.map((r) => [
      r.sport_name,
      r.category_label,
      r.team_name,
      r.squad_count,
      r.accommodation_required ? "Yes" : "No",
      r.accommodation_players ?? 0,
      r.amount_inr,
      r.utr_number,
      r.payment_status,
      r.profile?.full_name ?? "",
      r.profile?.email ?? "",
      r.profile?.phone ?? "",
      r.profile?.college ?? "",
      r.profile?.student_id ?? "",
      r.profile?.age ?? "",
      r.profile?.gender ?? "",
      r.profile?.city ?? "",
      r.profile?.state ?? "",
      r.profile?.aadhar_last4 ?? "",
      r.created_at,
    ]);

    const csvContent = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `zenith-2027-registrations-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    setAddingAdmin(true);
    setAdminErr(null);
    setAdminMsg(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newAdminEmail.trim(),
          role: "admin",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAdminErr(data.error || "Could not grant admin role.");
        setAddingAdmin(false);
        return;
      }

      setAdmins((prev) => {
        const exists = prev.some((a) => a.id === data.admin.id);
        return exists ? prev : [...prev, data.admin];
      });
      setAdminMsg(`Granted admin access to ${data.admin.email}.`);
      setNewAdminEmail("");
      setAddingAdmin(false);
      router.refresh();
    } catch {
      setAdminErr("Network error while adding admin.");
      setAddingAdmin(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Database Admin & RLS Sync Alert (shown if Postgres role is still 'user' or an RLS error occurred) */}
      {(!dbRoleSynced || actionError) && (
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-5 text-slate-900 shadow-md">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <h2 className="font-display text-base font-bold text-amber-950">
                  Supabase RLS &amp; Admin Role Sync Required
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-amber-900">
                  Your email (<strong>{currentUserEmail}</strong>) is authorized
                  in Next.js, but Supabase Row-Level Security (RLS) still sees
                  your database profile role as <code>user</code>. Run the SQL
                  below once in your <strong>Supabase SQL Editor</strong> so
                  Postgres lets you view all participants&apos; profiles and
                  approve payments without RLS errors:
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(rlsFixSql);
                setCopiedSql(true);
                setTimeout(() => setCopiedSql(false), 2500);
              }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-900 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-amber-950 cursor-pointer"
            >
              {copiedSql ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  Copied SQL!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy SQL Fix
                </>
              )}
            </button>
          </div>
          <pre className="mt-3 max-h-48 overflow-auto rounded-xl bg-slate-950 p-3.5 text-[11px] leading-relaxed text-amber-200">
            {rlsFixSql}
          </pre>
        </div>
      )}

      {/* Add Admin by Email Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Admin Team Access — Add Admin by Email
            </h2>
            <p className="text-xs text-slate-500">
              Enter the Google email of any user who has signed in once to
              promote them to Admin.
            </p>
          </div>

          <form
            onSubmit={handleAddAdmin}
            className="flex flex-col gap-2 sm:flex-row sm:items-center"
          >
            <input
              type="email"
              required
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="coordinator@gmail.com"
              className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-600 sm:w-64"
            />
            <button
              type="submit"
              disabled={addingAdmin}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FF7A00] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#E66E00] cursor-pointer disabled:opacity-50"
            >
              {addingAdmin && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {addingAdmin ? "Adding..." : "Add Admin"}
            </button>
          </form>
        </div>

        {adminErr && (
          <p className="mt-2 text-xs font-semibold text-red-600">{adminErr}</p>
        )}
        {adminMsg && (
          <p className="mt-2 text-xs font-semibold text-emerald-700">
            {adminMsg}
          </p>
        )}

        {admins.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Current Admins:
            </span>
            {admins.map((a) => (
              <span
                key={a.id}
                className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-800"
              >
                {a.full_name ? `${a.full_name} (${a.email})` : a.email}
              </span>
            ))}
          </div>
        )}
      </div>
      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Entries
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-slate-900">
            {stats.total}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setStatusFilter("pending")}
          className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left shadow-xs transition hover:border-amber-300 cursor-pointer"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Pending Review
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-amber-700">
            {stats.pending}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("success")}
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-left shadow-xs transition hover:border-emerald-300 cursor-pointer"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Approved (Success)
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-emerald-700">
            {stats.success}
          </p>
        </button>

        <div className="rounded-2xl border border-blue-200 bg-blue-950 p-5 text-white shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
            Verified Collection
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-orange-400">
            ₹{stats.verifiedRevenue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "success", "rejected"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition cursor-pointer ${
                statusFilter === st
                  ? "bg-blue-700 text-white"
                  : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-600"
          >
            <option value="all">All Sports &amp; Stays</option>
            {SPORTS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
            <option value="accommodation">
              Campus Accommodation (Standalone)
            </option>
          </select>

          <div className="relative flex-1 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search team, name, college, UTR..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="button"
            onClick={() => router.refresh()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>

          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </button>
        </div>
      </div>

      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
          {actionError}
        </div>
      )}

      {/* Registrations List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          No registrations match the current filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((reg) => {
            const isBusy = busyId === reg.id;
            const isPending = reg.payment_status === "pending";
            const isSuccess = reg.payment_status === "success";
            const isRejected = reg.payment_status === "rejected";

            return (
              <div
                key={reg.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-200"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left: Sport + Team + Participant Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-lg font-bold text-slate-900">
                        {reg.sport_name}
                      </span>
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-800 border border-blue-200">
                        {reg.category_label}
                      </span>
                      <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-700 border border-orange-200">
                        ₹{reg.amount_inr.toLocaleString("en-IN")}
                      </span>
                      {reg.sport_slug !== "accommodation" && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-800 border border-slate-300">
                          Team ID: {formatTeamCode(reg.id)}
                        </span>
                      )}

                      {isPending && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                          <Clock className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                      {isSuccess && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                          <CheckCircle2 className="h-3 w-3" />
                          Success
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-800">
                          <XCircle className="h-3 w-3" />
                          Rejected
                        </span>
                      )}
                    </div>

                    <div className="grid gap-x-6 gap-y-1 text-xs text-slate-600 sm:grid-cols-2">
                      <p>
                        <strong className="text-slate-800">Team:</strong>{" "}
                        {reg.team_name} ({reg.squad_count} players)
                      </p>
                      <p>
                        <strong className="text-slate-800">Payment ID:</strong>{" "}
                        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-blue-800">
                          {reg.utr_number}
                        </code>
                      </p>
                      <p>
                        <strong className="text-slate-800">Accommodation:</strong>{" "}
                        {reg.accommodation_required
                          ? `Campus Hostel (${reg.accommodation_players} players)`
                          : "Not requested"}
                      </p>
                      <p>
                        <strong className="text-slate-800">Participant:</strong>{" "}
                        {reg.profile?.full_name || reg.team_name || "—"}{" "}
                        {reg.profile?.email ? `(${reg.profile.email})` : ""}
                      </p>
                      <p>
                        <strong className="text-slate-800">Phone:</strong>{" "}
                        {reg.profile?.phone || "—"}
                      </p>
                      <p>
                        <strong className="text-slate-800">College:</strong>{" "}
                        {reg.profile?.college || "—"} • ID:{" "}
                        {reg.profile?.student_id || "—"}
                      </p>
                      <p>
                        <strong className="text-slate-800">
                          Location / Age / Aadhar:
                        </strong>{" "}
                        {[reg.profile?.city, reg.profile?.state]
                          .filter(Boolean)
                          .join(", ") || "—"}{" "}
                        • {reg.profile?.age ?? "—"} yrs (
                        {reg.profile?.gender || "—"}) • ••••{" "}
                        {reg.profile?.aadhar_last4 || "—"}
                      </p>
                    </div>

                    {reg.player_names && (
                      <p className="text-xs text-slate-500">
                        <strong className="text-slate-700">Roster:</strong>{" "}
                        {reg.player_names}
                      </p>
                    )}

                    {reg.admin_note && (
                      <p className="text-xs text-red-700">
                        <strong>Admin Note:</strong> {reg.admin_note}
                      </p>
                    )}
                  </div>

                  {/* Right: Screenshot + Approval Controls */}
                  <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
                    {reg.screenshot_url && (
                      <button
                        type="button"
                        onClick={() => {
                          setInspectRecord(reg);
                          setNoteInput(reg.admin_note || "");
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 cursor-pointer"
                      >
                        <Eye className="h-4 w-4 text-blue-700" />
                        Inspect Screenshot
                      </button>
                    )}

                    {!isSuccess && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => updateStatus(reg.id, "success", "")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 cursor-pointer disabled:opacity-50"
                      >
                        {isBusy ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        Approve → Success
                      </button>
                    )}

                    {!isRejected && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => {
                          setRejectingId(
                            rejectingId === reg.id ? null : reg.id
                          );
                          setNoteInput("");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Rejection Reason Box */}
                {rejectingId === reg.id && (
                  <div className="mt-4 flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50/70 p-3 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Optional note for participant (e.g. UTR mismatch or blurry screenshot)"
                      className="flex-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-red-500"
                    />
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() =>
                        updateStatus(
                          reg.id,
                          "rejected",
                          noteInput.trim() ||
                            "Payment screenshot could not be verified. Please re-upload."
                        )
                      }
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 cursor-pointer disabled:opacity-50"
                    >
                      Confirm Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Full-size Screenshot Inspection Modal */}
      {inspectRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4"
          onClick={() => setInspectRecord(null)}
        >
          <div
            className="grid max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center bg-slate-900 p-4 md:col-span-7">
              {inspectRecord.screenshot_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={inspectRecord.screenshot_url}
                  alt="Payment screenshot"
                  className="max-h-[78vh] w-auto rounded-xl object-contain"
                />
              ) : (
                <p className="text-sm text-slate-300">Screenshot unavailable</p>
              )}
            </div>

            <div className="flex flex-col justify-between p-6 md:col-span-5">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                      <ShieldCheck className="h-4 w-4" />
                      Verify Payment
                    </span>
                    <h3 className="mt-1 font-display text-xl font-bold text-slate-900">
                      {inspectRecord.sport_name}
                    </h3>
                    <p className="text-xs font-semibold text-orange-600">
                      {inspectRecord.category_label} • ₹
                      {inspectRecord.amount_inr.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInspectRecord(null)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-700">
                  <p>
                    <strong>Team:</strong> {inspectRecord.team_name}
                  </p>
                  <p>
                    <strong>Payment ID:</strong>{" "}
                    <code className="font-bold text-blue-800">
                      {inspectRecord.utr_number}
                    </code>
                  </p>
                  <p>
                    <strong>Accommodation:</strong>{" "}
                    {inspectRecord.accommodation_required
                      ? `Yes (${inspectRecord.accommodation_players} players)`
                      : "No"}
                  </p>
                  <p>
                    <strong>Participant:</strong>{" "}
                    {inspectRecord.profile?.full_name}
                  </p>
                  <p>
                    <strong>College:</strong> {inspectRecord.profile?.college}
                  </p>
                  <p>
                    <strong>Phone:</strong> {inspectRecord.profile?.phone}
                  </p>
                  <p>
                    <strong>Current Status:</strong>{" "}
                    <span className="font-bold uppercase">
                      {inspectRecord.payment_status}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Admin Note (optional)
                  </label>
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Optional approval/rejection remark"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  disabled={busyId === inspectRecord.id}
                  onClick={() =>
                    updateStatus(inspectRecord.id, "success", noteInput.trim())
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Payment (Pending → Success)
                </button>
                <button
                  type="button"
                  disabled={busyId === inspectRecord.id}
                  onClick={() =>
                    updateStatus(
                      inspectRecord.id,
                      "rejected",
                      noteInput.trim() ||
                        "Payment could not be verified. Please re-upload a clear screenshot."
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  Reject Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
