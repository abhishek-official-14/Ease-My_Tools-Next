'use client';

import React, { useState, useRef, useCallback } from 'react';
import styles from './styles.module.css';

interface CompressionResult {
  url: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  dimensions: { width: number; height: number };
  format: string;
}

interface FormatOption {
  value: string;
  label: string;
  description: string;
  quality: string;
  icon: string;
}

interface ModeOption {
  value: string;
  label: string;
  description: string;
  icon: string;
}

const ImageCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetKB, setTargetKB] = useState<number>(100);
  const [format, setFormat] = useState<string>("webp");
  const [mode, setMode] = useState<string>("balanced");
  const [keepMetadata, setKeepMetadata] = useState<boolean>(false);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatOptions: FormatOption[] = [
    { value: "jpeg", label: "JPEG", description: "Best for photos", quality: "lossy", icon: "📷" },
    { value: "png", label: "PNG", description: "Best for graphics", quality: "lossless", icon: "🎨" },
    { value: "webp", label: "WebP", description: "Modern format", quality: "lossy/lossless", icon: "🌐" },
    { value: "avif", label: "AVIF", description: "Best compression", quality: "lossy", icon: "⚡" }
  ];

  const modeOptions: ModeOption[] = [
    { value: "high", label: "High Quality", description: "Preserve maximum quality", icon: "✨" },
    { value: "balanced", label: "Balanced", description: "Best quality/size ratio", icon: "⚖️" },
    { value: "small", label: "Smallest Size", description: "Maximum compression", icon: "📦" }
  ];

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File size should be less than 50MB');
      return;
    }

    setFile(selectedFile);
    setResult(null);
    setError(null);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile ?? null);
  }, []);

  // ---------- ADAPTIVE CLIENT PRE‑COMPRESSION ----------
  const precompressClient = (
    file: File,
    targetKB: number
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);

        // We want the client output to be roughly targetKB * 1.5 ~ 2
        // But we cannot predict exactly. Use a heuristic:
        let maxWidth: number;
        let quality: number;

        if (targetKB <= 100) {
          maxWidth = 800;
          quality = 0.75;
        } else if (targetKB <= 300) {
          maxWidth = 1200;
          quality = 0.85;
        } else if (targetKB <= 600) {
          // For 500 KB target, use higher resolution and quality
          maxWidth = 1800;
          quality = 0.92;
        } else {
          maxWidth = 2200;
          quality = 0.95;
        }

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        let mimeType = file.type;
        if (!mimeType.startsWith('image/')) mimeType = 'image/jpeg';

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas toBlob failed'));
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image for pre‑compression'));
      };

      img.src = url;
    });
  };
  // ----------------------------------------------------

  const compressImage = async () => {
    if (!file) return;

    setIsCompressing(true);
    setError(null);
    setProgress(5);

    let fileToUpload = file;

    try {
      setProgress(10);
      // Pass targetKB and original file size to the pre‑compressor
      const precompressedBlob = await precompressClient(file, targetKB);
      fileToUpload = new File([precompressedBlob], file.name, { type: precompressedBlob.type });
      setProgress(20);
    } catch (err) {
      console.warn('Client pre‑compression failed, using original file', err);
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("targetKB", String(targetKB));
    formData.append("format", format);
    formData.append("mode", mode);
    formData.append("keepMetadata", String(keepMetadata));

    try {
      setProgress(30);
      const response = await fetch("/api/compress", {
        method: "POST",
        body: formData,
      });

      setProgress(70);

      if (!response.ok) {
        throw new Error("Compression failed");
      }

      const compressedBlob = await response.blob();

      const originalSize = file.size;
      let compressedSize = compressedBlob.size;

      const originalSizeHeader = response.headers.get('X-Original-Size');
      const compressedSizeHeader = response.headers.get('X-Compressed-Size');

      // if (originalSizeHeader) originalSize = parseInt(originalSizeHeader);
      if (compressedSizeHeader) compressedSize = parseInt(compressedSizeHeader);

      const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
      const compressedUrl = URL.createObjectURL(compressedBlob);

      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = () => resolve(null);
        img.onerror = () => reject(new Error("Failed to load compressed image"));
        img.src = compressedUrl;
      });

      setProgress(100);

      setResult({
        url: compressedUrl,
        originalSize,
        compressedSize,
        compressionRatio: Math.max(0, Math.min(100, compressionRatio)),
        dimensions: { width: img.width, height: img.height },
        format: format.toUpperCase()
      });

    } catch (error) {
      console.error("Compression error:", error);
      setError(error instanceof Error ? error.message : "Failed to compress image. Please try again.");
    } finally {
      setTimeout(() => {
        setIsCompressing(false);
        setProgress(0);
      }, 500);
    }
  };

  const downloadImage = () => {
    if (!result?.url) return;

    const link = document.createElement('a');
    const originalName = file?.name?.split('.')[0] || 'image';
    link.download = `${originalName}_compressed_${Date.now()}.${format}`;
    link.href = result.url;
    link.click();
  };

  const resetAll = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setTargetKB(100);
    setFormat("webp");
    setMode("balanced");
    setKeepMetadata(false);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>🔥 Smart Compression</div>
        <h1 className={styles.heroTitle}>Image Compressor</h1>
        <p className={styles.heroSubtitle}>
          Compress images to exact file sizes while preserving quality
        </p>
      </div>

      <div className={styles.main}>
        <div className={styles.twoColumnLayout}>
          <div className={styles.inputColumn}>
            <div
              className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.uploadIcon}>📸</div>
              <h3>Upload Image</h3>
              <p>Drag & drop or click to browse</p>
              <small>Supports JPG, PNG, WebP, AVIF (Max 50MB)</small>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
              />
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}

            {previewUrl && (
              <div className={styles.previewSection}>
                <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{file?.name}</span>
                  <span className={styles.fileSize}>{formatBytes(file?.size || 0)}</span>
                </div>
              </div>
            )}

            <div className={styles.settingsCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>⚙️</span>
                <h3>Compression Settings</h3>
              </div>

              <div className={styles.inputGroup}>
                <label>
                  Target Size
                  <span className={styles.labelValue}>{targetKB} KB</span>
                </label>
                <div className={styles.rangeSlider}>
                  <input
                    type="range"
                    className={styles.slider}
                    min="10"
                    max="1000"
                    step="10"
                    value={targetKB}
                    onChange={(e) => setTargetKB(Number(e.target.value))}
                  />
                  <div className={styles.rangeValues}>
                    <span>10 KB</span>
                    <span>250 KB</span>
                    <span>500 KB</span>
                    <span>750 KB</span>
                    <span>1000 KB</span>
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Output Format</label>
                <div className={styles.formatGrid}>
                  {formatOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className={`${styles.formatCard} ${format === opt.value ? styles.active : ''}`}
                      onClick={() => setFormat(opt.value)}
                    >
                      <span className={styles.formatIcon}>{opt.icon}</span>
                      <span className={styles.formatName}>{opt.label}</span>
                      <span className={styles.formatDesc}>{opt.description}</span>
                      <span className={styles.qualityBadge}>{opt.quality}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Compression Mode</label>
                <div className={styles.modeGrid}>
                  {modeOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className={`${styles.modeCard} ${mode === opt.value ? styles.active : ''}`}
                      onClick={() => setMode(opt.value)}
                    >
                      <span className={styles.modeIcon}>{opt.icon}</span>
                      <div>
                        <div className={styles.modeName}>{opt.label}</div>
                        <div className={styles.modeDesc}>{opt.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    checked={keepMetadata}
                    onChange={(e) => setKeepMetadata(e.target.checked)}
                  />
                  <span>Keep Metadata (EXIF, GPS, etc.)</span>
                </label>
              </div>

              {isCompressing && (
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                  ></div>
                  <span className={styles.progressText}>{progress}%</span>
                </div>
              )}

              <div className={styles.actionButtons}>
                <button
                  className={styles.compressBtn}
                  onClick={compressImage}
                  disabled={!file || isCompressing}
                >
                  {isCompressing ? '⏳ Compressing...' : '🔥 Compress Image'}
                </button>
                <button className={styles.resetBtn} onClick={resetAll}>
                  🗑️ Reset
                </button>
              </div>
            </div>
          </div>

          <div className={styles.resultsColumn}>
            {result ? (
              <>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>📊</div>
                    <div className={styles.statValue}>{result.compressionRatio.toFixed(1)}%</div>
                    <div className={styles.statLabel}>Compression Ratio</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>📦</div>
                    <div className={styles.statValue}>{formatBytes(result.compressedSize)}</div>
                    <div className={styles.statLabel}>Compressed Size</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>💾</div>
                    <div className={styles.statValue}>
                      {result.compressedSize < result.originalSize
                        ? `-${((1 - result.compressedSize / result.originalSize) * 100).toFixed(1)}%`
                        : 'No change'}
                    </div>
                    <div className={styles.statLabel}>Size Reduction</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>📐</div>
                    <div className={styles.statValue}>{result.dimensions.width}×{result.dimensions.height}</div>
                    <div className={styles.statLabel}>Dimensions</div>
                  </div>
                </div>

                <div className={styles.resultCard}>
                  <img src={result.url} alt="Compressed" className={styles.resultImage} />
                  <div className={styles.resultDetails}>
                    <span className={styles.compressionBadge}>
                      Saved {formatBytes(result.originalSize - result.compressedSize)}
                    </span>
                    <button className={styles.downloadBtn} onClick={downloadImage}>
                      ⬇️ Download {result.format}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🖼️</div>
                <h3>No Image Compressed Yet</h3>
                <p>Upload an image and adjust settings to see results</p>
              </div>
            )}

            <div className={styles.tipsSection}>
              <div className={styles.tipsHeader}>
                <span>💡</span>
                <h3>Pro Tips</h3>
              </div>
              <div className={styles.tipsGrid}>
                <div className={styles.tipCard}>
                  <div className={styles.tipIcon}>🎯</div>
                  <div className={styles.tipContent}>
                    <h4>Target Size</h4>
                    <p>Set exact KB target for precise control</p>
                  </div>
                </div>
                <div className={styles.tipCard}>
                  <div className={styles.tipIcon}>🔄</div>
                  <div className={styles.tipContent}>
                    <h4>Format Selection</h4>
                    <p>WebP/AVIF gives better compression than JPEG</p>
                  </div>
                </div>
                <div className={styles.tipCard}>
                  <div className={styles.tipIcon}>⚡</div>
                  <div className={styles.tipContent}>
                    <h4>Mode Selection</h4>
                    <p>Use &quot;High Quality&quot; for photos, &quot;Smallest&quot; for web</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCompressor;