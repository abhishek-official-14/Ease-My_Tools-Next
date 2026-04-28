"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from './styles.module.css';
import { useRouter } from "next/navigation";
import { getToolCategories, getAllTools } from "../../data/toolsData";
import Header from "../Header";

const AUTO_SCROLL_INTERVAL = 2500;

const ToolsPage = () => {
    const router = useRouter();

    const toolCategories = getToolCategories();
    const allTools = getAllTools();
    const cardsPerSlide = 4;
    const realSlides = Math.ceil(toolCategories.length / cardsPerSlide);

    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [enableTransition, setEnableTransition] = useState(true);
    const [dragOffset, setDragOffset] = useState(0);
    const [hasMoved, setHasMoved] = useState(false);

    const sliderRef = useRef<HTMLDivElement | null>(null);
    const startX = useRef<number>(0);

    const filteredTools = searchQuery.trim()
        ? allTools.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    // --- SLIDER ACTIONS ---
    const next = useCallback(() => {
        if (realSlides === 0) return;
        setEnableTransition(true);
        setCurrentIndex((prev) => prev + 1);
    }, [realSlides]);

    const prev = useCallback(() => {
        if (realSlides === 0) return;
        setEnableTransition(true);
        setCurrentIndex((prev) => prev - 1);
    }, [realSlides]);

    /* --- AUTO SCROLL --- */
    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval> | undefined;
        if (!isDragging && !isHovered && realSlides > 0 && !document.hidden) {
            intervalId = setInterval(next, AUTO_SCROLL_INTERVAL);
        }
        return () => clearInterval(intervalId);
    }, [isDragging, isHovered, realSlides, next]);

    /* --- DRAG HANDLERS --- */
    const handleStart = (clientX: number) => {
        setIsDragging(true);
        setHasMoved(false);
        setEnableTransition(false);
        startX.current = clientX;
    };

    const handleMove = (clientX: number) => {
        if (!isDragging) return;
        const diff = clientX - startX.current;
        if (Math.abs(diff) > 5) {
            setHasMoved(true);
        }
        setDragOffset(diff);
    };

    const handleEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        setEnableTransition(true);

        if (Math.abs(dragOffset) > 50) {
            if (dragOffset > 0) prev();
            else next();
        }
        setDragOffset(0);
    };

    /* --- GLOBAL MOUSE UP SAFETY --- */
    useEffect(() => {
        const handleGlobalUp = () => {
            if (isDragging) handleEnd();
        };
        window.addEventListener("mouseup", handleGlobalUp);
        return () => window.removeEventListener("mouseup", handleGlobalUp);
    }, [isDragging, dragOffset]);

    /* --- CLONE CORRECTION (INFINITE EFFECT) --- */
    const handleTransitionEnd = () => {
        if (currentIndex === 0) {
            setEnableTransition(false);
            setCurrentIndex(realSlides);
        } else if (currentIndex >= realSlides + 1) {
            setEnableTransition(false);
            setCurrentIndex(1);
        }
    };

    const getSlide = (idx: number) => toolCategories.slice((idx - 1) * cardsPerSlide, idx * cardsPerSlide);

    const slides = realSlides > 0 ? [
        getSlide(realSlides),
        ...Array.from({ length: realSlides }, (_, i) => getSlide(i + 1)),
        getSlide(1)
    ] : [];

    const containerWidth = sliderRef.current?.offsetWidth || 1;
    const dragPercent = (dragOffset / containerWidth) * 100;
    const finalTranslateX = -(currentIndex * 100) + dragPercent;

    return (
        <>
            <Header />
            <div className={styles["tools-page"]}>
                {/* --- SEARCH SECTION --- */}
                <div className={styles["search-container"]}>
                    <div className={styles["search-bar"]}>
                        <input
                            placeholder={"Search tools..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsOpen(true)}
                            onBlur={() => setIsOpen(false)}
                        />
                    </div>
                    {isOpen && filteredTools.length > 0 && (
                        <div className={styles["tool-dropdown"]}>
                            <ul className={styles["tool-list"]}>
                                {filteredTools.map(({ name, slug, icon: Icon }) => (
                                    <li
                                        key={name}
                                        className={styles["tool-item"]}
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // Prevents input blur
                                            router.push(`/tools/${slug}`);
                                        }}
                                    >
                                        <div className={styles["tool-link"]}>
                                            <div className={styles["search-icon-wrapper"]}>
                                                <Icon className={styles["tool-icon-svg"]} />
                                            </div>
                                            <span className={styles["tool-label"]}>{name}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* --- SLIDER SECTION --- */}
                <div className={styles["categories-slider"]}>
                    {realSlides > 0 && (
                        <div
                            className={styles["slider-container"]}
                            ref={sliderRef}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleStart(e.clientX)}
                            onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => handleMove(e.clientX)}
                            onMouseUp={handleEnd}
                            onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => handleStart(e.touches?.[0]?.clientX || 0)}
                            onTouchMove={(e: React.TouchEvent<HTMLDivElement>) => handleMove(e.touches?.[0]?.clientX || 0)}
                            onTouchEnd={handleEnd}
                            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                        >
                            <div
                                className={styles["slider-track"]}
                                onTransitionEnd={handleTransitionEnd}
                                style={{
                                    transform: `translateX(${finalTranslateX}%)`,
                                    transition: enableTransition ? "transform 0.5s ease-out" : "none",
                                    display: 'flex',
                                    userSelect: 'none'
                                }}
                            >
                                {slides.map((group, i) => (
                                    <div key={`slide-${i}`} className={styles["cards-grid"]} style={{ minWidth: '100%', flexShrink: 0 }}>
                                        {group.map((category) => (
                                            <div
                                                key={category.id}
                                                className={styles["category-card"]}
                                                style={{ backgroundColor: category.color }}
                                                onClick={() => {
                                                    if (!hasMoved) {
                                                        router.push(category.link as any);
                                                    }
                                                }}
                                            >
                                                <div className={styles["card-top"]}>
                                                    <div className={styles["card-icon"]}><category.icon /></div>
                                                    <div className={styles["card-title"]}>{category.title}</div>
                                                    <div className={styles["tools-count"]}>{category.count}</div>
                                                </div>
                                                <p className={styles["card-description"]}>{category.description}</p>
                                                <div className={styles["card-footer"]}>Click to explore →</div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={styles["slider-dots"]}>
                        {Array.from({ length: realSlides }).map((_, i) => (
                            <button
                                key={i}
                                className={`${styles["dot"]} ${currentIndex === i + 1 ? styles["active"] : ""}`}
                                onClick={() => {
                                    setEnableTransition(true);
                                    setCurrentIndex(i + 1);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ToolsPage;