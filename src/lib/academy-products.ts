/** Placeholder/example Academy catalogue for the marketing site. Mirrors
 * the shape of the `academy_products` table (supabase/migrations/0001_init.sql)
 * so this becomes a straight swap for a Supabase query once purchases are wired up. */
export type AcademyProduct = {
  slug: string;
  title: string;
  tier: "entry" | "flagship" | "premium";
  price: number;
  description: string;
  longDescription: string;
  outcomes: string[];
};

export const ACADEMY_PRODUCTS: AcademyProduct[] = [
  {
    slug: "content-calendar-template-pack",
    title: "Content Calendar Template Pack",
    tier: "entry",
    price: 97,
    description: "A ready-to-use content calendar system with prompts, categories, and a posting cadence you can run yourself.",
    longDescription:
      "The exact content calendar structure we use with Starter-tier clients, rebuilt as a self-serve template pack. Includes a 90-day content calendar, a prompt bank organised by category, and a simple weekly review checklist so you know what's working without guessing.",
    outcomes: [
      "A 90-day content calendar you can start using today",
      "A prompt bank covering education, offer, and story-driven content",
      "A weekly review checklist to catch what's working early",
    ],
  },
  {
    slug: "brand-positioning-flagship-course",
    title: "Brand Positioning Flagship Course",
    tier: "flagship",
    price: 497,
    description: "A full course walking through how we build a brand's positioning from scratch, before a single piece of content gets made.",
    longDescription:
      "Positioning is the step most brands skip, and it's the reason their content doesn't land. This course walks through the exact process our strategy lead runs with every new client: market mapping, audience definition, message testing, and a final positioning document you can hand to any writer or designer.",
    outcomes: [
      "A finished positioning document for your brand",
      "A repeatable process you can rerun as your market shifts",
      "Worksheets and templates included, lifetime access",
    ],
  },
  {
    slug: "marketing-cohort-1-1-review",
    title: "Marketing Cohort with 1:1 Review",
    tier: "premium",
    price: 2497,
    description: "A guided cohort with direct, 1:1 feedback on your marketing from our team, run in small groups.",
    longDescription:
      "For founders who want more than a course: direct feedback on your actual campaigns, content, and positioning from our team, delivered inside a small cohort so you're not competing for attention. Includes live sessions, async review, and priority support for the length of the cohort.",
    outcomes: [
      "Direct, 1:1 feedback on your live marketing",
      "Small-group cohort, not a mass course",
      "Priority support for the full cohort period",
    ],
  },
];
