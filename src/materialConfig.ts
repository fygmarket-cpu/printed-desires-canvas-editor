import {
  CanvasSize,
} from './types/canvas';

import {
  CANVAS_SIZES,
} from './data/canvasPresets';

/* ============================================================
   MATERIAL TYPES
   ============================================================ */

/**
 * MaterialId
 *
 * Los cinco materiales actuales tienen IDs conocidos.
 *
 * `string` permite incorporar nuevos materiales en el futuro
 * sin tener que modificar toda la arquitectura del proyecto.
 *
 * Ejemplos futuros:
 *
 *   wood
 *   glass
 *   pvc
 *   aluminum
 *   fine-art-paper
 *
 * El administrador podrá crear nuevos materiales posteriormente.
 */
export type MaterialId =
  | 'canvas'
  | 'framed'
  | 'metal'
  | 'acrylic'
  | 'poster'
  | (string & {});


/* ============================================================
   MATERIAL SIZE
   ============================================================ */

/**
 * MaterialSize mantiene exactamente la misma estructura
 * utilizada actualmente por CanvasSize.
 *
 * Esto mantiene compatibilidad con:
 *
 * - SizeSelector
 * - StoreConfig
 * - precios
 * - carrito
 * - Shopify
 * - preview
 */
export type MaterialSize = CanvasSize;


/* ============================================================
   MATERIAL CONFIGURATION
   ============================================================ */

/**
 * Configuración completa de un material.
 *
 * Esta estructura está diseñada para que en el futuro
 * podamos crear nuevos materiales desde Configuración
 * de Tienda sin reconstruir el sistema.
 */
export interface MaterialConfig {

  /**
   * Identificador único interno.
   *
   * Ejemplos:
   *
   * canvas
   * framed
   * metal
   * acrylic
   * poster
   * wood
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
   * Shopify product handle.
   *
   * Ejemplo:
   *
   * canvas-prints
   */
  shopifyProductHandle?: string;


  /**
   * Tipo de preview utilizado por el editor.
   *
   * `custom` queda reservado para futuros materiales
   * que necesiten un comportamiento diferente.
   */
  previewType:
    | 'canvas'
    | 'framed'
    | 'metal'
    | 'acrylic'
    | 'poster'
    | 'custom';


  /**
   * Imágenes utilizadas por este material.
   *
   * Posteriormente podrán editarse desde
   * Configuración de Tienda.
   */
  images?: {

    /**
     * Imagen principal.
     */
    main?: string;

    /**
     * Galería.
     */
    gallery?: string[];
  };


  /**
   * Tamaños y precios específicos
   * de este material.
   *
   * Cada material puede tener tamaños
   * completamente diferentes.
   */
  sizes: MaterialSize[];


  /**
   * Opciones específicas del material.
   */
  options?: {

    /**
     * Colores de marco.
     */
    frameColors?: string[];

    /**
     * Acabados.
     */
    finishes?: string[];

    /**
     * Grosor.
     */
    thicknesses?: string[];
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
     * Moneda.
     */
    currency?: string;

    /**
     * Indica si el precio depende
     * del tamaño.
     */
    priceBySize?: boolean;

    /**
     * Indica si el precio depende
     * de opciones adicionales.
     */
    priceByOption?: boolean;
  };


  /**
   * Configuración visual del preview.
   */
  preview?: {

    /**
     * Imagen de fondo del producto.
     */
    backgroundImage?: string;

    /**
     * Imagen de habitación.
     */
    roomImage?: string;

    /**
     * Grosor visual del marco.
     */
    frameThickness?: number;

    /**
     * Profundidad visual.
     */
    frameDepth?: number;

    /**
     * Mostrar sombra.
     */
    showShadow?: boolean;

    /**
     * Mostrar preview en habitación.
     */
    showRoomPreview?: boolean;
  };


  /**
   * Textos utilizados por el editor.
   */
  ui: {

    /**
     * Título.
     */
    title: string;

    /**
     * Subtítulo.
     */
    subtitle: string;

    /**
     * Texto de subida.
     */
    uploadText: string;

    /**
     * Texto selector de tamaño.
     */
    sizeText: string;

    /**
     * Texto precio.
     */
    priceText: string;

    /**
     * Texto botón carrito.
     */
    addToCartText: string;
  };


  /**
   * Configuración administrativa.
   *
   * No necesita mostrarse al cliente.
   */
  admin?: {

    /**
     * Material activo.
     */
    enabled?: boolean;

    /**
     * Notas internas.
     */
    notes?: string;

    /**
     * Indica si el material fue creado
     * manualmente por el administrador.
     *
     * Esto queda preparado para el futuro.
     */
    customCreated?: boolean;
  };
}


/* ============================================================
   MATERIAL-SPECIFIC SIZE DATA
   ============================================================ */

/**
 * IMPORTANTE
 *
 * Canvas NO utiliza estos tamaños.
 *
 * Canvas continúa utilizando:
 *
 *     CANVAS_SIZES
 *
 * procedente de:
 *
 *     src/data/canvasPresets.ts
 *
 * De esta forma conservamos exactamente
 * los tamaños actuales de Canvas.
 */


/* ============================================================
   FRAMED PRINTS SIZES
   ============================================================ */

export const FRAMED_SIZES: MaterialSize[] = [

  {
    id: 'framed-30x40',
    label: '30 × 40 cm',
    widthCm: 30,
    heightCm: 40,
    originalPrice: 59,
    discountedPrice: 44,
    discountPercent: 25,
    category: 'Standard',
  },

  {
    id: 'framed-40x50',
    label: '40 × 50 cm',
    widthCm: 40,
    heightCm: 50,
    originalPrice: 79,
    discountedPrice: 59,
    discountPercent: 25,
    category: 'Standard',
    isBestSeller: true,
  },

  {
    id: 'framed-50x70',
    label: '50 × 70 cm',
    widthCm: 50,
    heightCm: 70,
    originalPrice: 109,
    discountedPrice: 79,
    discountPercent: 28,
    category: 'Large',
  },

  {
    id: 'framed-60x80',
    label: '60 × 80 cm',
    widthCm: 60,
    heightCm: 80,
    originalPrice: 139,
    discountedPrice: 99,
    discountPercent: 29,
    category: 'Large',
  },

  {
    id: 'framed-70x100',
    label: '70 × 100 cm',
    widthCm: 70,
    heightCm: 100,
    originalPrice: 179,
    discountedPrice: 129,
    discountPercent: 28,
    category: 'Premium',
  },

  {
    id: 'framed-80x120',
    label: '80 × 120 cm',
    widthCm: 80,
    heightCm: 120,
    originalPrice: 219,
    discountedPrice: 159,
    discountPercent: 27,
    category: 'Premium',
  },
];


/* ============================================================
   METAL PRINTS SIZES
   ============================================================ */

export const METAL_SIZES: MaterialSize[] = [

  {
    id: 'metal-20x30',
    label: '20 × 30 cm',
    widthCm: 20,
    heightCm: 30,
    originalPrice: 49,
    discountedPrice: 35,
    discountPercent: 29,
    category: 'Small',
  },

  {
    id: 'metal-30x40',
    label: '30 × 40 cm',
    widthCm: 30,
    heightCm: 40,
    originalPrice: 69,
    discountedPrice: 49,
    discountPercent: 29,
    category: 'Standard',
  },

  {
    id: 'metal-40x60',
    label: '40 × 60 cm',
    widthCm: 40,
    heightCm: 60,
    originalPrice: 99,
    discountedPrice: 69,
    discountPercent: 30,
    category: 'Standard',
    isBestSeller: true,
  },

  {
    id: 'metal-50x70',
    label: '50 × 70 cm',
    widthCm: 50,
    heightCm: 70,
    originalPrice: 129,
    discountedPrice: 89,
    discountPercent: 31,
    category: 'Large',
  },

  {
    id: 'metal-60x90',
    label: '60 × 90 cm',
    widthCm: 60,
    heightCm: 90,
    originalPrice: 159,
    discountedPrice: 109,
    discountPercent: 31,
    category: 'Large',
  },

  {
    id: 'metal-80x120',
    label: '80 × 120 cm',
    widthCm: 80,
    heightCm: 120,
    originalPrice: 219,
    discountedPrice: 149,
    discountPercent: 32,
    category: 'Premium',
  },
];


/* ============================================================
   ACRYLIC PRINTS SIZES
   ============================================================ */

export const ACRYLIC_SIZES: MaterialSize[] = [

  {
    id: 'acrylic-20x30',
    label: '20 × 30 cm',
    widthCm: 20,
    heightCm: 30,
    originalPrice: 69,
    discountedPrice: 49,
    discountPercent: 29,
    category: 'Small',
  },

  {
    id: 'acrylic-30x40',
    label: '30 × 40 cm',
    widthCm: 30,
    heightCm: 40,
    originalPrice: 89,
    discountedPrice: 64,
    discountPercent: 28,
    category: 'Standard',
  },

  {
    id: 'acrylic-40x60',
    label: '40 × 60 cm',
    widthCm: 40,
    heightCm: 60,
    originalPrice: 129,
    discountedPrice: 89,
    discountPercent: 31,
    category: 'Standard',
    isBestSeller: true,
  },

  {
    id: 'acrylic-50x70',
    label: '50 × 70 cm',
    widthCm: 50,
    heightCm: 70,
    originalPrice: 169,
    discountedPrice: 119,
    discountPercent: 30,
    category: 'Large',
  },

  {
    id: 'acrylic-60x90',
    label: '60 × 90 cm',
    widthCm: 60,
    heightCm: 90,
    originalPrice: 209,
    discountedPrice: 149,
    discountPercent: 29,
    category: 'Large',
  },

  {
    id: 'acrylic-80x120',
    label: '80 × 120 cm',
    widthCm: 80,
    heightCm: 120,
    originalPrice: 289,
    discountedPrice: 199,
    discountPercent: 31,
    category: 'Premium',
  },
];


/* ============================================================
   POSTER PRINTS SIZES
   ============================================================ */

export const POSTER_SIZES: MaterialSize[] = [

  {
    id: 'poster-20x30',
    label: '20 × 30 cm',
    widthCm: 20,
    heightCm: 30,
    originalPrice: 29,
    discountedPrice: 19,
    discountPercent: 34,
    category: 'Small',
  },

  {
    id: 'poster-30x40',
    label: '30 × 40 cm',
    widthCm: 30,
    heightCm: 40,
    originalPrice: 39,
    discountedPrice: 27,
    discountPercent: 31,
    category: 'Standard',
  },

  {
    id: 'poster-40x50',
    label: '40 × 50 cm',
    widthCm: 40,
    heightCm: 50,
    originalPrice: 49,
    discountedPrice: 34,
    discountPercent: 31,
    category: 'Standard',
    isBestSeller: true,
  },

  {
    id: 'poster-50x70',
    label: '50 × 70 cm',
    widthCm: 50,
    heightCm: 70,
    originalPrice: 69,
    discountedPrice: 49,
    discountPercent: 29,
    category: 'Large',
  },

  {
    id: 'poster-60x90',
    label: '60 × 90 cm',
    widthCm: 60,
    heightCm: 90,
    originalPrice: 89,
    discountedPrice: 64,
    discountPercent: 28,
    category: 'Large',
  },

  {
    id: 'poster-70x100',
    label: '70 × 100 cm',
    widthCm: 70,
    heightCm: 100,
    originalPrice: 109,
    discountedPrice: 79,
    discountPercent: 28,
    category: 'Premium',
  },
];


/* ============================================================
   CANVAS MATERIAL
   ============================================================ */

/**
 * Canvas utiliza los tamaños originales del proyecto.
 *
 * NO se duplican aquí.
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

  sizes: CANVAS_SIZES,

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

    basePrice: 0,

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
      'Canvas utiliza CANVAS_SIZES desde canvasPresets.ts. Los precios se mantienen configurables.',
  },
};


/* ============================================================
   FRAMED MATERIAL
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

  sizes: FRAMED_SIZES,

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

    basePrice: 0,

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
      'Framed Prints utiliza tamaños independientes de Canvas.',
  },
};


/* ============================================================
   METAL MATERIAL
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

  sizes: METAL_SIZES,

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

    basePrice: 0,

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
      'Metal Prints utiliza tamaños independientes de Canvas.',
  },
};


/* ============================================================
   ACRYLIC MATERIAL
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

  sizes: ACRYLIC_SIZES,

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

    basePrice: 0,

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
      'Acrylic Prints utiliza tamaños independientes de Canvas.',
  },
};


/* ============================================================
   POSTER MATERIAL
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

  sizes: POSTER_SIZES,

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

    basePrice: 0,

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
      'Poster Prints utiliza tamaños independientes de Canvas.',
  },
};


/* ============================================================
   MATERIAL CONFIG COLLECTION
   ============================================================ */

/**
 * Todos los materiales actuales.
 *
 * Esta colección es la fuente central de materiales.
 *
 * En el futuro un nuevo material podrá incorporarse
 * aquí sin tener que modificar Header, App o SizeSelector.
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

/**
 * Comprueba si existe un material.
 *
 * Como MaterialId permite materiales personalizados,
 * esta función consulta directamente la colección.
 */
export function isMaterialId(
  value: string
): value is MaterialId {

  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value in materialConfigs
  );
}


/* ============================================================
   DEFAULT MATERIAL
   ============================================================ */

/**
 * Canvas continúa siendo el material predeterminado.
 */
export const DEFAULT_MATERIAL: MaterialId =
  'canvas';


/* ============================================================
   MATERIAL HELPERS
   ============================================================ */

/**
 * Devuelve todos los materiales disponibles.
 */
export function getAllMaterialConfigs():
  MaterialConfig[] {

  return Object.values(materialConfigs);
}


/**
 * Devuelve los tamaños configurados
 * para un material.
 */
export function getMaterialSizes(
  materialId: MaterialId
): MaterialSize[] {

  return (
    materialConfigs[materialId]?.sizes ||
    []
  );
}


/**
 * Devuelve el precio base de un material.
 */
export function getMaterialBasePrice(
  materialId: MaterialId
): number {

  return (
    materialConfigs[materialId]
      ?.pricing
      ?.basePrice ?? 0
  );
}


/**
 * Comprueba si un material está habilitado.
 */
export function isMaterialEnabled(
  materialId: MaterialId
): boolean {

  return (
    materialConfigs[materialId]
      ?.admin
      ?.enabled !== false
  );
}


/* ============================================================
   MATERIAL REGISTRATION
   ============================================================ */

/**
 * Registra un nuevo material.
 *
 * Esta función queda preparada para la futura
 * Configuración de Tienda.
 *
 * Ejemplo futuro:
 *
 * registerMaterial({
 *   id: 'wood',
 *   name: 'wood',
 *   displayName: 'Wood Prints',
 *   ...
 * });
 */
export function registerMaterial(
  material: MaterialConfig
): MaterialConfig {

  materialConfigs[material.id] =
    material;

  return material;
}


/* ============================================================
   MATERIAL UPDATE
   ============================================================ */

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

  if (!current) {
    throw new Error(
      `Material "${materialId}" no existe.`
    );
  }

  const updated: MaterialConfig = {

    ...current,

    ...updates,

    /**
     * Mantiene el ID original para evitar
     * inconsistencias internas.
     */
    id: current.id,
  };

  materialConfigs[materialId] =
    updated;

  return updated;
}


/* ============================================================
   CREATE MATERIAL
   ============================================================ */

/**
 * Crea un nuevo material utilizando valores
 * razonables por defecto.
 *
 * Esto NO necesita utilizarse todavía desde
 * la interfaz de usuario.
 *
 * Queda preparado para una futura pantalla:
 *
 * Configuración → Materiales → Agregar material
 */
export function createMaterialConfig(
  material: Partial<MaterialConfig> & {
    id: MaterialId;
    name: string;
    displayName: string;
  }
): MaterialConfig {

  const newMaterial: MaterialConfig = {

    id: material.id,

    name: material.name,

    displayName:
      material.displayName,

    description:
      material.description || '',

    shopifyProductHandle:
      material.shopifyProductHandle,

    previewType:
      material.previewType || 'custom',

    images:
      material.images || {
        main: '',
        gallery: [],
      },

    sizes:
      material.sizes || [],

    options:
      material.options || {
        frameColors: [],
        finishes: [],
        thicknesses: [],
      },

    pricing:
      material.pricing || {
        basePrice: 0,
        currency: 'EUR',
        priceBySize: true,
        priceByOption: true,
      },

    preview:
      material.preview || {
        backgroundImage: '',
        roomImage: '',
        frameThickness: 0,
        frameDepth: 0,
        showShadow: true,
        showRoomPreview: true,
      },

    ui:
      material.ui || {
        title: material.displayName,
        subtitle: '',
        uploadText: 'Upload your photo',
        sizeText: 'Choose your size',
        priceText: 'Price',
        addToCartText: 'Add to cart',
      },

    admin:
      material.admin || {
        enabled: true,
        customCreated: true,
        notes: '',
      },
  };

  materialConfigs[
    newMaterial.id
  ] = newMaterial;

  return newMaterial;
}


/* ============================================================
   REMOVE MATERIAL
   ============================================================ */

/**
 * Elimina un material personalizado.
 *
 * Por seguridad, los cinco materiales originales
 * no se eliminan mediante esta función.
 */
export function removeMaterial(
  materialId: MaterialId
): boolean {

  const protectedMaterials: MaterialId[] = [
    'canvas',
    'framed',
    'metal',
    'acrylic',
    'poster',
  ];

  if (
    protectedMaterials.includes(
      materialId
    )
  ) {

    return false;
  }

  if (
    !materialConfigs[materialId]
  ) {

    return false;
  }

  delete materialConfigs[
    materialId
  ];

  return true;
}
