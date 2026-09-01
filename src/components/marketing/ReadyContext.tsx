"use client";

import { createContext, useContext } from "react";

/**
 * Gates the above-the-fold hero reveals on the intro loader finishing.
 * Defaults to `true` so any component used outside <MarketingShell> (tests,
 * Storybook-style isolation, etc.) never gets stuck waiting on a loader that
 * doesn't exist in that tree.
 */
export const ReadyContext = createContext<boolean>(true);

export function useReady(): boolean {
  return useContext(ReadyContext);
}
