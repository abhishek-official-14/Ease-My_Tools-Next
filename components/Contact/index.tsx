"use client";
import styles from './styles.module.css';

const Contact = () => {

  return (
    <div className={styles["legal-page"]}>
      <div className={styles["legal-container"]}>
        <header className={styles["legal-header"]}>
          <h1>{"Contact Us"}</h1>
        </header>

        <div className={styles["legal-content"]}>
          <section className={styles["policy-section"]}>
            <h2>{"Get In Touch"}</h2>
            <p>
              {"We would love to hear from you! Whether you have questions, feedback, or need support, our team is here to help."}
            </p>
          </section>

          <section className={styles["policy-section"]}>
            <h2>{"Contact Information"}</h2>
            <div className={styles["contact-info"]}>
              <p><strong>{"Email:"}</strong> support@easemytools.com</p>
              <p><strong>{"Business Inquiries:"}</strong> business@easemytools.com</p>
              <p><strong>{"Technical Support:"}</strong> help@easemytools.com</p>
            </div>
          </section>

          <section className={styles["policy-section"]}>
            <h2>{"Response Time"}</h2>
            <p>
              {"We typically respond to all inquiries within 24-48 hours. For urgent matters, please include \"URGENT\" in your subject line."}
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

export default Contact;