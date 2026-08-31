import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

/**
 * Server component: resolves the signed-in user's session and profile row,
 * then hands off to the client shell. Middleware already gates /dashboard/*
 * (redirects signed-out visitors to /login) — this redirect is a backstop
 * for the rare case a stale session slips past it.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, company")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <DashboardShell
      email={user.email ?? ""}
      profile={profile ? { name: profile.name, company: profile.company } : null}
    >
      {children}
    </DashboardShell>
  );
}
