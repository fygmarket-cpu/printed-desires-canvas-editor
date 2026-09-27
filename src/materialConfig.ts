export interface MaterialConfig {
  id: MaterialId;

  name: string;

  displayName: string;

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
   * Estas imágenes podrán modificarse desde
   * Configuración de Tienda.
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
   * El cliente nunca necesita ver esta información.
   */
  admin?: {
    enabled?: boolean;

    notes?: string;
  };
}
export const materialConfigs: Record<MaterialId, MaterialConfig> = {
  canvas: canvasMaterial,
  framed: framedMaterial,
  metal: metalMaterial,
  acrylic: acrylicMaterial,
  poster: posterMaterial,
};

export function getMaterialConfig(
  materialId: MaterialId
): MaterialConfig {
  return materialConfigs[materialId];
}

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
