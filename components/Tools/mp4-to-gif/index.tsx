"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"
import {
  Film,
  Upload,
  RotateCcw,
  Download,
  Loader2,
  AlertCircle,
  Play,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import ToolHero from "@/components/tool-page-helpers/ToolHero"
import { ToolHeroProps } from "@/types/tool"

const BASE_URL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd"

type Stats = {
  name: string
  size: number
  duration: number
  width: number
  height: number
  type: string
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 2)} ${units[i]}`
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const s = Math.floor(seconds)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, "0")}`
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export default function MP4ToGIFConverter({ tool }: ToolHeroProps) {
  const ffmpegRef = useRef(new FFmpeg())
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  const [file, setFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState("")
  const [gifUrl, setGifUrl] = useState("")
  const [gifBlob, setGifBlob] = useState<Blob | null>(null)

  const [stats, setStats] = useState<Stats | null>(null)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [fps, setFps] = useState(12)
  const [width, setWidth] = useState(480)
  const [keepAspectRatio, setKeepAspectRatio] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
      if (gifUrl) URL.revokeObjectURL(gifUrl)
    }
  }, [gifUrl, videoUrl])

  const loadFFmpeg = useCallback(async () => {
    if (loaded || loading) return

    setLoading(true)
    setError(null)
    setStatus("Loading converter engine...")

    try {
      const ffmpeg = ffmpegRef.current

      ffmpeg.on("progress", ({ progress }) => {
        setProgress(Math.round(clamp(progress * 100, 0, 100)))
      })

      await ffmpeg.load({
        coreURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, "application/wasm"),
      })

      setLoaded(true)
      setStatus("Engine ready")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load converter engine")
    } finally {
      setLoading(false)
    }
  }, [loaded, loading])

  // Automatically load FFmpeg on mount
  useEffect(() => {
    loadFFmpeg()
  }, [loadFFmpeg])

  const onUpload = useCallback(async (picked?: File | null) => {
    if (!picked) return
    if (!picked.type.startsWith("video/")) {
      setError("Please upload a valid video file.")
      return
    }

    setError(null)
    setGifUrl("")
    setGifBlob(null)
    setProgress(0)
    setStatus("Processing video details...")

    const nextUrl = URL.createObjectURL(picked)
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setVideoUrl(nextUrl)
    setFile(picked)

    const video = document.createElement("video")
    video.preload = "metadata"
    video.src = nextUrl

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve()
      video.onerror = () => reject(new Error("Unable to read video metadata"))
    })

    setStats({
      name: picked.name,
      size: picked.size,
      duration: video.duration || 0,
      width: video.videoWidth || 0,
      height: video.videoHeight || 0,
      type: picked.type || "video/mp4",
    })

    setStartTime(0)
    setEndTime(Math.floor(video.duration || 0))
    setWidth(Math.min(480, video.videoWidth || 480))
    setKeepAspectRatio(true)
    setStatus("Video ready for conversion")
  }, [videoUrl])

  const convertToGif = useCallback(async () => {
    if (!file || !stats) {
      setError("Upload a video first.")
      return
    }
    if (!loaded) {
      setError("Converter engine is initializing. Please wait.")
      return
    }

    const ffmpeg = ffmpegRef.current
    const safeStart = clamp(startTime, 0, Math.max(0, stats.duration))
    const safeEnd = clamp(endTime || stats.duration, safeStart + 0.1, stats.duration || safeStart + 0.1)
    const clipDuration = Math.max(0.1, safeEnd - safeStart)
    const outWidth = Math.max(64, Math.round(width))
    const fpsValue = clamp(Math.round(fps), 1, 60)

    setProcessing(true)
    setProgress(0)
    setError(null)
    setGifUrl("")
    setGifBlob(null)
    setStatus("Preparing video clip...")

    try {
      try { await ffmpeg.deleteFile("input.mp4") } catch {}
      try { await ffmpeg.deleteFile("palette.png") } catch {}
      try { await ffmpeg.deleteFile("output.gif") } catch {}

      await ffmpeg.writeFile("input.mp4", await fetchFile(file))

      const scaleExpr = keepAspectRatio
        ? `scale=${outWidth}:-1:flags=lanczos`
        : `scale=${outWidth}:${Math.max(64, Math.round((stats.height || 1) * (outWidth / Math.max(1, stats.width || 1))))}:flags=lanczos`

      setStatus("Optimizing color palette...")
      await ffmpeg.exec([
        "-ss", String(safeStart),
        "-t", String(clipDuration),
        "-i", "input.mp4",
        "-vf", `fps=${fpsValue},${scaleExpr},palettegen=stats_mode=diff`,
        "palette.png",
      ])

      setStatus("Rendering GIF...")
      await ffmpeg.exec([
        "-ss", String(safeStart),
        "-t", String(clipDuration),
        "-i", "input.mp4",
        "-i", "palette.png",
        "-lavfi",
        `fps=${fpsValue},${scaleExpr}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5`,
        "-loop", "0",
        "output.gif",
      ])

      const data = await ffmpeg.readFile("output.gif")
      const blob = new Blob([data.buffer], { type: "image/gif" })
      const url = URL.createObjectURL(blob)

      if (gifUrl) URL.revokeObjectURL(gifUrl)

      setGifBlob(blob)
      setGifUrl(url)
      setProgress(100)
      setStatus("Conversion complete!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "GIF conversion failed")
    } finally {
      setProcessing(false)
    }
  }, [endTime, file, fps, gifUrl, keepAspectRatio, loaded, startTime, stats, width])

  const downloadGif = useCallback(() => {
    if (!gifUrl) return
    const a = document.createElement("a")
    a.href = gifUrl
    a.download = `converted-${Date.now()}.gif`
    a.click()
  }, [gifUrl])

  const resetAll = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    if (gifUrl) URL.revokeObjectURL(gifUrl)
    setFile(null)
    setVideoUrl("")
    setGifUrl("")
    setGifBlob(null)
    setStats(null)
    setStartTime(0)
    setEndTime(0)
    setFps(12)
    setWidth(480)
    setKeepAspectRatio(true)
    setProcessing(false)
    setProgress(0)
    setStatus("")
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [gifUrl, videoUrl])

  const estimate = useMemo(() => {
    if (!stats) return "—"
    const secs = Math.max(0.1, (endTime || stats.duration) - startTime)
    const frames = Math.round(secs * fps)
    return `${frames} frames • ${formatTime(secs)} duration`
  }, [endTime, fps, startTime, stats])

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
                  MP4 to GIF Converter
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Client-side high-quality GIF creation</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-[11px] font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300">
                <Sparkles className="h-3 w-3" /> {loaded ? "Engine Ready" : "Initializing..."}
              </span>
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
            <div className="grid gap-6 lg:grid-cols-12">
              
              {/* Left Column: Upload & Video Player */}
              <div className="space-y-4 lg:col-span-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition hover:border-blue-500 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-blue-500"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => void onUpload(e.target.files?.[0] || null)}
                  />
                  <div className="flex flex-col items-center justify-center gap-2 py-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {file ? "Change Video File" : "Drop your MP4 here"}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-400">Click to browse video files from device</p>
                    </div>
                  </div>
                </div>

                {stats && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200/80 bg-white/50 p-3 dark:border-slate-800 dark:bg-slate-900/30">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Video Info</span>
                      <div className="mt-1 truncate text-xs font-bold text-slate-800 dark:text-slate-200">{stats.name}</div>
                      <div className="text-[11px] text-slate-400">{formatBytes(stats.size)}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-white/50 p-3 dark:border-slate-800 dark:bg-slate-900/30">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dimensions</span>
                      <div className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-200">{stats.width} × {stats.height}</div>
                      <div className="text-[11px] text-slate-400">Duration: {formatTime(stats.duration)}</div>
                    </div>
                  </div>
                )}

                {videoUrl && (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black dark:border-slate-800">
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      controls
                      className="max-h-64 w-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Right Column: Converter Controls */}
              <div className="space-y-4 lg:col-span-6">
                <div className="rounded-2xl border border-slate-200/80 bg-white/50 p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900/30">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Trimming & Performance</h3>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Start Time (sec)</label>
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={startTime}
                        onChange={(e) => setStartTime(Math.max(0, Number(e.target.value) || 0))}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">End Time (sec)</label>
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={endTime}
                        onChange={(e) => setEndTime(Math.max(0, Number(e.target.value) || 0))}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <span>Frame Rate ({fps} FPS)</span>
                      <span className="text-[11px] text-slate-400">{estimate}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={30}
                      step={1}
                      value={fps}
                      onChange={(e) => setFps(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <span>Output Width ({width}px)</span>
                      <span className="text-[11px] text-slate-400">Controls file size</span>
                    </div>
                    <input
                      type="range"
                      min={120}
                      max={960}
                      step={10}
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/50 p-2.5 dark:border-slate-800 dark:bg-slate-900/50">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Keep Aspect Ratio</span>
                    <input
                      type="checkbox"
                      checked={keepAspectRatio}
                      onChange={(e) => setKeepAspectRatio(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={convertToGif}
                    disabled={!file || !loaded || processing}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                    {processing ? "Converting Video..." : "Create GIF"}
                  </button>
                </div>

                {/* Progress & Output View */}
                <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Status</span>
                    <span className="text-blue-600 dark:text-blue-400">{status || (loaded ? "Ready" : "Loading engine...")}</span>
                  </div>

                  {processing && (
                    <div className="space-y-1">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-right text-[10px] font-bold text-slate-400">{progress}%</div>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-600 dark:bg-rose-950/30 dark:text-rose-300">
                      <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                    </div>
                  )}

                  {gifUrl ? (
                    <div className="space-y-3 pt-2">
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950">
                        <img src={gifUrl} alt="Generated GIF" className="max-h-56 w-full object-contain rounded-lg" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">
                          Size: {gifBlob ? formatBytes(gifBlob.size) : "—"}
                        </span>
                        <button
                          onClick={downloadGif}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700"
                        >
                          <Download className="h-3.5 w-3.5" /> Download GIF
                        </button>
                      </div>
                    </div>
                  ) : (
                    !processing && (
                      <div className="py-6 text-center text-xs text-slate-400 italic">
                        GIF preview will appear here after conversion.
                      </div>
                    )
                  )}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}