/**
 * Auto-scrolling activity ticker, structural pattern from the approved
 * mockup (`.ticker-wrap` / `.ticker-track`). Content is written in the same
 * voice as the real Vault-entry and Cre8tive Score copy already used
 * elsewhere on this site (see VaultPreviewPage's mock rows and the
 * dashboard's real activity feed) but is explicitly illustrative, not a
 * live feed — flagged the same way /tools/vault already flags its preview
 * content, so nothing here reads as a real, dated claim.
 */
const CHIPS: { flag: boolean; text: React.ReactNode }[] = [
  { flag: true, text: <>Illustrative competitor entry <b>dropped its entry tier</b> to $59/mo</> },
  { flag: true, text: <>Illustrative Vault scan <b>logged a new landing page</b> launch</> },
  { flag: true, text: <>Cre8tive Score <b>ran 3 assessments</b> this hour, illustrative</> },
  { flag: true, text: <>Illustrative competitor <b>held pricing</b> this week</> },
  { flag: true, text: <>Monthly white-space review <b>ready for approval</b>, illustrative</> },
];

export function SignalTicker() {
  const loop = [...CHIPS, ...CHIPS];
  return (
    <div>
      <p className="bdc-ticker-caption">Illustrative product activity, not a live feed</p>
      <div className="bdc-ticker-wrap">
        <div className="bdc-ticker-track">
          {loop.map((chip, i) => (
            <div className="bdc-ticker-chip" key={i}>
              <span className="bdc-ticker-flag" aria-hidden="true" />
              {chip.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
