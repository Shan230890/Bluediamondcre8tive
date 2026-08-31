"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/format";

interface Invoice {
  id: string;
  amount: number;
  status: "paid" | "due" | "overdue";
  due_date: string | null;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("invoices")
        .select("id, amount, status, due_date")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });
      if (active) setInvoices(data ?? []);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <div className="dash-page-head">
        <h1>Invoices</h1>
        <p>Everything billed to your account.</p>
      </div>

      {invoices === null ? (
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Loading...</p>
      ) : invoices.length === 0 ? (
        <div className="dash-empty">No invoices yet.</div>
      ) : (
        <div className="dash-list">
          {invoices.map((inv) => (
            <div className="dash-row" key={inv.id}>
              <div>
                <div className="dash-row-title">{formatCurrency(inv.amount)}</div>
                <div className="dash-row-sub">{inv.due_date ? `Due ${inv.due_date}` : "No due date"}</div>
              </div>
              <span className={`pill pill-${inv.status}`}>{inv.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
