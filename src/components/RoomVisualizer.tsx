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
  const [showRuler, setShowRuler] = useState<boolean>(true);

  /*
   * ============================================================
   * CURRENT SIZE
   * ============================================================
   */

  const { widthCm, heightCm } = customization.size;

  /*
   * ============================================================
   * REAL WORLD SCALE
   * ============================================================
   *
   * Approximate visible wall width.
   * This is only used for the visual room preview.
   */

  const wallWidthCm = 280;

  const canvasWidthPercent = Math.min(
    85,
    Math.max(12, (widthCm / wallWidthCm) * 100)
  );

  /*
   * ============================================================
   * IMAGE FILTER
   * ============================================================
   */

  const filterStyle = useMemo(() => {
    return getCombinedFilterStyle(
      customization.filter,
      customization.adjustments
    );
  }, [
    customization.filter,
    customization.adjustments,
  ]);

  /*
   * ============================================================
   * FRAME STYLE
   * ============================================================
   */

  const frameStyle = useMemo(() => {
    switch (customization.frameStyle) {
      case 'floating_oak':
        return {
          padding: '8px',
          backgroundColor: '#b3825a',
          border: 'none',
        };

      case 'floating_black':
        return {
          padding: '8px',
          backgroundColor: '#171513',
          border: 'none',
        };

      case 'floating_white':
        return {
          padding: '8px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #d4d4d4',
        };

      case 'gold_vintage':
        return {
          padding: '10px',
          background:
            'linear-gradient(135deg, #c99a38, #e8c872, #ab7c20)',
          border: 'none',
        };

      default:
        return {
          padding: '0px',
          backgroundColor: 'transparent',
          border: 'none',
        };
    }
  }, [customization.frameStyle]);

  /*
   * ============================================================
   * COMPARISON SIZES
   * ============================================================
   */

  const comparisonSizes = useMemo(() => {
    const source =
      availableSizes && availableSizes.length > 0
        ? availableSizes
        : CANVAS_SIZES;

    return source.slice(0, 5);
  }, [availableSizes]);

  /*
   * ============================================================
   * TEXT LAYERS
   * ============================================================
   */

  const textLayers = customization.textLayers || [];

  /*
   * ============================================================
   * IMAGE TRANSFORM
   * ============================================================
   */

  const imageTransform = customization.transform;

  const imageTransformStyle = {
    transform: [
      `scale(${imageTransform.zoom})`,
      `translate(${imageTransform.panX}%, ${imageTransform.panY}%)`,
      `rotate(${imageTransform.rotateAngle}deg)`,
      `scaleX(${imageTransform.flipH ? -1 : 1})`,
      `scaleY(${imageTransform.flipV ? -1 : 1})`,
    ].join(' '),
  };

  /*
   * ============================================================
   * COMPONENT
   * ============================================================
   */

  return (
    <div
      className="
        relative
        w-full
        h-full
        min-h-[500px]
        lg:min-h-[620px]
        rounded-2xl
        overflow-hidden
        bg-[#171513]
        select-none
        flex
        flex-col
        justify-between
        border
        border-[#E7E1D8]
      "
    >
      {/* ======================================================
          TOP MODE SWITCH
          ====================================================== */}

      <div
        className="
          absolute
          top-5
          left-1/2
          -translate-x-1/2
          z-30
          flex
          items-center
          bg-[#F8F5F0]/95
          backdrop-blur-md
          p-1
          rounded-full
          shadow-lg
          border
          border-[#D9CEBF]
        "
      >
        {/* 3D MODE */}

        <button
          type="button"
          onClick={() => onViewModeChange('3d')}
          className={`
            px-5
            py-2
            text-xs
            font-semibold
            rounded-full
            transition-all
            flex
            items-center
            gap-1.5
            ${
              viewMode === '3d'
                ? 'bg-[#171513] text-[#FFFFFF] shadow-md'
                : 'text-[#4A352B] hover:text-[#171513] hover:bg-[#FAF8F5]'
            }
          `}
        >
          <Rotate3d
            className="w-3.5 h-3.5"
            style={{ color: primaryColor }}
          />

          <span>3D</span>
        </button>

        {/* ROOM MODE */}

        <button
          type="button"
          onClick={() => onViewModeChange('room')}
          className={`
            px-5
            py-2
            text-xs
            font-semibold
            rounded-full
            transition-all
            flex
            items-center
            gap-1.5
            ${
              viewMode === 'room'
                ? 'bg-[#171513] text-[#FFFFFF] shadow-md'
                : 'text-[#4A352B] hover:text-[#171513] hover:bg-[#FAF8F5]'
            }
          `}
        >
          <Eye
            className="w-3.5 h-3.5"
            style={{ color: primaryColor }}
          />

          <span>Compare Sizes</span>
        </button>
      </div>

      {/* ======================================================
          RULER BUTTON
          ====================================================== */}

      <div className="absolute top-5 right-5 z-30">
        <button
          type="button"
          onClick={() => setShowRuler((previous) => !previous)}
          className={`
            px-3
            py-1.5
            rounded-xl
            text-xs
            font-medium
            backdrop-blur-md
            transition-all
            flex
            items-center
            gap-1.5
            ${
              showRuler
                ? 'bg-[#171513]/90 text-[#FFFFFF] border border-[#B99A62] shadow-md'
                : 'bg-[#F8F5F0]/90 text-[#4A352B] border border-[#D9CEBF]'
            }
          `}
        >
          <Ruler
            className="w-3.5 h-3.5"
            style={{ color: primaryColor }}
          />

          <span>
            {showRuler ? 'Ocultar cotas' : 'Ver cotas (cm)'}
          </span>
        </button>
      </div>

      {/* ======================================================
          ROOM AREA
          ====================================================== */}

      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* ROOM BACKGROUND */}

        <img
          src={ROOM_MOCKUP_IMAGE}
          alt="Salón interior"
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
            object-center
          "
          style={{
            filter: 'brightness(0.98)',
          }}
        />

        {/* BACKGROUND OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-[#171513]/10
            pointer-events-none
          "
        />

        {/* ==================================================
            CANVAS CONTAINER
            ================================================== */}

        <div
          className="
            relative
            z-10
            flex
            flex-col
            items-center
            justify-center
            transition-all
            duration-300
          "
          style={{
            width: `${canvasWidthPercent * 0.95}%`,
            maxWidth: '460px',
            marginBottom: '7%',
          }}
        >
          {/* ==================================================
              TOP WIDTH RULER
              ================================================== */}

          {showRuler && (
            <div
              className="
                w-full
                flex
                items-center
                justify-center
                mb-1
                text-[11px]
                font-semibold
                text-[#171513]
                bg-[#F8F5F0]/95
                px-2.5
                py-0.5
                rounded-lg
                shadow-md
                border
                border-[#D9CEBF]
                font-mono
                tracking-tight
              "
            >
              <span>
                ↔ Ancho: {widthCm} cm
              </span>
            </div>
          )}

          {/* ==================================================
              CANVAS / PRINT
              ================================================== */}

          <div
            className="
              relative
              w-full
              overflow-hidden
              transition-all
              duration-300
            "
            style={{
              aspectRatio: `${widthCm} / ${heightCm}`,
              boxShadow:
                '0 25px 50px -12px rgba(18,18,18,0.45)',
              ...frameStyle,
            }}
          >
            {/* =================================================
                IMAGE AREA
                ================================================= */}

            <div
              className="
                w-full
                h-full
                relative
                overflow-hidden
                bg-[#F8F5F0]
              "
            >
              {/* MAIN PHOTO */}

              {customization.selectedImage ? (
                <img
                  src={customization.selectedImage}
                  alt="Vista previa del lienzo"
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                    origin-center
                  "
                  style={{
                    filter: filterStyle,
                    ...imageTransformStyle,
                  }}
                />
              ) : (
                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    bg-[#F8F5F0]
                    text-[#4A352B]
                    text-sm
                  "
                >
                  <span>
                    Vista previa de tu fotografía
                  </span>
                </div>
              )}

              {/* =================================================
                  TEXT LAYERS
                  ================================================= */}

              {textLayers.map((layer) => (
                <div
                  key={layer.id}
                  className="
                    absolute
                    select-none
                    pointer-events-none
                  "
                  style={{
                    left: `${layer.x}%`,
                    top: `${layer.y}%`,
                    transform:
                      'translate(-50%, -50%)',
                    fontFamily: layer.font,
                    fontSize: `${Math.max(
                      8,
                      layer.fontSize * 0.4
                    )}px`,
                    color: layer.color,
                    fontWeight:
                      layer.isBold ? 700 : 400,
                    fontStyle:
                      layer.isItalic
                        ? 'italic'
                        : 'normal',
                    textAlign: layer.align,
                    textShadow: layer.hasShadow
                      ? '2px 2px 4px rgba(18,18,18,0.7)'
                      : 'none',
                    lineHeight: 1.1,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {layer.text}
                </div>
              ))}

              {/* =================================================
                  LIGHT OVERLAY
                  ================================================= */}

              <div
                className="
                  absolute
                  inset-0
                  pointer-events-none
                  bg-gradient-to-tr
                  from-black/5
                  via-transparent
                  to-white/10
                "
              />
            </div>

            {/* =================================================
                EDGE SHADOWS
                ================================================= */}

            <div
              className="
                absolute
                right-0
                top-0
                bottom-0
                w-1.5
                bg-[#171513]/30
                pointer-events-none
              "
            />

            <div
              className="
                absolute
                left-0
                right-0
                bottom-0
                h-1.5
                bg-[#171513]/40
                pointer-events-none
              "
            />
          </div>

          {/* ==================================================
              HEIGHT RULER
              ================================================== */}

          {showRuler && (
            <div
              className="
                flex
                items-center
                justify-center
                mt-1
                text-[11px]
                font-semibold
                text-[#171513]
                bg-[#F8F5F0]/95
                px-2.5
                py-0.5
                rounded-lg
                shadow-md
                border
                border-[#D9CEBF]
                font-mono
                tracking-tight
              "
            >
              <span>
                ↕ Alto: {heightCm} cm
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
          BOTTOM COMPARISON BAR
          ====================================================== */}

      <div
        className="
          relative
          z-20
          bg-[#F8F5F0]/95
          backdrop-blur-md
          p-3.5
          sm:p-4
          border-t
          border-[#E7E1D8]
        "
      >
        <div
          className="
            max-w-3xl
            mx-auto
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-3
          "
        >
          {/* INFO */}

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-[#4A352B]
            "
          >
            <Info
              className="w-4 h-4 shrink-0"
              style={{ color: primaryColor }}
            />

            <span className="font-medium">
              Comparativa a escala real respecto a
              un sofá estándar de 210 cm:
            </span>
          </div>

          {/* SIZE BUTTONS */}

          <div
            className="
              flex
              items-center
              gap-1.5
              flex-wrap
              justify-center
            "
          >
            {comparisonSizes.map((size) => {
              const isSelected =
                size.id === customization.size.id;

              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() =>
                    onSelectSize(size)
                  }
                  className={`
                    px-3
                    py-1.5
                    rounded-lg
                    text-xs
                    font-medium
                    transition-all
                    flex
                    items-center
                    gap-1.5
                    ${
                      isSelected
                        ? 'bg-[#171513] text-[#FFFFFF] shadow-md ring-1 ring-[#B99A62]'
                        : 'bg-[#FFFFFF] text-[#4A352B] hover:bg-[#F2ECE1] border border-[#D9CEBF]'
                    }
                  `}
                >
                  {isSelected && (
                    <Check
                      className="w-3.5 h-3.5"
                      style={{
                        color: primaryColor,
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
