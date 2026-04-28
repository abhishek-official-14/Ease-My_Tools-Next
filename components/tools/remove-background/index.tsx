"use client";

import React, { useState, useRef, useCallback } from 'react';
import styles from './styles.module.css';

const t = (key: string, fallback?: string): string => fallback ?? key;

const RemoveBackground = () => {
  const API_BASE_URL = 'http://localhost:8000';
  const API = {
    cutout: `${API_BASE_URL}/cutout`,
    background: `${API_BASE_URL}/background`,
    effects: `${API_BASE_URL}/effects`,
    adjust: `${API_BASE_URL}/adjust`,
    design: `${API_BASE_URL}/design`,
  };

  const [file, setFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState('');
  const [processedImage, setProcessedImage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('cutout');

  // Background states
  const [bgMode, setBgMode] = useState('transparent');
  const [bgColor, setBgColor] = useState('#3B82F6');
  const [bgPhotoFile, setBgPhotoFile] = useState<File | null>(null);

  // Effects state
  const [effectType, setEffectType] = useState('blur');
  const [effectIntensity, setEffectIntensity] = useState(50);

  // Adjust states
  const [adjustSettings, setAdjustSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    rotate: 0,
  });

  // Design states
  const [designText, setDesignText] = useState('');
  const [designColor, setDesignColor] = useState('#000000');
  const [designFontSize, setDesignFontSize] = useState(24);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bgFileInputRef = useRef<HTMLInputElement | null>(null);

  // Color options for background
  const colorOptions = [
    { value: '#3B82F6', name: 'Blue' },
    { value: '#EF4444', name: 'Red' },
    { value: '#10B981', name: 'Green' },
    { value: '#F59E0B', name: 'Amber' },
    { value: '#8B5CF6', name: 'Purple' },
    { value: '#EC4899', name: 'Pink' },
    { value: '#000000', name: 'Black' },
    { value: '#FFFFFF', name: 'White' },
    { value: '#6B7280', name: 'Gray' },
  ];

  // Effect options
  const effectOptions = [
    { value: 'blur', name: 'Blur', icon: '🔍' },
    { value: 'grayscale', name: 'B&W', icon: '⚫' },
    { value: 'sepia', name: 'Sepia', icon: '🟤' },
    { value: 'vibrant', name: 'Vibrant', icon: '🌈' },
    { value: 'sharpen', name: 'Sharpen', icon: '✨' },
    { value: 'contour', name: 'Contour', icon: '📐' },
  ];

  // Handle file upload
  const handleFileUpload = useCallback((uploadedFile: File) => {
    if (!uploadedFile) return;

    if (uploadedFile.size > 10 * 1024 * 1024) {
      alert("File is too large. Maximum size is 10MB");
      return;
    }

    if (!uploadedFile.type.startsWith('image/')) {
      alert("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result !== "string") return;
      setOriginalImage(result);
      setProcessedImage('');
      setFile(uploadedFile);
    };
    reader.readAsDataURL(uploadedFile);
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile) handleFileUpload(uploadedFile);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  // API call handler
  const sendToApi = async (url: string, formData: FormData) => {
    setProcessing(true);
    try {
      const resp = await fetch(url, { method: 'POST', body: formData });
      if (!resp.ok) throw new Error("Failed to process image");
      const blob = await resp.blob();
      setProcessedImage(URL.createObjectURL(blob));
    } catch (e: any) {
      alert(e.message);
    }
    setProcessing(false);
  };

  // Feature handlers
  const runCutout = async () => {
    if (!file) {
      alert(t('uploadFirst'));
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    await sendToApi(API.cutout, formData);
  };

  const runBackground = async () => {
    if (!file) {
      alert(t('uploadFirst'));
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bg_mode', bgMode);
    if (bgMode === 'color') {
      formData.append('bg_color', bgColor);
    }
    if (bgMode === 'photo' && bgPhotoFile) {
      formData.append('bg_image', bgPhotoFile);
    }
    await sendToApi(API.background, formData);
  };

  const runEffects = async () => {
    const sourceImage = processedImage || originalImage;
    if (!sourceImage) {
      alert(t('noImageToProcess'));
      return;
    }
    const inputFile = await fetch(sourceImage).then(r => r.blob());
    const formData = new FormData();
    formData.append('file', new File([inputFile], 'image.png', { type: inputFile.type }));
    formData.append('effect_type', effectType);
    formData.append('intensity', String(effectIntensity));
    await sendToApi(API.effects, formData);
  };

  const runAdjust = async () => {
    const sourceImage = processedImage || originalImage;
    if (!sourceImage) {
      alert(t('noImageToProcess'));
      return;
    }
    const inputFile = await fetch(sourceImage).then(r => r.blob());
    const formData = new FormData();
    formData.append('file', new File([inputFile], 'image.png', { type: inputFile.type }));
    Object.entries(adjustSettings).forEach(([k, v]) => formData.append(k, String(v)));
    await sendToApi(API.adjust, formData);
  };

  const runDesign = async () => {
    const sourceImage = processedImage || originalImage;
    if (!sourceImage) {
      alert(t('noImageToProcess'));
      return;
    }
    if (!designText.trim()) {
      alert(t('enterText'));
      return;
    }
    const inputFile = await fetch(sourceImage).then(r => r.blob());
    const formData = new FormData();
    formData.append('file', new File([inputFile], 'image.png', { type: inputFile.type }));
    formData.append('text', designText);
    formData.append('text_color', designColor);
    formData.append('font_size', String(designFontSize));
    await sendToApi(API.design, formData);
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = `processed-image-${Date.now()}.png`;
    link.href = processedImage;
    link.click();
  };

  const clearAll = () => {
    setFile(null);
    setOriginalImage('');
    setProcessedImage('');
    setBgMode('transparent');
    setBgColor('#3B82F6');
    setBgPhotoFile(null);
    setEffectType('blur');
    setEffectIntensity(50);
    setAdjustSettings({ brightness: 100, contrast: 100, saturation: 100, rotate: 0 });
    setDesignText('');
    setDesignColor('#000000');
    setDesignFontSize(24);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (bgFileInputRef.current) bgFileInputRef.current.value = '';
  };

  const handleBgImageUpload = (uploadedFile: File) => {
    if (!uploadedFile) return;
    if (!uploadedFile.type.startsWith('image/')) {
      alert("Please upload a valid image file");
      return;
    }
    setBgPhotoFile(uploadedFile);
    setBgMode('photo');
  };

  return (
    <div className={styles["remove-background-layout"]}>
      {/* Top Toolbar */}
      <div className={styles["top-toolbar"]}>
        <div className={styles["left-tools"]}>
          <button
            className={`${styles["tool-btn"]} ${activeTab === 'cutout' ? styles["active"] : ""}`}
            onClick={() => setActiveTab('cutout')}
            disabled={processing}
          >
            🎯 {t('cutout')}
          </button>
          <button
            className={`${styles["tool-btn"]} ${activeTab === 'background' ? styles["active"] : ""}`}
            onClick={() => setActiveTab('background')}
            disabled={processing}
          >
            🎨 {t('background')}
          </button>
          <button
            className={`${styles["tool-btn"]} ${activeTab === 'effects' ? styles["active"] : ""}`}
            onClick={() => setActiveTab('effects')}
            disabled={processing}
          >
            ✨ {t('effects')}
          </button>
          <button
            className={`${styles["tool-btn"]} ${activeTab === 'adjust' ? styles["active"] : ""}`}
            onClick={() => setActiveTab('adjust')}
            disabled={processing}
          >
            ⚙️ {t('adjust')}
          </button>
          <button
            className={`${styles["tool-btn"]} ${activeTab === 'design' ? styles["active"] : ""}`}
            onClick={() => setActiveTab('design')}
            disabled={processing}
          >
            🖋️ {t('design')}
          </button>
        </div>

        <div className={styles["right-actions"]}>
          {processedImage && (
            <button className={styles["download-main"]} onClick={downloadImage} disabled={processing}>
              ⬇️ {"Download"}
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles["remover-grid"]}>
        {/* Left Panel - Preview */}
        <div className={styles["left-panel"]}>
          <div
            className={`${styles["upload-area"]} ${styles["large"]}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            {!originalImage ? (
              <div className={styles["upload-placeholder"]}>
                <div className={styles["upload-icon"]}>🖼️</div>
                <h3>{"Upload Image"}</h3>
                <p className={styles["muted"]}>{"Drag & drop your image here or click to browse"}</p>
                <small className={styles["muted"]}>{"Supported formats: PNG, JPG, JPEG, WebP"}</small>
                <small className={styles["muted"]}>{"Max file size: 10MB"}</small>
              </div>
            ) : (
              <div className={styles["preview-canvas-wrapper"]}>
                <div className={`${styles["result-surface"]} ${bgMode === 'transparent' ? 'checker' : ''}`}>
                  <img
                    src={processedImage || originalImage}
                    alt="Preview"
                    className={`${styles["preview-image"]} ${styles["center-image"]}`}
                  />
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) handleFileUpload(selectedFile);
              }}
              style={{ display: 'none' }}
            />
          </div>

          {/* Thumbnail Strip */}
          {file && (
            <div className={styles["thumb-strip"]}>
              <div className={`${styles["thumb"]} ${styles["plus"]}`} onClick={() => fileInputRef.current?.click()}>
                +
              </div>
              <div className={styles["thumb"]}>
                <img src={originalImage} alt="Original" />
              </div>
              {processedImage && (
                <div className={styles["thumb"]}>
                  <img src={processedImage} alt="Processed" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Controls */}
        <div className={styles["right-panel"]}>
          {/* Tabs */}
          <div className={styles["tabs"]}>
            {['cutout', 'background', 'effects', 'adjust', 'design'].map((tab) => (
              <button
                key={tab}
                className={`${styles["tab"]} ${activeTab === tab ? styles["active"] : ""}`}
                onClick={() => setActiveTab(tab)}
                disabled={processing}
              >
                {t(tab)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={styles["tab-body"]}>
            {/* Cutout Tab */}
            {activeTab === 'cutout' && (
              <div className={styles["feature-content"]}>
                <h4>🎯 {"Remove Background"}</h4>
                <p className={styles["muted"]}>{t('cutoutDescription')}</p>
                <button
                  onClick={runCutout}
                  className={`${styles["primary-btn"]} ${styles["full-width"]}`}
                  disabled={processing || !file}
                >
                  {processing ? "Processing..." : "Remove Background"}
                </button>
              </div>
            )}

            {/* Background Tab */}
            {activeTab === 'background' && (
              <div className={styles["feature-content"]}>
                <h4>🎨 {t('background')}</h4>

                <div className={styles["option-group"]}>
                  <label>{t('backgroundType')}</label>
                  <div className={styles["bg-type-buttons"]}>
                    <button
                      className={`${styles["bg-type-btn"]} ${bgMode === 'transparent' ? styles["active"] : ""}`}
                      onClick={() => setBgMode('transparent')}
                    >
                      Transparent
                    </button>
                    <button
                      className={`${styles["bg-type-btn"]} ${bgMode === 'color' ? styles["active"] : ""}`}
                      onClick={() => setBgMode('color')}
                    >
                      Color
                    </button>
                    <button
                      className={`${styles["bg-type-btn"]} ${bgMode === 'photo' ? styles["active"] : ""}`}
                      onClick={() => setBgMode('photo')}
                    >
                      Photo
                    </button>
                  </div>
                </div>

                {bgMode === 'color' && (
                  <div className={styles["option-group"]}>
                    <label>{t('selectColor')}</label>
                    <div className={styles["color-grid"]}>
                      {colorOptions.map((color) => (
                        <div
                          key={color.value}
                          className={`${styles["color-swatch"]} ${bgColor === color.value ? 'selected' : ''}`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setBgColor(color.value)}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {bgMode === 'photo' && (
                  <div className={styles["option-group"]}>
                    <label>{t('uploadBackground')}</label>
                    <div
                      className={styles["bg-upload-area"]}
                      onClick={() => bgFileInputRef.current?.click()}
                    >
                      <div className={styles["upload-content"]}>
                        <div className={styles["upload-icon"]}>📁</div>
                        <p>{t('uploadBgImage')}</p>
                      </div>
                      <input
                        ref={bgFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const uploaded = e.target.files?.[0];
                          if (uploaded) handleBgImageUpload(uploaded);
                        }}
                        style={{ display: 'none' }}
                      />
                    </div>
                    {bgPhotoFile && (
                      <div className={styles["file-info-small"]}>
                        ✅ {bgPhotoFile.name}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={runBackground}
                  className={`${styles["primary-btn"]} ${styles["full-width"]}`}
                  disabled={processing || !file}
                >
                  {t('applyBackground')}
                </button>
              </div>
            )}

            {/* Effects Tab */}
            {activeTab === 'effects' && (
              <div className={styles["feature-content"]}>
                <h4>✨ {t('effects')}</h4>

                <div className={styles["option-group"]}>
                  <label>{t('selectEffect')}</label>
                  <div className={styles["effects-grid"]}>
                    {effectOptions.map((effect) => (
                      <div
                        key={effect.value}
                        className={`${styles["effect-option"]} ${effectType === effect.value ? 'selected' : ''}`}
                        onClick={() => setEffectType(effect.value)}
                      >
                        <span className={styles["effect-icon"]}>{effect.icon}</span>
                        <span className={styles["effect-name"]}>{effect.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles["option-group"]}>
                  <label>
                    {t('intensity')}: {effectIntensity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={effectIntensity}
                    onChange={(e) => setEffectIntensity(parseInt(e.target.value))}
                    className={styles["slider"]}
                  />
                </div>

                <button
                  onClick={runEffects}
                  className={`${styles["primary-btn"]} ${styles["full-width"]}`}
                  disabled={processing || !file}
                >
                  {t('applyEffect')}
                </button>
              </div>
            )}

            {/* Adjust Tab */}
            {activeTab === 'adjust' && (
              <div className={styles["feature-content"]}>
                <h4>⚙️ {t('adjust')}</h4>

                {(['brightness', 'contrast', 'saturation'] as const).map((setting) => (
                  <div key={setting} className={styles["option-group"]}>
                    <label>
                      {t(setting)}: {adjustSettings[setting]}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={adjustSettings[setting]}
                      onChange={(e) => setAdjustSettings(prev => ({
                        ...prev,
                        [setting]: parseInt(e.target.value)
                      }))}
                      className={styles["slider"]}
                    />
                  </div>
                ))}

                <div className={styles["option-group"]}>
                  <label>
                    {t('rotate')}: {adjustSettings.rotate}°
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={adjustSettings.rotate}
                    onChange={(e) => setAdjustSettings(prev => ({
                      ...prev,
                      rotate: parseInt(e.target.value)
                    }))}
                    className={styles["slider"]}
                  />
                </div>

                <button
                  onClick={runAdjust}
                  className={`${styles["primary-btn"]} ${styles["full-width"]}`}
                  disabled={processing || !file}
                >
                  {t('applyAdjustments')}
                </button>
              </div>
            )}

            {/* Design Tab */}
            {activeTab === 'design' && (
              <div className={styles["feature-content"]}>
                <h4>🖋️ {t('design')}</h4>

                <div className={styles["option-group"]}>
                  <label>{t('text')}</label>
                  <input
                    type="text"
                    value={designText}
                    onChange={(e) => setDesignText(e.target.value)}
                    placeholder={t('enterTextHere')}
                    className={styles["text-input"]}
                  />
                </div>

                <div className={styles["option-group"]}>
                  <label>{t('textColor')}</label>
                  <div className={styles["color-picker-row"]}>
                    <input
                      type="color"
                      value={designColor}
                      onChange={(e) => setDesignColor(e.target.value)}
                      className={styles["color-picker"]}
                    />
                    <span className={styles["color-value"]}>{designColor}</span>
                  </div>
                </div>

                <div className={styles["option-group"]}>
                  <label>
                    {t('fontSize')}: {designFontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="72"
                    value={designFontSize}
                    onChange={(e) => setDesignFontSize(parseInt(e.target.value))}
                    className={styles["slider"]}
                  />
                </div>

                <button
                  onClick={runDesign}
                  className={`${styles["primary-btn"]} ${styles["full-width"]}`}
                  disabled={processing || !file || !designText.trim()}
                >
                  {t('addText')}
                </button>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className={styles["right-actions-2"]}>
            {file && (
              <div className={styles["file-meta"]}>
                <strong>📄 {file.name}</strong>
                <div className={styles["meta-small"]}>
                  Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            )}

            <div className={styles["action-buttons-vertical"]}>
              <button onClick={clearAll} className={styles["secondary-btn"]} disabled={processing}>
                {t('clearAll')}
              </button>
            </div>

            <div className={styles["status-row"]}>
              <div className={`${styles["status-dot"]} ${processing ? 'processing' : 'ready'}`}></div>
              <small className={styles["muted"]}>
                {processing ? t('aiProcessing') : t('apiReady')}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;