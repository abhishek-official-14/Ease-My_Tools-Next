import ToolsPage from "@/components/ToolsFeaturedCarousel"
import HomePage from "@/components/HomePage"
import type { Metadata } from "next"
import { createSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = createSEOMetadata({
    title: "Home",
    description:
        "Discover free browser-based tools for file conversion, image editing, text formatting, and daily productivity workflows.",
    path: "/",
})

export default function Page() {
    return (
        <>
            <ToolsPage />
            <HomePage />
            {/* <div className="flex min-h-svh p-6">
        <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
          <div>
            <h1 className="font-medium">Project ready!</h1>
            <p>You may now add components and start building.</p>
            <p>We&apos;ve already added the button component for you.</p>
            <Button className="mt-2">Button</Button>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            (Press <kbd>d</kbd> to toggle dark mode)
          </div>
        </div>
      </div> */}
        </>
    )
}
