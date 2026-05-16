import ToolsPage from "@/components/ToolsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaseMyTools - Tools",
  description: "Use the Tools tool on EaseMyTools.",
};

export default function Page() {
  return <ToolsPage />;
}
