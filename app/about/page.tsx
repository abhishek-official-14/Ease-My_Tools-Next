import About from "@/components/About"

import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "EaseMyTools - About",
    description: "Use the About tool on EaseMyTools.",
}

export default function Page() {
    return <About />
}
