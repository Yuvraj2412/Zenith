import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { createClient, createServiceAdminClient } from "@/lib/supabase/server";

const ALLOWED_DECISIONS = new Set(["success", "rejected", "pending"]);

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
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

  const nextStatus = String(body.payment_status ?? "").trim();
  const adminNote = String(body.admin_note ?? "").trim();

  if (!ALLOWED_DECISIONS.has(nextStatus)) {
    return NextResponse.json(
      { error: "Invalid payment status decision." },
      { status: 400 }
    );
  }

  const adminClient = createServiceAdminClient() ?? (await createClient());
  if (!adminClient) {
    return NextResponse.json(
      { error: "Unable to initialize database client." },
      { status: 500 }
    );
  }

  // 1. Try SECURITY DEFINER RPC first (bypasses RLS update/with-check conflicts)
  const { data: rpcUpdated, error: rpcError } = await adminClient.rpc(
    "admin_review_registration",
    {
      target_id: id,
      next_status: nextStatus,
      note: adminNote,
    }
  );

  if (!rpcError && rpcUpdated) {
    const row = Array.isArray(rpcUpdated) ? rpcUpdated[0] : rpcUpdated;
    if (row) {
      return NextResponse.json({ registration: row });
    }
  }

  // 2. Fallback to standard table update if RPC is not yet created in Supabase
  const { data: updated, error } = await adminClient
    .from("registrations")
    .update({
      payment_status: nextStatus,
      admin_note: adminNote,
      reviewed_by: nextStatus === "pending" ? null : auth.user.id,
      reviewed_at: nextStatus === "pending" ? null : new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      {
        error: `${error.message}. Please run the SQL fix shown at the top of the Admin Console in your Supabase SQL Editor to grant your account database-level Admin RLS permissions.`,
      },
      { status: 400 }
    );
  }

  if (!updated) {
    return NextResponse.json(
      {
        error: `Supabase RLS blocked the approval because your profile role in Postgres is still 'user'. Copy and run the SQL fix banner at the top of the Admin Console in your Supabase SQL Editor.`,
      },
      { status: 403 }
    );
  }

  return NextResponse.json({ registration: updated });
}
