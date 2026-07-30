import styles from "./styles.module.css"

// Import the new sections
import FeaturedTools from "../FeaturedTools"
import BenefitsSection from "../BenefitsSection"
import TestimonialsSection from "../TestimonialsSection"
import NewsletterSection from "../NewsletterSection"
import ToolsClient from "../ToolsAllPage/ToolsClient"

// const NewsletterSection = dynamic(() => import("../NewsletterSection"), {
//     loading: () => null,
// })

const HomePage = () => {
    return (
        <div className={styles["home-page"]}>
            <FeaturedTools />
            {/* <div style={{ marginTop: "2rem"}}>
                <ToolsClient />
            </div> */}
            <BenefitsSection />
            <TestimonialsSection />
            <NewsletterSection />
        </div>
    )
}

export default HomePage
