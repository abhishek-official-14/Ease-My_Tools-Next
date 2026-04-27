"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import ScrollToTop from "@/components/ScrollToTop";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <ScrollToTop />
      {children}
    </ThemeProvider>
  );
}
