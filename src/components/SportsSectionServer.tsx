import { SPORTS } from "@/data/sports";
import { getAuthContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { PaymentStatus } from "@/types/database";
import {
  SportsShowcase,
  type RegistrationStatusMap,
} from "./SportsShowcase";

export async function SportsSectionServer() {
  const { user, profile } = await getAuthContext();

  let authMode: "guest" | "incomplete-profile" | "ready" = "guest";
  const registrationStatuses: RegistrationStatusMap = {};

  if (user) {
    authMode = profile?.profile_completed ? "ready" : "incomplete-profile";

    const supabase = await createClient();
    if (supabase) {
      const { data: rows } = await supabase
        .from("registrations")
        .select("sport_slug, category_id, payment_status")
        .eq("user_id", user.id);

      if (rows) {
        for (const row of rows) {
          registrationStatuses[`${row.sport_slug}:${row.category_id}`] =
            row.payment_status as PaymentStatus;
        }
      }
    }
  }

  return (
    <SportsShowcase
      sports={SPORTS}
      authMode={authMode}
      registrationStatuses={registrationStatuses}
    />
  );
}
