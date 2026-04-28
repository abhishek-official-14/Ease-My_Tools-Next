import dynamic from "next/dynamic";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import CategoryToolsPage from "@/components/CategoryToolsPage";
import { categoryTitles, getToolBySlug, toolsByCategory } from "@/data/toolsData";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (tool) {
    return {
      title: `EaseMyTools - ${tool.seo.title}`,
      description: tool.seo.description,
    };
  }

  if (slug && (categoryTitles as Record<string, unknown>)[slug]) {
    return {
      title: `EaseMyTools - ${(categoryTitles as Record<string, unknown>)[slug]}`,
      description: `Explore ${(categoryTitles as Record<string, unknown>)[slug]} on EaseMyTools.`,
    };
  }

  return {};
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (tool) {
    const DynamicComponent = dynamic(tool.component as unknown);
    return <DynamicComponent />;
  }

  if (slug && (toolsByCategory as Record<string, unknown>)[slug]) {
    return <CategoryToolsPage categoryId={slug} />;
  }

  return notFound();
}
