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
 * MaterialSize mantiene compatibilidad con CanvasSize.
 *
 * IMPORTANTE:
 * Cada material puede tener su propia lista de tamaños.
 *
 * No es obligatorio que Framed, Metal, Acrylic o Poster
 * utilicen exactamente los mismos tamaños que Canvas.
 */
export type MaterialSize = CanvasSize;

/* ============================================================
   MATERIAL CONFIGURATION
   ============================================================ */

export interface MaterialConfig {

  /**
   * Identificador interno del material.
   *
   * Ejemplos:
   * canvas
   * framed
   * metal
   * acrylic
   * poster
   *
   * En el futuro se podrán añadir nuevos IDs.
   */
  id: MaterialId;

  /**
   * Nombre interno.
   */
  name: string;

  /**
   * Nombre visible para el cliente.
   *
   * Ejemplo:
   * Canvas Prints
   * Metal Prints
   */
  displayName: string;

  /**
   * Descripción comercial del material.
   */
  description: string;

  /**
   * Handle del producto correspondiente en Shopify.
   *
   * Ejemplo:
   * canvas-prints
   */
  shopifyProductHandle?: string;

  /**
   * Tipo de preview utilizado por el editor.
   *
   * En el futuro se pueden ampliar estos tipos.
   */
  previewType:
    | 'canvas'
    | 'framed'
    | 'metal'
    | 'acrylic'
    | 'poster';

  /**
   * Imágenes del material.
   *
   * main:
   * Imagen principal.
   *
   * gallery:
   * Imágenes adicionales.
   */
  images?: {
    main?: string;
    gallery?: string[];
  };

  /**
   * ==========================================================
   * MATERIAL-SPECIFIC SIZES
   * ==========================================================
   *
   * Cada material puede tener tamaños diferentes.
   *
   * Ejemplo:
   *
   * Canvas:
   * 20x25
   * 40x50
   * 50x70
   * 75x100
   *
   * Metal:
   * 30x40
   * 40x60
   * 60x90
   *
   * Acrylic:
   * otros tamaños
   *
   * Esto evita que todos los materiales dependan
   * de CANVAS_SIZES.
   */
  sizes: MaterialSize[];

  /**
   * Opciones específicas del material.
   */
  options?: {

    /**
     * Colores de marco.
     *
     * Ejemplo:
     * White
     * Wood
     * Dark Wood
     * Black
     */
    frameColors?: string[];

    /**
     * Acabados.
     *
     * Ejemplo:
     * Matte
     * Glossy
     * Premium
     */
    finishes?: string[];

    /**
     * Espesores o variantes físicas.
     *
     * Ejemplo:
     * 2 cm
     * 4 cm
     * 3 mm
     * 6 mm
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
     * Si el precio cambia según tamaño.
     */
    priceBySize?: boolean;

    /**
     * Si el precio cambia según opciones.
     */
    priceByOption?: boolean;
  };

  /**
   * Configuración visual del preview.
   */
  preview?: {

    /**
     * Fondo utilizado en el preview.
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
     * Mostrar preview dentro de habitación.
     */
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
   * ==========================================================
   * ADMIN
   * ==========================================================
   *
   * Esta sección NO tiene que ser visible al cliente.
   *
   * Se utilizará posteriormente para configuración interna.
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
 * DEFAULT_SIZES
 *
 * Esta es una base reutilizable.
 *
 * IMPORTANTE:
 *
 * NO significa que todos los materiales tengan que utilizar
 * estos tamaños.
 *
 * Cada material puede:
 *
 * 1. Utilizar DEFAULT_SIZES.
 *
 * 2. Crear sus propios tamaños.
 *
 * 3. Crear una combinación de tamaños.
 *
 * Ejemplo futuro:
 *
 * sizes: [
 *   ...DEFAULT_SIZES,
 *   nuevoTamaño
 * ]
 */
export const DEFAULT_SIZES: MaterialSize[] = [

  /* ----------------------------------------------------------
     STANDARD
  ---------------------------------------------------------- */

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

  /* ----------------------------------------------------------
     LARGE
  ---------------------------------------------------------- */

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

  /* ----------------------------------------------------------
     PREMIUM
  ---------------------------------------------------------- */

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
   CANVAS SIZES
   ============================================================ */

/**
 * Canvas utiliza DEFAULT_SIZES como configuración inicial.
 *
 * Se crea una copia para evitar compartir accidentalmente
 * el mismo array entre diferentes materiales.
 */
export const CANVAS_SIZES: MaterialSize[] =
  DEFAULT_SIZES.map((size) => ({
    ...size,
  }));

/* ============================================================
   FRAMED SIZES
   ============================================================ */

/**
 * Framed Prints
 *
 * Preparado para tener tamaños independientes.
 *
 * Actualmente utiliza una copia de DEFAULT_SIZES.
 *
 * Más adelante puedes modificar solamente este array.
 */
export const FRAMED_SIZES: MaterialSize[] =
  DEFAULT_SIZES.map((size) => ({
    ...size,
  }));

/* ============================================================
   METAL SIZES
   ============================================================ */

/**
 * Metal Prints
 *
 * También tiene su propia colección.
 *
 * Puedes cambiar estos tamaños sin afectar Canvas.
 */
export const METAL_SIZES: MaterialSize[] =
  DEFAULT_SIZES.map((size) => ({
    ...size,
  }));

/* ============================================================
   ACRYLIC SIZES
   ============================================================ */

/**
 * Acrylic Prints
 *
 * Configuración independiente.
 */
export const ACRYLIC_SIZES: MaterialSize[] =
  DEFAULT_SIZES.map((size) => ({
    ...size,
  }));

/* ============================================================
   POSTER SIZES
   ============================================================ */

/**
 * Poster Prints
 *
 * Configuración independiente.
 */
export const POSTER_SIZES: MaterialSize[] =
  DEFAULT_SIZES.map((size) => ({
    ...size,
  }));

/* ============================================================
   MATERIAL FACTORIES
   ============================================================ */

/* ============================================================
   CANVAS
   ============================================================ */

export const canvasMaterial: MaterialConfig = {

  id: 'canvas',

  name: 'canvas',

  displayName: 'Canvas Prints',

  description:
    'Impresión fotográfica premium sobre lienzo de algodón con acabado artístico.',

  shopifyProductHandle:
    'canvas-prints',

  previewType:
    'canvas',

  images: {
    main: '',
    gallery: [],
  },

  /**
   * Canvas tiene sus propios tamaños.
   */
  sizes:
    CANVAS_SIZES,

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

    title:
      'Canvas Prints',

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
      'Configuración editable del producto Canvas. Los tamaños y precios pueden modificarse independientemente de los demás materiales.',
  },
};

/* ============================================================
   FRAMED
   ============================================================ */

export const framedMaterial: MaterialConfig = {

  id: 'framed',

  name: 'framed',

  displayName: 'Framed Prints',

  description:
    'Impresiones premium presentadas en un elegante marco decorativo.',

  shopifyProductHandle:
    'framed-prints',

  previewType:
    'framed',

  images: {

    main: '',

    gallery: [],
  },

  /**
   * Framed tiene su propia colección.
   */
  sizes:
    FRAMED_SIZES,

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

    title:
      'Framed Prints',

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
      'Configuración editable de Framed Prints. Los tamaños son independientes de Canvas.',
  },
};

/* ============================================================
   METAL
   ============================================================ */

export const metalMaterial: MaterialConfig = {

  id: 'metal',

  name: 'metal',

  displayName: 'Metal Prints',

  description:
    'Impresión fotográfica de alta definición sobre panel metálico.',

  shopifyProductHandle:
    'metal-prints',

  previewType:
    'metal',

  images: {

    main: '',

    gallery: [],
  },

  /**
   * Metal tiene su propia colección.
   */
  sizes:
    METAL_SIZES,

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

    title:
      'Metal Prints',

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
      'Configuración editable de Metal Prints. Los tamaños son independientes de Canvas.',
  },
};

/* ============================================================
   ACRYLIC
   ============================================================ */

export const acrylicMaterial: MaterialConfig = {

  id: 'acrylic',

  name: 'acrylic',

  displayName: 'Acrylic Prints',

  description:
    'Fotografía de alta definición con acabado acrílico elegante y moderno.',

  shopifyProductHandle:
    'acrylic-prints',

  previewType:
    'acrylic',

  images: {

    main: '',

    gallery: [],
  },

  /**
   * Acrylic tiene su propia colección.
   */
  sizes:
    ACRYLIC_SIZES,

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

    title:
      'Acrylic Prints',

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
      'Configuración editable de Acrylic Prints. Los tamaños son independientes de Canvas.',
  },
};

/* ============================================================
   POSTER
   ============================================================ */

export const posterMaterial: MaterialConfig = {

  id: 'poster',

  name: 'poster',

  displayName: 'Poster Prints',

  description:
    'Impresiones artísticas de alta calidad para decoración mural.',

  shopifyProductHandle:
    'poster-prints',

  previewType:
    'poster',

  images: {

    main: '',

    gallery: [],
  },

  /**
   * Poster tiene su propia colección.
   */
  sizes:
    POSTER_SIZES,

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

    title:
      'Poster Prints',

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
      'Configuración editable de Poster Prints. Los tamaños son independientes de Canvas.',
  },
};

/* ============================================================
   MATERIAL CONFIG COLLECTION
   ============================================================ */

export const materialConfigs:
  Record<MaterialId, MaterialConfig> = {

  canvas:
    canvasMaterial,

  framed:
    framedMaterial,

  metal:
    metalMaterial,

  acrylic:
    acrylicMaterial,

  poster:
    posterMaterial,
};

/* ============================================================
   GET MATERIAL CONFIG
   ============================================================ */

/**
 * Devuelve la configuración completa
 * de un material.
 */
export function getMaterialConfig(
  materialId: MaterialId
): MaterialConfig {

  return materialConfigs[materialId];
}

/* ============================================================
   MATERIAL ID VALIDATION
   ============================================================ */

/**
 * Comprueba si un valor corresponde
 * a un material válido.
 */
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
 * Canvas permanece como material inicial.
 */
export const DEFAULT_MATERIAL:
  MaterialId = 'canvas';

/* ============================================================
   MATERIAL HELPERS
   ============================================================ */

/**
 * Devuelve todos los materiales disponibles.
 */
export function getAllMaterialConfigs():
  MaterialConfig[] {

  return Object.values(
    materialConfigs
  );
}

/**
 * Devuelve los tamaños configurados
 * para un material concreto.
 */
export function getMaterialSizes(
  materialId: MaterialId
): MaterialSize[] {

  return materialConfigs[
    materialId
  ].sizes;
}

/**
 * Devuelve el precio base
 * de un material.
 */
export function getMaterialBasePrice(
  materialId: MaterialId
): number {

  return (
    materialConfigs[
      materialId
    ].pricing?.basePrice || 0
  );
}

/* ============================================================
   FUTURE MATERIAL SUPPORT
   ============================================================ */

/**
 * ============================================================
 * NUEVOS MATERIALES
 * ============================================================
 *
 * IMPORTANTE:
 *
 * Por ahora MaterialId está limitado a los 5 materiales
 * actuales.
 *
 * Cuando quieras agregar un nuevo material, por ejemplo:
 *
 *   wood
 *
 * tendrás que agregar:
 *
 *   | 'wood'
 *
 * a MaterialId y después crear:
 *
 *   export const woodMaterial: MaterialConfig = {...}
 *
 * y finalmente añadirlo a materialConfigs:
 *
 *   wood: woodMaterial
 *
 * ============================================================
 *
 * La estructura de MaterialConfig ya está preparada para
 * que un futuro material pueda definir:
 *
 * - nombre
 * - descripción
 * - Shopify handle
 * - tipo de preview
 * - imágenes
 * - tamaños propios
 * - colores
 * - acabados
 * - espesores
 * - precio base
 * - precio por tamaño
 * - precio por opción
 * - imagen de habitación
 * - preview
 * - textos
 * - notas administrativas
 *
 * Esto permitirá que el futuro panel de Configuración
 * de Tienda pueda crear/configurar materiales sin tener
 * que cambiar la arquitectura del producto.
 *
 * ============================================================
 */

/* ============================================================
   UPDATE MATERIAL CONFIG
   ============================================================ */

/**
 * Actualiza una configuración de material
 * de forma inmutable.
 *
 * NOTA:
 *
 * Esta función está preparada para la futura
 * Configuración de Tienda.
 *
 * En este momento materialConfigs es un objeto
 * local en memoria.
 */
export function updateMaterialConfig(
  materialId: MaterialId,
  updates: Partial<MaterialConfig>
): MaterialConfig {

  const current =
    materialConfigs[
      materialId
    ];

  const updated: MaterialConfig = {

    ...current,

    ...updates,
  };

  materialConfigs[
    materialId
  ] = updated;

  return updated;
}

/* ============================================================
   CREATE MATERIAL TEMPLATE
   ============================================================ */

/**
 * Plantilla para crear un nuevo material
 * desde el futuro panel administrativo.
 *
 * Actualmente NO registra automáticamente
 * el material porque MaterialId es un tipo
 * cerrado para mantener seguridad TypeScript.
 *
 * Esta función devuelve una configuración
 * inicial que después puede registrarse.
 */
export function createMaterialTemplate(
  data: Partial<MaterialConfig> & {
    id: MaterialId;
    name: string;
    displayName: string;
  }
): MaterialConfig {

  const template: MaterialConfig = {

    id:
      data.id,

    name:
      data.name,

    displayName:
      data.displayName,

    description:
      data.description ||
      '',

    shopifyProductHandle:
      data.shopifyProductHandle,

    previewType:
      data.previewType ||
      'canvas',

    images:
      data.images || {
        main: '',
        gallery: [],
      },

    sizes:
      data.sizes
        ? [...data.sizes]
        : [],

    options:
      data.options || {
        frameColors: [],
        finishes: [],
        thicknesses: [],
      },

    pricing:
      data.pricing || {
        basePrice: 0,
        currency: 'EUR',
        priceBySize: true,
        priceByOption: true,
      },

    preview:
      data.preview || {
        backgroundImage: '',
        roomImage: '',
        frameThickness: 0,
        frameDepth: 0,
        showShadow: true,
        showRoomPreview: true,
      },

    ui:
      data.ui || {

        title:
          data.displayName,

        subtitle:
          '',

        uploadText:
          'Upload your photo',

        sizeText:
          'Choose your size',

        priceText:
          'Price',

        addToCartText:
          'Add to cart',
      },

    admin:
      data.admin || {
        enabled: true,
        notes: '',
      },
  };

  return template;
}

/* ============================================================
   CLONE MATERIAL SIZES
   ============================================================ */

/**
 * Crea una copia independiente de los tamaños
 * de un material.
 *
 * Esto será útil cuando quieras crear un nuevo material
 * basándote en otro.
 *
 * Ejemplo futuro:
 *
 * const newSizes =
 *   cloneMaterialSizes('canvas');
 */
export function cloneMaterialSizes(
  materialId: MaterialId
): MaterialSize[] {

  return materialConfigs[
    materialId
  ].sizes.map((size) => ({
    ...size,
  }));
}

/* ============================================================
   ADD SIZE TO MATERIAL
   ============================================================ */

/**
 * Añade un nuevo tamaño a un material.
 *
 * Se utiliza una copia del array para evitar
 * modificar accidentalmente otras configuraciones.
 */
export function addMaterialSize(
  materialId: MaterialId,
  size: MaterialSize
): MaterialSize[] {

  const currentSizes =
    materialConfigs[
      materialId
    ].sizes;

  const updatedSizes = [
    ...currentSizes,
    {
      ...size,
    },
  ];

  materialConfigs[
    materialId
  ] = {
    ...materialConfigs[
      materialId
    ],

    sizes:
      updatedSizes,
  };

  return updatedSizes;
}

/* ============================================================
   REMOVE SIZE FROM MATERIAL
   ============================================================ */

/**
 * Elimina un tamaño de un material
 * utilizando su ID.
 */
export function removeMaterialSize(
  materialId: MaterialId,
  sizeId: string
): MaterialSize[] {

  const currentSizes =
    materialConfigs[
      materialId
    ].sizes;

  const updatedSizes =
    currentSizes.filter(
      (size) =>
        size.id !== sizeId
    );

  materialConfigs[
    materialId
  ] = {

    ...materialConfigs[
      materialId
    ],

    sizes:
      updatedSizes,
  };

  return updatedSizes;
}

/* ============================================================
   UPDATE MATERIAL SIZE
   ============================================================ */

/**
 * Edita un tamaño existente.
 *
 * Ejemplo:
 *
 * actualizar precio
 * cambiar nombre
 * cambiar dimensiones
 * cambiar descuento
 */
export function updateMaterialSize(
  materialId: MaterialId,
  sizeId: string,
  updates: Partial<MaterialSize>
): MaterialSize[] {

  const currentSizes =
    materialConfigs[
      materialId
    ].sizes;

  const updatedSizes =
    currentSizes.map(
      (size) => {

        if (
          size.id !== sizeId
        ) {
          return size;
        }

        return {
          ...size,
          ...updates,
        };
      }
    );

  materialConfigs[
    materialId
  ] = {

    ...materialConfigs[
      materialId
    ],

    sizes:
      updatedSizes,
  };

  return updatedSizes;
}
