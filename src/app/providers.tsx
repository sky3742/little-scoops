"use client";

import { DemoModeProvider } from "@/lib/demo-mode";

export function Providers({ children }: { children: React.ReactNode }) {
  return <DemoModeProvider>{children}</DemoModeProvider>;
}
