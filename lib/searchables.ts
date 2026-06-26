import { ALL_TOOLS } from "@/data/registry"

export const SEARCHABLE_TOOLS = ALL_TOOLS.map((tool) => ({
    name: tool.name,

    slug: tool.slug,

    icon: tool.icon,

    tags: tool.tags,

    seoTitle: tool.seo.title,

    description: tool.seo.description,

    searchText: [
        tool.name,

        tool.slug,

        ...tool.tags,

        tool.seo.title,

        tool.seo.description,

        tool.seoContent.intro,

        ...tool.seoContent.howToUse,

        ...tool.seoContent.features,

        ...tool.seoContent.benefits,

        ...tool.seoContent.useCases,

        ...tool.seoContent.faqs.flatMap((f) => [f.question, f.answer]),

        ...tool.seoContent.relatedTools.map((t) => t.name),
    ].join(" "),
}))
