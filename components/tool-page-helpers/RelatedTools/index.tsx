import Link from "next/link"

import { ToolIcon } from "@/components/ToolIcon"
import { getToolBySlug } from "@/data/registry"
import type { Tool } from "@/types/tool"

import styles from "./styles.module.css"

type RelatedToolsProps = {
    tool: Tool
}

export default function RelatedTools({ tool }: RelatedToolsProps) {
    const relatedSlugs = tool.seoContent?.relatedTools

    if (!Array.isArray(relatedSlugs) || !relatedSlugs.length) {
        return null
    }

    const relatedTools = relatedSlugs
        .map((related) => getToolBySlug(related.slug))
        .filter((relatedTool): relatedTool is Tool => Boolean(relatedTool))

    if (!relatedTools.length) {
        return null
    }

    return (
        <section className={styles.relatedTools} aria-label="Related tools">
            <div className={styles.relatedContainer}>
                <div className={styles.relatedHeader}>
                    <h2 className={styles.relatedTitle}>Related Tools</h2>

                    <p className={styles.relatedSubtitle}>
                        Explore more tools you may find useful.
                    </p>
                </div>

                <div className={styles.toolsGrid}>
                    {relatedTools.map((relatedTool) => (
                        <Link
                            key={relatedTool.slug}
                            href={`/tools/tool/${relatedTool.slug}`}
                            className={styles.toolCard}
                        >
                            <div className={styles.toolIconWrap}>
                                <ToolIcon
                                    slug={relatedTool.slug}
                                    className={styles.toolIcon}
                                />
                            </div>

                            <h3 className={styles.toolName}>
                                {relatedTool.name}
                            </h3>

                            <p className={styles.toolDescription}>
                                {relatedTool.seo?.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
