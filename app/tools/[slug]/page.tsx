import type { ComponentType } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { createSEOMetadata } from "@/lib/seo";
import { createBreadcrumbSchema, createFAQSchema, createWebApplicationSchema } from "@/lib/schema";
import CategoryToolsPage from "@/components/CategoryToolsPage";
import RelatedToolsSection from "@/components/RelatedToolsSection";
import { BreadcrumbNav, ToolSeoDetails, ToolSeoIntro } from "@/components/tool-page";
import { categoryTitles, getRelatedTools, getToolBySlug, getToolCategoryBySlug, toolsByCategory } from "@/data/toolsData";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (tool) {
    const metadata = createSEOMetadata({ title: tool.seo.title, description: tool.seo.description, path: `/tools/${slug}` });
    return { ...metadata, keywords: tool.seo.keywords };
  }

  if (slug && categoryTitles[slug]) {
    return createSEOMetadata({ title: categoryTitles[slug], description: `Explore ${categoryTitles[slug]} tools on EaseMyTools.`, path: `/tools/${slug}` });
  }

  return {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (tool) {
    const DynamicComponent = dynamic(() => tool.component() as Promise<{ default: ComponentType }>);
    const toolCategoryId = getToolCategoryBySlug(slug);
    const categoryTitle = toolCategoryId ? categoryTitles[toolCategoryId] : null;
    const categoryPath = toolCategoryId ? `/tools/${toolCategoryId}` : null;
    const relatedTools = getRelatedTools(slug, 6);
    const toolSchema = createWebApplicationSchema(tool.name, `https://easemytools.com/tools/${slug}`, tool.seo.description);
    const breadcrumbSchema = createBreadcrumbSchema([
      { name: "Home", item: "https://easemytools.com" },
      { name: "Tools", item: "https://easemytools.com/tools" },
      ...(toolCategoryId ? [{ name: categoryTitles[toolCategoryId], item: `https://easemytools.com/tools/${toolCategoryId}` }] : []),
      { name: tool.name, item: `https://easemytools.com/tools/${slug}` },
    ]);
    const faqSchema = tool.seoContent?.faqs ? createFAQSchema(tool.seoContent.faqs) : null;

    return <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null}
      <BreadcrumbNav items={[{ name: "Home", href: "/" }, { name: "Tools", href: "/tools" }, ...(categoryTitle && categoryPath ? [{ name: categoryTitle, href: categoryPath }] : []), { name: tool.name }]} />
      {tool.seoContent ? <ToolSeoIntro seoContent={tool.seoContent} /> : null}
      <DynamicComponent />
      {tool.seoContent ? <ToolSeoDetails seoContent={tool.seoContent} toolName={tool.name} /> : null}
      <RelatedToolsSection currentToolName={tool.name} categoryTitle={categoryTitle ?? null} relatedTools={relatedTools} />
    </>;
  }

  if (slug && toolsByCategory[slug]) return <CategoryToolsPage categoryId={slug} />;

  return notFound();
}
