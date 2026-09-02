import type { PersonaSlug } from "./blue-diamond";

/**
 * Text-monogram helper shared by every avatar surface in the dashboard
 * (built-in personas and client-built custom agents alike) — this app never
 * renders icon/emoji identities for agents, per standing instruction.
 */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Fixed, distinct background colors for the six built-in personas' monogram
 * avatars — hardcoded per slug (never hash-derived) so a given persona is
 * always the same color everywhere and none can collide with another.
 * Derived from the existing --accent / --accent-2 / --dark-2 / --accent-3
 * token family (a couple deepened or hue-shifted where needed for contrast).
 * No gold/amber. Every value below is verified >=4.5:1 contrast against
 * white monogram text (WCAG AA for normal text, not just "large text"):
 *   henry  #b8451c  ~5.4:1   (deepened --accent burnt orange)
 *   harvey #0f2437  ~15.8:1  (--dark-2, unchanged)
 *   ray    #527799  ~4.7:1   (--accent-2, unchanged)
 *   anna   #1f7a5c  ~5.3:1   (derived teal)
 *   scott  #5b3f8f  ~8.2:1   (derived violet)
 *   barry  #333333  ~12.6:1  (--accent-3, unchanged)
 */
export const PERSONA_AVATAR_COLORS: Record<PersonaSlug, string> = {
  henry: "#b8451c",
  harvey: "#0f2437",
  ray: "#527799",
  anna: "#1f7a5c",
  scott: "#5b3f8f",
  barry: "#333333",
};
