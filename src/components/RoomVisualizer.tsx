import React, { useMemo, useState } from 'react';
import { CanvasCustomization, CanvasSize } from '../types/canvas';
import { CANVAS_SIZES, ROOM_MOCKUP_IMAGE } from '../data/canvasPresets';
import { getCombinedFilterStyle } from '../utils/canvasHelpers';
import {
  Rotate3d,
  Eye,
  Check,
  Ruler,
  Info,
} from 'lucide-react';

interface RoomVisualizerProps {
  customization: CanvasCustomization;
  onSelectSize: (size: CanvasSize) => void;
  onViewModeChange: (mode: '3d' | 'room') => void;
  viewMode: '3d' | 'room';
  primaryColor?: string;
  availableSizes?: CanvasSize[];
}

export const RoomVisualizer: React.FC<RoomVisualizerProps> = ({
  customization,
  onSelectSize,
  onViewModeChange,
  viewMode,
  primaryColor = '#e60067',
  availableSizes,
}) => {
  const [showRuler, setShowRuler] = useState(true);

  /*
   * ------------------------------------------------------------
   * SAFE VALUES
   * ------------------------------------------------------------
   */

  const selectedSize = customization?.size;

  const widthCm = Number(selectedSize?.widthCm || 40);
  const heightCm = Number(selectedSize?.heightCm || 50);

  const selectedImage =
    customization?.selectedImage ||
    '';

  /*
   * ------------------------------------------------------------
   * FILTER
   * ------------------------------------------------------------
   */

  const filterStyle = useMemo(() => {
    try {
      return getCombinedFilterStyle(
        customization.filter,
        customization.adjustments
      );
    } catch {
      return undefined;
    }
  }, [
    customization.filter,
    customization.adjustments,
  ]);

  /*
   * ------------------------------------------------------------
   * ROOM SCALE
   * ------------------------------------------------------------
   *
   * Approximate visible wall width.
   * This is a visual reference, not a measurement tool.
   */

  const wallWidthCm = 280;

  const rawCanvasWidthPercent =
    (widthCm / wallWidthCm) * 100;

  const canvasWidthPercent = Math.min(
    85,
    Math.max(12, rawCanvasWidthPercent)
  );

  /*
   * ------------------------------------------------------------
   * COMPARISON SIZES
   * ------------------------------------------------------------
   */

  const comparisonSizes = useMemo(() => {
    const source =
      availableSizes &&
      availableSizes.length > 0
        ? availableSizes
        : CANVAS_SIZES;

    return source.slice(0, 5);
  }, [availableSizes]);

  /*
   * ------------------------------------------------------------
   * FRAME
   * ------------------------------------------------------------
   */

  const frameStyleClass = useMemo(() => {
    switch (customization.frameStyle) {
      case 'floating_oak':
        return 'p-2 bg-[#B3825A]';

      case 'floating_black':
        return 'p-2 bg-neutral-950';

      case 'floating_white':
        return 'p-2 bg-neutral-100 border border-neutral-300';

      case 'gold_vintage':
        return [
          'p-2.5',
          'bg-gradient-to-br',
          'from-[#C99A38]',
          'via-[#E8C872]',
          'to-[#AB7C20]',
        ].join(' ');

      default:
        return '';
    }
  }, [customization.frameStyle]);

  /*
   * ------------------------------------------------------------
   * TRANSFORM
   * ------------------------------------------------------------
   */

  const transform = customization.transform;

  const imageTransform = [
    `scale(${transform.zoom || 1})`,
    `translate(${transform.panX || 0}%, ${transform.panY || 0}%)`,
    `rotate(${transform.rotateAngle || 0}deg)`,
    `scaleX(${transform.flipH ? -1 : 1})`,
    `scaleY(${transform.flipV ? -1 : 1})`,
  ].join(' ');

  /*
   * ------------------------------------------------------------
   * PRIMARY COLOR
   * ------------------------------------------------------------
   */

  const accentColor = primaryColor || '#e60067';

  /*
   * ------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------
   */

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[620px] rounded-2xl overflow-hidden bg-[#171513] select-none flex flex-col border border-[#E7E1D8]">

      {/* ======================================================
          VIEW MODE HEADER
      ======================================================= */}

      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30">

        <div className="flex items-center bg-[#F8F5F0]/95 backdrop-blur-md p-1 rounded-full shadow-lg border border-[#D9CEBF]">

          {/* 3D */}
          <button
            type="button"
            onClick={() => onViewModeChange('3d')}
            className={[
              'px-5',
              'py-2',
              'text-xs',
              'font-semibold',
              'rounded-full',
              'transition-all',
              'flex',
              'items-center',
              'gap-1.5',
              viewMode === '3d'
                ? 'bg-[#171513] text-white shadow-md'
                : 'text-[#4A352B] hover:text-[#171513] hover:bg-[#FAF8F5]',
            ].join(' ')}
          >
            <Rotate3d
              className="w-3.5 h-3.5"
              style={{
                color: accentColor,
              }}
            />

            <span>3D</span>
          </button>

          {/* ROOM */}
          <button
            type="button"
            onClick={() => onViewModeChange('room')}
            className={[
              'px-5',
              'py-2',
              'text-xs',
              'font-semibold',
              'rounded-full',
              'transition-all',
              'flex',
              'items-center',
              'gap-1.5',
              viewMode === 'room'
                ? 'bg-[#171513] text-white shadow-md'
                : 'text-[#4A352B] hover:text-[#171513] hover:bg-[#FAF8F5]',
            ].join(' ')}
          >
            <Eye
              className="w-3.5 h-3.5"
              style={{
                color: accentColor,
              }}
            />

            <span>Compare Sizes</span>
          </button>

        </div>
      </div>

      {/* ======================================================
          RULER BUTTON
      ======================================================= */}

      <div className="absolute top-5 right-5 z-30">

        <button
          type="button"
          onClick={() =>
            setShowRuler((current) => !current)
          }
          className={[
            'px-3',
            'py-1.5',
            'rounded-xl',
            'text-xs',
            'font-medium',
            'backdrop-blur-md',
            'transition-all',
            'flex',
            'items-center',
            'gap-1.5',
            showRuler
              ? 'bg-[#171513]/90 text-white border border-[#B99A62] shadow-md'
              : 'bg-[#F8F5F0]/90 text-[#4A352B] border border-[#D9CEBF]',
          ].join(' ')}
        >
          <Ruler
            className="w-3.5 h-3.5"
            style={{
              color: accentColor,
            }}
          />

          <span>
            {showRuler
              ? 'Ocultar cotas'
              : 'Ver cotas (cm)'}
          </span>
        </button>

      </div>

      {/* ======================================================
          ROOM AREA
      ======================================================= */}

      <div className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden">

        {/* ROOM BACKGROUND */}

        <img
          src={ROOM_MOCKUP_IMAGE}
          alt="Salón interior"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* DARK OVERLAY */}

        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        {/* ====================================================
            CANVAS POSITION
        ===================================================== */}

        <div
          className="relative z-10 flex flex-col items-center justify-center transition-all duration-500"
          style={{
            width: `${canvasWidthPercent}%`,
            maxWidth: '460px',
            marginBottom: '7%',
          }}
        >

          {/* ==================================================
              WIDTH RULER
          =================================================== */}

          {showRuler && (
            <div className="w-full flex items-center justify-center mb-1">

              <div className="text-[11px] font-semibold text-[#171513] bg-[#F8F5F0]/95 px-2.5 py-0.5 rounded-lg shadow-md border border-[#D9CEBF] font-mono tracking-tight">

                <span>
                  ↔ Ancho: {widthCm} cm
                </span>

              </div>

            </div>
          )}

          {/* ==================================================
              ARTWORK / CANVAS
          =================================================== */}

          <div
            className={[
              'relative',
              'w-full',
              'overflow-hidden',
              'transition-all',
              'duration-300',
              'shadow-2xl',
              frameStyleClass,
            ].join(' ')}
            style={{
              aspectRatio: `${widthCm} / ${heightCm}`,
              boxShadow:
                '0 25px 50px -12px rgba(18,18,18,0.45)',
            }}
          >

            {/* INNER ARTWORK */}

            <div className="relative w-full h-full overflow-hidden bg-[#F8F5F0]">

              {/* IMAGE */}

              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Vista previa de la fotografía"
                  className="absolute inset-0 w-full h-full object-cover origin-center"
                  style={{
                    filter: filterStyle,
                    transform: imageTransform,
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#EDE7DE]">

                  <div className="text-center px-5">

                    <div className="text-sm font-semibold text-[#4A352B]">
                      Tu fotografía aparecerá aquí
                    </div>

                    <div className="text-xs text-[#76675D] mt-1">
                      Sube una imagen para visualizar tu producto
                    </div>

                  </div>

                </div>
              )}

              {/* ==================================================
                  TEXT LAYERS
              =================================================== */}

              {Array.isArray(customization.textLayers) &&
                customization.textLayers.map((layer) => (

                  <div
                    key={layer.id}
                    className="absolute select-none pointer-events-none"
                    style={{
                      left: `${layer.x}%`,
                      top: `${layer.y}%`,
                      transform:
                        'translate(-50%, -50%)',
                      fontFamily: layer.font,
                      fontSize:
                        `${layer.fontSize * 0.4}px`,
                      color: layer.color,
                      fontWeight:
                        layer.isBold ? 700 : 400,
                      fontStyle:
                        layer.isItalic
                          ? 'italic'
                          : 'normal',
                      textAlign: layer.align,
                      textShadow:
                        layer.hasShadow
                          ? '2px 2px 4px rgba(18,18,18,0.7)'
                          : 'none',
                      lineHeight: 1.1,
                      maxWidth: '90%',
                    }}
                  >
                    {layer.text}
                  </div>

                ))}

              {/* SUBTLE LIGHT OVERLAY */}

              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/5 via-transparent to-white/10" />

            </div>

            {/* RIGHT EDGE */}

            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-black/30 pointer-events-none" />

            {/* BOTTOM EDGE */}

            <div className="absolute left-0 right-0 bottom-0 h-1.5 bg-black/40 pointer-events-none" />

          </div>

          {/* ==================================================
              HEIGHT RULER
          =================================================== */}

          {showRuler && (
            <div className="flex items-center justify-center mt-1">

              <div className="text-[11px] font-semibold text-[#171513] bg-[#F8F5F0]/95 px-2.5 py-0.5 rounded-lg shadow-md border border-[#D9CEBF] font-mono tracking-tight">

                <span>
                  ↕ Alto: {heightCm} cm
                </span>

              </div>

            </div>
          )}

        </div>
      </div>

      {/* ======================================================
          BOTTOM SIZE BAR
      ======================================================= */}

      <div className="relative z-20 bg-[#F8F5F0]/95 backdrop-blur-md p-3.5 sm:p-4 border-t border-[#E7E1D8]">

        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">

          {/* INFO */}

          <div className="flex items-center gap-2 text-xs text-[#4A352B]">

            <Info
              className="w-4 h-4 shrink-0"
              style={{
                color: accentColor,
              }}
            />

            <span className="font-medium text-center lg:text-left">
              Comparativa visual respecto a un sofá estándar de 210 cm.
            </span>

          </div>

          {/* SIZE BUTTONS */}

          <div className="flex items-center gap-1.5 flex-wrap justify-center">

            {comparisonSizes.map((size) => {

              const isSelected =
                size.id === customization.size.id;

              return (
                <button
                  type="button"
                  key={size.id}
                  onClick={() =>
                    onSelectSize(size)
                  }
                  className={[
                    'px-3',
                    'py-1.5',
                    'rounded-lg',
                    'text-xs',
                    'font-medium',
                    'transition-all',
                    'flex',
                    'items-center',
                    'gap-1.5',
                    isSelected
                      ? 'bg-[#171513] text-white shadow-md ring-1 ring-[#B99A62]'
                      : 'bg-white text-[#4A352B] hover:bg-[#F2ECE1] border border-[#D9CEBF]',
                  ].join(' ')}
                >

                  {isSelected && (
                    <Check
                      className="w-3.5 h-3.5"
                      style={{
                        color: accentColor,
                      }}
                    />
                  )}

                  <span>
                    {size.label}
                  </span>

                </button>
              );
            })}

          </div>
        </div>
      </div>

    </div>
  );
};

export default RoomVisualizer;
