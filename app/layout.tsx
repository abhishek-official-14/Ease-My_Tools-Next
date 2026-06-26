import type { Metadata, Viewport } from "next"

import "./globals.css"

import Navbar from "../components/Navbar"
import Footer from "@/components/Footer"
import Providers from "./providers"

import { SITE_CONFIG, createSEOMetadata } from "@/lib/seo"

import {
    createOrganizationSchema,
    createWebsiteSchema,
} from "@/lib/schema/core"

import { Geist, Geist_Mono } from "next/font/google"

import { cn } from "@/lib/utils"

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-sans",
})

const fontMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
})

export const metadata: Metadata = {
    metadataBase: new URL(SITE_CONFIG.siteUrl),
    title: {
        default: SITE_CONFIG.defaultTitle,
        template: SITE_CONFIG.titleTemplate,
    },
    ...createSEOMetadata({
        title: SITE_CONFIG.defaultTitle,
        description: SITE_CONFIG.defaultDescription,
        path: "/",
    }),
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#7c3aed",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const organizationSchema = createOrganizationSchema()

    const websiteSchema = createWebsiteSchema()

    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn(
                "antialiased",
                fontMono.variable,
                "font-sans",
                geist.variable
            )}
        >
            <body>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationSchema),
                    }}
                />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(websiteSchema),
                    }}
                />

                <Providers>
                    <div>
                        <Navbar />

                        <main className="main-content">{children}</main>

                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    )
}
