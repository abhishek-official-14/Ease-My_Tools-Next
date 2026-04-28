import dynamic from "next/dynamic";
import type { Metadata } from "next";
import CategoryToolsPage from "@/components/CategoryToolsPage";
import { categoryTitles, getToolBySlug, toolsByCategory } from "@/data/toolsData";
import { notFound } from "next/navigation";

// Next.js 15 dynamic route params are async; always await params before using slug.
const resolveSlug = async (paramsInput: Promise<{ slug: string }> | { slug: string }) => {
  const resolvedParams = await paramsInput;
  return resolvedParams?.slug;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const slug = await resolveSlug(params);
  const tool = getToolBySlug(slug);

  if (tool) {
    return {
      title: `EaseMyTools - ${tool.seo.title}`,
      description: tool.seo.description,
    };
  }

  if (slug && (categoryTitles as Record<string, any>)[slug]) {
    return {
      title: `EaseMyTools - ${(categoryTitles as Record<string, any>)[slug]}`,
      description: `Explore ${(categoryTitles as Record<string, any>)[slug]} on EaseMyTools.`,
    };
  }

  return {};
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const slug = await resolveSlug(params);
  const tool = getToolBySlug(slug);

  if (tool) {
    const DynamicComponent = dynamic(tool.component as any);
    return <DynamicComponent />;
  }

  if (slug && (toolsByCategory as Record<string, any>)[slug]) {
    return <CategoryToolsPage categoryId={slug} />;
  }

  return notFound();
}
