"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2, Save } from "lucide-react";
import type { Profile } from "@/types/database";

type Props = {
  profile: Profile;
  nextPath?: string | null;
};

export function ProfileForm({ profile, nextPath }: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [phone, setPhone] = useState(
    (profile.phone || "").replace(/^\+91\s*/, "")
  );
  const [college, setCollege] = useState(profile.college || "");
  const [studentId, setStudentId] = useState(profile.student_id || "");
  const [age, setAge] = useState(profile.age ? String(profile.age) : "");
  const [gender, setGender] = useState(profile.gender || "");
  const [city, setCity] = useState(profile.city || "");
  const [stateName, setStateName] = useState(profile.state || "");
  const [aadharLast4, setAadharLast4] = useState(profile.aadhar_last4 || "");
  const [isCompleted, setIsCompleted] = useState(profile.profile_completed);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedMsg(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          college,
          student_id: studentId,
          age: Number(age),
          gender,
          city,
          state: stateName,
          aadhar_last4: aadharLast4,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save profile.");
        setSaving(false);
        return;
      }

      setIsCompleted(true);
      setSaving(false);

      if (nextPath && nextPath.startsWith("/register")) {
        router.push(nextPath);
        router.refresh();
        return;
      }

      setSavedMsg("Profile saved! You can now register for any of the 7 sports.");
      router.refresh();
    } catch {
      setError("Network error while saving profile.");
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            Athlete & University Profile
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Required once before you can register a team or individual entry.
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            isCompleted
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          {isCompleted ? "Profile Verified" : "Details Incomplete"}
        </span>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {savedMsg && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {savedMsg}
          </span>
          <Link
            href="/register"
            className="inline-flex items-center gap-1 rounded-lg bg-orange-500 px-3 py-1.5 text-white hover:bg-orange-600"
          >
            Register for a Sport
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Aarav Sharma"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Google Email (Verified)
          </label>
          <input
            type="email"
            disabled
            value={profile.email}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm text-slate-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Phone / WhatsApp Number (10 digits) *
          </label>
          <div className="mt-1.5 flex rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
            <span className="inline-flex items-center rounded-l-xl border-r border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600">
              +91
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="9876543210"
              className="w-full rounded-r-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            College / University Name *
          </label>
          <input
            type="text"
            required
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            placeholder="e.g. IIST Thiruvananthapuram / NIT Calicut"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            College Student ID / Roll No. *
          </label>
          <input
            type="text"
            required
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g. SC24B042"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Age (Years) *
            </label>
            <input
              type="number"
              required
              min={15}
              max={35}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="20"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Gender *
            </label>
            <select
              required
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            City *
          </label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Thiruvananthapuram"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            State *
          </label>
          <input
            type="text"
            required
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            placeholder="e.g. Kerala"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700">
            Aadhar Card — Last 4 Digits *
          </label>
          <input
            type="text"
            required
            maxLength={4}
            value={aadharLast4}
            onChange={(e) => setAadharLast4(e.target.value.replace(/\D/g, ""))}
            placeholder="4-digit Aadhar verification code (full Aadhar ID & College ID must be shown at venue)"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500">
          Eligibility check: Valid College ID & Aadhar ID must be carried in
          person during ZENITH 2027.
        </p>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 cursor-pointer disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving
            ? "Saving..."
            : nextPath && nextPath.startsWith("/register")
            ? "Save & Continue to Register"
            : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
