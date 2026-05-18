import type { Tool } from "@/types/tool";

const getToolTerms = (tool: Tool): Set<string> => {
  const keywordSource = [tool.name, tool.seo?.title, tool.seo?.description, tool.seo?.keywords].filter(Boolean).join(" ").toLowerCase();
  return new Set(keywordSource.split(/[^a-z0-9]+/).filter((term) => term.length > 2));
};

export const getRelatedToolsByScoring = (slug: string, tools: Tool[], getCategoryBySlug: (s: string) => string | null, limit = 6): Tool[] => {
  const sourceTool = tools.find((tool) => tool.slug === slug);
  if (!sourceTool) return [];
  const sourceCategory = getCategoryBySlug(slug);
  const sourceTerms = getToolTerms(sourceTool);

  return tools
    .filter((tool) => tool.slug !== slug)
    .map((tool) => {
      const toolTerms = getToolTerms(tool);
      const sharedTerms = [...sourceTerms].filter((term) => toolTerms.has(term)).length;
      const sameCategoryBoost = sourceCategory && getCategoryBySlug(tool.slug) === sourceCategory ? 2 : 0;
      return { tool, score: sharedTerms + sameCategoryBoost };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.tool);
};
