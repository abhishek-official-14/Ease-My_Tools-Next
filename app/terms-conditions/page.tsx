import TermsConditions from "@/components/TermsConditions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaseMyTools - Terms Conditions",
  description: "Use the Terms Conditions tool on EaseMyTools.",
};

export default function Page() {
  return <TermsConditions />;
}
