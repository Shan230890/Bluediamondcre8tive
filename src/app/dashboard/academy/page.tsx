"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PurchasedProduct {
  id: string;
  purchased_at: string;
  academy_products: {
    id: string;
    slug: string;
    title: string;
    tier: string;
    description: string | null;
  } | null;
}

export default function AcademyLibraryPage() {
  const [purchases, setPurchases] = useState<PurchasedProduct[] | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("academy_purchases")
        .select("id, purchased_at, academy_products(id, slug, title, tier, description)")
        .eq("client_id", user.id)
        .order("purchased_at", { ascending: false });
      if (active) setPurchases((data as unknown as PurchasedProduct[]) ?? []);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <div className="dash-page-head">
        <h1>Academy</h1>
        <p>Your purchased courses, templates, and cohorts.</p>
      </div>

      {purchases === null ? (
        <div className="dash-grid dash-grid-2">
          <div className="skel skel-row" style={{ height: 78 }} />
          <div className="skel skel-row" style={{ height: 78 }} />
        </div>
      ) : purchases.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">
            <GraduationCap size={20} />
          </div>
          <div className="dash-empty-title">Nothing purchased yet</div>
          <p>You haven&apos;t purchased anything from the Academy yet.</p>
          <Link href="/academy" className="btn-solid">
            Browse Academy
          </Link>
        </div>
      ) : (
        <div className="dash-grid dash-grid-2">
          {purchases.map((p) =>
            p.academy_products ? (
              <div className="dash-row" key={p.id} style={{ flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--accent-2)" }}>
                  {p.academy_products.tier}
                </span>
                <div className="dash-row-title">{p.academy_products.title}</div>
                {p.academy_products.description && (
                  <p className="dash-row-sub" style={{ marginTop: 2 }}>
                    {p.academy_products.description}
                  </p>
                )}
              </div>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
