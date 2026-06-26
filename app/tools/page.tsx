import type { Metadata } from "next"

import { createSEOMetadata } from "@/lib/seo"

import ToolsClient from "@/components/ToolsAllPage/ToolsClient"
import { Breadcrumb } from "../../types/breadcrumb"
import BreadcrumbNav from "../../components/tool-page-helpers/BreadcrumbNav"
import { createBreadcrumbSchema } from "../../lib/schema/breadcrumb"

export const metadata: Metadata = createSEOMetadata({
    title: "All Tools | EaseMyTools",
    description:
        "Browse, search and discover all tools available on EaseMyTools.",
    path: "/tools",
})

export default function Page() {
    const breadcrumbs: Breadcrumb[] = [
        {
            name: "Home",
            url: "/",
        },
        {
            name: "Tools",
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
            <main className="bg-background p-4 text-foreground">
                <BreadcrumbNav items={breadcrumbs} />
                <ToolsClient />
            </main>
        </>
    )
}
