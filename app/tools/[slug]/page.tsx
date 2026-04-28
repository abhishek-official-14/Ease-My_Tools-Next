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

  const categoryTitle = categoryTitles[slug as keyof typeof categoryTitles];

  if (categoryTitle) {
    return {
      title: `EaseMyTools - ${categoryTitle}`,
      description: `Explore ${categoryTitle} on EaseMyTools.`,
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
    const DynamicComponent = dynamic(tool.component as () => Promise<{ default: ComponentType<object> }>);
    return <DynamicComponent />;
  }

  if (toolsByCategory[slug as keyof typeof toolsByCategory]) {
    return <CategoryToolsPage categoryId={slug} />;
  }

  return notFound();
}
