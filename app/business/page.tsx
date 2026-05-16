import Business from "@/components/Business";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaseMyTools - Business",
  description: "Use the Business tool on EaseMyTools.",
};

export default function Page() {
  return <Business />;
}
