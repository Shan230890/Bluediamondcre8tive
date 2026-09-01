"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type RequestModalState = {
  open: boolean;
  interest: string;
  openModal: (interest?: string) => void;
  closeModal: () => void;
};

const RequestModalCtx = createContext<RequestModalState | null>(null);

export function RequestModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [interest, setInterest] = useState("services");

  const openModal = useCallback((next?: string) => {
    if (next) setInterest(next);
    setOpen(true);
  }, []);
  const closeModal = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, interest, openModal, closeModal }), [open, interest, openModal, closeModal]);

  return <RequestModalCtx.Provider value={value}>{children}</RequestModalCtx.Provider>;
}

/** Any CTA on a marketing page can call `openModal("vault")` etc. to open
 * the shared request modal pre-filled to that interest. Falls back to a
 * no-op state so a component used outside <MarketingShell> never crashes. */
export function useRequestModal(): RequestModalState {
  const ctx = useContext(RequestModalCtx);
  if (ctx) return ctx;
  return { open: false, interest: "services", openModal: () => {}, closeModal: () => {} };
}
