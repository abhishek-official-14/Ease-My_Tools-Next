import Press from "@/components/Press";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaseMyTools - Press",
  description: "Use the Press tool on EaseMyTools.",
};

export default function Page() {
  return <Press />;
}
