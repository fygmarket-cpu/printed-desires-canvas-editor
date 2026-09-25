import React, { useState } from 'react';
import { CartItem, CurrencyConfig } from '../types/canvas';
import { formatCurrency } from '../utils/canvasHelpers';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  CheckCircle,
  Truck,
  ArrowRight,
  Tag,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  currency: CurrencyConfig | string;
  primaryColor?: string;
  freeShippingThreshold?: number;
  shippingCost?: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  currency,
  primaryColor = '#e60067',
  freeShippingThreshold = 60,
  shippingCost = 5.95,
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : shippingCost;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'PRINT10' || clean === 'CANVAS10') {
      setDiscountPercent(10);
      setPromoMessage('¡Cupón del 10% adicional aplicado con éxito!');
    } else if (clean === 'VIP20') {
      setDiscountPercent(20);
      setPromoMessage('¡Cupón VIP del 20% adicional aplicado!');
    } else {
      setPromoMessage('Cupón no válido o caducado (Prueba con PRINT10)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" style={{ color: primaryColor }} />
            <h3 className="font-bold text-neutral-900 text-base">
              Tu Cesta de Pedido ({items.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping banner */}
        <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {subtotal >= 60 ? (
              <strong>¡Genial! Tienes Envío Estándar GRATIS</strong>
            ) : (
              <span>
                Añade <strong>{formatCurrency(60 - subtotal, currency)}</strong> más para envío gratuito
              </span>
            )}
          </span>
        </div>

        {/* Items List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 divide-y divide-neutral-200 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center text-neutral-500">
              <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="font-semibold text-neutral-700">Tu cesta está vacía</p>
              <p className="text-xs mt-1">Personaliza tu primer lienzo con tus recuerdos favoritos.</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                Diseñar Ahora
              </button>
            </div>
          ) : (
            items.map((item) => {
              const { customization } = item;
              return (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3 sm:gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 relative">
                    <img
                      src={customization.selectedImage}
                      alt="Miniatura lienzo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-neutral-900/70 text-white text-[9px] text-center font-mono py-0.5">
                      {customization.size.label}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                          Lienzo Personalizado {customization.size.label}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <ul className="text-[11px] text-neutral-500 mt-1 space-y-0.5 leading-snug">
                        <li>
                          Bastidor: <strong>{customization.depthCm} cm</strong> · Borde:{' '}
                          <strong>{customization.wrapStyle}</strong>
                        </li>
                        {customization.frameStyle !== 'none' && (
                          <li className="text-neutral-700">
                            Marco: <strong>{customization.frameStyle.replace('_', ' ')}</strong>
                          </li>
                        )}
                        {customization.textLayers.length > 0 && (
                          <li className="text-[#e60067]">
                            Texto personalizado ({customization.textLayers.length} capa)
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Quantity & Unit Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-neutral-50">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 hover:bg-neutral-200 text-neutral-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold font-mono text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 hover:bg-neutral-200 text-neutral-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right font-mono tabular-nums">
                        <span className="text-xs sm:text-sm font-bold text-neutral-900">
                          {formatCurrency(item.unitPrice * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Promo code form */}
        {items.length > 0 && (
          <div className="p-4 border-t border-neutral-200 bg-neutral-50/70">
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Código de cupón (ej: PRINT10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs uppercase font-mono font-medium"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Aplicar
              </button>
            </form>
            {promoMessage && (
              <p
                className={`text-[11px] mt-1.5 font-medium ${
                  discountPercent > 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {promoMessage}
              </p>
            )}
          </div>
        )}

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-200 bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-neutral-600 font-mono tabular-nums">
              <div className="flex justify-between">
                <span>Subtotal artículos</span>
                <span className="font-semibold text-neutral-800">
                  {formatCurrency(subtotal, currency)}
                </span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Descuento cupón ({discountPercent}%)</span>
                  <span>-{formatCurrency(discountAmount, currency)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Envío certificado</span>
                <span>{shipping === 0 ? 'GRATIS' : formatCurrency(shipping, currency)}</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                <span className="font-sans">Total con IVA:</span>
                <span>{formatCurrency(total, currency)}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.99]"
              style={{ backgroundColor: primaryColor }}
            >
              <span>Tramitar Pedido Seguro</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garantía de reembolso 100% y encriptación SSL 256 bits</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
