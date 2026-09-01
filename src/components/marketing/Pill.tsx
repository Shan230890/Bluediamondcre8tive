import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type Variant = "dark" | "light" | "outline";

const base = "bdc-pill";

function Icon({ trailing }: { trailing?: "arrow" | "arrow-up-right" }) {
  if (!trailing) return null;
  return (
    <span className="bdc-pill-badge">
      {trailing === "arrow-up-right" ? <ArrowUpRight size={14} /> : <ArrowRight size={14} />}
    </span>
  );
}

/** Pill button — spring-hover on the whole control (CSS-driven), optional
 * trailing circular icon badge that shifts on hover. Renders as a Link when
 * `href` is given, otherwise a <button> (for modal triggers). */
export function Pill({
  href,
  onClick,
  variant = "dark",
  trailing,
  children,
  type = "button",
  className = "",
}: {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  trailing?: "arrow" | "arrow-up-right";
  children: ReactNode;
  type?: "button" | "submit";
  className?: string;
}) {
  const cls = `${base} bdc-pill-${variant} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {children}
        <Icon trailing={trailing} />
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
      <Icon trailing={trailing} />
    </button>
  );
}

export function Eyebrow({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <span className={`bdc-eyebrow bdc-eyebrow-${tone}`}>
      <span className="bdc-eyebrow-dot" />
      {children}
    </span>
  );
}

export function TagChip({ children }: { children: ReactNode }) {
  return <span className="bdc-tag-chip">{children}</span>;
}
