"use client";


import { useRouter } from 'next/navigation';
import styles from './styles.module.css';

const FeaturedTools = () => {
  const router = useRouter();

  const featuredTools = [
    {
      icon: '🖼️',
      title: "Remove Background",
      description: "AI-powered background removal in seconds",
      badge: 'Popular',
      path: '/tools/remove-background'
    },
    {
      icon: '📄',
      title: "PDF Converter",
      description: "Convert PDFs to various formats",
      path: '/tools/file-converter' // Update this to match your actual PDF tool route
    },
    {
      icon: '🎨',
      title: "Image Resizer",
      description: "Resize images without quality loss",
      path: '/tools/image-resizer'
    },
    {
      icon: '🔐',
      title: "Password Generator",
      description: "Create strong, secure passwords",
      badge: 'New',
      path: '/tools/password-generator'
    }
  ];

  const handleToolClick = (path) => {
    router.push(path);
  };

  return (
    <section className={styles["featured-tools"]}>
      <div className={`container`}>
        <h2>{"Most Popular Tools"}</h2>
        <p className={styles["section-subtitle"]}>
          {"Try our most loved tools trusted by thousands"}
        </p>
        <div className={styles["tools-grid"]}>
          {featuredTools.map((tool, index) => (
            <div 
              key={index} 
              className={styles["tool-card"]}
              onClick={() => handleToolClick(tool.path)}
            >
              {tool.badge && <span className={styles["tool-badge"]}>{tool.badge}</span>}
              <div className={styles["tool-icon"]}>{tool.icon}</div>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <button className={styles["tool-btn"]}>
                {"Use Tool →"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTools;