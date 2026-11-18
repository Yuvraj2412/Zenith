"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  Plus,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { buildScreenshotPath, validateScreenshotFile } from "@/lib/storage";
import type { RegistrationWithSignedUrl } from "@/types/database";

type Props = {
  registrations: RegistrationWithSignedUrl[];
  userId: string;
  profileCompleted: boolean;
};

export function MyRegistrationsList({
  registrations,
  userId,
  profileCompleted,
}: Props) {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resubmittingId, setResubmittingId] = useState<string | null>(null);
  const [newUtr, setNewUtr] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleResubmit(registrationId: string) {
    if (!newFile) {
      setError("Please select a new payment screenshot image.");
      return;
    }
    const fileError = validateScreenshotFile(newFile);
    if (fileError) {
      setError(fileError);
      return;
    }
    if (newUtr.trim().length < 4) {
      setError("Please enter a valid UPI Transaction ID / UTR.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const filePath = buildScreenshotPath(userId, "resubmit", newFile.name);

      const { error: uploadError } = await supabase.storage
        .from("payment-screenshots")
        .upload(filePath, newFile, { upsert: true });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const res = await fetch(`/api/registrations/${registrationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utr_number: newUtr.trim(),
          payment_screenshot_path: filePath,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to resubmit payment proof.");
        setUploading(false);
        return;
      }

      setResubmittingId(null);
      setNewFile(null);
      setNewUtr("");
      setUploading(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setUploading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            My Sport Registrations & Payment Status
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Payment status updates automatically from{" "}
            <strong className="text-amber-700">Pending</strong> to{" "}
            <strong className="text-emerald-700">Success</strong> once approved by Admin.
          </p>
        </div>

        {profileCompleted && (
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            Register Another Sport
          </Link>
        )}
      </div>

      {registrations.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm font-medium text-slate-600">
            You haven&apos;t registered for any sport yet.
          </p>
          {profileCompleted ? (
            <Link
              href="/register"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Register for Your First Sport
            </Link>
          ) : (
            <p className="mt-2 text-xs text-amber-700">
              Complete and save your profile details above first to unlock registration.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {registrations.map((reg) => {
            const isPending = reg.payment_status === "pending";
            const isSuccess = reg.payment_status === "success";
            const isRejected = reg.payment_status === "rejected";

            return (
              <div
                key={reg.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-lg font-bold text-slate-900">
                        {reg.sport_name}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-800">
                        {reg.category_label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      Team / Entry: {reg.team_name} ({reg.squad_count}{" "}
                      {reg.squad_count === 1 ? "player" : "players"})
                    </p>
                    <p className="text-xs text-slate-500">
                      Fee: <strong>₹{reg.amount_inr.toLocaleString("en-IN")}</strong>{" "}
                      • UTR / Ref: <code className="font-semibold text-slate-700">{reg.utr_number}</code>{" "}
                      • Submitted {new Date(reg.created_at).toLocaleDateString("en-IN")}
                    </p>
                    {reg.player_names && (
                      <p className="text-xs text-slate-600">
                        <span className="font-semibold">Squad:</span>{" "}
                        {reg.player_names}
                      </p>
                    )}
                    {reg.admin_note && (
                      <p className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700">
                        <span className="font-semibold">Admin Note:</span>{" "}
                        {reg.admin_note}
                      </p>
                    )}
                  </div>

                  {/* Status Badge + Screenshot Preview */}
                  <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-800">
                        <Clock className="h-3.5 w-3.5" />
                        Pending Verification
                      </span>
                    )}
                    {isSuccess && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Success • Approved
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-300 bg-red-100 px-3.5 py-1 text-xs font-bold text-red-800">
                        <XCircle className="h-3.5 w-3.5" />
                        Rejected
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      {reg.screenshot_url && (
                        <button
                          type="button"
                          onClick={() => setPreviewUrl(reg.screenshot_url)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Screenshot
                        </button>
                      )}

                      {isRejected && (
                        <button
                          type="button"
                          onClick={() => {
                            setResubmittingId(
                              resubmittingId === reg.id ? null : reg.id
                            );
                            setNewUtr(reg.utr_number);
                            setError(null);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 cursor-pointer"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          Re-upload
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inline Re-upload form if Rejected */}
                {isRejected && resubmittingId === reg.id && (
                  <div className="mt-4 space-y-3 rounded-xl border border-orange-200 bg-white p-4">
                    <p className="text-xs font-bold text-slate-900">
                      Re-submit Payment Screenshot
                    </p>
                    {error && (
                      <p className="text-xs font-semibold text-red-600">{error}</p>
                    )}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        value={newUtr}
                        onChange={(e) => setNewUtr(e.target.value)}
                        placeholder="Updated UTR / Transaction ID"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-600"
                      />
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) =>
                          setNewFile(e.target.files?.[0] ?? null)
                        }
                        className="text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:font-semibold file:text-blue-700"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => handleResubmit(reg.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 cursor-pointer disabled:opacity-60"
                    >
                      {uploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      {uploading ? "Uploading..." : "Submit New Proof"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal for Screenshot */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-2xl overflow-auto rounded-2xl bg-white p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewUrl(null)}
              className="absolute right-4 top-4 rounded-full bg-slate-900/80 p-1.5 text-white hover:bg-slate-900 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Uploaded payment screenshot"
              className="max-h-[82vh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
