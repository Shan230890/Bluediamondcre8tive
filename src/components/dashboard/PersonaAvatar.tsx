import { initials, PERSONA_AVATAR_COLORS } from "@/lib/personas/avatar";
import type { PersonaSlug } from "@/lib/personas/blue-diamond";

/**
 * Shared monogram avatar for one of the six built-in personas — text
 * initials on a fixed per-persona background color (see avatar.ts), never
 * an icon/emoji. Applies on top of whatever avatar-shaped base class the
 * call site already uses (persona-avatar, chat-header-avatar,
 * chat-row-avatar, kanban-assignee-avatar, badge-avatar, …) so it drops
 * into any existing layout without new avatar CSS per surface.
 */
export function PersonaAvatar({
  slug,
  name,
  className = "persona-avatar",
}: {
  slug: PersonaSlug;
  name: string;
  className?: string;
}) {
  return (
    <span className={`${className} monogram`} style={{ background: PERSONA_AVATAR_COLORS[slug], color: "#fff" }}>
      {initials(name)}
    </span>
  );
}
