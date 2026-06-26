"use client"

import { useEffect, useMemo, useState } from "react"

import { getAllTools } from "@/data"

import ToolFilters from "./ToolFilters"
import ToolGrid from "./ToolGrid"
import ToolPagination from "./ToolPagination"
import ToolSearch from "./ToolSearch"

const TOOLS_PER_PAGE = 16

export default function ToolsClient() {
    const [searchQuery, setSearchQuery] = useState("")

    const [selectedTags, setSelectedTags] = useState<string[]>([])

    const [currentPage, setCurrentPage] = useState(1)

    const filteredTools = useMemo(() => {
        let tools = getAllTools()

        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase()

            tools = tools.filter(
                (tool) =>
                    tool.name.toLowerCase().includes(query) ||
                    tool.slug.toLowerCase().includes(query) ||
                    tool.tags.some((tag) =>
                        tag.toLowerCase().includes(query)
                    ) ||
                    tool.seo.title.toLowerCase().includes(query)
            )
        }

        if (selectedTags.length > 0) {
            tools = tools.filter((tool) =>
                selectedTags.every((tag) => tool.tags.includes(tag))
            )
        }

        return tools
    }, [searchQuery, selectedTags])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedTags])

    const totalPages = Math.ceil(filteredTools.length / TOOLS_PER_PAGE)

    const paginatedTools = useMemo(() => {
        const start = (currentPage - 1) * TOOLS_PER_PAGE

        return filteredTools.slice(start, start + TOOLS_PER_PAGE)
    }, [filteredTools, currentPage])

    return (
        <>
            <ToolSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <ToolFilters
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
            />

            <div className="mb-6 text-sm text-muted-foreground">
                {filteredTools.length} tools found
            </div>

            <ToolGrid tools={paginatedTools} />

            <ToolPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
        </>
    )
}
