import React from 'react';
import { X, ShieldCheck, Check, Award, Truck } from 'lucide-react';

interface QualityInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QualityInfoModal: React.FC<QualityInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#121212]/80 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-[#FFFFFF] rounded-2xl shadow-luxury-xl w-full max-w-xl overflow-hidden border border-[#E7E1D8]"
        style={{ boxShadow: '0 25px 60px -15px rgba(18, 18, 18, 0.40)' }}
      >
        <div className="p-5 sm:p-6 border-b border-[#E7E1D8] flex items-center justify-between bg-[#F8F5F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#D9CEBF] flex items-center justify-center text-[#B99A62] shadow-luxury-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-normal text-[#171513] font-serif-display leading-tight">
                Garantía de Calidad Fine Art
              </h3>
              <p className="text-xs text-[#4A352B]/70 mt-0.5">
                Printed Desires · Ediciones de Galería y Museo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#4A352B]/60 hover:text-[#171513] rounded-lg hover:bg-[#F2ECE1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs sm:text-sm text-[#4A352B]">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#D9CEBF] text-[#B99A62] flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-[#171513] text-sm">Lienzo 100% Algodón de 380 g/m²</h4>
              <p className="text-[#4A352B]/75 text-xs mt-0.5 leading-relaxed">
                Tejido de textura fina con tacto sedoso y acabado mate satinado que elimina reflejos parásitos.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#D9CEBF] text-[#B99A62] flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-[#171513] text-sm">Bastidores de Madera de Pino Nórdico FSC®</h4>
              <p className="text-[#4A352B]/75 text-xs mt-0.5 leading-relaxed">
                Madera secada en horno de 2 cm o 4 cm, con cuñas de tensión ajustables en cada esquina para tensado permanente.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#D9CEBF] text-[#B98989] flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-[#171513] text-sm">Tintas Minerales Pigmentadas UltraChrome HD (+100 años)</h4>
              <p className="text-[#4A352B]/75 text-xs mt-0.5 leading-relaxed">
                Gama cromática de 12 canales con pigmentos encapsulados resistentes a la radiación solar UV y la decoloración.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#D9CEBF] text-[#4A352B] flex items-center justify-center shrink-0 mt-0.5">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-[#171513] text-sm">Embalaje Blindado para Transporte de Obras de Arte</h4>
              <p className="text-[#4A352B]/75 text-xs mt-0.5 leading-relaxed">
                Cantoneras reforzadas de cartón kraft y envoltorio de burbuja de alta densidad que protegen cada lienzo.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#F8F5F0] rounded-xl border border-[#D9CEBF] text-[#4A352B] text-xs flex items-center gap-3 font-normal">
            <ShieldCheck className="w-6 h-6 text-[#B99A62] shrink-0" />
            <span>
              Si tu lienzo no supera tus expectativas de calidad, nuestro taller lo reimprime inmediatamente sin coste o te reembolsamos el importe íntegro.
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 border-t border-[#E7E1D8] bg-[#F8F5F0] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#171513] text-[#FFFFFF] hover:bg-[#4A352B] rounded-xl text-xs font-medium transition-colors shadow-luxury-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
