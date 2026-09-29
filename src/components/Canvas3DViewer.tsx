import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react';

import { CanvasCustomization } from '../types/canvas';
import { getCombinedFilterStyle } from '../utils/canvasHelpers';

import {
  Rotate3d,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Eye,
  Sparkles,
  Maximize2,
} from 'lucide-react';

import {
  MaterialId,
  MaterialConfig,
} from '../materialConfig';

interface Canvas3DViewerProps {
  customization: CanvasCustomization;

  viewMode: '3d' | 'room';

  onViewModeChange: (
    mode: '3d' | 'room'
  ) => void;

  onOpenEditor: () => void;

  primaryColor?: string;

  brandName?: string;

  selectedMaterial: MaterialId;

  materialConfig: MaterialConfig;
}

/* ============================================================
   MATERIAL VISUAL CONFIGURATION
============================================================ */

interface MaterialVisualConfig {
  thickness: number;

  frontClass: string;

  sideClass: string;

  backClass: string;

  frontStyle?: React.CSSProperties;

  sideStyle?: React.CSSProperties;

  shadow: string;

  showFrame: boolean;

  showCanvasTexture: boolean;

  showReflection: boolean;

  showEdge: boolean;

  borderRadius: string;

  label: string;
}

const getMaterialVisualConfig = (
  material: MaterialId
): MaterialVisualConfig => {
  switch (material) {
    /* ========================================================
       CANVAS
    ======================================================== */

    case 'canvas':
      return {
        thickness: 28,

        frontClass:
          'bg-neutral-100 canvas-texture',

        sideClass:
          'bg-neutral-200 canvas-texture',

        backClass:
          'bg-[#dfd3c3]',

        shadow:
          '0 28px 45px rgba(0,0,0,0.25)',

        showFrame: false,

        showCanvasTexture: true,

        showReflection: false,

        showEdge: true,

        borderRadius: '1px',

        label: 'Canvas Print',
      };

    /* ========================================================
       FRAMED
    ======================================================== */

    case 'framed':
      return {
        thickness: 34,

        frontClass:
          'bg-neutral-100',

        sideClass:
          'bg-[#171513]',

        backClass:
          'bg-[#3c3028]',

        shadow:
          '0 32px 55px rgba(0,0,0,0.32)',

        showFrame: true,

        showCanvasTexture: false,

        showReflection: false,

        showEdge: true,

        borderRadius: '2px',

        label: 'Framed Print',
      };

    /* ========================================================
       METAL
    ======================================================== */

    case 'metal':
      return {
        thickness: 10,

        frontClass:
          'bg-gradient-to-br from-slate-100 via-white to-slate-300',

        sideClass:
          'bg-gradient-to-r from-slate-500 via-slate-200 to-slate-600',

        backClass:
          'bg-slate-500',

        frontStyle: {
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 3px rgba(0,0,0,0.15)',
        },

        sideStyle: {
          boxShadow:
            'inset 0 0 5px rgba(0,0,0,0.35)',
        },

        shadow:
          '0 25px 45px rgba(0,0,0,0.27)',

        showFrame: false,

        showCanvasTexture: false,

        showReflection: true,

        showEdge: true,

        borderRadius: '1px',

        label: 'Metal Print',
      };

    /* ========================================================
       ACRYLIC
    ======================================================== */

    case 'acrylic':
      return {
        thickness: 16,

        frontClass:
          'bg-white/90',

        sideClass:
          'bg-gradient-to-r from-white/80 via-slate-200/70 to-white/80',

        backClass:
          'bg-slate-200/80',

        frontStyle: {
          boxShadow:
            'inset 0 0 0 1px rgba(255,255,255,0.8)',
        },

        shadow:
          '0 30px 55px rgba(0,0,0,0.28)',

        showFrame: false,

        showCanvasTexture: false,

        showReflection: true,

        showEdge: true,

        borderRadius: '2px',

        label: 'Acrylic Print',
      };

    /* ========================================================
       POSTER
    ======================================================== */

    case 'poster':
      return {
        thickness: 3,

        frontClass:
          'bg-white',

        sideClass:
          'bg-[#e8e2d9]',

        backClass:
          'bg-[#eee9e1]',

        shadow:
          '0 18px 35px rgba(0,0,0,0.20)',

        showFrame: false,

        showCanvasTexture: false,

        showReflection: false,

        showEdge: true,

        borderRadius: '0px',

        label: 'Poster Print',
      };

    /* ========================================================
       FALLBACK
    ======================================================== */

    default:
      return {
        thickness: 28,

        frontClass:
          'bg-neutral-100 canvas-texture',

        sideClass:
          'bg-neutral-200 canvas-texture',

        backClass:
          'bg-[#dfd3c3]',

        shadow:
          '0 28px 45px rgba(0,0,0,0.25)',

        showFrame: false,

        showCanvasTexture: true,

        showReflection: false,

        showEdge: true,

        borderRadius: '1px',

        label: 'Wall Art',
      };
  }
};

/* ============================================================
   COMPONENT
============================================================ */

export const Canvas3DViewer: React.FC<
  Canvas3DViewerProps
> = ({
  customization,
  viewMode,
  onViewModeChange,
  onOpenEditor,
  primaryColor = '#B99A62',
  brandName = 'Printed Desires',
  selectedMaterial,
  materialConfig,
}) => {
  const containerRef =
    useRef<HTMLDivElement>(null);

  /* ==========================================================
     3D ROTATION
  ========================================================== */

  const [rotX, setRotX] =
    useState<number>(10);

  const [rotY, setRotY] =
    useState<number>(-22);

  const [zoom, setZoom] =
    useState<number>(1);

  const [isDragging, setIsDragging] =
    useState<boolean>(false);

  const [dragStart, setDragStart] =
    useState<{
      x: number;
      y: number;
    }>({
      x: 0,
      y: 0,
    });

  /* ==========================================================
     MATERIAL
  ========================================================== */

  const materialVisual =
    useMemo(
      () =>
        getMaterialVisualConfig(
          selectedMaterial
        ),
      [selectedMaterial]
    );

  /* ==========================================================
     SIZE
  ========================================================== */

  const {
    widthCm,
    heightCm,
  } = customization.size;

  const aspectRatio =
    widthCm / heightCm;

  const maxDisplayWidth = 420;

  const maxDisplayHeight = 460;

  const {
    displayWidth,
    displayHeight,
  } = useMemo(() => {
    let w =
      maxDisplayWidth;

    let h =
      w / aspectRatio;

    if (
      h >
      maxDisplayHeight
    ) {
      h =
        maxDisplayHeight;

      w =
        h *
        aspectRatio;
    }

    return {
      displayWidth:
        Math.round(w),

      displayHeight:
        Math.round(h),
    };
  }, [aspectRatio]);

  /* ==========================================================
     DEPTH
  ========================================================== */

  const depthPx =
    materialVisual.thickness;

  /* ==========================================================
     IMAGE FILTER
  ========================================================== */

  const filterStyle =
    useMemo(() => {
      return getCombinedFilterStyle(
        customization.filter,
        customization.adjustments
      );
    }, [
      customization.filter,
      customization.adjustments,
    ]);

  /* ==========================================================
     IMAGE TRANSFORM
  ========================================================== */

  const imageTransformStyle =
    useMemo(() => {
      const {
        zoom: userZoom,
        panX,
        panY,
        rotateAngle,
        flipH,
        flipV,
      } =
        customization.transform;

      const scaleX =
        flipH ? -1 : 1;

      const scaleY =
        flipV ? -1 : 1;

      return {
        transform:
          `scale(${userZoom}) ` +
          `translate(${panX}%, ${panY}%) ` +
          `rotate(${rotateAngle}deg) ` +
          `scaleX(${scaleX}) ` +
          `scaleY(${scaleY})`,

        filter:
          filterStyle,
      };
    }, [
      customization.transform,
      filterStyle,
    ]);

  /* ==========================================================
     DRAG / ROTATION
  ========================================================== */

  const handleMouseDown =
    (
      e: React.MouseEvent
    ) => {
      e.preventDefault();

      setIsDragging(true);

      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    };

  const handleTouchStart =
    (
      e: React.TouchEvent
    ) => {
      if (
        e.touches.length !== 1
      ) {
        return;
      }

      setIsDragging(true);

      setDragStart({
        x:
          e.touches[0]
            .clientX,

        y:
          e.touches[0]
            .clientY,
      });
    };

  useEffect(() => {
    const handleMouseMove =
      (
        e: MouseEvent
      ) => {
        if (!isDragging) {
          return;
        }

        const deltaX =
          e.clientX -
          dragStart.x;

        const deltaY =
          e.clientY -
          dragStart.y;

        setRotY(
          (prev) =>
            prev +
            deltaX *
              0.45
        );

        setRotX(
          (prev) =>
            Math.max(
              -55,
              Math.min(
                55,
                prev -
                  deltaY *
                    0.45
              )
            )
        );

        setDragStart({
          x: e.clientX,
          y: e.clientY,
        });
      };

    const handleTouchMove =
      (
        e: TouchEvent
      ) => {
        if (
          !isDragging ||
          e.touches.length !==
            1
        ) {
          return;
        }

        const deltaX =
          e.touches[0]
            .clientX -
          dragStart.x;

        const deltaY =
          e.touches[0]
            .clientY -
          dragStart.y;

        setRotY(
          (prev) =>
            prev +
            deltaX *
              0.5
        );

        setRotX(
          (prev) =>
            Math.max(
              -55,
              Math.min(
                55,
                prev -
                  deltaY *
                    0.5
              )
            )
        );

        setDragStart({
          x:
            e.touches[0]
              .clientX,

          y:
            e.touches[0]
              .clientY,
        });
      };

    const handleMouseUp =
      () =>
        setIsDragging(false);

    if (isDragging) {
      window.addEventListener(
        'mousemove',
        handleMouseMove
      );

      window.addEventListener(
        'mouseup',
        handleMouseUp
      );

      window.addEventListener(
        'touchmove',
        handleTouchMove
      );

      window.addEventListener(
        'touchend',
        handleMouseUp
      );
    }

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      window.removeEventListener(
        'mouseup',
        handleMouseUp
      );

      window.removeEventListener(
        'touchmove',
        handleTouchMove
      );

      window.removeEventListener(
        'touchend',
        handleMouseUp
      );
    };
  }, [
    isDragging,
    dragStart,
  ]);

  /* ==========================================================
     WHEEL ZOOM
  ========================================================== */

  const handleWheel =
    (
      e: React.WheelEvent
    ) => {
      e.stopPropagation();

      const delta =
        e.deltaY < 0
          ? 0.08
          : -0.08;

      setZoom(
        (prev) =>
          Math.max(
            0.7,
            Math.min(
              1.8,
              prev + delta
            )
          )
      );
    };

  /* ==========================================================
     RESET
  ========================================================== */

  const resetView =
    () => {
      setRotX(10);
      setRotY(-22);
      setZoom(1);
    };

  const setViewAngle =
    (
      x: number,
      y: number
    ) => {
      setRotX(x);
      setRotY(y);
    };

  /* ==========================================================
     SIDE TEXTURE
  ========================================================== */

  const renderSideTexture =
    (
      side:
        | 'left'
        | 'right'
        | 'top'
        | 'bottom'
    ) => {
      const {
        wrapStyle,
        customWrapColor,
        selectedImage,
      } =
        customization;

      /*
       * Poster
       */

      if (
        selectedMaterial ===
        'poster'
      ) {
        return (
          <div
            className="w-full h-full bg-[#e8e2d9]"
            style={{
              boxShadow:
                'inset 0 0 2px rgba(0,0,0,0.25)',
            }}
          />
        );
      }

      /*
       * Metal
       */

      if (
        selectedMaterial ===
        'metal'
      ) {
        return (
          <div
            className="w-full h-full bg-gradient-to-r from-slate-500 via-slate-200 to-slate-600"
            style={{
              boxShadow:
                'inset 0 0 5px rgba(0,0,0,0.35)',
            }}
          />
        );
      }

      /*
       * Acrylic
       */

      if (
        selectedMaterial ===
        'acrylic'
      ) {
        return (
          <div className="relative w-full h-full overflow-hidden bg-gradient-to-r from-white/80 via-slate-200/70 to-white/80">
            <div className="absolute inset-0 bg-white/30" />

            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent" />
          </div>
        );
      }

      /*
       * Framed
       */

      if (
        selectedMaterial ===
        'framed'
      ) {
        return (
          <div className="w-full h-full bg-[#171513]">
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-white/10 to-black/40" />
          </div>
        );
      }

      /*
       * Canvas custom wraps
       */

      if (
        wrapStyle ===
        'white'
      ) {
        return (
          <div className="w-full h-full bg-neutral-100 canvas-texture border-neutral-300" />
        );
      }

      if (
        wrapStyle ===
        'black'
      ) {
        return (
          <div className="w-full h-full bg-neutral-900 canvas-texture" />
        );
      }

      if (
        wrapStyle ===
        'custom'
      ) {
        return (
          <div
            className="w-full h-full canvas-texture"
            style={{
              backgroundColor:
                customWrapColor,
            }}
          />
        );
      }

      /*
       * Gallery / Mirror canvas
       */

      return (
        <div className="w-full h-full relative overflow-hidden bg-neutral-200">
          <img
            src={selectedImage}
            alt="Wall art edge"
            className="absolute w-full h-full object-cover scale-150"
            style={{
              filter:
                filterStyle,

              transform:
                side ===
                  'right' ||
                side === 'left'
                  ? 'scaleX(-1)'
                  : 'scaleY(-1)',
            }}
          />

          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        </div>
      );
    };

  /* ==========================================================
     FRAME
  ========================================================== */

  const renderFrame =
    (
      children: React.ReactNode
    ) => {
      if (
        selectedMaterial !==
        'framed'
      ) {
        return children;
      }

      return (
        <div
          className="p-3 preserve-3d"
          style={{
            background:
              'linear-gradient(135deg, #171513 0%, #4a352b 25%, #171513 50%, #4a352b 75%, #171513 100%)',

            boxShadow:
              '0 25px 45px rgba(0,0,0,0.30)',

            borderRadius:
              '2px',
          }}
        >
          {children}
        </div>
      );
    };

  /* ==========================================================
     MATERIAL LABEL
  ========================================================== */

  const materialLabel =
    materialConfig?.displayName ||
    materialVisual.label;

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className="relative w-full h-full min-h-[500px] lg:min-h-[620px] bg-[#EFECE6] rounded-2xl overflow-hidden flex flex-col items-center justify-center select-none border border-[#E7E1D8]"
      style={{
        boxShadow:
          'inset 0 2px 8px rgba(18,18,18,0.04)',
      }}
    >

      {/* ======================================================
          MATERIAL INFORMATION
      ====================================================== */}

      <div className="absolute top-5 left-5 z-20 max-w-[220px] bg-[#F8F5F0]/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#D9CEBF] shadow-luxury-sm">

        <div className="text-[9px] uppercase tracking-[0.18em] font-bold text-[#B99A62]">
          Printed Desires
        </div>

        <div className="mt-0.5 text-xs font-bold text-[#171513]">
          {materialLabel}
        </div>

        <div className="mt-0.5 text-[10px] text-[#6B625B]">
          {widthCm} × {heightCm} cm
        </div>
      </div>

      {/* ======================================================
          VIEW MODE
      ====================================================== */}

      <div className="absolute top-5 z-20 flex items-center bg-[#F8F5F0]/95 backdrop-blur-md p-1 rounded-full shadow-luxury-md border border-[#D9CEBF]">

        <button
          onClick={() =>
            onViewModeChange(
              '3d'
            )
          }
          className={`px-5 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
            viewMode === '3d'
              ? 'bg-[#171513] text-[#FFFFFF] shadow-luxury-sm'
              : 'text-[#4A352B] hover:text-[#171513] hover:bg-[#FAF8F5]'
          }`}
        >
          <Rotate3d
            className="w-3.5 h-3.5"
            style={{
              color:
                primaryColor,
            }}
          />

          <span>
            3D
          </span>
        </button>

        <button
          onClick={() =>
            onViewModeChange(
              'room'
            )
          }
          className={`px-5 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
            viewMode === 'room'
              ? 'bg-[#171513] text-[#FFFFFF] shadow-luxury-sm'
              : 'text-[#4A352B] hover:text-[#171513] hover:bg-[#FAF8F5]'
          }`}
        >
          <Eye
            className="w-3.5 h-3.5"
            style={{
              color:
                primaryColor,
            }}
          />

          <span>
            Compare Sizes
          </span>
        </button>
      </div>

      {/* ======================================================
          PRESET ANGLES
      ====================================================== */}

      <div className="absolute top-5 right-5 z-20 hidden md:flex items-center gap-1 bg-[#F8F5F0]/90 backdrop-blur-xs p-1 rounded-xl border border-[#D9CEBF] text-[11px] font-medium text-[#4A352B] shadow-luxury-sm">

        <button
          onClick={() =>
            setViewAngle(
              0,
              0
            )
          }
          className={`px-2.5 py-1 rounded-lg hover:bg-[#FFFFFF] ${
            rotX === 0 &&
            rotY === 0
              ? 'bg-[#FFFFFF] font-bold text-[#171513] shadow-luxury-sm'
              : ''
          }`}
        >
          Frontal
        </button>

        <button
          onClick={() =>
            setViewAngle(
              12,
              -35
            )
          }
          className="px-2.5 py-1 rounded-lg hover:bg-[#FFFFFF]"
        >
          3D Ángulo
        </button>

        <button
          onClick={() =>
            setViewAngle(
              0,
              75
            )
          }
          className="px-2.5 py-1 rounded-lg hover:bg-[#FFFFFF]"
        >
          Canto
        </button>

        <button
          onClick={
            resetView
          }
          className="p-1 rounded-lg hover:bg-[#FFFFFF]"
          title="Restablecer"
        >
          <RefreshCw
            className="w-3.5 h-3.5"
            style={{
              color:
                primaryColor,
            }}
          />
        </button>
      </div>

      {/* ======================================================
          3D VIEWPORT
      ====================================================== */}

      <div
        onMouseDown={
          handleMouseDown
        }
        onTouchStart={
          handleTouchStart
        }
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing p-6 md:p-12"
      >

        <div
          className="perspective-1200 preserve-3d flex items-center justify-center"
          style={{
            transform:
              `scale(${zoom})`,

            transition:
              isDragging
                ? 'none'
                : 'transform 0.2s cubic-bezier(0.16,1,0.3,1)',
          }}
        >

          {renderFrame(
            <div
              className="preserve-3d"
              style={{
                transform:
                  `rotateX(${rotX}deg) rotateY(${rotY}deg)`,

                transformStyle:
                  'preserve-3d',

                borderRadius:
                  materialVisual.borderRadius,

                boxShadow:
                  materialVisual.shadow,
              }}
            >

              {/* =================================================
                  MAIN 3D BOX
              ================================================= */}

              <div
                className="relative preserve-3d"
                style={{
                  width:
                    `${displayWidth}px`,

                  height:
                    `${displayHeight}px`,

                  transformStyle:
                    'preserve-3d',

                  borderRadius:
                    materialVisual.borderRadius,
                }}
              >

                {/* =================================================
                    FRONT
                ================================================= */}

                <div
                  className={`absolute inset-0 preserve-3d overflow-hidden ${materialVisual.frontClass}`}
                  style={{
                    transform:
                      `translateZ(${depthPx / 2}px)`,

                    ...materialVisual.frontStyle,
                  }}
                >

                  <div className="w-full h-full relative overflow-hidden">

                    <img
                      src={
                        customization.selectedImage
                      }
                      alt="Wall art personalizado"
                      className="w-full h-full object-cover origin-center transition-all duration-150"
                      style={
                        imageTransformStyle
                      }
                    />

                    {/* =================================================
                        METAL REFLECTION
                    ================================================= */}

                    {materialVisual.showReflection &&
                      selectedMaterial ===
                        'metal' && (
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/25 via-transparent to-black/10 mix-blend-screen" />
                      )}

                    {/* =================================================
                        ACRYLIC REFLECTION
                    ================================================= */}

                    {materialVisual.showReflection &&
                      selectedMaterial ===
                        'acrylic' && (
                        <>
                          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/45 via-transparent to-transparent" />

                          <div
                            className="absolute top-0 left-0 w-[65%] h-full pointer-events-none opacity-20"
                            style={{
                              background:
                                'linear-gradient(110deg, rgba(255,255,255,0.95), transparent)',
                            }}
                          />
                        </>
                      )}

                    {/* =================================================
                        CANVAS SHEEN
                    ================================================= */}

                    {selectedMaterial ===
                      'canvas' && (
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/5 via-transparent to-white/10" />
                    )}

                    {/* =================================================
                        VIGNETTE
                    ================================================= */}

                    {customization.adjustments.vignette >
                      0 && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          boxShadow:
                            `inset 0 0 ${
                              customization
                                .adjustments
                                .vignette *
                              1.5
                            }px rgba(0,0,0,${
                              (customization
                                .adjustments
                                .vignette /
                                100) *
                              0.7
                            })`,
                        }}
                      />
                    )}

                    {/* =================================================
                        TEXT LAYERS
                    ================================================= */}

                    {customization.textLayers.map(
                      (
                        layer
                      ) => (
                        <div
                          key={
                            layer.id
                          }
                          className="absolute select-none pointer-events-none"
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
                              `${
                                (layer.fontSize *
                                  displayWidth) /
                                450
                              }px`,

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
                                ? '2px 2px 6px rgba(0,0,0,0.7)'
                                : 'none',

                            lineHeight:
                              1.15,

                            maxWidth:
                              '90%',
                          }}
                        >
                          {
                            layer.text
                          }
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* =================================================
                    RIGHT FACE
                ================================================= */}

                <div
                  className="absolute right-0 top-0 h-full preserve-3d origin-right"
                  style={{
                    width:
                      `${depthPx}px`,

                    transform:
                      'rotateY(90deg)',

                    transformStyle:
                      'preserve-3d',
                  }}
                >
                  {renderSideTexture(
                    'right'
                  )}
                </div>

                {/* =================================================
                    LEFT FACE
                ================================================= */}

                <div
                  className="absolute left-0 top-0 h-full preserve-3d origin-left"
                  style={{
                    width:
                      `${depthPx}px`,

                    transform:
                      'rotateY(-90deg)',

                    transformStyle:
                      'preserve-3d',
                  }}
                >
                  {renderSideTexture(
                    'left'
                  )}
                </div>

                {/* =================================================
                    TOP FACE
                ================================================= */}

                <div
                  className="absolute top-0 left-0 w-full preserve-3d origin-top"
                  style={{
                    height:
                      `${depthPx}px`,

                    transform:
                      'rotateX(90deg)',

                    transformStyle:
                      'preserve-3d',
                  }}
                >
                  {renderSideTexture(
                    'top'
                  )}
                </div>

                {/* =================================================
                    BOTTOM FACE
                ================================================= */}

                <div
                  className="absolute bottom-0 left-0 w-full preserve-3d origin-bottom"
                  style={{
                    height:
                      `${depthPx}px`,

                    transform:
                      'rotateX(-90deg)',

                    transformStyle:
                      'preserve-3d',
                  }}
                >
                  {renderSideTexture(
                    'bottom'
                  )}
                </div>

                {/* =================================================
                    BACK
                ================================================= */}

                <div
                  className={`absolute inset-0 ${materialVisual.backClass} border border-black/10`}
                  style={{
                    transform:
                      `translateZ(-${
                        depthPx / 2
                      }px) rotateY(180deg)`,

                    backfaceVisibility:
                      'visible',
                  }}
                >

                  {selectedMaterial ===
                    'canvas' && (
                    <div className="w-full h-full relative p-3 flex items-center justify-center">

                      <div className="w-full h-full border-8 border-[#cbb396] bg-[#dfd3c3] flex items-center justify-center">

                        <span className="text-[10px] text-amber-950/40 font-mono uppercase tracking-widest">
                          {brandName}
                          {' · '}
                          {widthCm}
                          x
                          {heightCm}
                          cm
                        </span>

                      </div>
                    </div>
                  )}

                  {selectedMaterial ===
                    'framed' && (
                    <div className="w-full h-full flex items-center justify-center">

                      <div className="w-[85%] h-[85%] border-4 border-black/20 flex items-center justify-center">

                        <span className="text-[9px] text-white/30 uppercase tracking-[0.2em]">
                          {brandName}
                        </span>

                      </div>
                    </div>
                  )}

                  {selectedMaterial ===
                    'metal' && (
                    <div className="w-full h-full bg-gradient-to-br from-slate-500 via-slate-300 to-slate-600 flex items-center justify-center">

                      <span className="text-[9px] uppercase tracking-[0.2em] text-white/40">
                        Metal
                      </span>

                    </div>
                  )}

                  {selectedMaterial ===
                    'acrylic' && (
                    <div className="w-full h-full bg-gradient-to-br from-white/80 via-slate-200/60 to-white/90 flex items-center justify-center">

                      <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500/50">
                        Acrylic
                      </span>

                    </div>
                  )}

                  {selectedMaterial ===
                    'poster' && (
                    <div className="w-full h-full flex items-center justify-center">

                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#171513]/20">
                        {brandName}
                      </span>

                    </div>
                  )}

                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
          FLOOR SHADOW
      ====================================================== */}

      <div
        className="absolute bottom-6 w-3/4 h-8 bg-black/25 blur-xl rounded-full pointer-events-none"
        style={{
          transform:
            `scale(${
              zoom *
              (0.8 +
                (Math.abs(
                  rotY
                ) /
                  100) *
                  0.3)
            })`,

          opacity:
            0.35 +
            (rotX / 100) *
              0.2,
        }}
      />

      {/* ======================================================
          INSTRUCTIONS
      ====================================================== */}

      <div className="absolute bottom-4 left-4 z-20 bg-[#F8F5F0]/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#D9CEBF] text-[11px] text-[#4A352B] shadow-luxury-md hidden sm:block">

        <div className="flex flex-col gap-0.5 leading-tight font-medium">

          <span>
            Click + arrastra para rotar
          </span>

          <span>
            Rueda para hacer zoom
          </span>

          <span>
            Material:{' '}
            <strong className="text-[#171513]">
              {materialLabel}
            </strong>
          </span>

        </div>
      </div>

      {/* ======================================================
          CONTROLS
      ====================================================== */}

      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">

        {/* Zoom */}

        <div className="flex items-center bg-[#FFFFFF] backdrop-blur-md rounded-xl border border-[#D9CEBF] shadow-luxury-sm p-0.5">

          <button
            onClick={() =>
              setZoom(
                (z) =>
                  Math.max(
                    0.7,
                    z - 0.15
                  )
              )
            }
            className="p-1.5 text-[#4A352B] hover:text-[#171513] hover:bg-[#F8F5F0] rounded-lg transition-colors"
            title="Reducir zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-mono px-2 text-[#171513] tabular-nums font-semibold">
            {Math.round(
              zoom * 100
            )}
            %
          </span>

          <button
            onClick={() =>
              setZoom(
                (z) =>
                  Math.min(
                    1.8,
                    z + 0.15
                  )
              )
            }
            className="p-1.5 text-[#4A352B] hover:text-[#171513] hover:bg-[#F8F5F0] rounded-lg transition-colors"
            title="Aumentar zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

        </div>

        {/* Fullscreen-style visual control */}

        <button
          onClick={
            resetView
          }
          className="hidden sm:flex bg-[#FFFFFF] hover:bg-[#F8F5F0] text-[#171513] p-2.5 rounded-xl border border-[#D9CEBF] shadow-luxury-sm"
          title="Restablecer vista"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Personalize */}

        <button
          onClick={
            onOpenEditor
          }
          className="bg-[#171513] hover:bg-[#4A352B] text-[#FFFFFF] px-3.5 py-2 rounded-xl border text-xs font-medium shadow-luxury-md flex items-center gap-1.5 transition-all"
          style={{
            borderColor:
              primaryColor,
          }}
        >
          <Sparkles
            className="w-3.5 h-3.5"
            style={{
              color:
                primaryColor,
            }}
          />

          <span>
            Personalizar
          </span>
        </button>

      </div>
    </div>
  );
};
