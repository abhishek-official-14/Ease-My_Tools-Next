import type { Route } from "next";
import Link from "next/link";
import type { ToolSEOContent } from "@/types/tool";
import styles from "@/app/tools/[slug]/page.module.css";

export default function ToolSeoDetails({ seoContent, toolName }: { seoContent: ToolSEOContent; toolName: string }) {
  return (
    <section className={styles.toolSection} aria-label={`${toolName} details`}>
      <div className={styles.detailsGrid}>
        <section className={styles.sectionCard}><h2 className={styles.cardHeading}>How to use</h2><ol className={styles.listText}>{seoContent.howToUse.map((item) => <li key={item}>{item}</li>)}</ol></section>
        <section className={styles.sectionCard}><h2 className={styles.cardHeading}>Features</h2><ul className={styles.listText}>{seoContent.features.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className={styles.sectionCard}><h2 className={styles.cardHeading}>Benefits</h2><ul className={styles.listText}>{seoContent.benefits.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className={styles.sectionCard}><h2 className={styles.cardHeading}>Use cases</h2><ul className={styles.listText}>{seoContent.useCases.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className={styles.sectionCard}><h2 className={styles.cardHeading}>Frequently asked questions</h2><div className={styles.faqList}>{seoContent.faqs.map((faq) => <article key={faq.question} className={styles.faqItem}><h3 className={styles.faqQuestion}>{faq.question}</h3><p className={styles.listText}>{faq.answer}</p></article>)}</div></section>
        <section className={styles.sectionCard}><h2 className={styles.cardHeading}>Related tools</h2><ul className={styles.relatedList}>{seoContent.relatedTools.map((relatedTool) => <li key={relatedTool.slug}><Link href={`/tools/${relatedTool.slug}` as Route}>{relatedTool.name} tool</Link></li>)}</ul></section>
      </div>
    </section>
  );
}
