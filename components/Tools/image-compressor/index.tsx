// "use client"

// import React, { useState, useRef, useCallback, useEffect } from "react"
// import { ToolHeroProps } from "../../../types/tool"
// import ToolHero from "../../tool-page-helpers/ToolHero"

// // --- Helper functions (unchanged) ---
// function getPrecompressParams(targetKB: number) {
//     if (targetKB <= 100) return { maxWidth: 800, quality: 0.75 }
//     if (targetKB <= 300) return { maxWidth: 1200, quality: 0.85 }
//     if (targetKB <= 600) return { maxWidth: 1800, quality: 0.92 }
//     return { maxWidth: 2200, quality: 0.95 }
// }

// async function precompressImage(file: File, targetKB: number): Promise<File> {
//     return new Promise((resolve, reject) => {
//         const img = new Image()
//         const url = URL.createObjectURL(file)

//         img.onload = () => {
//             URL.revokeObjectURL(url)
//             const { maxWidth, quality } = getPrecompressParams(targetKB)

//             let w = img.naturalWidth
//             let h = img.naturalHeight

//             if (w > maxWidth) {
//                 const ratio = maxWidth / w
//                 w = maxWidth
//                 h = Math.round(h * ratio)
//             }

//             const canvas = document.createElement("canvas")
//             canvas.width = w
//             canvas.height = h

//             const ctx = canvas.getContext("2d")
//             if (!ctx) {
//                 reject(new Error("Canvas context not available"))
//                 return
//             }

//             ctx.drawImage(img, 0, 0, w, h)

//             const mimeType = file.type?.startsWith("image/")
//                 ? file.type
//                 : "image/jpeg"
//             canvas.toBlob(
//                 (blob) => {
//                     if (!blob) {
//                         reject(new Error("Canvas toBlob failed"))
//                         return
//                     }
//                     resolve(
//                         new File([blob], file.name, {
//                             type: mimeType,
//                             lastModified: Date.now(),
//                         })
//                     )
//                 },
//                 mimeType,
//                 quality
//             )
//         }

//         img.onerror = () => {
//             URL.revokeObjectURL(url)
//             reject(new Error("Failed to load image for pre-compression"))
//         }

//         img.src = url
//     })
// }

// function formatSize(bytes: number): string {
//     if (bytes < 1024) return `${bytes} B`
//     if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
//     return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
// }

// function StatCard({
//     label,
//     value,
//     accent,
// }: {
//     label: string
//     value: string
//     accent: "emerald" | "blue" | "violet" | "slate"
// }) {
//     const accentMap = {
//         emerald: "text-emerald-600 dark:text-emerald-400",
//         blue: "text-blue-600 dark:text-blue-400",
//         violet: "text-violet-600 dark:text-violet-400",
//         slate: "text-slate-800 dark:text-slate-100",
//     }

//     return (
//         <div className="flex flex-col gap-0.5 rounded-lg border border-slate-200/80 bg-white/50 px-3 py-2 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50">
//             <span className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
//                 {label}
//             </span>
//             <span
//                 className={`text-sm leading-tight font-bold tabular-nums ${accentMap[accent]}`}
//             >
//                 {value}
//             </span>
//         </div>
//     )
// }

// type CompressionMode = "high" | "balanced" | "small"
// type OutputFormat = "jpeg" | "png" | "webp" | "avif"

// const MODES: { key: CompressionMode; label: string; sub: string }[] = [
//     { key: "high", label: "High quality", sub: "Minimal loss" },
//     { key: "balanced", label: "Balanced", sub: "Best ratio" },
//     { key: "small", label: "Max compression", sub: "Smallest output" },
// ]

// const FORMATS: { key: OutputFormat; label: string }[] = [
//     { key: "jpeg", label: "JPG" },
//     { key: "png", label: "PNG" },
//     { key: "webp", label: "WEBP" },
//     { key: "avif", label: "AVIF" },
// ]

// const ImageCompressor: React.FC = ({ tool }: ToolHeroProps) => {
//     const [selectedFile, setSelectedFile] = useState<File | null>(null)
//     const [previewUrl, setPreviewUrl] = useState<string | null>(null)
//     const [isCompressing, setIsCompressing] = useState(false)
//     const [progress, setProgress] = useState(0)
//     const [error, setError] = useState<string | null>(null)
//     const [result, setResult] = useState<{
//         blobUrl: string
//         compressedSize: number
//         originalSize: number
//         width: number
//         height: number
//         compressionRatio: number
//         sizeReduction: number
//     } | null>(null)

//     const [targetKB, setTargetKB] = useState(100)
//     const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpeg")
//     const [mode, setMode] = useState<CompressionMode>("balanced")
//     const [keepMetadata, setKeepMetadata] = useState(false)
//     const [isDragOver, setIsDragOver] = useState(false)

//     const fileInputRef = useRef<HTMLInputElement>(null)

//     useEffect(() => {
//         return () => {
//             if (previewUrl) URL.revokeObjectURL(previewUrl)
//             if (result?.blobUrl) URL.revokeObjectURL(result.blobUrl)
//         }
//     }, [previewUrl, result])

//     const handleReset = useCallback(() => {
//         if (previewUrl) URL.revokeObjectURL(previewUrl)
//         if (result?.blobUrl) URL.revokeObjectURL(result.blobUrl)
//         setSelectedFile(null)
//         setPreviewUrl(null)
//         setError(null)
//         setProgress(0)
//         setIsCompressing(false)
//         setResult(null)
//         if (fileInputRef.current) fileInputRef.current.value = ""
//     }, [previewUrl, result])

//     const processFile = useCallback(
//         (file: File) => {
//             const allowed = [
//                 "image/jpeg",
//                 "image/png",
//                 "image/webp",
//                 "image/avif",
//             ]
//             if (!allowed.includes(file.type)) {
//                 setError(
//                     "Unsupported format. Please use JPEG, PNG, WebP, or AVIF."
//                 )
//                 return
//             }
//             if (file.size > 50 * 1024 * 1024) {
//                 setError("File size exceeds the 50 MB limit.")
//                 return
//             }
//             if (previewUrl) URL.revokeObjectURL(previewUrl)
//             if (result?.blobUrl) URL.revokeObjectURL(result.blobUrl)
//             setError(null)
//             setSelectedFile(file)
//             setPreviewUrl(URL.createObjectURL(file))
//             setResult(null)
//         },
//         [previewUrl, result]
//     )

//     const handleDragOver = (e: React.DragEvent) => {
//         e.preventDefault()
//         e.stopPropagation()
//         setIsDragOver(true)
//     }

//     const handleDragLeave = (e: React.DragEvent) => {
//         e.preventDefault()
//         e.stopPropagation()
//         setIsDragOver(false)
//     }

//     const handleDrop = (e: React.DragEvent) => {
//         e.preventDefault()
//         e.stopPropagation()
//         setIsDragOver(false)
//         if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0])
//     }

//     const handleClickUpload = () => fileInputRef.current?.click()

//     const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files?.[0]) processFile(e.target.files[0])
//     }

//     const handleCompress = async () => {
//         if (!selectedFile || isCompressing) return
//         setIsCompressing(true)
//         setProgress(0)
//         setError(null)
//         setResult(null)

//         try {
//             const preprocessed = await precompressImage(selectedFile, targetKB)
//             const formData = new FormData()
//             formData.append("file", preprocessed, selectedFile.name)
//             formData.append("targetKB", String(targetKB))
//             formData.append("format", outputFormat)
//             formData.append("mode", mode)
//             formData.append("keepMetadata", String(keepMetadata))

//             const blob = await new Promise<Blob>((resolve, reject) => {
//                 const xhr = new XMLHttpRequest()
//                 xhr.open("POST", "/api/compress")
//                 xhr.responseType = "blob"
//                 xhr.upload.onprogress = (e) => {
//                     if (e.lengthComputable)
//                         setProgress(Math.round((e.loaded / e.total) * 100))
//                 }
//                 xhr.onload = () => {
//                     if (xhr.status >= 200 && xhr.status < 300)
//                         resolve(xhr.response as Blob)
//                     else
//                         reject(new Error(`Server responded with ${xhr.status}`))
//                 }
//                 xhr.onerror = () => reject(new Error("Network error"))
//                 xhr.ontimeout = () => reject(new Error("Upload timed out"))
//                 xhr.send(formData)
//             })

//             const originalSize = selectedFile.size
//             const compressedSize = blob.size
//             const blobUrl = URL.createObjectURL(blob)

//             const dims = await new Promise<{ width: number; height: number }>(
//                 (resolve, reject) => {
//                     const img = new Image()
//                     img.onload = () =>
//                         resolve({
//                             width: img.naturalWidth,
//                             height: img.naturalHeight,
//                         })
//                     img.onerror = () =>
//                         reject(new Error("Failed to load result image"))
//                     img.src = blobUrl
//                 }
//             )

//             const compressionRatio = (compressedSize / originalSize) * 100
//             const sizeReduction =
//                 ((originalSize - compressedSize) / originalSize) * 100

//             setResult({
//                 blobUrl,
//                 compressedSize,
//                 originalSize,
//                 width: dims.width,
//                 height: dims.height,
//                 compressionRatio,
//                 sizeReduction: Math.max(0, sizeReduction),
//             })
//             setProgress(100)
//         } catch (err: unknown) {
//             const msg =
//                 err instanceof Error
//                     ? err.message
//                     : "An unexpected error occurred."
//             setError(msg)
//         } finally {
//             setIsCompressing(false)
//         }
//     }

//     const handleDownload = () => {
//         if (!result || !selectedFile) return
//         const originalName = selectedFile.name.replace(/\.[^/.]+$/, "")
//         const ext = outputFormat === "jpeg" ? "jpg" : outputFormat
//         const a = document.createElement("a")
//         a.href = result.blobUrl
//         a.download = `${originalName}_compressed_${Date.now()}.${ext}`
//         document.body.appendChild(a)
//         a.click()
//         document.body.removeChild(a)
//     }

//     const hasFile = !!selectedFile
//     const hasResult = !!result

//     return (
//         <div className="flex justify-center bg-gradient-to-br from-slate-200 via-white to-slate-200 px-3 py-8 text-slate-900 sm:px-4 sm:py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
//             <div className="w-full max-w-7xl">
//                 <ToolHero tool={tool}></ToolHero>

//                 <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white/80 shadow-xl shadow-slate-200/40 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/80 dark:shadow-black/30">
//                     <div className="grid gap-5 px-4 py-4 sm:px-6 sm:py-5 lg:grid-cols-[1fr_1.05fr]">
//                         {/* Left Panel - Upload Area */}
//                         <div className="min-w-0 space-y-4">
//                             <div
//                                 onDragOver={handleDragOver}
//                                 onDragLeave={handleDragLeave}
//                                 onDrop={handleDrop}
//                                 onClick={
//                                     !hasFile ? handleClickUpload : undefined
//                                 }
//                                 role="button"
//                                 tabIndex={0}
//                                 onKeyDown={(e) => {
//                                     if (
//                                         !hasFile &&
//                                         (e.key === "Enter" || e.key === " ")
//                                     )
//                                         handleClickUpload()
//                                 }}
//                                 className={`group relative rounded-xl border-2 border-dashed bg-white/50 transition-all duration-200 outline-none dark:bg-slate-900/50 ${
//                                     isDragOver
//                                         ? "border-blue-400 bg-blue-50/30 shadow-[0_0_0_1px_rgba(59,130,246,0.2)] dark:border-blue-500/70 dark:bg-blue-500/5"
//                                         : "border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600"
//                                 } ${!hasFile ? "cursor-pointer" : "cursor-default"} `}
//                             >
//                                 <input
//                                     ref={fileInputRef}
//                                     type="file"
//                                     accept="image/jpeg,image/png,image/webp,image/avif"
//                                     className="hidden"
//                                     onChange={handleFileInputChange}
//                                 />

//                                 {!hasFile ? (
//                                     <div className="flex min-h-[220px] flex-col items-center justify-center p-5 text-center">
//                                         <div className="mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 p-3 shadow-inner dark:from-slate-800/60 dark:to-slate-900/60">
//                                             <svg
//                                                 className="h-7 w-7 text-slate-500 dark:text-slate-400"
//                                                 fill="none"
//                                                 stroke="currentColor"
//                                                 strokeWidth={1.5}
//                                                 viewBox="0 0 24 24"
//                                             >
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
//                                                 />
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
//                                                 />
//                                             </svg>
//                                         </div>
//                                         <p className="text-base font-semibold tracking-tight text-slate-800 dark:text-white">
//                                             Drop or select image
//                                         </p>
//                                         <div className="mt-3 flex flex-wrap justify-center gap-1.5">
//                                             <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
//                                                 JPEG
//                                             </span>
//                                             <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
//                                                 PNG
//                                             </span>
//                                             <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
//                                                 WEBP
//                                             </span>
//                                             <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
//                                                 AVIF
//                                             </span>
//                                         </div>
//                                         <p className="mt-3 text-[10px] font-medium tracking-wider text-slate-400 uppercase dark:text-slate-500">
//                                             Max 50 MB
//                                         </p>
//                                     </div>
//                                 ) : (
//                                     <div className="flex min-w-0 items-center gap-4 p-3">
//                                         <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-700 dark:bg-slate-800">
//                                             {previewUrl && (
//                                                 <img
//                                                     src={previewUrl}
//                                                     alt="Preview"
//                                                     className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
//                                                 />
//                                             )}
//                                         </div>
//                                         <div className="min-w-0 flex-1">
//                                             <div className="flex items-start justify-between gap-3">
//                                                 <div className="min-w-0">
//                                                     <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
//                                                         {selectedFile.name}
//                                                     </p>
//                                                     <p className="mt-0.5 text-xs sm:text-base text-slate-500 dark:text-slate-400">
//                                                         {selectedFile.type
//                                                             .split("/")[1]
//                                                             ?.toUpperCase() ||
//                                                             "IMG"}{" "}
//                                                         ·{" "}
//                                                         {formatSize(
//                                                             selectedFile.size
//                                                         )}
//                                                     </p>
//                                                 </div>
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation()
//                                                         handleReset()
//                                                     }}
//                                                     className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1.5 text-xs sm:text-base text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-rose-800/40 dark:hover:bg-rose-950/20 dark:hover:text-rose-300"
//                                                 >
//                                                     <svg
//                                                         className="h-3.5 w-3.5"
//                                                         fill="none"
//                                                         stroke="currentColor"
//                                                         strokeWidth={2}
//                                                         viewBox="0 0 24 24"
//                                                     >
//                                                         <path
//                                                             strokeLinecap="round"
//                                                             strokeLinejoin="round"
//                                                             d="M6 18L18 6M6 6l12 12"
//                                                         />
//                                                     </svg>
//                                                     Remove
//                                                 </button>
//                                             </div>
//                                             <div className="mt-3 rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 dark:border-slate-800/60 dark:bg-slate-800/30">
//                                                 <div className="flex items-center justify-between text-xs sm:text-base text-slate-500 dark:text-slate-400">
//                                                     <span className="font-medium">
//                                                         Original size
//                                                     </span>
//                                                     <span className="font-semibold text-slate-700 dark:text-slate-200">
//                                                         {formatSize(
//                                                             selectedFile.size
//                                                         )}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {error && (
//                                 <div className="rounded-lg border border-rose-200/80 bg-rose-50/80 px-3 py-2.5 text-xs sm:text-base text-rose-700 backdrop-blur-sm dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">
//                                     {error}
//                                 </div>
//                             )}

//                             {isCompressing && (
//                                 <div className="rounded-lg border border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/80">
//                                     <div className="mb-2 flex items-center justify-between text-xs sm:text-base">
//                                         <span className="font-medium text-slate-500 dark:text-slate-400">
//                                             Optimizing...
//                                         </span>
//                                         <span className="font-mono text-xs sm:text-base font-semibold text-blue-600 dark:text-blue-400">
//                                             {progress}%
//                                         </span>
//                                     </div>
//                                     <div className="h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
//                                         <div
//                                             className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out"
//                                             style={{ width: `${progress}%` }}
//                                         />
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Compressed Result Area */}
//                             {hasResult && result ? (
//                                 <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/80">
//                                     <div className="flex items-center gap-4">
//                                         <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-700 dark:bg-slate-800">
//                                             <img
//                                                 src={result.blobUrl}
//                                                 alt="Compressed output"
//                                                 className="h-full w-full object-cover"
//                                             />
//                                         </div>
//                                         <div className="min-w-0 flex-1">
//                                             <p className="text-sm font-semibold text-slate-800 dark:text-white">
//                                                 Compression complete
//                                             </p>
//                                             <p className="mt-0.5 text-xs sm:text-base text-slate-500 dark:text-slate-400">
//                                                 {formatSize(
//                                                     result.originalSize
//                                                 )}{" "}
//                                                 →{" "}
//                                                 {formatSize(
//                                                     result.compressedSize
//                                                 )}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
//                                         <StatCard
//                                             label="Output size"
//                                             value={formatSize(
//                                                 result.compressedSize
//                                             )}
//                                             accent="emerald"
//                                         />
//                                         <StatCard
//                                             label="Reduction"
//                                             value={`${result.sizeReduction.toFixed(1)}%`}
//                                             accent="blue"
//                                         />
//                                         <StatCard
//                                             label="Ratio"
//                                             value={`${result.compressionRatio.toFixed(1)}%`}
//                                             accent="violet"
//                                         />
//                                         <StatCard
//                                             label="Resolution"
//                                             value={`${result.width}×${result.height}`}
//                                             accent="slate"
//                                         />
//                                     </div>

//                                     <button
//                                         onClick={handleDownload}
//                                         className="mt-4 w-full rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2 text-xs sm:text-base font-semibold tracking-wide text-white shadow-sm transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-md active:scale-[0.98]"
//                                     >
//                                         Download{" "}
//                                         {outputFormat === "jpeg"
//                                             ? "JPG"
//                                             : outputFormat.toUpperCase()}
//                                     </button>
//                                 </div>
//                             ) : (
//                                 /* Placeholder for compressed image - only visible on desktop (lg and up) */
//                                 <div className="hidden rounded-xl border border-dashed border-slate-300 bg-white/40 p-6 text-center backdrop-blur-sm transition-all lg:block dark:border-slate-700 dark:bg-slate-900/30">
//                                     <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
//                                         <svg
//                                             className="h-6 w-6 text-slate-400 dark:text-slate-500"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             strokeWidth={1.5}
//                                             viewBox="0 0 24 24"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.75 7.5l-.937 3.281a4.5 4.5 0 01-3.031 3.032L11.25 14.25l3.281.937a4.5 4.5 0 013.032 3.031L18.75 21.75l.937-3.281a4.5 4.5 0 013.032-3.032L26.25 14.25l-3.281-.937a4.5 4.5 0 01-3.032-3.031L18.75 7.5z"
//                                             />
//                                         </svg>
//                                     </div>
//                                     <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
//                                         Compressed image will appear here
//                                     </p>
//                                     <p className="mt-1 text-xs sm:text-base text-slate-400 dark:text-slate-500">
//                                         Adjust settings and click &quot;Compress
//                                         image&quot;
//                                     </p>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Right Panel - Controls (unchanged) */}
//                         <div className="h-full min-w-0">
//                             <div className="flex h-full flex-col rounded-xl border border-slate-200/80 bg-white/50 p-4 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/50">
//                                 {/* Target Size */}
//                                 <div className="mb-7 min-w-0">
//                                     <div className="mb-3 flex items-center justify-between">
//                                         <label className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
//                                             Target size
//                                         </label>
//                                         <span className="text-base font-bold text-slate-800 tabular-nums dark:text-white">
//                                             {targetKB} KB
//                                         </span>
//                                     </div>
//                                     <input
//                                         type="range"
//                                         min={10}
//                                         max={1000}
//                                         step={10}
//                                         value={targetKB}
//                                         onChange={(e) =>
//                                             setTargetKB(Number(e.target.value))
//                                         }
//                                         className="h-1 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-500 dark:bg-slate-800"
//                                     />
//                                     <div className="mt-1.5 flex justify-between text-[10px] font-medium text-slate-400 dark:text-slate-500">
//                                         <span>10 KB</span>
//                                         <span>500 KB</span>
//                                         <span>1,000 KB</span>
//                                     </div>
//                                 </div>

//                                 {/* Output Format */}
//                                 <div className="mb-7 min-w-0">
//                                     <label className="mb-2 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
//                                         Output format
//                                     </label>
//                                     <div className="grid grid-cols-4 gap-1.5">
//                                         {FORMATS.map(({ key, label }) => (
//                                             <button
//                                                 key={key}
//                                                 onClick={() =>
//                                                     setOutputFormat(key)
//                                                 }
//                                                 className={`rounded-lg border px-1 py-1.5 text-xs sm:text-base font-semibold transition-all duration-200 ${
//                                                     outputFormat === key
//                                                         ? "border-blue-500 bg-blue-500 text-white shadow-sm shadow-blue-500/20"
//                                                         : "border-slate-200 bg-white/60 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
//                                                 }`}
//                                             >
//                                                 {label}
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Compression Mode */}
//                                 <div className="mb-7 min-w-0">
//                                     <label className="mb-2 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
//                                         Compression mode
//                                     </label>
//                                     <div className="grid grid-cols-3 gap-1.5">
//                                         {MODES.map(({ key, label, sub }) => (
//                                             <button
//                                                 key={key}
//                                                 onClick={() => setMode(key)}
//                                                 className={`rounded-lg border px-1 py-1.5 text-center transition-all duration-200 ${
//                                                     mode === key
//                                                         ? "border-blue-500 bg-blue-500 text-white shadow-sm shadow-blue-500/20"
//                                                         : "border-slate-200 bg-white/60 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
//                                                 }`}
//                                             >
//                                                 <div className="text-xs sm:text-base font-bold">
//                                                     {label}
//                                                 </div>
//                                                 <div className="mt-0.5 text-[9px] opacity-80">
//                                                     {sub}
//                                                 </div>
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Metadata Toggle */}
//                                 <div className="mb-5 rounded-lg border border-slate-200/80 bg-white/60 p-3 dark:border-slate-800/60 dark:bg-slate-800/30">
//                                     <div className="flex items-center justify-between gap-4">
//                                         <div>
//                                             <p className="text-xs sm:text-base font-semibold text-slate-800 dark:text-white">
//                                                 Preserve EXIF metadata
//                                             </p>
//                                             <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
//                                                 Keep camera settings, GPS, etc.
//                                             </p>
//                                         </div>
//                                         <button
//                                             type="button"
//                                             role="switch"
//                                             aria-checked={keepMetadata}
//                                             onClick={() =>
//                                                 setKeepMetadata(!keepMetadata)
//                                             }
//                                             className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border transition-colors duration-200 ${
//                                                 keepMetadata
//                                                     ? "border-blue-500 bg-blue-500"
//                                                     : "border-slate-300 bg-slate-200 dark:border-slate-700 dark:bg-slate-700"
//                                             }`}
//                                         >
//                                             <span
//                                                 className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${keepMetadata ? "translate-x-4" : "translate-x-0"}`}
//                                             />
//                                         </button>
//                                     </div>
//                                 </div>

//                                 {/* Action Buttons */}
//                                 <div className="mt-auto pt-2">
//                                     <div className="flex gap-2">
//                                         <button
//                                             onClick={handleReset}
//                                             disabled={isCompressing || !hasFile}
//                                             className="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-xs sm:text-base font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
//                                         >
//                                             Reset
//                                         </button>
//                                         <button
//                                             onClick={handleCompress}
//                                             disabled={!hasFile || isCompressing}
//                                             className={`flex-1 rounded-lg px-3 py-2 text-xs sm:text-base font-bold tracking-wide text-white transition-all active:scale-[0.98] ${
//                                                 !hasFile || isCompressing
//                                                     ? "cursor-not-allowed bg-slate-400 dark:bg-slate-700"
//                                                     : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 hover:shadow"
//                                             }`}
//                                         >
//                                             {isCompressing
//                                                 ? "Compressing..."
//                                                 : "Compress image"}
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ImageCompressor



"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { ToolHeroProps } from "../../../types/tool"
import ToolHero from "../../tool-page-helpers/ToolHero"

// --- Helper functions (modified) ---
function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function StatCard({
    label,
    value,
    accent,
}: {
    label: string
    value: string
    accent: "emerald" | "blue" | "violet" | "slate"
}) {
    const accentMap = {
        emerald: "text-emerald-600 dark:text-emerald-400",
        blue: "text-blue-600 dark:text-blue-400",
        violet: "text-violet-600 dark:text-violet-400",
        slate: "text-slate-800 dark:text-slate-100",
    }

    return (
        <div className="flex flex-col gap-0.5 rounded-lg border border-slate-200/80 bg-white/50 px-3 py-2 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50">
            <span className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                {label}
            </span>
            <span
                className={`text-sm leading-tight font-bold tabular-nums ${accentMap[accent]}`}
            >
                {value}
            </span>
        </div>
    )
}

// Check AVIF encoding support (once)
let avifSupported: boolean | null = null
function isAvifSupported(): Promise<boolean> {
    if (avifSupported !== null) return Promise.resolve(avifSupported)
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas")
        canvas.width = 1
        canvas.height = 1
        canvas.toBlob(
            (blob) => {
                avifSupported = blob?.type === "image/avif"
                resolve(avifSupported)
            },
            "image/avif",
            1
        )
    })
}

type CompressionMode = "high" | "balanced" | "small"
type OutputFormat = "jpeg" | "png" | "webp" | "avif"

const MODES: { key: CompressionMode; label: string; sub: string }[] = [
    { key: "high", label: "High quality", sub: "Minimal loss" },
    { key: "balanced", label: "Balanced", sub: "Best ratio" },
    { key: "small", label: "Max compression", sub: "Smallest output" },
]

const FORMATS: { key: OutputFormat; label: string }[] = [
    { key: "jpeg", label: "JPG" },
    { key: "png", label: "PNG" },
    { key: "webp", label: "WEBP" },
    { key: "avif", label: "AVIF" },
]

const ImageCompressor: React.FC<ToolHeroProps> = ({ tool }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isCompressing, setIsCompressing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<{
        blobUrl: string
        compressedSize: number
        originalSize: number
        width: number
        height: number
        compressionRatio: number
        sizeReduction: number
    } | null>(null)

    const [targetKB, setTargetKB] = useState(100)
    const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpeg")
    const [mode, setMode] = useState<CompressionMode>("balanced")
    const [isDragOver, setIsDragOver] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Cleanup object URLs
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
            if (result?.blobUrl) URL.revokeObjectURL(result.blobUrl)
        }
    }, [previewUrl, result])

    const handleReset = useCallback(() => {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        if (result?.blobUrl) URL.revokeObjectURL(result.blobUrl)
        setSelectedFile(null)
        setPreviewUrl(null)
        setError(null)
        setProgress(0)
        setIsCompressing(false)
        setResult(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }, [previewUrl, result])

    const processFile = useCallback(
        (file: File) => {
            const allowed = [
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/avif",
            ]
            if (!allowed.includes(file.type)) {
                setError(
                    "Unsupported format. Please use JPEG, PNG, WebP, or AVIF."
                )
                return
            }
            if (file.size > 50 * 1024 * 1024) {
                setError("File size exceeds the 50 MB limit.")
                return
            }
            if (previewUrl) URL.revokeObjectURL(previewUrl)
            if (result?.blobUrl) URL.revokeObjectURL(result.blobUrl)
            setError(null)
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
            setResult(null)
        },
        [previewUrl, result]
    )

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(true)
    }
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)
    }
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)
        if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0])
    }
    const handleClickUpload = () => fileInputRef.current?.click()
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) processFile(e.target.files[0])
    }

    // Fully client‑side compression using canvas
    const handleCompress = async () => {
        if (!selectedFile || isCompressing) return
        setIsCompressing(true)
        setProgress(0)
        setError(null)
        setResult(null)

        try {
            // AVIF check
            if (outputFormat === "avif") {
                const supported = await isAvifSupported()
                if (!supported) {
                    throw new Error(
                        "AVIF encoding is not supported in your browser. Please choose another format."
                    )
                }
            }

            // Load original image
            const image = await new Promise<HTMLImageElement>(
                (resolve, reject) => {
                    const img = new Image()
                    img.onload = () => resolve(img)
                    img.onerror = () =>
                        reject(new Error("Failed to load image"))
                    img.src = URL.createObjectURL(selectedFile)
                }
            )

            const originalSize = selectedFile.size
            const targetBytes = targetKB * 1024

            // Determine quality range from mode
            let minQ = 1
            let maxQ = 100
            if (mode === "high") {
                minQ = 40
                maxQ = 100
            } else if (mode === "small") {
                minQ = 1
                maxQ = 70
            }

            // For PNG, quality is irrelevant (lossless); use a simpler resize‑only loop
            const isPNG = outputFormat === "png"

            let bestBlob: Blob | null = null
            let bestSize = Infinity
            let finalWidth: number | null = null
            let finalHeight: number | null = null
            const maxResizeAttempts = 6
            const maxInitialWidth = 3000 // safety cap for huge images

            // Outer loop: resize fallback
            for (let r = 0; r < maxResizeAttempts; r++) {
                let width: number | null = null
                if (r === 0) {
                    // first attempt: use original size (capped)
                    width =
                        image.naturalWidth > maxInitialWidth
                            ? maxInitialWidth
                            : image.naturalWidth
                } else {
                    // reduce width stepwise based on mode
                    const decrement = mode === "small" ? 300 : 200
                    width = (width ?? image.naturalWidth) - decrement
                    if (width < 100) width = 100 // absolute minimum
                }

                if (isPNG) {
                    // PNG: no quality loop, just resize and check size
                    const blob = await compressWithCanvas(
                        image,
                        width,
                        outputFormat,
                        90 // arbitrary quality (ignored for PNG)
                    )
                    if (blob.size <= targetBytes || blob.size < bestSize) {
                        bestBlob = blob
                        bestSize = blob.size
                    }
                    if (blob.size <= targetBytes) break // satisfied target
                } else {
                    // Binary search on quality for current width
                    let low = minQ
                    let high = maxQ
                    let localBest: Blob | null = null
                    let localBestSize = Infinity

                    while (low <= high) {
                        const q = Math.floor((low + high) / 2)
                        setProgress(
                            Math.round(
                                ((r * (maxQ - minQ + 1) + (q - minQ + 1)) /
                                    (maxResizeAttempts *
                                        (maxQ - minQ + 1))) *
                                100
                            )
                        ) // rough progress

                        const blob = await compressWithCanvas(
                            image,
                            width,
                            outputFormat,
                            q
                        )
                        const sizeKB = blob.size / 1024

                        if (sizeKB <= targetKB) {
                            localBest = blob
                            localBestSize = blob.size
                            low = q + 1 // try higher quality
                        } else {
                            high = q - 1 // lower quality
                        }
                    }

                    // If we found a good blob at this width, keep it; if it's the best so far, update global best
                    if (localBest && localBest.size <= targetBytes) {
                        bestBlob = localBest
                        bestSize = localBest.size
                        break // target reached
                    } else if (localBest && localBest.size < bestSize) {
                        bestBlob = localBest
                        bestSize = localBest.size
                    } else if (!localBest && bestBlob === null) {
                        // fallback: use the smallest from the last attempt
                        const blob = await compressWithCanvas(
                            image,
                            width,
                            outputFormat,
                            minQ
                        )
                        if (blob.size < bestSize) {
                            bestBlob = blob
                            bestSize = blob.size
                        }
                    }
                }
            }

            // If still nothing (shouldn't happen), use original image as fallback
            const compressedBlob =
                bestBlob ??
                (await compressWithCanvas(
                    image,
                    image.naturalWidth,
                    outputFormat,
                    100
                ))
            const compressedSize = compressedBlob.size

            // Get dimensions of final result
            const dimImg = await new Promise<{
                width: number
                height: number
            }>((resolve, reject) => {
                const img = new Image()
                img.onload = () =>
                    resolve({
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                    })
                img.onerror = () =>
                    reject(new Error("Could not read result dimensions"))
                img.src = URL.createObjectURL(compressedBlob)
            })

            const compressionRatio = (compressedSize / originalSize) * 100
            const sizeReduction =
                ((originalSize - compressedSize) / originalSize) * 100

            const blobUrl = URL.createObjectURL(compressedBlob)
            setResult({
                blobUrl,
                compressedSize,
                originalSize,
                width: dimImg.width,
                height: dimImg.height,
                compressionRatio,
                sizeReduction: Math.max(0, sizeReduction),
            })
            setProgress(100)
        } catch (err: unknown) {
            const msg =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred."
            setError(msg)
        } finally {
            setIsCompressing(false)
        }
    }

    // Utility: compress image via canvas with given width, format, quality
    const compressWithCanvas = async (
        img: HTMLImageElement,
        targetWidth: number,
        format: OutputFormat,
        quality: number
    ): Promise<Blob> => {
        const aspectRatio = img.naturalHeight / img.naturalWidth
        const w = targetWidth
        const h = Math.round(w * aspectRatio)

        const canvas = document.createElement("canvas")
        canvas.width = w
        canvas.height = h

        const ctx = canvas.getContext("2d")
        if (!ctx) throw new Error("Canvas context not available")
        ctx.drawImage(img, 0, 0, w, h)

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) reject(new Error("Canvas toBlob failed"))
                    else resolve(blob)
                },
                `image/${format}`,
                quality / 100
            )
        })
    }

    const handleDownload = () => {
        if (!result || !selectedFile) return
        const originalName = selectedFile.name.replace(/\.[^/.]+$/, "")
        const ext = outputFormat === "jpeg" ? "jpg" : outputFormat
        const a = document.createElement("a")
        a.href = result.blobUrl
        a.download = `${originalName}_compressed_${Date.now()}.${ext}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    const hasFile = !!selectedFile
    const hasResult = !!result

    return (
        <div className="flex justify-center bg-gradient-to-br from-slate-200 via-white to-slate-200 px-3 py-8 text-slate-900 sm:px-4 sm:py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
            <div className="w-full max-w-7xl">
                <ToolHero tool={tool} />

                <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white/80 shadow-xl shadow-slate-200/40 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/80 dark:shadow-black/30">
                    <div className="grid gap-5 px-4 py-4 sm:px-6 sm:py-5 lg:grid-cols-[1fr_1.05fr]">
                        {/* Left Panel – Upload & Result */}
                        <div className="min-w-0 space-y-4">
                            {/* Upload area (unchanged) */}
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={
                                    !hasFile ? handleClickUpload : undefined
                                }
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (
                                        !hasFile &&
                                        (e.key === "Enter" || e.key === " ")
                                    )
                                        handleClickUpload()
                                }}
                                className={`group relative rounded-xl border-2 border-dashed bg-white/50 transition-all duration-200 outline-none dark:bg-slate-900/50 ${isDragOver
                                        ? "border-blue-400 bg-blue-50/30 shadow-[0_0_0_1px_rgba(59,130,246,0.2)] dark:border-blue-500/70 dark:bg-blue-500/5"
                                        : "border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600"
                                    } ${!hasFile ? "cursor-pointer" : "cursor-default"} `}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/avif"
                                    className="hidden"
                                    onChange={handleFileInputChange}
                                />

                                {!hasFile ? (
                                    <div className="flex min-h-[220px] flex-col items-center justify-center p-5 text-center">
                                        <div className="mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 p-3 shadow-inner dark:from-slate-800/60 dark:to-slate-900/60">
                                            <svg
                                                className="h-7 w-7 text-slate-500 dark:text-slate-400"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-base font-semibold tracking-tight text-slate-800 dark:text-white">
                                            Drop or select image
                                        </p>
                                        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                                            {["JPEG", "PNG", "WEBP", "AVIF"].map(
                                                (f) => (
                                                    <span
                                                        key={f}
                                                        className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                                    >
                                                        {f}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                        <p className="mt-3 text-[10px] font-medium tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                            Max 50 MB
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex min-w-0 items-center gap-4 p-3">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                            {previewUrl && (
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                                                        {selectedFile.name}
                                                    </p>
                                                    <p className="mt-0.5 text-xs sm:text-base text-slate-500 dark:text-slate-400">
                                                        {selectedFile.type
                                                            .split("/")[1]
                                                            ?.toUpperCase() ||
                                                            "IMG"}{" "}
                                                        ·{" "}
                                                        {formatSize(
                                                            selectedFile.size
                                                        )}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleReset()
                                                    }}
                                                    className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1.5 text-xs sm:text-base text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-rose-800/40 dark:hover:bg-rose-950/20 dark:hover:text-rose-300"
                                                >
                                                    <svg
                                                        className="h-3.5 w-3.5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="mt-3 rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 dark:border-slate-800/60 dark:bg-slate-800/30">
                                                <div className="flex items-center justify-between text-xs sm:text-base text-slate-500 dark:text-slate-400">
                                                    <span className="font-medium">
                                                        Original size
                                                    </span>
                                                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                                                        {formatSize(
                                                            selectedFile.size
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="rounded-lg border border-rose-200/80 bg-rose-50/80 px-3 py-2.5 text-xs sm:text-base text-rose-700 backdrop-blur-sm dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">
                                    {error}
                                </div>
                            )}

                            {isCompressing && (
                                <div className="rounded-lg border border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/80">
                                    <div className="mb-2 flex items-center justify-between text-xs sm:text-base">
                                        <span className="font-medium text-slate-500 dark:text-slate-400">
                                            Compressing...
                                        </span>
                                        <span className="font-mono text-xs sm:text-base font-semibold text-blue-600 dark:text-blue-400">
                                            {progress}%
                                        </span>
                                    </div>
                                    <div className="h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Compressed Result Area */}
                            {hasResult && result ? (
                                <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/80">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                            <img
                                                src={result.blobUrl}
                                                alt="Compressed output"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                                Compression complete
                                            </p>
                                            <p className="mt-0.5 text-xs sm:text-base text-slate-500 dark:text-slate-400">
                                                {formatSize(
                                                    result.originalSize
                                                )}{" "}
                                                →{" "}
                                                {formatSize(
                                                    result.compressedSize
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                        <StatCard
                                            label="Output size"
                                            value={formatSize(
                                                result.compressedSize
                                            )}
                                            accent="emerald"
                                        />
                                        <StatCard
                                            label="Reduction"
                                            value={`${result.sizeReduction.toFixed(1)}%`}
                                            accent="blue"
                                        />
                                        <StatCard
                                            label="Ratio"
                                            value={`${result.compressionRatio.toFixed(1)}%`}
                                            accent="violet"
                                        />
                                        <StatCard
                                            label="Resolution"
                                            value={`${result.width}×${result.height}`}
                                            accent="slate"
                                        />
                                    </div>

                                    <button
                                        onClick={handleDownload}
                                        className="mt-4 w-full rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2 text-xs sm:text-base font-semibold tracking-wide text-white shadow-sm transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-md active:scale-[0.98]"
                                    >
                                        Download{" "}
                                        {outputFormat === "jpeg"
                                            ? "JPG"
                                            : outputFormat.toUpperCase()}
                                    </button>
                                </div>
                            ) : (
                                /* Placeholder for compressed image (desktop) */
                                <div className="hidden rounded-xl border border-dashed border-slate-300 bg-white/40 p-6 text-center backdrop-blur-sm transition-all lg:block dark:border-slate-700 dark:bg-slate-900/30">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                        <svg
                                            className="h-6 w-6 text-slate-400 dark:text-slate-500"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={1.5}
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.75 7.5l-.937 3.281a4.5 4.5 0 01-3.031 3.032L11.25 14.25l3.281.937a4.5 4.5 0 013.032 3.031L18.75 21.75l.937-3.281a4.5 4.5 0 013.032-3.032L26.25 14.25l-3.281-.937a4.5 4.5 0 01-3.032-3.031L18.75 7.5z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Compressed image will appear here
                                    </p>
                                    <p className="mt-1 text-xs sm:text-base text-slate-400 dark:text-slate-500">
                                        Adjust settings and click &quot;Compress
                                        image&quot;
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right Panel – Controls (Keep metadata removed) */}
                        <div className="h-full min-w-0">
                            <div className="flex h-full flex-col rounded-xl border border-slate-200/80 bg-white/50 p-4 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/50">
                                {/* Target Size */}
                                <div className="mb-7 min-w-0">
                                    <div className="mb-3 flex items-center justify-between">
                                        <label className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                            Target size
                                        </label>
                                        <span className="text-base font-bold text-slate-800 tabular-nums dark:text-white">
                                            {targetKB} KB
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min={10}
                                        max={1000}
                                        step={10}
                                        value={targetKB}
                                        onChange={(e) =>
                                            setTargetKB(Number(e.target.value))
                                        }
                                        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-500 dark:bg-slate-800"
                                    />
                                    <div className="mt-1.5 flex justify-between text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                        <span>10 KB</span>
                                        <span>500 KB</span>
                                        <span>1,000 KB</span>
                                    </div>
                                </div>

                                {/* Output Format */}
                                <div className="mb-7 min-w-0">
                                    <label className="mb-2 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        Output format
                                    </label>
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {FORMATS.map(({ key, label }) => (
                                            <button
                                                key={key}
                                                onClick={() =>
                                                    setOutputFormat(key)
                                                }
                                                className={`rounded-lg border px-1 py-1.5 text-xs sm:text-base font-semibold transition-all duration-200 ${outputFormat === key
                                                        ? "border-blue-500 bg-blue-500 text-white shadow-sm shadow-blue-500/20"
                                                        : "border-slate-200 bg-white/60 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                                                    }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                    {outputFormat === "avif" && (
                                        <p className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">
                                            AVIF encoding requires browser
                                            support.
                                        </p>
                                    )}
                                </div>

                                {/* Compression Mode */}
                                <div className="mb-7 min-w-0">
                                    <label className="mb-2 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        Compression mode
                                    </label>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {MODES.map(({ key, label, sub }) => (
                                            <button
                                                key={key}
                                                onClick={() => setMode(key)}
                                                className={`rounded-lg border px-1 py-1.5 text-center transition-all duration-200 ${mode === key
                                                        ? "border-blue-500 bg-blue-500 text-white shadow-sm shadow-blue-500/20"
                                                        : "border-slate-200 bg-white/60 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                                                    }`}
                                            >
                                                <div className="text-xs sm:text-base font-bold">
                                                    {label}
                                                </div>
                                                <div className="mt-0.5 text-[9px] opacity-80">
                                                    {sub}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Metadata notice – replaced the toggle */}
                                <div className="mb-5 rounded-lg border border-slate-200/80 bg-white/60 p-3 dark:border-slate-800/60 dark:bg-slate-800/30">
                                    <p className="text-xs sm:text-base font-semibold text-slate-800 dark:text-white">
                                        Metadata (EXIF) not preserved
                                    </p>
                                    <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                                        Browser‑based compression always strips
                                        metadata.
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-auto pt-2">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleReset}
                                            disabled={isCompressing || !hasFile}
                                            className="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-xs sm:text-base font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            onClick={handleCompress}
                                            disabled={!hasFile || isCompressing}
                                            className={`flex-1 rounded-lg px-3 py-2 text-xs sm:text-base font-bold tracking-wide text-white transition-all active:scale-[0.98] ${!hasFile || isCompressing
                                                    ? "cursor-not-allowed bg-slate-400 dark:bg-slate-700"
                                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 hover:shadow"
                                                }`}
                                        >
                                            {isCompressing
                                                ? "Compressing..."
                                                : "Compress image"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageCompressor