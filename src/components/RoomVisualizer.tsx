import React, { useMemo, useState } from 'react';
import { CanvasCustomization, CanvasSize } from '../types/canvas';
import { CANVAS_SIZES, ROOM_MOCKUP_IMAGE } from '../data/canvasPresets';
import { getCombinedFilterStyle } from '../utils/canvasHelpers';
import { Rotate3d, Eye, Check, Ruler, Info } from 'lucide-react';

interface RoomVisualizerProps {
  customization: CanvasCustomization;
  onSelectSize: (size: CanvasSize) => void;
  onViewModeChange: (mode: '3d' | 'room') => void;
  viewMode: '3d' | 'room';
  primaryColor?: string;
  availableSizes?: CanvasSize[];
}

export const RoomVisualizer: React.FC<RoomVisualizerProps> = ({
  customization,
  onSelectSize,
  onViewModeChange,
  viewMode,
  primaryColor = '#e60067',
  availableSizes,
}) => {
  const [showRuler, setShowRuler] = useState<boolean>(true);

  const { widthCm, heightCm } = customization.size;

  // Real world reference: assume the living room scene represents ~320cm wall width in view.
  // We calculate proportional percentage width and height on the wall:
  const wallWidthCm = 280; // approximate wall width visible
  const canvasWidthPercent = Math.min(85, (widthCm / wallWidthCm) * 100);
  const canvasHeightPercent = (heightCm / widthCm) * canvasWidthPercent;

  const filterStyle = useMemo(() => {
    return getCombinedFilterStyle(customization.filter, customization.adjustments);
  }, [customization.filter, customization.adjustments]);

  // Framed styling
  const frameBorderClass = useMemo(() => {
    switch (customization.frameStyle) {
      case 'floating_oak':
        return 'p-2 bg-[#b3825a] shadow-2xl';
      case 'floating_black':
        return 'p-2 bg-neutral-950 shadow-2xl';
      case 'floating_white':
        return 'p-2 bg-neutral-100 border border-neutral-300 shadow-2xl';
      case 'gold_vintage':
        return 'p-2.5 bg-gradient-to-br from-[#c99a38] via-[#e8c872] to-[#ab7c20] shadow-2xl';
      default:
        return 'shadow-2xl';
    }
  }, [customization.frameStyle]);

  // Compare quick sizes
  const comparisonSizes = useMemo(() => {
    const list = availableSizes && availableSizes.length > 0 ? availableSizes : CANVAS_SIZES;
    return list.slice(0, 5);
  }, [availableSizes]);

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[620px] rounded-2xl overflow-hidden bg-[#171513] select-none flex flex-col justify-between border border-[#E7E1D8]">
      {/* Top Header Mode Toggle */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex items-center bg-[#F8F5F0]/95 backdrop-blur-md p-1 rounded-full shadow-luxury-md border border-[#D9CEBF]">
        <button
          onClick={() => onViewModeChange('3d')}
          className={`px-5 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
            viewMode === '3d'
              ? 'bg-[#171513] text-[#FFFFFF] shadow-luxury-sm'
              : 'text-[#4A352B] hover:text-[#171513] hover:bg-[#FAF8F5]'
          }`}
        >
          <Rotate3d className="w-3.5 h-3.5 text-[#B99A62]" />
          <span>3D</span>
        </button>
        <button
          onClick={() => onViewModeChange('room')}
          className={`px-5 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
            viewMode === 'room'
              ? 'bg-[#171513] text-[#FFFFFF] shadow-luxury-sm'
              : 'text-[#4A352B] hover:text-[#171513] hover:bg-[#FAF8F5]'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-[#B99A62]" />
          <span>Compare Sizes</span>
        </button>
      </div>

      {/* Ruler toggle button top right */}
      <div className="absolute top-5 right-5 z-30">
        <button
          onClick={() => setShowRuler((r) => !r)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-md transition-all flex items-center gap-1.5 ${
            showRuler
              ? 'bg-[#171513]/90 text-[#FFFFFF] border border-[#B99A62] shadow-luxury-sm'
              : 'bg-[#F8F5F0]/90 text-[#4A352B] border border-[#D9CEBF]'
          }`}
        >
          <Ruler className="w-3.5 h-3.5 text-[#B99A62]" />
          <span>{showRuler ? 'Ocultar cotas' : 'Ver cotas (cm)'}</span>
        </button>
      </div>

      {/* Room Photo Background */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <img
          src={ROOM_MOCKUP_IMAGE}
          alt="Salón interior escandinavo"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.98]"
        />
        <div className="absolute inset-0 bg-[#171513]/10 pointer-events-none" />

        {/* Scaled Wall Canvas Placement Above Sofa */}
        <div
          className="relative z-10 flex flex-col items-center justify-center transition-all duration-300"
          style={{
            width: `${canvasWidthPercent * 0.95}%`,
            maxWidth: '460px',
            marginBottom: '7%',
          }}
        >
          {/* Top Ruler Line */}
          {showRuler && (
            <div className="w-full flex items-center justify-center mb-1 text-[11px] font-semibold text-[#171513] bg-[#F8F5F0]/95 px-2.5 py-0.5 rounded-lg shadow-luxury-sm border border-[#D9CEBF] font-mono tracking-tight">
              <span>↔ Ancho: {widthCm} cm</span>
            </div>
          )}

          {/* Canvas Box */}
          <div
            className={`relative w-full overflow-hidden transition-all duration-300 ${frameBorderClass}`}
            style={{
              aspectRatio: `${widthCm} / ${heightCm}`,
              boxShadow: '0 25px 50px -12px rgba(18, 18, 18, 0.45)',
            }}
          >
            <div className="w-full h-full relative overflow-hidden bg-[#F8F5F0] canvas-texture">
              <img
                src={customization.selectedImage}
                alt="Lienzo en pared"
                className="w-full h-full object-cover origin-center"
                style={{
                  filter: filterStyle,
                  transform: `scale(${customization.transform.zoom}) translate(${customization.transform.panX}%, ${customization.transform.panY}%) rotate(${customization.transform.rotateAngle}deg) scaleX(${customization.transform.flipH ? -1 : 1}) scaleY(${customization.transform.flipV ? -1 : 1})`,
                }}
              />

              {/* Text Layers */}
              {customization.textLayers.map((layer) => (
                <div
                  key={layer.id}
                  className="absolute select-none pointer-events-none"
                  style={{
                    left: `${layer.x}%`,
                    top: `${layer.y}%`,
                    transform: 'translate(-50%, -50%)',
                    fontFamily: layer.font,
                    fontSize: `${layer.fontSize * 0.4}px`,
                    color: layer.color,
                    fontWeight: layer.isBold ? 700 : 400,
                    fontStyle: layer.isItalic ? 'italic' : 'normal',
                    textAlign: layer.align,
                    textShadow: layer.hasShadow ? '2px 2px 4px rgba(18,18,18,0.7)' : 'none',
                    lineHeight: 1.1,
                  }}
                >
                  {layer.text}
                </div>
              ))}

              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/5 via-transparent to-white/10" />
            </div>

            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#171513]/30 pointer-events-none" />
            <div className="absolute left-0 right-0 bottom-0 h-1.5 bg-[#171513]/40 pointer-events-none" />
          </div>

          {/* Bottom Ruler Line */}
          {showRuler && (
            <div className="flex items-center justify-center mt-1 text-[11px] font-semibold text-[#171513] bg-[#F8F5F0]/95 px-2.5 py-0.5 rounded-lg shadow-luxury-sm border border-[#D9CEBF] font-mono tracking-tight">
              <span>↕ Alto: {heightCm} cm</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Compare Size Buttons Bottom Bar */}
      <div className="relative z-20 bg-[#F8F5F0]/95 backdrop-blur-md p-3.5 sm:p-4 border-t border-[#E7E1D8]">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#4A352B]">
            <Info className="w-4 h-4 text-[#B99A62] shrink-0" />
            <span className="font-medium">
              Comparativa a escala real respecto a un sofá estándar de 210 cm:
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {comparisonSizes.map((s) => {
              const isSelected = s.id === customization.size.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectSize(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#171513] text-[#FFFFFF] shadow-luxury-sm ring-1 ring-[#B99A62]'
                      : 'bg-[#FFFFFF] text-[#4A352B] hover:bg-[#F2ECE1] border border-[#D9CEBF]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#B99A62]" />}
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
