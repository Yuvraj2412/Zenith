"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Building2,
  FileImage,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  getAccommodationFeePerPlayerInr,
  type Sport,
  type SportCategory,
} from "@/data/sports";
import { createClient } from "@/lib/supabase/client";
import { buildScreenshotPath, validateScreenshotFile } from "@/lib/storage";
import type { Profile } from "@/types/database";
import { UpiQrCard } from "./UpiQrCard";

type Props = {
  profile: Profile;
  sport: Sport;
  category: SportCategory;
  teamName: string;
  squadCount: number;
  playerNames: string;
  accommodationRequired: boolean;
  accommodationPlayers: number;
  paymentConfig: {
    upiId: string;
    upiName: string;
    note: string;
  };
};

export function PaymentClient({
  profile,
  sport,
  category,
  teamName,
  squadCount,
  playerNames,
  accommodationRequired,
  accommodationPlayers,
  paymentConfig,
}: Props) {
  const router = useRouter();
  const [paymentId, setPaymentId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accommodationUnitFee = getAccommodationFeePerPlayerInr();
  const accommodationTotalFee = accommodationRequired
    ? accommodationPlayers * accommodationUnitFee
    : 0;
  const totalAmountInr = category.feeInr + accommodationTotalFee;
  const totalAmountDisplay = `₹${totalAmountInr.toLocaleString("en-IN")}`;

  useEffect(() => {
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc);
    };
  }, [previewSrc]);

  function handleFileChange(file: File | null) {
    if (!file) return;
    const fileError = validateScreenshotFile(file);
    if (fileError) {
      setError(fileError);
      return;
    }
    if (previewSrc) URL.revokeObjectURL(previewSrc);
    setScreenshotFile(file);
    setPreviewSrc(URL.createObjectURL(file));
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (paymentId.trim().length < 4) {
      setError("Please enter your Payment ID / UPI Transaction ID (UTR).");
      return;
    }
    if (!screenshotFile) {
      setError("Please attach and upload your payment screenshot.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const filePath = buildScreenshotPath(
        profile.id,
        `${sport.slug}-${category.id}`,
        screenshotFile.name
      );

      const { error: uploadErr } = await supabase.storage
        .from("payment-screenshots")
        .upload(filePath, screenshotFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadErr) {
        setError(`Screenshot upload failed: ${uploadErr.message}`);
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport_slug: sport.slug,
          category_id: category.id,
          team_name: teamName,
          squad_count: squadCount,
          player_names: playerNames.trim(),
          accommodation_required: accommodationRequired,
          accommodation_players: accommodationPlayers,
          utr_number: paymentId.trim(),
          payment_screenshot_path: filePath,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not submit registration.");
        setSubmitting(false);
        return;
      }

      router.push("/profile?submitted=1");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-12 lg:items-start"
    >
      {/* Left Column: Detailed List of Bookings & Additions */}
      <div className="space-y-5 rounded-sm border border-slate-200 bg-white p-6 shadow-xs lg:col-span-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="label text-[#16408B]">Booking Summary</p>
            <h2 className="mt-1 font-display text-2xl font-medium text-[#091930]">
              Itemized Details
            </h2>
          </div>
          <Link
            href={`/register?sport=${encodeURIComponent(
              sport.slug
            )}&category=${encodeURIComponent(category.id)}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#16408B] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Edit Booking
          </Link>
        </div>

        {/* Line Items Table */}
        <div className="divide-y divide-slate-100 border border-slate-200 bg-[#F5F7FB]">
          <div className="flex items-start justify-between gap-4 p-4">
            <div>
              <p className="font-semibold text-[#091930]">
                {sport.name} — {category.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-600">
                Team: <strong>{teamName}</strong> • {squadCount} players •{" "}
                {category.format}
              </p>
            </div>
            <p className="font-display text-lg font-medium text-[#091930]">
              {category.feeDisplay}
            </p>
          </div>

          <div className="flex items-start justify-between gap-4 p-4">
            <div>
              <p className="inline-flex items-center gap-1.5 font-semibold text-[#091930]">
                <Building2 className="h-4 w-4 text-[#D9531E]" />
                Campus Accommodation
              </p>
              {accommodationRequired ? (
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Requested for{" "}
                  <strong>
                    {accommodationPlayers}{" "}
                    {accommodationPlayers === 1 ? "player" : "players"}
                  </strong>{" "}
                  × ₹{accommodationUnitFee.toLocaleString("en-IN")} / player.
                  On-campus hostel accommodation will be provided by IIST;
                  allotment &amp; check-in details will be shared upon
                  verification (carry original College ID &amp; Aadhar ID).
                </p>
              ) : (
                <p className="mt-0.5 text-xs text-slate-500">
                  Not requested
                </p>
              )}
            </div>
            <p className="font-display text-lg font-medium text-[#091930] shrink-0">
              {accommodationRequired
                ? `+ ₹${accommodationTotalFee.toLocaleString("en-IN")}`
                : "₹0"}
            </p>
          </div>

          <div className="flex items-center justify-between bg-[#07162C] p-4 text-white">
            <span className="label text-blue-200">Total Payable Now</span>
            <span className="font-display text-2xl font-medium text-orange-300">
              {totalAmountDisplay}
            </span>
          </div>
        </div>

        {/* Representative & Squad Info */}
        <div className="space-y-2 rounded-sm border border-slate-200 p-4 text-xs text-slate-600">
          <p>
            <strong className="text-[#091930]">Team Representative:</strong>{" "}
            {profile.full_name} ({profile.phone})
          </p>
          <p>
            <strong className="text-[#091930]">College / University:</strong>{" "}
            {profile.college} (ID: {profile.student_id})
          </p>
          {playerNames && (
            <p>
              <strong className="text-[#091930]">Squad Roster:</strong>{" "}
              {playerNames}
            </p>
          )}
        </div>
      </div>

      {/* Right Column: QR Code + Payment ID + Screenshot Upload */}
      <div className="space-y-5 rounded-sm border border-slate-200 bg-white p-6 shadow-xs lg:col-span-6">
        <div>
          <p className="label text-[#D9531E]">Complete Payment</p>
          <h3 className="mt-1 font-display text-2xl font-medium text-[#091930]">
            Scan QR &amp; Enter Payment ID
          </h3>
        </div>

        <UpiQrCard
          upiId={paymentConfig.upiId}
          upiName={paymentConfig.upiName}
          paymentNote={paymentConfig.note}
          amountInr={totalAmountInr}
          sportLabel={`${sport.name} (${category.label})`}
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
            placeholder="Enter 12-digit UTR or Payment Transaction ID"
            className="mt-1.5 w-full rounded-sm border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#16408B] focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Attach Payment Screenshot (PNG, JPG, WEBP • Max 5 MB) *
          </label>

          {!previewSrc ? (
            <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed border-slate-300 bg-[#F5F7FB] px-6 py-7 text-center transition hover:border-[#D9531E]">
              <UploadCloud className="h-8 w-8 text-[#16408B]" />
              <span className="mt-2 text-sm font-semibold text-[#091930]">
                Click to attach payment screenshot
              </span>
              <span className="mt-1 text-xs text-slate-500">
                Ensure Payment ID and amount ({totalAmountDisplay}) are visible
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>
          ) : (
            <div className="mt-2 rounded-sm border border-slate-200 bg-[#F5F7FB] p-3">
              <div className="flex items-center justify-between gap-2 pb-2">
                <span className="inline-flex items-center gap-1.5 truncate text-xs font-semibold text-slate-700">
                  <FileImage className="h-4 w-4 shrink-0 text-[#16408B]" />
                  {screenshotFile?.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (previewSrc) URL.revokeObjectURL(previewSrc);
                    setPreviewSrc(null);
                    setScreenshotFile(null);
                  }}
                  className="inline-flex items-center gap-1 rounded-sm border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSrc}
                alt="Payment screenshot preview"
                className="max-h-60 w-full rounded-sm border border-slate-200 bg-white object-contain"
              />
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="label flex w-full items-center justify-center gap-2 rounded-sm bg-[#D9531E] px-6 py-3.5 text-white shadow-lg shadow-[#D9531E]/25 transition hover:bg-[#BE4414] cursor-pointer disabled:opacity-50"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting
            ? "Submitting Payment..."
            : `Submit Payment & Registration (${totalAmountDisplay})`}
        </button>
      </div>
    </form>
  );
}
