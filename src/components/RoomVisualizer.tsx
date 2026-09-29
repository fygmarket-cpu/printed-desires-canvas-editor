import React, { useMemo, useState } from 'react';
import { CanvasCustomization, CanvasSize } from '../types/canvas';
import { MaterialConfig } from '../types/materials';
import { CANVAS_SIZES, ROOM_MOCKUP_IMAGE } from '../data/canvasPresets';
import { getCombinedFilterStyle } from '../utils/canvasHelpers';
import {
  Rotate3d,
  Eye,
  Check,
  Ruler,
  Info,
  Image as ImageIcon,
} from 'lucide-react';

interface RoomVisualizerProps {
  customization: CanvasCustomization;

  onSelectSize: (size: CanvasSize) => void;

  onViewModeChange: (mode: '3d' | 'room') => void;

  viewMode: '3d' | 'room';

  primaryColor?: string;

  availableSizes?: CanvasSize[];

  /**
   * Material universal.
   *
   * Si no se proporciona se utiliza Canvas.
   */
  material?: MaterialConfig;

  /**
   * Imagen de habitación opcional.
   *
   * Si no existe:
   * material.preview.roomImage
   * ROOM_MOCKUP_IMAGE
   */
  roomImage?: string;
}

export const RoomVisualizer: React.FC<RoomVisualizerProps> = ({
  customization,
  onSelectSize,
  onViewModeChange,
  viewMode,
  primaryColor = '#B99A62',
  availableSizes,
  material,
  roomImage,
}) => {
  const [showRuler, setShowRuler] = useState<boolean>(true);

  const [roomImageError, setRoomImageError] = useState<boolean>(false);

  const [productImageError, setProductImageError] =
    useState<boolean>(false);

  /*
   * ============================================================
   * UNIVERSAL MATERIAL
   * ============================================================
   */

  const materialType =
    material?.previewType || 'canvas';

  const materialName =
    material?.displayName || 'Canvas Prints';

  const materialPreview =
    material?.preview;

  /*
   * ============================================================
   * SIZE
   * ============================================================
   */

  const { widthCm, heightCm } =
    customization.size;

  /*
   * ============================================================
   * ROOM IMAGE
   * ============================================================
   */

  const resolvedRoomImage =
    roomImage ||
    materialPreview?.roomImage ||
    ROOM_MOCKUP_IMAGE;

  /*
   * ============================================================
   * FILTER
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
   * REAL WORLD SCALE
   * ============================================================
   *
   * We use a virtual wall width of 280cm.
   *
   * The product is then scaled proportionally.
   */

  const wallWidthCm = 280;

  const rawCanvasWidthPercent =
    (widthCm / wallWidthCm) * 100;

  const canvasWidthPercent = Math.min(
    78,
    Math.max(15, rawCanvasWidthPercent)
  );

  /*
   * Important:
   *
   * We do NOT calculate the height as a percentage
   * of the parent because that can create overflow.
   *
   * Aspect ratio is handled by CSS.
   */

  /*
   * ============================================================
   * MATERIAL VISUAL CONFIGURATION
   * ============================================================
   */

  const materialVisual = useMemo(() => {
    switch (materialType) {
      case 'framed':
        return {
          outerPadding: 'p-2.5',
          background:
            'linear-gradient(135deg,#171513,#4A352B,#171513)',
          border:
            '1px solid rgba(20,20,20,0.85)',
          shadow:
            '0 30px 60px -15px rgba(0,0,0,.55)',
          innerBackground: '#F8F5F0',
          label: 'Framed Print',
        };

      case 'metal':
        return {
          outerPadding: 'p-[3px]',
          background:
            'linear-gradient(135deg,#d9d9d9,#ffffff,#a8a8a8)',
          border:
            '1px solid rgba(255,255,255,.8)',
          shadow:
            '0 25px 55px -15px rgba(0,0,0,.50)',
          innerBackground: '#FFFFFF',
          label: 'Metal Print',
        };

      case 'acrylic':
        return {
          outerPadding: 'p-1',
          background:
            'linear-gradient(135deg,rgba(255,255,255,.95),rgba(210,210,210,.55),rgba(255,255,255,.95))',
          border:
            '1px solid rgba(255,255,255,.9)',
          shadow:
            '0 30px 65px -15px rgba(0,0,0,.48)',
          innerBackground: '#FFFFFF',
          label: 'Acrylic Print',
        };

      case 'poster':
        return {
          outerPadding: 'p-0',
          background: '#FFFFFF',
          border:
            '1px solid rgba(0,0,0,.18)',
          shadow:
            '0 25px 50px -15px rgba(0,0,0,.42)',
          innerBackground: '#FFFFFF',
          label: 'Poster Print',
        };

      case 'canvas':
      default:
        return {
          outerPadding: 'p-0',
          background: '#F8F5F0',
          border:
            '1px solid rgba(255,255,255,.25)',
          shadow:
            '0 25px 50px -12px rgba(18,18,18,.45)',
          innerBackground: '#F8F5F0',
          label: 'Canvas Print',
        };
    }
  }, [materialType]);

  /*
   * ============================================================
   * FRAME CONFIGURATION
   * ============================================================
   */

  const frameStyleClass = useMemo(() => {
    if (materialType !== 'framed') {
      return '';
    }

    switch (customization.frameStyle) {
      case 'floating_oak':
        return 'bg-[#B3825A]';

      case 'floating_black':
        return 'bg-neutral-950';

      case 'floating_white':
        return 'bg-neutral-100 border border-neutral-300';

      case 'gold_vintage':
        return 'bg-gradient-to-br from-[#C99A38] via-[#E8C872] to-[#AB7C20]';

      default:
        return 'bg-neutral-950';
    }
  }, [
    customization.frameStyle,
    materialType,
  ]);

  /*
   * ============================================================
   * FRAME PADDING
   * ============================================================
   */

  const framePadding =
    materialType === 'framed'
      ? 'p-2'
      : materialVisual.outerPadding;

  /*
   * ============================================================
   * COMPARISON SIZES
   * ============================================================
   */

  const comparisonSizes = useMemo(() => {
    const list =
      availableSizes &&
      availableSizes.length > 0
        ? availableSizes
        : material?.sizes &&
          material.sizes.length > 0
        ? material.sizes
        : CANVAS_SIZES;

    return list.slice(0, 5);
  }, [
    availableSizes,
    material?.sizes,
  ]);

  /*
   * ============================================================
   * PRODUCT IMAGE
   * ============================================================
   */

  const hasProductImage =
    Boolean(customization.selectedImage) &&
    !productImageError;

  /*
   * ============================================================
   * TEXT
   * ============================================================
   */

  const materialTitle =
    material?.ui?.title ||
    materialName;

  /*
   * ============================================================
   * RENDER
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
          TOP MODE SELECTOR
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
          shadow-luxury-md
          border
          border-[#D9CEBF]
        "
      >
        <button
          type="button"
          onClick={() =>
            onViewModeChange('3d')
          }
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
                ? 'bg-[#171513] text-[#FFFFFF] shadow-luxury-sm'
                : 'text-[#4A352B] hover:text-[#171513] hover:bg-[#FAF8F5]'
            }
          `}
        >
          <Rotate3d
            className="w-3.5 h-3.5"
            style={{
              color: primaryColor,
            }}
          />

          <span>3D</span>
        </button>

        <button
          type="button"
          onClick={() =>
            onViewModeChange('room')
          }
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
                ? 'bg-[#171513] text-[#FFFFFF] shadow-luxury-sm'
                : 'text-[#4A352B] hover:text-[#171513] hover:bg-[#FAF8F5]'
            }
          `}
        >
          <Eye
            className="w-3.5 h-3.5"
            style={{
              color: primaryColor,
            }}
          />

          <span>Comparar</span>
        </button>
      </div>

      {/* ======================================================
          RULER
      ====================================================== */}

      <div className="absolute top-5 right-5 z-30">
        <button
          type="button"
          onClick={() =>
            setShowRuler((value) => !value)
          }
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
                ? 'bg-[#171513]/90 text-[#FFFFFF] border border-[#B99A62] shadow-luxury-sm'
                : 'bg-[#F8F5F0]/90 text-[#4A352B] border border-[#D9CEBF]'
            }
          `}
        >
          <Ruler
            className="w-3.5 h-3.5"
            style={{
              color: primaryColor,
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
          MATERIAL LABEL
      ====================================================== */}

      <div className="absolute left-5 top-5 z-20">
        <div
          className="
            bg-[#171513]/80
            backdrop-blur-md
            text-white
            rounded-xl
            px-3
            py-2
            border
            border-white/10
            shadow-lg
          "
        >
          <div className="flex items-center gap-2">
            <ImageIcon
              className="w-3.5 h-3.5"
              style={{
                color: primaryColor,
              }}
            />

            <span className="text-[11px] font-medium">
              {materialTitle}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================
          ROOM / WALL
      ====================================================== */}

      <div
        className="
          relative
          w-full
          h-full
          flex
          items-center
          justify-center
          overflow-hidden
        "
      >
        {/* ROOM BACKGROUND */}

        {!roomImageError ? (
          <img
            src={resolvedRoomImage}
            alt="Room preview"
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              object-center
            "
            onError={() =>
              setRoomImageError(true)
            }
          />
        ) : (
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-[#6f6257]
              via-[#b7a99b]
              to-[#4a4038]
            "
          />
        )}

        {/* ROOM DARK OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-[#171513]/10
            pointer-events-none
          "
        />

        {/* ==================================================
            PRODUCT
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
            width: `${canvasWidthPercent}%`,
            maxWidth: '460px',
            marginBottom: '7%',
          }}
        >
          {/* TOP DIMENSION */}

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
                shadow-luxury-sm
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
              PRODUCT OUTER FRAME
          ================================================== */}

          <div
            className={`
              relative
              w-full
              overflow-hidden
              transition-all
              duration-300
              ${framePadding}
              ${frameStyleClass}
            `}
            style={{
              aspectRatio:
                `${widthCm} / ${heightCm}`,

              background:
                materialVisual.background,

              border:
                materialVisual.border,

              boxShadow:
                materialVisual.shadow,
            }}
          >
            {/* ==================================================
                PRODUCT SURFACE
            ================================================== */}

            <div
              className="
                w-full
                h-full
                relative
                overflow-hidden
              "
              style={{
                background:
                  materialVisual.innerBackground,
              }}
            >
              {/* PRODUCT IMAGE */}

              {hasProductImage ? (
                <img
                  src={customization.selectedImage}
                  alt={`${materialTitle} preview`}
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                    origin-center
                  "
                  onError={() =>
                    setProductImageError(true)
                  }
                  style={{
                    filter: filterStyle,

                    transform: `
                      scale(${customization.transform.zoom})
                      translate(
                        ${customization.transform.panX}%,
                        ${customization.transform.panY}%
                      )
                      rotate(
                        ${customization.transform.rotateAngle}deg
                      )
                      scaleX(
                        ${customization.transform.flipH
                          ? -1
                          : 1}
                      )
                      scaleY(
                        ${customization.transform.flipV
                          ? -1
                          : 1}
                      )
                    `,
                  }}
                />
              ) : (
                <div
                  className="
                    absolute
                    inset-0
                    flex
                    flex-col
                    items-center
                    justify-center
                    bg-[#F8F5F0]
                    text-[#4A352B]
                  "
                >
                  <ImageIcon
                    className="w-8 h-8 mb-2 text-[#B99A62]"
                  />

                  <span className="text-xs font-medium">
                    Vista previa
                  </span>

                  <span className="text-[10px] mt-1 opacity-60">
                    Sube una fotografía
                  </span>
                </div>
              )}

              {/* ==================================================
                  TEXT LAYERS
              ================================================== */}

              {customization.textLayers.map(
                (layer) => (
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

                      fontFamily:
                        layer.font,

                      fontSize:
                        `${layer.fontSize * 0.4}px`,

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
                          ? '2px 2px 4px rgba(18,18,18,0.7)'
                          : 'none',

                      lineHeight: 1.1,
                    }}
                  >
                    {layer.text}
                  </div>
                )
              )}

              {/* ==================================================
                  MATERIAL LIGHT
              ================================================== */}

              {materialType ===
                'acrylic' && (
                <div
                  className="
                    absolute
                    inset-0
                    pointer-events-none
                    bg-gradient-to-br
                    from-white/25
                    via-transparent
                    to-white/10
                  "
                />
              )}

              {materialType ===
                'metal' && (
                <div
                  className="
                    absolute
                    inset-0
                    pointer-events-none
                    bg-gradient-to-tr
                    from-white/5
                    via-transparent
                    to-white/15
                  "
                />
              )}

              {materialType ===
                'canvas' && (
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
              )}
            </div>

            {/* ==================================================
                PRODUCT EDGE
            ================================================== */}

            {materialType ===
              'canvas' && (
              <>
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
              </>
            )}

            {/* ==================================================
                ACRYLIC DEPTH
            ================================================== */}

            {materialType ===
              'acrylic' && (
              <div
                className="
                  absolute
                  right-0
                  top-0
                  bottom-0
                  w-1
                  bg-white/40
                  pointer-events-none
                />
            )}
          </div>

          {/* ==================================================
              BOTTOM DIMENSION
          ================================================== */}

         {/* Top Ruler Line */}
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
      shadow-luxury-sm
      border
      border-[#D9CEBF]
      font-mono
      tracking-tight
    "
  >
    <span>↔ Ancho: {widthCm} cm</span>
  </div>
)}
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
              style={{
                color: primaryColor,
              }}
            />

            <span className="font-medium">
              Comparativa proporcional respecto
              a una pared estándar.
            </span>
          </div>

          {/* SIZES */}

          <div
            className="
              flex
              items-center
              gap-1.5
              flex-wrap
              justify-center
            "
          >
            {comparisonSizes.map(
              (size) => {
                const isSelected =
                  size.id ===
                  customization.size.id;

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
                          ? 'bg-[#171513] text-[#FFFFFF] shadow-luxury-sm'
                          : 'bg-[#FFFFFF] text-[#4A352B] hover:bg-[#F2ECE1] border border-[#D9CEBF]'
                      }
                    `}
                  >
                    {isSelected && (
                      <Check
                        className="w-3.5 h-3.5"
                        style={{
                          color:
                            primaryColor,
                        }}
                      />
                    )}

                    <span>
                      {size.label}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
