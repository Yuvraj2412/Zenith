import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSportCategory } from "@/data/sports";
import { getAuthContext } from "@/lib/auth";
import { getPaymentConfig } from "@/lib/supabase/config";
import { PaymentClient } from "@/components/PaymentClient";

async function PaymentContent({
  searchParams,
}: {
  searchParams: Promise<{
    sport?: string;
    category?: string;
    team?: string;
    squad?: string;
    players?: string;
    acc?: string;
    accPlayers?: string;
  }>;
}) {
  const params = await searchParams;
  const { configured, user, profile } = await getAuthContext();

  if (!configured || !user) {
    redirect("/login?next=/register");
  }

  if (!profile || !profile.profile_completed) {
    redirect("/profile?onboarding=1&next=/register");
  }

  const resolved = params.sport
    ? getSportCategory(params.sport, params.category)
    : undefined;

  if (!resolved || !params.team) {
    redirect("/register");
  }

  const { sport, category } = resolved;
  const rawSquad = Number(params.squad);
  const squadCount =
    Number.isInteger(rawSquad) &&
    rawSquad >= category.minPlayers &&
    rawSquad <= category.maxPlayers
      ? rawSquad
      : category.minPlayers;

  const accommodationRequired = params.acc === "1";
  const rawAccPlayers = Number(params.accPlayers);
  const accommodationPlayers = accommodationRequired
    ? Math.max(
        1,
        Math.min(
          squadCount,
          Number.isInteger(rawAccPlayers) ? rawAccPlayers : squadCount
        )
      )
    : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="label text-[#D9531E]">ZENITH 2027 • Step 2 of 2</p>
        <h1 className="mt-1 font-display text-3xl font-medium text-[#091930]">
          Booking Summary &amp; Payment
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Review your booking details, scan the UPI QR code, enter your Payment
          ID, and upload your screenshot.
        </p>
      </div>

      <PaymentClient
        profile={profile}
        sport={sport}
        category={category}
        teamName={params.team}
        squadCount={squadCount}
        playerNames={params.players ?? profile.full_name}
        accommodationRequired={accommodationRequired}
        accommodationPlayers={accommodationPlayers}
        paymentConfig={getPaymentConfig()}
      />
    </div>
  );
}

export default function PaymentPage(props: PageProps<"/payment">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
          <div className="h-24 animate-pulse rounded-sm bg-slate-200" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-96 animate-pulse rounded-sm bg-slate-200" />
            <div className="h-96 animate-pulse rounded-sm bg-slate-200" />
          </div>
        </div>
      }
    >
      <PaymentContent searchParams={props.searchParams} />
    </Suspense>
  );
}
