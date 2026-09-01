"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LogoMark } from "@/components/LogoMark";
import "../landing-e.css";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setPending(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    // /dashboard doesn't exist yet (later phase) — this is fine, middleware
    // and this redirect are wired up now so nothing needs to change later.
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="landing-e" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Link href="/" style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <LogoMark size="lg" />
        </Link>
        <form onSubmit={handleSubmit} className="form-shell">
          <h1 style={{ fontSize: 22, marginBottom: 20, textAlign: "center" }}>Sign in</h1>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" disabled={pending} className="btn-solid" style={{ width: "100%", border: "none", marginTop: 4 }}>
            {pending ? "Signing in..." : "Sign in"}
          </button>

          <p style={{ marginTop: 18, fontSize: 13, textAlign: "center", color: "var(--muted)" }}>
            No account? <Link href="/signup" style={{ color: "var(--accent)", fontWeight: 600 }}>Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
