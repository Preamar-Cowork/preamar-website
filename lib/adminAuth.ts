import { createClient as createServerAuthClient } from "@/lib/supabase/server";

/** True when the request comes from a logged-in /admin user. */
export async function isAdmin(): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await createServerAuthClient().auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}
