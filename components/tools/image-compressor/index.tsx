// 'use client';

// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import styles from './styles.module.css';

// interface CompressionResult {
//   url: string;
//   originalSize: number;
//   compressedSize: number;
//   compressionRatio: number;
//   dimensions: { width: number; height: number };
//   format: string;
// }

// interface FormatOption {
//   value: string;
//   label: string;
//   description: string;
//   quality: string;
//   icon: string;
// }

// interface ModeOption {
//   value: string;
//   label: string;
//   description: string;
//   icon: string;
// }

// const ImageCompressor: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [targetKB, setTargetKB] = useState<number>(100);
//   const [format, setFormat] = useState<string>("webp");
//   const [mode, setMode] = useState<string>("balanced");
//   const [keepMetadata, setKeepMetadata] = useState<boolean>(false);
//   const [isCompressing, setIsCompressing] = useState<boolean>(false);
//   const [result, setResult] = useState<CompressionResult | null>(null);
//   const [dragActive, setDragActive] = useState<boolean>(false);
//   const [progress, setProgress] = useState<number>(0);
  
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const formatOptions: FormatOption[] = [
//     { value: "jpeg", label: "JPEG", description: "Best for photos", quality: "lossy", icon: "📷" },
//     { value: "png", label: "PNG", description: "Best for graphics", quality: "lossless", icon: "🎨" },
//     { value: "webp", label: "WebP", description: "Modern format", quality: "lossy/lossless", icon: "🌐" },
//     { value: "avif", label: "AVIF", description: "Best compression", quality: "lossy", icon: "⚡" }
//   ];

//   const modeOptions: ModeOption[] = [
//     { value: "high", label: "High Quality", description: "Preserve maximum quality", icon: "✨" },
//     { value: "balanced", label: "Balanced", description: "Best quality/size ratio", icon: "⚖️" },
//     { value: "small", label: "Smallest Size", description: "Maximum compression", icon: "📦" }
//   ];

//   const handleFileChange = (selectedFile: File | null) => {
//     if (!selectedFile) return;

//     if (!selectedFile.type.startsWith('image/')) {
//       alert('Please upload a valid image file');
//       return;
//     }

//     if (selectedFile.size > 50 * 1024 * 1024) {
//       alert('File size should be less than 50MB');
//       return;
//     }

//     setFile(selectedFile);
//     setResult(null);
//     setProgress(0);
    
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setPreviewUrl(e.target?.result as string);
//     };
//     reader.readAsDataURL(selectedFile);
//   };

//   const handleDrag = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   }, []);

//   const handleDrop = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     const droppedFile = e.dataTransfer.files[0];
//     handleFileChange(droppedFile);
//   }, []);

//   // Simulate compression with progress
//   const compressImage = async () => {
//     if (!file) return;

//     setIsCompressing(true);
//     setProgress(0);

//     // Simulate progress
//     const progressInterval = setInterval(() => {
//       setProgress(prev => {
//         if (prev >= 90) {
//           clearInterval(progressInterval);
//           return 90;
//         }
//         return prev + 10;
//       });
//     }, 200);

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("targetKB", String(targetKB));
//     formData.append("format", format);
//     formData.append("mode", mode);
//     formData.append("keepMetadata", String(keepMetadata));

//     try {
//       // For demo purposes, we'll simulate compression client-side
//       // In production, replace with actual API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Simulate compression result
//       const originalSize = file.size;
//       const targetSizeBytes = targetKB * 1024;
//       const compressedSize = Math.min(originalSize, targetSizeBytes);
//       const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
      
//       // Create a canvas to simulate compressed image
//       const img = new Image();
//       await new Promise((resolve) => {
//         img.onload = () => {
//           const canvas = document.createElement('canvas');
//           const ctx = canvas.getContext('2d');
//           canvas.width = img.width;
//           canvas.height = img.height;
//           ctx?.drawImage(img, 0, 0);
          
//           // Apply compression based on mode
//           let quality = 0.8;
//           if (mode === 'high') quality = 0.95;
//           if (mode === 'small') quality = 0.6;
          
//           canvas.toBlob((blob) => {
//             if (blob) {
//               const compressedUrl = URL.createObjectURL(blob);
//               setResult({
//                 url: compressedUrl,
//                 originalSize,
//                 compressedSize: blob.size,
//                 compressionRatio,
//                 dimensions: { width: img.width, height: img.height },
//                 format: format.toUpperCase()
//               });
//             }
//             resolve(null);
//           }, `image/${format}`, quality);
//         };
//         img.src = previewUrl!;
//       });
      
//       clearInterval(progressInterval);
//       setProgress(100);
//     } catch (error) {
//       console.error("Compression error:", error);
//       alert("Failed to compress image. Please try again.");
//       clearInterval(progressInterval);
//     } finally {
//       setTimeout(() => {
//         setIsCompressing(false);
//         setProgress(0);
//       }, 500);
//     }
//   };

//   const downloadImage = () => {
//     if (!result?.url) return;
    
//     const link = document.createElement('a');
//     const originalName = file?.name?.split('.')[0] || 'image';
//     link.download = `${originalName}_compressed_${Date.now()}.${format}`;
//     link.href = result.url;
//     link.click();
//   };

//   const resetAll = () => {
//     setFile(null);
//     setPreviewUrl(null);
//     setResult(null);
//     setTargetKB(100);
//     setFormat("webp");
//     setMode("balanced");
//     setKeepMetadata(false);
//     setProgress(0);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const formatBytes = (bytes: number): string => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   return (
//     <div className={styles.container}>
//       {/* Hero Section */}
//       <div className={styles.hero}>
//         <div className={styles.heroBadge}>🔥 Smart Compression</div>
//         <h1 className={styles.heroTitle}>Image Compressor</h1>
//         <p className={styles.heroSubtitle}>
//           Compress images to exact file sizes while preserving quality
//         </p>
//       </div>

//       <div className={styles.main}>
//         <div className={styles.twoColumnLayout}>
//           {/* Left Column - Upload & Settings */}
//           <div className={styles.inputColumn}>
//             {/* Upload Area */}
//             <div 
//               className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''}`}
//               onDragEnter={handleDrag}
//               onDragLeave={handleDrag}
//               onDragOver={handleDrag}
//               onDrop={handleDrop}
//               onClick={() => fileInputRef.current?.click()}
//             >
//               <div className={styles.uploadIcon}>📸</div>
//               <h3>Upload Image</h3>
//               <p>Drag & drop or click to browse</p>
//               <small>Supports JPG, PNG, WebP, AVIF (Max 50MB)</small>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
//                 style={{ display: 'none' }}
//               />
//             </div>

//             {/* Preview Section */}
//             {previewUrl && (
//               <div className={styles.previewSection}>
//                 <img src={previewUrl} alt="Preview" className={styles.previewImage} />
//                 <div className={styles.fileInfo}>
//                   <span className={styles.fileName}>{file?.name}</span>
//                   <span className={styles.fileSize}>{formatBytes(file?.size || 0)}</span>
//                 </div>
//               </div>
//             )}

//             {/* Settings Card */}
//             <div className={styles.settingsCard}>
//               <div className={styles.cardHeader}>
//                 <span className={styles.cardIcon}>⚙️</span>
//                 <h3>Compression Settings</h3>
//               </div>

//               {/* Target Size Slider */}
//               <div className={styles.inputGroup}>
//                 <label>
//                   Target Size
//                   <span className={styles.labelValue}>{targetKB} KB</span>
//                 </label>
//                 <div className={styles.rangeSlider}>
//                   <input
//                     type="range"
//                     className={styles.slider}
//                     min="10"
//                     max="1000"
//                     step="10"
//                     value={targetKB}
//                     onChange={(e) => setTargetKB(Number(e.target.value))}
//                   />
//                   <div className={styles.rangeValues}>
//                     <span>10 KB</span>
//                     <span>250 KB</span>
//                     <span>500 KB</span>
//                     <span>750 KB</span>
//                     <span>1000 KB</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Format Selection */}
//               <div className={styles.inputGroup}>
//                 <label>Output Format</label>
//                 <div className={styles.formatGrid}>
//                   {formatOptions.map((opt) => (
//                     <div
//                       key={opt.value}
//                       className={`${styles.formatCard} ${format === opt.value ? styles.active : ''}`}
//                       onClick={() => setFormat(opt.value)}
//                     >
//                       <span className={styles.formatIcon}>{opt.icon}</span>
//                       <span className={styles.formatName}>{opt.label}</span>
//                       <span className={styles.formatDesc}>{opt.description}</span>
//                       <span className={styles.qualityBadge}>{opt.quality}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Compression Mode */}
//               <div className={styles.inputGroup}>
//                 <label>Compression Mode</label>
//                 <div className={styles.modeGrid}>
//                   {modeOptions.map((opt) => (
//                     <div
//                       key={opt.value}
//                       className={`${styles.modeCard} ${mode === opt.value ? styles.active : ''}`}
//                       onClick={() => setMode(opt.value)}
//                     >
//                       <span className={styles.modeIcon}>{opt.icon}</span>
//                       <div>
//                         <div className={styles.modeName}>{opt.label}</div>
//                         <div className={styles.modeDesc}>{opt.description}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Keep Metadata Checkbox */}
//               <div className={styles.inputGroup}>
//                 <label className={styles.checkboxGroup}>
//                   <input
//                     type="checkbox"
//                     checked={keepMetadata}
//                     onChange={(e) => setKeepMetadata(e.target.checked)}
//                   />
//                   <span>Keep Metadata (EXIF, GPS, etc.)</span>
//                 </label>
//               </div>

//               {/* Progress Bar */}
//               {isCompressing && (
//                 <div className={styles.progressBar}>
//                   <div 
//                     className={styles.progressFill} 
//                     style={{ width: `${progress}%` }}
//                   ></div>
//                   <span className={styles.progressText}>{progress}%</span>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className={styles.actionButtons}>
//                 <button 
//                   className={styles.compressBtn} 
//                   onClick={compressImage}
//                   disabled={!file || isCompressing}
//                 >
//                   {isCompressing ? '⏳ Compressing...' : '🔥 Compress Image'}
//                 </button>
//                 <button className={styles.resetBtn} onClick={resetAll}>
//                   🗑️ Reset
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Results */}
//           <div className={styles.resultsColumn}>
//             {result ? (
//               <>
//                 {/* Stats Grid */}
//                 <div className={styles.statsGrid}>
//                   <div className={styles.statCard}>
//                     <div className={styles.statIcon}>📊</div>
//                     <div className={styles.statValue}>{result.compressionRatio.toFixed(1)}%</div>
//                     <div className={styles.statLabel}>Compression Ratio</div>
//                   </div>
//                   <div className={styles.statCard}>
//                     <div className={styles.statIcon}>📦</div>
//                     <div className={styles.statValue}>{formatBytes(result.compressedSize)}</div>
//                     <div className={styles.statLabel}>Compressed Size</div>
//                   </div>
//                   <div className={styles.statCard}>
//                     <div className={styles.statIcon}>💾</div>
//                     <div className={styles.statValue}>-{((1 - result.compressedSize / result.originalSize) * 100).toFixed(1)}%</div>
//                     <div className={styles.statLabel}>Size Reduction</div>
//                   </div>
//                   <div className={styles.statCard}>
//                     <div className={styles.statIcon}>📐</div>
//                     <div className={styles.statValue}>{result.dimensions.width}×{result.dimensions.height}</div>
//                     <div className={styles.statLabel}>Dimensions</div>
//                   </div>
//                 </div>

//                 {/* Result Image */}
//                 <div className={styles.resultCard}>
//                   <img src={result.url} alt="Compressed" className={styles.resultImage} />
//                   <div className={styles.resultDetails}>
//                     <span className={styles.compressionBadge}>
//                       Saved {formatBytes(result.originalSize - result.compressedSize)}
//                     </span>
//                     <button className={styles.downloadBtn} onClick={downloadImage}>
//                       ⬇️ Download {result.format}
//                     </button>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className={styles.emptyState}>
//                 <div className={styles.emptyIcon}>🖼️</div>
//                 <h3>No Image Compressed Yet</h3>
//                 <p>Upload an image and adjust settings to see results</p>
//               </div>
//             )}

//             {/* Tips Section */}
//             <div className={styles.tipsSection}>
//               <div className={styles.tipsHeader}>
//                 <span>💡</span>
//                 <h3>Pro Tips</h3>
//               </div>
//               <div className={styles.tipsGrid}>
//                 <div className={styles.tipCard}>
//                   <div className={styles.tipIcon}>🎯</div>
//                   <div className={styles.tipContent}>
//                     <h4>Target Size</h4>
//                     <p>Set exact KB target for precise control</p>
//                   </div>
//                 </div>
//                 <div className={styles.tipCard}>
//                   <div className={styles.tipIcon}>🔄</div>
//                   <div className={styles.tipContent}>
//                     <h4>Format Selection</h4>
//                     <p>WebP/AVIF gives better compression than JPEG</p>
//                   </div>
//                 </div>
//                 <div className={styles.tipCard}>
//                   <div className={styles.tipIcon}>⚡</div>
//                   <div className={styles.tipContent}>
//                     <h4>Mode Selection</h4>
//                     <p>Use "High Quality" for photos, "Smallest" for web</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageCompressor;












'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
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

  const compressImage = async () => {
    if (!file) return;

    setIsCompressing(true);
    setError(null);
    setProgress(10);

    const formData = new FormData();
    formData.append("file", file);
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

      // Get compressed image blob
      const compressedBlob = await response.blob();
      
      // Get sizes from headers (if available)
      let originalSize = file.size;
      let compressedSize = compressedBlob.size;
      
      // Try to get sizes from headers
      const originalSizeHeader = response.headers.get('X-Original-Size');
      const compressedSizeHeader = response.headers.get('X-Compressed-Size');
      
      if (originalSizeHeader) {
        originalSize = parseInt(originalSizeHeader);
      }
      if (compressedSizeHeader) {
        compressedSize = parseInt(compressedSizeHeader);
      }
      
      const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
      
      const compressedUrl = URL.createObjectURL(compressedBlob);
      
      // Get dimensions from the compressed image
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = () => {
          resolve(null);
        };
        img.onerror = () => {
          reject(new Error("Failed to load compressed image"));
        };
        img.src = compressedUrl;
      });

      setProgress(100);

      setResult({
        url: compressedUrl,
        originalSize,
        compressedSize,
        compressionRatio: Math.max(0, Math.min(100, compressionRatio)), // Clamp between 0-100
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
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}>🔥 Smart Compression</div>
        <h1 className={styles.heroTitle}>Image Compressor</h1>
        <p className={styles.heroSubtitle}>
          Compress images to exact file sizes while preserving quality
        </p>
      </div>

      <div className={styles.main}>
        <div className={styles.twoColumnLayout}>
          {/* Left Column - Upload & Settings */}
          <div className={styles.inputColumn}>
            {/* Upload Area */}
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

            {/* Error Message */}
            {error && (
              <div className={styles.errorMessage}>
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}

            {/* Preview Section */}
            {previewUrl && (
              <div className={styles.previewSection}>
                <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{file?.name}</span>
                  <span className={styles.fileSize}>{formatBytes(file?.size || 0)}</span>
                </div>
              </div>
            )}

            {/* Settings Card */}
            <div className={styles.settingsCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>⚙️</span>
                <h3>Compression Settings</h3>
              </div>

              {/* Target Size Slider */}
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

              {/* Format Selection */}
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

              {/* Compression Mode */}
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

              {/* Keep Metadata Checkbox */}
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

              {/* Progress Bar */}
              {isCompressing && (
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${progress}%` }}
                  ></div>
                  <span className={styles.progressText}>{progress}%</span>
                </div>
              )}

              {/* Action Buttons */}
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

          {/* Right Column - Results */}
          <div className={styles.resultsColumn}>
            {result ? (
              <>
                {/* Stats Grid */}
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

                {/* Result Image */}
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

            {/* Tips Section */}
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