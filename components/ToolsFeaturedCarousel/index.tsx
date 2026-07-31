"use client"

import { useState } from "react"
import Header from "@/components/Header"
import ToolSearch from "./ToolSearch"
import CategoryCarousel from "./CategoryCarousel"
import { getFeaturedCategories } from "@/data/featuredCategories"
import { Button } from "../ui/button"
import Link from "next/link"

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
                <div className="flex justify-center mt-6 text-base">
                    <Button variant={"default"}>
                        <Link href={"/tools"}>All Tools →</Link>
                    </Button>
                </div>
            </main>
        </>
    )
}
