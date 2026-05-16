import FAQ from "@/components/FAQ";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaseMyTools - Faq",
  description: "Use the Faq tool on EaseMyTools.",
};

export default function Page() {
  return <FAQ />;
}
