import React, { useState, useEffect } from 'react';
import {
  CanvasCustomization,
  CanvasSize,
  CartItem,
  CurrencyConfig,
  StoreConfig,
} from './types/canvas';
import { DEFAULT_STORE_CONFIG, PRESET_ARTWORKS } from './data/canvasPresets';
import { Header } from './components/Header';
import { Canvas3DViewer } from './components/Canvas3DViewer';
import { RoomVisualizer } from './components/RoomVisualizer';
import { SizeSelector } from './components/SizeSelector';
import { ImageModal } from './components/ImageModal';
import { CartDrawer } from './components/CartDrawer';
import { QualityInfoModal } from './components/QualityInfoModal';
import { ShopifyCodeModal } from './components/ShopifyCodeModal';
import { Check, Layers, Palette, Shield, Award } from 'lucide-react';

const STORAGE_KEY = 'printed_desires_store_config_v2';

export default function App() {
  // Load store configuration from localStorage or default
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading store config from localStorage', e);
    }
    return DEFAULT_STORE_CONFIG;
  });

  // Persist store config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storeConfig));
    } catch (e) {
      console.error('Error saving store config to localStorage', e);
    }
  }, [storeConfig]);

  // Selected currency
  const selectedCurrency: CurrencyConfig =
    storeConfig.currencies.find((c) => c.code === storeConfig.selectedCurrencyCode) ||
    storeConfig.currencies[0] || {
      code: 'EUR',
      symbol: '€',
      label: 'EUR (€)',
      rate: 1,
      position: 'suffix',
    };

  // Default canvas size from config
  const initialSize =
    storeConfig.sizes.find((s) => s.id === '75x100') || storeConfig.sizes[0];
  const defaultArtwork = PRESET_ARTWORKS[0];

  const [customization, setCustomization] = useState<CanvasCustomization>({
    selectedImage: defaultArtwork.url,
    imageName: defaultArtwork.title,
    imageDimensions: { width: 3600, height: 4800 },
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

  // Ensure current size is kept in sync if storeConfig.sizes is modified
  useEffect(() => {
    const existing = storeConfig.sizes.find((s) => s.id === customization.size.id);
    if (existing) {
      setCustomization((prev) => ({ ...prev, size: existing }));
    } else if (storeConfig.sizes.length > 0) {
      setCustomization((prev) => ({ ...prev, size: storeConfig.sizes[0] }));
    }
  }, [storeConfig.sizes]);

  // View state
  const [viewMode, setViewMode] = useState<'3d' | 'room'>('3d');

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isQualityModalOpen, setIsQualityModalOpen] = useState<boolean>(false);
  const [isStoreEditorOpen, setIsStoreEditorOpen] = useState<boolean>(false);
  const [isShopifyOpen, setIsShopifyOpen] = useState<boolean>(false);

  // Currency changer
  const handleCurrencyChange = (code: string) => {
    setStoreConfig((prev) => ({ ...prev, selectedCurrencyCode: code }));
  };

  // Partial customization update
  const handleUpdateCustomization = (partial: Partial<CanvasCustomization>) => {
    setCustomization((prev) => ({ ...prev, ...partial }));
  };

  const handleSelectSize = (newSize: CanvasSize) => {
    setCustomization((prev) => ({ ...prev, size: newSize }));
  };

  const handleSelectImage = (
    url: string,
    name: string,
    dimensions?: { width: number; height: number }
  ) => {
    setCustomization((prev) => ({
      ...prev,
      selectedImage: url,
      imageName: name,
      imageDimensions: dimensions || { width: 3000, height: 3000 },
    }));
  };

// ============================================================
// PRINTED DESIRES → SHOPIFY BRIDGE
// Envía la configuración final al Shopify parent window.
// Shopify será quien ejecute /cart/add.js.
// ============================================================

const handleAddToBasket = () => {

  let price = customization.size.discountedPrice;

  const selectedDepth = storeConfig.depthOptions.find(
    (d) => d.depthCm === customization.depthCm
  );

  if (selectedDepth) {
    price += selectedDepth.extraPrice;
  }

  const selectedFrame = storeConfig.frames.find(
    (f) => f.id === customization.frameStyle
  );

  if (selectedFrame) {
    price += selectedFrame.price;
  }

  const finalPrice = Math.round(price * 100) / 100;

  /*
   * Datos que viajarán desde GitHub Pages
   * hacia la ventana de Shopify.
   */

  const orderItem = {

    quantity: 1,

    sizeId: customization.size.id,

    sizeLabel: customization.size.label,

    depthCm: customization.depthCm,

    frameId: customization.frameStyle,

    frameName: selectedFrame?.name || 'Sin Marco',

    wrapStyle: customization.wrapStyle,

    price: finalPrice,

    imageUrl: customization.selectedImage,

    imageName: customization.imageName,

    imageDimensions: customization.imageDimensions || null,

    filter: customization.filter,

    adjustments: customization.adjustments,

    transform: customization.transform,

    textLayers: customization.textLayers,

  };

  /*
   * Enviar al Shopify opener.
   */

  if (window.opener && !window.opener.closed) {

    window.opener.postMessage(
      {
        type: 'PRINTED_DESIRES_ORDER_READY',
        item: orderItem
      },
      '*'
    );

    /*
     * Cerrar el editor después de enviar
     * correctamente la configuración.
     */

    setToastMessage(
      'Configuración enviada a tu carrito de Shopify.'
    );

    setTimeout(() => {

      window.close();

    }, 700);

    return;
  }

  /*
   * Si el editor no fue abierto desde Shopify,
   * mostramos un mensaje en lugar de intentar
   * llamar directamente a la API de Shopify.
   */

  setToastMessage(
    'Abre el personalizador desde tu tienda Printed Desires para continuar con el carrito.'
  );

  setTimeout(() => {
    setToastMessage(null);
  }, 4000);
};

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Reset store defaults
  const handleResetDefaults = () => {
    if (confirm('¿Restablecer toda la configuración de la tienda a los valores iniciales?')) {
      setStoreConfig(DEFAULT_STORE_CONFIG);
      localStorage.removeItem(STORAGE_KEY);
      setToastMessage('Configuración restablecida por defecto.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0] text-[#171513]">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed top-24 right-5 z-50 bg-[#171513] text-[#FFFFFF] text-xs sm:text-sm font-medium px-4 py-3 rounded-xl border border-[#B99A62] shadow-luxury-lg flex items-center gap-2.5 animate-bounce"
          style={{ boxShadow: '0 10px 30px -5px rgba(18, 18, 18, 0.3)' }}
        >
          <Check className="w-4 h-4 text-[#B99A62]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        config={storeConfig}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={handleCurrencyChange}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenStoreEditor={() => setIsStoreEditorOpen(true)}
        onOpenShopify={() => setIsShopifyOpen(true)}
        onOpenHelp={() => setIsQualityModalOpen(true)}
      />

      {/* Main Studio Customizer Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Workspace Grid: Left is 3D/Room visualizer, Right is Size & Customization Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN: Interactive Canvas Viewport (7 cols) */}
          <div className="lg:col-span-7 h-full flex flex-col">
            {viewMode === '3d' ? (
              <Canvas3DViewer
                customization={customization}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onOpenEditor={() => setIsEditorOpen(true)}
                primaryColor={storeConfig.primaryColor}
                brandName={storeConfig.brandName}
              />
            ) : (
              <RoomVisualizer
                customization={customization}
                onSelectSize={handleSelectSize}
                onViewModeChange={setViewMode}
                viewMode={viewMode}
                primaryColor={storeConfig.primaryColor}
                availableSizes={storeConfig.sizes}
              />
            )}

            {/* Quick feature pill row underneath preview */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs text-[#4A352B]">
              <div className="p-2.5 bg-[#FFFFFF] rounded-xl border border-[#E7E1D8] shadow-luxury-sm flex items-center justify-center gap-1.5 font-medium">
                <Layers className="w-3.5 h-3.5 text-[#B99A62]" />
                <span>Algodón 380g/m²</span>
              </div>
              <div className="p-2.5 bg-[#FFFFFF] rounded-xl border border-[#E7E1D8] shadow-luxury-sm flex items-center justify-center gap-1.5 font-medium">
                <Palette className="w-3.5 h-3.5 text-[#B99A62]" />
                <span>Tintas Epson HD</span>
              </div>
              <div className="p-2.5 bg-[#FFFFFF] rounded-xl border border-[#E7E1D8] shadow-luxury-sm flex items-center justify-center gap-1.5 font-medium">
                <Shield className="w-3.5 h-3.5 text-[#B99A62]" />
                <span>100+ Años UV</span>
              </div>
              <div className="p-2.5 bg-[#FFFFFF] rounded-xl border border-[#E7E1D8] shadow-luxury-sm flex items-center justify-center gap-1.5 font-medium">
                <Award className="w-3.5 h-3.5 text-[#B99A62]" />
                <span>Tensado a Mano</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Size Selector & Purchase Module (5 cols) */}
          <div className="lg:col-span-5 h-full">
            <SizeSelector
              customization={customization}
              config={storeConfig}
              selectedCurrency={selectedCurrency}
              onSelectSize={handleSelectSize}
              onUpdateCustomization={handleUpdateCustomization}
              onOpenEditor={() => setIsEditorOpen(true)}
              onOpenImageModal={() => setIsImageModalOpen(true)}
              onAddToBasket={handleAddToBasket}
              onOpenStoreEditor={() => setIsStoreEditorOpen(true)}
              onOpenShopify={() => setIsShopifyOpen(true)}
              onQuickUpdateConfig={(updater) => setStoreConfig(updater)}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <StoreEditorModal
        isOpen={isStoreEditorOpen}
        onClose={() => setIsStoreEditorOpen(false)}
        config={storeConfig}
        onSaveConfig={setStoreConfig}
        onResetDefaults={handleResetDefaults}
        onOpenShopify={() => setIsShopifyOpen(true)}
      />

      <ShopifyCodeModal
        isOpen={isShopifyOpen}
        onClose={() => setIsShopifyOpen(false)}
        brandName={storeConfig.brandName}
      />

      <EditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        customization={customization}
        onSave={handleUpdateCustomization}
      />

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSelectImage={handleSelectImage}
        currentImage={customization.selectedImage}
      />

     <CartDrawer
  isOpen={isCartOpen}
  onClose={() => setIsCartOpen(false)}
  items={cartItems}
  onUpdateQuantity={handleUpdateQuantity}
  onRemoveItem={handleRemoveItem}
  currency={selectedCurrency}
  primaryColor={storeConfig.primaryColor}
/>
      <QualityInfoModal
        isOpen={isQualityModalOpen}
        onClose={() => setIsQualityModalOpen(false)}
      />
    </div>
  );
}
