import React from 'react';
import { ShoppingBag, Sliders, ShieldCheck, Code2 } from 'lucide-react';
import { CurrencyConfig, StoreConfig } from '../types/canvas';
import { formatCurrency } from '../utils/canvasHelpers';
import { PrintedDesiresLogo } from './PrintedDesiresLogo';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  config: StoreConfig;
  selectedCurrency: CurrencyConfig;
  onCurrencyChange: (code: string) => void;
  onOpenCart: () => void;
  onOpenStoreEditor: () => void;
  onOpenShopify: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  config,
  selectedCurrency,
  onCurrencyChange,
  onOpenCart,
  onOpenStoreEditor,
  onOpenShopify,
  onOpenHelp,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F8F5F0]/95 backdrop-blur-md border-b border-[#E7E1D8] shadow-luxury-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand logo - Supplied Logo without background */}
        <div className="flex items-center">
          <a href="#" className="flex items-center py-1 group" aria-label="Printed Desires Home">
            <PrintedDesiresLogo size="md" />
          </a>
        </div>

        {/* Navigation links - zone 2 */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#4A352B]">
          <span className="text-xs text-[#4A352B]/70 tracking-wider uppercase font-medium">
            Fine Art Canvas Atelier
          </span>
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 hover:text-[#171513] transition-colors text-xs font-semibold text-[#4A352B]"
          >
            <ShieldCheck className="w-4 h-4 text-[#B99A62]" />
            <span>Garantía de Calidad 100%</span>
          </button>
        </nav>

        {/* Actions - zone 3 */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Shopify HTML Code Button */}
          <button
            onClick={onOpenShopify}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#FFFFFF] hover:bg-[#171513] text-[#171513] hover:text-[#FFFFFF] rounded-lg border border-[#B99A62] transition-all shadow-luxury-sm active:scale-95 group"
            title="Obtener botón y código HTML optimizado para Shopify"
          >
            <Code2 className="w-3.5 h-3.5 text-[#B99A62] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Código Shopify</span>
            <span className="sm:hidden">Shopify</span>
          </button>

          {/* Admin / Store Editor Button */}
          <button
            onClick={onOpenStoreEditor}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F2ECE1] text-[#171513] rounded-lg border border-[#D9CEBF] transition-all shadow-luxury-sm active:scale-95"
            title="Editar textos, precios, colores, secciones y monedas"
          >
            <Sliders className="w-3.5 h-3.5 text-[#B99A62]" />
            <span className="hidden sm:inline">Configuración</span>
            <span className="sm:hidden">Ajustes</span>
          </button>

          {/* Currency Selector */}
          <div className="flex items-center border border-[#D9CEBF] rounded-lg p-0.5 bg-[#FFFFFF] text-xs font-semibold text-[#171513] shadow-luxury-sm">
            {config.currencies.map((curr) => {
              const isSelected = selectedCurrency.code === curr.code;
              return (
                <button
                  key={curr.code}
                  onClick={() => onCurrencyChange(curr.code)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    isSelected
                      ? 'bg-[#171513] text-[#FFFFFF] font-bold'
                      : 'text-[#4A352B] hover:text-[#171513]'
                  }`}
                  title={`${curr.label} - Tasa: ${curr.rate}`}
                >
                  {curr.symbol}
                </button>
              );
            })}
          </div>

          {/* Cart button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 text-[#FFFFFF] px-4 py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all shadow-luxury-md active:scale-95 hover:opacity-95"
            style={{ backgroundColor: '#171513' }}
            aria-label="Ver cesta"
          >
            <ShoppingBag className="w-4 h-4 text-[#B99A62]" />
            <span className="hidden sm:inline font-medium">Cesta</span>
            {cartCount > 0 && (
              <span
                className="bg-[#B99A62] text-[#FFFFFF] font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
              >
                {cartCount}
              </span>
            )}
            {cartTotal > 0 && (
              <span className="hidden md:inline border-l border-white/20 pl-2 font-mono tabular-nums text-xs text-[#F8F5F0]">
                {formatCurrency(cartTotal, selectedCurrency)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
