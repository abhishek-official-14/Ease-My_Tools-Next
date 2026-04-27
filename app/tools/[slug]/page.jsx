import dynamic from "next/dynamic";
import CategoryToolsPage from "@/components/CategoryToolsPage";
import { categoryTitles, getToolBySlug, toolsByCategory } from "@/data/toolsData";
import { notFound } from "next/navigation";

export function generateMetadata({ params }) {
  const tool = getToolBySlug(params.slug);

  if (tool) {
    return {
      title: `EaseMyTools - ${tool.seo.title}`,
      description: tool.seo.description,
    };
  }

  if (categoryTitles[params.slug]) {
    return {
      title: `EaseMyTools - ${categoryTitles[params.slug]}`,
      description: `Explore ${categoryTitles[params.slug]} on EaseMyTools.`,
    };
  }

  return {};
}

export default function Page({ params }) {
  const tool = getToolBySlug(params.slug);

  if (tool) {
    const DynamicComponent = dynamic(tool.component);
    return <DynamicComponent />;
  }

  if (toolsByCategory[params.slug]) {
    return <CategoryToolsPage categoryId={params.slug} />;
  }

  return notFound();
}
