import Link from "next/link"

import type { Breadcrumb } from "@/types/breadcrumb"

import styles from "./styles.module.css"
import { Route } from "next"

type BreadcrumbNavProps = {
    items: Breadcrumb[]
}

export default function BreadcrumbNav({ items }: BreadcrumbNavProps) {
    return (
        <nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
            <ol className={styles.breadcrumbList}>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1

                    return (
                        <li
                            key={`${item.name}-${index}`}
                            className={styles.breadcrumbItem}
                        >
                            {item.url && !isLast ? (
                                <Link
                                    href={item.url as Route}
                                    className={styles.breadcrumbLink}
                                >
                                    {item.name}
                                </Link>
                            ) : (
                                <span className={styles.breadcrumbCurrent}>
                                    {item.name}
                                </span>
                            )}

                            {!isLast && (
                                <span
                                    className={styles.separator}
                                    aria-hidden="true"
                                >
                                    »
                                </span>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
