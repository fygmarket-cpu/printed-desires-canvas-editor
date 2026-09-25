import React, { useState } from 'react';
import {
  CategoryItem,
  CurrencyConfig,
  FrameOption,
  CanvasSize,
  StoreConfig,
} from '../types/canvas';
import {
  X,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  DollarSign,
  Palette,
  Layers,
  FolderPlus,
  Sliders,
  Sparkles,
  Download,
  Upload,
  Check,
  AlertCircle,
  Tag,
} from 'lucide-react';

interface StoreEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: StoreConfig;
  onSaveConfig: (newConfig: StoreConfig) => void;
  onResetDefaults: () => void;
  onOpenShopify?: () => void;
}

type AdminTab = 'brand' | 'sizes' | 'categories' | 'currencies' | 'discounts' | 'frames';

const COLOR_PRESETS = [
  { name: 'Dorado Fine Art', hex: '#B99A62' },
  { name: 'Rosa Apagado', hex: '#B98989' },
  { name: 'Marrón Nogal', hex: '#4A352B' },
  { name: 'Casi Negro', hex: '#171513' },
  { name: 'Azul Real', hex: '#2563eb' },
  { name: 'Esmeralda Lujo', hex: '#059669' },
  { name: 'Ámbar Cálido', hex: '#d97706' },
];

export const StoreEditorModal: React.FC<StoreEditorModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetDefaults,
  onOpenShopify,
}) => {
  if (!isOpen) return null;

  // Local copy of store configuration for editing
  const [localConfig, setLocalConfig] = useState<StoreConfig>(JSON.parse(JSON.stringify(config)));
  const [activeTab, setActiveTab] = useState<AdminTab>('brand');
  const [sizeFilterCategory, setSizeFilterCategory] = useState<string>('all');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New size item helper
  const handleAddNewSize = () => {
    const newId = `size-${Date.now()}`;
    const newSize: CanvasSize = {
      id: newId,
      label: '50 x 70cm',
      widthCm: 50,
      heightCm: 70,
      originalPrice: 69.95,
      discountedPrice: 34.99,
      discountPercent: 50,
      category: localConfig.categories[0]?.id || 'popular',
      isBestSeller: false,
    };
    setLocalConfig((prev) => ({ ...prev, sizes: [newSize, ...prev.sizes] }));
  };

  const handleUpdateSize = (id: string, partial: Partial<CanvasSize>) => {
    setLocalConfig((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, ...partial };
        // Recalculate discount percent if prices changed
        if (partial.originalPrice !== undefined || partial.discountedPrice !== undefined) {
          const orig = partial.originalPrice ?? updated.originalPrice;
          const disc = partial.discountedPrice ?? updated.discountedPrice;
          if (orig > 0) {
            updated.discountPercent = Math.max(0, Math.round(((orig - disc) / orig) * 100));
          }
        }
        return updated;
      }),
    }));
  };

  const handleDeleteSize = (id: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s.id !== id),
    }));
  };

  // Category helpers
  const handleAddCategory = () => {
    const name = prompt('Nombre de la nueva categoría / sección (ej. Panorámicos XL, Trípticos):');
    if (!name || !name.trim()) return;
    const cleanId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCat: CategoryItem = { id: cleanId, label: name.trim() };
    setLocalConfig((prev) => ({
      ...prev,
      categories: [...prev.categories, newCat],
    }));
  };

  const handleDeleteCategory = (catId: string) => {
    if (localConfig.categories.length <= 1) {
      alert('Debe quedar al menos una categoría en la tienda.');
      return;
    }
    if (confirm(`¿Eliminar la categoría "${catId}"? Los tamaños asociados pasarán a la primera categoría.`)) {
      const fallbackCat = localConfig.categories.find((c) => c.id !== catId)?.id || 'popular';
      setLocalConfig((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c.id !== catId),
        sizes: prev.sizes.map((s) => (s.category === catId ? { ...s, category: fallbackCat } : s)),
      }));
    }
  };

  // Currency helpers
  const handleAddCurrency = () => {
    const code = prompt('Código de moneda de 3 letras (ej: CAD, CLP, COP, ARS):')?.toUpperCase();
    if (!code || code.length !== 3) return;
    const symbol = prompt('Símbolo monetario (ej: $, C$, Fr):', '$') || '$';
    const rateStr = prompt('Tasa de cambio respecto a la moneda base (ej. 1.25):', '1.0');
    const rate = parseFloat(rateStr || '1') || 1;

    const newCurr: CurrencyConfig = {
      code,
      symbol,
      label: `${code} (${symbol})`,
      rate,
      position: 'prefix',
    };

    setLocalConfig((prev) => ({
      ...prev,
      currencies: [...prev.currencies, newCurr],
    }));
  };

  const handleDeleteCurrency = (code: string) => {
    if (localConfig.currencies.length <= 1) {
      alert('Debe mantenerse al menos una moneda.');
      return;
    }
    setLocalConfig((prev) => ({
      ...prev,
      currencies: prev.currencies.filter((c) => c.code !== code),
      selectedCurrencyCode:
        prev.selectedCurrencyCode === code ? prev.currencies[0].code : prev.selectedCurrencyCode,
    }));
  };

  // Frame helpers
  const handleAddFrame = () => {
    const name = prompt('Nombre del marco (ej: Marco Nogal Americano):');
    if (!name || !name.trim()) return;
    const priceStr = prompt('Precio adicional del marco:', '19.95');
    const price = parseFloat(priceStr || '15') || 15;
    const newFrame: FrameOption = {
      id: `frame-${Date.now()}`,
      name: name.trim(),
      description: 'Acabado artesanal a medida',
      price,
      colorClass: 'bg-neutral-800 border-neutral-900',
      hexColor: '#333333',
    };
    setLocalConfig((prev) => ({ ...prev, frames: [...prev.frames, newFrame] }));
  };

  const handleDeleteFrame = (frameId: string) => {
    if (frameId === 'none') {
      alert('La opción "Sin marco" no puede eliminarse.');
      return;
    }
    setLocalConfig((prev) => ({
      ...prev,
      frames: prev.frames.filter((f) => f.id !== frameId),
    }));
  };

  // Global automatic discount toggle & applier
  const handleApplyGlobalDiscount = () => {
    const pct = localConfig.globalAutoDiscount;
    setLocalConfig((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s) => {
        const discounted = Math.round(s.originalPrice * (1 - pct / 100) * 100) / 100;
        return {
          ...s,
          discountedPrice: discounted,
          discountPercent: pct,
        };
      }),
    }));
    setStatusMessage(`¡Descuento del ${pct}% aplicado a todos los tamaños!`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localConfig, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tienda-canvas-config-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.sizes && parsed.categories) {
          setLocalConfig(parsed);
          setStatusMessage('Configuración importada con éxito.');
          setTimeout(() => setStatusMessage(null), 3000);
        }
      } catch (err) {
        alert('Archivo JSON no válido.');
      }
    };
    reader.readAsText(file);
  };

  // Save changes
  const handleSave = () => {
    onSaveConfig(localConfig);
    setStatusMessage('¡Cambios guardados con éxito!');
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 600);
  };

  const filteredSizes =
    sizeFilterCategory === 'all'
      ? localConfig.sizes
      : localConfig.sizes.filter((s) => s.category === sizeFilterCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[92vh] max-h-[850px] flex flex-col overflow-hidden border border-neutral-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg text-white"
              style={{ backgroundColor: localConfig.primaryColor }}
            >
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight flex items-center gap-2">
                <span>Panel de Control & Editor de Tienda</span>
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-mono">
                  100% Editable
                </span>
              </h2>
              <p className="text-xs text-neutral-300">
                Personaliza textos, precios, monedas, categorías, descuentos automáticos y paleta de colores en tiempo real.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-neutral-200 bg-neutral-50 px-6 gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'brand', label: '🎨 Marca & Colores', icon: Palette },
            { id: 'sizes', label: '📐 Tamaños & Precios', icon: Tag },
            { id: 'categories', label: '📂 Categorías / Pestañas', icon: FolderPlus },
            { id: 'currencies', label: '💱 Monedas & Divisas', icon: DollarSign },
            { id: 'discounts', label: '🏷️ Descuentos Automáticos', icon: Sparkles },
            { id: 'frames', label: '🖼️ Bastidores & Marcos', icon: Layers },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`py-3 px-3.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-neutral-900 text-neutral-950 bg-white shadow-2xs'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-semibold flex items-center gap-2 justify-center">
            <Check className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#fcfcfb]">
          {/* TAB 1: MARCA Y COLORES */}
          {activeTab === 'brand' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 border-b pb-2">
                  Identidad y Logotipo de la Tienda
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Nombre de la marca (ej: pdesires):
                    </label>
                    <input
                      type="text"
                      value={localConfig.brandName}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, brandName: e.target.value })
                      }
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg font-medium text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Palabra destacada con color de acento (ej: desires):
                    </label>
                    <input
                      type="text"
                      value={localConfig.brandHighlight}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, brandHighlight: e.target.value })
                      }
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg font-medium text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Etiqueta / Tagline (ej: Canvas Studio):
                    </label>
                    <input
                      type="text"
                      value={localConfig.brandTagline}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, brandTagline: e.target.value })
                      }
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg font-medium text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Aviso de plazo de entrega:
                    </label>
                    <input
                      type="text"
                      value={localConfig.deliveryNotice}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, deliveryNotice: e.target.value })
                      }
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg font-medium text-sm"
                    />
                  </div>
                </div>

                {/* Live Logo Preview */}
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Vista previa del logotipo:</span>
                  <div className="text-2xl font-bold tracking-tight">
                    <span className="text-neutral-900 font-semibold">
                      {localConfig.brandName.replace(localConfig.brandHighlight, '')}
                    </span>
                    <span
                      className="font-extrabold tracking-tight"
                      style={{ color: localConfig.primaryColor }}
                    >
                      {localConfig.brandHighlight}
                    </span>
                    <span className="ml-2 text-[10px] uppercase tracking-wider text-neutral-400 border border-neutral-200 rounded px-1.5 py-0.5">
                      {localConfig.brandTagline}
                    </span>
                  </div>
                </div>
              </div>

              {/* Color corporativo */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 border-b pb-2">
                  Color Primario Corporativo
                </h3>
                <p className="text-xs text-neutral-500">
                  Este color tiñe los botones principales, descuentos, insignias activas y acentos visuales de toda la tienda.
                </p>

                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={localConfig.primaryColor}
                    onChange={(e) =>
                      setLocalConfig({ ...localConfig, primaryColor: e.target.value })
                    }
                    className="w-12 h-12 rounded-xl border border-neutral-300 cursor-pointer p-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-800 block">Código Hexadecimal:</span>
                    <input
                      type="text"
                      value={localConfig.primaryColor}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, primaryColor: e.target.value })
                      }
                      className="font-mono text-sm uppercase p-1.5 border border-neutral-300 rounded font-semibold w-28"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-neutral-700 block">
                    Paletas populares predefinidas:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_PRESETS.map((cp) => (
                      <button
                        key={cp.hex}
                        onClick={() => setLocalConfig({ ...localConfig, primaryColor: cp.hex })}
                        className="px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 hover:bg-neutral-50 transition-all"
                        style={{
                          borderColor: localConfig.primaryColor === cp.hex ? cp.hex : '#e5e5e5',
                          backgroundColor:
                            localConfig.primaryColor === cp.hex ? `${cp.hex}15` : 'white',
                        }}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: cp.hex }}
                        />
                        <span>{cp.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Banner superior */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-sm font-bold text-neutral-900">
                    Banner Promocional Superior
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localConfig.showTopBanner}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, showTopBanner: e.target.checked })
                      }
                      className="accent-neutral-900 rounded"
                    />
                    <span>Mostrar banner superior</span>
                  </label>
                </div>

                {localConfig.showTopBanner && (
                  <div>
                    <label className="block text-xs text-neutral-600 font-semibold mb-1">
                      Texto del banner promocional:
                    </label>
                    <input
                      type="text"
                      value={localConfig.topBannerText}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, topBannerText: e.target.value })
                      }
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg text-xs font-medium"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TAMAÑOS & PRECIOS */}
          {activeTab === 'sizes' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-neutral-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-700">Filtrar por sección:</span>
                  <select
                    value={sizeFilterCategory}
                    onChange={(e) => setSizeFilterCategory(e.target.value)}
                    className="p-1.5 border border-neutral-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="all">Todas las secciones ({localConfig.sizes.length})</option>
                    {localConfig.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddNewSize}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Nuevo Tamaño</span>
                </button>
              </div>

              {/* Sizes Table / Cards */}
              <div className="space-y-2">
                {filteredSizes.map((size) => (
                  <div
                    key={size.id}
                    className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center hover:border-neutral-300 transition-colors"
                  >
                    {/* Size Label & Dimensions */}
                    <div className="md:col-span-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={size.label}
                          onChange={(e) => handleUpdateSize(size.id, { label: e.target.value })}
                          className="font-bold text-sm text-neutral-900 p-1 border-b border-neutral-300 focus:border-neutral-900 w-full"
                          placeholder="75 x 100cm"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-neutral-500">
                        <span>Ancho:</span>
                        <input
                          type="number"
                          value={size.widthCm}
                          onChange={(e) =>
                            handleUpdateSize(size.id, { widthCm: Number(e.target.value) })
                          }
                          className="w-12 p-0.5 border rounded text-center font-mono"
                        />
                        <span>cm × Alto:</span>
                        <input
                          type="number"
                          value={size.heightCm}
                          onChange={(e) =>
                            handleUpdateSize(size.id, { heightCm: Number(e.target.value) })
                          }
                          className="w-12 p-0.5 border rounded text-center font-mono"
                        />
                        <span>cm</span>
                      </div>
                    </div>

                    {/* Category Selector */}
                    <div className="md:col-span-2">
                      <label className="text-[10px] text-neutral-400 font-semibold block">Sección:</label>
                      <select
                        value={size.category}
                        onChange={(e) => handleUpdateSize(size.id, { category: e.target.value })}
                        className="w-full p-1.5 border border-neutral-300 rounded text-xs font-medium"
                      >
                        {localConfig.categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Original Price */}
                    <div className="md:col-span-2">
                      <label className="text-[10px] text-neutral-400 font-semibold block">
                        Precio Original:
                      </label>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-neutral-500 font-mono">€</span>
                        <input
                          type="number"
                          step="0.01"
                          value={size.originalPrice}
                          onChange={(e) =>
                            handleUpdateSize(size.id, { originalPrice: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full p-1.5 border border-neutral-300 rounded text-xs font-mono font-semibold"
                        />
                      </div>
                    </div>

                    {/* Discounted Price */}
                    <div className="md:col-span-2">
                      <label className="text-[10px] text-neutral-400 font-semibold block">
                        Precio en Oferta:
                      </label>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-neutral-500 font-mono">€</span>
                        <input
                          type="number"
                          step="0.01"
                          value={size.discountedPrice}
                          onChange={(e) =>
                            handleUpdateSize(size.id, {
                              discountedPrice: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full p-1.5 border border-neutral-300 rounded text-xs font-mono font-bold text-neutral-900"
                        />
                      </div>
                    </div>

                    {/* Discount & Best Seller */}
                    <div className="md:col-span-2 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                          {size.discountPercent}% OFF
                        </span>
                      </div>
                      <label className="flex items-center gap-1.5 text-[11px] text-neutral-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={size.isBestSeller || false}
                          onChange={(e) =>
                            handleUpdateSize(size.id, { isBestSeller: e.target.checked })
                          }
                          className="accent-neutral-900 rounded"
                        />
                        <span>Best Seller</span>
                      </label>
                    </div>

                    {/* Delete button */}
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        onClick={() => handleDeleteSize(size.id)}
                        className="p-2 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Eliminar este tamaño"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORÍAS */}
          {activeTab === 'categories' && (
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-neutral-200">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    Pestañas y Secciones de la Tienda
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Añade, renombra o elimina pestañas del menú de selección de tamaños.
                  </p>
                </div>
                <button
                  onClick={handleAddCategory}
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Sección</span>
                </button>
              </div>

              <div className="space-y-2">
                {localConfig.categories.map((cat, idx) => (
                  <div
                    key={cat.id}
                    className="bg-white p-3.5 rounded-xl border border-neutral-200 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-xs font-mono text-neutral-400 font-bold">
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={cat.label}
                        onChange={(e) => {
                          const updated = [...localConfig.categories];
                          updated[idx].label = e.target.value;
                          setLocalConfig({ ...localConfig, categories: updated });
                        }}
                        className="font-semibold text-sm text-neutral-900 p-1 border-b border-neutral-300 w-full max-w-xs"
                      />
                      <span className="text-[11px] text-neutral-400 font-mono">
                        ({localConfig.sizes.filter((s) => s.category === cat.id).length} tamaños)
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Eliminar sección"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MONEDAS & DIVISAS */}
          {activeTab === 'currencies' && (
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-neutral-200">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    Gestión de Monedas y Tasas de Cambio
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Configura las monedas disponibles para los clientes en la cabecera.
                  </p>
                </div>
                <button
                  onClick={handleAddCurrency}
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Moneda</span>
                </button>
              </div>

              <div className="space-y-2">
                {localConfig.currencies.map((curr, idx) => (
                  <div
                    key={curr.code}
                    className="bg-white p-3.5 rounded-xl border border-neutral-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-3">
                      <span className="text-xs text-neutral-400 font-semibold block">Código:</span>
                      <input
                        type="text"
                        value={curr.code}
                        onChange={(e) => {
                          const updated = [...localConfig.currencies];
                          updated[idx].code = e.target.value.toUpperCase();
                          setLocalConfig({ ...localConfig, currencies: updated });
                        }}
                        className="font-mono font-bold text-sm text-neutral-900 p-1 border rounded w-20"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-xs text-neutral-400 font-semibold block">Símbolo:</span>
                      <input
                        type="text"
                        value={curr.symbol}
                        onChange={(e) => {
                          const updated = [...localConfig.currencies];
                          updated[idx].symbol = e.target.value;
                          setLocalConfig({ ...localConfig, currencies: updated });
                        }}
                        className="font-bold text-sm text-neutral-900 p-1 border rounded w-16 text-center"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <span className="text-xs text-neutral-400 font-semibold block">
                        Tasa de cambio (relativa a 1.00 base):
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={curr.rate}
                        onChange={(e) => {
                          const updated = [...localConfig.currencies];
                          updated[idx].rate = parseFloat(e.target.value) || 1;
                          setLocalConfig({ ...localConfig, currencies: updated });
                        }}
                        className="font-mono text-xs text-neutral-900 p-1.5 border rounded w-24"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <span className="text-xs text-neutral-400 font-semibold block">Posición:</span>
                      <select
                        value={curr.position}
                        onChange={(e) => {
                          const updated = [...localConfig.currencies];
                          updated[idx].position = e.target.value as 'prefix' | 'suffix';
                          setLocalConfig({ ...localConfig, currencies: updated });
                        }}
                        className="p-1 border rounded text-xs"
                      >
                        <option value="prefix">Prefijo (ej: $50.00)</option>
                        <option value="suffix">Sufijo (ej: 50,00 €)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        onClick={() => handleDeleteCurrency(curr.code)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Eliminar moneda"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DESCUENTOS AUTOMÁTICOS */}
          {activeTab === 'discounts' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 border-b pb-2">
                  Regla de Descuento Automático Masivo
                </h3>
                <p className="text-xs text-neutral-500">
                  Aplica un descuento global de forma automática sobre todos los tamaños de lienzos con un solo clic.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-800">
                      Porcentaje de descuento automático:
                    </span>
                    <span className="font-mono font-bold text-lg text-emerald-700">
                      {localConfig.globalAutoDiscount}% OFF
                    </span>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="80"
                    step="5"
                    value={localConfig.globalAutoDiscount}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        globalAutoDiscount: Number(e.target.value),
                      })
                    }
                    className="w-full accent-neutral-900"
                  />

                  <button
                    onClick={handleApplyGlobalDiscount}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Aplicar {localConfig.globalAutoDiscount}% de Descuento a Todos los Tamaños</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 border-b pb-2">
                  Gastos de Envío & Umbral Gratis
                </h3>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Umbral de pedido para Envío Gratuito (€):
                    </label>
                    <input
                      type="number"
                      value={localConfig.freeShippingThreshold}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          freeShippingThreshold: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 border border-neutral-300 rounded-lg font-mono font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Coste de envío estándar (€):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={localConfig.shippingCost}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          shippingCost: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 border border-neutral-300 rounded-lg font-mono font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MARCOS & BASTIDORES */}
          {activeTab === 'frames' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">
                      Opciones de Marcos Flotantes
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Configura los marcos opcionales disponibles y sus precios adicionales.
                    </p>
                  </div>
                  <button
                    onClick={handleAddFrame}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Marco</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {localConfig.frames.map((frame, idx) => (
                    <div
                      key={frame.id}
                      className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="color"
                          value={frame.hexColor || '#333333'}
                          onChange={(e) => {
                            const updated = [...localConfig.frames];
                            updated[idx].hexColor = e.target.value;
                            setLocalConfig({ ...localConfig, frames: updated });
                          }}
                          className="w-7 h-7 rounded border cursor-pointer p-0.5"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={frame.name}
                            onChange={(e) => {
                              const updated = [...localConfig.frames];
                              updated[idx].name = e.target.value;
                              setLocalConfig({ ...localConfig, frames: updated });
                            }}
                            className="font-bold text-neutral-900 border-b border-neutral-300 w-full p-0.5"
                          />
                          <input
                            type="text"
                            value={frame.description}
                            onChange={(e) => {
                              const updated = [...localConfig.frames];
                              updated[idx].description = e.target.value;
                              setLocalConfig({ ...localConfig, frames: updated });
                            }}
                            className="text-neutral-500 text-[11px] w-full p-0.5"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 font-semibold">+€</span>
                        <input
                          type="number"
                          step="0.5"
                          value={frame.price}
                          onChange={(e) => {
                            const updated = [...localConfig.frames];
                            updated[idx].price = parseFloat(e.target.value) || 0;
                            setLocalConfig({ ...localConfig, frames: updated });
                          }}
                          className="w-16 p-1 border rounded font-mono font-bold"
                        />
                        {frame.id !== 'none' && (
                          <button
                            onClick={() => handleDeleteFrame(frame.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suplemento de bastidor */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs space-y-3">
                <h3 className="text-sm font-bold text-neutral-900 border-b pb-2">
                  Grosor del Bastidor de Madera
                </h3>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <span className="font-bold block text-neutral-900 mb-1">
                      Bastidor Estándar (2 cm):
                    </span>
                    <span className="text-neutral-500">Incluido (0€ suplemento)</span>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <span className="font-bold block text-neutral-900 mb-1">
                      Bastidor Galería Gruesa (4 cm):
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-neutral-600 font-semibold">Suplemento: +€</span>
                      <input
                        type="number"
                        step="0.5"
                        value={localConfig.depthOptions.find((d) => d.depthCm === 4)?.extraPrice || 6}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setLocalConfig({
                            ...localConfig,
                            depthOptions: localConfig.depthOptions.map((d) =>
                              d.depthCm === 4 ? { ...d, extraPrice: val } : d
                            ),
                          });
                        }}
                        className="w-16 p-1 border rounded font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onResetDefaults}
              className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 px-2.5 py-1.5 rounded hover:bg-neutral-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer por defecto</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-1 px-2.5 py-1.5 rounded hover:bg-neutral-100 transition-colors"
              title="Descargar copia de seguridad en JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>

            <label className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-1 px-2.5 py-1.5 rounded hover:bg-neutral-100 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Importar</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportJSON}
              />
            </label>

            {onOpenShopify && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenShopify();
                }}
                className="text-xs text-[#171513] border border-[#B99A62] bg-[#FAF8F5] hover:bg-[#171513] hover:text-[#FFFFFF] flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-semibold shadow-xs"
                title="Abrir generador de código HTML para Shopify"
              >
                <span>🛍️ Código Shopify</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 rounded-lg text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configuración de Tienda</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
