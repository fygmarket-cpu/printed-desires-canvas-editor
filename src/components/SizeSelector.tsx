import React, { useMemo, useState } from 'react';
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

import { formatCurrency } from '../utils/canvasHelpers';

import {
  Edit3,
  Image as ImageIcon,
  Check,
  Truck,
  Sparkles,
  ChevronDown,
  Layers,
  Sliders,
  Plus,
  Code2,
  Ruler,
  Palette,
  Box,
  Frame,
} from 'lucide-react';


/* ============================================================
   PROPS
   ============================================================ */

interface SizeSelectorProps {
  /**
   * Material actualmente seleccionado.
   *
   * Ej:
   * canvas
   * framed
   * metal
   * acrylic
   * poster
   */
  materialId: MaterialId;

  customization: CanvasCustomization;

  /**
   * StoreConfig se mantiene para compatibilidad
   * con la arquitectura actual.
   */
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

  /**
   * Se conserva para compatibilidad con el
   * StoreConfig editor actual.
   */
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

  const materialConfig = getMaterialConfig(materialId);


  /* ==========================================================
     UI STATE
     ========================================================== */

  const [showFramingOptions, setShowFramingOptions] =
    useState<boolean>(false);

  const [showMaterialOptions, setShowMaterialOptions] =
    useState<boolean>(false);


  /* ==========================================================
     CUSTOM SIZE STATE
     ========================================================== */

  const [customW, setCustomW] =
    useState<number>(customization.size.widthCm);

  const [customH, setCustomH] =
    useState<number>(customization.size.heightCm);


  /* ==========================================================
     AVAILABLE CATEGORIES
     ========================================================== */

  const categories = useMemo(() => {

    const uniqueCategories = Array.from(
      new Set(
        materialConfig.sizes
          .map((size) => size.category)
          .filter(Boolean)
      )
    );

    return uniqueCategories;

  }, [materialConfig.sizes]);


  /* ==========================================================
     ACTIVE CATEGORY
     ========================================================== */

  const defaultCategory =
    customization.size.category ||
    categories[0] ||
    'popular';

  const [activeCategory, setActiveCategory] =
    useState<string>(defaultCategory);


  /* ==========================================================
     FILTERED SIZES
     ========================================================== */

  const filteredSizes = useMemo(() => {

    return materialConfig.sizes.filter(
      (size) => size.category === activeCategory
    );

  }, [
    materialConfig.sizes,
    activeCategory,
  ]);


  /* ==========================================================
     MATERIAL OPTIONS
     ========================================================== */

  const frameColors =
    materialConfig.options?.frameColors ?? [];

  const finishes =
    materialConfig.options?.finishes ?? [];

  const thicknesses =
    materialConfig.options?.thicknesses ?? [];

  const mounting =
    materialConfig.options?.mounting ?? [];


  const hasFrames =
    frameColors.length > 0;

  const hasFinishes =
    finishes.length > 0;

  const hasThicknesses =
    thicknesses.length > 0;

  const hasMounting =
    mounting.length > 0;


  /* ==========================================================
     CUSTOM SIZE CONFIGURATION
     ========================================================== */

  const allowCustomSize =
    materialConfig.pricing?.allowCustomSize ?? false;

  const customSizeMinimumPrice =
    materialConfig.pricing?.customSizeMinimumPrice ?? 0;


  /* ==========================================================
     FRAME COMPATIBILITY
     ========================================================== */

  const selectedFrame =
    config.frames.find(
      (frame) =>
        frame.id === customization.frameStyle
    );

  const frameCost =
    selectedFrame?.price ?? 0;


  /* ==========================================================
     DEPTH COMPATIBILITY
     ========================================================== */

  const selectedDepth =
    config.depthOptions.find(
      (depth) =>
        depth.depthCm === customization.depthCm
    );

  const depthCost =
    selectedDepth?.extraPrice ?? 0;


  /* ==========================================================
     BASE PRICE
     ========================================================== */

  const baseOriginal =
    customization.size.originalPrice;

  const baseDiscounted =
    customization.size.discountedPrice;


  /* ==========================================================
     TOTAL PRICE
     ========================================================== */

  /**
   * IMPORTANTE:
   *
   * El precio base procede directamente del tamaño
   * perteneciente al material seleccionado.
   *
   * No utilizamos materialConfig.pricing.basePrice
   * como sustituto del precio por tamaño.
   *
   * Esto mantiene compatibilidad con CanvasSize.
   */

  const optionsExtraPrice =
    materialId === 'canvas'
      ? frameCost + depthCost
      : 0;

  const totalDiscounted =
    baseDiscounted +
    optionsExtraPrice;


  /**
   * Precio original visual.
   *
   * Mantenemos la lógica actual para no cambiar
   * el aspecto comercial del configurador.
   */

  const totalOriginal =
    baseOriginal +
    optionsExtraPrice * 1.5;


  const effectiveDiscount =
    totalOriginal > 0
      ? Math.max(
          0,
          Math.round(
            (
              (totalOriginal - totalDiscounted) /
              totalOriginal
            ) * 100
          )
        )
      : 0;


  /* ==========================================================
     MATERIAL UI TEXT
     ========================================================== */

  const materialTitle =
    materialConfig.ui.title ||
    materialConfig.displayName;

  const materialSubtitle =
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
     CUSTOM SIZE
     ========================================================== */

  const handleApplyCustomSize = () => {

    if (!allowCustomSize) {
      return;
    }

    if (
      customW < 15 ||
      customH < 15 ||
      customW > 200 ||
      customH > 200
    ) {
      return;
    }


    const area =
      (customW * customH) / 10000;


    /**
     * Si existe un precio mínimo específico
     * para el material, lo respetamos.
     *
     * El cálculo continúa siendo compatible
     * con el modelo actual.
     */

    const calculatedPrice =
      Math.max(
        customSizeMinimumPrice,
        Math.round(
          area * 75 * 100
        ) / 100
      );


    const calculatedOriginal =
      Math.round(
        calculatedPrice * 1.8 * 100
      ) / 100;


    const discount =
      calculatedOriginal > 0
        ? Math.round(
            (
              (
                calculatedOriginal -
                calculatedPrice
              ) /
              calculatedOriginal
            ) * 100
          )
        : 0;


    const customSize: CanvasSize = {

      id:
        `${materialId}-custom-${customW}x${customH}`,

      label:
        `${customW} x ${customH}cm`,

      widthCm:
        customW,

      heightCm:
        customH,

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

  const handleQuickAddSizeToMaterial = () => {

    const label =
      window.prompt(
        'Dimensiones del nuevo formato (ej. 45 x 60cm):',
        '45 x 60cm'
      );


    if (!label) {
      return;
    }


    const originalPriceInput =
      window.prompt(
        'Precio original:',
        '59.95'
      );


    const discountedPriceInput =
      window.prompt(
        'Precio final:',
        '29.99'
      );


    const originalPrice =
      parseFloat(
        originalPriceInput || '59.95'
      ) || 59.95;


    const discountedPrice =
      parseFloat(
        discountedPriceInput || '29.99'
      ) || 29.99;


    const parts =
      label
        .replace(
          /[^0-9xX]/g,
          ''
        )
        .split(/[xX]/);


    const width =
      parseInt(
        parts[0],
        10
      ) || 45;


    const height =
      parseInt(
        parts[1],
        10
      ) || 60;


    const discount =
      originalPrice > 0
        ? Math.max(
            0,
            Math.round(
              (
                (
                  originalPrice -
                  discountedPrice
                ) /
                originalPrice
              ) * 100
            )
          )
        : 0;


    const newSize: CanvasSize = {

      id:
        `${materialId}-size-${Date.now()}`,

      label,

      widthCm:
        width,

      heightCm:
        height,

      originalPrice,

      discountedPrice,

      discountPercent:
        discount,

      category:
        activeCategory,

      isBestSeller:
        false,
    };


    /**
     * Compatibilidad:
     *
     * Actualmente StoreConfig.sizes continúa
     * existiendo.
     *
     * El materialConfig real deberá gestionarse
     * posteriormente desde el administrador de
     * materiales.
     */

    if (onQuickUpdateConfig) {

      onQuickUpdateConfig(
        (prev) => ({

          ...prev,

          sizes: [
            newSize,
            ...prev.sizes,
          ],

        })
      );

    }


    onSelectSize(newSize);
  };


  /* ==========================================================
     FRAME SELECTION
     ========================================================== */

  const handleFrameSelection = (
    frameId: string
  ) => {

    onUpdateCustomization({
      frameStyle:
        frameId as FrameStyle,
    });

  };


  /* ==========================================================
     CATEGORY LABEL
     ========================================================== */

  const getCategoryLabel =
    (category: string) =>
      CATEGORY_LABELS[category] ||
      category
        .replace(/[-_]/g, ' ')
        .replace(
          /\b\w/g,
          (letter) =>
            letter.toUpperCase()
        );


  /* ==========================================================
     MATERIAL CHANGE SAFETY
     ========================================================== */

  const materialAvailable =
    materialConfig.admin?.availableForSale !== false;


  /* ==========================================================
     RENDER
     ========================================================== */

  return (

    <div
      className="
        bg-[#FFFFFF]
        rounded-2xl
        border
        border-[#E7E1D8]
        shadow-luxury-md
        flex
        flex-col
        h-full
        overflow-hidden
      "
      style={{
        boxShadow:
          '0 12px 36px -4px rgba(18,18,18,0.10)',
      }}
    >

      {/* ======================================================
          MATERIAL HEADER
      ====================================================== */}

      <div
        className="
          p-4
          sm:p-5
          border-b
          border-[#E7E1D8]
          bg-[#F8F5F0]
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

            <span
              className="
                text-[10px]
                text-[#4A352B]/65
                uppercase
                tracking-[0.18em]
                font-semibold
                block
                mb-1
              "
            >
              {materialTitle}
            </span>


            <span
              className="
                text-2xl
                font-normal
                text-[#171513]
                tracking-tight
                font-serif-display
                block
              "
            >
              {customization.size.label}
            </span>


            {materialSubtitle && (
              <p
                className="
                  mt-1
                  text-[11px]
                  text-[#4A352B]/65
                  line-clamp-2
                "
              >
                {materialSubtitle}
              </p>
            )}

          </div>


          <div
            className="
              flex
              items-center
              gap-1.5
              shrink-0
            "
          >

            {/* EDIT */}

            <button
              type="button"
              onClick={onOpenEditor}
              className="
                flex
                items-center
                gap-1.5
                px-3
                py-1.5
                text-xs
                font-medium
                text-[#171513]
                bg-[#FFFFFF]
                hover:bg-[#F2ECE1]
                rounded-lg
                border
                border-[#D9CEBF]
                shadow-luxury-sm
                transition-all
                active:scale-95
              "
              title="Editar fotografía"
            >
              <Edit3
                className="
                  w-3.5
                  h-3.5
                  text-[#B99A62]
                "
              />

              <span>
                Editar
              </span>
            </button>


            {/* PHOTO */}

            <button
              type="button"
              onClick={onOpenImageModal}
              className="
                flex
                items-center
                gap-1.5
                px-3
                py-1.5
                text-xs
                font-medium
                text-[#171513]
                bg-[#FFFFFF]
                hover:bg-[#F2ECE1]
                rounded-lg
                border
                border-[#D9CEBF]
                shadow-luxury-sm
                transition-all
                active:scale-95
              "
              title={uploadText}
            >

              <ImageIcon
                className="
                  w-3.5
                  h-3.5
                  text-[#B99A62]
                "
              />

              <span className="hidden sm:inline">
                Cambiar Foto
              </span>

              <span className="sm:hidden">
                Foto
              </span>

            </button>


            {/* STORE */}

            <button
              type="button"
              onClick={onOpenStoreEditor}
              className="
                p-2
                text-[#4A352B]
                hover:text-[#171513]
                bg-[#FFFFFF]
                hover:bg-[#F2ECE1]
                rounded-lg
                border
                border-[#D9CEBF]
                shadow-luxury-sm
                transition-colors
              "
              title="Configuración de tienda"
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
          MATERIAL INFORMATION BAR
      ====================================================== */}

      <div
        className="
          px-4
          py-2.5
          border-b
          border-[#E7E1D8]
          bg-[#FFFFFF]
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

          <Box
            className="
              w-3.5
              h-3.5
              text-[#B99A62]
              shrink-0
            "
          />

          <span
            className="
              text-[11px]
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
              text-[9px]
              uppercase
              tracking-wider
              font-bold
              text-[#FFFFFF]
              bg-[#B98989]
              px-2
              py-1
              rounded-full
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
          border-b
          border-[#E7E1D8]
          px-4
          pt-3
          flex
          items-center
          gap-4
          overflow-x-auto
          no-scrollbar
          bg-[#FFFFFF]
        "
      >

        {categories.map(
          (category) => {

            const isActive =
              activeCategory === category;


            return (

              <button
                type="button"
                key={category}
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`
                  pb-2.5
                  text-xs
                  tracking-wide
                  transition-colors
                  relative
                  whitespace-nowrap
                  font-medium

                  ${
                    isActive
                      ? 'text-[#171513] font-semibold'
                      : 'text-[#4A352B]/70 hover:text-[#171513]'
                  }
                `}
              >

                {getCategoryLabel(category)}


                {isActive && (
                  <span
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      h-0.5
                      rounded-full
                      bg-[#B99A62]
                    "
                  />
                )}

              </button>

            );

          }
        )}


        {/* QUICK ADD */}

        <button
          type="button"
          onClick={handleQuickAddSizeToMaterial}
          className="
            pb-2.5
            text-xs
            text-[#B99A62]
            hover:text-[#171513]
            flex
            items-center
            gap-1
            transition-colors
            whitespace-nowrap
            font-medium
          "
          title="Añadir formato"
        >

          <Plus
            className="
              w-3.5
              h-3.5
            "
          />

          <span>
            Añadir
          </span>

        </button>

      </div>


      {/* ======================================================
          SIZE LIST
      ====================================================== */}

      <div
        className="
          p-3
          sm:p-4
          overflow-y-auto
          max-h-[300px]
          divide-y
          divide-[#F0EBE1]
          flex-1
          bg-[#FFFFFF]
        "
      >

        {filteredSizes.length === 0 ? (

          <div
            className="
              py-8
              text-center
              text-xs
              text-[#4A352B]/70
              space-y-3
            "
          >

            <Ruler
              className="
                w-6
                h-6
                mx-auto
                text-[#B99A62]
              "
            />

            <p>
              No hay tamaños configurados
              en esta sección.
            </p>

            <button
              type="button"
              onClick={
                handleQuickAddSizeToMaterial
              }
              className="
                px-3
                py-1.5
                text-xs
                font-semibold
                text-[#FFFFFF]
                bg-[#171513]
                hover:bg-[#4A352B]
                rounded-lg
                transition-colors
              "
            >
              + Añadir tamaño
            </button>

          </div>

        ) : (

          filteredSizes.map(
            (size) => {

              const isSelected =
                customization.size.id === size.id;


              return (

                <button
                  type="button"
                  key={size.id}
                  onClick={() =>
                    onSelectSize(size)
                  }
                  className={`
                    w-full
                    flex
                    items-center
                    justify-between
                    gap-3
                    p-3
                    rounded-xl
                    cursor-pointer
                    transition-all
                    text-left

                    ${
                      isSelected
                        ? 'bg-[#F8F5F0] border border-[#B99A62] shadow-luxury-sm'
                        : 'hover:bg-[#FAF8F5] border border-transparent'
                    }
                  `}
                >

                  {/* LEFT */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      min-w-0
                    "
                  >

                    <div
                      className="
                        w-4
                        h-4
                        rounded-full
                        border
                        flex
                        items-center
                        justify-center
                        transition-all
                        shrink-0
                      "
                      style={{
                        borderColor:
                          isSelected
                            ? '#B99A62'
                            : '#D9CEBF',

                        backgroundColor:
                          isSelected
                            ? '#B99A62'
                            : '#FFFFFF',
                      }}
                    >

                      {isSelected && (
                        <Check
                          className="
                            w-2.5
                            h-2.5
                            text-[#FFFFFF]
                          "
                        />
                      )}

                    </div>


                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        min-w-0
                      "
                    >

                      <span
                        className={`
                          text-sm
                          truncate

                          ${
                            isSelected
                              ? 'font-semibold text-[#171513]'
                              : 'font-normal text-[#4A352B]'
                          }
                        `}
                      >
                        {size.label}
                      </span>


                      {size.isBestSeller && (
                        <span
                          className="
                            text-[9px]
                            font-bold
                            text-[#FFFFFF]
                            bg-[#B99A62]
                            px-2
                            py-0.5
                            rounded-full
                            tracking-wider
                            uppercase
                            shadow-2xs
                            whitespace-nowrap
                          "
                        >
                          Best Seller
                        </span>
                      )}

                    </div>

                  </div>


                  {/* PRICE */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      font-mono
                      tabular-nums
                      shrink-0
                    "
                  >

                    {size.originalPrice >
                      size.discountedPrice && (
                      <span
                        className="
                          text-xs
                          text-[#4A352B]/40
                          line-through
                        "
                      >
                        {formatCurrency(
                          size.originalPrice,
                          selectedCurrency
                        )}
                      </span>
                    )}


                    <span
                      className="
                        text-sm
                        font-bold
                        text-[#171513]
                      "
                    >
                      {formatCurrency(
                        size.discountedPrice,
                        selectedCurrency
                      )}
                    </span>

                  </div>

                </button>

              );

            }
          )

        )}


        {/* ====================================================
            CUSTOM SIZE
        ==================================================== */}

        {allowCustomSize && (

          <div
            className="
              pt-3
              space-y-2
            "
          >

            <div
              className="
                bg-[#F8F5F0]
                p-3
                rounded-xl
                border
                border-[#E7E1D8]
              "
            >

              <div
                className="
                  font-medium
                  text-[#4A352B]
                  mb-2
                  flex
                  items-center
                  justify-between
                  gap-2
                "
              >

                <span>
                  Medida personalizada
                </span>

                <span
                  className="
                    text-[10px]
                    text-[#4A352B]/60
                    font-mono
                  "
                >
                  15–200 cm
                </span>

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <input
                  type="number"
                  min="15"
                  max="200"
                  value={customW}
                  onChange={(event) =>
                    setCustomW(
                      Number(event.target.value)
                    )
                  }
                  className="
                    w-16
                    p-1.5
                    bg-[#FFFFFF]
                    border
                    border-[#D9CEBF]
                    rounded
                    text-center
                    font-mono
                    font-semibold
                    text-[#171513]
                  "
                  aria-label="Ancho"
                />


                <span
                  className="
                    text-[#4A352B]/40
                  "
                >
                  ×
                </span>


                <input
                  type="number"
                  min="15"
                  max="200"
                  value={customH}
                  onChange={(event) =>
                    setCustomH(
                      Number(event.target.value)
                    )
                  }
                  className="
                    w-16
                    p-1.5
                    bg-[#FFFFFF]
                    border
                    border-[#D9CEBF]
                    rounded
                    text-center
                    font-mono
                    font-semibold
                    text-[#171513]
                  "
                  aria-label="Alto"
                />


                <span
                  className="
                    text-[#4A352B]/70
                    font-mono
                    text-[11px]
                  "
                >
                  cm
                </span>


                <button
                  type="button"
                  onClick={
                    handleApplyCustomSize
                  }
                  className="
                    ml-auto
                    bg-[#171513]
                    hover:bg-[#4A352B]
                    text-[#FFFFFF]
                    px-3
                    py-1.5
                    rounded
                    font-medium
                    text-xs
                    transition-colors
                    shadow-luxury-sm
                  "
                >
                  Fijar
                </button>

              </div>

            </div>

          </div>

        )}

      </div>


      {/* ======================================================
          MATERIAL OPTIONS
      ====================================================== */}

      {(hasFrames ||
        hasFinishes ||
        hasThicknesses ||
        hasMounting) && (

        <div
          className="
            border-t
            border-[#E7E1D8]
            px-4
            py-3
            bg-[#F8F5F0]
            text-xs
          "
        >

          <button
            type="button"
            onClick={() =>
              setShowMaterialOptions(
                !showMaterialOptions
              )
            }
            className="
              w-full
              flex
              items-center
              justify-between
              text-[#4A352B]
              font-medium
              py-1
            "
          >

            <div
              className="
                flex
                items-center
                gap-1.5
              "
            >

              <Palette
                className="
                  w-3.5
                  h-3.5
                  text-[#B99A62]
                "
              />

              <span>
                Opciones de {materialConfig.displayName}
              </span>

            </div>


            <ChevronDown
              className={`
                w-4
                h-4
                text-[#4A352B]/60
                transition-transform

                ${
                  showMaterialOptions
                    ? 'rotate-180'
                    : ''
                }
              `}
            />

          </button>


          {showMaterialOptions && (

            <div
              className="
                pt-2
                space-y-3
              "
            >

              {/* FINISHES */}

              {hasFinishes && (

                <div>

                  <div
                    className="
                      text-[10px]
                      uppercase
                      tracking-wider
                      font-semibold
                      text-[#4A352B]/65
                      mb-1.5
                    "
                  >
                    {materialConfig.ui.finishText ||
                      'Acabado'}
                  </div>


                  <div
                    className="
                      flex
                      flex-wrap
                      gap-1.5
                    "
                  >

                    {finishes.map(
                      (finish) => (

                        <button
                          type="button"
                          key={finish}
                          className="
                            px-2.5
                            py-1.5
                            rounded-lg
                            border
                            border-[#D9CEBF]
                            bg-[#FFFFFF]
                            hover:border-[#B99A62]
                            text-[10px]
                            text-[#4A352B]
                            transition-colors
                          "
                        >
                          {finish}
                        </button>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* THICKNESSES */}

              {hasThicknesses && (

                <div>

                  <div
                    className="
                      text-[10px]
                      uppercase
                      tracking-wider
                      font-semibold
                      text-[#4A352B]/65
                      mb-1.5
                    "
                  >
                    {materialConfig.ui.thicknessText ||
                      'Grosor'}
                  </div>


                  <div
                    className="
                      flex
                      flex-wrap
                      gap-1.5
                    "
                  >

                    {thicknesses.map(
                      (thickness) => (

                        <button
                          type="button"
                          key={thickness}
                          className="
                            px-2.5
                            py-1.5
                            rounded-lg
                            border
                            border-[#D9CEBF]
                            bg-[#FFFFFF]
                            hover:border-[#B99A62]
                            text-[10px]
                            text-[#4A352B]
                            transition-colors
                          "
                        >
                          {thickness}
                        </button>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* MOUNTING */}

              {hasMounting && (

                <div>

                  <div
                    className="
                      text-[10px]
                      uppercase
                      tracking-wider
                      font-semibold
                      text-[#4A352B]/65
                      mb-1.5
                    "
                  >
                    Montaje
                  </div>


                  <div
                    className="
                      flex
                      flex-wrap
                      gap-1.5
                    "
                  >

                    {mounting.map(
                      (mount) => (

                        <button
                          type="button"
                          key={mount}
                          className="
                            px-2.5
                            py-1.5
                            rounded-lg
                            border
                            border-[#D9CEBF]
                            bg-[#FFFFFF]
                            hover:border-[#B99A62]
                            text-[10px]
                            text-[#4A352B]
                            transition-colors
                          "
                        >
                          {mount}
                        </button>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* FRAME COLORS */}

              {hasFrames && (

                <div>

                  <div
                    className="
                      text-[10px]
                      uppercase
                      tracking-wider
                      font-semibold
                      text-[#4A352B]/65
                      mb-1.5
                    "
                  >
                    {materialConfig.ui.frameText ||
                      'Marco'}
                  </div>


                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-1.5
                    "
                  >

                    {frameColors.map(
                      (frameColor) => {

                        const matchingFrame =
                          config.frames.find(
                            (frame) =>
                              frame.name
                                .toLowerCase()
                                .includes(
                                  frameColor
                                    .toLowerCase()
                                )
                          );


                        const isSelected =
                          matchingFrame
                            ? customization.frameStyle ===
                              matchingFrame.id
                            : false;


                        return (

                          <button
                            type="button"
                            key={frameColor}
                            onClick={() => {

                              if (
                                matchingFrame
                              ) {
                                handleFrameSelection(
                                  matchingFrame.id
                                );
                              }

                            }}
                            className={`
                              p-2.5
                              rounded-xl
                              border
                              text-left
                              flex
                              items-center
                              gap-2
                              transition-all

                              ${
                                isSelected
                                  ? 'border-[#B99A62] bg-[#FFFFFF] ring-1 ring-[#B99A62]'
                                  : 'border-[#E7E1D8] bg-[#FFFFFF] hover:border-[#D9CEBF]'
                              }
                            `}
                          >

                            <Frame
                              className="
                                w-4
                                h-4
                                text-[#B99A62]
                              "
                            />

                            <span
                              className="
                                text-[10px]
                                text-[#171513]
                                truncate
                              "
                            >
                              {frameColor}
                            </span>

                          </button>

                        );

                      }
                    )}

                  </div>

                </div>

              )}

            </div>

          )}

        </div>

      )}


      {/* ======================================================
          CANVAS LEGACY OPTIONS
      ====================================================== */}

      {materialId === 'canvas' && (
        <div
          className="
            border-t
            border-[#E7E1D8]
            px-4
            py-3
            bg-[#F8F5F0]
            space-y-2
            text-xs
          "
        >

          {/* FRAME */}

          {config.frames.length > 0 && (

            <div>

              <button
                type="button"
                onClick={() =>
                  setShowFramingOptions(
                    !showFramingOptions
                  )
                }
                className="
                  w-full
                  flex
                  items-center
                  justify-between
                  text-[#4A352B]
                  font-medium
                  py-1
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                  "
                >

                  <Layers
                    className="
                      w-3.5
                      h-3.5
                      text-[#B99A62]
                    "
                  />

                  <span>
                    Marco Flotante Artesanal
                  </span>


                  {customization.frameStyle !==
                    'none' && (
                    <span
                      className="
                        text-[10px]
                        font-bold
                        text-[#B99A62]
                      "
                    >
                      (+
                      {formatCurrency(
                        frameCost,
                        selectedCurrency
                      )}
                      )
                    </span>
                  )}

                </div>


                <ChevronDown
                  className={`
                    w-4
                    h-4
                    text-[#4A352B]/60
                    transition-transform

                    ${
                      showFramingOptions
                        ? 'rotate-180'
                        : ''
                    }
                  `}
                />

              </button>


              {showFramingOptions && (

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-1.5
                    pt-2
                  "
                >

                  {config.frames.map(
                    (frame) => {

                      const isSelected =
                        customization.frameStyle ===
                        frame.id;


                      return (

                        <button
                          type="button"
                          key={frame.id}
                          onClick={() =>
                            onUpdateCustomization({
                              frameStyle:
                                frame.id as FrameStyle,
                            })
                          }
                          className={`
                            p-2.5
                            rounded-xl
                            border
                            text-left
                            flex
                            items-start
                            gap-2
                            transition-all

                            ${
                              isSelected
                                ? 'border-[#B99A62] bg-[#FFFFFF] shadow-luxury-sm ring-1 ring-[#B99A62]'
                                : 'border-[#E7E1D8] bg-[#FFFFFF] hover:border-[#D9CEBF]'
                            }
                          `}
                        >

                          <div
                            className={`
                              w-4
                              h-4
                              rounded-sm
                              shrink-0
                              mt-0.5
                              border
                              ${frame.colorClass}
                            `}
                            style={{
                              backgroundColor:
                                frame.hexColor,
                            }}
                          />


                          <div
                            className="
                              overflow-hidden
                            "
                          >

                            <p
                              className="
                                font-medium
                                text-[#171513]
                                truncate
                                text-[11px]
                              "
                            >
                              {frame.name}
                            </p>


                            <p
                              className="
                                text-[10px]
                                text-[#4A352B]/70
                                font-mono
                              "
                            >
                              {frame.price > 0
                                ? `+${formatCurrency(
                                    frame.price,
                                    selectedCurrency
                                  )}`
                                : 'Incluido'}
                            </p>

                          </div>

                        </button>

                      );

                    }
                  )}

                </div>

              )}

            </div>

          )}


          {/* DEPTH */}

          {config.depthOptions.length > 0 && (

            <div
              className="
                flex
                items-center
                justify-between
                gap-2
                pt-1
              "
            >

              <span
                className="
                  font-medium
                  text-[#4A352B]
                "
              >
                Grosor bastidor:
              </span>


              <div
                className="
                  flex
                  items-center
                  gap-1
                  bg-[#FFFFFF]
                  p-0.5
                  rounded-lg
                  border
                  border-[#D9CEBF]
                  text-[11px]
                  font-medium
                  shadow-luxury-sm
                "
              >

                {config.depthOptions.map(
                  (option) => (

                    <button
                      type="button"
                      key={option.depthCm}
                      onClick={() =>
                        onUpdateCustomization({
                          depthCm:
                            option.depthCm,
                        })
                      }
                      className={`
                        px-2.5
                        py-1
                        rounded
                        transition-all

                        ${
                          customization.depthCm ===
                          option.depthCm
                            ? 'bg-[#171513] text-[#FFFFFF] font-semibold'
                            : 'text-[#4A352B] hover:text-[#171513]'
                        }
                      `}
                    >

                      {option.label}

                      {option.extraPrice > 0 &&
                        ` (+${formatCurrency(
                          option.extraPrice,
                          selectedCurrency
                        )})`}

                    </button>

                  )
                )}

              </div>

            </div>

          )}

        </div>
      )}


      {/* ======================================================
          PRICE + CTA
      ====================================================== */}

      <div
        className="
          p-4
          sm:p-5
          border-t
          border-[#E7E1D8]
          bg-[#FFFFFF]
          mt-auto
        "
      >

        <div
          className="
            flex
            items-baseline
            justify-between
            mb-3
            gap-3
          "
        >

          <div
            className="
              flex
              items-baseline
              gap-2.5
              font-mono
              tabular-nums
            "
          >

            {totalOriginal >
              totalDiscounted && (

              <span
                className="
                  text-sm
                  text-[#4A352B]/40
                  line-through
                "
              >
                {formatCurrency(
                  totalOriginal,
                  selectedCurrency
                )}
              </span>

            )}


            <span
              className="
                text-3xl
                font-normal
                text-[#171513]
                font-serif-display
              "
            >
              {formatCurrency(
                totalDiscounted,
                selectedCurrency
              )}
            </span>

          </div>


          {effectiveDiscount > 0 && (

            <span
              className="
                text-xs
                font-semibold
                text-[#FFFFFF]
                bg-[#B98989]
                px-2.5
                py-1
                rounded-full
                shadow-2xs
                tracking-wide
                whitespace-nowrap
              "
            >
              {effectiveDiscount}% OFF
            </span>

          )}

        </div>


        {/* CTA */}

        <button
          type="button"
          onClick={onAddToBasket}
          disabled={!materialAvailable}
          className="
            w-full
            text-[#FFFFFF]
            bg-[#171513]
            hover:bg-[#4A352B]
            disabled:opacity-50
            disabled:cursor-not-allowed
            border
            border-[#B99A62]
            py-4
            px-5
            rounded-xl
            font-medium
            text-sm
            sm:text-base
            transition-all
            shadow-luxury-lg
            active:scale-[0.99]
            flex
            items-center
            justify-center
            gap-2
            group
          "
          style={{
            boxShadow:
              '0 8px 24px -4px rgba(18,18,18,0.25)',
          }}
        >

          <Sparkles
            className="
              w-4
              h-4
              text-[#B99A62]
              group-hover:scale-110
              transition-transform
            "
          />

          <span
            className="
              tracking-wide
            "
          >
            {addToCartText}
          </span>

        </button>


        {/* SHOPIFY */}

        {onOpenShopify && (

          <button
            type="button"
            onClick={onOpenShopify}
            className="
              mt-2.5
              w-full
              bg-[#FFFFFF]
              hover:bg-[#F8F5F0]
              text-[#171513]
              border
              border-[#B99A62]
              py-2.5
              px-4
              rounded-xl
              text-xs
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              transition-all
              shadow-luxury-sm
              active:scale-98
            "
            title="Generar código HTML para Shopify"
          >

            <Code2
              className="
                w-3.5
                h-3.5
                text-[#B99A62]
              "
            />

            <span>
              Código HTML para Shopify
            </span>

          </button>

        )}


        {/* DELIVERY */}

        <div
          className="
            mt-3
            flex
            items-center
            justify-center
            gap-1.5
            text-[11px]
            text-[#4A352B]/75
            font-normal
          "
        >

          <Truck
            className="
              w-3.5
              h-3.5
              text-[#B99A62]
            "
          />

          <span>
            {config.deliveryNotice ||
              'Entrega estimada: 2 - 3 días laborables'}
          </span>

        </div>

      </div>

    </div>
  );
};
