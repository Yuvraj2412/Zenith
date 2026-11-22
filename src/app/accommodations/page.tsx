import { Suspense } from "react";
import { Building2 } from "lucide-react";
import { getAuthContext } from "@/lib/auth";
import { getPaymentConfig } from "@/lib/supabase/config";
import { AccommodationsClient } from "@/components/AccommodationsClient";
import { ScrollHorizonOverlay } from "@/components/ScrollHorizonOverlay";

async function AccommodationsContent({
  searchParams,
}: {
  searchParams: Promise<{ team_id?: string }>;
}) {
  const params = await searchParams;
  const { user, profile } = await getAuthContext();

  return (
    <div className="relative min-h-[100svh] bg-gradient-to-b from-[#071A3E] via-[#0B2559] to-[#071A3E] pb-20 pt-28 text-white">
      <ScrollHorizonOverlay />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur-md">
            <Building2 className="h-3.5 w-3.5 text-[#FF7A00]" />
            <span className="label !text-[0.62rem] text-[#38BDF8]">
              ZENITH 2027 • Campus Stay Portal
            </span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-medium text-white sm:text-5xl">
            Campus <span className="text-[#FF7A00]">Accommodations</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-blue-100/85 sm:text-base">
            Already have a registered team? Anyone from your team can book
            on-campus hostel stay by entering your matching{" "}
            <strong>Team ID</strong> below.
          </p>
        </div>

        <AccommodationsClient
          userId={user?.id ?? null}
          userFullName={profile?.full_name ?? ""}
          profileCompleted={Boolean(profile?.profile_completed)}
          initialTeamCode={params.team_id ?? ""}
          paymentConfig={getPaymentConfig()}
        />
      </div>
    </div>
  );
}

export default function AccommodationsPage(
  props: PageProps<"/accommodations">
) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100svh] bg-[#071A3E] px-4 pt-28 sm:px-6">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="h-28 animate-pulse rounded-2xl bg-white/10" />
            <div className="h-80 animate-pulse rounded-2xl bg-white/10" />
          </div>
        </div>
      }
    >
      <AccommodationsContent searchParams={props.searchParams} />
    </Suspense>
  );
}
