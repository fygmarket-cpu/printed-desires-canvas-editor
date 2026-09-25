import { CanvasAdjustments, CurrencyConfig, FilterPresetId } from '../types/canvas';
import { FILTER_PRESETS } from '../data/canvasPresets';

export function getCombinedFilterStyle(
  presetId: FilterPresetId,
  adjustments: CanvasAdjustments
): string {
  const preset = FILTER_PRESETS.find((p) => p.id === presetId);
  const baseCss = preset && preset.css !== 'none' ? preset.css : '';

  const customParts: string[] = [];

  // Brightness: -50% to +50% -> 50% to 150%
  if (adjustments.brightness !== 0) {
    const val = 100 + adjustments.brightness;
    customParts.push(`brightness(${val}%)`);
  }

  // Contrast: -50% to +50% -> 50% to 150%
  if (adjustments.contrast !== 0) {
    const val = 100 + adjustments.contrast;
    customParts.push(`contrast(${val}%)`);
  }

  // Saturation: -50% to +50% -> 50% to 150%
  if (adjustments.saturation !== 0) {
    const val = 100 + adjustments.saturation;
    customParts.push(`saturate(${val}%)`);
  }

  // Temperature / Warmth: -50 to +50
  if (adjustments.temperature > 0) {
    customParts.push(`sepia(${adjustments.temperature * 0.5}%) hue-rotate(-${adjustments.temperature * 0.2}deg)`);
  } else if (adjustments.temperature < 0) {
    customParts.push(`hue-rotate(${Math.abs(adjustments.temperature) * 0.4}deg)`);
  }

  // Blur: 0 to 5px
  if (adjustments.blur > 0) {
    customParts.push(`blur(${adjustments.blur}px)`);
  }

  const combined = [baseCss, ...customParts].filter(Boolean).join(' ');
  return combined || 'none';
}

export interface QualityAnalysis {
  dpi: number;
  rating: 'excellent' | 'good' | 'warning';
  title: string;
  description: string;
}

export function calculateQuality(
  widthCm: number,
  heightCm: number,
  imgWidth: number = 3000,
  imgHeight: number = 4000
): QualityAnalysis {
  const widthInches = widthCm / 2.54;
  const heightInches = heightCm / 2.54;

  const dpiX = imgWidth / widthInches;
  const dpiY = imgHeight / heightInches;
  const minDpi = Math.round(Math.min(dpiX, dpiY));

  if (minDpi >= 220) {
    return {
      dpi: minDpi,
      rating: 'excellent',
      title: 'Resolución Excelente (Calidad de Museo)',
      description: `~${minDpi} DPI. Los detalles se imprimirán con máxima nitidez y fidelidad cromática.`,
    };
  } else if (minDpi >= 130) {
    return {
      dpi: minDpi,
      rating: 'good',
      title: 'Buena Calidad de Impresión',
      description: `~${minDpi} DPI. Apto para visualización normal a una distancia de pared de 1 metro.`,
    };
  } else {
    return {
      dpi: minDpi,
      rating: 'warning',
      title: 'Resolución Ajustada',
      description: `~${minDpi} DPI. Para este tamaño grande se recomienda una fotografía de mayor resolución.`,
    };
  }
}

export function formatCurrency(
  amount: number,
  currency: CurrencyConfig | string = 'EUR'
): string {
  if (typeof currency === 'object' && currency !== null) {
    const converted = amount * (currency.rate || 1);
    const formatted = converted.toFixed(2);
    if (currency.position === 'suffix') {
      return `${formatted.replace('.', ',')} ${currency.symbol}`;
    }
    return `${currency.symbol}${formatted}`;
  }

  // Fallback string codes
  switch (currency) {
    case 'GBP':
      return `£${amount.toFixed(2)}`;
    case 'EUR':
      return `${amount.toFixed(2).replace('.', ',')} €`;
    case 'USD':
      return `$${amount.toFixed(2)}`;
    case 'MXN':
      return `$${amount.toFixed(2)} MXN`;
    default:
      return `${amount.toFixed(2)} ${currency}`;
  }
}

