import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const utrNumber = String(body.utr_number ?? "").trim();
  const screenshotPath = String(body.payment_screenshot_path ?? "").trim();

  if (utrNumber.length < 4) {
    return NextResponse.json(
      { error: "Please enter a valid UPI Transaction ID / UTR reference." },
      { status: 400 }
    );
  }

  if (!screenshotPath || !screenshotPath.startsWith(`${user.id}/`)) {
    return NextResponse.json(
      { error: "Please upload a new payment screenshot." },
      { status: 400 }
    );
  }

  const { data: existing } = await supabase
    .from("registrations")
    .select("id, user_id, payment_status")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json(
      { error: "Registration not found." },
      { status: 404 }
    );
  }

  if (existing.payment_status !== "rejected") {
    return NextResponse.json(
      { error: "Only rejected registrations can be re-submitted." },
      { status: 400 }
    );
  }

  const { data: updated, error } = await supabase
    .from("registrations")
    .update({
      utr_number: utrNumber,
      payment_screenshot_path: screenshotPath,
      payment_status: "pending",
      admin_note: "",
      reviewed_by: null,
      reviewed_at: null,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ registration: updated });
}
