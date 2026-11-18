import "server-only";
import type { User } from "@supabase/supabase-js";
import { getSupabaseEnv, isAdminEmail } from "./supabase/config";
import { createClient, createServiceAdminClient } from "./supabase/server";
import type { Profile } from "@/types/database";

export type AuthContext = {
  configured: boolean;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
};

export async function getAuthContext(): Promise<AuthContext> {
  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    return {
      configured: false,
      user: null,
      profile: null,
      isAdmin: false,
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      configured: false,
      user: null,
      profile: null,
      isAdmin: false,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      configured: true,
      user: null,
      profile: null,
      isAdmin: false,
    };
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  // Ensure profile row exists even if user signed up before schema trigger ran
  if (!profile) {
    const metadata = user.user_metadata ?? {};
    const inferredName =
      (typeof metadata.full_name === "string" && metadata.full_name) ||
      (typeof metadata.name === "string" && metadata.name) ||
      "";
    const inferredAvatar =
      (typeof metadata.avatar_url === "string" && metadata.avatar_url) ||
      (typeof metadata.picture === "string" && metadata.picture) ||
      null;

    const { data: inserted } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          email: user.email ?? "",
          full_name: inferredName,
          avatar_url: inferredAvatar,
        },
        { onConflict: "id" }
      )
      .select("*")
      .maybeSingle<Profile>();

    profile = inserted ?? null;
  }

  // Optional auto-promotion if ADMIN_EMAILS + SUPABASE_SERVICE_ROLE_KEY are set
  if (profile && profile.role !== "admin" && isAdminEmail(user.email)) {
    const serviceClient = createServiceAdminClient();
    if (serviceClient) {
      const { data: promoted } = await serviceClient
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", user.id)
        .select("*")
        .maybeSingle<Profile>();
      if (promoted) {
        profile = promoted;
      }
    }
  }

  const isAdmin =
    profile?.role === "admin" || isAdminEmail(user.email);

  return {
    configured: true,
    user,
    profile,
    isAdmin,
  };
}
