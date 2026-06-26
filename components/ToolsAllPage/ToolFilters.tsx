"use client"

import { CATEGORIES } from "@/data/featuredCategories"

type ToolFiltersProps = {
    selectedTags: string[]
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
}

export default function ToolFilters({
    selectedTags,
    setSelectedTags,
}: ToolFiltersProps) {
    function toggleTag(tag: string) {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        )
    }

    return (
        <div className="mx-auto mb-6 max-w-6xl">
            <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((tag) => (
                    <button
                        key={tag.tag}
                        onClick={() => toggleTag(tag.tag)}
                        className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                            selectedTags.includes(tag.tag)
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent"
                        }`}
                    >
                        {tag.title}
                    </button>
                ))}
            </div>
        </div>
    )
}
