import dynamic from "next/dynamic";
import CategoryToolsPage from "@/components/CategoryToolsPage";
import { categoryTitles, getToolBySlug, toolsByCategory } from "@/data/toolsData";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (tool) {
    return {
      title: `EaseMyTools - ${tool.seo.title}`,
      description: tool.seo.description,
    };
  }

  if (categoryTitles[slug]) {
    return {
      title: `EaseMyTools - ${categoryTitles[slug]}`,
      description: `Explore ${categoryTitles[slug]} on EaseMyTools.`,
    };
  }

  return {};
}

export default async function Page({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (tool) {
    const DynamicComponent = dynamic(tool.component);
    return <DynamicComponent />;
  }

  if (toolsByCategory[slug]) {
    return <CategoryToolsPage categoryId={slug} />;
  }

  return notFound();
}
