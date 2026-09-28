import {
  CanvasSize,
  StoreConfig,
} from './types/canvas';

/* ============================================================
   MATERIAL TYPES
   ============================================================ */

export type MaterialId =
  | 'canvas'
  | 'framed'
  | 'metal'
  | 'acrylic'
  | 'poster';

/**
 * MaterialSize utiliza la misma estructura de tamaños
 * que actualmente utiliza CanvasSize en el proyecto.
 *
 * Esto permite mantener compatibilidad con:
 * SizeSelector
 * StoreConfig
 * precios
 * carrito
 * Shopify
 */
export type MaterialSize = CanvasSize;

/* ============================================================
   MATERIAL CONFIGURATION
   ============================================================ */

export interface MaterialConfig {
  /**
   * Identificador interno.
   */
  id: MaterialId;

  /**
   * Nombre interno.
   */
  name: string;

  /**
   * Nombre visible para el cliente.
   */
  displayName: string;

  /**
   * Descripción comercial.
   */
  description: string;

  /**
   * Shopify
   */
  shopifyProductHandle?: string;

  /**
   * Tipo de preview utilizado por el editor.
   */
  previewType:
    | 'canvas'
    | 'framed'
    | 'metal'
    | 'acrylic'
    | 'poster';

  /**
   * Imágenes utilizadas por este material.
   *
   * Estas imágenes podrán modificarse
   * posteriormente desde Configuración de Tienda.
   */
  images?: {
    main?: string;
    gallery?: string[];
  };

  /**
   * Tamaños y precios específicos
   * de este material.
   */
  sizes: MaterialSize[];

  /**
   * Opciones específicas del material.
   */
  options?: {
    frameColors?: string[];
    finishes?: string[];
    thicknesses?: string[];
  };

  /**
   * Configuración comercial.
   */
  pricing?: {
    basePrice?: number;

    currency?: string;

    priceBySize?: boolean;

    priceByOption?: boolean;
  };

  /**
   * Configuración del preview.
   */
  preview?: {
    backgroundImage?: string;

    roomImage?: string;

    frameThickness?: number;

    frameDepth?: number;

    showShadow?: boolean;

    showRoomPreview?: boolean;
  };

  /**
   * Textos utilizados por el editor.
   */
  ui: {
    title: string;

    subtitle: string;

    uploadText: string;

    sizeText: string;

    priceText: string;

    addToCartText: string;
  };

  /**
   * Configuración administrativa.
   *
   * El cliente no necesita ver esta información.
   */
  admin?: {
    enabled?: boolean;

    notes?: string;
  };
}

/* ============================================================
   DEFAULT SIZE DATA
   ============================================================ */

/**
 * Estos tamaños son valores iniciales.
 *
 * Los precios siguen siendo ficticios/intencionales
 * y posteriormente serán editables desde
 * Configuración de Tienda.
 */
const DEFAULT_SIZES: MaterialSize[] = [
  {
    id: '50x70',
    label: '50 × 70 cm',
    widthCm: 50,
    heightCm: 70,
    originalPrice: 89,
    discountedPrice: 69,
    discountPercent: 22,
    category: 'Standard',
  },

  {
    id: '60x90',
    label: '60 × 90 cm',
    widthCm: 60,
    heightCm: 90,
    originalPrice: 119,
    discountedPrice: 89,
    discountPercent: 25,
    category: 'Standard',
  },

  {
    id: '75x100',
    label: '75 × 100 cm',
    widthCm: 75,
    heightCm: 100,
    originalPrice: 149,
    discountedPrice: 109,
    discountPercent: 27,
    category: 'Large',
    isBestSeller: true,
  },

  {
    id: '80x120',
    label: '80 × 120 cm',
    widthCm: 80,
    heightCm: 120,
    originalPrice: 179,
    discountedPrice: 129,
    discountPercent: 28,
    category: 'Large',
  },

  {
    id: '100x150',
    label: '100 × 150 cm',
    widthCm: 100,
    heightCm: 150,
    originalPrice: 239,
    discountedPrice: 179,
    discountPercent: 25,
    category: 'Premium',
  },
];

/* ============================================================
   MATERIAL FACTORIES
   ============================================================ */

/**
 * Canvas
 */
export const canvasMaterial: MaterialConfig = {
  id: 'canvas',

  name: 'canvas',

  displayName: 'Canvas Prints',

  description:
    'Impresión fotográfica premium sobre lienzo de algodón con acabado artístico.',

  shopifyProductHandle: 'canvas-prints',

  previewType: 'canvas',

  images: {
    main: '',
    gallery: [],
  },

  sizes: DEFAULT_SIZES,

  options: {
    frameColors: [],
    finishes: [
      'Mate',
      'Galería',
    ],
    thicknesses: [
      '2 cm',
      '4 cm',
    ],
  },

  pricing: {
    basePrice: 69,
    currency: 'EUR',
    priceBySize: true,
    priceByOption: true,
  },

  preview: {
    backgroundImage: '',
    roomImage: '',
    frameThickness: 2,
    frameDepth: 2,
    showShadow: true,
    showRoomPreview: true,
  },

  ui: {
    title: 'Canvas Prints',

    subtitle:
      'Convierte tus fotografías en arte mural personalizado.',

    uploadText:
      'Sube tu fotografía',

    sizeText:
      'Selecciona el tamaño',

    priceText:
      'Precio',

    addToCartText:
      'Añadir al carrito',
  },

  admin: {
    enabled: true,

    notes:
      'Configuración editable del producto Canvas. Los precios actuales son valores iniciales.',
  },
};

/**
 * Framed
 */
export const framedMaterial: MaterialConfig = {
  id: 'framed',

  name: 'framed',

  displayName: 'Framed Prints',

  description:
    'Impresiones premium presentadas en un elegante marco decorativo.',

  shopifyProductHandle: 'framed-prints',

  previewType: 'framed',

  images: {
    main: '',
    gallery: [],
  },

  sizes: DEFAULT_SIZES,

  options: {
    frameColors: [
      'White',
      'Wood',
      'Dark Wood',
      'Black',
    ],

    finishes: [
      'Matte',
      'Premium',
    ],

    thicknesses: [
      'Slim',
      'Standard',
    ],
  },

  pricing: {
    basePrice: 89,
    currency: 'EUR',
    priceBySize: true,
    priceByOption: true,
  },

  preview: {
    backgroundImage: '',
    roomImage: '',
    frameThickness: 2,
    frameDepth: 3,
    showShadow: true,
    showRoomPreview: true,
  },

  ui: {
    title: 'Framed Prints',

    subtitle:
      'Tu fotografía personalizada terminada con un marco elegante.',

    uploadText:
      'Upload your photo',

    sizeText:
      'Choose your size',

    priceText:
      'Price',

    addToCartText:
      'Add to cart',
  },

  admin: {
    enabled: true,

    notes:
      'Configuración editable de Framed Prints.',
  },
};

/**
 * Metal
 */
export const metalMaterial: MaterialConfig = {
  id: 'metal',

  name: 'metal',

  displayName: 'Metal Prints',

  description:
    'Impresión fotográfica de alta definición sobre panel metálico.',

  shopifyProductHandle: 'metal-prints',

  previewType: 'metal',

  images: {
    main: '',
    gallery: [],
  },

  sizes: DEFAULT_SIZES,

  options: {
    frameColors: [],

    finishes: [
      'Glossy',
      'Matte',
    ],

    thicknesses: [
      'Standard',
    ],
  },

  pricing: {
    basePrice: 79,
    currency: 'EUR',
    priceBySize: true,
    priceByOption: true,
  },

  preview: {
    backgroundImage: '',
    roomImage: '',
    frameThickness: 0,
    frameDepth: 0.3,
    showShadow: true,
    showRoomPreview: true,
  },

  ui: {
    title: 'Metal Prints',

    subtitle:
      'Colores intensos y acabado contemporáneo sobre metal.',

    uploadText:
      'Upload your photo',

    sizeText:
      'Choose your size',

    priceText:
      'Price',

    addToCartText:
      'Add to cart',
  },

  admin: {
    enabled: true,

    notes:
      'Configuración editable de Metal Prints.',
  },
};

/**
 * Acrylic
 */
export const acrylicMaterial: MaterialConfig = {
  id: 'acrylic',

  name: 'acrylic',

  displayName: 'Acrylic Prints',

  description:
    'Fotografía de alta definición con acabado acrílico elegante y moderno.',

  shopifyProductHandle: 'acrylic-prints',

  previewType: 'acrylic',

  images: {
    main: '',
    gallery: [],
  },

  sizes: DEFAULT_SIZES,

  options: {
    frameColors: [],

    finishes: [
      'Glossy',
      'Matte',
    ],

    thicknesses: [
      '3 mm',
      '6 mm',
    ],
  },

  pricing: {
    basePrice: 99,
    currency: 'EUR',
    priceBySize: true,
    priceByOption: true,
  },

  preview: {
    backgroundImage: '',
    roomImage: '',
    frameThickness: 0,
    frameDepth: 0.6,
    showShadow: true,
    showRoomPreview: true,
  },

  ui: {
    title: 'Acrylic Prints',

    subtitle:
      'Un acabado moderno y luminoso para tus fotografías.',

    uploadText:
      'Upload your photo',

    sizeText:
      'Choose your size',

    priceText:
      'Price',

    addToCartText:
      'Add to cart',
  },

  admin: {
    enabled: true,

    notes:
      'Configuración editable de Acrylic Prints.',
  },
};

/**
 * Poster
 */
export const posterMaterial: MaterialConfig = {
  id: 'poster',

  name: 'poster',

  displayName: 'Poster Prints',

  description:
    'Impresiones artísticas de alta calidad para decoración mural.',

  shopifyProductHandle: 'poster-prints',

  previewType: 'poster',

  images: {
    main: '',
    gallery: [],
  },

  sizes: DEFAULT_SIZES,

  options: {
    frameColors: [
      'White',
      'Wood',
      'Dark Wood',
      'Black',
    ],

    finishes: [
      'Matte',
    ],

    thicknesses: [
      'Unframed',
    ],
  },

  pricing: {
    basePrice: 39,
    currency: 'EUR',
    priceBySize: true,
    priceByOption: true,
  },

  preview: {
    backgroundImage: '',
    roomImage: '',
    frameThickness: 0,
    frameDepth: 0,
    showShadow: true,
    showRoomPreview: true,
  },

  ui: {
    title: 'Poster Prints',

    subtitle:
      'Arte mural personalizado con impresión de alta calidad.',

    uploadText:
      'Upload your photo',

    sizeText:
      'Choose your size',

    priceText:
      'Price',

    addToCartText:
      'Add to cart',
  },

  admin: {
    enabled: true,

    notes:
      'Configuración editable de Poster Prints.',
  },
};

/* ============================================================
   MATERIAL CONFIG COLLECTION
   ============================================================ */

export const materialConfigs: Record<
  MaterialId,
  MaterialConfig
> = {
  canvas: canvasMaterial,

  framed: framedMaterial,

  metal: metalMaterial,

  acrylic: acrylicMaterial,

  poster: posterMaterial,
};

/* ============================================================
   GET MATERIAL CONFIG
   ============================================================ */

export function getMaterialConfig(
  materialId: MaterialId
): MaterialConfig {
  return materialConfigs[materialId];
}

/* ============================================================
   MATERIAL ID VALIDATION
   ============================================================ */

export function isMaterialId(
  value: string
): value is MaterialId {
  return (
    value === 'canvas' ||
    value === 'framed' ||
    value === 'metal' ||
    value === 'acrylic' ||
    value === 'poster'
  );
}

/* ============================================================
   DEFAULT MATERIAL
   ============================================================ */

/**
 * Canvas remains the default material.
 *
 * Esto conserva el comportamiento actual del editor.
 */
export const DEFAULT_MATERIAL: MaterialId = 'canvas';

/* ============================================================
   MATERIAL HELPERS
   ============================================================ */

/**
 * Devuelve todos los materiales disponibles.
 */
export function getAllMaterialConfigs(): MaterialConfig[] {
  return Object.values(materialConfigs);
}

/**
 * Devuelve los tamaños configurados para un material.
 */
export function getMaterialSizes(
  materialId: MaterialId
): MaterialSize[] {
  return materialConfigs[materialId].sizes;
}

/**
 * Devuelve el precio base de un material.
 */
export function getMaterialBasePrice(
  materialId: MaterialId
): number {
  return (
    materialConfigs[materialId].pricing?.basePrice || 0
  );
}

/**
 * Actualiza una configuración de material
 * de forma inmutable.
 *
 * Esta función será utilizada posteriormente
 * por Configuración de Tienda.
 */
export function updateMaterialConfig(
  materialId: MaterialId,
  updates: Partial<MaterialConfig>
): MaterialConfig {
  const current =
    materialConfigs[materialId];

  const updated: MaterialConfig = {
    ...current,
    ...updates,
  };

  materialConfigs[materialId] = updated;

  return updated;
}
