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
  MaterialConfig,
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
} from 'lucide-react';


/* ============================================================
   PROPS
   ============================================================ */

interface SizeSelectorProps {

  customization: CanvasCustomization;

  config: StoreConfig;

  selectedCurrency: CurrencyConfig;

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
   COMPONENT
   ============================================================ */

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  customization,
  config,
  selectedCurrency,
  materialId,
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
     MATERIAL
  ========================================================== */

  const materialConfig: MaterialConfig = useMemo(
    () => getMaterialConfig(materialId),
    [materialId]
  );


  /* ==========================================================
     CATEGORIES
  ========================================================== */

  const materialCategories = useMemo(() => {

    const categories = Array.from(
      new Set(
        materialConfig.sizes.map(
          (size) => size.category
        )
      )
    );

    return categories;

  }, [materialConfig]);


  /* ==========================================================
     ACTIVE CATEGORY
  ========================================================== */

  const [activeCategory, setActiveCategory] =
    useState<string>(
      customization.size.category ||
      materialCategories[0] ||
      'popular'
    );


  /* ==========================================================
     FRAME OPTIONS
  ========================================================== */

  const [showFramingOptions, setShowFramingOptions] =
    useState<boolean>(false);


  /* ==========================================================
     CUSTOM SIZE
  ========================================================== */

  const [customW, setCustomW] =
    useState<number>(
      customization.size.widthCm
    );

  const [customH, setCustomH] =
    useState<number>(
      customization.size.heightCm
    );


  /* ==========================================================
     RESET CATEGORY WHEN MATERIAL CHANGES
  ========================================================== */

  useEffect(() => {

    const categoryExists =
      materialCategories.includes(
        activeCategory
      );

    if (!categoryExists) {

      const fallbackCategory =
        materialCategories[0] ||
        'popular';

      setActiveCategory(
        fallbackCategory
      );
    }

  }, [
    materialId,
    materialCategories,
    activeCategory,
  ]);


  /* ==========================================================
     MATERIAL SIZES
  ========================================================== */

  const materialSizes =
    materialConfig.sizes;


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
     PRICING
  ========================================================== */

  const baseOriginal =
    customization.size.originalPrice;

  const baseDiscounted =
    customization.size.discountedPrice;


  /* ==========================================================
     FRAME COST
  ========================================================== */

  const selectedFrame =
    config.frames.find(
      (frame) =>
        frame.id ===
        customization.frameStyle
    );

  const frameCost =
    selectedFrame
      ? selectedFrame.price
      : 0;


  /* ==========================================================
     DEPTH COST
  ========================================================== */

  const selectedDepth =
    config.depthOptions.find(
      (depth) =>
        depth.depthCm ===
        customization.depthCm
    );

  const depthCost =
    selectedDepth
      ? selectedDepth.extraPrice
      : 0;


  /* ==========================================================
     MATERIAL OPTION PRICING
  ========================================================== */

  const materialBasePrice =
    materialConfig.pricing?.basePrice || 0;


  /*
   * IMPORTANT
   *
   * The material's size price is authoritative
   * when priceBySize === true.
   *
   * Therefore we do not add basePrice to the
   * selected size price.
   */

  const totalOriginal =
    baseOriginal +
    frameCost * 1.5 +
    depthCost * 1.5;

  const totalDiscounted =
    baseDiscounted +
    frameCost +
    depthCost;


  const effectiveDiscount =
    totalOriginal > 0
      ? Math.max(
          0,
          Math.round(
            (
              (totalOriginal -
                totalDiscounted) /
              totalOriginal
            ) *
              100
          )
        )
      : 0;


  /* ==========================================================
     SELECT SIZE
  ========================================================== */

  const handleSelectSize = (
    size: CanvasSize
  ) => {

    onSelectSize(size);

  };


  /* ==========================================================
     CUSTOM SIZE
  ========================================================== */

  const handleApplyCustomSize = () => {

    const allowCustomSize =
      materialConfig.pricing
        ?.allowCustomSize !== false;


    if (!allowCustomSize) {
      return;
    }


    const minimumPrice =
      materialConfig.pricing
        ?.customSizeMinimumPrice ||
      12;


    if (
      customW < 15 ||
      customH < 15 ||
      customW > 200 ||
      customH > 200
    ) {
      return;
    }


    const area =
      (customW * customH) /
      10000;


    /*
     * Base calculation.
     *
     * This remains compatible with
     * the existing Canvas calculation.
     */

    const calcDiscounted =
      Math.max(
        minimumPrice,
        Math.round(
          area * 75 * 100
        ) / 100
      );


    const calcOriginal =
      Math.round(
        calcDiscounted *
          1.8 *
          100
      ) / 100;


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
        calcOriginal,

      discountedPrice:
        calcDiscounted,

      discountPercent:
        Math.round(
          (
            (calcOriginal -
              calcDiscounted) /
            calcOriginal
          ) *
            100
        ),

      category:
        'custom',

      isBestSeller:
        false,
    };


    onSelectSize(
      customSize
    );

  };


  /* ==========================================================
     QUICK ADD SIZE
  ========================================================== */

  const handleQuickAddSizeToCategory =
    () => {

      if (!onQuickUpdateConfig) {
        return;
      }


      const label =
        prompt(
          'Dimensiones del nuevo formato (ej. 45 x 60cm):',
          '45 x 60cm'
        );


      if (!label) {
        return;
      }


      const origPriceStr =
        prompt(
          'Precio original tachado (€):',
          '59.95'
        );


      const discPriceStr =
        prompt(
          'Precio en oferta final (€):',
          '29.99'
        );


      const origPrice =
        parseFloat(
          origPriceStr || '59.95'
        ) || 59.95;


      const discPrice =
        parseFloat(
          discPriceStr || '29.99'
        ) || 29.99;


      const parts =
        label
          .replace(
            /[^0-9xX]/g,
            ''
          )
          .split(/[xX]/);


      const w =
        parseInt(
          parts[0],
          10
        ) || 45;


      const h =
        parseInt(
          parts[1],
          10
        ) || 60;


      const newSize: CanvasSize = {

        id:
          `${materialId}-size-${Date.now()}`,

        label,

        widthCm:
          w,

        heightCm:
          h,

        originalPrice:
          origPrice,

        discountedPrice:
          discPrice,

        discountPercent:
          Math.max(
            0,
            Math.round(
              (
                (origPrice -
                  discPrice) /
                origPrice
              ) *
                100
            )
          ),

        category:
          activeCategory,

        isBestSeller:
          false,
      };


      /*
       * IMPORTANT:
       *
       * This legacy quick editor updates
       * StoreConfig only.
       *
       * For true material persistence,
       * use the material configuration manager.
       */

      onQuickUpdateConfig(
        (prev) => ({
          ...prev,

          sizes: [
            newSize,
            ...prev.sizes,
          ],
        })
      );


      onSelectSize(
        newSize
      );

    };


  /* ==========================================================
     QUICK ADD CATEGORY
  ========================================================== */

  const handleQuickAddCategory =
    () => {

      const name =
        prompt(
          'Nombre de la nueva sección / pestaña (ej: Trípticos, Mini):'
        );


      if (
        !name ||
        !name.trim()
      ) {
        return;
      }


      const cleanId =
        name
          .toLowerCase()
          .replace(
            /[^a-z0-9]+/g,
            '-'
          )
          .replace(
            /^-|-$/g,
            ''
          );


      const newCat = {

        id:
          cleanId,

        label:
          name.trim(),

      };


      if (onQuickUpdateConfig) {

        onQuickUpdateConfig(
          (prev) => ({

            ...prev,

            categories: [
              ...prev.categories,
              newCat,
            ],

          })
        );

      }


      setActiveCategory(
        cleanId
      );

    };


  /* ==========================================================
     MATERIAL DISPLAY NAME
  ========================================================== */

  const materialName =
    materialConfig.displayName;


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
          '0 12px 36px -4px rgba(18, 18, 18, 0.10)',
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          p-4
          sm:p-5
          border-b
          border-[#E7E1D8]
          flex
          items-center
          justify-between
          gap-3
          bg-[#F8F5F0]
        "
      >

        <div>

          <span
            className="
              text-[11px]
              text-[#4A352B]/75
              uppercase
              tracking-widest
              font-semibold
              block
            "
          >
            {materialName}
          </span>


          <span
            className="
              text-2xl
              font-normal
              text-[#171513]
              tracking-tight
              font-serif-display
            "
          >
            {customization.size.label}
          </span>

        </div>


        <div
          className="
            flex
            items-center
            gap-1.5
            sm:gap-2
          "
        >

          {/* EDIT */}

          <button
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


          {/* CHANGE PHOTO */}

          <button
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


          {/* SETTINGS */}

          <button
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


      {/* =====================================================
          MATERIAL INFORMATION
      ===================================================== */}

      <div
        className="
          px-4
          py-2.5
          bg-[#FFFFFF]
          border-b
          border-[#F0EBE1]
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >

          <div>

            <p
              className="
                text-xs
                font-semibold
                text-[#171513]
              "
            >
              {materialConfig.ui.sizeText}
            </p>

            <p
              className="
                text-[10px]
                text-[#4A352B]/60
                mt-0.5
              "
            >
              {materialConfig.description}
            </p>

          </div>


          <span
            className="
              shrink-0
              text-[10px]
              uppercase
              tracking-wide
              font-semibold
              text-[#B99A62]
            "
          >
            {materialConfig.sizes.length} formatos
          </span>

        </div>

      </div>


      {/* =====================================================
          CATEGORY TABS
      ===================================================== */}

      <div
        className="
          border-b
          border-[#E7E1D8]
          px-4
          pt-3
          flex
          items-center
          gap-3
          overflow-x-auto
          no-scrollbar
          bg-[#FFFFFF]
        "
      >

        {materialCategories.map(
          (categoryId) => {

            const isActive =
              activeCategory ===
              categoryId;


            const categoryLabel =
              categoryId
                .replace(
                  /[-_]/g,
                  ' '
                )
                .replace(
                  /\b\w/g,
                  (char) =>
                    char.toUpperCase()
                );


            return (

              <button
                key={categoryId}
                onClick={() =>
                  setActiveCategory(
                    categoryId
                  )
                }
                className={`
                  pb-2.5
                  text-xs
                  tracking-wide
                  transition-colors
                  relative
                  font-medium
                  whitespace-nowrap
                  ${
                    isActive
                      ? 'text-[#171513] font-semibold'
                      : 'text-[#4A352B]/70 hover:text-[#171513]'
                  }
                `}
              >

                {categoryLabel}

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


        {/* ADD CATEGORY */}

        <button
          onClick={
            handleQuickAddCategory
          }
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
        >

          <Plus
            className="w-3.5 h-3.5"
          />

          <span>
            Añadir Sección
          </span>

        </button>

      </div>


      {/* =====================================================
          SIZE LIST
      ===================================================== */}

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
              space-y-2
            "
          >

            <p>
              No hay tamaños configurados
              para {materialName}.
            </p>

            <button
              onClick={
                handleQuickAddSizeToCategory
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
              + Añadir primer tamaño
            </button>

          </div>

        ) : (

          filteredSizes.map(
            (size) => {

              const isSelected =
                customization.size.id ===
                size.id;


              return (

                <label
                  key={size.id}
                  onClick={() =>
                    handleSelectSize(
                      size
                    )
                  }
                  className={`
                    flex
                    items-center
                    justify-between
                    p-3
                    rounded-xl
                    cursor-pointer
                    transition-all
                    ${
                      isSelected
                        ? 'bg-[#F8F5F0] border border-[#B99A62] shadow-luxury-sm'
                        : 'hover:bg-[#FAF8F5] border border-transparent'
                    }
                  `}
                >

                  {/* SIZE */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
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

                        <div
                          className="
                            w-1.5
                            h-1.5
                            rounded-full
                            bg-[#FFFFFF]
                          "
                        />

                      )}

                    </div>


                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <span
                        className={`
                          text-sm
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
                            text-[10px]
                            font-bold
                            text-[#FFFFFF]
                            bg-[#B99A62]
                            px-2
                            py-0.5
                            rounded-full
                            tracking-wider
                            uppercase
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
                      gap-2.5
                      font-mono
                      tabular-nums
                    "
                  >

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

                </label>

              );

            }
          )

        )}


        {/* ===================================================
            ADD SIZE
        =================================================== */}

        <div
          className="
            pt-2.5
            space-y-2
          "
        >

          <button
            onClick={
              handleQuickAddSizeToCategory
            }
            className="
              w-full
              py-1.5
              border
              border-dashed
              border-[#D9CEBF]
              hover:border-[#B99A62]
              rounded-lg
              text-xs
              font-medium
              text-[#4A352B]
              hover:text-[#171513]
              flex
              items-center
              justify-center
              gap-1
              transition-colors
              bg-[#FAF8F5]
            "
          >

            <Plus
              className="
                w-3.5
                h-3.5
                text-[#B99A62]
              "
            />

            <span>
              Añadir otro formato
            </span>

          </button>


          {/* =================================================
              CUSTOM SIZE
          ================================================= */}

          {materialConfig.pricing
            ?.allowCustomSize !== false && (

            <div
              className="
                bg-[#F8F5F0]
                p-3
                rounded-xl
                border
                border-[#E7E1D8]
                text-xs
              "
            >

              <div
                className="
                  font-medium
                  text-[#4A352B]
                  mb-1.5
                  flex
                  items-center
                  justify-between
                "
              >

                <span>
                  ¿Medida exacta personalizada?
                </span>

                <span
                  className="
                    text-[10px]
                    text-[#4A352B]/60
                    font-mono
                  "
                >
                  15 a 200 cm
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
                  onChange={(e) =>
                    setCustomW(
                      Number(
                        e.target.value
                      )
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
                  placeholder="Ancho"
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
                  onChange={(e) =>
                    setCustomH(
                      Number(
                        e.target.value
                      )
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
                  placeholder="Alto"
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
                  "
                >
                  Fijar
                </button>

              </div>

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          FRAME / FINISH
      ===================================================== */}

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

        {materialConfig.options
          ?.frameColors
          ?.length ? (

          <div>

            <button
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
                  {materialConfig.ui.frameText ||
                    'Marco'}
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
                  pb-1
                "
              >

                {config.frames
                  .filter(
                    (frame) =>
                      materialConfig.options
                        ?.frameColors
                        ?.includes(
                          frame.name
                        ) ||
                      materialConfig.options
                        ?.frameColors
                        ?.includes(
                          frame.id
                        )
                  )
                  .map((frame) => {

                    const isSelected =
                      customization.frameStyle ===
                      frame.id;


                    return (

                      <button
                        key={frame.id}
                        onClick={() =>
                          onUpdateCustomization(
                            {
                              frameStyle:
                                frame.id as FrameStyle,
                            }
                          )
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
                            rounded-xs
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

                  })}

              </div>

            )}

          </div>

        ) : null}


        {/* ===================================================
            THICKNESS
        =================================================== */}

        {materialConfig.options
          ?.thicknesses
          ?.length ? (

          <div
            className="
              flex
              items-center
              justify-between
              pt-1
            "
          >

            <span
              className="
                font-medium
                text-[#4A352B]
              "
            >
              {materialConfig.ui.thicknessText ||
                'Grosor'}
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
              "
            >

              {materialConfig.options
                .thicknesses
                .map(
                  (thickness) => (

                    <button
                      key={thickness}
                      type="button"
                      className="
                        px-2.5
                        py-1
                        rounded
                        text-[#4A352B]
                        hover:text-[#171513]
                      "
                    >
                      {thickness}
                    </button>

                  )
                )}

            </div>

          </div>

        ) : null}

      </div>


      {/* =====================================================
          PRICE + CART
      ===================================================== */}

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


          <span
            className="
              text-xs
              font-semibold
              text-[#FFFFFF]
              bg-[#B98989]
              px-2.5
              py-1
              rounded-full
            "
          >
            {effectiveDiscount}% OFF
          </span>

        </div>


        {/* ADD TO CART */}

        <button
          onClick={onAddToBasket}
          className="
            w-full
            text-[#FFFFFF]
            bg-[#171513]
            hover:bg-[#4A352B]
            border
            border-[#B99A62]
            py-4
            px-5
            rounded-xl
            font-medium
            text-sm
            sm:text-base
            transition-all
            flex
            items-center
            justify-center
            gap-2
          "
        >

          <Sparkles
            className="
              w-4
              h-4
              text-[#B99A62]
            "
          />

          <span
            className="
              tracking-wide
            "
          >
            {materialConfig.ui.addToCartText}
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
            "
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
