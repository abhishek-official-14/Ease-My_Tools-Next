// app/loading.tsx

import styles from "./loading.module.css";

export default function Loading() {
    return (
        <div className={styles.loadingWrapper}>
            <div className={styles.loaderCard}>
                <div className={styles.spinner}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <h2 className={styles.title}>
                    Loading
                </h2>

                <p className={styles.subtitle}>
                    Preparing your experience...
                </p>
            </div>
        </div>
    );
}