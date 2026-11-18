import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_GENDERS = new Set(["Male", "Female", "Other"]);

export async function PUT(request: Request) {
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

  const fullName = String(body.full_name ?? "").trim();
  const rawPhone = String(body.phone ?? "").replace(/[\s-]/g, "");
  const normalizedPhone = rawPhone.replace(/^\+91/, "");
  const college = String(body.college ?? "").trim();
  const studentId = String(body.student_id ?? "").trim();
  const ageNum = Number(body.age);
  const gender = String(body.gender ?? "").trim();
  const city = String(body.city ?? "").trim();
  const state = String(body.state ?? "").trim();
  const aadharLast4 = String(body.aadhar_last4 ?? "").trim();

  if (fullName.length < 2) {
    return NextResponse.json(
      { error: "Please enter your full name." },
      { status: 400 }
    );
  }
  if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
    return NextResponse.json(
      { error: "Please enter a valid 10-digit Indian mobile number." },
      { status: 400 }
    );
  }
  if (college.length < 3) {
    return NextResponse.json(
      { error: "Please enter your college or university name." },
      { status: 400 }
    );
  }
  if (studentId.length < 2) {
    return NextResponse.json(
      { error: "Please enter your College ID / Roll Number." },
      { status: 400 }
    );
  }
  if (!Number.isInteger(ageNum) || ageNum < 15 || ageNum > 35) {
    return NextResponse.json(
      { error: "Please enter a valid age between 15 and 35." },
      { status: 400 }
    );
  }
  if (!ALLOWED_GENDERS.has(gender)) {
    return NextResponse.json(
      { error: "Please select a valid gender." },
      { status: 400 }
    );
  }
  if (city.length < 2 || state.length < 2) {
    return NextResponse.json(
      { error: "Please enter both your city and state." },
      { status: 400 }
    );
  }
  if (!/^\d{4}$/.test(aadharLast4)) {
    return NextResponse.json(
      { error: "Please enter the last 4 digits of your Aadhar ID." },
      { status: 400 }
    );
  }

  const metadata = user.user_metadata ?? {};
  const avatarUrl =
    (typeof metadata.avatar_url === "string" && metadata.avatar_url) ||
    (typeof metadata.picture === "string" && metadata.picture) ||
    null;

  const { data: updated, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email ?? "",
        full_name: fullName,
        avatar_url: avatarUrl,
        phone: `+91 ${normalizedPhone}`,
        college,
        student_id: studentId,
        age: ageNum,
        gender,
        city,
        state,
        aadhar_last4: aadharLast4,
        profile_completed: true,
      },
      { onConflict: "id" }
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ profile: updated });
}
