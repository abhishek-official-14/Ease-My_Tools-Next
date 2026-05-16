import MobileApp from "@/components/MobileApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaseMyTools - Mobile",
  description: "Use the Mobile tool on EaseMyTools.",
};

export default function Page() {
  return <MobileApp />;
}
