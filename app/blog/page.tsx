import Blog from "@/components/Blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaseMyTools - Blog",
  description: "Use the Blog tool on EaseMyTools.",
};

export default function Page() {
  return <Blog />;
}
