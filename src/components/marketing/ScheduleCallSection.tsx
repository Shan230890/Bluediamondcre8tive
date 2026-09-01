import { CalendarClock, ArrowRight } from "lucide-react";

const SCHEDULE_CALL_EMAIL = "levana@bluediamond.capital";

function buildMailto() {
  const subject = "Schedule a call: Blue Diamond Cre8tive Services";
  const body = [
    "Hi,",
    "",
    "I'd like to schedule a call about Blue Diamond Cre8tive Services.",
    "",
    "Name:",
    "Company:",
    "Preferred time (with timezone):",
    "What I'd like to discuss:",
    "",
    "Thanks,",
  ].join("\n");
  return `mailto:${SCHEDULE_CALL_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * No form here on purpose, there's no email-sending backend configured yet
 * for a form submission, so a mailto link is the only path that can't
 * silently fail. The body template gives the visitor blanks to fill in
 * since mailto can't collect structured data itself.
 */
export function ScheduleCallSection() {
  return (
    <div className="bdc-ink-card">
      <div className="bdc-schedule-call">
        <div className="bdc-schedule-call-copy">
          <h3>Talk it through directly</h3>
          <p>
            If you would rather explain your brand and goals in person than read through tier
            cards, send us a short note and we will set up a time. You will speak with our
            principal, not a booking bot.
          </p>
        </div>
        <a href={buildMailto()} className="bdc-pill bdc-pill-light">
          <CalendarClock size={16} />
          Schedule a call
          <span className="bdc-pill-badge">
            <ArrowRight size={14} />
          </span>
        </a>
      </div>
    </div>
  );
}
