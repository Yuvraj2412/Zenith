import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function sanitizeNextPath(rawNext: string | null): string {
  if (!rawNext) return "/profile";
  if (!rawNext.startsWith("/") || rawNext.startsWith("//") || rawNext.startsWith("/\\")) {
    return "/profile";
  }
  return rawNext;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = sanitizeNextPath(requestUrl.searchParams.get("next"));
  const origin = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/login?error=supabase_not_configured`);
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error?.message || "auth_failed")}`
    );
  }

  // Ensure profile exists and check if profile onboarding is complete
  const user = data.user;
  const metadata = user.user_metadata ?? {};
  const fullName =
    (typeof metadata.full_name === "string" && metadata.full_name) ||
    (typeof metadata.name === "string" && metadata.name) ||
    "";
  const avatarUrl =
    (typeof metadata.avatar_url === "string" && metadata.avatar_url) ||
    (typeof metadata.picture === "string" && metadata.picture) ||
    null;

  let { data: profile } = await supabase
    .from("profiles")
    .select("profile_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    const { data: created } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          email: user.email ?? "",
          full_name: fullName,
          avatar_url: avatarUrl,
        },
        { onConflict: "id" }
      )
      .select("profile_completed")
      .maybeSingle();
    profile = created;
  }

  if (!profile?.profile_completed) {
    const target =
      nextPath && nextPath !== "/profile"
        ? `/profile?onboarding=1&next=${encodeURIComponent(nextPath)}`
        : "/profile?onboarding=1";
    return NextResponse.redirect(`${origin}${target}`);
  }

  return NextResponse.redirect(`${origin}${nextPath}`);
}
