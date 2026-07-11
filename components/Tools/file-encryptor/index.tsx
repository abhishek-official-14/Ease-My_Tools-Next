"use client"

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react"
import JSZip from "jszip"
import { 
  Lock, 
  Unlock, 
  File, 
  Upload, 
  RefreshCw, 
  Trash2, 
  Copy, 
  Download, 
  AlertTriangle, 
  Check, 
  ShieldAlert, 
  Key, 
  Eye, 
  EyeOff, 
  Clock, 
  Sparkles,
  X
} from "lucide-react"
import { ToolHeroProps } from "../../../types/tool"
import ToolHero from "../../tool-page-helpers/ToolHero"

// shadcn/ui components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

// Types
type Mode = "encrypt" | "decrypt"
type FileStatus = "pending" | "processing" | "completed" | "error"

interface FileItem {
    id: string
    file: File
    originalName: string
    originalType: string
    size: number
    status: FileStatus
    progress: number
    encryptedSize?: number
    error?: string
    result?: Blob
}

interface EncryptionProgress {
    current: number
    total: number
    currentFile: string
    estimatedTimeRemaining: number
}

interface ProcessResult {
    id: string
    originalName: string
    processedName: string
    originalSize: number
    processedSize: number
    type: string
    blob: Blob
    timestamp: Date
    mode: Mode
}

interface ChunkMetadata {
    index: number
    offset: number
    length: number
    encryptedLength: number
    iv: string
}

interface EncryptedFileHeader {
    magic: string
    version: number
    originalName: string
    originalType: string
    originalSize: number
    createdAt: number
    chunkSize: number
    totalChunks: number
    salt: string
    chunks: ChunkMetadata[]
}

const MAGIC_IDENTIFIER = "EASYMT"
const CURRENT_VERSION = 2
const CHUNK_SIZE = 1024 * 1024 // 1MB chunks
const PBKDF2_ITERATIONS = 600000 
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB limit

// Helper: Local tailwind merger wrapper
function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

// Helper function to format file size (Moved up to prevent ReferenceError)
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Helper: Convert Uint8Array to ArrayBuffer
const toArrayBuffer = (uint8Array: Uint8Array): ArrayBuffer => {
    return uint8Array.buffer.slice(
        uint8Array.byteOffset,
        uint8Array.byteOffset + uint8Array.byteLength
    ) as ArrayBuffer
}

// Helper: Convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    let binary = ""
    for (let i = 0; i < bytes.byteLength; i++) {
        const byte = bytes[i]
        if (byte !== undefined) {
            binary += String.fromCharCode(byte)
        }
    }
    return btoa(binary)
}

// Helper: Convert Base64 to ArrayBuffer
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        const charCode = binary.charCodeAt(i)
        if (!isNaN(charCode)) {
            bytes[i] = charCode
        }
    }
    return bytes.buffer
}

const getRandomBytes = (size: number): Uint8Array => {
    return crypto.getRandomValues(new Uint8Array(size))
}

const generateSecurePassword = (): string => {
    const length = 20
    const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    const lowercase = "abcdefghijkmnopqrstuvwxyz"
    const numbers = "23456789"
    const symbols = "!@#$%^&*"

    const array = new Uint8Array(length)
    crypto.getRandomValues(array)

    const allChars = uppercase + lowercase + numbers + symbols
    let password = ""

    for (let i = 0; i < length; i++) {
        const randomValue = array[i]
        if (randomValue !== undefined) {
            password += allChars.charAt(randomValue % allChars.length)
        }
    }
    return password
}

const checkPasswordStrength = (password: string): { score: number; label: string; variant: "destructive" | "warning" | "secondary" | "success" } => {
    let score = 0
    if (password.length >= 12) score += 2
    else if (password.length >= 8) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^a-zA-Z0-9]/.test(password)) score += 2

    if (score <= 2) return { score, label: "Very Weak", variant: "destructive" }
    if (score <= 4) return { score, label: "Weak / Fair", variant: "warning" }
    if (score <= 5) return { score, label: "Good Strength", variant: "secondary" }
    return { score, label: "Strong Shield", variant: "success" }
}

const deriveKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)

    const baseKey = await crypto.subtle.importKey(
        "raw",
        passwordBuffer,
        "PBKDF2",
        false,
        ["deriveKey"]
    )

    const saltBuffer = toArrayBuffer(salt)

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: saltBuffer,
            iterations: PBKDF2_ITERATIONS,
            hash: "SHA-256",
        },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    )
}

const encryptChunk = async (chunk: Uint8Array, key: CryptoKey): Promise<{ encryptedData: Uint8Array; iv: Uint8Array }> => {
    const iv = getRandomBytes(12)
    const ivBuffer = toArrayBuffer(iv)
    const chunkBuffer = toArrayBuffer(chunk)

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: ivBuffer },
        key,
        chunkBuffer
    )

    return {
        encryptedData: new Uint8Array(encrypted),
        iv,
    }
}

const decryptChunk = async (encryptedChunk: Uint8Array, key: CryptoKey, iv: Uint8Array): Promise<Uint8Array> => {
    const ivBuffer = toArrayBuffer(iv)
    const chunkBuffer = toArrayBuffer(encryptedChunk)

    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBuffer },
        key,
        chunkBuffer
    )

    return new Uint8Array(decrypted)
}

const readFileChunk = async (file: File, start: number, end: number): Promise<Uint8Array> => {
    const chunkBlob = file.slice(start, end)
    const chunkBuffer = await chunkBlob.arrayBuffer()
    return new Uint8Array(chunkBuffer)
}

const encryptFile = async (
    file: File,
    password: string,
    onProgress?: (progress: number) => void,
    onChunkComplete?: (chunkIndex: number, totalChunks: number) => void
): Promise<Blob> => {
    const salt = getRandomBytes(32)
    const key = await deriveKey(password, salt)

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
    const chunks: {
        encryptedData: Uint8Array
        iv: Uint8Array
        originalLength: number
    }[] = []

    for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE
        const end = Math.min(start + CHUNK_SIZE, file.size)

        const chunk = await readFileChunk(file, start, end)
        const originalLength = chunk.length

        const { encryptedData, iv } = await encryptChunk(chunk, key)
        chunks.push({ encryptedData, iv, originalLength })

        if (onProgress) onProgress(((i + 1) / totalChunks) * 100)
        if (onChunkComplete) onChunkComplete(i + 1, totalChunks)
    }

    const chunkMetadata: ChunkMetadata[] = []
    let dataOffset = 0

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        if (!chunk) continue
        chunkMetadata.push({
            index: i,
            offset: dataOffset,
            length: chunk.originalLength,
            encryptedLength: chunk.encryptedData.length,
            iv: arrayBufferToBase64(toArrayBuffer(chunk.iv)),
        })
        dataOffset += chunk.encryptedData.length
    }

    const header: EncryptedFileHeader = {
        magic: MAGIC_IDENTIFIER,
        version: CURRENT_VERSION,
        originalName: file.name,
        originalType: file.type || "application/octet-stream",
        originalSize: file.size,
        createdAt: Date.now(),
        chunkSize: CHUNK_SIZE,
        totalChunks: chunks.length,
        salt: arrayBufferToBase64(toArrayBuffer(salt)),
        chunks: chunkMetadata,
    }

    const headerJson = JSON.stringify(header)
    const headerBytes = new TextEncoder().encode(headerJson)
    const headerLength = headerBytes.length

    const headerLengthBuffer = new Uint8Array(4)
    new DataView(headerLengthBuffer.buffer).setUint32(0, headerLength, false)

    const payloadBlobs: BlobPart[] = [headerLengthBuffer, headerBytes]
    for (const chunk of chunks) {
        payloadBlobs.push(chunk.encryptedData)
    }

    return new Blob(payloadBlobs, { type: "application/x-easymytools-encrypted" })
}

const decryptFile = async (
    file: File,
    password: string,
    onProgress?: (progress: number) => void,
    onChunkComplete?: (chunkIndex: number, totalChunks: number) => void
): Promise<{ blob: Blob; originalName: string; originalType: string }> => {
    const headerLengthBuffer = await readFileChunk(file, 0, 4)

    if (headerLengthBuffer.length < 4) {
        throw new Error("File too small. Corrupted or invalid encrypted file.")
    }

    const headerLength = new DataView(headerLengthBuffer.buffer).getUint32(0, false)

    if (headerLength <= 0 || headerLength > file.size - 4) {
        throw new Error("Invalid header length. File may be corrupted.")
    }

    const headerBytes = await readFileChunk(file, 4, 4 + headerLength)
    const headerJson = new TextDecoder().decode(headerBytes)

    let header: EncryptedFileHeader
    try {
        header = JSON.parse(headerJson)
    } catch (err) {
        throw new Error("Invalid header format. File may be corrupted.")
    }

    if (header.magic !== MAGIC_IDENTIFIER) {
        throw new Error("Invalid file format. Not an EaseMyTools encrypted file.")
    }

    if (header.version !== CURRENT_VERSION) {
        throw new Error(`Unsupported encryption version: ${header.version}. Expected version: ${CURRENT_VERSION}`)
    }

    const saltBuffer = base64ToArrayBuffer(header.salt)
    const salt = new Uint8Array(saltBuffer)
    const key = await deriveKey(password, salt)

    const encryptedDataStart = 4 + headerLength
    const decryptedChunks: Uint8Array[] = []

    for (let i = 0; i < header.chunks.length; i++) {
        const chunkMeta = header.chunks[i]
        if (!chunkMeta) throw new Error(`Missing chunk metadata for chunk ${i}.`)

        const chunkStart = encryptedDataStart + chunkMeta.offset
        const chunkEnd = chunkStart + chunkMeta.encryptedLength

        if (chunkEnd > file.size) throw new Error(`Chunk ${i} extends beyond file bounds.`)

        const encryptedChunk = await readFileChunk(file, chunkStart, chunkEnd)
        const ivBuffer = base64ToArrayBuffer(chunkMeta.iv)
        const iv = new Uint8Array(ivBuffer)

        try {
            const decryptedChunk = await decryptChunk(encryptedChunk, key, iv)
            decryptedChunks.push(decryptedChunk)
        } catch (err) {
            throw new Error(`Failed to decrypt chunk ${i}. Incorrect password or corrupted file.`)
        }

        if (onProgress) onProgress(((i + 1) / header.chunks.length) * 100)
        if (onChunkComplete) onChunkComplete(i + 1, header.chunks.length)
    }

    return {
        blob: new Blob(decryptedChunks, { type: header.originalType }),
        originalName: header.originalName,
        originalType: header.originalType,
    }
}

export default function FileEncryptor({ tool }: ToolHeroProps) {
    const [mode, setMode] = useState<Mode>("encrypt")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [files, setFiles] = useState<FileItem[]>([])
    const [results, setResults] = useState<ProcessResult[]>([])
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [progress, setProgress] = useState<EncryptionProgress>({
        current: 0,
        total: 0,
        currentFile: "",
        estimatedTimeRemaining: 0,
    })
    const [error, setError] = useState<string>("")
    const [success, setSuccess] = useState<string>("")
    const [abortController, setAbortController] = useState<AbortController | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const passwordStrength = useMemo(() => checkPasswordStrength(password), [password])
    const passwordsMatch = mode === "decrypt" || password === confirmPassword

    const hasValidFiles = files.length > 0
    const canProcess = hasValidFiles && password.length > 0 && passwordsMatch && !isProcessing

    const existingFileIdentifiers = useMemo(() => {
        const identifiers = new Set<string>()
        files.forEach((file) => {
            identifiers.add(`${file.file.name}|${file.file.size}|${file.file.lastModified}`)
        })
        return identifiers
    }, [files])

    const handleFiles = useCallback(
        (selectedFiles: FileList | File[]) => {
            const fileArray = Array.from(selectedFiles)
            const newFiles: FileItem[] = []
            const errors: string[] = []
            const currentIdentifiers = new Set(existingFileIdentifiers)

            for (const file of fileArray) {
                if (file.size > MAX_FILE_SIZE) {
                    errors.push(`${file.name}: File exceeds 100MB limit (${formatFileSize(file.size)})`)
                    continue
                }

                const fileId = `${file.name}|${file.size}|${file.lastModified}`
                if (currentIdentifiers.has(fileId)) {
                    errors.push(`${file.name}: Duplicate file detected`)
                    continue
                }

                currentIdentifiers.add(fileId)
                newFiles.push({
                    id: Math.random().toString(36).substring(2, 11),
                    file,
                    originalName: file.name,
                    originalType: file.type,
                    size: file.size,
                    status: "pending",
                    progress: 0,
                })
            }

            if (errors.length > 0) {
                setError(`Skipped rejected files:\n${errors.join("\n")}`)
                setTimeout(() => setError(""), 6000)
            }

            if (newFiles.length > 0) {
                setFiles((prev) => [...prev, ...newFiles])
                setError("")
            }
        },
        [existingFileIdentifiers]
    )

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            setIsDragging(false)
            if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
        },
        [handleFiles]
    )

    const removeFile = useCallback((id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id))
    }, [])

    const clearFiles = useCallback(() => {
        setFiles([])
        setError("")
        setSuccess("")
        setPassword("")
        setConfirmPassword("")
    }, [])

    const handleGeneratePassword = useCallback(() => {
        const newPassword = generateSecurePassword()
        setPassword(newPassword)
        if (mode === "encrypt") setConfirmPassword(newPassword)
    }, [mode])

    const downloadResult = useCallback((result: ProcessResult) => {
        const url = URL.createObjectURL(result.blob)
        const a = document.createElement("a")
        a.href = url
        a.download = result.processedName
        a.click()
        URL.revokeObjectURL(url)
    }, [])

    const processFiles = useCallback(async () => {
        if (!canProcess) return

        setIsProcessing(true)
        setError("")
        setSuccess("")

        const controller = new AbortController()
        setAbortController(controller)

        try {
            for (let i = 0; i < files.length; i++) {
                if (controller.signal.aborted) break

                const fileItem = files[i]
                if (!fileItem) continue

                const fileStartTime = Date.now()
                setProgress({
                    current: i + 1,
                    total: files.length,
                    currentFile: fileItem.originalName,
                    estimatedTimeRemaining: 0,
                })

                setFiles((prev) =>
                    prev.map((f) => f.id === fileItem.id ? { ...f, status: "processing", progress: 0 } : f)
                )

                try {
                    let resultBlob: Blob
                    let processedName: string

                    if (mode === "encrypt") {
                        resultBlob = await encryptFile(
                            fileItem.file,
                            password,
                            (progress) => {
                                setFiles((prev) => prev.map((f) => f.id === fileItem.id ? { ...f, progress } : f))
                            },
                            (current, total) => {
                                const elapsed = Date.now() - fileStartTime
                                const remaining = Math.max(0, ((elapsed / current) * total) - elapsed)
                                setProgress((prev) => ({ ...prev, estimatedTimeRemaining: remaining / 1000 }))
                            }
                        )
                        processedName = `${fileItem.originalName}.encrypted`
                    } else {
                        const decrypted = await decryptFile(
                            fileItem.file,
                            password,
                            (progress) => {
                                setFiles((prev) => prev.map((f) => f.id === fileItem.id ? { ...f, progress } : f))
                            },
                            (current, total) => {
                                const elapsed = Date.now() - fileStartTime
                                const remaining = Math.max(0, ((elapsed / current) * total) - elapsed)
                                setProgress((prev) => ({ ...prev, estimatedTimeRemaining: remaining / 1000 }))
                            }
                        )
                        resultBlob = decrypted.blob
                        processedName = decrypted.originalName
                    }

                    setResults((prev) => [
                        ...prev,
                        {
                            id: fileItem.id,
                            originalName: fileItem.originalName,
                            processedName,
                            originalSize: fileItem.size,
                            processedSize: resultBlob.size,
                            type: fileItem.originalType,
                            blob: resultBlob,
                            timestamp: new Date(),
                            mode,
                        },
                    ])

                    setFiles((prev) =>
                        prev.map((f) => f.id === fileItem.id ? { ...f, status: "completed", result: resultBlob, encryptedSize: resultBlob.size } : f)
                    )
                } catch (err) {
                    setFiles((prev) =>
                        prev.map((f) => f.id === fileItem.id ? { ...f, status: "error", error: err instanceof Error ? err.message : "Failed" } : f)
                    )
                }
            }
            if (!controller.signal.aborted) {
                setFiles([])
                if (fileInputRef.current) fileInputRef.current.value = ""
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Processing failed")
        } finally {
            setIsProcessing(false)
            setAbortController(null)
        }
    }, [canProcess, files, mode, password])

    const abortProcessing = useCallback(() => {
        if (abortController) {
            abortController.abort()
            setIsProcessing(false)
            setFiles((prev) => prev.map((f) => f.status === "processing" ? { ...f, status: "pending", progress: 0 } : f))
        }
    }, [abortController])

    return (
        <div className="flex justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10 text-slate-900 sm:px-6 lg:py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
            <div className="w-full max-w-6xl space-y-8">
                <ToolHero tool={tool} />

                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-xl shadow-slate-200/30 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/80 dark:shadow-black/20">
                    <div className="p-6 sm:p-8">
                        
                        {/* Mode Selector */}
                        <Tabs value={mode} onValueChange={(v) => { setMode(v as Mode); clearFiles(); setResults([]); }} className="w-full mb-6">
                            <TabsList className="grid w-full max-w-md grid-cols-2">
                                <TabsTrigger value="encrypt" className="gap-2"><Lock className="h-4 w-4" /> Encrypt Files</TabsTrigger>
                                <TabsTrigger value="decrypt" className="gap-2"><Unlock className="h-4 w-4" /> Decrypt Files</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Dropzone Area */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => !isProcessing && fileInputRef.current?.click()}
                            className={cn(
                                "border-2 border-dashed rounded-2xl p-8 text-center transition flex flex-col items-center justify-center min-h-[200px] bg-slate-50/40 dark:bg-slate-950/20",
                                isProcessing ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                                isDragging ? "border-indigo-500 bg-indigo-50/20" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                            )}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                                disabled={isProcessing}
                                className="hidden"
                            />
                            <div className="space-y-2 select-none">
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl inline-block shadow-sm border border-slate-100 dark:border-slate-800/80">
                                    <Upload className="h-6 w-6 text-slate-500" />
                                </div>
                                <p className="text-sm font-medium">Drag & drop files here or click to browse</p>
                                <p className="text-xs text-slate-400">Supports any format (Images, Documents, Archive) up to 100MB per file</p>
                            </div>
                        </div>

                        {/* File Queue List */}
                        {hasValidFiles && (
                            <Card className="mt-6 border-slate-200 dark:border-slate-800">
                                <CardHeader className="flex flex-row items-center justify-between pb-3">
                                    <CardTitle className="text-sm font-semibold">Selected Payload Queue ({files.length})</CardTitle>
                                    {!isProcessing && <Button variant="ghost" size="sm" onClick={clearFiles} className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 h-8 text-xs">Clear All</Button>}
                                </CardHeader>
                                <CardContent className="space-y-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                                    {files.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-950/40 group shadow-sm">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="p-2 bg-white dark:bg-slate-900 border rounded-lg text-sm shadow-sm">📄</div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200" title={file.originalName}>{file.originalName}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{formatFileSize(file.size)}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 ml-4">
                                                {file.status === "processing" && (
                                                    <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 font-bold dark:text-indigo-400">
                                                        <RefreshCw className="h-3 w-3 animate-spin" /> {Math.round(file.progress)}%
                                                    </div>
                                                )}
                                                {file.status === "error" && <Badge variant="destructive" className="text-[9px]">{file.error || "Failed"}</Badge>}
                                                {!isProcessing && file.status === "pending" && (
                                                    <button type="button" onClick={() => removeFile(file.id)} className="text-slate-400 hover:text-rose-600 transition p-1 text-sm">✕</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Secure Key Access Configuration Section */}
                        {hasValidFiles && (
                            <div className="grid gap-6 md:grid-cols-2 mt-6 animate-in fade-in-50 duration-200">
                                <Card className="border-slate-200 dark:border-slate-800">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-semibold flex items-center gap-2"><Key className="h-4 w-4 text-indigo-500" /> Vault Key Access</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Enter cryptographically secure token key..."
                                                    disabled={isProcessing}
                                                    className="pr-20 h-10 font-mono text-xs rounded-xl"
                                                />
                                                <div className="absolute right-1 top-1 bottom-1 flex gap-1">
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                    {mode === "encrypt" && (
                                                        <Button type="button" variant="ghost" size="icon" onClick={handleGeneratePassword} className="h-8 w-8 text-indigo-500 hover:text-indigo-600" title="Generate Secure Matrix Password">
                                                            <Sparkles className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {mode === "encrypt" && (
                                            <div className="space-y-2">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Confirm vault shield password match..."
                                                    disabled={isProcessing}
                                                    className="h-10 font-mono text-xs rounded-xl"
                                                />
                                                {confirmPassword && !passwordsMatch && (
                                                    <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Passwords do not align</p>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 dark:border-slate-800">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-semibold flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-emerald-500" /> Cipher Mechanics</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-xs space-y-3 text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {mode === "encrypt" && password && (
                                            <div className="p-3 border rounded-xl bg-slate-50/50 dark:bg-slate-950/20 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">Password Integrity:</span>
                                                    <Badge variant={passwordStrength.variant} className="text-[9px] px-2 h-5 font-bold uppercase">{passwordStrength.label}</Badge>
                                                </div>
                                                <Progress value={(passwordStrength.score / 7) * 100} className="h-1.5" />
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-1 bg-slate-50/30 dark:bg-slate-950/10 rounded-xl border border-dashed">
                                            <div>• Cipher: <span className="font-bold text-slate-800 dark:text-slate-200">AES-256-GCM</span></div>
                                            <div>• KDF: <span className="font-bold text-slate-800 dark:text-slate-200">PBKDF2-SHA256</span></div>
                                            <div>• Iterations: <span className="font-bold text-slate-800 dark:text-slate-200">{PBKDF2_ITERATIONS.toLocaleString()}</span></div>
                                            <div>• Chunk Slice: <span className="font-bold text-slate-800 dark:text-slate-200">1 MB Bounds</span></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Real-time Processing Monitor Overlay */}
                        {isProcessing && progress.total > 0 && (
                            <Card className="mt-6 border-indigo-100 bg-indigo-50/10 dark:border-indigo-950/40 dark:bg-indigo-950/5 p-4 animate-in fade-in-40">
                                <div className="flex flex-col sm:flex-row justify-between text-xs font-semibold mb-2 text-indigo-700 dark:text-indigo-400 gap-1">
                                    <span className="truncate max-w-sm">Streaming: {progress.currentFile}</span>
                                    <span className="font-mono text-right shrink-0">Asset {progress.current} of {progress.total} packages</span>
                                </div>
                                <Progress value={(progress.current / progress.total) * 100} className="h-2" />
                                <div className="flex items-center justify-between mt-3 text-xs">
                                    {progress.estimatedTimeRemaining > 0 ? (
                                        <span className="text-slate-400 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Remaining: {Math.ceil(progress.estimatedTimeRemaining)}s</span>
                                    ) : <span />}
                                    <Button variant="outline" size="sm" onClick={abortProcessing} className="text-rose-600 bg-white dark:bg-slate-900 border-rose-200 h-8 text-xs rounded-xl">Cancel Sequence</Button>
                                </div>
                            </Card>
                        )}

                        {/* Core Pipeline Engine Activator Button */}
                        {hasValidFiles && !isProcessing && (
                            <div className="mt-6 flex justify-end">
                                <Button 
                                    onClick={processFiles} 
                                    disabled={!canProcess}
                                    className="w-full sm:w-auto px-6 h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/10 gap-2"
                                >
                                    <Lock className="h-4 w-4" /> {mode === "encrypt" ? "Execute Matrix Encryption" : "Unlock Package Decryption"}
                                </Button>
                            </div>
                        )}

                        {/* Compiled Complete Outputs Section */}
                        {results.length > 0 && (
                            <Card className="mt-8 border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-4 duration-300">
                                <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <Check className="h-4 w-4 text-emerald-500" />
                                        Processed Vault Repositories ({results.length})
                                    </CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => setResults([])} className="text-slate-400 text-xs h-8">Clear Results</Button>
                                </CardHeader>
                                <CardContent className="p-0 max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {results.map((res) => (
                                        <div key={res.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80 gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs font-bold truncate text-slate-800 dark:text-slate-200" title={res.processedName}>{res.processedName}</div>
                                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono text-slate-400 mt-1">
                                                    <span>Origin size: {formatFileSize(res.originalSize)}</span>
                                                    <span>• File weight: {formatFileSize(res.processedSize)}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 shrink-0 justify-end">
                                                <Button size="sm" onClick={() => downloadResult(res)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 gap-1.5 rounded-xl">
                                                    <Download className="h-3.5 w-3.5" /> Download
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => {
                                                    const info = `File: ${res.originalName}\nProcessed Name: ${res.processedName}\nSize: ${formatFileSize(res.processedSize)}`;
                                                    navigator.clipboard.writeText(info);
                                                }} className="h-8 text-xs font-medium rounded-xl border-slate-200">
                                                    <Copy className="h-3.5 w-3.5" /> Info
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Error Alert Display */}
                        {error && (
                            <div className="mt-4 p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 dark:border-rose-900/30 dark:bg-rose-950/20 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center justify-between shadow-sm animate-in fade-in-50">
                                <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> <span className="whitespace-pre-line">{error}</span></span>
                                <button type="button" onClick={() => setError("")} className="hover:opacity-70 text-sm font-bold px-1.5">×</button>
                            </div>
                        )}

                        {/* Informational Guidance Grid */}
                        {/* <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                { title: "AES-256-GCM Encryption", icon: "🔐", desc: "Military-grade symmetric encryption utilizing an independent Initialization Vector (IV) and cryptographic tag verification per slice packet." },
                                { title: "PBKDF2-SHA256 Shield", icon: "💪", desc: `Secured via ${PBKDF2_ITERATIONS.toLocaleString()} structural loops of salted key derivation matrices protecting parameters against targeted compute arrays.` },
                                { title: "100% Native Client Execution", icon: "🔄", desc: "Process execution functions stay exclusively in sandboxed browser layers. Assets do not parse or upload through cloud network routes." },
                            ].map((info) => (
                                <div key={info.title} className="p-4 rounded-xl border border-slate-200/70 bg-white/40 dark:border-slate-800/80 dark:bg-slate-950/20 flex gap-3 shadow-sm">
                                    <div className="text-xl select-none">{info.icon}</div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{info.title}</h4>
                                        <p className="text-xs text-slate-400 leading-normal">{info.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div> */}

                    </div>
                </div>
            </div>
        </div>
    )
}