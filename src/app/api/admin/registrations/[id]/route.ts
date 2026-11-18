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
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!updated) {
    return NextResponse.json(
      { error: "Registration not found or permission denied by RLS." },
      { status: 404 }
    );
  }

  return NextResponse.json({ registration: updated });
}
