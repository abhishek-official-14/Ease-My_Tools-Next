import DesktopApp from "@/components/DesktopApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaseMyTools - Desktop",
  description: "Use the Desktop tool on EaseMyTools.",
};

export default function Page() {
  return <DesktopApp />;
}
