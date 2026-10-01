import React, { useEffect, useMemo, useState } from 'react';

import {
  CanvasCustomization,
  CanvasSize,
  CurrencyConfig,
  FrameStyle,
  StoreConfig,
} from '../types/canvas';

import {
  MaterialId,
  getMaterialConfig,
} from '../materialConfig';

import {
  Check,
  ChevronDown,
  Edit3,
  Image as ImageIcon,
  Info,
  Palette,
  Plus,
  Ruler,
  Sliders,
  Sparkles,
  Truck,
} from 'lucide-react';

/* ============================================================
   PROPS
   ============================================================ */

interface SizeSelectorProps {
  materialId: MaterialId;
 materialId={selectedMaterial}
   customization: CanvasCustomization;

  config: StoreConfig;

  selectedCurrency: CurrencyConfig;

  onSelectSize: (size: CanvasSize) => void;

  onUpdateCustomization: (
    partial: Partial<CanvasCustomization>
  ) => void;

  onOpenEditor: () => void;

  onOpenImageModal: () => void;

  onAddToBasket: () => void;

  onOpenStoreEditor: () => void;

  onOpenShopify?: () => void;

  onQuickUpdateConfig?: (
    updater: (prev: StoreConfig) => StoreConfig
  ) => void;
}

/* ============================================================
   CATEGORY LABELS
   ============================================================ */

const CATEGORY_LABELS: Record<string, string> = {
  popular: 'Popular',
  portrait: 'Portrait',
  landscape: 'Landscape',
  square: 'Square',
  panoramic: 'Panoramic',
  custom: 'Custom',
};

/* ============================================================
   HELPERS
   ============================================================ */

function getCategoryLabel(category: string): string {
  if (CATEGORY_LABELS[category]) {
    return CATEGORY_LABELS[category];
  }

  return category
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatPrice(
  amount: number,
  currency: CurrencyConfig
): string {
  const converted =
    amount * (currency?.rate || 1);

  const symbol =
    currency?.symbol ||
    currency?.code ||
    '€';

  const value = converted.toFixed(2);

  if (currency?.position === 'suffix') {
    return `${value} ${symbol}`;
  }

  return `${symbol}${value}`;
}

/* ============================================================
   COMPONENT
   ============================================================ */

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  materialId,
  customization,
  config,
  selectedCurrency,

  onSelectSize,
  onUpdateCustomization,

  onOpenEditor,
  onOpenImageModal,
  onAddToBasket,
  onOpenStoreEditor,

  onOpenShopify,
  onQuickUpdateConfig,
}) => {
  /* ==========================================================
     MATERIAL CONFIG
     ========================================================== */

  const materialConfig =
    getMaterialConfig(materialId);

  /* ==========================================================
     UI STATE
     ========================================================== */

  const [activeCategory, setActiveCategory] =
    useState<string>('');

  const [showOptions, setShowOptions] =
    useState<boolean>(false);

  const [customW, setCustomW] =
    useState<number>(
      customization.size.widthCm
    );

  const [customH, setCustomH] =
    useState<number>(
      customization.size.heightCm
    );

  /* ==========================================================
     MATERIAL AVAILABILITY
     ========================================================== */

  const materialAvailable =
    materialConfig.admin?.availableForSale !== false;

  /* ==========================================================
     MATERIAL SIZES
     ========================================================== */

  const materialSizes = useMemo(
    () => materialConfig.sizes || [],
    [materialConfig.sizes]
  );

  /* ==========================================================
     CATEGORIES
     ========================================================== */

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        materialSizes
          .map((size) => size.category)
          .filter(Boolean)
      )
    );
  }, [materialSizes]);

  /* ==========================================================
     INITIAL / SYNCHRONIZED CATEGORY
     ========================================================== */

  useEffect(() => {
    const currentCategory =
      customization.size.category;

    if (
      currentCategory &&
      categories.includes(currentCategory)
    ) {
      setActiveCategory(currentCategory);
      return;
    }

    if (
      activeCategory &&
      categories.includes(activeCategory)
    ) {
      return;
    }

    setActiveCategory(
      categories[0] || 'popular'
    );
  }, [
    customization.size.category,
    categories,
    activeCategory,
  ]);

  /* ==========================================================
     FILTERED SIZES
     ========================================================== */

  const filteredSizes = useMemo(() => {
    return materialSizes.filter(
      (size) =>
        size.category === activeCategory
    );
  }, [
    materialSizes,
    activeCategory,
  ]);

  /* ==========================================================
     MATERIAL OPTIONS
     ========================================================== */

  const frameColors =
    materialConfig.options?.frameColors || [];

  const finishes =
    materialConfig.options?.finishes || [];

  const thicknesses =
    materialConfig.options?.thicknesses || [];

  const mounting =
    materialConfig.options?.mounting || [];

  const hasOptions =
    frameColors.length > 0 ||
    finishes.length > 0 ||
    thicknesses.length > 0 ||
    mounting.length > 0;

  /* ==========================================================
     CUSTOM SIZE
     ========================================================== */

  const allowCustomSize =
    materialConfig.pricing?.allowCustomSize ?? false;

  const customSizeMinimumPrice =
    materialConfig.pricing
      ?.customSizeMinimumPrice ?? 0;

  /* ==========================================================
     SELECTED FRAME
     ========================================================== */

  const selectedFrame =
    config.frames?.find(
      (frame) =>
        frame.id ===
        customization.frameStyle
    );

  const frameExtraPrice =
    materialId === 'canvas'
      ? selectedFrame?.price || 0
      : 0;

  /* ==========================================================
     SELECTED DEPTH
     ========================================================== */

  const selectedDepth =
    config.depthOptions?.find(
      (depth) =>
        depth.depthCm ===
        customization.depthCm
    );

  const depthExtraPrice =
    materialId === 'canvas'
      ? selectedDepth?.extraPrice || 0
      : 0;

  /* ==========================================================
     PRICE
     ========================================================== */

  const basePrice =
    customization.size.discountedPrice;

  const originalPrice =
    customization.size.originalPrice;

  const totalPrice =
    basePrice +
    frameExtraPrice +
    depthExtraPrice;

  const totalOriginalPrice =
    originalPrice +
    frameExtraPrice +
    depthExtraPrice;

  const discountPercent =
    totalOriginalPrice > 0
      ? Math.max(
          0,
          Math.round(
            (
              (totalOriginalPrice -
                totalPrice) /
              totalOriginalPrice
            ) * 100
          )
        )
      : 0;

  /* ==========================================================
     MATERIAL TEXT
     ========================================================== */

  const title =
    materialConfig.ui.title ||
    materialConfig.displayName;

  const subtitle =
    materialConfig.ui.subtitle ||
    materialConfig.description;

  const uploadText =
    materialConfig.ui.uploadText ||
    'Upload your photo';

  const sizeText =
    materialConfig.ui.sizeText ||
    'Choose your size';

  const addToCartText =
    materialConfig.ui.addToCartText ||
    'Add to cart';

  /* ==========================================================
     SELECT SIZE
     ========================================================== */

  const handleSelectSize = (
    size: CanvasSize
  ) => {
    onSelectSize(size);
  };

  /* ==========================================================
     FRAME
     ========================================================== */

  const handleFrameChange = (
    value: string
  ) => {
    let frameId: FrameStyle =
      'none';

    const normalized =
      value.toLowerCase();

    if (
      normalized.includes('natural') ||
      normalized.includes('oak') ||
      normalized.includes('wood')
    ) {
      frameId = 'floating_oak';
    }

    if (
      normalized.includes('black') ||
      normalized.includes('negro')
    ) {
      frameId = 'floating_black';
    }

    if (
      normalized.includes('white') ||
      normalized.includes('blanco')
    ) {
      frameId = 'floating_white';
    }

    if (
      normalized.includes('gold') ||
      normalized.includes('oro')
    ) {
      frameId = 'gold_vintage';
    }

    onUpdateCustomization({
      frameStyle: frameId,
    });
  };

  /* ==========================================================
     DEPTH
     ========================================================== */

  const handleDepthChange = (
    value: string
  ) => {
    const depth =
      parseInt(value, 10);

    if (
      depth === 2 ||
      depth === 4
    ) {
      onUpdateCustomization({
        depthCm: depth,
      });
    }
  };

  /* ==========================================================
     CUSTOM SIZE
     ========================================================== */

  const handleApplyCustomSize = () => {
    if (!allowCustomSize) {
      return;
    }

    const width =
      Number(customW);

    const height =
      Number(customH);

    if (
      !Number.isFinite(width) ||
      !Number.isFinite(height)
    ) {
      return;
    }

    if (
      width < 15 ||
      height < 15 ||
      width > 250 ||
      height > 250
    ) {
      return;
    }

    /*
     * Precio calculado por superficie.
     *
     * Se utiliza únicamente para tamaños
     * personalizados.
     */
    const areaM2 =
      (width * height) / 10000;

    const calculatedPrice =
      Math.max(
        customSizeMinimumPrice,
        Math.round(
          areaM2 * 75 * 100
        ) / 100
      );

    const calculatedOriginal =
      Math.round(
        calculatedPrice * 1.8 * 100
      ) / 100;

    const discount =
      calculatedOriginal > 0
        ? Math.max(
            0,
            Math.round(
              (
                (calculatedOriginal -
                  calculatedPrice) /
                calculatedOriginal
              ) * 100
            )
          )
        : 0;

    const customSize: CanvasSize = {
      id:
        `${materialId}-custom-${width}x${height}`,

      label:
        `${width} x ${height}cm`,

      widthCm: width,

      heightCm: height,

      originalPrice:
        calculatedOriginal,

      discountedPrice:
        calculatedPrice,

      discountPercent:
        discount,

      category:
        'custom',

      isBestSeller:
        false,
    };

    onSelectSize(customSize);

    setActiveCategory('custom');
  };

  /* ==========================================================
     QUICK ADD SIZE
     ========================================================== */

  const handleQuickAddSize = () => {
    const label =
      window.prompt(
        'Dimensiones del nuevo formato:',
        '45 x 60cm'
      );

    if (!label) {
      return;
    }

    const originalInput =
      window.prompt(
        'Precio original:',
        '59.95'
      );

    const discountedInput =
      window.prompt(
        'Precio final:',
        '29.99'
      );

    const parts =
      label
        .replace(/[^0-9xX.,]/g, '')
        .replace(/,/g, '.')
        .split(/[xX]/);

    const width =
      parseFloat(parts[0]) || 45;

    const height =
      parseFloat(parts[1]) || 60;

    const originalPrice =
      parseFloat(
        originalInput || ''
      ) || 59.95;

    const discountedPrice =
      parseFloat(
        discountedInput || ''
      ) || 29.99;

    const discount =
      originalPrice > 0
        ? Math.max(
            0,
            Math.round(
              (
                (originalPrice -
                  discountedPrice) /
                originalPrice
              ) * 100
            )
          )
        : 0;

    const newSize: CanvasSize = {
      id:
        `${materialId}-size-${Date.now()}`,

      label,

      widthCm: width,

      heightCm: height,

      originalPrice,

      discountedPrice,

      discountPercent:
        discount,

      category:
        activeCategory || 'popular',

      isBestSeller:
        false,
    };

    /*
     * Mantiene compatibilidad con
     * StoreConfig.sizes.
     *
     * La configuración principal por
     * material continúa estando en
     * materialConfig.
     */
    if (onQuickUpdateConfig) {
      onQuickUpdateConfig(
        (previous) => ({
          ...previous,

          sizes: [
            newSize,
            ...previous.sizes,
          ],
        })
      );
    }

    onSelectSize(newSize);
  };

  /* ==========================================================
     CURRENT FRAME LABEL
     ========================================================== */

  const currentFrameLabel =
    selectedFrame?.name ||
    customization.frameStyle ||
    'Sin marco';

  /* ==========================================================
     CURRENT DEPTH LABEL
     ========================================================== */

  const currentDepthLabel =
    `${customization.depthCm} cm`;

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div
      className="
        w-full
        h-full
        bg-white
        rounded-2xl
        border
        border-[#E7E1D8]
        shadow-lg
        overflow-hidden
        flex
        flex-col
      "
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          px-4
          py-4
          sm:px-5
          sm:py-5
          bg-[#F8F5F0]
          border-b
          border-[#E7E1D8]
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >

          <div className="min-w-0">

            <div
              className="
                text-[10px]
                uppercase
                tracking-[0.18em]
                font-semibold
                text-[#4A352B]/60
                mb-1
              "
            >
              {title}
            </div>

            <div
              className="
                text-xl
                sm:text-2xl
                text-[#171513]
                font-serif-display
                tracking-tight
              "
            >
              {customization.size.label}
            </div>

            <p
              className="
                mt-1
                text-[11px]
                leading-relaxed
                text-[#4A352B]/65
                line-clamp-2
              "
            >
              {subtitle}
            </p>

          </div>

          <div
            className="
              flex
              items-center
              gap-1.5
              shrink-0
            "
          >

            <button
              type="button"
              onClick={onOpenEditor}
              className="
                flex
                items-center
                gap-1.5
                px-3
                py-2
                rounded-lg
                border
                border-[#D9CEBF]
                bg-white
                text-xs
                font-medium
                text-[#171513]
                hover:bg-[#F2ECE1]
                transition
              "
            >
              <Edit3
                className="
                  w-3.5
                  h-3.5
                  text-[#B99A62]
                "
              />

              <span className="hidden sm:inline">
                Editar
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenImageModal}
              title={uploadText}
              className="
                flex
                items-center
                gap-1.5
                px-3
                py-2
                rounded-lg
                border
                border-[#D9CEBF]
                bg-white
                text-xs
                font-medium
                text-[#171513]
                hover:bg-[#F2ECE1]
                transition
              "
            >
              <ImageIcon
                className="
                  w-3.5
                  h-3.5
                  text-[#B99A62]
                "
              />

              <span className="hidden sm:inline">
                Cambiar foto
              </span>

              <span className="sm:hidden">
                Foto
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenStoreEditor}
              title="Configuración"
              className="
                p-2
                rounded-lg
                border
                border-[#D9CEBF]
                bg-white
                hover:bg-[#F2ECE1]
                transition
              "
            >
              <Sliders
                className="
                  w-3.5
                  h-3.5
                  text-[#B99A62]
                "
              />
            </button>

          </div>

        </div>
      </div>

      {/* ======================================================
          MATERIAL BAR
      ====================================================== */}

      <div
        className="
          px-4
          py-2.5
          bg-white
          border-b
          border-[#E7E1D8]
          flex
          items-center
          justify-between
          gap-3
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            min-w-0
          "
        >
          <Palette
            className="
              w-4
              h-4
              text-[#B99A62]
              shrink-0
            "
          />

          <span
            className="
              text-xs
              font-medium
              text-[#4A352B]
              truncate
            "
          >
            {materialConfig.displayName}
          </span>
        </div>

        {!materialAvailable && (
          <span
            className="
              px-2
              py-1
              rounded-full
              bg-[#B98989]
              text-white
              text-[9px]
              font-bold
              uppercase
              tracking-wider
            "
          >
            No disponible
          </span>
        )}

      </div>

      {/* ======================================================
          CATEGORY TABS
      ====================================================== */}

      <div
        className="
          px-4
          pt-3
          border-b
          border-[#E7E1D8]
          flex
          items-center
          gap-5
          overflow-x-auto
          bg-white
        "
      >

        {categories.map(
          (category) => {

            const active =
              activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`
                  relative
                  pb-3
                  whitespace-nowrap
                  text-xs
                  font-medium
                  transition-colors
                  ${
                    active
                      ? 'text-[#171513] font-semibold'
                      : 'text-[#4A352B]/60 hover:text-[#171513]'
                  }
                `}
              >
                {getCategoryLabel(category)}

                {active && (
                  <span
                    className="
                      absolute
                      left-0
                      right-0
                      bottom-0
                      h-0.5
                      bg-[#B99A62]
                      rounded-full
                    "
                  />
                )}
              </button>
            );
          }
        )}

        <button
          type="button"
          onClick={handleQuickAddSize}
          className="
            pb-3
            flex
            items-center
            gap-1
            whitespace-nowrap
            text-xs
            font-medium
            text-[#B99A62]
            hover:text-[#171513]
          "
        >
          <Plus className="w-3.5 h-3.5" />
          Añadir
        </button>

      </div>

      {/* ======================================================
          SIZE CONTENT
      ====================================================== */}

      <div
        className="
          flex-1
          overflow-y-auto
          p-4
          bg-white
        "
      >

        {/* ====================================================
            SIZE TITLE
        ==================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Ruler
              className="
                w-4
                h-4
                text-[#B99A62]
              "
            />

            <span
              className="
                text-sm
                font-semibold
                text-[#171513]
              "
            >
              {sizeText}
            </span>
          </div>

          <span
            className="
              text-[10px]
              text-[#4A352B]/55
            "
          >
            {materialSizes.length} formatos
          </span>

        </div>

        {/* ====================================================
            SIZE LIST
        ==================================================== */}

        {filteredSizes.length === 0 ? (

          <div
            className="
              py-8
              text-center
              border
              border-dashed
              border-[#D9CEBF]
              rounded-xl
              bg-[#FAF8F5]
            "
          >

            <Ruler
              className="
                w-7
                h-7
                mx-auto
                mb-2
                text-[#B99A62]
              "
            />

            <p
              className="
                text-xs
                text-[#4A352B]/65
                mb-3
              "
            >
              No hay tamaños configurados.
            </p>

            <button
              type="button"
              onClick={handleQuickAddSize}
              className="
                px-4
                py-2
                rounded-lg
                bg-[#171513]
                text-white
                text-xs
                font-semibold
              "
            >
              + Añadir tamaño
            </button>

          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-2
            "
          >

            {filteredSizes.map(
              (size) => {

                const selected =
                  customization.size.id ===
                  size.id;

                return (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() =>
                      handleSelectSize(size)
                    }
                    className={`
                      relative
                      w-full
                      text-left
                      p-3
                      rounded-xl
                      border
                      transition-all
                      ${
                        selected
                          ? 'border-[#B99A62] bg-[#F8F5F0] shadow-sm'
                          : 'border-[#E7E1D8] bg-white hover:border-[#B99A62]/50 hover:bg-[#FAF8F5]'
                      }
                    `}
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >

                      <div className="min-w-0">

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <span
                            className="
                              text-sm
                              font-semibold
                              text-[#171513]
                            "
                          >
                            {size.label}
                          </span>

                          {size.isBestSeller && (
                            <span
                              className="
                                px-1.5
                                py-0.5
                                rounded
                                bg-[#171513]
                                text-[#B99A62]
                                text-[8px]
                                uppercase
                                tracking-wider
                                font-bold
                              "
                            >
                              Best
                            </span>
                          )}

                        </div>

                        <div
                          className="
                            mt-1
                            text-[10px]
                            text-[#4A352B]/55
                          "
                        >
                          {size.widthCm} × {size.heightCm} cm
                        </div>

                      </div>

                      <div
                        className="
                          text-right
                          shrink-0
                        "
                      >

                        <div
                          className="
                            text-sm
                            font-bold
                            text-[#171513]
                          "
                        >
                          {formatPrice(
                            size.discountedPrice,
                            selectedCurrency
                          )}
                        </div>

                        {size.originalPrice >
                          size.discountedPrice && (
                          <div
                            className="
                              text-[10px]
                              text-[#4A352B]/40
                              line-through
                            "
                          >
                            {formatPrice(
                              size.originalPrice,
                              selectedCurrency
                            )}
                          </div>
                        )}

                      </div>

                    </div>

                    {selected && (
                      <div
                        className="
                          absolute
                          top-2
                          right-2
                          w-5
                          h-5
                          rounded-full
                          bg-[#171513]
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Check
                          className="
                            w-3
                            h-3
                            text-[#B99A62]
                          "
                        />
                      </div>
                    )}

                  </button>
                );
              }
            )}

          </div>
        )}

        {/* ====================================================
            CUSTOM SIZE
        ==================================================== */}

        {allowCustomSize && (
          <div
            className="
              mt-4
              p-4
              rounded-xl
              border
              border-[#E7E1D8]
              bg-[#FAF8F5]
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                mb-3
              "
            >
              <Ruler
                className="
                  w-4
                  h-4
                  text-[#B99A62]
                "
              />

              <div>
                <div
                  className="
                    text-xs
                    font-semibold
                    text-[#171513]
                  "
                >
                  Tamaño personalizado
                </div>

                <div
                  className="
                    text-[10px]
                    text-[#4A352B]/55
                  "
                >
                  Desde {formatPrice(
                    customSizeMinimumPrice,
                    selectedCurrency
                  )}
                </div>
              </div>
            </div>

            <div
              className="
                grid
                grid-cols-2
                gap-2
              "
            >

              <div>
                <label
                  className="
                    block
                    mb-1
                    text-[10px]
                    font-medium
                    text-[#4A352B]/65
                  "
                >
                  Ancho (cm)
                </label>

                <input
                  type="number"
                  min={15}
                  max={250}
                  value={customW}
                  onChange={(event) =>
                    setCustomW(
                      Number(event.target.value)
                    )
                  }
                  className="
                    w-full
                    px-3
                    py-2.5
                    rounded-lg
                    border
                    border-[#D9CEBF]
                    bg-white
                    text-sm
                    outline-none
                    focus:border-[#B99A62]
                  "
                />
              </div>

              <div>
                <label
                  className="
                    block
                    mb-1
                    text-[10px]
                    font-medium
                    text-[#4A352B]/65
                  "
                >
                  Alto (cm)
                </label>

                <input
                  type="number"
                  min={15}
                  max={250}
                  value={customH}
                  onChange={(event) =>
                    setCustomH(
                      Number(event.target.value)
                    )
                  }
                  className="
                    w-full
                    px-3
                    py-2.5
                    rounded-lg
                    border
                    border-[#D9CEBF]
                    bg-white
                    text-sm
                    outline-none
                    focus:border-[#B99A62]
                  "
                />
              </div>

            </div>

            <button
              type="button"
              onClick={handleApplyCustomSize}
              className="
                mt-3
                w-full
                py-2.5
                rounded-lg
                bg-[#171513]
                text-white
                text-xs
                font-semibold
                hover:bg-[#4A352B]
                transition
              "
            >
              Usar tamaño personalizado
            </button>

          </div>
        )}

        {/* ====================================================
            MATERIAL OPTIONS
        ==================================================== */}

        {hasOptions && (
          <div
            className="
              mt-4
              rounded-xl
              border
              border-[#E7E1D8]
              overflow-hidden
            "
          >

            <button
              type="button"
              onClick={() =>
                setShowOptions(
                  (value) => !value
                )
              }
              className="
                w-full
                px-4
                py-3
                flex
                items-center
                justify-between
                bg-white
                hover:bg-[#FAF8F5]
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Palette
                  className="
                    w-4
                    h-4
                    text-[#B99A62]
                  "
                />

                <span
                  className="
                    text-xs
                    font-semibold
                    text-[#171513]
                  "
                >
                  Opciones del producto
                </span>
              </div>

              <ChevronDown
                className={`
                  w-4
                  h-4
                  text-[#4A352B]
                  transition-transform
                  ${
                    showOptions
                      ? 'rotate-180'
                      : ''
                  }
                `}
              />

            </button>

            {showOptions && (
              <div
                className="
                  px-4
                  pb-4
                  space-y-4
                  border-t
                  border-[#E7E1D8]
                  bg-[#FAF8F5]
                "
              >

                {/* FRAME COLORS */}

                {frameColors.length > 0 && (
                  <div className="pt-4">

                    <label
                      className="
                        block
                        mb-2
                        text-[10px]
                        uppercase
                        tracking-wider
                        font-semibold
                        text-[#4A352B]/60
                      "
                    >
                      Marco
                    </label>

                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-2
                      "
                    >

                      {frameColors.map(
                        (frame) => (
                          <button
                            key={frame}
                            type="button"
                            onClick={() =>
                              handleFrameChange(
                                frame
                              )
                            }
                            className="
                              px-3
                              py-2
                              rounded-lg
                              border
                              border-[#D9CEBF]
                              bg-white
                              text-xs
                              text-[#171513]
                              hover:border-[#B99A62]
                              transition
                              text-left
                            "
                          >
                            {frame}
                          </button>
                        )
                      )}

                    </div>

                    <div
                      className="
                        mt-2
                        text-[10px]
                        text-[#4A352B]/50
                      "
                    >
                      Seleccionado: {currentFrameLabel}
                    </div>

                  </div>
                )}

                {/* FINISH */}

                {finishes.length > 0 && (
                  <div>

                    <label
                      className="
                        block
                        mb-2
                        text-[10px]
                        uppercase
                        tracking-wider
                        font-semibold
                        text-[#4A352B]/60
                      "
                    >
                      Acabado
                    </label>

                    <div
                      className="
                        flex
                        flex-wrap
                        gap-2
                      "
                    >

                      {finishes.map(
                        (finish) => (
                          <button
                            key={finish}
                            type="button"
                            className="
                              px-3
                              py-2
                              rounded-lg
                              border
                              border-[#D9CEBF]
                              bg-white
                              text-xs
                              text-[#171513]
                              hover:border-[#B99A62]
                              transition
                            "
                          >
                            {finish}
                          </button>
                        )
                      )}

                    </div>

                  </div>
                )}

                {/* THICKNESS */}

                {thicknesses.length > 0 && (
                  <div>

                    <label
                      className="
                        block
                        mb-2
                        text-[10px]
                        uppercase
                        tracking-wider
                        font-semibold
                        text-[#4A352B]/60
                      "
                    >
                      Grosor
                    </label>

                    <div
                      className="
                        flex
                        flex-wrap
                        gap-2
                      "
                    >

                      {thicknesses.map(
                        (thickness) => (
                          <button
                            key={thickness}
                            type="button"
                            onClick={() => {
                              if (
                                thickness ===
                                '2 cm'
                              ) {
                                handleDepthChange(
                                  '2'
                                );
                              }

                              if (
                                thickness ===
                                '4 cm'
                              ) {
                                handleDepthChange(
                                  '4'
                                );
                              }
                            }}
                            className="
                              px-3
                              py-2
                              rounded-lg
                              border
                              border-[#D9CEBF]
                              bg-white
                              text-xs
                              text-[#171513]
                              hover:border-[#B99A62]
                              transition
                            "
                          >
                            {thickness}
                          </button>
                        )
                      )}

                    </div>

                    {materialId ===
                      'canvas' && (
                      <div
                        className="
                          mt-2
                          text-[10px]
                          text-[#4A352B]/50
                        "
                      >
                        Grosor actual:
                        {' '}
                        {currentDepthLabel}
                      </div>
                    )}

                  </div>
                )}

                {/* MOUNTING */}

                {mounting.length > 0 && (
                  <div>

                    <label
                      className="
                        block
                        mb-2
                        text-[10px]
                        uppercase
                        tracking-wider
                        font-semibold
                        text-[#4A352B]/60
                      "
                    >
                      Montaje
                    </label>

                    <div
                      className="
                        flex
                        flex-wrap
                        gap-2
                      "
                    >

                      {mounting.map(
                        (option) => (
                          <button
                            key={option}
                            type="button"
                            className="
                              px-3
                              py-2
                              rounded-lg
                              border
                              border-[#D9CEBF]
                              bg-white
                              text-xs
                              text-[#171513]
                              hover:border-[#B99A62]
                              transition
                            "
                          >
                            {option}
                          </button>
                        )
                      )}

                    </div>

                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </div>

      {/* ======================================================
          PRICE FOOTER
      ====================================================== */}

      <div
        className="
          border-t
          border-[#E7E1D8]
          bg-[#F8F5F0]
          p-4
        "
      >

        <div
          className="
            flex
            items-end
            justify-between
            gap-4
          "
        >

          <div>

            <div
              className="
                flex
                items-center
                gap-2
                mb-1
              "
            >

              <span
                className="
                  text-[10px]
                  uppercase
                  tracking-wider
                  font-semibold
                  text-[#4A352B]/55
                "
              >
                Precio
              </span>

              {discountPercent > 0 && (
                <span
                  className="
                    px-1.5
                    py-0.5
                    rounded
                    bg-[#171513]
                    text-[#B99A62]
                    text-[9px]
                    font-bold
                  "
                >
                  -{discountPercent}%
                </span>
              )}

            </div>

            <div
              className="
                flex
                items-baseline
                gap-2
              "
            >

              <span
                className="
                  text-2xl
                  font-bold
                  text-[#171513]
                "
              >
                {formatPrice(
                  totalPrice,
                  selectedCurrency
                )}
              </span>

              {totalOriginalPrice >
                totalPrice && (
                <span
                  className="
                    text-xs
                    text-[#4A352B]/40
                    line-through
                  "
                >
                  {formatPrice(
                    totalOriginalPrice,
                    selectedCurrency
                  )}
                </span>
              )}

            </div>

          </div>

          <button
            type="button"
            disabled={!materialAvailable}
            onClick={onAddToBasket}
            className="
              flex
              items-center
              justify-center
              gap-2
              px-5
              py-3
              rounded-xl
              bg-[#171513]
              text-white
              text-sm
              font-semibold
              shadow-md
              hover:bg-[#4A352B]
              disabled:opacity-40
              disabled:cursor-not-allowed
              transition
            "
          >
            <Sparkles
              className="
                w-4
                h-4
                text-[#B99A62]
              "
            />

            <span>
              {addToCartText}
            </span>
          </button>

        </div>

        {/* SHIPPING */}

        <div
          className="
            mt-3
            pt-3
            border-t
            border-[#D9CEBF]
            flex
            items-center
            justify-between
            gap-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              min-w-0
            "
          >
            <Truck
              className="
                w-4
                h-4
                text-[#B99A62]
                shrink-0
              "
            />

            <span
              className="
                text-[10px]
                text-[#4A352B]/65
              "
            >
              {config.deliveryNotice ||
                'Entrega estimada: 2 - 3 días laborables'}
            </span>
          </div>

          {config.freeShippingThreshold > 0 && (
            <span
              className="
                hidden
                sm:block
                text-[9px]
                text-[#4A352B]/50
                whitespace-nowrap
              "
            >
              Envío gratis desde{' '}
              {formatPrice(
                config.freeShippingThreshold,
                selectedCurrency
              )}
            </span>
          )}

        </div>

      </div>

    </div>
  );
};

export default SizeSelector;
