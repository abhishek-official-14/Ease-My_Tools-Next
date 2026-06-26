"use client"

import { useState } from "react"
import Header from "@/components/Header"
import ToolSearch from "./ToolSearch"
import CategoryCarousel from "./CategoryCarousel"
import { getFeaturedCategories } from "@/data/featuredCategories"

export default function ToolsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const featuredCategories = getFeaturedCategories()

    return (
        <>
            <Header />
            <main className="bg-background p-4 text-foreground transition-colors">
                <ToolSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
                <CategoryCarousel featuredCategories={featuredCategories} />
            </main>
        </>
    )
}
