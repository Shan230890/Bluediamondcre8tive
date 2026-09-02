/** Shared pain -> real-feature mapping rows for the /for/* role pages. Every
 * "product" line must name a feature that genuinely exists in the app. */
export function PainProductRows({ rows }: { rows: { pain: string; product: string }[] }) {
  return (
    <div>
      {rows.map((row) => (
        <div className="bdc-pain-row reveal" key={row.pain}>
          <div>
            <span className="bdc-pain-row-label">The problem</span>
            <p>{row.pain}</p>
          </div>
          <div>
            <span className="bdc-pain-row-label">How it&apos;s handled</span>
            <p>{row.product}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
