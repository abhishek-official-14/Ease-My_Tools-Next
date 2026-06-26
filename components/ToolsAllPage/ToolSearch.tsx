"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import { toolSearch } from "@/lib/toolSearch"

type ToolSearchProps = {
    searchQuery: string
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

export default function ToolSearch({
    searchQuery,
    setSearchQuery,
}: ToolSearchProps) {
    const router = useRouter()

    const [isOpen, setIsOpen] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () =>
            document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const filteredTools =
        searchQuery.trim() === ""
            ? []
            : toolSearch.search(searchQuery).map((r) => r.item)

    return (
        <div ref={containerRef} className="relative mx-auto mb-6 max-w-[500px]">
            <Input
                placeholder="Search tools..."
                value={searchQuery}
                onFocus={() => setIsOpen(true)}
                onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setIsOpen(true)
                }}
                className="rounded-full border-2 px-5 py-5 text-sm shadow-md"
            />

            {isOpen && filteredTools.length > 0 && (
                <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                    <Command>
                        <CommandList className="max-h-72 overflow-auto p-2">
                            <CommandGroup>
                                {filteredTools.map(
                                    ({ name, slug, icon: Icon }) => (
                                        <CommandItem
                                            key={slug}
                                            onSelect={() => {
                                                setIsOpen(false)
                                                router.push(
                                                    `/tools/tool/${slug}`
                                                )
                                            }}
                                            className="cursor-pointer rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center">
                                                    <Icon className="h-5 w-5 text-blue-500" />
                                                </div>

                                                <span className="text-base font-medium">
                                                    {name}
                                                </span>
                                            </div>
                                        </CommandItem>
                                    )
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>
            )}
        </div>
    )
}
