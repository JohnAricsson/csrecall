"use client";

import { SessionProvider } from "next-auth/react";
import { StoreHydrator } from "./StoreHydrator";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreHydrator />
      {children}
    </SessionProvider>
  );
}
