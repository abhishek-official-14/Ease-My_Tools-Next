"use client"

import { CATEGORIES } from "@/data/featuredCategories"

type ToolFiltersProps = {
    selectedTag: string
    setSelectedTag: React.Dispatch<React.SetStateAction<string>>
}

export default function ToolFilters({
    selectedTag,
    setSelectedTag,
}: ToolFiltersProps) {
    function toggleTag(tag: string) {
        setSelectedTag(tag)
    }

    return (
        <div className="mx-auto mb-6 max-w-6xl">
            <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((category) => (
                    <button
                        key={category.tag}
                        onClick={() => toggleTag(category.tag)}
                        className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                            selectedTag===(category.tag)
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent"
                        }`}
                    >
                        {category.title}
                    </button>
                ))}
            </div>
        </div>
    )
}
