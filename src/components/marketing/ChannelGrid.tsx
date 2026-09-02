/**
 * Channel-coverage grid, structural pattern from the approved mockup
 * (`.channel-grid` / `.channel-card`). Copy is pulled directly from the
 * real, current tier/channel copy on /services and /pricing — no invented
 * service names, and no video-platform channel not actually part of the
 * real Growth tier copy, which is "Reddit and digital PR".
 */
const CHANNELS: { kicker: string; title: string; body: string }[] = [
  {
    kicker: "Services",
    title: "SEO & content",
    body: "Content calendars, on-site copy, and campaigns built to compound, not just publish.",
  },
  {
    kicker: "Services",
    title: "Paid media & landing pages",
    body: "Campaigns, email flows, and landing pages across the channels your budget actually justifies.",
  },
  {
    kicker: "Services · Growth",
    title: "Reddit & digital PR",
    body: "Distribution beyond search, added once a client's foundation is already working.",
  },
  {
    kicker: "Services · Signature",
    title: "Executive thought leadership",
    body: "Fractional-CMO engagement with founder-facing visibility work for clients who need a face in front of the brand.",
  },
  {
    kicker: "Platform",
    title: "Competitor intelligence",
    body: "The Vault tracks pricing and positioning moves, sourced and dated by hand.",
  },
  {
    kicker: "Platform · free",
    title: "Idea & positioning scoring",
    body: "Cre8tive Score checks originality, AI-visibility, and white space before you build.",
  },
];

export function ChannelGrid() {
  return (
    <div className="bdc-channel-grid">
      {CHANNELS.map((c) => (
        <div className="bdc-channel-card" key={c.title}>
          <div className="bdc-channel-kicker">{c.kicker}</div>
          <h4>{c.title}</h4>
          <p>{c.body}</p>
        </div>
      ))}
    </div>
  );
}
