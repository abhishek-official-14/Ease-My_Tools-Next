"use client";

import { useRouter } from "next/navigation";
import styles from './styles.module.css';

export default function BackButton() {
    const router = useRouter();

    return (
        <div style={{textAlign: 'center'}}>
            <button className={styles["back-button"]} onClick={() => router.push('/' as unknown)}>
                ← Back to Home
            </button>
        </div>
    );
}
