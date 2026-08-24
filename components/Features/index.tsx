// "use client"
// import styles from "./styles.module.css"

// const Features = () => {
//     const features = [
//         {
//             icon: "⚡",
//             title: "Lightning Fast",
//             description:
//                 "Process files in seconds with our optimized algorithms and browser-based processing.",
//         },
//         {
//             icon: "🔒",
//             title: "100% Secure",
//             description:
//                 "All processing happens locally in your browser. Your files never leave your device.",
//         },
//         {
//             icon: "💯",
//             title: "Completely Free",
//             description:
//                 "No hidden costs, no watermarks, no subscription fees. Everything is free forever.",
//         },
//         {
//             icon: "🎯",
//             title: "No Watermarks",
//             description:
//                 "Get clean, professional results without any branding or watermarks.",
//         },
//         {
//             icon: "📱",
//             title: "Fully Responsive",
//             description:
//                 "Works perfectly on desktop, tablet, and mobile devices.",
//         },
//         {
//             icon: "🌐",
//             title: "No Installation",
//             description:
//                 "Use all tools directly in your browser without downloading any software.",
//         },
//         {
//             icon: "🔄",
//             title: "Real-time Processing",
//             description:
//                 "See changes instantly with live preview and real-time processing.",
//         },
//         {
//             icon: "🎨",
//             title: "Professional Quality",
//             description:
//                 "Enterprise-grade tools that produce professional-quality results.",
//         },
//     ]

//     return (
//         <div className={styles["features-page"]}>
//             <div className={styles["features-container"]}>
//                 <header className={styles["features-header"]}>
//                     <h1>{"Powerful Features"}</h1>
//                     <p className={styles["features-subtitle"]}>
//                         {
//                             "Everything you need to simplify your digital workflow"
//                         }
//                     </p>
//                 </header>

//                 <div className={styles["features-grid"]}>
//                     {features.map((feature, index) => (
//                         <div key={index} className={styles["feature-card"]}>
//                             <div className={styles["feature-icon"]}>
//                                 {feature.icon}
//                             </div>
//                             <h3>{feature.title}</h3>
//                             <p>{feature.description}</p>
//                         </div>
//                     ))}
//                 </div>

//                 <div className={styles["features-cta"]}>
//                     <h2>{"Ready to get started?"}</h2>
//                     <p>{"Choose from 50+ free tools to simplify your work"}</p>
//                     <button
//                         className={styles["cta-button"]}
//                         onClick={() => (window.location.href = "/tools")}
//                     >
//                         {"Explore All Tools"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Features



import Link from "next/link"
import {
    Zap,
    ShieldCheck,
    Sparkles,
    CheckCircle2,
    Smartphone,
    Globe2,
    RotateCw,
    Layers,
    ArrowRight,
    LayoutGrid,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description:
            "Process files in seconds with optimized algorithms and browser-based processing.",
    },
    {
        icon: ShieldCheck,
        title: "100% Secure",
        description:
            "All processing happens locally in your browser. Your files never leave your device.",
    },
    {
        icon: Sparkles,
        title: "Completely Free",
        description:
            "No hidden costs, no watermarks, no subscription fees. Everything is free forever.",
    },
    {
        icon: CheckCircle2,
        title: "No Watermarks",
        description:
            "Get clean, professional results without any branding, badges, or watermarks.",
    },
    {
        icon: Smartphone,
        title: "Fully Responsive",
        description:
            "Optimized experience across desktop, tablet, and mobile browsers seamlessly.",
    },
    {
        icon: Globe2,
        title: "No Installation",
        description:
            "Use all tools directly in your browser without installing heavy software.",
    },
    {
        icon: RotateCw,
        title: "Real-time Processing",
        description:
            "See changes instantly with fast live preview and continuous feedback.",
    },
    {
        icon: Layers,
        title: "Professional Quality",
        description:
            "High-standard tools that produce crisp, production-grade output files.",
    },
]

export default function Features() {
    return (
        <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        Powerful Features
                    </h1>
                    <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg">
                        Everything you need to simplify your digital workflow
                    </p>
                </div>

                {/* Grid */}
                <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={index}
                                className="group relative flex flex-col items-center justify-start rounded-2xl border border-border/60 bg-card/60 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/5 dark:bg-card/30 dark:hover:bg-card/60"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                                    <Icon className="h-7 w-7 stroke-[1.75]" />
                                </div>

                                <h3 className="mt-5 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                                    {feature.title}
                                </h3>

                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* Bottom CTA Box */}
                <div className="mt-16 rounded-3xl border border-border/60 bg-gradient-to-b from-card/80 to-card/30 p-8 text-center backdrop-blur-sm sm:p-12">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Ready to get started?
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
                        Choose from our collection of free tools to simplify your work.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="w-full max-w-xs rounded-xl shadow-md sm:w-auto sm:px-8"
                        >
                            <Link href="/tools" className="flex items-center justify-center gap-2">
                                <LayoutGrid className="h-4 w-4" />
                                <span>Explore All Tools</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}