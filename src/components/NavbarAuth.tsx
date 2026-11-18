import { getAuthContext } from "@/lib/auth";
import { NavbarAuthClient } from "./NavbarAuthClient";

export async function NavbarAuth() {
  const { configured, user, profile, isAdmin } = await getAuthContext();

  return (
    <NavbarAuthClient
      configured={configured}
      userEmail={user?.email ?? null}
      fullName={profile?.full_name ?? null}
      avatarUrl={profile?.avatar_url ?? null}
      profileCompleted={Boolean(profile?.profile_completed)}
      isAdmin={isAdmin}
    />
  );
}
