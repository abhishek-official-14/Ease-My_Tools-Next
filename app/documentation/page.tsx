import Documentation from "@/components/Documentation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaseMyTools - Documentation",
  description: "Use the Documentation tool on EaseMyTools.",
};

export default function Page() {
  return <Documentation />;
}
