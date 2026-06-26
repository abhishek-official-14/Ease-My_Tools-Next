"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { toolSearch } from "@/lib/toolSearch"

interface ToolSearchProps {
    searchQuery: string
    setSearchQuery: (q: string) => void
}

export default function ToolSearch({
    searchQuery,
    setSearchQuery,
}: ToolSearchProps) {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const filteredTools =
        searchQuery.trim() === ""
            ? []
            : toolSearch.search(searchQuery).map((r) => r.item)

    return (
        <div className="relative mx-auto mb-6 max-w-[500px]">
            <Input
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setIsOpen(false)}
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
                                            key={name}
                                            onMouseDown={(e) =>
                                                e.preventDefault()
                                            } // 👈 THIS keeps the input focused
                                            onSelect={() =>
                                                router.push(
                                                    `/tools/tool/${slug}`
                                                )
                                            }
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
