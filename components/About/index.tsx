"use client";
import styles from './styles.module.css';

const About = () => {

  return (
    <div className={styles["legal-page"]}>
      <div className={styles["legal-container"]}>
        <header className={styles["legal-header"]}>
          <h1>{"About EaseMyTools"}</h1>
        </header>

        <div className={styles["legal-content"]}>
          <section className={styles["policy-section"]}>
            <h2>{"Our Mission"}</h2>
            <p>
              {"EaseMyTools was created to provide free, easy-to-use online tools that simplify everyday digital tasks. We believe everyone should have access to powerful tools without complexity or cost."}
            </p>
          </section>

          <section className={styles["policy-section"]}>
            <h2>{"What We Do"}</h2>
            <p>
              {"We develop and maintain a comprehensive suite of online tools for file conversion, image editing, text processing, and data analysis. All processing happens locally in your browser for maximum privacy."}
            </p>
          </section>

          <section className={styles["policy-section"]}>
            <h2>{"Our Team"}</h2>
            <p>
              {"We are a passionate team of developers and designers committed to creating tools that make digital life easier. Our focus is on user experience, privacy, and performance."}
            </p>
          </section>
        </div>

        <div className={styles["legal-actions"]}>
          <button className={styles["back-button"]} onClick={() => window.history.back()}>
            {"Go Back"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;