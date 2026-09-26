import { CurrencyConfig } from '../types/canvas';

export type MaterialId =
  | 'canvas'
  | 'framed'
  | 'metal'
  | 'acrylic'
  | 'poster';

export interface MaterialSize {
  id: string;
  label: string;
  width: number;
  height: number;
  price: number;
  sku?: string;
}

export interface MaterialConfig {
  id: MaterialId;
  name: string;
  displayName: string;
  description: string;

  /**
   * Shopify
   * Se completará cuando conectemos cada material
   * con sus productos/variantes reales.
   */
  shopifyProductHandle?: string;

  /**
   * Identificador visual utilizado por el editor.
   */
  previewType:
    | 'canvas'
    | 'framed'
    | 'metal'
    | 'acrylic'
    | 'poster';

  /**
   * Tamaños disponibles para este material.
   */
  sizes: MaterialSize[];

  /**
   * Permite añadir futuras opciones específicas
   * sin modificar el motor principal.
   */
  options?: {
    frameColors?: string[];
    finishes?: string[];
    thicknesses?: string[];
  };

  /**
   * Textos del editor.
   */
  ui: {
    title: string;
    subtitle: string;
    uploadText: string;
    sizeText: string;
    priceText: string;
    addToCartText: string;
  };
}

/*
|--------------------------------------------------------------------------
| CANVAS
|--------------------------------------------------------------------------
|
| IMPORTANTE:
| Esta configuración mantiene la base del Canvas actual.
| No estamos modificando todavía canvasPresets.ts.
|
*/

export const canvasMaterial: MaterialConfig = {
  id: 'canvas',

  name: 'Canvas',

  displayName: 'Canvas Prints',

  description:
    'Premium fine-art canvas print designed for elegant wall display.',

  previewType: 'canvas',

  sizes: [
    {
      id: '12x16',
      label: '12 × 16 in',
      width: 12,
      height: 16,
      price: 0,
    },
    {
      id: '16x20',
      label: '16 × 20 in',
      width: 16,
      height: 20,
      price: 0,
    },
    {
      id: '18x24',
      label: '18 × 24 in',
      width: 18,
      height: 24,
      price: 0,
    },
    {
      id: '24x36',
      label: '24 × 36 in',
      width: 24,
      height: 36,
      price: 0,
    },
  ],

  ui: {
    title: 'Create Your Canvas',
    subtitle: 'Transform your photo into premium wall art.',
    uploadText: 'Upload Your Photo',
    sizeText: 'Choose Your Size',
    priceText: 'Price',
    addToCartText: 'Add to Cart',
  },
};

/*
|--------------------------------------------------------------------------
| FRAMED
|--------------------------------------------------------------------------
*/

export const framedMaterial: MaterialConfig = {
  id: 'framed',

  name: 'Framed',

  displayName: 'Framed Prints',

  description:
    'Premium art print presented in an elegant decorative frame.',

  previewType: 'framed',

  sizes: [],

  options: {
    frameColors: [
      'White',
      'Natural Wood',
      'Dark Wood',
      'Black',
    ],
  },

  ui: {
    title: 'Create Your Framed Print',
    subtitle: 'Turn your photo into elegant framed wall art.',
    uploadText: 'Upload Your Photo',
    sizeText: 'Choose Your Size',
    priceText: 'Price',
    addToCartText: 'Add to Cart',
  },
};

/*
|--------------------------------------------------------------------------
| METAL
|--------------------------------------------------------------------------
*/

export const metalMaterial: MaterialConfig = {
  id: 'metal',

  name: 'Metal',

  displayName: 'Metal Prints',

  description:
    'Modern photographic artwork printed on premium metal.',

  previewType: 'metal',

  sizes: [],

  options: {
    finishes: [
      'Glossy',
      'Matte',
    ],
  },

  ui: {
    title: 'Create Your Metal Print',
    subtitle: 'Create a modern statement piece from your photo.',
    uploadText: 'Upload Your Photo',
    sizeText: 'Choose Your Size',
    priceText: 'Price',
    addToCartText: 'Add to Cart',
  },
};

/*
|--------------------------------------------------------------------------
| ACRYLIC
|--------------------------------------------------------------------------
*/

export const acrylicMaterial: MaterialConfig = {
  id: 'acrylic',

  name: 'Acrylic',

  displayName: 'Acrylic Prints',

  description:
    'Luxury photographic artwork with a sophisticated acrylic finish.',

  previewType: 'acrylic',

  sizes: [],

  options: {
    finishes: [
      'Glossy',
      'Matte',
    ],
  },

  ui: {
    title: 'Create Your Acrylic Print',
    subtitle: 'Give your photo a luxurious gallery finish.',
    uploadText: 'Upload Your Photo',
    sizeText: 'Choose Your Size',
    priceText: 'Price',
    addToCartText: 'Add to Cart',
  },
};

/*
|--------------------------------------------------------------------------
| POSTER
|--------------------------------------------------------------------------
*/

export const posterMaterial: MaterialConfig = {
  id: 'poster',

  name: 'Poster',

  displayName: 'Poster Prints',

  description:
    'High-quality art poster printed on premium fine-art paper.',

  previewType: 'poster',

  sizes: [],

  options: {
    frameColors: [
      'None',
      'White',
      'Natural Wood',
      'Dark Wood',
      'Black',
    ],
  },

  ui: {
    title: 'Create Your Poster',
    subtitle: 'Create beautiful wall art from your favorite photo.',
    uploadText: 'Upload Your Photo',
    sizeText: 'Choose Your Size',
    priceText: 'Price',
    addToCartText: 'Add to Cart',
  },
};

/*
|--------------------------------------------------------------------------
| MASTER MATERIAL CONFIG
|--------------------------------------------------------------------------
*/

export const materialConfigs: Record<MaterialId, MaterialConfig> = {
  canvas: canvasMaterial,
  framed: framedMaterial,
  metal: metalMaterial,
  acrylic: acrylicMaterial,
  poster: posterMaterial,
};

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

/**
 * Returns the configuration for a material.
 */
export function getMaterialConfig(
  materialId: MaterialId
): MaterialConfig {
  return materialConfigs[materialId];
}

/**
 * Checks whether a material ID is valid.
 */
export function isMaterialId(
  value: string
): value is MaterialId {
  return value in materialConfigs;
}

/**
 * Default material.
 *
 * Canvas remains the default so the current
 * editor behavior is preserved.
 */
export const DEFAULT_MATERIAL: MaterialId = 'canvas';
