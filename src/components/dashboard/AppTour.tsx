"use client";

import { useEffect } from "react";

/**
 * Guided tour, mounted once from DashboardShell. Does nothing until the
 * `bdc:start-tour` custom event fires (dispatched by StartTourButton), then
 * dynamically imports driver.js and its CSS and highlights the real
 * `data-tour="..."` attributes already placed on Sidebar.tsx's nav items.
 * Respects prefers-reduced-motion by disabling driver.js's step animation.
 */
export function AppTour() {
  useEffect(() => {
    async function handleStartTour() {
      const [{ driver }] = await Promise.all([import("driver.js"), import("driver.js/dist/driver.css")]);

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const steps = [
        {
          element: '[data-tour="overview"]',
          popover: { title: "Overview", description: "Your dashboard home: open invoices, active tier, and recent deliverables at a glance." },
        },
        {
          element: '[data-tour="projects"]',
          popover: { title: "Projects", description: "Brief a project once (goals, industry, audience, channels) and your team drafts a starter task list from it." },
        },
        {
          element: '[data-tour="tasks"]',
          popover: { title: "Tasks", description: "The kanban board where you assign work to your AI team and track it through to done." },
        },
        {
          element: '[data-tour="templates"]',
          popover: { title: "Templates", description: "A curated library of ready-made task briefs, plus any custom templates you save." },
        },
        {
          element: '[data-tour="growth"]',
          popover: { title: "Growth tools", description: "AI Visibility Report, Paid Media Plan, Outbound Drafts, and Execution Memory, all scoped to a project." },
        },
        {
          element: '[data-tour="team"]',
          popover: { title: "Your Cre8tive Team", description: "Chat with any of your six AI personas, or assign them tasks directly." },
        },
        {
          element: '[data-tour="custom-agents"]',
          popover: { title: "Custom agents", description: "Build your own AI agent for marketing work your built-in team doesn't already cover." },
        },
        {
          element: '[data-tour="settings"]',
          popover: { title: "Settings", description: "Manage your account from here." },
        },
      ];

      const tourDriver = driver({
        showProgress: true,
        animate: !reducedMotion,
        steps,
      });
      tourDriver.drive();
    }

    window.addEventListener("bdc:start-tour", handleStartTour);
    return () => window.removeEventListener("bdc:start-tour", handleStartTour);
  }, []);

  return null;
}
