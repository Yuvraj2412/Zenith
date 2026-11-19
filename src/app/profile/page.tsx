import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { getAuthContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Registration, RegistrationWithSignedUrl } from "@/types/database";
import { ProfileForm } from "@/components/ProfileForm";
import { MyRegistrationsList } from "@/components/MyRegistrationsList";

async function ProfileContent({
  searchParams,
}: {
  searchParams: Promise<{ onboarding?: string; submitted?: string; next?: string }>;
}) {
  const params = await searchParams;
  const { configured, user, profile } = await getAuthContext();

  if (!configured || !user) {
    redirect("/login?next=/profile");
  }

  const supabase = await createClient();
  let registrationsWithUrls: RegistrationWithSignedUrl[] = [];

  if (supabase) {
    const { data: rows } = await supabase
      .from("registrations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .returns<Registration[]>();

    if (rows && rows.length > 0) {
      registrationsWithUrls = await Promise.all(
        rows.map(async (row) => {
          const { data: signed } = await supabase.storage
            .from("payment-screenshots")
            .createSignedUrl(row.payment_screenshot_path, 3600);
          return {
            ...row,
            screenshot_url: signed?.signedUrl ?? null,
          };
        })
      );
    }
  }

  const fallbackProfile = profile ?? {
    id: user.id,
    email: user.email ?? "",
    full_name:
      (typeof user.user_metadata?.full_name === "string" &&
        user.user_metadata.full_name) ||
      "",
    avatar_url: null,
    phone: "",
    college: "",
    student_id: "",
    age: null,
    gender: "",
    city: "",
    state: "",
    aadhar_last4: "",
    role: "user" as const,
    profile_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const showOnboardingBanner =
    params.onboarding === "1" || !fallbackProfile.profile_completed;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6">
      {showOnboardingBanner && (
        <div className="flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-orange-950">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
          <div>
            <p className="text-sm font-bold">
              Step 1 Required: Complete Your Profile Details
            </p>
            <p className="mt-0.5 text-xs text-orange-800">
              Fill in your personal, college, and ID verification details below.
              Once saved, you can register for any ZENITH sport.
            </p>
          </div>
        </div>
      )}

      {params.submitted === "1" && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-bold">
              Registration & Payment Screenshot Submitted!
            </p>
            <p className="mt-0.5 text-xs text-emerald-800">
              Your payment status is currently <strong>Pending</strong>. Once
              verified by an admin, it will update to <strong>Success</strong>{" "}
              right here on your profile.
            </p>
          </div>
        </div>
      )}

      <ProfileForm
        profile={fallbackProfile}
        nextPath={params.next ?? null}
      />

      <MyRegistrationsList
        registrations={registrationsWithUrls}
        userId={user.id}
        profileCompleted={fallbackProfile.profile_completed}
      />
    </div>
  );
}

export default function ProfilePage(props: PageProps<"/profile">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6">
          <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      }
    >
      <ProfileContent searchParams={props.searchParams} />
    </Suspense>
  );
}
