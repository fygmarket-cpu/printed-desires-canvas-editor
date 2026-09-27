import React, { useState, useMemo } from 'react';
import {
  CanvasCustomization,
  FilterPresetId,
  TextLayer,
  ImageTransform,
  CanvasAdjustments,
  EdgeWrapStyle,
} from '../types/canvas';

import {
  FILTER_PRESETS,
  AVAILABLE_FONTS,
  WRAP_STYLES,
} from '../data/canvasPresets';

import {
  getCombinedFilterStyle,
  calculateQuality,
} from '../utils/canvasHelpers';

import {
  Crop,
  Sliders,
  Type,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  X,
  ShieldCheck,
  Palette,
  Sparkles,
  Layers,
} from 'lucide-react';

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  customization: CanvasCustomization;
  onSave: (updated: Partial<CanvasCustomization>) => void;
}

type EditorTab = 'crop' | 'filters' | 'text' | 'wrap';

export const EditorModal: React.FC<EditorModalProps> = ({
  isOpen,
  onClose,
  customization,
  onSave,
}) => {
  // ============================================================
  // LOCAL WORKING COPY
  // ============================================================

  const [activeTab, setActiveTab] =
    useState<EditorTab>('crop');

  const [transform, setTransform] =
    useState<ImageTransform>({
      ...customization.transform,
    });

  const [filter, setFilter] =
    useState<FilterPresetId>(
      customization.filter
    );

  const [adjustments, setAdjustments] =
    useState<CanvasAdjustments>({
      ...customization.adjustments,
    });

  const [textLayers, setTextLayers] =
    useState<TextLayer[]>([
      ...customization.textLayers,
    ]);

  const [wrapStyle, setWrapStyle] =
    useState<EdgeWrapStyle>(
      customization.wrapStyle
    );

  const [customWrapColor, setCustomWrapColor] =
    useState<string>(
      customization.customWrapColor || '#ffffff'
    );

  const [selectedTextId, setSelectedTextId] =
    useState<string | null>(
      customization.textLayers.length > 0
        ? customization.textLayers[0].id
        : null
    );

  // ============================================================
  // QUALITY ANALYSIS
  // ============================================================

  const quality = useMemo(() => {
    return calculateQuality(
      customization.size.widthCm,
      customization.size.heightCm,
      customization.imageDimensions?.width || 3200,
      customization.imageDimensions?.height || 4200
    );
  }, [
    customization.size,
    customization.imageDimensions,
  ]);

  // ============================================================
  // COMBINED FILTER STYLE
  // ============================================================

  const filterStyle = useMemo(() => {
    return getCombinedFilterStyle(
      filter,
      adjustments
    );
  }, [filter, adjustments]);

  // ============================================================
  // ASPECT RATIO
  // ============================================================

  const {
    widthCm,
    heightCm,
  } = customization.size;

  const aspectRatio =
    widthCm / heightCm;

  // ============================================================
  // ADD TEXT LAYER
  // ============================================================

  const handleAddTextLayer = () => {
    const newLayer: TextLayer = {
      id: `text-${Date.now()}`,
      text: 'Tu texto aquí',
      font: 'Playfair Display',
      fontSize: 28,
      color: '#ffffff',
      isBold: false,
      isItalic: false,
      align: 'center',
      x: 50,
      y: 85,
      hasShadow: true,
    };

    setTextLayers((prev) => [
      ...prev,
      newLayer,
    ]);

    setSelectedTextId(
      newLayer.id
    );
  };

  // ============================================================
  // UPDATE ACTIVE TEXT
  // ============================================================

  const handleUpdateActiveText = (
    partial: Partial<TextLayer>
  ) => {
    if (!selectedTextId) return;

    setTextLayers((prev) =>
      prev.map((textLayer) =>
        textLayer.id === selectedTextId
          ? {
              ...textLayer,
              ...partial,
            }
          : textLayer
      )
    );
  };

  // ============================================================
  // DELETE TEXT LAYER
  // ============================================================

  const handleDeleteTextLayer = (
    id: string
  ) => {
    setTextLayers((prev) =>
      prev.filter(
        (layer) => layer.id !== id
      )
    );

    if (selectedTextId === id) {
      setSelectedTextId(null);
    }
  };

  // ============================================================
  // RESET CROP / TRANSFORM
  // ============================================================

  const handleResetCrop = () => {
    setTransform({
      zoom: 1,
      panX: 0,
      panY: 0,
      rotateAngle: 0,
      flipH: false,
      flipV: false,
    });
  };

  // ============================================================
  // RESET FILTERS
  // ============================================================

  const handleResetFilters = () => {
    setFilter('none');

    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      temperature: 0,
      vignette: 0,
      blur: 0,
    });
  };

  // ============================================================
  // SAVE CHANGES
  // ============================================================

  const handleApply = () => {
    onSave({
      transform,
      filter,
      adjustments,
      textLayers,
      wrapStyle,
      customWrapColor,
    });

    onClose();
  };

  // ============================================================
  // ACTIVE TEXT LAYER
  // ============================================================

  const activeTextLayer =
    textLayers.find(
      (layer) =>
        layer.id === selectedTextId
    );

  // ============================================================
  // IMPORTANT:
  // ALL HOOKS ARE ABOVE THIS POINT
  // ============================================================

  if (!isOpen) {
    return null;
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/75
        backdrop-blur-sm
        animate-fade-in
        p-0
        sm:p-2
        md:p-4
      "
    >

      {/* ======================================================
          EDITOR CONTAINER
      ====================================================== */}

      <div
        className="
          bg-white
          w-full
          h-full
          sm:h-[96vh]
          md:h-[94vh]
          max-w-7xl
          sm:rounded-2xl
          shadow-2xl
          flex
          flex-col
          overflow-hidden
          border
          border-neutral-200
        "
      >

        {/* ====================================================
            TOP HEADER
        ==================================================== */}

        <div
          className="
            shrink-0
            px-3
            sm:px-5
            md:px-6
            py-3
            sm:py-3.5
            border-b
            border-neutral-200
            flex
            items-center
            justify-between
            gap-3
            bg-neutral-50/80
          "
        >

          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">

            <div
              className="
                p-1.5
                sm:p-2
                rounded-lg
                bg-[#B99A62]/10
                text-[#B99A62]
                shrink-0
              "
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="min-w-0">

              <h2
                className="
                  text-sm
                  sm:text-base
                  md:text-lg
                  font-bold
                  text-neutral-900
                  leading-tight
                  truncate
                "
              >
                Taller de Personalización de Lienzo
              </h2>

              <p
                className="
                  text-[10px]
                  sm:text-xs
                  text-neutral-500
                  truncate
                "
              >
                Lienzo seleccionado:{' '}
                <strong>
                  {customization.size.label}
                </strong>{' '}
                · {quality.dpi} DPI estimada
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 shrink-0">

            <button
              onClick={onClose}
              className="
                p-2
                text-neutral-500
                hover:text-neutral-900
                rounded-lg
                hover:bg-neutral-200
                transition-colors
              "
              title="Cerrar sin guardar"
              aria-label="Cerrar editor"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

        </div>

        {/* ====================================================
            TAB NAVIGATION
        ==================================================== */}

        <div
          className="
            shrink-0
            flex
            items-center
            border-b
            border-neutral-200
            bg-white
            px-2
            sm:px-4
            md:px-6
            gap-1
            sm:gap-2
            overflow-x-auto
            no-scrollbar
          "
        >

          {[
            {
              id: 'crop',
              label: '1. Recortar & Encuadre',
              icon: Crop,
            },
            {
              id: 'filters',
              label: '2. Filtros & Retoque',
              icon: Sliders,
            },
            {
              id: 'text',
              label: '3. Añadir Texto',
              icon: Type,
            },
            {
              id: 'wrap',
              label: '4. Borde del Bastidor',
              icon: Layers,
            },
          ].map((tab) => {

            const Icon = tab.icon;

            const isActive =
              activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as EditorTab
                  )
                }
                className={`
                  py-2.5
                  sm:py-3
                  px-2.5
                  sm:px-3
                  text-[11px]
                  sm:text-xs
                  md:text-sm
                  font-semibold
                  flex
                  items-center
                  gap-1.5
                  sm:gap-2
                  border-b-2
                  transition-all
                  whitespace-nowrap
                  shrink-0
                  ${
                    isActive
                      ? 'border-[#B99A62] text-[#B99A62]'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                  }
                `}
              >

                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

                <span>
                  {tab.label}
                </span>

              </button>
            );
          })}

        </div>

        {/* ====================================================
            MAIN WORK AREA
        ==================================================== */}

        <div
          className="
            flex-1
            min-h-0
            grid
            grid-cols-1
            lg:grid-cols-12
            overflow-hidden
            bg-neutral-100
          "
        >

          {/* ==================================================
              LEFT — LIVE VIEWER
          ================================================== */}

          <div
            className="
              lg:col-span-7
              min-h-0
              p-3
              sm:p-5
              md:p-6
              flex
              flex-col
              items-center
              justify-center
              relative
              overflow-hidden
              bg-[#dedad2]
              canvas-texture
              border-b
              lg:border-b-0
              lg:border-r
              border-neutral-300
            "
          >

            {/* =================================================
                CANVAS PREVIEW
            ================================================= */}

            <div
              className="
                w-full
                flex
                items-center
                justify-center
                min-h-0
                flex-1
              "
            >

              <div
                className="
                  relative
                  shadow-2xl
                  overflow-hidden
                  border-2
                  sm:border-4
                  border-white
                  bg-neutral-900
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-150
                  max-w-full
                  max-h-full
                "
                style={{
                  width:
                    aspectRatio >= 1
                      ? 'min(94%, 900px)'
                      : `min(${Math.max(
                          55,
                          Math.round(
                            88 * aspectRatio
                          )
                        )}%, 900px)`,

                  maxHeight:
                    'min(62vh, 650px)',

                  aspectRatio:
                    `${widthCm} / ${heightCm}`,
                }}
              >

                {/* ==========================================
                    IMAGE
                ========================================== */}

                <div
                  className="
                    w-full
                    h-full
                    relative
                    overflow-hidden
                  "
                >

                  <img
                    src={
                      customization.selectedImage
                    }
                    alt="Vista previa lienzo"
                    className="
                      w-full
                      h-full
                      object-cover
                      origin-center
                      select-none
                      pointer-events-none
                    "
                    draggable={false}
                    style={{
                      filter:
                        filterStyle,

                      transform:
                        `scale(${transform.zoom}) translate(${transform.panX}%, ${transform.panY}%) rotate(${transform.rotateAngle}deg) scaleX(${transform.flipH ? -1 : 1}) scaleY(${transform.flipV ? -1 : 1})`,
                    }}
                  />

                  {/* ========================================
                      VIGNETTE
                  ======================================== */}

                  {adjustments.vignette > 0 && (
                    <div
                      className="
                        absolute
                        inset-0
                        pointer-events-none
                      "
                      style={{
                        boxShadow:
                          `inset 0 0 ${adjustments.vignette * 1.6}px rgba(0,0,0,${
                            (adjustments.vignette /
                              100) *
                            0.75
                          })`,
                      }}
                    />
                  )}

                  {/* ========================================
                      CROP GRID
                  ======================================== */}

                  {activeTab === 'crop' && (
                    <div
                      className="
                        absolute
                        inset-0
                        grid
                        grid-cols-3
                        grid-rows-3
                        pointer-events-none
                        border
                        border-white/40
                      "
                    >

                      <div className="border-r border-b border-white/30" />
                      <div className="border-r border-b border-white/30" />
                      <div className="border-b border-white/30" />

                      <div className="border-r border-b border-white/30" />
                      <div className="border-r border-b border-white/30" />
                      <div className="border-b border-white/30" />

                      <div className="border-r border-white/30" />
                      <div className="border-r border-white/30" />
                      <div />

                      {/* SAFE BLEED ZONE */}

                      <div
                        className="
                          absolute
                          inset-2
                          border
                          border-dashed
                          border-rose-400/80
                          pointer-events-none
                          flex
                          items-start
                          justify-end
                          p-1
                        "
                      >
                        <span
                          className="
                            text-[8px]
                            sm:text-[9px]
                            bg-black/50
                            text-white
                            font-mono
                            px-1
                            rounded
                            whitespace-nowrap
                          "
                        >
                          Zona Segura de Impresión
                        </span>
                      </div>

                    </div>
                  )}

                  {/* ========================================
                      TEXT LAYERS
                  ======================================== */}

                  {textLayers.map(
                    (layer) => {

                      const isSelected =
                        layer.id ===
                        selectedTextId;

                      return (
                        <div
                          key={layer.id}
                          onClick={() =>
                            setSelectedTextId(
                              layer.id
                            )
                          }
                          className={`
                            absolute
                            cursor-pointer
                            transition-all
                            select-none
                            p-1
                            ${
                              isSelected &&
                              activeTab === 'text'
                                ? 'ring-2 ring-dashed ring-[#B99A62] bg-[#B99A62]/10 rounded'
                                : ''
                            }
                          `}
                          style={{
                            left:
                              `${layer.x}%`,

                            top:
                              `${layer.y}%`,

                            transform:
                              'translate(-50%, -50%)',

                            fontFamily:
                              layer.font,

                            fontSize:
                              `clamp(10px, ${layer.fontSize}px, 5vw)`,

                            color:
                              layer.color,

                            fontWeight:
                              layer.isBold
                                ? 700
                                : 400,

                            fontStyle:
                              layer.isItalic
                                ? 'italic'
                                : 'normal',

                            textAlign:
                              layer.align,

                            textShadow:
                              layer.hasShadow
                                ? '2px 2px 6px rgba(0,0,0,0.75)'
                                : 'none',

                            lineHeight:
                              1.15,

                            maxWidth:
                              '90%',
                          }}
                        >
                          {layer.text}
                        </div>
                      );
                    }
                  )}

                </div>

              </div>

            </div>

            {/* =================================================
                QUALITY INDICATOR
            ================================================= */}

            <div
              className="
                mt-2
                sm:mt-3
                shrink-0
                flex
                items-center
                gap-1.5
                sm:gap-2
                bg-white/90
                backdrop-blur-md
                px-2.5
                sm:px-3
                py-1.5
                rounded-full
                border
                border-neutral-200
                text-[10px]
                sm:text-xs
                shadow-sm
                max-w-full
              "
            >

              <ShieldCheck
                className={`
                  w-3.5
                  h-3.5
                  sm:w-4
                  sm:h-4
                  shrink-0
                  ${
                    quality.rating ===
                    'excellent'
                      ? 'text-emerald-600'
                      : quality.rating ===
                        'good'
                      ? 'text-blue-600'
                      : 'text-amber-500'
                  }
                `}
              />

              <span
                className="
                  font-semibold
                  text-neutral-800
                  truncate
                "
              >
                {quality.title}
              </span>

              <span
                className="
                  text-neutral-400
                  font-mono
                  text-[9px]
                  sm:text-[11px]
                  whitespace-nowrap
                "
              >
                ({quality.dpi} DPI)
              </span>

            </div>

          </div>

          {/* ==================================================
              RIGHT — CONTROLS
          ================================================== */}

          <div
            className="
              lg:col-span-5
              min-h-0
              bg-white
              p-3
              sm:p-4
              md:p-5
              overflow-y-auto
              overscroll-contain
            "
          >

            {/* =================================================
                TAB 1 — CROP & TRANSFORM
            ================================================= */}

            {activeTab === 'crop' && (
              <div className="space-y-5">

                <div className="flex items-center justify-between">

                  <h3 className="text-sm font-bold text-neutral-900">
                    Encuadre & Zoom
                  </h3>

                  <button
                    onClick={
                      handleResetCrop
                    }
                    className="
                      text-xs
                      text-[#B99A62]
                      hover:underline
                      flex
                      items-center
                      gap-1
                      font-semibold
                    "
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>
                      Restablecer
                    </span>
                  </button>

                </div>

                {/* ZOOM */}

                <div className="space-y-1.5">

                  <div className="flex items-center justify-between text-xs">

                    <span className="text-neutral-600 font-medium">
                      Zoom / Escala
                    </span>

                    <span className="font-mono font-bold text-neutral-900">
                      {Math.round(
                        transform.zoom *
                          100
                      )}
                      %
                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <ZoomOut className="w-4 h-4 text-neutral-400 shrink-0" />

                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.05"
                      value={
                        transform.zoom
                      }
                      onChange={(e) =>
                        setTransform(
                          (prev) => ({
                            ...prev,
                            zoom: Number(
                              e.target.value
                            ),
                          })
                        )
                      }
                      className="
                        w-full
                        accent-[#B99A62]
                        cursor-pointer
                      "
                    />

                    <ZoomIn className="w-4 h-4 text-neutral-400 shrink-0" />

                  </div>

                </div>

                {/* PAN X */}

                <div className="space-y-1.5">

                  <div className="flex items-center justify-between text-xs gap-2">

                    <span className="text-neutral-600 font-medium">
                      Desplazamiento Horizontal (X)
                    </span>

                    <span className="font-mono font-bold text-neutral-900">
                      {transform.panX}%
                    </span>

                  </div>

                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={
                      transform.panX
                    }
                    onChange={(e) =>
                      setTransform(
                        (prev) => ({
                          ...prev,
                          panX: Number(
                            e.target.value
                          ),
                        })
                      )
                    }
                    className="
                      w-full
                      accent-[#B99A62]
                      cursor-pointer
                    "
                  />

                </div>

                {/* PAN Y */}

                <div className="space-y-1.5">

                  <div className="flex items-center justify-between text-xs gap-2">

                    <span className="text-neutral-600 font-medium">
                      Desplazamiento Vertical (Y)
                    </span>

                    <span className="font-mono font-bold text-neutral-900">
                      {transform.panY}%
                    </span>

                  </div>

                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={
                      transform.panY
                    }
                    onChange={(e) =>
                      setTransform(
                        (prev) => ({
                          ...prev,
                          panY: Number(
                            e.target.value
                          ),
                        })
                      )
                    }
                    className="
                      w-full
                      accent-[#B99A62]
                      cursor-pointer
                    "
                  />

                </div>

                {/* ROTATION */}

                <div
                  className="
                    pt-2
                    border-t
                    border-neutral-100
                    space-y-3
                  "
                >

                  <span className="text-xs font-bold text-neutral-800 block">
                    Rotación & Orientación
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

                    <button
                      onClick={() =>
                        setTransform(
                          (prev) => ({
                            ...prev,
                            rotateAngle:
                              (prev.rotateAngle -
                                90) %
                              360,
                          })
                        )
                      }
                      className="
                        p-2
                        border
                        border-neutral-200
                        rounded-lg
                        hover:bg-neutral-50
                        flex
                        flex-col
                        items-center
                        gap-1
                        text-[11px]
                        font-semibold
                        text-neutral-700
                      "
                    >
                      <RotateCcw className="w-4 h-4 text-[#B99A62]" />
                      <span>-90°</span>
                    </button>

                    <button
                      onClick={() =>
                        setTransform(
                          (prev) => ({
                            ...prev,
                            rotateAngle:
                              (prev.rotateAngle +
                                90) %
                              360,
                          })
                        )
                      }
                      className="
                        p-2
                        border
                        border-neutral-200
                        rounded-lg
                        hover:bg-neutral-50
                        flex
                        flex-col
                        items-center
                        gap-1
                        text-[11px]
                        font-semibold
                        text-neutral-700
                      "
                    >
                      <RotateCw className="w-4 h-4 text-[#B99A62]" />
                      <span>+90°</span>
                    </button>

                    <button
                      onClick={() =>
                        setTransform(
                          (prev) => ({
                            ...prev,
                            flipH:
                              !prev.flipH,
                          })
                        )
                      }
                      className={`
                        p-2
                        border
                        rounded-lg
                        flex
                        flex-col
                        items-center
                        gap-1
                        text-[11px]
                        font-semibold
                        transition-colors
                        ${
                          transform.flipH
                            ? 'border-[#B99A62] bg-[#F8F5F0] text-[#B99A62]'
                            : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                        }
                      `}
                    >
                      <FlipHorizontal className="w-4 h-4" />
                      <span>
                        Voltear H
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        setTransform(
                          (prev) => ({
                            ...prev,
                            flipV:
                              !prev.flipV,
                          })
                        )
                      }
                      className={`
                        p-2
                        border
                        rounded-lg
                        flex
                        flex-col
                        items-center
                        gap-1
                        text-[11px]
                        font-semibold
                        transition-colors
                        ${
                          transform.flipV
                            ? 'border-[#B99A62] bg-[#F8F5F0] text-[#B99A62]'
                            : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                        }
                      `}
                    >
                      <FlipVertical className="w-4 h-4" />
                      <span>
                        Voltear V
                      </span>
                    </button>

                  </div>

                </div>

                {/* FINE ANGLE */}

                <div
                  className="
                    space-y-1.5
                    pt-2
                    border-t
                    border-neutral-100
                  "
                >

                  <div className="flex items-center justify-between text-xs">

                    <span className="text-neutral-600 font-medium">
                      Nivelado Fino (Ángulo)
                    </span>

                    <span className="font-mono font-bold text-neutral-900">
                      {transform.rotateAngle}°
                    </span>

                  </div>

                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={
                      transform.rotateAngle
                    }
                    onChange={(e) =>
                      setTransform(
                        (prev) => ({
                          ...prev,
                          rotateAngle:
                            Number(
                              e.target.value
                            ),
                        })
                      )
                    }
                    className="
                      w-full
                      accent-[#B99A62]
                      cursor-pointer
                    "
                  />

                </div>

              </div>
            )}

            {/* =================================================
                TAB 2 — FILTERS
            ================================================= */}

            {activeTab === 'filters' && (
              <div className="space-y-5">

                <div className="flex items-center justify-between">

                  <h3 className="text-sm font-bold text-neutral-900">
                    Estilos & Filtros Fotográficos
                  </h3>

                  <button
                    onClick={
                      handleResetFilters
                    }
                    className="
                      text-xs
                      text-[#B99A62]
                      hover:underline
                      flex
                      items-center
                      gap-1
                      font-semibold
                    "
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>
                      Restablecer
                    </span>
                  </button>

                </div>

                {/* FILTER PRESETS */}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

                  {FILTER_PRESETS.map(
                    (preset) => {

                      const isSelected =
                        filter ===
                        preset.id;

                      return (
                        <button
                          key={preset.id}
                          onClick={() =>
                            setFilter(
                              preset.id
                            )
                          }
                          className={`
                            p-2
                            rounded-xl
                            border
                            text-left
                            transition-all
                            ${
                              isSelected
                                ? 'border-[#B99A62] ring-2 ring-[#B99A62]/30 bg-[#F8F5F0]/50'
                                : 'border-neutral-200 hover:border-neutral-300 bg-white'
                            }
                          `}
                        >

                          <div className="h-12 w-full rounded-lg overflow-hidden mb-1.5 bg-neutral-200">

                            <img
                              src={
                                customization.selectedImage
                              }
                              alt={
                                preset.name
                              }
                              className="
                                w-full
                                h-full
                                object-cover
                              "
                              style={{
                                filter:
                                  preset.css,
                              }}
                            />

                          </div>

                          <p className="text-[11px] font-bold text-neutral-900 truncate">
                            {preset.name}
                          </p>

                        </button>
                      );
                    }
                  )}

                </div>

                {/* MANUAL ADJUSTMENTS */}

                <div
                  className="
                    space-y-3
                    pt-3
                    border-t
                    border-neutral-100
                  "
                >

                  <h4 className="text-xs font-bold text-neutral-800">
                    Ajustes Manuales
                  </h4>

                  {/* BRIGHTNESS */}

                  <div className="space-y-1">

                    <div className="flex justify-between text-xs">

                      <span className="text-neutral-600">
                        Brillo
                      </span>

                      <span className="font-mono text-neutral-800 font-semibold">
                        {adjustments.brightness >
                        0
                          ? `+${adjustments.brightness}`
                          : adjustments.brightness}
                      </span>

                    </div>

                    <input
                      type="range"
                      min="-40"
                      max="40"
                      value={
                        adjustments.brightness
                      }
                      onChange={(e) =>
                        setAdjustments(
                          (prev) => ({
                            ...prev,
                            brightness:
                              Number(
                                e.target.value
                              ),
                          })
                        )
                      }
                      className="
                        w-full
                        accent-[#B99A62]
                      "
                    />

                  </div>

                  {/* CONTRAST */}

                  <div className="space-y-1">

                    <div className="flex justify-between text-xs">

                      <span className="text-neutral-600">
                        Contraste
                      </span>

                      <span className="font-mono text-neutral-800 font-semibold">
                        {adjustments.contrast >
                        0
                          ? `+${adjustments.contrast}`
                          : adjustments.contrast}
                      </span>

                    </div>

                    <input
                      type="range"
                      min="-40"
                      max="40"
                      value={
                        adjustments.contrast
                      }
                      onChange={(e) =>
                        setAdjustments(
                          (prev) => ({
                            ...prev,
                            contrast:
                              Number(
                                e.target.value
                              ),
                          })
                        )
                      }
                      className="
                        w-full
                        accent-[#B99A62]
                      "
                    />

                  </div>

                  {/* SATURATION */}

                  <div className="space-y-1">

                    <div className="flex justify-between text-xs">

                      <span className="text-neutral-600">
                        Saturación de Color
                      </span>

                      <span className="font-mono text-neutral-800 font-semibold">
                        {adjustments.saturation >
                        0
                          ? `+${adjustments.saturation}`
                          : adjustments.saturation}
                      </span>

                    </div>

                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={
                        adjustments.saturation
                      }
                      onChange={(e) =>
                        setAdjustments(
                          (prev) => ({
                            ...prev,
                            saturation:
                              Number(
                                e.target.value
                              ),
                          })
                        )
                      }
                      className="
                        w-full
                        accent-[#B99A62]
                      "
                    />

                  </div>

                  {/* VIGNETTE */}

                  <div className="space-y-1">

                    <div className="flex justify-between text-xs">

                      <span className="text-neutral-600">
                        Efecto Viñeta (Bordes)
                      </span>

                      <span className="font-mono text-neutral-800 font-semibold">
                        {adjustments.vignette}%
                      </span>

                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={
                        adjustments.vignette
                      }
                      onChange={(e) =>
                        setAdjustments(
                          (prev) => ({
                            ...prev,
                            vignette:
                              Number(
                                e.target.value
                              ),
                          })
                        )
                      }
                      className="
                        w-full
                        accent-[#B99A62]
                      "
                    />

                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                TAB 3 — TEXT
            ================================================= */}

            {activeTab === 'text' && (
              <div className="space-y-4">

                <div className="flex items-center justify-between gap-2">

                  <h3 className="text-sm font-bold text-neutral-900">
                    Capas de Texto
                  </h3>

                  <button
                    onClick={
                      handleAddTextLayer
                    }
                    className="
                      text-xs
                      bg-[#B99A62]
                      hover:bg-[#4A352B]
                      text-white
                      px-2.5
                      py-1.5
                      rounded-lg
                      flex
                      items-center
                      gap-1
                      font-semibold
                      transition-all
                      shadow-sm
                      shrink-0
                    "
                  >
                    <Plus className="w-3.5 h-3.5" />

                    <span>
                      Añadir Texto
                    </span>
                  </button>

                </div>

                {/* EMPTY STATE */}

                {textLayers.length === 0 ? (

                  <div
                    className="
                      text-center
                      py-8
                      px-4
                      bg-neutral-50
                      rounded-xl
                      border
                      border-dashed
                      border-neutral-300
                    "
                  >

                    <Type className="w-8 h-8 text-neutral-400 mx-auto mb-2" />

                    <p className="text-xs text-neutral-600 font-medium">
                      Personaliza tu lienzo con nombres,
                      fechas inolvidables o dedicatorias.
                    </p>

                    <button
                      onClick={
                        handleAddTextLayer
                      }
                      className="
                        mt-3
                        text-xs
                        font-bold
                        text-[#B99A62]
                        hover:underline
                      "
                    >
                      + Añadir primera dedicatoria
                    </button>

                  </div>

                ) : (

                  <>

                    {/* LAYER SELECTOR */}

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        overflow-x-auto
                        pb-1
                        no-scrollbar
                      "
                    >

                      {textLayers.map(
                        (layer, idx) => (

                          <button
                            key={layer.id}
                            onClick={() =>
                              setSelectedTextId(
                                layer.id
                              )
                            }
                            className={`
                              px-3
                              py-1.5
                              rounded-lg
                              text-xs
                              font-semibold
                              whitespace-nowrap
                              border
                              transition-all
                              flex
                              items-center
                              gap-1.5
                              shrink-0
                              ${
                                layer.id ===
                                selectedTextId
                                  ? 'border-[#B99A62] bg-[#F8F5F0] text-[#B99A62]'
                                  : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                              }
                            `}
                          >

                            <span>
                              Texto {idx + 1}:{' '}
                              &quot;
                              {layer.text.slice(
                                0,
                                10
                              )}
                              ...&quot;
                            </span>

                          </button>

                        )
                      )}

                    </div>

                    {/* ACTIVE LAYER */}

                    {activeTextLayer && (

                      <div
                        className="
                          p-3.5
                          bg-neutral-50
                          rounded-xl
                          border
                          border-neutral-200
                          space-y-3.5
                        "
                      >

                        {/* TEXT */}

                        <div className="space-y-1">

                          <label className="text-xs font-bold text-neutral-700 block">
                            Contenido del texto:
                          </label>

                          <input
                            type="text"
                            value={
                              activeTextLayer.text
                            }
                            onChange={(e) =>
                              handleUpdateActiveText(
                                {
                                  text: e.target.value,
                                }
                              )
                            }
                            className="
                              w-full
                              p-2
                              bg-white
                              border
                              border-neutral-300
                              rounded-lg
                              text-sm
                              font-medium
                            "
                            placeholder="Ej. Familia Martínez · 2024"
                          />

                        </div>

                        {/* FONT */}

                        <div className="space-y-1">

                          <label className="text-xs font-bold text-neutral-700 block">
                            Tipografía:
                          </label>

                          <select
                            value={
                              activeTextLayer.font
                            }
                            onChange={(e) =>
                              handleUpdateActiveText(
                                {
                                  font: e.target.value,
                                }
                              )
                            }
                            className="
                              w-full
                              p-2
                              bg-white
                              border
                              border-neutral-300
                              rounded-lg
                              text-xs
                              font-medium
                            "
                          >

                            {AVAILABLE_FONTS.map(
                              (font) => (
                                <option
                                  key={
                                    font.id
                                  }
                                  value={
                                    font.id
                                  }
                                >
                                  {font.name}
                                </option>
                              )
                            )}

                          </select>

                        </div>

                        {/* COLOR + SIZE */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                          {/* COLOR */}

                          <div className="space-y-1">

                            <label className="text-xs font-bold text-neutral-700 block">
                              Color:
                            </label>

                            <div className="flex items-center gap-2">

                              <input
                                type="color"
                                value={
                                  activeTextLayer.color
                                }
                                onChange={(e) =>
                                  handleUpdateActiveText(
                                    {
                                      color:
                                        e.target.value,
                                    }
                                  )
                                }
                                className="
                                  w-8
                                  h-8
                                  rounded
                                  border
                                  border-neutral-300
                                  cursor-pointer
                                  p-0.5
                                "
                              />

                              <span className="font-mono text-xs text-neutral-600">
                                {
                                  activeTextLayer.color
                                }
                              </span>

                            </div>

                          </div>

                          {/* SIZE */}

                          <div className="space-y-1">

                            <div className="flex justify-between text-xs">

                              <label className="font-bold text-neutral-700">
                                Tamaño:
                              </label>

                              <span className="font-mono font-semibold">
                                {
                                  activeTextLayer.fontSize
                                }
                                px
                              </span>

                            </div>

                            <input
                              type="range"
                              min="14"
                              max="64"
                              value={
                                activeTextLayer.fontSize
                              }
                              onChange={(e) =>
                                handleUpdateActiveText(
                                  {
                                    fontSize:
                                      Number(
                                        e.target.value
                                      ),
                                  }
                                )
                              }
                              className="
                                w-full
                                accent-[#B99A62]
                              "
                            />

                          </div>

                        </div>

                        {/* POSITION Y */}

                        <div className="space-y-1">

                          <div className="flex justify-between text-xs">

                            <label className="font-bold text-neutral-700">
                              Posición Vertical (Y):
                            </label>

                            <span className="font-mono font-semibold">
                              {
                                activeTextLayer.y
                              }
                              %
                            </span>

                          </div>

                          <input
                            type="range"
                            min="10"
                            max="90"
                            value={
                              activeTextLayer.y
                            }
                            onChange={(e) =>
                              handleUpdateActiveText(
                                {
                                  y: Number(
                                    e.target.value
                                  ),
                                }
                              )
                            }
                            className="
                              w-full
                              accent-[#B99A62]
                            "
                          />

                        </div>

                        {/* POSITION X */}

                        <div className="space-y-1">

                          <div className="flex justify-between text-xs">

                            <label className="font-bold text-neutral-700">
                              Posición Horizontal (X):
                            </label>

                            <span className="font-mono font-semibold">
                              {
                                activeTextLayer.x
                              }
                              %
                            </span>

                          </div>

                          <input
                            type="range"
                            min="10"
                            max="90"
                            value={
                              activeTextLayer.x
                            }
                            onChange={(e) =>
                              handleUpdateActiveText(
                                {
                                  x: Number(
                                    e.target.value
                                  ),
                                }
                              )
                            }
                            className="
                              w-full
                              accent-[#B99A62]
                            "
                          />

                        </div>

                        {/* SHADOW + DELETE */}

                        <div
                          className="
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            gap-3
                            pt-2
                            border-t
                            border-neutral-200
                          "
                        >

                          <label
                            className="
                              flex
                              items-center
                              gap-2
                              text-xs
                              font-semibold
                              text-neutral-700
                              cursor-pointer
                            "
                          >

                            <input
                              type="checkbox"
                              checked={
                                activeTextLayer.hasShadow
                              }
                              onChange={(e) =>
                                handleUpdateActiveText(
                                  {
                                    hasShadow:
                                      e.target
                                        .checked,
                                  }
                                )
                              }
                              className="
                                accent-[#B99A62]
                                rounded
                              "
                            />

                            <span>
                              Sombra para legibilidad sobre foto
                            </span>

                          </label>

                          <button
                            onClick={() =>
                              handleDeleteTextLayer(
                                activeTextLayer.id
                              )
                            }
                            className="
                              text-xs
                              text-rose-600
                              hover:text-rose-700
                              flex
                              items-center
                              gap-1
                              font-semibold
                            "
                          >

                            <Trash2 className="w-3.5 h-3.5" />

                            <span>
                              Eliminar capa
                            </span>

                          </button>

                        </div>

                      </div>

                    )}

                  </>

                )}

              </div>
            )}

            {/* =================================================
                TAB 4 — WRAP
            ================================================= */}

            {activeTab === 'wrap' && (
              <div className="space-y-4">

                <h3 className="text-sm font-bold text-neutral-900">
                  Estilo de Envoltorio del Borde (Bastidor)
                </h3>

                <p className="text-xs text-neutral-500">
                  Define cómo se visualizarán los 2 cm o 4 cm de los cantos laterales del lienzo tensado.
                </p>

                <div className="space-y-2">

                  {WRAP_STYLES.map(
                    (w) => {

                      const isSelected =
                        wrapStyle ===
                        w.id;

                      return (
                        <button
                          key={w.id}
                          onClick={() =>
                            setWrapStyle(
                              w.id as EdgeWrapStyle
                            )
                          }
                          className={`
                            w-full
                            p-3
                            rounded-xl
                            border
                            text-left
                            flex
                            items-start
                            gap-3
                            transition-all
                            ${
                              isSelected
                                ? 'border-[#B99A62] bg-[#F8F5F0]/50 ring-2 ring-[#B99A62]/20'
                                : 'border-neutral-200 bg-white hover:bg-neutral-50'
                            }
                          `}
                        >

                          <div
                            className={`
                              w-8
                              h-8
                              rounded-lg
                              shrink-0
                              ${w.preview}
                            `}
                          />

                          <div className="flex-1 min-w-0">

                            <div className="flex items-center justify-between gap-2">

                              <span className="text-xs font-bold text-neutral-900">
                                {w.name}
                              </span>

                              {isSelected && (
                                <Check className="w-4 h-4 text-[#B99A62] shrink-0" />
                              )}

                            </div>

                            <p className="text-[11px] text-neutral-500 mt-0.5">
                              {w.description}
                            </p>

                          </div>

                        </button>
                      );
                    }
                  )}

                </div>

                {/* CUSTOM COLOR */}

                {wrapStyle ===
                  'custom' && (

                  <div
                    className="
                      p-3
                      bg-neutral-50
                      rounded-xl
                      border
                      border-neutral-200
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <input
                      type="color"
                      value={
                        customWrapColor
                      }
                      onChange={(e) =>
                        setCustomWrapColor(
                          e.target.value
                        )
                      }
                      className="
                        w-10
                        h-10
                        rounded
                        border
                        border-neutral-300
                        cursor-pointer
                      "
                    />

                    <div>

                      <span className="text-xs font-bold text-neutral-800 block">
                        Color de canto:
                      </span>

                      <span className="text-[11px] font-mono text-neutral-500">
                        {
                          customWrapColor
                        }
                      </span>

                    </div>

                  </div>
                )}

              </div>
            )}

          </div>

        </div>

        {/* ====================================================
            BOTTOM ACTIONS
        ==================================================== */}

        <div
          className="
            shrink-0
            px-3
            sm:px-5
            py-3
            sm:py-3.5
            border-t
            border-neutral-200
            bg-white
            flex
            flex-col
            sm:flex-row
            items-stretch
            sm:items-center
            justify-between
            gap-2
          "
        >

          <button
            onClick={onClose}
            className="
              px-4
              py-2.5
              border
              border-neutral-300
              text-neutral-700
              hover:bg-neutral-100
              rounded-lg
              text-xs
              sm:text-sm
              font-semibold
              transition-colors
              w-full
              sm:w-auto
            "
          >
            Cancelar
          </button>

          <div
            className="
              flex
              items-center
              gap-3
              w-full
              sm:w-auto
            "
          >

            <button
              onClick={handleApply}
              className="
                bg-[#B99A62]
                hover:bg-[#4A352B]
                text-white
                px-5
                sm:px-6
                py-2.5
                rounded-lg
                text-xs
                sm:text-sm
                font-bold
                shadow-sm
                transition-all
                flex
                items-center
                justify-center
                gap-2
                active:scale-95
                w-full
                sm:w-auto
              "
            >

              <Check className="w-4 h-4" />

              <span>
                Guardar & Aplicar al Lienzo
              </span>

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
