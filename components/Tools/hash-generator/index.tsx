"use client"

import React, { useState, useEffect, useMemo } from "react"
import { 
  Key, 
  Copy, 
  Trash2, 
  Check, 
  Sparkles, 
  RefreshCw, 
  CaseSensitive 
} from "lucide-react"
import { ToolHeroProps } from "../../../types/tool"
import ToolHero from "../../tool-page-helpers/ToolHero"

// shadcn/ui components (Fixed: Included Separator component)
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// Repaired JS MD5 Implementation to completely bypass raw buffer byte-length mismatch restrictions
function safeMd5(str: string): string {
    const k = [
        0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
        0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
        0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
        0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
        0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
        0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
        0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
        0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
    ];
    const r = [
        7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
        5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
        4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
        6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
    ];
    const s = new TextEncoder().encode(str);
    const len = s.length;
    
    // Dynamically scale word grids ensuring safe bounds
    const words = new Uint32Array(((len + 8) >> 6) + 1 << 4);
    
    // Fixed: Safe manual assignment loop bypassing non-multiple byte array initialization crashes
    for (let i = 0; i < len; i++) {
        const val = s[i];
        if (val !== undefined) {
            words[i >> 2] |= val << ((i % 4) << 3);
        }
    }
    
    const paddingStart = len;
    const paddingWordsBytes = new Uint8Array(words.buffer);
    paddingWordsBytes[paddingStart] = 0x80;
    const dataView = new DataView(words.buffer);
    dataView.setUint32(words.byteLength - 8, len << 3, true);

    let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
    for (let i = 0; i < words.length; i += 16) {
        let oldA = a, oldB = b, oldC = c, oldD = d;
        for (let j = 0; j < 64; j++) {
            let f = 0, g = 0;
            if (j < 16) { f = (b & c) | (~b & d); g = j; }
            else if (j < 32) { f = (d & b) | (~d & c); g = (5 * j + 1) % 16; }
            else if (j < 48) { f = b ^ c ^ d; g = (3 * j + 5) % 16; }
            else { f = c ^ (b | ~d); g = (7 * j) % 16; }
            const tmp = d; d = c; c = b;
            const sum = a + f + k[j]! + dataView.getUint32(i * 4 + g * 4, true);
            b = b + (sum << r[j]! | sum >>> (32 - r[j]!)); a = tmp;
        }
        a = (a + oldA) | 0; b = (b + oldB) | 0; c = (c + oldC) | 0; d = (d + oldD) | 0;
    }
    const hex = (n: number) => ("00000000" + (n >>> 0).toString(16)).slice(-8).match(/../g)!.reverse().join("");
    return hex(a) + hex(b) + hex(c) + hex(d);
}

async function nativeHash(text: string, algo: "SHA-1" | "SHA-256"): Promise<string> {
    const msgUint8 = new TextEncoder().encode(text)
    const hashBuffer = await crypto.subtle.digest(algo, msgUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

export default function HashGenerator({ tool }: ToolHeroProps) {
    const [inputText, setInputText] = useState("")
    const [hashes, setHashes] = useState({ md5: "", sha1: "", sha256: "" })
    const [isProcessing, setIsProcessing] = useState(false)
    const [isUppercase, setIsUppercase] = useState(false)
    const [copyState, setCopyState] = useState<Record<string, boolean>>({})

    useEffect(() => {
        if (!inputText.trim()) {
            setHashes({ md5: "", sha1: "", sha256: "" })
            return
        }

        setIsProcessing(true)
        const computeHashes = async () => {
            try {
                const md5Result = safeMd5(inputText)
                const sha1Result = await nativeHash(inputText, "SHA-1")
                const sha256Result = await nativeHash(inputText, "SHA-256")

                setHashes({
                    md5: md5Result,
                    sha1: sha1Result,
                    sha256: sha256Result
                })
            } catch (err) {
                console.error("Cryptographic processing failure:", err)
            } finally {
                setIsProcessing(false)
            }
        }

        const timer = setTimeout(() => {
            void computeHashes()
        }, 150)

        return () => clearTimeout(timer)
    }, [inputText])

    const clearAll = () => {
        setInputText("")
        setHashes({ md5: "", sha1: "", sha256: "" })
        setCopyState({})
    }

    const copyToClipboard = (hash: string, key: string) => {
        if (!hash) return
        const finalHash = isUppercase ? hash.toUpperCase() : hash.toLowerCase()
        void navigator.clipboard.writeText(finalHash).then(() => {
            setCopyState((prev) => ({ ...prev, [key]: true }))
            setTimeout(() => {
                setCopyState((prev) => ({ ...prev, [key]: false }))
            }, 1800)
        })
    }

    const hasAnyHash = !!(hashes.md5 || hashes.sha1 || hashes.sha256)

    return (
        <div className="flex justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10 text-slate-900 sm:px-6 lg:py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
            <div className="w-full max-w-5xl space-y-8">
                <ToolHero tool={tool} />

                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-xl shadow-slate-200/30 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/80 dark:shadow-black/20">
                    <div className="p-6 sm:p-8 space-y-6">
                        
                        {/* Configuration Controls area */}
                        <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20 border p-3 rounded-xl">
                            <div className="flex items-center gap-2 text-xs sm:text-base font-semibold text-slate-500 uppercase tracking-wider">
                                <Key className="h-4 w-4 text-indigo-500" /> Crypto Engine Matrix
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <Switch 
                                        id="case-toggle" 
                                        checked={isUppercase} 
                                        onCheckedChange={setIsUppercase} 
                                    />
                                    <Label htmlFor="case-toggle" className="text-xs sm:text-base font-medium cursor-pointer flex items-center gap-1">
                                        <CaseSensitive className="h-3.5 w-3.5" /> UPPERCASE
                                    </Label>
                                </div>
                                {inputText && (
                                    <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-xs sm:text-base text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg">
                                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Input Text Payload</Label>
                            <div className="relative">
                                <Textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Type or paste contents here. Hashes calculate cryptographically in real-time..."
                                    rows={5}
                                    className="w-full font-mono text-xs sm:text-base leading-relaxed resize-none custom-scrollbar bg-transparent border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-indigo-500 pr-10"
                                />
                                {isProcessing && (
                                    <div className="absolute right-3 bottom-3 text-indigo-500 animate-spin">
                                        <RefreshCw className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Results Section */}
                        {hasAnyHash && (
                            <div className="space-y-4 pt-2 animate-in fade-in-40 duration-200">
                                <Separator />
                                <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1">
                                    <Sparkles className="h-3.5 w-3.5 text-emerald-500" /> Verified Cryptographic Signatures
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { key: "md5", name: "MD5", len: "128-bit Signature", hash: hashes.md5 },
                                        { key: "sha1", name: "SHA-1", len: "160-bit Signature", hash: hashes.sha1 },
                                        { key: "sha256", name: "SHA-256", len: "256-bit Secure Shield", hash: hashes.sha256 },
                                    ].map((algo) => {
                                        const isCopied = !!copyState[algo.key]
                                        const processedHash = isUppercase ? algo.hash.toUpperCase() : algo.hash.toLowerCase()
                                        return (
                                            <Card key={algo.key} className="border-slate-100 dark:border-slate-900 shadow-sm bg-slate-50/20 dark:bg-slate-950/10">
                                                <div className="p-3 pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div className="space-y-1.5 min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs sm:text-base font-bold text-slate-800 dark:text-slate-200">{algo.name}</span>
                                                            <span className="text-[9px] font-mono font-medium text-slate-400">{algo.len}</span>
                                                        </div>
                                                        <div className="font-mono text-xs sm:text-base text-indigo-600 dark:text-indigo-400 break-all bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900 shadow-inner select-all">
                                                            {processedHash}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant={isCopied ? "default" : "outline"}
                                                        onClick={() => copyToClipboard(algo.hash, algo.key)}
                                                        className={cn(
                                                            "rounded-xl h-9 min-w-[76px] sm:self-end gap-1 text-xs sm:text-base",
                                                            isCopied ? "bg-emerald-600 text-white hover:bg-emerald-600" : "border-slate-200"
                                                        )}
                                                    >
                                                        {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                                        {isCopied ? "Copied" : "Copy"}
                                                    </Button>
                                                </div>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        

                    </div>
                </div>
            </div>
        </div>
    )
}