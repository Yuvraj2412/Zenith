import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSportCategory } from "@/data/sports";

export async function POST(request: Request) {
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
    return NextResponse.json(
      { error: "Please sign in with Google first." },
      { status: 401 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("profile_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.profile_completed) {
    return NextResponse.json(
      { error: "Complete your profile details before registering for a sport." },
      { status: 403 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sportSlug = String(body.sport_slug ?? "").trim();
  const categoryId = String(body.category_id ?? "").trim();
  const teamName = String(body.team_name ?? "").trim();
  const squadCount = Number(body.squad_count);
  const playerNames = String(body.player_names ?? "").trim();
  const utrNumber = String(body.utr_number ?? "").trim();
  const screenshotPath = String(body.payment_screenshot_path ?? "").trim();

  const resolved = getSportCategory(sportSlug, categoryId);
  if (!resolved) {
    return NextResponse.json(
      { error: "Invalid sport or category selected." },
      { status: 400 }
    );
  }

  const { sport, category } = resolved;

  if (teamName.length < 2) {
    return NextResponse.json(
      {
        error:
          category.entryType === "Individual"
            ? "Please enter the participant name."
            : "Please enter a team name.",
      },
      { status: 400 }
    );
  }

  if (
    !Number.isInteger(squadCount) ||
    squadCount < category.minPlayers ||
    squadCount > category.maxPlayers
  ) {
    return NextResponse.json(
      {
        error: `Squad size must be between ${category.minPlayers} and ${category.maxPlayers} for ${sport.name} (${category.label}).`,
      },
      { status: 400 }
    );
  }

  if (utrNumber.length < 4) {
    return NextResponse.json(
      { error: "Please enter a valid UPI Transaction ID / UTR reference." },
      { status: 400 }
    );
  }

  if (!screenshotPath || !screenshotPath.startsWith(`${user.id}/`)) {
    return NextResponse.json(
      { error: "Please upload your payment screenshot before submitting." },
      { status: 400 }
    );
  }

  const { data: existing } = await supabase
    .from("registrations")
    .select("id, payment_status")
    .eq("user_id", user.id)
    .eq("sport_slug", sport.slug)
    .eq("category_id", category.id)
    .in("payment_status", ["pending", "success"])
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      {
        error: `You already have a ${existing.payment_status} registration for ${sport.name} (${category.label}).`,
      },
      { status: 409 }
    );
  }

  const { data: registration, error } = await supabase
    .from("registrations")
    .insert({
      user_id: user.id,
      sport_slug: sport.slug,
      sport_name: sport.name,
      category_id: category.id,
      category_label: category.label,
      team_name: teamName,
      squad_count: squadCount,
      player_names: playerNames,
      amount_inr: category.feeInr,
      utr_number: utrNumber,
      payment_screenshot_path: screenshotPath,
      payment_status: "pending",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ registration }, { status: 201 });
}
