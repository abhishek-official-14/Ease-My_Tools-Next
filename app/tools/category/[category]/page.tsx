import type { Metadata } from "next"

import { notFound } from "next/navigation"

import CategoryToolsPage from "@/components/CategoryToolsPage"
import BreadcrumbNav from "@/components/tool-page-helpers/BreadcrumbNav"

import { CATEGORIES } from "@/data/featuredCategories"

import type { Breadcrumb } from "@/types/breadcrumb"

import { createSEOMetadata } from "@/lib/seo"
import { createBreadcrumbSchema } from "@/lib/schema/breadcrumb"

// ======================================================
// Metadata
// ======================================================

export async function generateMetadata({
    params,
}: {
    params: Promise<{
        category: string
    }>
}): Promise<Metadata> {
    const { category } = await params

    const categoryInfo = CATEGORIES.find((c) => c.tag === category)

    if (!categoryInfo) {
        return {}
    }

    return createSEOMetadata({
        title: categoryInfo.title,
        description: `Explore ${categoryInfo.title} tools on EaseMyTools.`,
        path: categoryInfo.link,
    })
}

// ======================================================
// Page
// ======================================================

export default async function Page({
    params,
}: {
    params: Promise<{
        category: string
    }>
}) {
    const { category } = await params

    const categoryInfo = CATEGORIES.find((c) => c.tag === category)

    if (!categoryInfo) {
        return notFound()
    }

    const breadcrumbs: Breadcrumb[] = [
        {
            name: "Home",
            url: "/",
        },
        {
            name: "Tools",
            url: "/tools",
        },
        {
            name: categoryInfo.title,
        },
    ]

    const breadcrumbSchema = createBreadcrumbSchema(breadcrumbs)

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />

            <BreadcrumbNav items={breadcrumbs} />

            <CategoryToolsPage categoryId={category} />
        </>
    )
}
