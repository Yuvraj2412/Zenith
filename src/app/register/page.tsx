import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAuthContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { PaymentStatus } from "@/types/database";
import { RegisterClient } from "@/components/RegisterClient";

async function RegisterContent({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; category?: string }>;
}) {
  const params = await searchParams;
  const { configured, user, profile } = await getAuthContext();

  const currentQuery = params.sport
    ? `/register?sport=${encodeURIComponent(params.sport)}${
        params.category
          ? `&category=${encodeURIComponent(params.category)}`
          : ""
      }`
    : "/register";

  if (!configured || !user) {
    redirect(`/login?next=${encodeURIComponent(currentQuery)}`);
  }

  if (!profile || !profile.profile_completed) {
    redirect(
      `/profile?onboarding=1&next=${encodeURIComponent(currentQuery)}`
    );
  }

  const supabase = await createClient();
  const activeRegistrations: Record<string, PaymentStatus> = {};

  if (supabase) {
    const { data: rows } = await supabase
      .from("registrations")
      .select("sport_slug, category_id, payment_status")
      .eq("user_id", user.id)
      .in("payment_status", ["pending", "success"]);

    if (rows) {
      for (const row of rows) {
        activeRegistrations[`${row.sport_slug}:${row.category_id}`] =
          row.payment_status as PaymentStatus;
      }
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6">
      <div className="mb-8">
        <p className="label text-[#FF7A00]">
          ZENITH 2027 • Step 1 of 2
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium text-white sm:text-4xl">
          Team Registration
        </h1>
        <p className="mt-1 text-sm text-blue-100/85">
          Select your sport, enter your team &amp; accommodation details, then
          proceed to the payment page.
        </p>
      </div>

      <RegisterClient
        profile={profile}
        initialSportSlug={params.sport}
        initialCategoryId={params.category}
        activeRegistrations={activeRegistrations}
      />
    </div>
  );
}

export default function RegisterPage(props: PageProps<"/register">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
          <div className="h-32 animate-pulse rounded-sm bg-slate-200" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-96 animate-pulse rounded-sm bg-slate-200" />
            <div className="h-96 animate-pulse rounded-sm bg-slate-200" />
          </div>
        </div>
      }
    >
      <RegisterContent searchParams={props.searchParams} />
    </Suspense>
  );
}
