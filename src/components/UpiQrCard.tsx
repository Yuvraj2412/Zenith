"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, QrCode } from "lucide-react";

type Props = {
  upiId: string;
  upiName: string;
  paymentNote: string;
  amountInr: number;
  sportLabel: string;
};

export function UpiQrCard({
  upiId,
  upiName,
  paymentNote,
  amountInr,
  sportLabel,
}: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    upiName
  )}&am=${amountInr}&cu=INR&tn=${encodeURIComponent(`ZENITH 2027 - ${sportLabel}`)}`;

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(upiUri, {
      width: 220,
      margin: 2,
      color: {
        dark: "#0A1D37",
        light: "#FFFFFF",
      },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl("");
      });
    return () => {
      cancelled = true;
    };
  }, [upiUri]);

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard might be blocked in non-HTTPS contexts
    }
  }

  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-slate-50 p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-blue-700" />
          <h3 className="font-display text-base font-bold text-slate-900">
            Scan & Pay via UPI
          </h3>
        </div>
        <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
          ₹{amountInr.toLocaleString("en-IN")}
        </span>
      </div>

      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt={`UPI QR code for ₹${amountInr}`}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="h-full w-full animate-pulse rounded-lg bg-slate-100" />
          )}
        </div>

        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Payee Name
            </p>
            <p className="text-sm font-bold text-slate-900">{upiName}</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              UPI ID
            </p>
            <div className="mt-1 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
              <code className="text-xs font-semibold text-blue-800">{upiId}</code>
              <button
                type="button"
                onClick={copyUpi}
                className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:bg-blue-100 hover:text-blue-800 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-600">{paymentNote}</p>
        </div>
      </div>
    </div>
  );
}
