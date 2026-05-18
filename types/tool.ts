import type { IconType } from "react-icons";

export type ToolCategory = "image" | "converters" | "text" | "calculators" | "file" | "web" | "generators" | "health";

export interface ToolFAQ { question: string; answer: string; }
export interface RelatedTool { slug: string; name: string; }
export interface ToolSEOContent {
  h1: string; intro: string; howToUse: string[]; features: string[]; benefits: string[]; useCases: string[]; faqs: ToolFAQ[]; relatedTools: RelatedTool[];
}
export interface ToolSEO { title: string; description: string; keywords?: string; }
export interface Tool {
  name: string; slug: string; icon: IconType; component: () => Promise<unknown>; seo: ToolSEO; seoContent?: ToolSEOContent;
}
export interface ToolCategoryConfig {
  id: ToolCategory; title: string; description: string; color: string; icon: IconType; link: `/tools/${ToolCategory}`;
}
