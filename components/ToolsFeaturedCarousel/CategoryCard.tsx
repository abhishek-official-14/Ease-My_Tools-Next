"use client"

import { useRouter } from "next/navigation"
import { FeaturedCategory } from "../../types/category"

interface CategoryCardProps {
    category: FeaturedCategory
}

export default function CategoryCard({ category }: CategoryCardProps) {
    const router = useRouter()

    return (
        <div
            onClick={() => router.push(category.link)}
            style={{ backgroundColor: category.color }}
            className="flex h-full min-h-[120px] cursor-pointer flex-col rounded-xl p-3 text-white transition-all duration-300 hover:scale-[1.02] sm:min-h-[140px] sm:p-4 md:min-h-[160px] md:rounded-2xl md:p-5"
        >
            {/* icon + title + count */}
            <div className="mb-[0.4rem] flex items-center gap-2 sm:mb-2 md:mb-3">
                <div>
                    <category.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                </div>
                <h3 className="flex-1 text-sm font-bold sm:text-base md:text-lg">
                    {category.title}
                </h3>
                <span className="text-xs">{category.count}</span>
            </div>

            {/* description */}
            <p className="flex-1 text-xs leading-snug md:text-sm">
                {category.description}
            </p>

            {/* footer */}
            <div className="mt-2 text-xs opacity-75">Click to explore →</div>
        </div>
    )
}
