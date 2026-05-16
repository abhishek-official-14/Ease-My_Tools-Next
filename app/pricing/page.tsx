import Pricing from "@/components/Pricing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaseMyTools - Pricing",
  description: "Use the Pricing tool on EaseMyTools.",
};

export default function Page() {
  return <Pricing />;
}
