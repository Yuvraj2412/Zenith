import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { createClient, createServiceAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const auth = await getAuthContext();
  if (!auth.configured) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 }
    );
  }

  if (!auth.user || !auth.isAdmin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required." },
      { status: 403 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const nextRole = body.role === "user" ? "user" : "admin";

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const db = createServiceAdminClient() ?? (await createClient());
  if (!db) {
    return NextResponse.json(
      { error: "Database client unavailable." },
      { status: 500 }
    );
  }

  // 1. Try SECURITY DEFINER RPC first
  const { data: rpcResult, error: rpcError } = await db.rpc(
    "admin_promote_user_by_email",
    {
      target_email: email,
      next_role: nextRole,
    }
  );

  if (!rpcError && Array.isArray(rpcResult) && rpcResult.length > 0) {
    return NextResponse.json({ admin: rpcResult[0] });
  }

  const { data: targetProfile } = await db
    .from("profiles")
    .select("id, email, full_name, role")
    .ilike("email", email)
    .maybeSingle();

  if (!targetProfile) {
    return NextResponse.json(
      {
        error: `No profile found for "${email}". Ask them to sign in once with Google first (and ensure the Admin SQL fix at the top of the page has been run in Supabase).`,
      },
      { status: 404 }
    );
  }

  const { data: updated, error } = await db
    .from("profiles")
    .update({ role: nextRole })
    .eq("id", targetProfile.id)
    .select("id, email, full_name, role")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ admin: updated });
}
