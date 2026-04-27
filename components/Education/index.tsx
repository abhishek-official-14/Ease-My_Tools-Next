"use client";
import styles from './styles.module.css';

const Education = () => {

  const features = [
    {
      icon: '🏫',
      title: "Classroom Ready",
      description: "Tools designed specifically for educational environments and classroom use."
    },
    {
      icon: '🔒',
      title: "Student Privacy",
      description: "COPPA and FERPA compliant with enhanced student data protection."
    },
    {
      icon: '💻',
      title: "No Installation",
      description: "Works on any device with a browser, no IT setup required."
    },
    {
      icon: '📚',
      title: "Curriculum Resources",
      description: "Lesson plans and educational materials for teachers."
    }
  ];

  const useCases = [
    {
      role: "Teachers",
      description: "Create engaging learning materials, convert documents, and prepare classroom resources.",
      tools: ['PDF Tools', 'Image Editor', 'Document Converter']
    },
    {
      role: "Students",
      description: "Complete assignments, create projects, and learn digital skills with easy-to-use tools.",
      tools: ['Presentation Tools', 'Image Resizer', 'Text Formatter']
    },
    {
      role: "Administrators",
      description: "Manage school documents, create reports, and streamline administrative tasks.",
      tools: ['Bulk Processing', 'Document Merger', 'Data Converter']
    }
  ];

  const plans = [
    {
      name: "K-12 Schools",
      price: "Free",
      description: "For primary and secondary educational institutions",
      features: [
        "Unlimited students and teachers",
        "Basic educational tools",
        "Standard security features",
        "Email support"
      ]
    },
    {
      name: "Higher Education",
      price: "Custom",
      description: "For colleges, universities, and research institutions",
      features: [
        "Advanced research tools",
        "Bulk processing capabilities",
        "Enhanced security compliance",
        "Dedicated support"
      ]
    }
  ];

  return (
    <div className={styles["education-page"]}>
      <div className={styles["education-container"]}>
        <header className={styles["education-header"]}>
          <div className={styles["header-content"]}>
            <h1>{"EaseMyTools for Education"}</h1>
            <p className={styles["subtitle"]}>
              {"Empower students and educators with safe, accessible digital tools for learning and teaching."}
            </p>
            <div className={styles["header-actions"]}>
              <button className={styles["primary-button"]}>
                {"Get Started for Free"}
              </button>
              <button className={styles["secondary-button"]}>
                {"Contact Education Team"}
              </button>
            </div>
          </div>
        </header>

        <section className={styles["education-features"]}>
          <h2>{"Built for Learning Environments"}</h2>
          <div className={styles["features-grid"]}>
            {features.map((feature, index) => (
              <div key={index} className={styles["feature-card"]}>
                <div className={styles["feature-icon"]}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles["education-use-cases"]}>
          <h2>{"Tools for Every Role in Education"}</h2>
          <div className={styles["use-cases-grid"]}>
            {useCases.map((useCase, index) => (
              <div key={index} className={styles["use-case-card"]}>
                <h3>{useCase.role}</h3>
                <p>{useCase.description}</p>
                <div className={styles["tools-list"]}>
                  {useCase.tools.map((tool, toolIndex) => (
                    <span key={toolIndex} className={styles["tool-tag"]}>{tool}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles["education-pricing"]}>
          <h2>{"Education Pricing"}</h2>
          <p className={styles["pricing-subtitle"]}>
            {"Special pricing and features designed for educational institutions"}
          </p>
          <div className={styles["pricing-cards"]}>
            {plans.map((plan, index) => (
              <div key={index} className={styles["pricing-card"]}>
                <h3>{plan.name}</h3>
                <div className={styles["price"]}>{plan.price}</div>
                <p>{plan.description}</p>
                <ul>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
                <button className={styles["pricing-button"]}>
                  {plan.price === 'Free' ? "Get Started" : "Contact Sales"}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className={styles["education-resources"]}>
          <h2>{"Educational Resources"}</h2>
          <div className={styles["resources-grid"]}>
            <div className={styles["resource-card"]}>
              <div className={styles["resource-icon"]}>📖</div>
              <h3>{"Lesson Plans"}</h3>
              <p>{"Ready-to-use lesson plans integrating our tools into curriculum"}</p>
              <a href="#" className={styles["resource-link"]}>{"View Resources"}</a>
            </div>
            <div className={styles["resource-card"]}>
              <div className={styles["resource-icon"]}>🎓</div>
              <h3>{"Teacher Training"}</h3>
              <p>{"Professional development materials and training sessions"}</p>
              <a href="#" className={styles["resource-link"]}>{"Learn More"}</a>
            </div>
            <div className={styles["resource-card"]}>
              <div className={styles["resource-icon"]}>👨‍🏫</div>
              <h3>{"Classroom Guides"}</h3>
              <p>{"Step-by-step guides for classroom implementation"}</p>
              <a href="#" className={styles["resource-link"]}>{"Download Guides"}</a>
            </div>
          </div>
        </section>

        <section className={styles["education-cta"]}>
          <div className={styles["cta-content"]}>
            <h2>{"Ready to Bring EaseMyTools to Your School?"}</h2>
            <p>{"Join thousands of educational institutions using our tools to enhance learning experiences."}</p>
            <div className={styles["cta-buttons"]}>
              <button className={`${styles["cta-button"]} ${styles["primary"]}`}>
                {"Get Started for Free"}
              </button>
              <button className={`${styles["cta-button"]} ${styles["secondary"]}`}>
                {"Schedule a Demo"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Education;