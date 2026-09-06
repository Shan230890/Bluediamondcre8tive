"use client";

import { useState } from "react";
import { MessageCircleQuestion, X, ChevronDown, Compass } from "lucide-react";
import { PersonaChat } from "@/components/dashboard/PersonaChat";
import { GUIDE_TOPICS } from "@/lib/help/guide-content";
import { StartTourButton } from "@/components/dashboard/StartTourButton";

type Tab = "ask" | "guide";

/**
 * Floating help bot — separate from the six Cre8tive Team personas. Mirrors
 * Opsara's HelpGuideWidget: a circular bottom-right toggle opening a
 * two-tab panel ("Ask a question" / "Browse guide"). Mounted once from
 * DashboardShell, not per-page, so it never collides with each page's own
 * top-right HelpPanel.
 */
export function HelpGuideWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("ask");
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        className="help-widget-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? "Close help assistant" : "Open help assistant"}
        title="Help & guide"
      >
        {open ? <X size={20} /> : <MessageCircleQuestion size={20} />}
      </button>

      {open && (
        <div className="help-widget-panel" role="dialog" aria-label="Help assistant">
          <div className="help-widget-tabs">
            <button
              type="button"
              className={`help-widget-tab ${tab === "ask" ? "active" : ""}`}
              onClick={() => setTab("ask")}
            >
              Ask a question
            </button>
            <button
              type="button"
              className={`help-widget-tab ${tab === "guide" ? "active" : ""}`}
              onClick={() => setTab("guide")}
            >
              Browse guide
            </button>
          </div>

          <div className="help-widget-body">
            {tab === "ask" ? (
              <PersonaChat
                slug="help"
                name="Help Assistant"
                role="Ask about any feature or where to find something"
                apiPath="/api/dashboard/help/chat"
              />
            ) : (
              <div className="help-guide-list">
                <div className="help-guide-tour-row">
                  <Compass size={15} />
                  <span>New here?</span>
                  <StartTourButton className="help-guide-tour-btn" label="Take the tour" />
                </div>
                {GUIDE_TOPICS.map((topic) => {
                  const isOpen = expandedTopic === topic.title;
                  return (
                    <div className="help-guide-topic" key={topic.title}>
                      <button
                        type="button"
                        className="help-guide-topic-head"
                        onClick={() => setExpandedTopic(isOpen ? null : topic.title)}
                        aria-expanded={isOpen}
                      >
                        <span>{topic.title}</span>
                        <ChevronDown size={14} className={`help-guide-chevron ${isOpen ? "expanded" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="help-guide-topic-body">
                          {topic.body.map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
