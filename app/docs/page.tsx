import Documentation from "@/components/Documentation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaseMyTools - Docs",
  description: "Use the Docs tool on EaseMyTools.",
};

export default function Page() {
  return <Documentation />;
}
