import React, { useState, useEffect } from 'react';

import {
  CanvasCustomization,
  CanvasSize,
  CartItem,
  CurrencyConfig,
  StoreConfig,
} from './types/canvas';

import {
  DEFAULT_STORE_CONFIG,
  PRESET_ARTWORKS,
} from './data/canvasPresets';

import { Header } from './components/Header';
import { Canvas3DViewer } from './components/Canvas3DViewer';
import { RoomVisualizer } from './components/RoomVisualizer';
import { SizeSelector } from './components/SizeSelector';
import { EditorModal } from './components/EditorModal';
import { ImageModal } from './components/ImageModal';
import { CartDrawer } from './components/CartDrawer';
import { QualityInfoModal } from './components/QualityInfoModal';
import { ShopifyCodeModal } from './components/ShopifyCodeModal';

import {
  MaterialId,
  MaterialConfig,
  DEFAULT_MATERIAL,
  materialConfigs,
} from './materialConfig';

import {
  Check,
  Layers,
  Palette,
  Shield,
  Award,
} from 'lucide-react';

/* ============================================================
   STORAGE
   ============================================================ */

const STORAGE_KEY =
  'printed_desires_store_config_v2';

const MATERIAL_CONFIG_STORAGE_KEY =
  'printed_desires_material_configs_v1';

/* ============================================================
   APP
   ============================================================ */

export default function App() {

  /* ==========================================================
     MATERIAL
  ========================================================== */

  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialId>(DEFAULT_MATERIAL);

  /* ==========================================================
     MATERIAL CONFIGURATION
     
     Cada material mantiene su propia configuración.
     Esto permitirá añadir nuevos materiales posteriormente.
  ========================================================== */

  const [materialConfigState, setMaterialConfigState] =
    useState<Record<MaterialId, MaterialConfig>>(() => {
      try {
        const saved = localStorage.getItem(
          MATERIAL_CONFIG_STORAGE_KEY
        );

        if (saved) {
          return JSON.parse(saved);
        }
      } catch (error) {
        console.error(
          'Error loading material configuration',
          error
        );
      }

      return materialConfigs;
    });

  /* ==========================================================
     STORE CONFIGURATION
  ========================================================== */

  const [storeConfig, setStoreConfig] =
    useState<StoreConfig>(() => {
      try {
        const saved =
          localStorage.getItem(STORAGE_KEY);

        if (saved) {
          return JSON.parse(saved);
        }
      } catch (error) {
        console.error(
          'Error loading store config from localStorage',
          error
        );
      }

      return DEFAULT_STORE_CONFIG;
    });

  /* ==========================================================
     SAVE STORE CONFIG
  ========================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(storeConfig)
      );
    } catch (error) {
      console.error(
        'Error saving store config',
        error
      );
    }
  }, [storeConfig]);

  /* ==========================================================
     SAVE MATERIAL CONFIG
  ========================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        MATERIAL_CONFIG_STORAGE_KEY,
        JSON.stringify(materialConfigState)
      );
    } catch (error) {
      console.error(
        'Error saving material configuration',
        error
      );
    }
  }, [materialConfigState]);

  /* ==========================================================
     ACTIVE MATERIAL CONFIGURATION
  ========================================================== */

  const activeMaterialConfig:
    | MaterialConfig
    | undefined =
    materialConfigState[selectedMaterial];

  /*
   * Fallback de seguridad.
   *
   * Si por alguna razón el material seleccionado
   * no existe en la configuración almacenada,
   * utilizamos Canvas.
   */

  const safeMaterialConfig: MaterialConfig =
    activeMaterialConfig ||
    materialConfigState[DEFAULT_MATERIAL] ||
    materialConfigs[DEFAULT_MATERIAL];

  /* ==========================================================
     CURRENCY
  ========================================================== */

  const selectedCurrency: CurrencyConfig =
    storeConfig.currencies.find(
      (currency) =>
        currency.code ===
        storeConfig.selectedCurrencyCode
    ) ||
    storeConfig.currencies[0] || {
      code: 'EUR',
      symbol: '€',
      label: 'EUR (€)',
      rate: 1,
      position: 'suffix',
    };

  const handleCurrencyChange = (
    code: string
  ) => {
    setStoreConfig((previous) => ({
      ...previous,
      selectedCurrencyCode: code,
    }));
  };

  /* ==========================================================
     MATERIAL SELECTION
  ========================================================== */

  const handleSelectMaterial = (
    material: MaterialId
  ) => {

    /*
     * Verificamos que el material exista.
     */

    if (!materialConfigState[material]) {
      console.warn(
        `Material "${material}" no está configurado.`
      );

      return;
    }

    setSelectedMaterial(material);
  };

  /* ==========================================================
     ACTIVE MATERIAL SIZES
     
     IMPORTANTE:
     Los tamaños ahora vienen del material seleccionado.
  ========================================================== */

  const activeMaterialSizes =
    safeMaterialConfig.sizes &&
    safeMaterialConfig.sizes.length > 0
      ? safeMaterialConfig.sizes
      : storeConfig.sizes;

  /* ==========================================================
     INITIAL SIZE
  ========================================================== */

  const initialSize =
    activeMaterialSizes.find(
      (size) =>
        size.id === '75x100'
    ) ||
    activeMaterialSizes[0] ||
    storeConfig.sizes[0];

  /* ==========================================================
     DEFAULT ARTWORK
  ========================================================== */

  const defaultArtwork =
    PRESET_ARTWORKS[0];

  /* ==========================================================
     CUSTOMIZATION
  ========================================================== */

  const [customization, setCustomization] =
    useState<CanvasCustomization>({
      selectedImage:
        defaultArtwork.url,

      imageName:
        defaultArtwork.title,

      imageDimensions: {
        width: 3600,
        height: 4800,
      },

      size:
        initialSize,

      depthCm: 2,

      wrapStyle:
        'gallery',

      customWrapColor:
        '#ffffff',

      frameStyle:
        'none',

      filter:
        'none',

      adjustments: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        temperature: 0,
        vignette: 0,
        blur: 0,
      },

      transform: {
        zoom: 1,
        panX: 0,
        panY: 0,
        rotateAngle: 0,
        flipH: false,
        flipV: false,
      },

      textLayers: [],
    });

  /* ==========================================================
     KEEP SELECTED SIZE IN SYNC WITH ACTIVE MATERIAL
  ========================================================== */

  useEffect(() => {

    const materialSizes =
      safeMaterialConfig.sizes &&
      safeMaterialConfig.sizes.length > 0
        ? safeMaterialConfig.sizes
        : storeConfig.sizes;

    /*
     * Intentamos mantener el tamaño actual
     * si existe en el nuevo material.
     */

    const currentSize =
      materialSizes.find(
        (size) =>
          size.id ===
          customization.size.id
      );

    if (currentSize) {

      setCustomization(
        (previous) => ({
          ...previous,
          size: currentSize,
        })
      );

      return;
    }

    /*
     * Si el tamaño no existe para el nuevo material,
     * intentamos utilizar 75x100.
     */

    const preferredSize =
      materialSizes.find(
        (size) =>
          size.id === '75x100'
      );

    /*
     * Finalmente usamos el primer tamaño disponible.
     */

    const nextSize =
      preferredSize ||
      materialSizes[0];

    if (nextSize) {

      setCustomization(
        (previous) => ({
          ...previous,
          size: nextSize,
        })
      );
    }

  }, [
    selectedMaterial,
    safeMaterialConfig,
    storeConfig.sizes,
  ]);

  /* ==========================================================
     RESET / VALIDATE MATERIAL-SPECIFIC OPTIONS
  ========================================================== */

  useEffect(() => {

    /*
     * Cuando cambiamos de material,
     * algunas opciones pueden no ser compatibles.
     *
     * Por ahora mantenemos la configuración actual
     * para no romper el comportamiento existente.
     *
     * La validación específica de acabados y marcos
     * se realizará posteriormente en SizeSelector.
     */

  }, [selectedMaterial]);
  /* ==========================================================
     SHOPIFY PHOTO BRIDGE
     
   /* ==========================================================
   SHOPIFY PHOTO BRIDGE
========================================================== */

useEffect(() => {

  const loadShopifyImage = () => {

    const state =
      (window as any).PrintedDesiresState;

    if (
      !state ||
      !state.fileURL
    ) {
      return;
    }

    const imageUrl =
      state.fileURL;

    const imageName =
      state.fileName ||
      'Uploaded Photo';

    setCustomization(
      (previous) => ({
        ...previous,

        selectedImage:
          imageUrl,

        imageName:
          imageName,
      })
    );
  };

  loadShopifyImage();

  window.addEventListener(
    'printedDesires:update',
    loadShopifyImage
  );

  return () => {

    window.removeEventListener(
      'printedDesires:update',
      loadShopifyImage
    );

  };

}, []);


/* ==========================================================
   SHOPIFY IFRAME IMAGE MESSAGE
========================================================== */

useEffect(() => {

  const handleShopifyImageMessage = (
    event: MessageEvent
  ) => {

    if (
      event.origin !==
      'https://fygmarket-cpu.github.io'
    ) {
      return;
    }

    if (
      !event.data ||
      event.data.type !==
        'PRINTED_DESIRES_IMAGE_READY'
    ) {
      return;
    }

    const imageUrl =
      event.data.fileURL;

    if (!imageUrl) {
      return;
    }

    setCustomization(
      (previous) => ({
        ...previous,

        selectedImage:
          imageUrl,

        imageName:
          event.data.fileName ||
          'Uploaded Photo',
      })
    );
  };

  window.addEventListener(
    'message',
    handleShopifyImageMessage
  );

  return () => {

    window.removeEventListener(
      'message',
      handleShopifyImageMessage
    );

  };

}, []);


/* ==========================================================
   VIEW MODE
========================================================== */

const [viewMode, setViewMode] =
  useState<'3d' | 'room'>('3d');

  /* ==========================================================
     INTERNAL CART
  ========================================================== */

  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  /* ==========================================================
     MODALS
  ========================================================== */

  const [isEditorOpen, setIsEditorOpen] =
    useState(false);

  const [isImageModalOpen, setIsImageModalOpen] =
    useState(false);

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  const [isQualityModalOpen, setIsQualityModalOpen] =
    useState(false);

  const [isShopifyOpen, setIsShopifyOpen] =
    useState(false);

  /* ==========================================================
     CUSTOMIZATION UPDATE
  ========================================================== */

  const handleUpdateCustomization = (
    partial: Partial<CanvasCustomization>
  ) => {

    setCustomization(
      (previous) => ({
        ...previous,
        ...partial,
      })
    );
  };

  /* ==========================================================
     SIZE SELECTION
  ========================================================== */

  const handleSelectSize = (
    newSize: CanvasSize
  ) => {

    setCustomization(
      (previous) => ({
        ...previous,
        size: newSize,
      })
    );
  };

  /* ==========================================================
     IMAGE SELECTION
  ========================================================== */

  const handleSelectImage = (
    url: string,
    name: string,
    dimensions?: {
      width: number;
      height: number;
    }
  ) => {

    setCustomization(
      (previous) => ({
        ...previous,

        selectedImage:
          url,

        imageName:
          name,

        imageDimensions:
          dimensions || {
            width: 3000,
            height: 3000,
          },
      })
    );
  };

  /* ==========================================================
     CALCULATE FINAL PRICE
     
     Este cálculo continúa utilizando el precio
     del tamaño activo y las opciones actuales.
     
     Más adelante lo conectaremos completamente
     al motor de pricing de cada material.
  ========================================================== */

  const calculateCurrentPrice = () => {

    let price =
      customization.size.discountedPrice;

    /*
     * Depth
     */

    const selectedDepth =
      storeConfig.depthOptions.find(
        (depth) =>
          depth.depthCm ===
          customization.depthCm
      );

    if (
      selectedDepth &&
      safeMaterialConfig.previewType === 'canvas'
    ) {
      price +=
        selectedDepth.extraPrice;
    }

    /*
     * Frame
     */

    const selectedFrame =
      storeConfig.frames.find(
        (frame) =>
          frame.id ===
          customization.frameStyle
      );

    if (selectedFrame) {

      /*
       * Para materiales que actualmente
       * permiten marco.
       */

      if (
        safeMaterialConfig.id === 'canvas' ||
        safeMaterialConfig.id === 'framed' ||
        safeMaterialConfig.id === 'poster'
      ) {
        price +=
          selectedFrame.price;
      }
    }

    return (
      Math.round(price * 100) /
      100
    );
  };

  /* ==========================================================
     ADD TO SHOPIFY BASKET
  ========================================================== */

  const handleAddToBasket = () => {

    const selectedDepth =
      storeConfig.depthOptions.find(
        (depth) =>
          depth.depthCm ===
          customization.depthCm
      );

    const selectedFrame =
      storeConfig.frames.find(
        (frame) =>
          frame.id ===
          customization.frameStyle
      );

    const finalPrice =
      calculateCurrentPrice();

    /* --------------------------------------------------------
       ORDER ITEM
    -------------------------------------------------------- */

    const orderItem = {

      quantity: 1,

      /*
       * MATERIAL
       */

      materialId:
        safeMaterialConfig.id,

      materialName:
        safeMaterialConfig.displayName,

      materialDescription:
        safeMaterialConfig.description,

      shopifyProductHandle:
        safeMaterialConfig.shopifyProductHandle ||
        '',

      /*
       * SIZE
       */

      sizeId:
        customization.size.id,

      sizeLabel:
        customization.size.label,

      widthCm:
        customization.size.widthCm,

      heightCm:
        customization.size.heightCm,

      /*
       * OPTIONS
       */

      depthCm:
        customization.depthCm,

      frameId:
        customization.frameStyle,

      frameName:
        selectedFrame?.name ||
        'Sin Marco',

      wrapStyle:
        customization.wrapStyle,

      /*
       * PRICE
       */

      price:
        finalPrice,

      /*
       * IMAGE
       */

      imageUrl:
        customization.selectedImage,

      imageName:
        customization.imageName,

      imageDimensions:
        customization.imageDimensions ||
        null,

      /*
       * IMAGE EDITING
       */

      filter:
        customization.filter,

      adjustments:
        customization.adjustments,

      transform:
        customization.transform,

      textLayers:
        customization.textLayers,
    };

    /* ========================================================
       SHOPIFY WINDOW BRIDGE
    ======================================================== */

    if (
      window.opener &&
      !window.opener.closed
    ) {

      window.opener.postMessage(
        {
          type:
            'PRINTED_DESIRES_ORDER_READY',

          item:
            orderItem,
        },
        '*'
      );

      setToastMessage(
        `${safeMaterialConfig.displayName} enviado a tu carrito de Shopify.`
      );

      setTimeout(() => {
        window.close();
      }, 700);

      return;
    }

    /* ========================================================
       DIRECT ACCESS
    ======================================================== */

    setToastMessage(
      'Abre el personalizador desde tu tienda Printed Desires para continuar con el carrito.'
    );

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  /* ==========================================================
     INTERNAL CART QUANTITY
  ========================================================== */

  const handleUpdateQuantity = (
    id: string,
    delta: number
  ) => {

    setCartItems(
      (previous) =>
        previous
          .map((item) => {

            if (
              item.id === id
            ) {

              const newQuantity =
                item.quantity +
                delta;

              return newQuantity > 0
                ? {
                    ...item,
                    quantity:
                      newQuantity,
                  }
                : null;
            }

            return item;
          })
          .filter(Boolean) as CartItem[]
    );
  };

  /* ==========================================================
     REMOVE CART ITEM
  ========================================================== */

  const handleRemoveItem = (
    id: string
  ) => {

    setCartItems(
      (previous) =>
        previous.filter(
          (item) =>
            item.id !== id
        )
    );
  };

  /* ==========================================================
     CART TOTAL
  ========================================================== */

  const cartTotal =
    cartItems.reduce(
      (
        accumulator,
        item
      ) =>
        accumulator +
        item.unitPrice *
          item.quantity,
      0
    );

  /* ==========================================================
     CART COUNT
  ========================================================== */

  const cartCount =
    cartItems.reduce(
      (
        accumulator,
        item
      ) =>
        accumulator +
        item.quantity,
      0
    );

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div
      className="
        min-h-screen
        flex
        flex-col
        bg-[#F8F5F0]
        text-[#171513]
      "
    >

      {/* ======================================================
          TOAST
      ====================================================== */}

      {toastMessage && (

        <div
          className="
            fixed
            top-24
            right-5
            z-50
            bg-[#171513]
            text-[#FFFFFF]
            text-xs
            sm:text-sm
            font-medium
            px-4
            py-3
            rounded-xl
            border
            border-[#B99A62]
            shadow-luxury-lg
            flex
            items-center
            gap-2.5
            animate-bounce
          "
          style={{
            boxShadow:
              '0 10px 30px -5px rgba(18, 18, 18, 0.3)',
          }}
        >

          <Check
            className="
              w-4
              h-4
              text-[#B99A62]
            "
          />

          <span>
            {toastMessage}
          </span>

        </div>
      )}

      {/* ======================================================
          HEADER
      ====================================================== */}

      <Header
        cartCount={
          cartCount
        }

        cartTotal={
          cartTotal
        }

        config={
          storeConfig
        }

        selectedCurrency={
          selectedCurrency
        }

        onCurrencyChange={
          handleCurrencyChange
        }

        onOpenCart={() =>
          setIsCartOpen(true)
        }

        onOpenShopify={() =>
          setIsShopifyOpen(true)
        }

        onOpenHelp={() =>
          setIsQualityModalOpen(true)
        }

        onSelectMaterial={
          handleSelectMaterial
        }
      />

      {/* ======================================================
          MAIN CUSTOMIZER
      ====================================================== */}

      <main
        className="
          flex-1
          max-w-7xl
          w-full
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
          sm:py-10
        "
      >

        {/* ====================================================
            ACTIVE MATERIAL INFORMATION
        ==================================================== */}

        <div
          className="
            mb-4
            rounded-xl
            border
            border-[#E7E1D8]
            bg-white
            px-4
            py-3
            shadow-luxury-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >

            <div>

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  text-[#B99A62]
                  font-bold
                "
              >
                Printed Desires Wall Art
              </p>

              <h2
                className="
                  mt-1
                  text-base
                  sm:text-lg
                  font-semibold
                  text-[#171513]
                "
              >
                {
                  safeMaterialConfig.displayName
                }
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  text-[#4A352B]/70
                "
              >
                {
                  safeMaterialConfig.description
                }
              </p>

            </div>

            <div
              className="
                shrink-0
                text-xs
                font-semibold
                text-[#4A352B]
              "
            >
              {
                safeMaterialConfig.id
              }
            </div>

          </div>

        </div>

        {/* ====================================================
            MAIN GRID
        ==================================================== */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-6
            lg:gap-8
            items-start
          "
        >

          {/* ==================================================
              LEFT — PREVIEW
          ================================================== */}

          <div
            className="
              lg:col-span-7
              h-full
              flex
              flex-col
            "
          >

            {viewMode === '3d' ? (

           <Canvas3DViewer
  customization={customization}
  viewMode={viewMode}
  onViewModeChange={setViewMode}
  onOpenEditor={() => setIsEditorOpen(true)}
  primaryColor={storeConfig.primaryColor}
  brandName={storeConfig.brandName}
  selectedMaterial={selectedMaterial}
  materialConfig={safeMaterialConfig}
/>
            ) : (

              <RoomVisualizer

                customization={
                  customization
                }

                onSelectSize={
                  handleSelectSize
                }

                onViewModeChange={
                  setViewMode
                }

                viewMode={
                  viewMode
                }

                primaryColor={
                  storeConfig.primaryColor
                }

                availableSizes={
                  activeMaterialSizes
                }

              />

            )}

            {/* ==================================================
                QUALITY FEATURES
            ================================================== */}

            <div
              className="
                mt-4
                grid
                grid-cols-2
                sm:grid-cols-4
                gap-2.5
                text-center
                text-xs
                text-[#4A352B]
              "
            >

              <div
                className="
                  p-2.5
                  bg-[#FFFFFF]
                  rounded-xl
                  border
                  border-[#E7E1D8]
                  shadow-luxury-sm
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  font-medium
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
                  Algodón 380g/m²
                </span>

              </div>

              <div
                className="
                  p-2.5
                  bg-[#FFFFFF]
                  rounded-xl
                  border
                  border-[#E7E1D8]
                  shadow-luxury-sm
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  font-medium
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
                  Tintas Epson HD
                </span>

              </div>

              <div
                className="
                  p-2.5
                  bg-[#FFFFFF]
                  rounded-xl
                  border
                  border-[#E7E1D8]
                  shadow-luxury-sm
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  font-medium
                "
              >

                <Shield
                  className="
                    w-3.5
                    h-3.5
                    text-[#B99A62]
                  "
                />

                <span>
                  100+ Años UV
                </span>

              </div>

              <div
                className="
                  p-2.5
                  bg-[#FFFFFF]
                  rounded-xl
                  border
                  border-[#E7E1D8]
                  shadow-luxury-sm
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  font-medium
                "
              >

                <Award
                  className="
                    w-3.5
                    h-3.5
                    text-[#B99A62]
                  "
                />

                <span>
                  Tensado a Mano
                </span>

              </div>

            </div>

          </div>

          {/* ==================================================
              RIGHT — SIZE / PURCHASE
          ================================================== */}

          <div
            className="
              lg:col-span-5
              h-full
            "
          >

            <SizeSelector
materialId={selectedMaterial}
              customization={
                customization
              }

              config={
                storeConfig
              }

              selectedCurrency={
                selectedCurrency
              }

              onSelectSize={
                handleSelectSize
              }

              onUpdateCustomization={
                handleUpdateCustomization
              }

              onOpenEditor={() =>
                setIsEditorOpen(
                  true
                )
              }

              onOpenImageModal={() =>
                setIsImageModalOpen(
                  true
                )
              }

              onAddToBasket={
                handleAddToBasket
              }

              onOpenShopify={() =>
                setIsShopifyOpen(
                  true
                )
              }

              onQuickUpdateConfig={
                (updater) =>
                  setStoreConfig(
                    updater
                  )
              }

            />

          </div>

        </div>

      </main>

      {/* ======================================================
          SHOPIFY CODE MODAL
      ====================================================== */}

      <ShopifyCodeModal

        isOpen={
          isShopifyOpen
        }

        onClose={() =>
          setIsShopifyOpen(false)
        }

        brandName={
          storeConfig.brandName
        }

      />

      {/* ======================================================
          IMAGE EDITOR
      ====================================================== */}

      <EditorModal

        isOpen={
          isEditorOpen
        }

        onClose={() =>
          setIsEditorOpen(false)
        }

        customization={
          customization
        }

        onSave={
          handleUpdateCustomization
        }

      />

      {/* ======================================================
          IMAGE SELECTOR
      ====================================================== */}

      <ImageModal

        isOpen={
          isImageModalOpen
        }

        onClose={() =>
          setIsImageModalOpen(false)
        }

        onSelectImage={
          handleSelectImage
        }

        currentImage={
          customization.selectedImage
        }

      />

      {/* ======================================================
          CART
      ====================================================== */}

      <CartDrawer

        isOpen={
          isCartOpen
        }

        onClose={() =>
          setIsCartOpen(false)
        }

        items={
          cartItems
        }

        onUpdateQuantity={
          handleUpdateQuantity
        }

        onRemoveItem={
          handleRemoveItem
        }

        currency={
          selectedCurrency
        }

        primaryColor={
          storeConfig.primaryColor
        }

      />

      {/* ======================================================
          QUALITY INFORMATION
      ====================================================== */}

      <QualityInfoModal

        isOpen={
          isQualityModalOpen
        }

        onClose={() =>
          setIsQualityModalOpen(false)
        }

      />

    </div>
  );
}
