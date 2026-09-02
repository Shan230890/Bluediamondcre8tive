"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  FolderOpen,
  ShieldCheck,
  GraduationCap,
  Users,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ListTodo,
} from "lucide-react";
import { LogoMark } from "@/components/LogoMark";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/tasks", label: "Tasks", icon: ListTodo },
  { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
  { href: "/dashboard/deliverables", label: "Deliverables", icon: FolderOpen },
  { href: "/dashboard/vault", label: "Vault", icon: ShieldCheck },
  { href: "/dashboard/academy", label: "Academy", icon: GraduationCap },
] as const;

const TEAM_ITEM = { href: "/dashboard/team", label: "Your Cre8tive Team", icon: Users } as const;
const SETTINGS_ITEM = { href: "/dashboard/settings", label: "Settings", icon: Settings } as const;

export function Sidebar({
  onNavigate,
  onSignOut,
  open,
  collapsed,
  onToggleCollapsed,
}: {
  onNavigate?: () => void;
  onSignOut: () => void;
  /** Adds the mobile "open" (slide-in) class — no-op above the 860px breakpoint where the sidebar is always visible. */
  open?: boolean;
  /** Desktop-only narrow rail state, persisted to localStorage by the shell. */
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
  }

  function renderLink(item: { href: string; label: string; icon: typeof LayoutDashboard }) {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        title={collapsed ? item.label : undefined}
        className={`dash-nav-link ${active ? "active" : ""}`}
      >
        <Icon size={16} strokeWidth={2} />
        <span className="dash-nav-label">{item.label}</span>
      </Link>
    );
  }

  return (
    <aside className={`dash-sidebar ${open ? "open" : ""} ${collapsed ? "collapsed" : ""}`}>
      <div className="dash-sidebar-brand">
        <LogoMark size="md" surface="dark" iconOnly />
        <span className="dash-sidebar-brand-text">Blue Diamond Cre8tive</span>
        {onToggleCollapsed && (
          <button
            type="button"
            className="dash-collapse-btn"
            onClick={onToggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
          </button>
        )}
      </div>
      <nav className="dash-nav">
        <p className="dash-nav-section-label">Menu</p>
        {NAV_ITEMS.map(renderLink)}

        <p className="dash-nav-section-label">Team</p>
        {renderLink(TEAM_ITEM)}

        <p className="dash-nav-section-label">Account</p>
        {renderLink(SETTINGS_ITEM)}
      </nav>
      <div className="dash-sidebar-footer">
        <button type="button" className="dash-signout" onClick={onSignOut} title={collapsed ? "Sign out" : undefined}>
          <LogOut size={15} />
          <span className="dash-nav-label">Sign out</span>
        </button>
      </div>
    </aside>
  );
}
