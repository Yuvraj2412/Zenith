"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  Building2,
  CheckCircle2,
  FileImage,
  KeyRound,
  Loader2,
  Search,
  UploadCloud,
  X,
} from "lucide-react";
import { getAccommodationFeePerPlayerInr } from "@/data/sports";
import { createClient } from "@/lib/supabase/client";
import { buildScreenshotPath, validateScreenshotFile } from "@/lib/storage";
import { UpiQrCard } from "./UpiQrCard";

type VerifiedTeam = {
  team_code: string;
  team_name: string;
  sport_name: string;
  category_label: string;
  squad_count: number;
};

type Props = {
  userId: string | null;
  userFullName: string;
  profileCompleted: boolean;
  initialTeamCode?: string;
  paymentConfig: {
    upiId: string;
    upiName: string;
    note: string;
  };
};

export function AccommodationsClient({
  userId,
  userFullName,
  profileCompleted,
  initialTeamCode = "",
  paymentConfig,
}: Props) {
  const router = useRouter();
  const [teamCodeInput, setTeamCodeInput] = useState(initialTeamCode);
  const [verifying, setVerifying] = useState(false);
  const [verifiedTeam, setVerifiedTeam] = useState<VerifiedTeam | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const [membersCount, setMembersCount] = useState(1);
  const [memberNames, setMemberNames] = useState(userFullName);
  const [paymentId, setPaymentId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const unitFee = getAccommodationFeePerPlayerInr();
  const totalFee = membersCount * unitFee;

  useEffect(() => {
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc);
    };
  }, [previewSrc]);

  async function handleVerifyTeam(e: FormEvent) {
    e.preventDefault();
    if (!teamCodeInput.trim()) {
      setVerifyError("Please enter your Team ID (e.g. ZEN-A4F91C).");
      return;
    }

    setVerifying(true);
    setVerifyError(null);
    setVerifiedTeam(null);

    try {
      const res = await fetch(
        `/api/accommodations?team_id=${encodeURIComponent(
          teamCodeInput.trim()
        )}`
      );
      const data = await res.json();
      if (!res.ok) {
        setVerifyError(data.error || "Team ID not found.");
        setVerifying(false);
        return;
      }

      setVerifiedTeam(data.team);
      setMembersCount(Math.min(data.team.squad_count || 1, 10));
      setVerifying(false);
    } catch {
      setVerifyError("Could not verify Team ID. Please try again.");
      setVerifying(false);
    }
  }

  function handleFileChange(file: File | null) {
    if (!file) return;
    const err = validateScreenshotFile(file);
    if (err) {
      setSubmitError(err);
      return;
    }
    if (previewSrc) URL.revokeObjectURL(previewSrc);
    setScreenshotFile(file);
    setPreviewSrc(URL.createObjectURL(file));
    setSubmitError(null);
  }

  async function handleBookAccommodation(e: FormEvent) {
    e.preventDefault();
    if (!userId || !verifiedTeam) return;

    if (paymentId.trim().length < 4) {
      setSubmitError("Please enter your Payment ID / UPI Transaction ID.");
      return;
    }
    if (!screenshotFile) {
      setSubmitError("Please attach your payment screenshot.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const supabase = createClient();
      const filePath = buildScreenshotPath(
        userId,
        `acc-${verifiedTeam.team_code.toLowerCase()}`,
        screenshotFile.name
      );

      const { error: uploadErr } = await supabase.storage
        .from("payment-screenshots")
        .upload(filePath, screenshotFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadErr) {
        setSubmitError(`Screenshot upload failed: ${uploadErr.message}`);
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/accommodations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_code: verifiedTeam.team_code,
          members_count: membersCount,
          member_names: memberNames.trim(),
          utr_number: paymentId.trim(),
          payment_screenshot_path: filePath,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Could not submit accommodation booking.");
        setSubmitting(false);
        return;
      }

      router.push("/profile?submitted=1");
      router.refresh();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Booking submission failed."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Step 1: Lookup by Team ID */}
      <div className="rounded-2xl border border-white/20 bg-white/95 p-6 text-[#091930] shadow-2xl sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="label text-[#0099FF]">
              Step 1 • Verify Registered Team
            </span>
            <h2 className="mt-1 font-display text-2xl font-medium text-[#091930]">
              Enter Your Team ID
            </h2>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">
              After a team registers for any sport, they receive a unique Team
              ID (e.g. <code className="font-bold text-[#0099FF]">ZEN-A4F91C</code>)
              on their Profile page. Enter it below to book campus stay.
            </p>
          </div>
          <div className="rounded-xl bg-orange-50 px-4 py-2.5 text-right border border-orange-200">
            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-800">
              Campus Stay Fee
            </p>
            <p className="font-display text-xl font-semibold text-[#FF7A00]">
              ₹{unitFee.toLocaleString("en-IN")} / member
            </p>
          </div>
        </div>

        <form
          onSubmit={handleVerifyTeam}
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <KeyRound className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={teamCodeInput}
              onChange={(e) => setTeamCodeInput(e.target.value.toUpperCase())}
              placeholder="Enter Team ID (e.g. ZEN-A4F91C)"
              className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm font-bold uppercase tracking-wider text-[#091930] outline-none focus:border-[#0099FF] focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="submit"
            disabled={verifying}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0099FF] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#0099FF]/25 transition hover:bg-[#007ACC] cursor-pointer disabled:opacity-60"
          >
            {verifying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {verifying ? "Checking..." : "Verify Team ID"}
          </button>
        </form>

        {verifyError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
            {verifyError}
          </div>
        )}

        {verifiedTeam && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-bold text-emerald-950">
                  Team Verified: {verifiedTeam.team_name} (
                  {verifiedTeam.team_code})
                </p>
                <p className="text-xs text-emerald-800">
                  Sport: <strong>{verifiedTeam.sport_name}</strong> (
                  {verifiedTeam.category_label}) • Registered Squad:{" "}
                  {verifiedTeam.squad_count} players
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white">
              Matched
            </span>
          </div>
        )}
      </div>

      {/* Step 2: Book & Pay for Accommodation */}
      {verifiedTeam && (
        <div className="rounded-2xl border border-white/20 bg-white/95 p-6 text-[#091930] shadow-2xl sm:p-8">
          {!userId ? (
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <h3 className="font-display text-xl font-medium text-[#091930]">
                  Sign in with Google to Complete Booking
                </h3>
                <p className="text-xs text-slate-600">
                  Your Team ID <strong>{verifiedTeam.team_code}</strong> is
                  verified. Sign in so your accommodation booking &amp; payment
                  status appear in your profile.
                </p>
              </div>
              <Link
                href={`/login?next=${encodeURIComponent(
                  `/accommodations?team_id=${verifiedTeam.team_code}`
                )}`}
                className="rounded-xl bg-[#FF7A00] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF7A00]/25 hover:bg-[#E66E00]"
              >
                Sign in with Google →
              </Link>
            </div>
          ) : !profileCompleted ? (
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <h3 className="font-display text-xl font-medium text-[#091930]">
                  Complete Your Profile First
                </h3>
                <p className="text-xs text-slate-600">
                  Fill in your college and phone details once before submitting
                  your accommodation payment.
                </p>
              </div>
              <Link
                href={`/profile?onboarding=1&next=${encodeURIComponent(
                  `/accommodations?team_id=${verifiedTeam.team_code}`
                )}`}
                className="rounded-xl bg-[#FF7A00] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF7A00]/25 hover:bg-[#E66E00]"
              >
                Complete Profile →
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleBookAccommodation}
              className="grid gap-8 lg:grid-cols-12"
            >
              <div className="space-y-4 lg:col-span-6">
                <span className="label text-[#FF7A00]">
                  Step 2 • Guest Details
                </span>
                <h3 className="font-display text-2xl font-medium text-[#091930]">
                  Campus Hostel Booking
                </h3>

                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-[#091930] inline-flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-[#0099FF]" />
                    On-Campus Stay Guidelines
                  </p>
                  <p>
                    • Accommodation is provided inside the IIST campus hostels.
                  </p>
                  <p>
                    • Every guest must carry a valid College ID &amp; original
                    Aadhar ID at check-in.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Number of Members Needing Accommodation *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={25}
                    value={membersCount}
                    onChange={(e) =>
                      setMembersCount(Math.max(1, Number(e.target.value)))
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-[#091930] outline-none focus:border-[#0099FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Names of Members Staying on Campus *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={memberNames}
                    onChange={(e) => setMemberNames(e.target.value)}
                    placeholder="Enter member names separated by commas"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-[#091930] outline-none focus:border-[#0099FF]"
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#071A3E] p-4 text-white">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#38BDF8]">
                      Total Accommodation Fee
                    </p>
                    <p className="text-xs text-blue-200">
                      {membersCount} {membersCount === 1 ? "member" : "members"}{" "}
                      × ₹{unitFee.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <p className="font-display text-2xl font-semibold text-[#FF7A00]">
                    ₹{totalFee.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="space-y-4 lg:col-span-6">
                <span className="label text-[#0099FF]">
                  Step 3 • Pay &amp; Upload Screenshot
                </span>

                <UpiQrCard
                  upiId={paymentConfig.upiId}
                  upiName={paymentConfig.upiName}
                  paymentNote={paymentConfig.note}
                  amountInr={totalFee}
                  sportLabel={`Accommodation - ${verifiedTeam.team_code}`}
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Payment ID / UPI Transaction ID (UTR) *
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentId}
                    onChange={(e) => setPaymentId(e.target.value)}
                    placeholder="Enter 12-digit UTR or Payment ID"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-[#091930] outline-none focus:border-[#0099FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Upload Payment Screenshot *
                  </label>
                  {!previewSrc ? (
                    <label className="mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-center transition hover:border-[#FF7A00]">
                      <UploadCloud className="h-7 w-7 text-[#0099FF]" />
                      <span className="mt-1.5 text-xs font-semibold text-[#091930]">
                        Click to attach screenshot (₹
                        {totalFee.toLocaleString("en-IN")})
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) =>
                          handleFileChange(e.target.files?.[0] ?? null)
                        }
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="mt-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between pb-2">
                        <span className="inline-flex items-center gap-1.5 truncate text-xs font-semibold text-slate-700">
                          <FileImage className="h-4 w-4 text-[#0099FF]" />
                          {screenshotFile?.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (previewSrc) URL.revokeObjectURL(previewSrc);
                            setPreviewSrc(null);
                            setScreenshotFile(null);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-red-600 cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewSrc}
                        alt="Payment screenshot preview"
                        className="max-h-52 w-full rounded-lg bg-white object-contain"
                      />
                    </div>
                  )}
                </div>

                {submitError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF7A00] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-[#FF7A00]/30 transition hover:bg-[#E66E00] cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting
                    ? "Submitting Booking..."
                    : `Book Accommodation (₹${totalFee.toLocaleString("en-IN")})`}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
