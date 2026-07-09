import type { Metadata } from "next"

import { notFound } from "next/navigation"

import BreadcrumbNav from "@/components/tool-page-helpers/BreadcrumbNav"
import ToolHero from "@/components/tool-page-helpers/ToolHero"
import ToolContent from "@/components/tool-page-helpers/ToolContent"
import ToolFaq from "@/components/tool-page-helpers/ToolFaq"
import RelatedTools from "@/components/tool-page-helpers/RelatedTools"

import { getToolBySlug, getFeaturedCategoryBySlug } from "@/data"

import type { Breadcrumb } from "@/types/breadcrumb"

import { createSEOMetadata } from "@/lib/seo"

import { createBreadcrumbSchema } from "@/lib/schema/breadcrumb"

import { createFAQSchema, createWebApplicationSchema } from "@/lib/schema/core"

// ======================================================
// Metadata
// ======================================================

export async function generateMetadata({
    params,
}: {
    params: Promise<{
        slug: string
    }>
}): Promise<Metadata> {
    const { slug } = await params

    const tool = getToolBySlug(slug)

    if (!tool) {
        return {}
    }

    return createSEOMetadata({
        title: tool.seo.title,
        description: tool.seo.description,
        path: `/tools/tool/${slug}`,
    })
}

// ======================================================
// Page
// ======================================================

export default async function Page({
    params,
}: {
    params: Promise<{
        slug: string
    }>
}) {
    const { slug } = await params

    const tool = getToolBySlug(slug)

    if (!tool) {
        return notFound()
    }

    const toolHeader = {
        name: tool.name,
        seoContent: tool.seoContent,
        seo: tool.seo
    }

    const { default: ToolComponent } = await tool.component()

    const featuredCategory = getFeaturedCategoryBySlug(tool.primaryCategory)

    const breadcrumbs: Breadcrumb[] = [
        {
            name: "Home",
            url: "/",
        },
        {
            name: "Tools",
            url: "/tools",
        },
        ...(featuredCategory
            ? [
                {
                    name: featuredCategory.title,
                    url: featuredCategory.link,
                },
            ]
            : []),
        {
            name: tool.name,
        },
    ]

    const breadcrumbSchema = createBreadcrumbSchema(breadcrumbs)

    const toolSchema = createWebApplicationSchema({
        name: tool.name,
        url: `https://easemytools.com/tools/tool/${tool.slug}`,
        description: tool.seo.description,
    })

    const faqSchema = tool.seoContent?.faqs?.length
        ? createFAQSchema(tool.seoContent.faqs)
        : null

    return (
        <>
            {/* Tool Schema */}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(toolSchema),
                }}
            />

            {/* Breadcrumb Schema */}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />

            {/* FAQ Schema */}

            {faqSchema ? (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(faqSchema),
                    }}
                />
            ) : null}

            <BreadcrumbNav items={breadcrumbs} />

            {/* <ToolHero tool={tool} /> */}

            <div className="safe-overflow">
                <ToolComponent tool={toolHeader} />
            </div>

            <ToolContent tool={tool} />

            <ToolFaq tool={tool} />

            <RelatedTools tool={tool} />
        </>
    )
}
