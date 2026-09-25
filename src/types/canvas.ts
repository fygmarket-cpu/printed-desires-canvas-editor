export type SizeCategory = string;

export interface CanvasSize {
  id: string;
  label: string;
  widthCm: number;
  heightCm: number;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  category: string;
  isBestSeller?: boolean;
}

export type EdgeWrapStyle = 'gallery' | 'mirror' | 'white' | 'black' | 'custom';

export type FrameStyle = 'none' | 'floating_oak' | 'floating_black' | 'floating_white' | 'gold_vintage' | string;

export type FilterPresetId =
  | 'none'
  | 'bw'
  | 'sepia'
  | 'vintage'
  | 'vivid'
  | 'warm'
  | 'cool'
  | 'cinematic'
  | 'matte';

export interface CanvasAdjustments {
  brightness: number; // -50 to +50
  contrast: number; // -50 to +50
  saturation: number; // -50 to +50
  temperature: number; // -50 to +50 (warm/cool)
  vignette: number; // 0 to 100
  blur: number; // 0 to 5
}

export interface ImageTransform {
  zoom: number; // 1 to 3
  panX: number; // -100 to 100 %
  panY: number; // -100 to 100 %
  rotateAngle: number; // -180 to 180 deg
  flipH: boolean;
  flipV: boolean;
}

export interface TextLayer {
  id: string;
  text: string;
  font: string;
  fontSize: number; // 14 to 72
  color: string;
  isBold: boolean;
  isItalic: boolean;
  align: 'left' | 'center' | 'right';
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  hasShadow: boolean;
}

export interface CanvasCustomization {
  selectedImage: string;
  imageName: string;
  imageDimensions?: { width: number; height: number };
  size: CanvasSize;
  depthCm: 2 | 4; // 2cm standard, 4cm premium gallery
  wrapStyle: EdgeWrapStyle;
  customWrapColor: string;
  frameStyle: FrameStyle;
  filter: FilterPresetId;
  adjustments: CanvasAdjustments;
  transform: ImageTransform;
  textLayers: TextLayer[];
}

export interface CartItem {
  id: string;
  customization: CanvasCustomization;
  quantity: number;
  unitPrice: number;
  addedAt: string;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
  rate: number; // relative to base (1)
  position: 'prefix' | 'suffix';
}

export interface CategoryItem {
  id: string;
  label: string;
}

export interface FrameOption {
  id: string;
  name: string;
  description: string;
  price: number;
  colorClass: string;
  hexColor?: string;
}

export interface DepthOption {
  depthCm: 2 | 4;
  label: string;
  extraPrice: number;
}

export interface StoreConfig {
  brandName: string;
  brandHighlight: string;
  brandTagline: string;
  topBannerText: string;
  showTopBanner: boolean;
  primaryColor: string;
  currencies: CurrencyConfig[];
  selectedCurrencyCode: string;
  globalAutoDiscount: number; // percentage, e.g. 45
  enableAutoDiscount: boolean;
  categories: CategoryItem[];
  sizes: CanvasSize[];
  frames: FrameOption[];
  depthOptions: DepthOption[];
  deliveryNotice: string;
  freeShippingThreshold: number;
  shippingCost: number;
}
