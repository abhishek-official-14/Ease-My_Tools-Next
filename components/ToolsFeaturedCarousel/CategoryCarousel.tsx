"use client"

import { useState, useEffect, useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { type CarouselApi } from "@/components/ui/carousel"
import CategoryCard from "./CategoryCard"
import { FeaturedCategory } from "../../types/category"

interface CategoryCarouselProps {
    featuredCategories: FeaturedCategory[] // your category type
}

const CARDS_PER_SLIDE = 4
const AUTO_SCROLL_DELAY = 2500

export default function CategoryCarousel({
    featuredCategories,
}: CategoryCarouselProps) {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const autoplayRef = useRef(
        Autoplay({
            delay: AUTO_SCROLL_DELAY,
            stopOnInteraction: true, // stop when user drags
            stopOnMouseEnter: false, // we’ll handle hover manually
        })
    )

    // Pause / resume on hover
    useEffect(() => {
        const plugin = autoplayRef.current
        if (!plugin || !api) return

        if (isHovered) {
            plugin.stop()
        } else {
            plugin.play()
        }
    }, [isHovered, api])

    // Resume after a drag ends (if not hovering)
    useEffect(() => {
        if (!api) return

        const onSettle = () => {
            if (!isHovered) {
                autoplayRef.current.play()
            }
        }

        api.on("settle", onSettle)
        return () => {
            api.off("settle", onSettle)
        }
    }, [api, isHovered])

    // Keep track of active dot
    useEffect(() => {
        if (!api) return

        setCurrent(api.selectedScrollSnap())
        api.on("select", () => setCurrent(api.selectedScrollSnap()))
    }, [api])

    // Build slides: 4 cards per slide
    const slides = Array.from(
        { length: Math.ceil(featuredCategories.length / CARDS_PER_SLIDE) },
        (_, i) =>
            featuredCategories.slice(
                i * CARDS_PER_SLIDE,
                (i + 1) * CARDS_PER_SLIDE
            )
    )

    return (
        <div className="mx-auto max-w-[1200px]">
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Carousel
                    opts={{ loop: true }}
                    plugins={[autoplayRef.current]}
                    setApi={setApi}
                    className="w-full"
                >
                    <CarouselContent>
                        {slides.map((group, i) => (
                            <CarouselItem key={i}>
                                {/* Exact original breakpoints: phone 2 cols, tablet 2 cols, desktop 4 cols */}
                                <div className="grid grid-cols-2 gap-2 px-2 sm:gap-3 md:grid-cols-4 md:gap-4">
                                    {group.map((cat) => (
                                        <CategoryCard
                                            key={cat.id}
                                            category={cat}
                                        />
                                    ))}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>

            {/* Dots – pixel perfect match to original CSS */}
            <div className="mt-6 flex justify-center gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={`h-[5px] rounded-[10px] transition-all duration-300 ${
                            index === current
                                ? "w-[45px] bg-blue-500"
                                : "w-[30px] bg-gray-300 dark:bg-gray-600"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
