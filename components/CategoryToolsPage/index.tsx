"use client";

import { useState, useEffect, type ComponentType } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./styles.module.css";
import { categoryTitles, toolsByCategory } from "../../data/toolsData";
import BackButton from "../BackButton";

type CategoryToolsPageProps = {
  categoryId?: string;
};

const CategoryToolsPage = ({ categoryId: categoryIdProp }: CategoryToolsPageProps) => {
  const params = useParams<{ categoryId?: string; slug?: string }>();
  const categoryId = categoryIdProp ?? params?.categoryId ?? params?.slug;
  const router = useRouter();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, [categoryId]);

  if (!categoryId || !(toolsByCategory as Record<string, unknown>)[categoryId] || (toolsByCategory as Record<string, unknown>)[categoryId].length === 0) {
    return (
      <div className={styles.categoryToolsPage}>
        <div className={styles.categoryHeader}>
          <BackButton />
          <h1>Category Not Found</h1>
          <p>{"The category \""}{categoryId}{"\" doesn't exist or has no tools."}</p>
          <button
            className={styles.backButton}
            onClick={() => router.push("/tools" as unknown)}
            style={{ marginTop: "1rem" }}
          >
            Go to Tools Page
          </button>
        </div>
      </div>
    );
  }

  const categoryTools = (toolsByCategory as Record<string, unknown>)[categoryId];

  return (
    <div className={styles.categoryToolsPage}>
      <div className={styles.categoryHeader}>
        <BackButton />
        <h1>{(categoryTitles as Record<string, unknown>)[categoryId] || "Tools"}</h1>
        <p>{categoryTools.length} tools available</p>
      </div>

      <div
        className={`${styles.categoryToolsGrid} ${animated ? styles.animated : ""
          }`}
      >
        {categoryTools.map((tool: { icon: ComponentType<{ className?: string }>; name: string; slug: string }, index: number) => {
          const IconComponent = tool.icon;

          return (
            <div
              key={tool.name}
              className={`${styles.categoryToolCard} ${styles.floatingCard}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => router.push(`/tools/${tool.slug}` as unknown)}
            >
              <div className={styles.toolCardContent}>
                <IconComponent className={styles.toolCardIcon} />
                <h3>{tool.name}</h3>
                <p>Click to use this tool</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryToolsPage;
