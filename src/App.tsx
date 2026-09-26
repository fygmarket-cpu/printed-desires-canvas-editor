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
  DEFAULT_MATERIAL,
} from './config/materialConfig';
import {
  Check,
  Layers,
  Palette,
  Shield,
  Award,
} from 'lucide-react';

const STORAGE_KEY = 'printed_desires_store_config_v2';

export default function App() {
    const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialId>(DEFAULT_MATERIAL);
  // ============================================================
  // STORE CONFIG
  // ============================================================

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(
        'Error loading store config from localStorage',
        e
      );
    }

    return DEFAULT_STORE_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(storeConfig)
      );
    } catch (e) {
      console.error(
        'Error saving store config to localStorage',
        e
      );
    }
  }, [storeConfig]);

  // ============================================================
  // CURRENCY
  // ============================================================

  const selectedCurrency: CurrencyConfig =
    storeConfig.currencies.find(
      (c) => c.code === storeConfig.selectedCurrencyCode
    ) ||
    storeConfig.currencies[0] || {
      code: 'EUR',
      symbol: '€',
      label: 'EUR (€)',
      rate: 1,
      position: 'suffix',
    };

  const handleCurrencyChange = (code: string) => {
    setStoreConfig((prev) => ({
      ...prev,
      selectedCurrencyCode: code,
    }));
  };
  // ============================================================
  // MATERIAL SELECTION
  // ============================================================

  const handleSelectMaterial = (material: MaterialId) => {
    setSelectedMaterial(material);
  };
  // ============================================================
  // INITIAL CANVAS
  // ============================================================

  const initialSize =
    storeConfig.sizes.find(
      (s) => s.id === '75x100'
    ) || storeConfig.sizes[0];

  const defaultArtwork = PRESET_ARTWORKS[0];

  const [customization, setCustomization] =
    useState<CanvasCustomization>({
      selectedImage: defaultArtwork.url,
      imageName: defaultArtwork.title,
      imageDimensions: {
        width: 3600,
        height: 4800,
      },

      size: initialSize,

      depthCm: 2,
      wrapStyle: 'gallery',
      customWrapColor: '#ffffff',
      frameStyle: 'none',
      filter: 'none',

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

  // ============================================================
  // KEEP SELECTED SIZE IN SYNC
  // ============================================================

  useEffect(() => {
    const existing = storeConfig.sizes.find(
      (s) => s.id === customization.size.id
    );

    if (existing) {
      setCustomization((prev) => ({
        ...prev,
        size: existing,
      }));
    } else if (storeConfig.sizes.length > 0) {
      setCustomization((prev) => ({
        ...prev,
        size: storeConfig.sizes[0],
      }));
    }
  }, [storeConfig.sizes]);

  // ============================================================
  // VIEW
  // ============================================================

  const [viewMode, setViewMode] =
    useState<'3d' | 'room'>('3d');

  // ============================================================
  // CART
  // ============================================================

  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  // ============================================================
  // MODALS
  // ============================================================

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

  // ============================================================
  // CUSTOMIZATION UPDATE
  // ============================================================

  const handleUpdateCustomization = (
    partial: Partial<CanvasCustomization>
  ) => {
    setCustomization((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const handleSelectSize = (
    newSize: CanvasSize
  ) => {
    setCustomization((prev) => ({
      ...prev,
      size: newSize,
    }));
  };

  const handleSelectImage = (
    url: string,
    name: string,
    dimensions?: {
      width: number;
      height: number;
    }
  ) => {
    setCustomization((prev) => ({
      ...prev,
      selectedImage: url,
      imageName: name,
      imageDimensions:
        dimensions || {
          width: 3000,
          height: 3000,
        },
    }));
  };

  // ============================================================
  // PRINTED DESIRES → SHOPIFY BRIDGE
  //
  // Shopify receives the configuration and performs
  // the real /cart/add.js operation.
  // ============================================================

  const handleAddToBasket = () => {
    let price =
      customization.size.discountedPrice;

    const selectedDepth =
      storeConfig.depthOptions.find(
        (d) =>
          d.depthCm === customization.depthCm
      );

    if (selectedDepth) {
      price += selectedDepth.extraPrice;
    }

    const selectedFrame =
      storeConfig.frames.find(
        (f) =>
          f.id === customization.frameStyle
      );

    if (selectedFrame) {
      price += selectedFrame.price;
    }

    const finalPrice =
      Math.round(price * 100) / 100;

    const orderItem = {
      quantity: 1,

      sizeId:
        customization.size.id,

      sizeLabel:
        customization.size.label,

      depthCm:
        customization.depthCm,

      frameId:
        customization.frameStyle,

      frameName:
        selectedFrame?.name ||
        'Sin Marco',

      wrapStyle:
        customization.wrapStyle,

      price: finalPrice,

      imageUrl:
        customization.selectedImage,

      imageName:
        customization.imageName,

      imageDimensions:
        customization.imageDimensions || null,

      filter:
        customization.filter,

      adjustments:
        customization.adjustments,

      transform:
        customization.transform,

      textLayers:
        customization.textLayers,
    };

    // ------------------------------------------------------------
    // Send configuration to Shopify opener
    // ------------------------------------------------------------

    if (
      window.opener &&
      !window.opener.closed
    ) {
      window.opener.postMessage(
        {
          type:
            'PRINTED_DESIRES_ORDER_READY',
          item: orderItem,
        },
        '*'
      );

      setToastMessage(
        'Configuración enviada a tu carrito de Shopify.'
      );

      setTimeout(() => {
        window.close();
      }, 700);

      return;
    }

    // ------------------------------------------------------------
    // If opened directly instead of from Shopify
    // ------------------------------------------------------------

    setToastMessage(
      'Abre el personalizador desde tu tienda Printed Desires para continuar con el carrito.'
    );

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // ============================================================
  // INTERNAL CART
  // ============================================================

  const handleUpdateQuantity = (
    id: string,
    delta: number
  ) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty =
              item.quantity + delta;

            return newQty > 0
              ? {
                  ...item,
                  quantity: newQty,
                }
              : null;
          }

          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (
    id: string
  ) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  const cartTotal =
    cartItems.reduce(
      (acc, item) =>
        acc +
        item.unitPrice *
          item.quantity,
      0
    );

  const cartCount =
    cartItems.reduce(
      (acc, item) =>
        acc + item.quantity,
      0
    );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0] text-[#171513]">

      {/* ======================================================
          TOAST
      ====================================================== */}

      {toastMessage && (
        <div
          className="fixed top-24 right-5 z-50 bg-[#171513] text-[#FFFFFF] text-xs sm:text-sm font-medium px-4 py-3 rounded-xl border border-[#B99A62] shadow-luxury-lg flex items-center gap-2.5 animate-bounce"
          style={{
            boxShadow:
              '0 10px 30px -5px rgba(18, 18, 18, 0.3)',
          }}
        >
          <Check className="w-4 h-4 text-[#B99A62]" />

          <span>
            {toastMessage}
          </span>
        </div>
      )}

      {/* ======================================================
          HEADER
      ====================================================== */}

    <Header
  cartCount={cartCount}
  cartTotal={cartTotal}
  config={storeConfig}
  selectedCurrency={selectedCurrency}
  onCurrencyChange={handleCurrencyChange}
  onOpenCart={() => setIsCartOpen(true)}
  onOpenShopify={() => setIsShopifyOpen(true)}
  onOpenHelp={() => setIsQualityModalOpen(true)}
  onSelectMaterial={handleSelectMaterial}
/>

      {/* ======================================================
          MAIN CUSTOMIZER
      ====================================================== */}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* ==================================================
              LEFT — PREVIEW
          ================================================== */}

          <div className="lg:col-span-7 h-full flex flex-col">

            {viewMode === '3d' ? (
              <Canvas3DViewer
                customization={
                  customization
                }
                viewMode={
                  viewMode
                }
                onViewModeChange={
                  setViewMode
                }
                onOpenEditor={() =>
                  setIsEditorOpen(
                    true
                  )
                }
                primaryColor={
                  storeConfig.primaryColor
                }
                brandName={
                  storeConfig.brandName
                }
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
                  storeConfig.sizes
                }
              />
            )}

            {/* ==================================================
                QUALITY FEATURES
            ================================================== */}

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs text-[#4A352B]">

              <div className="p-2.5 bg-[#FFFFFF] rounded-xl border border-[#E7E1D8] shadow-luxury-sm flex items-center justify-center gap-1.5 font-medium">
                <Layers className="w-3.5 h-3.5 text-[#B99A62]" />
                <span>
                  Algodón 380g/m²
                </span>
              </div>

              <div className="p-2.5 bg-[#FFFFFF] rounded-xl border border-[#E7E1D8] shadow-luxury-sm flex items-center justify-center gap-1.5 font-medium">
                <Palette className="w-3.5 h-3.5 text-[#B99A62]" />
                <span>
                  Tintas Epson HD
                </span>
              </div>

              <div className="p-2.5 bg-[#FFFFFF] rounded-xl border border-[#E7E1D8] shadow-luxury-sm flex items-center justify-center gap-1.5 font-medium">
                <Shield className="w-3.5 h-3.5 text-[#B99A62]" />
                <span>
                  100+ Años UV
                </span>
              </div>

              <div className="p-2.5 bg-[#FFFFFF] rounded-xl border border-[#E7E1D8] shadow-luxury-sm flex items-center justify-center gap-1.5 font-medium">
                <Award className="w-3.5 h-3.5 text-[#B99A62]" />
                <span>
                  Tensado a Mano
                </span>
              </div>

            </div>
          </div>

          {/* ==================================================
              RIGHT — SIZE / PURCHASE
          ================================================== */}

          <div className="lg:col-span-5 h-full">

            <SizeSelector
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
