import NavButtons from "../../NavButtons"
import styles from "./styles.module.css"

type ToolHeroProps = {
    tool: any
}

export default function ToolHero({ tool }: ToolHeroProps) {
    if (!tool) {
        return null
    }
    return (
        <section className={styles.toolHero}>
            <NavButtons></NavButtons>
            <div className={styles.heroCard}>
                <h1 className={styles.heroTitle}>
                    {tool.seoContent?.h1 || tool.name}
                </h1>

                <p className={styles.heroDescription}>
                    {tool.seoContent?.intro || tool.seo?.description}
                </p>
            </div>
        </section>
    )
}
