"use client"

import React, { useCallback, useMemo, useRef, useState } from "react"
import JSZip from "jszip"
import {
  ArrowDownToLine,
  Check,
  Download,
  Eye,
  GripVertical,
  ImagePlus,
  Loader2,
  Palette,
  RotateCcw,
  ScanFace,
  Share2,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
  Zap,
} from "lucide-react"
import ToolHero from "@/components/tool-page-helpers/ToolHero"
import { ToolHeroProps } from "@/types/tool"

type Platform = {
  id: string
  name: string
  icon: string
  size: number
  aspect: string
  dimensions: string
  quality: number
  bgColor: string
  description: string
}

type ExportFormat = "png" | "jpeg" | "webp" | "avif"
type CropMode = "smart" | "center" | "manual"
type BackgroundMode = "transparent" | "solid" | "gradient"

type FaceDetection = {
  x: number
  y: number
  width: number
  height: number
}

type ProcessedImage = {
  url: string
  blob: Blob
  size: number
  dimensions: string
  platformId: string
  format: ExportFormat
}

const DEFAULT_PLATFORMS: Platform[] = [
  { id: "whatsapp", name: "WhatsApp", icon: "💬", size: 500, aspect: "1:1", dimensions: "500×500", quality: 90, bgColor: "#25D366", description: "Profile avatar and status display." },
  { id: "instagram", name: "Instagram", icon: "📸", size: 320, aspect: "1:1", dimensions: "320×320", quality: 92, bgColor: "#E4405F", description: "Clean circular crop preview." },
  { id: "facebook", name: "Facebook", icon: "👍", size: 720, aspect: "1:1", dimensions: "720×720", quality: 90, bgColor: "#1877F2", description: "Sharp and social-ready." },
  { id: "linkedin", name: "LinkedIn", icon: "🔗", size: 400, aspect: "1:1", dimensions: "400×400", quality: 92, bgColor: "#0A66C2", description: "Professional profile picture." },
  { id: "twitter", name: "X / Twitter", icon: "🐦", size: 400, aspect: "1:1", dimensions: "400×400", quality: 90, bgColor: "#0F1419", description: "Square avatar for X." },
  { id: "telegram", name: "Telegram", icon: "✈️", size: 512, aspect: "1:1", dimensions: "512×512", quality: 92, bgColor: "#229ED9", description: "Crisp messenger avatar." },
  { id: "discord", name: "Discord", icon: "🎮", size: 512, aspect: "1:1", dimensions: "512×512", quality: 92, bgColor: "#5865F2", description: "Community profile icon." },
  { id: "tiktok", name: "TikTok", icon: "🎵", size: 450, aspect: "1:1", dimensions: "450×450", quality: 90, bgColor: "#111111", description: "High-contrast avatar." },
  { id: "youtube", name: "YouTube", icon: "▶️", size: 800, aspect: "1:1", dimensions: "800×800", quality: 90, bgColor: "#FF0000", description: "Creator profile photo." },
  { id: "github", name: "GitHub", icon: "🐙", size: 512, aspect: "1:1", dimensions: "512×512", quality: 92, bgColor: "#24292F", description: "Developer profile icon." },
  { id: "pinterest", name: "Pinterest", icon: "📌", size: 600, aspect: "1:1", dimensions: "600×600", quality: 90, bgColor: "#E60023", description: "Strong brand avatar." },
  { id: "reddit", name: "Reddit", icon: "👽", size: 512, aspect: "1:1", dimensions: "512×512", quality: 90, bgColor: "#FF4500", description: "Community-ready profile." },
]

const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models"
const FACE_API_SCRIPT = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"

declare global {
  interface Window {
    faceapi?: any
    __faceApiPromise?: Promise<any | null>
  }
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 Bytes"
  const units = ["Bytes", "KB", "MB", "GB"]
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function mimeForFormat(format: ExportFormat) {
  switch (format) {
    case "png": return "image/png"
    case "jpeg": return "image/jpeg"
    case "webp": return "image/webp"
    case "avif": return "image/avif"
  }
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result)
      else reject(new Error("Unable to read file"))
    }
    reader.onerror = () => reject(new Error("Unable to read file"))
    reader.readAsDataURL(file)
  })
}

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-src="${src}"]`) as HTMLScriptElement | null
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve(); return
      }
      existing.addEventListener("load", () => resolve(), { once: true })
      existing.addEventListener("error", () => reject(new Error("Failed to load script")), { once: true })
      return
    }

    const script = document.createElement("script")
    script.src = src
    script.async = true
    script.dataset.src = src
    script.onload = () => { script.dataset.loaded = "true"; resolve() }
    script.onerror = () => reject(new Error("Failed to load script"))
    document.body.appendChild(script)
  })
}

async function ensureFaceApiLoaded() {
  if (typeof window === "undefined") return null
  if (window.faceapi) return window.faceapi
  if (!window.__faceApiPromise) {
    window.__faceApiPromise = (async () => {
      await loadScriptOnce(FACE_API_SCRIPT)
      if (!window.faceapi) return null
      try {
        await Promise.all([
          window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ])
      } catch {
        // optional
      }
      return window.faceapi
    })()
  }
  return window.__faceApiPromise
}

async function dataUrlToImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = dataUrl
  })
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error("Failed to export image"))
      else resolve(blob)
    }, type, quality)
  })
}

function drawBackground(ctx: CanvasRenderingContext2D, size: number, mode: BackgroundMode, color1: string, color2: string) {
  if (mode === "transparent") {
    ctx.clearRect(0, 0, size, size)
    return
  }
  if (mode === "solid") {
    ctx.fillStyle = color1
    ctx.fillRect(0, 0, size, size)
    return
  }
  const gradient = ctx.createLinearGradient(0, 0, size, size)
  gradient.addColorStop(0, color1)
  gradient.addColorStop(1, color2)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
}

async function detectFace(imageUrl: string): Promise<FaceDetection | null> {
  const faceapi = await ensureFaceApiLoaded()
  if (!faceapi) return null
  const img = await dataUrlToImage(imageUrl)
  try {
    const detections = await faceapi.detectAllFaces(
      img,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.45 })
    )
    if (!detections?.length) return null
    const face = detections[0].box
    return { x: face.x, y: face.y, width: face.width, height: face.height }
  } catch {
    return null
  }
}

function getCropRect({ img, face, cropMode, zoomLevel, bgPadding, panX, panY }: { img: HTMLImageElement; face: FaceDetection | null; cropMode: CropMode; zoomLevel: number; bgPadding: number; panX: number; panY: number }) {
  const minSide = Math.min(img.width, img.height)
  const paddingRatio = bgPadding / 100
  const baseCrop = minSide * (1 - paddingRatio * 1.8)
  let cropSize = baseCrop / zoomLevel

  if (cropMode === "smart" && face) {
    const faceSize = Math.max(face.width, face.height)
    cropSize = Math.max(faceSize * 1.7, baseCrop * 0.7) / zoomLevel
  }

  cropSize = clamp(cropSize, Math.max(40, minSide * 0.2), minSide)

  let centerX = img.width / 2
  let centerY = img.height / 2

  if (cropMode === "smart" && face) {
    centerX = face.x + face.width / 2
    centerY = face.y + face.height / 2
  }

  if (cropMode === "manual") {
    centerX += (panX / 100) * minSide
    centerY += (panY / 100) * minSide
  }

  let sourceX = centerX - cropSize / 2
  let sourceY = centerY - cropSize / 2

  sourceX = clamp(sourceX, 0, Math.max(0, img.width - cropSize))
  sourceY = clamp(sourceY, 0, Math.max(0, img.height - cropSize))

  return { sourceX, sourceY, sourceWidth: cropSize, sourceHeight: cropSize }
}

async function processPlatformImage(imageUrl: string, platform: Platform, settings: { cropMode: CropMode; faceDetection: boolean; bgPadding: number; bgColor: string; bgColor2: string; zoomLevel: number; rotate: number; flipHorizontal: boolean; panX: number; panY: number; exportFormat: ExportFormat }, face: FaceDetection | null): Promise<Blob> {
  const img = await dataUrlToImage(imageUrl)
  const canvas = document.createElement("canvas")
  canvas.width = platform.size
  canvas.height = platform.size
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas not supported")

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  const backgroundMode: BackgroundMode = settings.bgColor === "transparent" ? "transparent" : settings.bgColor2 ? "gradient" : "solid"
  drawBackground(ctx, platform.size, backgroundMode, settings.bgColor, settings.bgColor2)

  const { sourceX, sourceY, sourceWidth, sourceHeight } = getCropRect({
    img,
    face: settings.faceDetection ? face : null,
    cropMode: settings.cropMode,
    zoomLevel: settings.zoomLevel,
    bgPadding: settings.bgPadding,
    panX: settings.panX,
    panY: settings.panY,
  })

  const padding = clamp(settings.bgPadding / 100, 0, 0.45)
  const drawSize = platform.size * (1 - padding * 2)
  const drawX = (platform.size - drawSize) / 2
  const drawY = (platform.size - drawSize) / 2

  ctx.save()
  ctx.translate(platform.size / 2, platform.size / 2)
  ctx.rotate((settings.rotate * Math.PI) / 180)
  ctx.scale(settings.flipHorizontal ? -1 : 1, 1)
  ctx.translate(-platform.size / 2, -platform.size / 2)
  ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, drawX, drawY, drawSize, drawSize)
  ctx.restore()

  const format = settings.exportFormat
  const mime = mimeForFormat(format)
  const quality = format === "png" ? undefined : platform.quality / 100

  try {
    if (format === "avif") return await canvasToBlob(canvas, "image/avif", quality)
    return await canvasToBlob(canvas, mime, quality)
  } catch {
    if (format === "avif") {
      try { return await canvasToBlob(canvas, "image/webp", quality) } catch { return await canvasToBlob(canvas, "image/jpeg", quality) }
    }
    throw new Error("Unable to export image")
  }
}

async function generateZip(images: ProcessedImage[]) {
  const zip = new JSZip()
  images.forEach((image) => {
    zip.file(`${image.platformId}-${image.dimensions.replace("×", "x")}.${image.format === "jpeg" ? "jpg" : image.format}`, image.blob)
  })
  return zip.generateAsync({ type: "blob" })
}

function StatCard({ label, value, tone = "slate" }: { label: string; value: string; tone?: "slate" | "blue" | "emerald" | "violet" }) {
  const toneMap = {
    slate: "text-slate-700 dark:text-slate-300",
    blue: "text-blue-600 dark:text-blue-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    violet: "text-violet-600 dark:text-violet-400",
  }
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className={cn("mt-1 text-xs font-semibold tabular-nums", toneMap[tone])}>{value}</div>
    </div>
  )
}

function PillButton({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition active:scale-95",
        active
          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      )}
    >
      {children}
    </button>
  )
}

export default function ProfilePicOptimizer({ tool }: ToolHeroProps) {
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string>("")
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all")
  const [processing, setProcessing] = useState<boolean>(false)
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState<boolean>(true)
  const [bgPadding, setBgPadding] = useState<number>(12)
  const [bgColor, setBgColor] = useState<string>("#ffffff")
  const [bgColor2, setBgColor2] = useState<string>("#0f172a")
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [rotate, setRotate] = useState<number>(0)
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false)
  const [panX, setPanX] = useState<number>(0)
  const [panY, setPanY] = useState<number>(0)
  const [faceDetected, setFaceDetected] = useState<FaceDetection | null>(null)
  const [activeTab, setActiveTab] = useState<"upload" | "adjust" | "results">("upload")
  const [cropMode, setCropMode] = useState<CropMode>("smart")
  const [exportFormat, setExportFormat] = useState<ExportFormat>("jpeg")
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const [status, setStatus] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const dragDepthRef = useRef(0)

  const filteredPlatforms = useMemo(
    () => (selectedPlatform === "all" ? DEFAULT_PLATFORMS : DEFAULT_PLATFORMS.filter((p) => p.id === selectedPlatform)),
    [selectedPlatform]
  )

  const currentPlatformsLabel = useMemo(() => {
    if (selectedPlatform === "all") return "All platforms"
    return DEFAULT_PLATFORMS.find((p) => p.id === selectedPlatform)?.name || "Selected platform"
  }, [selectedPlatform])

  const hasImage = !!originalUrl

  const currentPreviewStyle = useMemo(() => ({ transform: `translate(-50%, -50%) translate(${panX}px, ${panY}px) scale(${zoomLevel}) rotate(${rotate}deg) scaleX(${flipHorizontal ? -1 : 1})` } as React.CSSProperties), [panX, panY, zoomLevel, rotate, flipHorizontal])

  const handleFileUpload = useCallback(async (uploadedFile: File | null) => {
    if (!uploadedFile) return
    if (uploadedFile.size > 10 * 1024 * 1024) { setError("File size should be less than 10MB."); return }
    if (!uploadedFile.type.startsWith("image/")) { setError("Please upload a valid image file."); return }

    setError("")
    setStatus("")
    setOriginalImage(uploadedFile)
    setFileInfo({ name: uploadedFile.name, size: uploadedFile.size, type: uploadedFile.type || "image/*" })
    setProcessedImages([])
    setActiveTab("adjust")
    setFaceDetected(null)

    const imageUrl = await readFileAsDataURL(uploadedFile)
    setOriginalUrl(imageUrl)
    setStatus("Image loaded successfully.")
    if (faceDetectionEnabled) {
      const face = await detectFace(imageUrl)
      setFaceDetected(face)
    }
  }, [faceDetectionEnabled])

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); dragDepthRef.current = 0; await handleFileUpload(e.dataTransfer.files?.[0] || null) }, [handleFileUpload])
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); dragDepthRef.current += 1 }, [])
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); dragDepthRef.current = Math.max(0, dragDepthRef.current - 1) }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (cropMode !== "manual") return
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY, panX, panY })
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [cropMode, panX, panY])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStart) return
    const rect = previewRef.current?.getBoundingClientRect()
    if (!rect) return
    const dx = (e.clientX - dragStart.x) / Math.max(1, rect.width)
    const dy = (e.clientY - dragStart.y) / Math.max(1, rect.height)
    setPanX(clamp(dragStart.panX + dx * 100, -40, 40))
    setPanY(clamp(dragStart.panY + dy * 100, -40, 40))
  }, [dragStart, isDragging])

  const handlePointerUp = useCallback(() => { setIsDragging(false); setDragStart(null) }, [])

  const resetAdjustments = useCallback(() => {
    setCropMode("smart")
    setBgPadding(12)
    setBgColor("#ffffff")
    setBgColor2("#0f172a")
    setZoomLevel(1)
    setRotate(0)
    setFlipHorizontal(false)
    setPanX(0)
    setPanY(0)
    setFaceDetectionEnabled(true)
    setStatus("Adjustments reset.")
  }, [])

  const clearAll = useCallback(() => {
    setOriginalImage(null)
    setOriginalUrl("")
    setProcessedImages([])
    setSelectedPlatform("all")
    setProcessing(false)
    setFaceDetectionEnabled(true)
    setBgPadding(12)
    setBgColor("#ffffff")
    setBgColor2("#0f172a")
    setZoomLevel(1)
    setRotate(0)
    setFlipHorizontal(false)
    setPanX(0)
    setPanY(0)
    setFaceDetected(null)
    setActiveTab("upload")
    setCropMode("smart")
    setExportFormat("jpeg")
    setStatus("")
    setError("")
    setFileInfo(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [])

  const downloadSingle = useCallback((image: ProcessedImage) => {
    downloadBlob(image.blob, `${image.platformId}-${image.dimensions.replace("×", "x")}.${image.format === "jpeg" ? "jpg" : image.format}`)
  }, [])

  const downloadAll = useCallback(async () => {
    if (!processedImages.length) return
    const zipBlob = await generateZip(processedImages)
    downloadBlob(zipBlob, "profile-pic-pack.zip")
    setStatus("ZIP downloaded.")
  }, [processedImages])

  const shareFirstResult = useCallback(async () => {
    if (!processedImages[0]) return
    const image = processedImages[0]
    const file = new File([image.blob], `${image.platformId}.${image.format === "jpeg" ? "jpg" : image.format}`, { type: image.blob.type || mimeForFormat(image.format) })
    if (navigator.canShare?.({ files: [file] }) && navigator.share) {
      try {
        await navigator.share({ title: "Profile picture export", text: "Generated profile picture.", files: [file] })
        setStatus("Shared successfully.")
      } catch {}
    } else {
      downloadSingle(image)
    }
  }, [downloadSingle, processedImages])

  const processAllPlatforms = useCallback(async () => {
    if (!originalUrl) return
    setProcessing(true)
    setError("")
    setStatus("")
    try {
      const platformsToProcess = selectedPlatform === "all" ? DEFAULT_PLATFORMS : DEFAULT_PLATFORMS.filter((p) => p.id === selectedPlatform)
      const face = faceDetectionEnabled ? faceDetected || (await detectFace(originalUrl)) : null
      if (faceDetectionEnabled) setFaceDetected(face)

      const results: ProcessedImage[] = []
      for (let i = 0; i < platformsToProcess.length; i += 1) {
        const platform = platformsToProcess[i]
        try {
          const blob = await processPlatformImage(originalUrl, platform, { cropMode, faceDetection: faceDetectionEnabled, bgPadding, bgColor, bgColor2, zoomLevel, rotate, flipHorizontal, panX, panY, exportFormat }, face)
          const url = URL.createObjectURL(blob)
          results.push({ url, blob, size: blob.size, dimensions: platform.dimensions, platformId: platform.id, format: exportFormat })
        } catch (err) {
          console.error(`Error processing ${platform.name}:`, err)
        }
      }

      setProcessedImages(results)
      setActiveTab("results")
      setStatus(`Generated ${results.length} profile pictures.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image")
    } finally {
      setProcessing(false)
    }
  }, [originalUrl, selectedPlatform, faceDetectionEnabled, faceDetected, cropMode, bgPadding, bgColor, bgColor2, zoomLevel, rotate, flipHorizontal, panX, panY, exportFormat])

  return (
    <div className="flex justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="w-full max-w-6xl space-y-6">
        <ToolHero tool={tool} />

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/40">
          
          {/* Header Bar */}
          <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/80">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-0.5 text-[11px] font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300">
                <Sparkles className="h-3 w-3" /> Smart Optimizer
              </div>
              <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Profile Picture Studio
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Crop intelligently, detect faces, tune background, and export avatars.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetAdjustments}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-900/50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="grid gap-6 p-6 lg:grid-cols-12">
            
            {/* Main Workspace (Left 8 Cols) */}
            <div className="space-y-5 lg:col-span-8">
              
              {/* Step Tab Segmented Switcher */}
              <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-950/60">
                <button
                  onClick={() => setActiveTab("upload")}
                  className={cn(
                    "flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all",
                    activeTab === "upload"
                      ? "bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-blue-400"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  )}
                >
                  <Upload className="h-3.5 w-3.5" /> 1. Upload Image
                </button>
                <button
                  onClick={() => setActiveTab("adjust")}
                  className={cn(
                    "flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all",
                    activeTab === "adjust"
                      ? "bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-blue-400"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  )}
                >
                  <Wand2 className="h-3.5 w-3.5" /> 2. Adjust & Style
                </button>
                <button
                  onClick={() => setActiveTab("results")}
                  className={cn(
                    "flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all",
                    activeTab === "results"
                      ? "bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-blue-400"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  )}
                >
                  <Eye className="h-3.5 w-3.5" /> 3. View Results
                </button>
              </div>

              {/* TAB 1: UPLOAD */}
              {activeTab === "upload" && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className="group cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition hover:border-blue-500 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-blue-500"
                >
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => void handleFileUpload(e.target.files?.[0] || null)} />
                  {!hasImage ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                        <ImagePlus className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Drop your profile picture here</h3>
                        <p className="mt-1 text-xs text-slate-400">Supports JPG, PNG, WebP, AVIF up to 10MB</p>
                      </div>
                      <button className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700">
                        <Upload className="h-3.5 w-3.5" /> Select File
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center text-left">
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
                        <img src={originalUrl} alt="Original upload" className="h-40 w-full object-contain rounded-xl" />
                      </div>
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <Check className="h-3.5 w-3.5" /> Image Uploaded
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{fileInfo?.name}</div>
                          <div className="text-xs text-slate-400">{formatBytes(fileInfo?.size || 0)} • {fileInfo?.type}</div>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            <Upload className="h-3.5 w-3.5" /> Replace
                          </button>
                          <button onClick={() => setActiveTab("adjust")} className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                            <Zap className="h-3.5 w-3.5" /> Continue to Adjust
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ADJUST */}
              {activeTab === "adjust" && (
                <div className="grid gap-6 xl:grid-cols-12">
                  
                  {/* Live Canvas Frame (7 Cols) */}
                  <div className="space-y-4 xl:col-span-7">
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Live Preview</span>
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">{currentPlatformsLabel}</span>
                      </div>

                      <div
                        ref={previewRef}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        className={cn(
                          "relative mx-auto aspect-square w-full max-w-[380px] overflow-hidden rounded-2xl border border-slate-200 shadow-inner",
                          cropMode === "manual" ? "cursor-grab active:cursor-grabbing" : "cursor-default",
                          bgColor === "transparent" ? "bg-[radial-gradient(circle_at_20%_20%,rgba(148,163,184,0.24)_0,transparent_16%)]" : "bg-slate-100 dark:bg-slate-800"
                        )}
                      >
                        {originalUrl ? (
                          <>
                            <img src={originalUrl} alt="Preview" className="absolute left-1/2 top-1/2 max-w-none select-none" style={currentPreviewStyle} draggable={false} />
                            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-slate-900/10" />
                            <div className="pointer-events-none absolute inset-6 rounded-full border border-dashed border-blue-500/50" />
                            {faceDetected && faceDetectionEnabled && cropMode === "smart" && (
                              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                                Face Detected
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-slate-400">Upload an image to preview</div>
                        )}
                      </div>

                      <div className="mt-4 grid grid-cols-4 gap-2">
                        <StatCard label="Zoom" value={`${zoomLevel.toFixed(2)}x`} tone="blue" />
                        <StatCard label="Rotate" value={`${rotate}°`} tone="violet" />
                        <StatCard label="Pan" value={`${panX.toFixed(0)}, ${panY.toFixed(0)}`} tone="emerald" />
                        <StatCard label="Padding" value={`${bgPadding}%`} tone="slate" />
                      </div>
                    </div>
                  </div>

                  {/* Adjustment Controls Panel (5 Cols) */}
                  <div className="space-y-4 xl:col-span-5">
                    <div className="rounded-2xl border border-slate-200/80 bg-white/50 p-4 space-y-4 dark:border-slate-800 dark:bg-slate-900/30">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Crop & Alignment</h3>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Crop Mode</label>
                        <div className="flex gap-1.5">
                          <PillButton active={cropMode === "smart"} onClick={() => setCropMode("smart")}><ScanFace className="h-3 w-3" /> Smart</PillButton>
                          <PillButton active={cropMode === "center"} onClick={() => setCropMode("center")}><Eye className="h-3 w-3" /> Center</PillButton>
                          <PillButton active={cropMode === "manual"} onClick={() => setCropMode("manual")}><GripVertical className="h-3 w-3" /> Manual</PillButton>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <span>Zoom Level</span>
                          <span>{zoomLevel.toFixed(2)}x</span>
                        </div>
                        <input type="range" min="0.7" max="2.2" step="0.01" value={zoomLevel} onChange={(e) => setZoomLevel(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <span>Padding</span>
                          <span>{bgPadding}%</span>
                        </div>
                        <input type="range" min="0" max="30" value={bgPadding} onChange={(e) => setBgPadding(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Background</label>
                          <div className="mt-1 flex items-center gap-2">
                            <input type="color" value={bgColor === "transparent" ? "#ffffff" : bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 w-10 cursor-pointer rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-800" />
                            <button onClick={() => setBgColor("transparent")} className="text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400">Clear</button>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Format</label>
                          <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value as ExportFormat)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-1.5 text-xs font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            <option value="jpeg">JPEG</option>
                            <option value="png">PNG</option>
                            <option value="webp">WebP</option>
                            <option value="avif">AVIF</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={() => void processAllPlatforms()}
                        disabled={!originalUrl || processing}
                        className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 disabled:opacity-50"
                      >
                        {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                        {processing ? "Generating..." : `Generate ${filteredPlatforms.length} Avatars`}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RESULTS */}
              {activeTab === "results" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <div>
                      <h2 className="text-sm font-bold">Exported Avatars</h2>
                      <p className="text-xs text-slate-400">{processedImages.length} platform sizes ready</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => void shareFirstResult()} disabled={!processedImages.length} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        <Share2 className="h-3.5 w-3.5" /> Share
                      </button>
                      <button onClick={() => void downloadAll()} disabled={!processedImages.length} className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                        <ArrowDownToLine className="h-3.5 w-3.5" /> Download All (ZIP)
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPlatforms.map((platform) => {
                      const image = processedImages.find((img) => img.platformId === platform.id)
                      return (
                        <div key={platform.id} className="rounded-2xl border border-slate-200/80 bg-white p-3.5 space-y-3 dark:border-slate-800 dark:bg-slate-900/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{platform.icon}</span>
                              <span className="text-xs font-bold">{platform.name}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400">{platform.dimensions}</span>
                          </div>

                          <div className="flex items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 aspect-square dark:border-slate-800 dark:bg-slate-950">
                            {image ? (
                              <img src={image.url} alt={platform.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex flex-col items-center gap-1.5 text-xs text-slate-400">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> Generating...
                              </div>
                            )}
                          </div>

                          {image && (
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[11px] font-mono text-slate-400">{formatBytes(image.size)}</span>
                              <button onClick={() => downloadSingle(image)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                <Download className="h-3 w-3" /> Save
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Right Sidebar: Presets (4 Cols) */}
            <div className="space-y-4 lg:col-span-4">
              
              {/* Target Platform Selector */}
              <div className="rounded-2xl border border-slate-200/80 bg-white/50 p-4 space-y-3 dark:border-slate-800 dark:bg-slate-900/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform Filter</span>
                  <span className="text-[10px] font-semibold rounded-md bg-blue-50 px-2 py-0.5 text-blue-600 dark:bg-blue-950 dark:text-blue-400">{DEFAULT_PLATFORMS.length} Targets</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <PillButton active={selectedPlatform === "all"} onClick={() => setSelectedPlatform("all")}>All</PillButton>
                  {DEFAULT_PLATFORMS.map((platform) => (
                    <PillButton key={platform.id} active={selectedPlatform === platform.id} onClick={() => setSelectedPlatform(platform.id)}>
                      <span>{platform.icon}</span> {platform.name}
                    </PillButton>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  )
}