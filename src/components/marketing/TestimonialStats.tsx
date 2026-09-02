/**
 * Testimonial-with-quantified-stats block: client-logo + quote + 2-3 big
 * numbers layout.
 *
 * We do not have a real client testimonial with verified numbers yet, so
 * this renders an explicitly-labeled illustrative example rather than
 * fabricating a client name or results — swap the content for a real
 * case study the moment one exists (see /work for real, unnumbered case
 * study copy in the meantime). Flagged in the build report per Shan's
 * instructions on this pass.
 */
export function TestimonialStats() {
  return (
    <div className="bdc-testimonial">
      <span className="bdc-testimonial-flag">Illustrative example, not a real client result</span>
      <blockquote className="bdc-testimonial-quote">
        &ldquo;We stopped guessing at what our competitors were doing and started shipping content on
        a schedule we could actually defend to our board.&rdquo;
      </blockquote>
      <div className="bdc-testimonial-attrib">Example brand, Services client (illustrative)</div>
      <div className="bdc-testimonial-stats">
        <div className="bdc-testimonial-stat">
          <span className="bdc-testimonial-stat-num">3<span>x</span></span>
          <span className="bdc-testimonial-stat-label">content output per month, same team size</span>
        </div>
        <div className="bdc-testimonial-stat">
          <span className="bdc-testimonial-stat-num">100<span>%</span></span>
          <span className="bdc-testimonial-stat-label">deliverables reviewed before they shipped</span>
        </div>
        <div className="bdc-testimonial-stat">
          <span className="bdc-testimonial-stat-num">4<span>wk</span></span>
          <span className="bdc-testimonial-stat-label">cadence to a full competitor picture</span>
        </div>
      </div>
    </div>
  );
}
