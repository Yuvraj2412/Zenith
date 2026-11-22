import { NextResponse } from "next/server";
import { getAccommodationFeePerPlayerInr } from "@/data/sports";
import { createClient, createServiceAdminClient } from "@/lib/supabase/server";
import { extractTeamHexPrefix, formatTeamCode } from "@/lib/teamCode";

type TeamMatch = {
  id: string;
  team_name: string;
  sport_name: string;
  category_label: string;
  squad_count: number;
};

async function findTeamByPrefix(prefix: string): Promise<TeamMatch | null> {
  const db = createServiceAdminClient() ?? (await createClient());
  if (!db) return null;

  // Try RPC first if defined in schema.sql (allows teammates to look up captain's Team ID)
  const { data: rpcRows } = await db.rpc("lookup_team_by_code", {
    code_prefix: prefix,
  });

  if (Array.isArray(rpcRows) && rpcRows.length > 0) {
    return rpcRows[0] as TeamMatch;
  }

  // Fallback query against visible registrations
  const { data: rows } = await db
    .from("registrations")
    .select("id, team_name, sport_name, category_label, squad_count")
    .neq("sport_slug", "accommodation")
    .order("created_at", { ascending: false })
    .limit(200);

  if (!rows) return null;

  const matched = rows.find((r) =>
    r.id.replace(/-/g, "").toLowerCase().startsWith(prefix)
  );
  return matched ?? null;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawCode = url.searchParams.get("team_id") ?? "";
  const prefix = extractTeamHexPrefix(rawCode);

  if (!prefix) {
    return NextResponse.json(
      { error: "Please enter a valid Team ID (e.g. ZEN-A4F91C)." },
      { status: 400 }
    );
  }

  const matched = await findTeamByPrefix(prefix);
  if (!matched) {
    return NextResponse.json(
      {
        error:
          "No registered team found with that Team ID. Please check the ID from your Profile page.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    team: {
      team_code: formatTeamCode(matched.id),
      team_name: matched.team_name,
      sport_name: matched.sport_name,
      category_label: matched.category_label,
      squad_count: matched.squad_count,
    },
  });
}

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
      {
        error:
          "Please complete your profile details first before booking accommodation.",
      },
      { status: 403 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rawTeamCode = String(body.team_code ?? "");
  const prefix = extractTeamHexPrefix(rawTeamCode);
  const membersCount = Number(body.members_count);
  const memberNames = String(body.member_names ?? "").trim();
  const utrNumber = String(body.utr_number ?? "").trim();
  const screenshotPath = String(body.payment_screenshot_path ?? "").trim();

  if (!prefix) {
    return NextResponse.json(
      { error: "Please enter a valid Team ID (e.g. ZEN-A4F91C)." },
      { status: 400 }
    );
  }

  const matched = await findTeamByPrefix(prefix);
  if (!matched) {
    return NextResponse.json(
      { error: "Matching Team ID not found. Please verify your Team ID first." },
      { status: 404 }
    );
  }

  if (!Number.isInteger(membersCount) || membersCount < 1 || membersCount > 25) {
    return NextResponse.json(
      { error: "Members count must be between 1 and 25." },
      { status: 400 }
    );
  }

  if (utrNumber.length < 4) {
    return NextResponse.json(
      { error: "Please enter a valid Payment ID / UTR reference." },
      { status: 400 }
    );
  }

  if (!screenshotPath || !screenshotPath.startsWith(`${user.id}/`)) {
    return NextResponse.json(
      { error: "Please upload your payment screenshot." },
      { status: 400 }
    );
  }

  const canonicalCode = formatTeamCode(matched.id);
  const totalAmountInr = membersCount * getAccommodationFeePerPlayerInr();
  const uniqueCategoryId = `team-${prefix}-${Date.now()}`;

  const { data: booking, error } = await supabase
    .from("registrations")
    .insert({
      user_id: user.id,
      sport_slug: "accommodation",
      sport_name: "Campus Accommodation",
      category_id: uniqueCategoryId,
      category_label: `Team ${canonicalCode} (${matched.sport_name})`,
      team_name: matched.team_name,
      squad_count: membersCount,
      player_names: memberNames,
      accommodation_required: true,
      accommodation_players: membersCount,
      amount_inr: totalAmountInr,
      utr_number: utrNumber,
      payment_screenshot_path: screenshotPath,
      payment_status: "pending",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ registration: booking }, { status: 201 });
}
