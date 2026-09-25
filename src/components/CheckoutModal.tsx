import React, { useState } from 'react';
import { CartItem, CurrencyConfig } from '../types/canvas';
import { formatCurrency } from '../utils/canvasHelpers';
import {
  CheckCircle,
  CreditCard,
  Lock,
  Truck,
  X,
  Package,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: () => void;
  currency: CurrencyConfig | string;
  primaryColor?: string;
  brandName?: string;
  freeShippingThreshold?: number;
  shippingCost?: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
  currency,
  primaryColor = '#e60067',
  brandName = 'Pdesires',
  freeShippingThreshold = 60,
  shippingCost = 5.95,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'applepay'>('card');
  const [formData, setFormData] = useState({
    name: 'Elena Morales',
    email: 'elena.morales@example.com',
    address: 'Calle Mayor 45, 3º B',
    city: 'Madrid',
    postalCode: '28013',
    country: 'España',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '•••',
  });

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const shipping = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : shippingCost;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  const handleFinish = () => {
    onOrderSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-neutral-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                {step === 'form' ? 'Tramitación de Pedido Seguro' : '¡Pedido Confirmado con Éxito!'}
              </h3>
              <p className="text-xs text-neutral-500">
                {step === 'form'
                  ? `Pasarela cifrada SSL de 256 bits · Garantía ${brandName}`
                  : 'Recibirás un email de confirmación con el seguimiento'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
            {/* Order Items Preview */}
            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-xs">
              <span className="font-bold text-neutral-800 block mb-2">Resumen de tu pedido:</span>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-neutral-700">
                    <span className="truncate max-w-[280px]">
                      {item.quantity}x Lienzo {item.customization.size.label} ({item.customization.wrapStyle})
                    </span>
                    <span className="font-mono font-bold">
                      {formatCurrency(item.unitPrice * item.quantity, currency)}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-sm text-neutral-900">
                  <span>Total a pagar:</span>
                  <span className="font-mono" style={{ color: primaryColor }}>
                    {formatCurrency(total, currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4" style={{ color: primaryColor }} />
                <span>1. Datos de Entrega</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-600 font-semibold mb-1">Nombre completo:</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-semibold mb-1">Correo electrónico:</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-medium"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-neutral-600 font-semibold mb-1">Dirección de envío:</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-semibold mb-1">Ciudad:</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-semibold mb-1">Código Postal:</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" style={{ color: primaryColor }} />
                <span>2. Método de Pago</span>
              </h4>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card', label: 'Tarjeta Bancaria' },
                  { id: 'paypal', label: 'PayPal' },
                  { id: 'applepay', label: 'Apple Pay' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      paymentMethod === m.id
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-2xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2.5 text-xs">
                  <div>
                    <label className="block text-neutral-600 font-semibold mb-1">Número de tarjeta:</label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Caducidad (MM/AA):</label>
                      <input
                        type="text"
                        value={formData.cardExp}
                        onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                        className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">CVC / CVV:</label>
                      <input
                        type="text"
                        value={formData.cardCvc}
                        onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                        className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.99]"
                style={{ backgroundColor: primaryColor }}
              >
                <Lock className="w-4 h-4" />
                <span>Pagar {formatCurrency(total, currency)} y Confirmar Pedido</span>
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Success Screen */
          <div className="p-8 text-center space-y-5 flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Pedido #PD-{Math.floor(100000 + Math.random() * 900000)}
              </span>
              <h3 className="text-xl font-bold text-neutral-900 mt-2 font-serif-display">
                ¡Gracias por tu pedido en {brandName}, {formData.name}!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-md mx-auto">
                Hemos recibido tu diseño personalizado y nuestro equipo comenzará la producción artesanal sobre tela canvas tensada a mano.
              </p>
            </div>

            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-left w-full max-w-md text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Destinatario:</span>
                <span className="font-semibold text-neutral-900">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Dirección:</span>
                <span className="font-semibold text-neutral-900">
                  {formData.address}, {formData.city}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Entrega estimada:</span>
                <span className="font-semibold text-emerald-700">En 48 - 72 horas laborables</span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2 font-bold text-sm">
                <span>Total pagado:</span>
                <span className="font-mono" style={{ color: primaryColor }}>
                  {formatCurrency(total, currency)}
                </span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Diseñar Otro Lienzo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
