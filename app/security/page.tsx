import Security from "@/components/Security";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaseMyTools - Security",
  description: "Use the Security tool on EaseMyTools.",
};

export default function Page() {
  return <Security />;
}
