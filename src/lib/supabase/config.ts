export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

  const isPlaceholderUrl =
    !url || url.includes("your-project-ref") || !url.startsWith("http");
  const isPlaceholderKey =
    !anonKey || anonKey.includes("your-supabase-anon-key");

  return {
    url,
    anonKey,
    serviceRoleKey,
    isConfigured: !isPlaceholderUrl && !isPlaceholderKey,
  };
}

export function getPaymentConfig() {
  return {
    upiId: process.env.NEXT_PUBLIC_UPI_ID?.trim() || "zenith.iist@sbi",
    upiName:
      process.env.NEXT_PUBLIC_UPI_NAME?.trim() || "ZENITH IIST SPORTS FEST",
    note:
      process.env.NEXT_PUBLIC_PAYMENT_NOTE?.trim() ||
      "Scan the UPI QR or pay to the UPI ID, then attach your payment screenshot below.",
  };
}

export function getAdminEmailsFromEnv(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return getAdminEmailsFromEnv().includes(email.trim().toLowerCase());
}
