import {
  CanvasSize,
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
 * Mantiene compatibilidad con CanvasSize.
 *
 * Cada material tendrá su propia colección de tamaños.
 * Por tanto, modificar los tamaños de Metal no modifica
 * los tamaños de Canvas.
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
   * Nombre mostrado al cliente.
   */
  displayName: string;

  /**
   * Descripción comercial.
   */
  description: string;

  /**
   * Shopify product handle.
   */
  shopifyProductHandle?: string;

  /**
   * Tipo de preview utilizado.
   */
  previewType:
    | 'canvas'
    | 'framed'
    | 'metal'
    | 'acrylic'
    | 'poster';

  /**
   * Imágenes del material.
   */
  images?: {
    main?: string;
    gallery?: string[];
  };

  /**
   * Tamaños independientes del material.
   */
  sizes: MaterialSize[];

  /**
   * Opciones específicas.
   */
  options?: {

    /**
     * Colores disponibles para marcos.
     */
    frameColors?: string[];

    /**
     * Acabados.
     */
    finishes?: string[];

    /**
     * Grosores / espesores.
     */
    thicknesses?: string[];

    /**
     * Opciones futuras.
     */
    mounting?: string[];

    /**
     * Opciones futuras adicionales.
     */
    customOptions?: string[];
  };

  /**
   * Configuración comercial.
   */
  pricing?: {

    /**
     * Precio base.
     */
    basePrice?: number;

    /**
     * Moneda base.
     */
    currency?: string;

    /**
     * Los precios dependen del tamaño.
     */
    priceBySize?: boolean;

    /**
     * Los precios dependen de las opciones.
     */
    priceByOption?: boolean;

    /**
     * Permite tamaños personalizados.
     */
    allowCustomSize?: boolean;

    /**
     * Precio mínimo para tamaño personalizado.
     */
    customSizeMinimumPrice?: number;
  };

  /**
   * Configuración visual del preview.
   */
  preview?: {

    backgroundImage?: string;

    roomImage?: string;

    frameThickness?: number;

    frameDepth?: number;

    showShadow?: boolean;

    showRoomPreview?: boolean;

    /**
     * Permite activar/desactivar preview 3D.
     */
    show3D?: boolean;
  };

  /**
   * Textos del producto.
   */
  ui: {

    title: string;

    subtitle: string;

    uploadText: string;

    sizeText: string;

    priceText: string;

    addToCartText: string;

    /**
     * Texto opcional para acabados.
     */
    finishText?: string;

    /**
     * Texto opcional para marco.
     */
    frameText?: string;

    /**
     * Texto opcional para grosor.
     */
    thicknessText?: string;
  };

  /**
   * Configuración administrativa.
   */
  admin?: {

    enabled?: boolean;

    notes?: string;

    /**
     * Permite desactivar temporalmente el material.
     */
    availableForSale?: boolean;

    /**
     * Material visible en Wall Art.
     */
    showInWallArt?: boolean;
  };
}


/* ============================================================
   SIZE HELPERS
   ============================================================ */

/**
 * Crea una copia independiente de los tamaños.
 *
 * IMPORTANTE:
 * No usamos directamente la misma referencia entre materiales.
 *
 * Esto permite modificar posteriormente:
 *
 * Canvas → precios Canvas
 * Metal → precios Metal
 * Acrylic → precios Acrylic
 *
 * sin afectar los demás.
 */
function cloneSizes(
  sizes: MaterialSize[]
): MaterialSize[] {
  return sizes.map((size) => ({
    ...size,
  }));
}


/* ============================================================
   DEFAULT SIZE DATA
   ============================================================ */

/**
 * Tamaños base actuales.
 *
 * Estos son los tamaños/precios que actualmente
 * utiliza Canvas.
 *
 * Los conservamos como referencia inicial para
 * todos los materiales.
 *
 * IMPORTANTE:
 * Cada material recibe una COPIA independiente.
 */

const DEFAULT_SIZES: MaterialSize[] = [

  /* ----------------------------------------------------------
     Popular
  ---------------------------------------------------------- */

  {
    id: '75x100',
    label: '75 x 100cm',
    widthCm: 75,
    heightCm: 100,
    originalPrice: 99.95,
    discountedPrice: 54.99,
    discountPercent: 45,
    category: 'popular',
    isBestSeller: true,
  },

  {
    id: '40x50',
    label: '40 x 50cm',
    widthCm: 40,
    heightCm: 50,
    originalPrice: 49.95,
    discountedPrice: 24.99,
    discountPercent: 50,
    category: 'popular',
    isBestSeller: true,
  },

  {
    id: '50x50',
    label: '50 x 50cm',
    widthCm: 50,
    heightCm: 50,
    originalPrice: 59.95,
    discountedPrice: 29.99,
    discountPercent: 50,
    category: 'popular',
  },

  {
    id: '20x25',
    label: '20 x 25cm',
    widthCm: 20,
    heightCm: 25,
    originalPrice: 21.95,
    discountedPrice: 5.95,
    discountPercent: 73,
    category: 'popular',
  },

  {
    id: '40x40',
    label: '40 x 40cm',
    widthCm: 40,
    heightCm: 40,
    originalPrice: 44.95,
    discountedPrice: 21.99,
    discountPercent: 51,
    category: 'popular',
  },

  /* ----------------------------------------------------------
     Portrait
  ---------------------------------------------------------- */

  {
    id: 'p-30x40',
    label: '30 x 40cm',
    widthCm: 30,
    heightCm: 40,
    originalPrice: 38.95,
    discountedPrice: 19.99,
    discountPercent: 48,
    category: 'portrait',
  },

  {
    id: 'p-40x50',
    label: '40 x 50cm',
    widthCm: 40,
    heightCm: 50,
    originalPrice: 49.95,
    discountedPrice: 24.99,
    discountPercent: 50,
    category: 'portrait',
    isBestSeller: true,
  },

  {
    id: 'p-50x70',
    label: '50 x 70cm',
    widthCm: 50,
    heightCm: 70,
    originalPrice: 69.95,
    discountedPrice: 36.99,
    discountPercent: 47,
    category: 'portrait',
  },

  {
    id: 'p-60x80',
    label: '60 x 80cm',
    widthCm: 60,
    heightCm: 80,
    originalPrice: 79.95,
    discountedPrice: 42.99,
    discountPercent: 46,
    category: 'portrait',
  },

  {
    id: 'p-75x100',
    label: '75 x 100cm',
    widthCm: 75,
    heightCm: 100,
    originalPrice: 99.95,
    discountedPrice: 54.99,
    discountPercent: 45,
    category: 'portrait',
    isBestSeller: true,
  },

  /* ----------------------------------------------------------
     Landscape
  ---------------------------------------------------------- */

  {
    id: 'l-40x30',
    label: '40 x 30cm',
    widthCm: 40,
    heightCm: 30,
    originalPrice: 38.95,
    discountedPrice: 19.99,
    discountPercent: 48,
    category: 'landscape',
  },

  {
    id: 'l-50x40',
    label: '50 x 40cm',
    widthCm: 50,
    heightCm: 40,
    originalPrice: 49.95,
    discountedPrice: 24.99,
    discountPercent: 50,
    category: 'landscape',
    isBestSeller: true,
  },

  {
    id: 'l-70x50',
    label: '70 x 50cm',
    widthCm: 70,
    heightCm: 50,
    originalPrice: 69.95,
    discountedPrice: 36.99,
    discountPercent: 47,
    category: 'landscape',
  },

  {
    id: 'l-80x60',
    label: '80 x 60cm',
    widthCm: 80,
    heightCm: 60,
    originalPrice: 79.95,
    discountedPrice: 42.99,
    discountPercent: 46,
    category: 'landscape',
  },

  {
    id: 'l-100x75',
    label: '100 x 75cm',
    widthCm: 100,
    heightCm: 75,
    originalPrice: 99.95,
    discountedPrice: 54.99,
    discountPercent: 45,
    category: 'landscape',
  },

  /* ----------------------------------------------------------
     Square
  ---------------------------------------------------------- */

  {
    id: 'sq-30x30',
    label: '30 x 30cm',
    widthCm: 30,
    heightCm: 30,
    originalPrice: 32.95,
    discountedPrice: 16.99,
    discountPercent: 48,
    category: 'square',
  },

  {
    id: 'sq-40x40',
    label: '40 x 40cm',
    widthCm: 40,
    heightCm: 40,
    originalPrice: 44.95,
    discountedPrice: 21.99,
    discountPercent: 51,
    category: 'square',
  },

  {
    id: 'sq-50x50',
    label: '50 x 50cm',
    widthCm: 50,
    heightCm: 50,
    originalPrice: 59.95,
    discountedPrice: 29.99,
    discountPercent: 50,
    category: 'square',
    isBestSeller: true,
  },

  {
    id: 'sq-60x60',
    label: '60 x 60cm',
    widthCm: 60,
    heightCm: 60,
    originalPrice: 72.95,
    discountedPrice: 38.99,
    discountPercent: 46,
    category: 'square',
  },

  /* ----------------------------------------------------------
     Panoramic
  ---------------------------------------------------------- */

  {
    id: 'pan-60x20',
    label: '60 x 20cm',
    widthCm: 60,
    heightCm: 20,
    originalPrice: 42.95,
    discountedPrice: 22.99,
    discountPercent: 46,
    category: 'panoramic',
  },

  {
    id: 'pan-90x30',
    label: '90 x 30cm',
    widthCm: 90,
    heightCm: 30,
    originalPrice: 65.95,
    discountedPrice: 35.99,
    discountPercent: 45,
    category: 'panoramic',
  },

  {
    id: 'pan-120x40',
    label: '120 x 40cm',
    widthCm: 120,
    heightCm: 40,
    originalPrice: 89.95,
    discountedPrice: 49.99,
    discountPercent: 44,
    category: 'panoramic',
    isBestSeller: true,
  },
];


/* ============================================================
   CANVAS
   ============================================================ */

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

  sizes: cloneSizes(DEFAULT_SIZES),

  options: {

    frameColors: [
      'Natural Wood',
      'Black',
      'White',
    ],

    finishes: [
      'Mate',
      'Galería',
    ],

    thicknesses: [
      '2 cm',
      '4 cm',
    ],

    mounting: [
      'Gallery Wrap',
      'Mirror Wrap',
      'White Edge',
      'Black Edge',
    ],
  },

  pricing: {

    basePrice: 5.95,

    currency: 'EUR',

    priceBySize: true,

    priceByOption: true,

    allowCustomSize: true,

    customSizeMinimumPrice: 12,
  },

  preview: {

    backgroundImage: '',

    roomImage: '',

    frameThickness: 2,

    frameDepth: 2,

    showShadow: true,

    showRoomPreview: true,

    show3D: true,
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
      'Añadir a la Cesta',

    finishText:
      'Acabado',

    frameText:
      'Marco',

    thicknessText:
      'Grosor',
  },

  admin: {

    enabled: true,

    availableForSale: true,

    showInWallArt: true,

    notes:
      'Canvas mantiene los tamaños y precios actuales. Editar antes de abrir la tienda.',
  },
};


/* ============================================================
   FRAMED PRINTS
   ============================================================ */

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

  sizes: cloneSizes(DEFAULT_SIZES),

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

    mounting: [
      'Wall Mount',
    ],
  },

  pricing: {

    basePrice: 89,

    currency: 'EUR',

    priceBySize: true,

    priceByOption: true,

    allowCustomSize: true,

    customSizeMinimumPrice: 25,
  },

  preview: {

    backgroundImage: '',

    roomImage: '',

    frameThickness: 2,

    frameDepth: 3,

    showShadow: true,

    showRoomPreview: true,

    show3D: true,
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

    finishText:
      'Finish',

    frameText:
      'Frame',

    thicknessText:
      'Frame thickness',
  },

  admin: {

    enabled: true,

    availableForSale: true,

    showInWallArt: true,

    notes:
      'Framed Prints tendrá precios y tamaños independientes.',
  },
};


/* ============================================================
   METAL PRINTS
   ============================================================ */

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

  sizes: cloneSizes(DEFAULT_SIZES),

  options: {

    frameColors: [],

    finishes: [
      'Glossy',
      'Matte',
    ],

    thicknesses: [
      'Standard',
    ],

    mounting: [
      'Float Mount',
      'Back Mount',
    ],
  },

  pricing: {

    basePrice: 79,

    currency: 'EUR',

    priceBySize: true,

    priceByOption: true,

    allowCustomSize: true,

    customSizeMinimumPrice: 30,
  },

  preview: {

    backgroundImage: '',

    roomImage: '',

    frameThickness: 0,

    frameDepth: 0.3,

    showShadow: true,

    showRoomPreview: true,

    show3D: true,
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

    finishText:
      'Finish',

    thicknessText:
      'Thickness',
  },

  admin: {

    enabled: true,

    availableForSale: true,

    showInWallArt: true,

    notes:
      'Metal Prints. Precios iniciales editables antes del lanzamiento.',
  },
};


/* ============================================================
   ACRYLIC PRINTS
   ============================================================ */

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

  sizes: cloneSizes(DEFAULT_SIZES),

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

    mounting: [
      'Standoff',
      'Float Mount',
    ],
  },

  pricing: {

    basePrice: 99,

    currency: 'EUR',

    priceBySize: true,

    priceByOption: true,

    allowCustomSize: true,

    customSizeMinimumPrice: 35,
  },

  preview: {

    backgroundImage: '',

    roomImage: '',

    frameThickness: 0,

    frameDepth: 0.6,

    showShadow: true,

    showRoomPreview: true,

    show3D: true,
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

    finishText:
      'Finish',

    thicknessText:
      'Thickness',
  },

  admin: {

    enabled: true,

    availableForSale: true,

    showInWallArt: true,

    notes:
      'Acrylic Prints. Precios iniciales editables antes del lanzamiento.',
  },
};


/* ============================================================
   POSTER PRINTS
   ============================================================ */

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

  sizes: cloneSizes(DEFAULT_SIZES),

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

    mounting: [
      'Unframed',
      'Hanging Rails',
    ],
  },

  pricing: {

    basePrice: 39,

    currency: 'EUR',

    priceBySize: true,

    priceByOption: true,

    allowCustomSize: true,

    customSizeMinimumPrice: 15,
  },

  preview: {

    backgroundImage: '',

    roomImage: '',

    frameThickness: 0,

    frameDepth: 0,

    showShadow: true,

    showRoomPreview: true,

    show3D: true,
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

    finishText:
      'Finish',

    frameText:
      'Frame',

    thicknessText:
      'Thickness',
  },

  admin: {

    enabled: true,

    availableForSale: true,

    showInWallArt: true,

    notes:
      'Poster Prints. Precios iniciales editables antes del lanzamiento.',
  },
};


/* ============================================================
   MATERIAL CONFIG COLLECTION
   ============================================================ */

/**
 * Registro central de materiales.
 *
 * Para agregar un nuevo material en el futuro:
 *
 * 1. Crear su MaterialConfig.
 * 2. Añadirlo aquí.
 * 3. Añadir su MaterialId.
 *
 * El resto del sistema podrá utilizar
 * getMaterialConfig() y getAllMaterialConfigs().
 */
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

export const DEFAULT_MATERIAL: MaterialId = 'canvas';


/* ============================================================
   MATERIAL HELPERS
   ============================================================ */

/**
 * Devuelve todos los materiales.
 */
export function getAllMaterialConfigs(): MaterialConfig[] {

  return Object.values(materialConfigs);
}


/**
 * Devuelve los tamaños de un material.
 */
export function getMaterialSizes(
  materialId: MaterialId
): MaterialSize[] {

  return materialConfigs[materialId].sizes;
}


/**
 * Devuelve el precio base.
 */
export function getMaterialBasePrice(
  materialId: MaterialId
): number {

  return (
    materialConfigs[materialId]
      .pricing
      ?.basePrice || 0
  );
}


/**
 * Devuelve las opciones de un material.
 */
export function getMaterialOptions(
  materialId: MaterialId
) {

  return (
    materialConfigs[materialId].options || {}
  );
}


/**
 * Devuelve únicamente los materiales
 * actualmente disponibles para venta.
 */
export function getAvailableMaterialConfigs(): MaterialConfig[] {

  return Object.values(materialConfigs).filter(
    (material) =>
      material.admin?.availableForSale !== false
  );
}


/**
 * Devuelve únicamente los materiales visibles
 * en el menú Wall Art.
 */
export function getWallArtMaterials(): MaterialConfig[] {

  return Object.values(materialConfigs).filter(
    (material) =>
      material.admin?.showInWallArt !== false &&
      material.admin?.availableForSale !== false
  );
}


/* ============================================================
   UPDATE MATERIAL CONFIG
   ============================================================ */

/**
 * Actualiza una configuración de material
 * de forma inmutable.
 *
 * Nota:
 * El registro actual se mantiene compatible
 * con el sistema existente.
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

    /**
     * Evita perder las opciones existentes
     * cuando solamente se actualiza una parte.
     */
    options: {
      ...current.options,
      ...updates.options,
    },

    pricing: {
      ...current.pricing,
      ...updates.pricing,
    },

    preview: {
      ...current.preview,
      ...updates.preview,
    },

    ui: {
      ...current.ui,
      ...updates.ui,
    },

    admin: {
      ...current.admin,
      ...updates.admin,
    },
  };

  materialConfigs[materialId] = updated;

  return updated;
}


/* ============================================================
   ADD NEW MATERIAL — FUTURE
   ============================================================ */

/**
 * Registro flexible para futuros materiales.
 *
 * Actualmente MaterialId está limitado a los cinco
 * materiales activos. Cuando agregues un nuevo material,
 * solamente habrá que añadir su ID al union MaterialId.
 *
 * Ejemplo futuro:
 *
 * | 'wood'
 * | 'glass'
 * | 'stone'
 *
 * y después:
 *
 * materialConfigs.wood = {...}
 *
 * sin necesidad de modificar la arquitectura
 * del sistema.
 */


/* ============================================================
   MATERIAL SIZE UPDATE HELPERS
   ============================================================ */

/**
 * Reemplaza todos los tamaños de un material.
 */
export function updateMaterialSizes(
  materialId: MaterialId,
  sizes: MaterialSize[]
): MaterialConfig {

  return updateMaterialConfig(
    materialId,
    {
      sizes: cloneSizes(sizes),
    }
  );
}


/**
 * Añade un tamaño a un material.
 */
export function addMaterialSize(
  materialId: MaterialId,
  size: MaterialSize
): MaterialConfig {

  const material =
    materialConfigs[materialId];

  return updateMaterialSizes(
    materialId,
    [
      ...material.sizes,
      {
        ...size,
      },
    ]
  );
}


/**
 * Elimina un tamaño.
 */
export function removeMaterialSize(
  materialId: MaterialId,
  sizeId: string
): MaterialConfig {

  const material =
    materialConfigs[materialId];

  return updateMaterialSizes(
    materialId,
    material.sizes.filter(
      (size) => size.id !== sizeId
    )
  );
}


/**
 * Actualiza un tamaño concreto.
 */
export function updateMaterialSize(
  materialId: MaterialId,
  sizeId: string,
  updates: Partial<MaterialSize>
): MaterialConfig {

  const material =
    materialConfigs[materialId];

  const updatedSizes =
    material.sizes.map((size) => {

      if (size.id !== sizeId) {
        return size;
      }

      return {
        ...size,
        ...updates,
      };
    });

  return updateMaterialSizes(
    materialId,
    updatedSizes
  );
}
