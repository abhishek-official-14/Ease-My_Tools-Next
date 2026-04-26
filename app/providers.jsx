"use client";

import { ThemeProvider } from "next-themes";
import ScrollToTop from "@/components/ScrollToTop";

export default function Providers({ children }) {
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
