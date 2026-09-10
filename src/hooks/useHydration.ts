"use client";

import { useState, useEffect } from "react";

/**
 * Returns `true` only after the client has fully hydrated.
 * Use this to guard Zustand `persist` state reads from causing
 * server/client mismatch warnings.
 */
export function useHydration(): boolean {
  const [hydrated, setHydrated] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
