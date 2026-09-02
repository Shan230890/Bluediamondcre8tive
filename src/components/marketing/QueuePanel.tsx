/**
 * Approval-queue panel, structural pattern from the approved mockup
 * (`.queue-panel`). A clearly illustrative example of what "waiting on you"
 * looks like inside the product — the real, authenticated version of this
 * pattern lives in the dashboard, driven by real data.
 */
export function QueuePanel() {
  return (
    <div className="bdc-queue-panel">
      <div className="bdc-queue-head">
        <b>Review queue (illustrative)</b>
        <span>2 awaiting</span>
      </div>
      <div className="bdc-queue-row">
        <div className="bdc-queue-check bdc-queue-done" aria-hidden="true">
          ✓
        </div>
        <div className="bdc-queue-row-body">
          <b>Monthly white-space review</b>
          <span>Vault · 3 competitors scanned</span>
        </div>
      </div>
      <div className="bdc-queue-row">
        <div className="bdc-queue-check" aria-hidden="true" />
        <div className="bdc-queue-row-body">
          <b>Q4 content calendar, draft 2</b>
          <span>Services · awaiting principal sign-off</span>
        </div>
      </div>
    </div>
  );
}
