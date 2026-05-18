import type { ToolSEOContent } from "@/types/tool";
import styles from "@/app/tools/[slug]/page.module.css";

export default function ToolSeoIntro({ seoContent }: { seoContent: ToolSEOContent }) {
  return (
    <section className={styles.toolSection} aria-label="Tool overview">
      <div className={styles.sectionCard}>
        <h1 className={styles.sectionTitle}>{seoContent.h1}</h1>
        <p className={styles.sectionDescription}>{seoContent.intro}</p>
      </div>
    </section>
  );
}
