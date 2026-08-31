"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/LogoMark";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/invoices", label: "Invoices" },
  { href: "/dashboard/deliverables", label: "Deliverables" },
  { href: "/dashboard/vault", label: "Vault" },
  { href: "/dashboard/academy", label: "Academy" },
  { href: "/dashboard/team", label: "Your Cre8tive Team" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function Sidebar({
  onNavigate,
  onSignOut,
  open,
}: {
  onNavigate?: () => void;
  onSignOut: () => void;
  /** Adds the mobile "open" (slide-in) class — no-op above the 860px breakpoint where the sidebar is always visible. */
  open?: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside className={`dash-sidebar ${open ? "open" : ""}`}>
      <div className="dash-sidebar-brand">
        <LogoMark size="sm" />
        Blue Diamond Cre8tive
      </div>
      <nav className="dash-nav">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`dash-nav-link ${active ? "active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="dash-sidebar-footer">
        <button type="button" className="dash-signout" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
