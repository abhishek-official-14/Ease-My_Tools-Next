"use client";
import styles from './styles.module.css';

const CookiePolicy = () => {

  return (
    <div className={styles["legal-page"]}>
      <div className={styles["legal-container"]}>
        <header className={styles["legal-header"]}>
          <h1>{"Cookie Policy"}</h1>
          <p className={styles["last-updated"]}>
            {"Last Updated:"} {new Date().toLocaleDateString()}
          </p>
        </header>

        <div className={styles["legal-content"]}>
          <section className={styles["policy-section"]}>
            <h2>{"What Are Cookies"}</h2>
            <p>
              {"Cookies are small text files that are placed on your device by websites you visit. They are widely used to make websites work more efficiently."}
            </p>
          </section>

          <section className={styles["policy-section"]}>
            <h2>{"How We Use Cookies"}</h2>
            <p>
              {"We use cookies to understand how you use our website and to improve your experience. This includes remembering your preferences and settings."}
            </p>
          </section>

          <section className={styles["policy-section"]}>
            <h2>{"Managing Cookies"}</h2>
            <p>
              {"You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and set most browsers to prevent them from being placed."}
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

export default CookiePolicy;