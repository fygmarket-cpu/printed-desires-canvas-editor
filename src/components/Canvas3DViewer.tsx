import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CanvasCustomization } from '../types/canvas';
import { getCombinedFilterStyle } from '../utils/canvasHelpers';
import { Rotate3d, ZoomIn, ZoomOut, RefreshCw, Eye, Sparkles } from 'lucide-react';

interface Canvas3DViewerProps {
  customization: CanvasCustomization;
  viewMode: '3d' | 'room';
  onViewModeChange: (mode: '3d' | 'room') => void;
  onOpenEditor: () => void;
  primaryColor?: string;
  brandName?: string;
}

export const Canvas3DViewer: React.FC<Canvas3DViewerProps> = ({
  customization,
  viewMode,
  onViewModeChange,
  onOpenEditor,
  primaryColor = '#e60067',
  brandName = 'Pdesires',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D rotation state
  const [rotX, setRotX] = useState<number>(10);
  const [rotY, setRotY] = useState<number>(-22);
  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Canvas aspect ratio calculation
  const { widthCm, heightCm } = customization.size;
  const aspectRatio = widthCm / heightCm;

  // Compute container dimensions to fit canvas nicely inside viewport
  const maxDisplayWidth = 420;
  const maxDisplayHeight = 460;

  const { displayWidth, displayHeight } = useMemo(() => {
    let w = maxDisplayWidth;
    let h = w / aspectRatio;

    if (h > maxDisplayHeight) {
      h = maxDisplayHeight;
      w = h * aspectRatio;
    }

    return { displayWidth: Math.round(w), displayHeight: Math.round(h) };
  }, [aspectRatio]);

  // Depth in px based on depthCm (2cm or 4cm)
  const depthPx = customization.depthCm === 4 ? 32 : 18;

  // Filter style
  const filterStyle = useMemo(() => {
    return getCombinedFilterStyle(customization.filter, customization.adjustments);
  }, [customization.filter, customization.adjustments]);

  // Image transform inside canvas (user pan, zoom, rotate)
  const imageTransformStyle = useMemo(() => {
    const { zoom: userZoom, panX, panY, rotateAngle, flipH, flipV } = customization.transform;
    const scaleX = flipH ? -1 : 1;
    const scaleY = flipV ? -1 : 1;

    return {
      transform: `scale(${userZoom}) translate(${panX}%, ${panY}%) rotate(${rotateAngle}deg) scaleX(${scaleX}) scaleY(${scaleY})`,
      filter: filterStyle,
    };
  }, [customization.transform, filterStyle]);

  // Mouse & Touch drag handling for 3D Orbit
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setRotY((prev) => prev + deltaX * 0.45);
      setRotX((prev) => Math.max(-55, Math.min(55, prev - deltaY * 0.45)));
      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - dragStart.x;
      const deltaY = e.touches[0].clientY - dragStart.y;

      setRotY((prev) => prev + deltaX * 0.5);
      setRotX((prev) => Math.max(-55, Math.min(55, prev - deltaY * 0.5)));
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // Wheel zoom handling
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.max(0.7, Math.min(1.8, prev + delta)));
  };

  const resetView = () => {
    setRotX(10);
    setRotY(-22);
    setZoom(1);
  };

  const setViewAngle = (x: number, y: number) => {
    setRotX(x);
    setRotY(y);
  };

  // Side face wrap styling
  const renderSideTexture = (side: 'left' | 'right' | 'top' | 'bottom') => {
    const { wrapStyle, customWrapColor, selectedImage } = customization;

    if (wrapStyle === 'white') {
      return <div className="w-full h-full bg-neutral-100 canvas-texture border-neutral-300" />;
    }
    if (wrapStyle === 'black') {
      return <div className="w-full h-full bg-neutral-900 canvas-texture" />;
    }
    if (wrapStyle === 'custom') {
      return <div className="w-full h-full canvas-texture" style={{ backgroundColor: customWrapColor }} />;
    }

    // Gallery or Mirror wrap: use the image with edge overflow or blur
    return (
      <div className="w-full h-full relative overflow-hidden bg-neutral-200">
        <img
          src={selectedImage}
          alt="Canvas edge"
          className="absolute w-full h-full object-cover scale-150 filter brightness-90 saturate-95"
          style={{
            filter: filterStyle,
            transform: side === 'right' || side === 'left' ? 'scaleX(-1)' : 'scaleY(-1)',
          }}
        />
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      </div>
    );
  };

  // Frame outer styling
  const frameBorderClass = useMemo(() => {
    switch (customization.frameStyle) {
      case 'floating_oak':
        return 'p-3 bg-gradient-to-r from-[#b3825a] via-[#cfa07e] to-[#b3825a] shadow-xl rounded-xs';
      case 'floating_black':
        return 'p-3 bg-neutral-950 shadow-2xl rounded-xs';
      case 'floating_white':
        return 'p-3 bg-neutral-100 border border-neutral-200 shadow-xl rounded-xs';
      case 'gold_vintage':
        return 'p-3.5 bg-gradient-to-br from-[#c99a38] via-[#e8c872] to-[#ab7c20] shadow-2xl rounded-xs ring-1 ring-amber-600/30';
      default:
        return '';
    }
  }, [customization.frameStyle]);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-full min-h-[500px] lg:min-h-[620px] bg-[#EFECE6] rounded-2xl overflow-hidden flex flex-col items-center justify-center select-none border border-[#E7E1D8]"
      style={{ boxShadow: 'inset 0 2px 8px rgba(18, 18, 18, 0.04)' }}
    >
      {/* Top Header Mode Toggle */}
      <div className="absolute top-5 z-20 flex items-center bg-[#F8F5F0]/95 backdrop-blur-md p-1 rounded-full shadow-luxury-md border border-[#D9CEBF]">
        <button
          onClick={() => onViewModeChange('3d')}
          className={`px-5 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
            viewMode === '3d'
              ? 'bg-[#171513] text-[#FFFFFF] shadow-luxury-sm'
              : 'text-[#4A352B] hover:text-[#171513] hover:bg-[#FAF8F5]'
          }`}
        >
          <Rotate3d className="w-3.5 h-3.5 text-[#B99A62]" />
          <span>3D</span>
        </button>
        <button
          onClick={() => onViewModeChange('room')}
          className={`px-5 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
            viewMode === 'room'
              ? 'bg-[#171513] text-[#FFFFFF] shadow-luxury-sm'
              : 'text-[#4A352B] hover:text-[#171513] hover:bg-[#FAF8F5]'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-[#B99A62]" />
          <span>Compare Sizes</span>
        </button>
      </div>

      {/* Preset View Angles Bar */}
      <div className="absolute top-5 right-5 z-20 hidden md:flex items-center gap-1 bg-[#F8F5F0]/90 backdrop-blur-xs p-1 rounded-xl border border-[#D9CEBF] text-[11px] font-medium text-[#4A352B] shadow-luxury-sm">
        <button
          onClick={() => setViewAngle(0, 0)}
          className={`px-2.5 py-1 rounded-lg hover:bg-[#FFFFFF] ${rotX === 0 && rotY === 0 ? 'bg-[#FFFFFF] font-bold text-[#171513] shadow-luxury-sm' : ''}`}
          title="Vista frontal directa"
        >
          Frontal
        </button>
        <button
          onClick={() => setViewAngle(12, -35)}
          className="px-2.5 py-1 rounded-lg hover:bg-[#FFFFFF]"
          title="Perspectiva 3D lateral"
        >
          3D Ángulo
        </button>
        <button
          onClick={() => setViewAngle(0, 75)}
          className="px-2.5 py-1 rounded-lg hover:bg-[#FFFFFF]"
          title="Ver canto y grosor del bastidor"
        >
          Canto
        </button>
        <button
          onClick={resetView}
          className="p-1 rounded-lg hover:bg-[#FFFFFF] text-[#4A352B] hover:text-[#171513]"
          title="Restablecer posición inicial"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#B99A62]" />
        </button>
      </div>

      {/* 3D Scene Viewport */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing p-6 md:p-12 transition-transform duration-75`}
      >
        <div
          className="perspective-1200 preserve-3d flex items-center justify-center"
          style={{
            transform: `scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Framed Container if frame is selected */}
          <div
            className={`preserve-3d transition-transform duration-75 ${frameBorderClass}`}
            style={{
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* 3D Box for the Stretched Canvas */}
            <div
              className="relative preserve-3d shadow-2xl transition-all"
              style={{
                width: `${displayWidth}px`,
                height: `${displayHeight}px`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* FRONT FACE (Main canvas artwork) */}
              <div
                className="absolute inset-0 preserve-3d overflow-hidden bg-neutral-100 canvas-texture border border-black/5"
                style={{
                  transform: `translateZ(${depthPx / 2}px)`,
                }}
              >
                {/* Transformed User Image */}
                <div className="w-full h-full relative overflow-hidden">
                  <img
                    src={customization.selectedImage}
                    alt="Lienzo personalizado"
                    className="w-full h-full object-cover origin-center transition-all duration-150"
                    style={imageTransformStyle}
                  />

                  {/* Vignette Overlay if adjusted */}
                  {customization.adjustments.vignette > 0 && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        boxShadow: `inset 0 0 ${customization.adjustments.vignette * 1.5}px rgba(0,0,0,${
                          (customization.adjustments.vignette / 100) * 0.7
                        })`,
                      }}
                    />
                  )}

                  {/* Text Overlay Layers */}
                  {customization.textLayers.map((layer) => (
                    <div
                      key={layer.id}
                      className="absolute select-none pointer-events-none transition-all"
                      style={{
                        left: `${layer.x}%`,
                        top: `${layer.y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontFamily: layer.font,
                        fontSize: `${(layer.fontSize * displayWidth) / 450}px`,
                        color: layer.color,
                        fontWeight: layer.isBold ? 700 : 400,
                        fontStyle: layer.isItalic ? 'italic' : 'normal',
                        textAlign: layer.align,
                        textShadow: layer.hasShadow ? '2px 2px 6px rgba(0,0,0,0.7)' : 'none',
                        lineHeight: 1.15,
                        maxWidth: '90%',
                      }}
                    >
                      {layer.text}
                    </div>
                  ))}

                  {/* Canvas texture sheen reflection */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/5 via-transparent to-white/10" />
                </div>
              </div>

              {/* RIGHT FACE */}
              <div
                className="absolute right-0 top-0 h-full preserve-3d origin-right"
                style={{
                  width: `${depthPx}px`,
                  transform: `rotateY(90deg) translateZ(0px)`,
                }}
              >
                {renderSideTexture('right')}
              </div>

              {/* LEFT FACE */}
              <div
                className="absolute left-0 top-0 h-full preserve-3d origin-left"
                style={{
                  width: `${depthPx}px`,
                  transform: `rotateY(-90deg) translateZ(0px)`,
                }}
              >
                {renderSideTexture('left')}
              </div>

              {/* TOP FACE */}
              <div
                className="absolute top-0 left-0 w-full preserve-3d origin-top"
                style={{
                  height: `${depthPx}px`,
                  transform: `rotateX(90deg) translateZ(0px)`,
                }}
              >
                {renderSideTexture('top')}
              </div>

              {/* BOTTOM FACE */}
              <div
                className="absolute bottom-0 left-0 w-full preserve-3d origin-bottom"
                style={{
                  height: `${depthPx}px`,
                  transform: `rotateX(-90deg) translateZ(0px)`,
                }}
              >
                {renderSideTexture('bottom')}
              </div>

              {/* BACK FACE */}
              <div
                className="absolute inset-0 bg-[#e4ded5] border border-amber-900/10 canvas-texture"
                style={{
                  transform: `translateZ(-${depthPx / 2}px) rotateY(180deg)`,
                }}
              >
                {/* Pine wood stretcher bars simulation */}
                <div className="w-full h-full relative p-3 flex items-center justify-center">
                  <div className="w-full h-full border-8 border-[#cbb396] bg-[#dfd3c3] flex items-center justify-center">
                    <span className="text-[10px] text-amber-950/40 font-mono uppercase tracking-widest">
                      {brandName} · {widthCm}x{heightCm}cm
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Realistic Floor Shadow */}
      <div
        className="absolute bottom-6 w-3/4 h-8 bg-black/25 blur-xl rounded-full pointer-events-none transition-all duration-150"
        style={{
          transform: `scale(${zoom * (0.8 + (Math.abs(rotY) / 100) * 0.3)})`,
          opacity: 0.35 + (rotX / 100) * 0.2,
        }}
      />

      {/* Bottom Floating Instruction & Zoom Controls */}
      <div className="absolute bottom-4 left-4 z-20 bg-[#F8F5F0]/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#D9CEBF] text-[11px] text-[#4A352B] shadow-luxury-md hidden sm:block">
        <div className="flex flex-col gap-0.5 leading-tight font-medium">
          <span>Click + arrastra para rotar</span>
          <span>Rueda para hacer zoom</span>
          <span>Borde bastidor: <strong className="text-[#171513]">{customization.depthCm} cm</strong></span>
        </div>
      </div>

      {/* Zoom In/Out & Edit Floating Action Buttons */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
        <div className="flex items-center bg-[#FFFFFF] backdrop-blur-md rounded-xl border border-[#D9CEBF] shadow-luxury-sm p-0.5">
          <button
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
            className="p-1.5 text-[#4A352B] hover:text-[#171513] hover:bg-[#F8F5F0] rounded-lg transition-colors"
            title="Reducir zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono px-2 text-[#171513] tabular-nums font-semibold">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
            className="p-1.5 text-[#4A352B] hover:text-[#171513] hover:bg-[#F8F5F0] rounded-lg transition-colors"
            title="Aumentar zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onOpenEditor}
          className="bg-[#171513] hover:bg-[#4A352B] text-[#FFFFFF] px-3.5 py-2 rounded-xl border border-[#B99A62] text-xs font-medium shadow-luxury-md flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B99A62]" />
          <span>Personalizar</span>
        </button>
      </div>
    </div>
  );
};
