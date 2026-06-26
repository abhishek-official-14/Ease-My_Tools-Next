import Contact from "@/components/Contact"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "EaseMyTools - Contact",
    description: "Use the Contact tool on EaseMyTools.",
}

export default function Page() {
    return <Contact />
}
