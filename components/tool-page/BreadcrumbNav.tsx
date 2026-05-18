import type { Route } from "next";
import Link from "next/link";
import styles from "@/app/tools/[slug]/page.module.css";

export type Crumb = { name: string; href?: string };

export default function BreadcrumbNav({ items }: { items: Crumb[] }) {
  return (
    <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        {items.map((item) => (
          <li key={item.name} className={styles.breadcrumbItem}>
            {item.href ? (
              <Link href={item.href as Route} className={styles.breadcrumbLink}>{item.name}</Link>
            ) : (
              <span aria-current="page" className={styles.breadcrumbCurrent}>{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
