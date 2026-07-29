"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import JSZip from "jszip"
import {
  Aperture,
  ArrowDownToLine,
  ArrowLeftRight,
  Camera,
  Check,
  Download,
  Film,
  FlipHorizontal,
  Image as ImageIcon,
  ImagePlus,
  Loader2,
  RotateCcw,
  Sparkles,
  Upload,
  Wand2,
  Zap,
} from "lucide-react"
import ToolHero from "@/components/tool-page-helpers/ToolHero"
import { ToolHeroProps } from "@/types/tool"

type ThumbnailFormat = "png" | "jpeg" | "webp"
type ActiveTab = "upload" | "adjust" | "results"
type CropMode = "contain" | "cover"
type BackgroundMode = "transparent" | "solid"

type VideoInfo = {
  duration: number
  width: number
  height: number
  size: number
  name: string
}

type Thumbnail = {
  id: string
  timestamp: number
  timeFormatted: string
  url: string
  blob: Blob
  width: number
  height: number
  score: number
}

type Preset = {
  id: string
  name: string
  label: string
  dimensions: [number, number]
  thumbnailCount: number
  description: string
}

type GenerationOptions = {
  width: number
  height: number
  format: ThumbnailFormat
  quality: number
  cropMode: CropMode
  backgroundMode: BackgroundMode
  bgColor: string
  brightness: number
  contrast: number
  saturation: number
  rotate: number
  flipHorizontal: boolean
  keepAspectRatio: boolean
}

const PRESETS: Preset[] = [
  {
    id: "youtube",
    name: "YouTube",
    label: "16:9",
    dimensions: [1280, 720],
    thumbnailCount: 12,
    description: "Best for video cover thumbnails",
  },
  {
    id: "shorts",
    name: "Shorts / Reels",
    label: "9:16",
    dimensions: [1080, 1920],
    thumbnailCount: 10,
    description: "Vertical social video formats",
  },
  {
    id: "square",
    name: "Square",
    label: "1:1",
    dimensions: [1080, 1080],
    thumbnailCount: 10,
    description: "General social media use",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    label: "1.91:1",
    dimensions: [1200, 627],
    thumbnailCount: 8,
    description: "Professional landscape format",
  },
  {
    id: "story",
    name: "Story",
    label: "9:16",
    dimensions: [1080, 1920],
    thumbnailCount: 6,
    description: "Stories and vertical posters",
  },
]

const FORMAT_OPTIONS: { value: ThumbnailFormat; label: string; description: string }[] = [
  { value: "png", label: "PNG", description: "Best quality, larger files" },
  { value: "jpeg", label: "JPEG", description: "Smaller files, good quality" },
  { value: "webp", label: "WebP", description: "Modern format, balanced" },
]

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 Bytes"
  const units = ["Bytes", "KB", "MB", "GB"]
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 2)} ${units[index]}`
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function videoLoaded(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve, reject) => {
    const onLoaded = () => {
      cleanup()
      resolve()
    }
    const onError = () => {
      cleanup()
      reject(new Error("Failed to load video"))
    }
    const cleanup = () => {
      video.removeEventListener("loadedmetadata", onLoaded)
      video.removeEventListener("error", onError)
    }
    video.addEventListener("loadedmetadata", onLoaded, { once: true })
    video.addEventListener("error", onError, { once: true })
  })
}

function seeked(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    video.addEventListener("seeked", () => resolve(), { once: true })
  })
}

function drawFrameToCanvas(
  source: CanvasImageSource,
  canvas: HTMLCanvasElement,
  options: GenerationOptions
) {
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas context is unavailable")

  const width = Math.max(1, Math.floor(options.width))
  const height = Math.max(1, Math.floor(options.height))
  canvas.width = width
  canvas.height = height

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = options.quality > 85 ? "high" : options.quality > 60 ? "medium" : "low"
  ctx.clearRect(0, 0, width, height)

  if (options.backgroundMode === "solid") {
    ctx.fillStyle = options.bgColor
    ctx.fillRect(0, 0, width, height)
  }

  const filters: string[] = []
  if (options.brightness !== 100) filters.push(`brightness(${options.brightness}%)`)
  if (options.contrast !== 100) filters.push(`contrast(${options.contrast}%)`)
  if (options.saturation !== 100) filters.push(`saturate(${options.saturation}%)`)
  ctx.filter = filters.length ? filters.join(" ") : "none"

  const sourceWidth = (source as HTMLVideoElement).videoWidth || (source as HTMLImageElement).naturalWidth || canvas.width
  const sourceHeight = (source as HTMLVideoElement).videoHeight || (source as HTMLImageElement).naturalHeight || canvas.height
  const srcAspect = sourceWidth / Math.max(1, sourceHeight)
  const dstAspect = width / Math.max(1, height)

  let sx = 0
  let sy = 0
  let sw = sourceWidth
  let sh = sourceHeight

  if (options.keepAspectRatio && options.cropMode === "cover") {
    if (srcAspect > dstAspect) {
      sw = Math.round(sourceHeight * dstAspect)
      sx = Math.round((sourceWidth - sw) / 2)
    } else {
      sh = Math.round(sourceWidth / dstAspect)
      sy = Math.round((sourceHeight - sh) / 2)
    }
  }

  const dw = width
  const dh = height

  ctx.save()
  ctx.translate(width / 2, height / 2)
  if (options.flipHorizontal) ctx.scale(-1, 1)
  if (options.rotate) ctx.rotate((options.rotate * Math.PI) / 180)

  if (options.cropMode === "contain" && options.keepAspectRatio) {
    const fitScale = Math.min(width / sourceWidth, height / sourceHeight)
    const drawW = sourceWidth * fitScale
    const drawH = sourceHeight * fitScale
    const x = -drawW / 2
    const y = -drawH / 2
    if (options.backgroundMode === "transparent") {
      ctx.clearRect(-width / 2, -height / 2, width, height)
    }
    ctx.drawImage(source, x, y, drawW, drawH)
  } else {
    ctx.drawImage(source, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh)
  }

  ctx.restore()
  ctx.filter = "none"
}

function scoreCanvasSharpness(canvas: HTMLCanvasElement): number {
  const sample = document.createElement("canvas")
  sample.width = 64
  sample.height = 64
  const sctx = sample.getContext("2d")
  if (!sctx) return 0
  sctx.drawImage(canvas, 0, 0, 64, 64)
  const data = sctx.getImageData(0, 0, 64, 64).data
  let score = 0
  for (let y = 0; y < 64; y += 1) {
    for (let x = 0; x < 64; x += 1) {
      const idx = (y * 64 + x) * 4
      const lum = (data[idx] + data[idx + 1] + data[idx + 2]) / 3
      if (x < 63) {
        const right = (data[idx + 4] + data[idx + 5] + data[idx + 6]) / 3
        score += Math.abs(lum - right)
      }
      if (y < 63) {
        const downIdx = ((y + 1) * 64 + x) * 4
        const down = (data[downIdx] + data[downIdx + 1] + data[downIdx + 2]) / 3
        score += Math.abs(lum - down)
      }
    }
  }
  return Math.round(score)
}

async function createZipFromThumbnails(thumbnails: Thumbnail[]) {
  const zip = new JSZip()
  thumbnails.forEach((thumb, index) => {
    const safeTime = thumb.timeFormatted.replace(/:/g, "-")
    zip.file(`thumbnail_${index + 1}_${safeTime}.${thumb.blob.type.includes("png") ? "png" : thumb.blob.type.includes("webp") ? "webp" : "jpg"}`, thumb.blob)
  })
  return zip.generateAsync({ type: "blob" })
}

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
    <div className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">{value}</div>
  </div>
)

export default function VideoThumbnailGenerator({ tool }: ToolHeroProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([])
  const [thumbnailCount, setThumbnailCount] = useState<number>(10)
  const [selectedFormat, setSelectedFormat] = useState<ThumbnailFormat>("png")
  const [customTimestamp, setCustomTimestamp] = useState<number>(0)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<ActiveTab>("upload")
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [quality, setQuality] = useState<number>(90)
  const [width, setWidth] = useState<number>(1280)
  const [height, setHeight] = useState<number>(720)
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true)
  const [presetId, setPresetId] = useState<string>("youtube")
  const [cropMode, setCropMode] = useState<CropMode>("cover")
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>("transparent")
  const [bgColor, setBgColor] = useState<string>("#ffffff")
  const [brightness, setBrightness] = useState<number>(100)
  const [contrast, setContrast] = useState<number>(100)
  const [saturation, setSaturation] = useState<number>(100)
  const [rotate, setRotate] = useState<number>(0)
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false)
  const [bestFrameOnly, setBestFrameOnly] = useState<boolean>(false)
  const [videoLoadedState, setVideoLoadedState] = useState<boolean>(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoUrlRef = useRef<string>("")
  const thumbnailUrlsRef = useRef<string[]>([])

  const currentPreset = useMemo(
    () => PRESETS.find((preset) => preset.id === presetId) || PRESETS[0],
    [presetId]
  )

  const selectedFormatMime = useMemo(() => {
    if (selectedFormat === "jpeg") return "image/jpeg"
    if (selectedFormat === "webp") return "image/webp"
    return "image/png"
  }, [selectedFormat])

  const filteredThumbnails = useMemo(() => {
    if (!bestFrameOnly) return thumbnails
    const best = thumbnails.reduce<Thumbnail | null>((acc, item) => {
      if (!acc) return item
      return item.score > acc.score ? item : acc
    }, null)
    return best ? [best] : []
  }, [bestFrameOnly, thumbnails])

  useEffect(() => {
    return () => {
      if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current)
      thumbnailUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  useEffect(() => {
    if (!keepAspectRatio || !videoInfo) return
    const aspect = videoInfo.width / videoInfo.height
    setHeight(Math.round(width / aspect))
  }, [keepAspectRatio, videoInfo, width])

  const syncPreset = useCallback((preset: Preset) => {
    setPresetId(preset.id)
    setWidth(preset.dimensions[0])
    setHeight(preset.dimensions[1])
    setThumbnailCount(preset.thumbnailCount)
  }, [])

  const handleFileUpload = useCallback(async (uploadedFile: File | undefined) => {
    if (!uploadedFile) return

    if (!uploadedFile.type.startsWith("video/")) {
      alert("Please upload a valid video file")
      return
    }

    if (uploadedFile.size > 250 * 1024 * 1024) {
      alert("File size should be less than 250MB")
      return
    }

    if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current)
    thumbnailUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    thumbnailUrlsRef.current = []

    setVideoFile(uploadedFile)
    setVideoInfo(null)
    setThumbnails([])
    setProgress(0)
    setVideoLoadedState(false)
    setActiveTab("adjust")

    const url = URL.createObjectURL(uploadedFile)
    videoUrlRef.current = url
    setVideoUrl(url)

    const video = document.createElement("video")
    video.preload = "metadata"
    video.src = url
    await videoLoaded(video)
    setVideoInfo({
      duration: video.duration,
      width: video.videoWidth,
      height: video.videoHeight,
      size: uploadedFile.size,
      name: uploadedFile.name,
    })
    setVideoLoadedState(true)
    setWidth(video.videoWidth || currentPreset.dimensions[0])
    setHeight(video.videoHeight || currentPreset.dimensions[1])
    setCustomTimestamp(0)
  }, [currentPreset.dimensions])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    if (e.type === "dragleave") setDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    void handleFileUpload(e.dataTransfer.files[0])
  }, [handleFileUpload])

  const captureFrame = useCallback(async (timestamp: number) => {
    if (!videoUrl || !videoInfo) throw new Error("Video not loaded")
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) throw new Error("Capture tools unavailable")

    video.src = videoUrl
    await videoLoaded(video)
    video.currentTime = Math.max(0, Math.min(timestamp, Math.max(0.01, videoInfo.duration - 0.01)))
    await seeked(video)

    drawFrameToCanvas(video, canvas, {
      width,
      height,
      format: selectedFormat,
      quality,
      cropMode,
      backgroundMode,
      bgColor,
      brightness,
      contrast,
      saturation,
      rotate,
      flipHorizontal,
      keepAspectRatio,
    })

    const score = scoreCanvasSharpness(canvas)
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((nextBlob) => {
        if (!nextBlob) reject(new Error("Failed to export thumbnail"))
        else resolve(nextBlob)
      }, selectedFormatMime, quality / 100)
    })

    const url = URL.createObjectURL(blob)
    thumbnailUrlsRef.current.push(url)
    return { url, blob, score }
  }, [bgColor, backgroundMode, brightness, contrast, cropMode, flipHorizontal, height, quality, rotate, saturation, selectedFormat, selectedFormatMime, videoInfo, videoUrl, width, keepAspectRatio])

  const generateThumbnails = useCallback(async () => {
    if (!videoFile || !videoInfo || !videoLoadedState) return
    setIsGenerating(true)
    setProgress(0)
    setThumbnails([])

    try {
      const video = videoRef.current
      if (!video) throw new Error("Video reference missing")
      video.src = videoUrl
      await videoLoaded(video)

      const timestamps: number[] = []
      const interval = videoInfo.duration / (thumbnailCount + 1)
      for (let i = 1; i <= thumbnailCount; i += 1) timestamps.push(interval * i)

      const generated: Thumbnail[] = []
      for (let i = 0; i < timestamps.length; i += 1) {
        const timestamp = timestamps[i]
        const { url, blob, score } = await captureFrame(timestamp)
        generated.push({
          id: `thumb_${timestamp.toFixed(2)}_${i}`,
          timestamp,
          timeFormatted: formatTime(timestamp),
          url,
          blob,
          width,
          height,
          score,
        })
        setProgress(Math.round(((i + 1) / timestamps.length) * 100))
      }

      generated.sort((a, b) => a.timestamp - b.timestamp)
      setThumbnails(generated)
      setActiveTab("results")
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : "Failed to generate thumbnails")
    } finally {
      setIsGenerating(false)
    }
  }, [captureFrame, thumbnailCount, videoFile, videoInfo, videoLoadedState, videoUrl, width, height])

  const captureCustomFrame = useCallback(async () => {
    if (!videoFile || !videoInfo || !videoLoadedState) return
    setIsGenerating(true)
    try {
      const { url, blob, score } = await captureFrame(customTimestamp)
      const custom: Thumbnail = {
        id: `custom_${customTimestamp.toFixed(2)}`,
        timestamp: customTimestamp,
        timeFormatted: formatTime(customTimestamp),
        url,
        blob,
        width,
        height,
        score,
      }
      setThumbnails((prev) => [...prev, custom].sort((a, b) => a.timestamp - b.timestamp))
      setActiveTab("results")
    } finally {
      setIsGenerating(false)
    }
  }, [captureFrame, customTimestamp, height, videoFile, videoInfo, videoLoadedState, width])

  const downloadThumbnail = useCallback((thumbnail: Thumbnail) => {
    const safeTime = thumbnail.timeFormatted.replace(/:/g, "-")
    const ext = selectedFormat === "jpeg" ? "jpg" : selectedFormat
    downloadBlob(thumbnail.blob, `thumbnail_${safeTime}.${ext}`)
  }, [selectedFormat])

  const downloadAllThumbnails = useCallback(async () => {
    if (thumbnails.length === 0) return
    const zipBlob = await createZipFromThumbnails(thumbnails)
    downloadBlob(zipBlob, `thumbnails_${Date.now()}.zip`)
  }, [thumbnails])

  const copyCurrentThumbnailUrl = useCallback(async (thumbnail: Thumbnail) => {
    await navigator.clipboard.writeText(thumbnail.url)
  }, [])

  const resetAll = useCallback(() => {
    if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current)
    thumbnailUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    thumbnailUrlsRef.current = []
    setVideoFile(null)
    setVideoUrl("")
    setVideoInfo(null)
    setThumbnails([])
    setProgress(0)
    setCustomTimestamp(0)
    setThumbnailCount(10)
    setWidth(1280)
    setHeight(720)
    setKeepAspectRatio(true)
    setSelectedFormat("png")
    setQuality(90)
    setPresetId("youtube")
    setCropMode("cover")
    setBackgroundMode("transparent")
    setBgColor("#ffffff")
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setRotate(0)
    setFlipHorizontal(false)
    setBestFrameOnly(false)
    setVideoLoadedState(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
    setActiveTab("upload")
  }, [])

  const bestThumbnail = useMemo(() => {
    if (thumbnails.length === 0) return null
    return thumbnails.reduce((best, next) => (next.score > best.score ? next : best), thumbnails[0])
  }, [thumbnails])

  return (
    <div className="flex justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="w-full max-w-6xl space-y-6">
        <ToolHero tool={tool} />

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/40">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-4 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Film className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Thumbnail Extraction Studio
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Extract, enhance, and download video frames</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* Main Content Workspace */}
          <div className="p-6 space-y-6">
            
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
                <Upload className="h-3.5 w-3.5" /> 1. Upload Video
              </button>
              <button
                onClick={() => setActiveTab("adjust")}
                disabled={!videoFile}
                className={cn(
                  "flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all",
                  activeTab === "adjust"
                    ? "bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-blue-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
                  !videoFile && "cursor-not-allowed opacity-50"
                )}
              >
                <Wand2 className="h-3.5 w-3.5" /> 2. Controls & Tuning
              </button>
              <button
                onClick={() => setActiveTab("results")}
                disabled={thumbnails.length === 0}
                className={cn(
                  "flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all",
                  activeTab === "results"
                    ? "bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-blue-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
                  thumbnails.length === 0 && "cursor-not-allowed opacity-50"
                )}
              >
                <ImageIcon className="h-3.5 w-3.5" /> 3. Extracted Thumbnails ({thumbnails.length})
              </button>
            </div>

            {/* TAB 1: UPLOAD & PRESETS */}
            {activeTab === "upload" && (
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "group cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition hover:border-blue-500 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-blue-500",
                      dragActive && "border-blue-500 bg-blue-50/50"
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => void handleFileUpload(e.target.files?.[0])}
                    />

                    {!videoFile ? (
                      <div className="flex flex-col items-center justify-center gap-3 py-8">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                          <ImagePlus className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Drop your video file here</h3>
                          <p className="mt-1 text-xs text-slate-400">Supports MP4, WebM, MOV, AVI up to 250MB</p>
                        </div>
                        <button className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700">
                          <Upload className="h-3.5 w-3.5" /> Select Video File
                        </button>
                      </div>
                    ) : (
                      <div className="grid gap-6 sm:grid-cols-[200px_1fr] sm:items-center text-left">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black p-1 dark:border-slate-800">
                          <video src={videoUrl} controls className="h-36 w-full object-contain rounded-xl" />
                        </div>
                        <div className="space-y-3">
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            <Check className="h-3.5 w-3.5" /> Video Ready
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{videoFile.name}</div>
                            <div className="text-xs text-slate-400">{videoInfo ? formatFileSize(videoInfo.size) : "—"}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Stat label="Duration" value={videoInfo ? formatTime(videoInfo.duration) : "—"} />
                            <Stat label="Resolution" value={videoInfo ? `${videoInfo.width}×${videoInfo.height}` : "—"} />
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              <Upload className="h-3.5 w-3.5" /> Replace Video
                            </button>
                            <button onClick={() => setActiveTab("adjust")} className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                              <Zap className="h-3.5 w-3.5" /> Adjust & Extract
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Target Presets Side Box */}
                <div className="lg:col-span-4 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Presets</span>
                  <div className="grid gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => syncPreset(preset)}
                        className={cn(
                          "flex items-center justify-between rounded-2xl border p-3 text-left transition",
                          presetId === preset.id
                            ? "border-blue-500 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20 shadow-xs"
                            : "border-slate-200/70 bg-white/60 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40"
                        )}
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{preset.name}</div>
                          <div className="text-[10px] text-slate-400">{preset.description}</div>
                        </div>
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CONTROLS & TUNING */}
            {activeTab === "adjust" && (
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-12">
                  
                  {/* Left Column Controls */}
                  <div className="lg:col-span-6 space-y-4 rounded-2xl border border-slate-200/80 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Dimension & Export Settings</h3>
                    
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Width (px)</label>
                        <input type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value || "0") || 100)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Height (px)</label>
                        <input type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value || "0") || 100)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Format</label>
                        <select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value as ThumbnailFormat)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          {FORMAT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Quality ({quality}%)</label>
                        <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="mt-2 w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Thumbnail Count</label>
                        <input type="range" min={5} max={24} value={thumbnailCount} onChange={(e) => setThumbnailCount(parseInt(e.target.value))} className="mt-2 w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
                        <div className="mt-1 flex justify-between text-[10px] text-slate-400"><span>5</span><span>{thumbnailCount} frames</span><span>24</span></div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Crop Mode</label>
                        <select value={cropMode} onChange={(e) => setCropMode(e.target.value as CropMode)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          <option value="cover">Cover (Fill Frame)</option>
                          <option value="contain">Contain (Fit Aspect Ratio)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column Tuning */}
                  <div className="lg:col-span-6 space-y-4 rounded-2xl border border-slate-200/80 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Image Enhancements</h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <span>Brightness</span>
                          <span>{brightness}%</span>
                        </div>
                        <input type="range" min={50} max={150} value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} className="mt-2 w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <span>Contrast</span>
                          <span>{contrast}%</span>
                        </div>
                        <input type="range" min={50} max={150} value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} className="mt-2 w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <span>Saturation</span>
                          <span>{saturation}%</span>
                        </div>
                        <input type="range" min={50} max={150} value={saturation} onChange={(e) => setSaturation(parseInt(e.target.value))} className="mt-2 w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <span>Rotate</span>
                          <span>{rotate}°</span>
                        </div>
                        <input type="range" min={-180} max={180} value={rotate} onChange={(e) => setRotate(parseInt(e.target.value))} className="mt-2 w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setFlipHorizontal((v) => !v)}
                        className={cn(
                          "flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition",
                          flipHorizontal ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        )}
                      >
                        <FlipHorizontal className="h-3.5 w-3.5" /> Flip Horizontal
                      </button>
                      <button
                        onClick={() => setBestFrameOnly((v) => !v)}
                        className={cn(
                          "flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition",
                          bestFrameOnly ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        )}
                      >
                        <Aperture className="h-3.5 w-3.5" /> Best Frame Only
                      </button>
                    </div>
                  </div>
                </div>

                {/* Custom Timestamp Slider & Generator Button */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3 dark:border-slate-800 dark:bg-slate-900/30">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>Custom Frame Timestamp Seek</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">{formatTime(customTimestamp)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={videoInfo?.duration || 0}
                    step={0.1}
                    value={customTimestamp}
                    onChange={(e) => setCustomTimestamp(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => void captureCustomFrame()}
                      disabled={!videoFile || isGenerating}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <Camera className="h-3.5 w-3.5" /> Capture Single Frame
                    </button>

                    <button
                      onClick={() => void generateThumbnails()}
                      disabled={!videoFile || isGenerating}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                      {isGenerating ? `Generating (${progress}%)` : `Extract ${thumbnailCount} Thumbnails`}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: RESULTS */}
            {activeTab === "results" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <div>
                    <h2 className="text-sm font-bold">Extracted Video Thumbnails</h2>
                    <p className="text-xs text-slate-400">
                      {bestFrameOnly ? "Showing highest sharpness frame" : `Generated ${filteredThumbnails.length} frames`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => void downloadAllThumbnails()}
                      disabled={thumbnails.length === 0}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Download className="h-3.5 w-3.5" /> Download All (ZIP)
                    </button>
                  </div>
                </div>

                {isGenerating && (
                  <div className="flex items-center justify-center gap-2 py-8 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <Loader2 className="h-5 w-5 animate-spin" /> Extracting video frames ({progress}%)...
                  </div>
                )}

                {filteredThumbnails.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredThumbnails.map((thumbnail, index) => {
                      const isBest = bestThumbnail?.id === thumbnail.id
                      return (
                        <div
                          key={thumbnail.id}
                          className={cn(
                            "rounded-2xl border bg-white p-3 space-y-3 dark:bg-slate-900/50",
                            isBest ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-200/80 dark:border-slate-800"
                          )}
                        >
                          <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-black aspect-video dark:border-slate-800">
                            <img src={thumbnail.url} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                            <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 font-mono text-[10px] font-bold text-white backdrop-blur-xs">
                              {thumbnail.timeFormatted}
                            </span>
                            {isBest && (
                              <span className="absolute right-2 top-2 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                Best Frame
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>{thumbnail.width}×{thumbnail.height}</span>
                            <span>Score: {thumbnail.score}</span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => downloadThumbnail(thumbnail)}
                              className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-blue-600 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
                            >
                              <ArrowDownToLine className="h-3.5 w-3.5" /> Save
                            </button>
                            <button
                              onClick={() => void copyCurrentThumbnailUrl(thumbnail)}
                              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            >
                              Copy URL
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  !isGenerating && (
                    <div className="py-12 text-center text-xs text-slate-400">
                      No thumbnails extracted yet. Upload a video and click Generate.
                    </div>
                  )
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      <video ref={videoRef} className="hidden" preload="auto" playsInline muted />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}