"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  FolderOpen,
  FolderKanban,
  ShieldCheck,
  GraduationCap,
  Users,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ListTodo,
  LayoutTemplate,
  Radar,
  Megaphone,
  Send,
  History,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import { PERSONA_SLUGS, PERSONAS } from "@/lib/personas/blue-diamond";
import { PersonaAvatar } from "@/components/dashboard/PersonaAvatar";

/**
 * Whether the "Your Cre8tive Team" disclosure is expanded, persisted per
 * browser. Just one boolean — unlike Opsara's per-department `Set<string>`,
 * this app has a single fixed six-persona team with nothing to nest under
 * a persona besides that persona's own chat page, so there's only one
 * section to disclose. Defaults to expanded: six rows is a short, useful
 * list worth showing by default rather than making every client find and
 * click a toggle on first load.
 */
const TEAM_EXPANDED_KEY = "bdc-sidebar-team-expanded";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/tasks", label: "Tasks", icon: ListTodo },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
  { href: "/dashboard/deliverables", label: "Deliverables", icon: FolderOpen },
  { href: "/dashboard/vault", label: "Vault", icon: ShieldCheck },
  { href: "/dashboard/academy", label: "Academy", icon: GraduationCap },
] as const;

const GROWTH_ITEMS = [
  { href: "/dashboard/ai-visibility", label: "AI Visibility Report", icon: Radar },
  { href: "/dashboard/paid-media-plan", label: "Paid Media Plan", icon: Megaphone },
  { href: "/dashboard/outbound", label: "Outbound Drafts", icon: Send },
  { href: "/dashboard/memory", label: "Execution Memory", icon: History },
] as const;

const CUSTOM_AGENTS_ITEM = { href: "/dashboard/team/custom", label: "Custom agents", icon: Sparkles } as const;
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
  const [teamExpanded, setTeamExpanded] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(TEAM_EXPANDED_KEY);
      // One-time read of a client-only localStorage preference on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored !== null) setTeamExpanded(stored === "1");
    } catch {
      // localStorage unavailable (e.g. private browsing) — keep the expanded default.
    }
  }, []);

  function toggleTeam() {
    setTeamExpanded((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(TEAM_EXPANDED_KEY, next ? "1" : "0");
      } catch {
        // ignore — expand state just won't persist this session
      }
      return next;
    });
  }

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

        <p className="dash-nav-section-label">Growth</p>
        {GROWTH_ITEMS.map(renderLink)}

        <p className="dash-nav-section-label">Team</p>
        <div className="dash-team-disclosure">
          <div className={`dash-nav-link dash-team-header ${pathname === "/dashboard/team" ? "active" : ""}`}>
            <button
              type="button"
              className="dash-team-chevron-btn"
              onClick={toggleTeam}
              aria-expanded={teamExpanded}
              aria-label={teamExpanded ? "Collapse Your Cre8tive Team" : "Expand Your Cre8tive Team"}
            >
              <ChevronDown size={14} className={`dash-team-chevron ${teamExpanded ? "expanded" : ""}`} />
            </button>
            <Link
              href="/dashboard/team"
              onClick={onNavigate}
              title={collapsed ? "Your Cre8tive Team" : undefined}
              className="dash-team-header-link"
            >
              <Users size={16} strokeWidth={2} />
              <span className="dash-nav-label">Your Cre8tive Team</span>
            </Link>
          </div>
          {teamExpanded && !collapsed && (
            <div className="dash-team-rows">
              {PERSONA_SLUGS.map((slug) => {
                const persona = PERSONAS[slug];
                const href = `/dashboard/team/${slug}`;
                return (
                  <Link
                    key={slug}
                    href={href}
                    onClick={onNavigate}
                    className={`dash-team-row ${pathname === href ? "active" : ""}`}
                  >
                    <PersonaAvatar slug={slug} name={persona.name} className="sidebar-persona-avatar" />
                    <span className="dash-team-row-text">
                      <span className="dash-team-row-name">{persona.name}</span>
                      <span className="dash-team-row-role">{persona.role}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        {renderLink(CUSTOM_AGENTS_ITEM)}

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
