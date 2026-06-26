import type { Breadcrumb } from "@/types/breadcrumb"

const BASE_URL = "https://easemytools.com"

export function createBreadcrumbSchema(breadcrumbs: Breadcrumb[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((breadcrumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: breadcrumb.name,
            item: breadcrumb.url ? `${BASE_URL}${breadcrumb.url}` : undefined,
        })),
    }
}
