/**
 * Competitor Intelligence Vault (Silo 2) tier gating. Reads the client's
 * subscriptions row for silo='vault' to get `tier`, then this pure function
 * decides how many distinct competitors they may track. Kept separate from
 * any Supabase call so it's trivially unit-testable.
 */
export type VaultTier = "starter" | "pro" | "agency";

/** Returns the max distinct competitors allowed for a tier, or null for unlimited. */
export function getCompetitorLimit(tier: string): number | null {
  switch (tier.toLowerCase()) {
    case "starter":
      return 1;
    case "pro":
      return 5;
    case "agency":
      return null;
    default:
      // Unknown/missing tier — fail closed rather than open.
      return 0;
  }
}
