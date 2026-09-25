import {
  CanvasSize,
  CategoryItem,
  CurrencyConfig,
  DepthOption,
  FilterPresetId,
  FrameOption,
  StoreConfig,
} from '../types/canvas';

// Generated image assets
export const PRESET_ARTWORKS = [
  {
    id: 'oil-portrait',
    title: 'Dama con Rosas (Óleo Clásico)',
    category: 'Pintura & Arte',
    url: '/src/assets/images/artwork_romantic_oil_portrait_1790308547213.jpg',
  },
  {
    id: 'mountain-lake',
    title: 'Lago Alpino al Atardecer',
    category: 'Paisajes & Naturaleza',
    url: '/src/assets/images/artwork_mountain_lake_landscape_1790308558798.jpg',
  },
  {
    id: 'modern-abstract',
    title: 'Textura Minimalista Oro & Barro',
    category: 'Arte Moderno',
    url: '/src/assets/images/artwork_modern_minimalist_abstract_1790308568865.jpg',
  },
];

export const ROOM_MOCKUP_IMAGE = '/src/assets/images/room_interior_living_sofa_1790308577503.jpg';

export const CANVAS_SIZES: CanvasSize[] = [
  // Popular
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

  // Portrait (Vertical)
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

  // Landscape (Horizontal)
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

  // Square
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

  // Panoramic
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

export const FRAMING_OPTIONS: FrameOption[] = [
  {
    id: 'none',
    name: 'Sin marco (Lienzo puro)',
    description: 'Bordes tensados sobre bastidor de madera de pino nórdico',
    price: 0,
    colorClass: 'border-dashed border-neutral-300',
    hexColor: '#cccccc',
  },
  {
    id: 'floating_oak',
    name: 'Marco Flotante Roble Natural',
    description: 'Madera de roble macizo con separación flotante de 5mm',
    price: 16.95,
    colorClass: 'bg-[#c89d7c] border-[#b08564]',
    hexColor: '#c89d7c',
  },
  {
    id: 'floating_black',
    name: 'Marco Flotante Negro Mate',
    description: 'Acabado contemporáneo negro azabache de textura sedosa',
    price: 14.95,
    colorClass: 'bg-[#18181b] border-neutral-900',
    hexColor: '#18181b',
  },
  {
    id: 'floating_white',
    name: 'Marco Flotante Blanco Satinado',
    description: 'Acento limpio y luminoso para interiores modernos',
    price: 14.95,
    colorClass: 'bg-[#f4f4f5] border-neutral-300',
    hexColor: '#f4f4f5',
  },
  {
    id: 'gold_vintage',
    name: 'Marco Clásico Dorado Antiguo',
    description: 'Moldura barroca con pátina dorada y relieve artesanal',
    price: 22.95,
    colorClass: 'bg-[#d4af37] border-[#b38f2a]',
    hexColor: '#d4af37',
  },
];

export const WRAP_STYLES = [
  {
    id: 'gallery',
    name: 'Borde Galería Continuo',
    description: 'La propia fotografía se envuelve suavemente en los laterales',
    preview: 'bg-gradient-to-r from-rose-200 to-rose-400',
  },
  {
    id: 'mirror',
    name: 'Borde Espejo',
    description: 'Los bordes se reflejan simétricamente sin recortar la foto frontal',
    preview: 'border-2 border-dashed border-rose-300',
  },
  {
    id: 'white',
    name: 'Borde Blanco Estudio',
    description: 'Lateral blanco puro para un encuadre pulcro y despejado',
    preview: 'bg-white border border-neutral-300',
  },
  {
    id: 'black',
    name: 'Borde Negro Galería',
    description: 'Lateral negro profundo que resalta el contraste de la obra',
    preview: 'bg-neutral-950',
  },
  {
    id: 'custom',
    name: 'Color Personalizado',
    description: 'Selecciona cualquier tono a juego con tu paleta decorativa',
    preview: 'bg-gradient-to-tr from-indigo-400 via-rose-300 to-amber-300',
  },
];

export interface FilterPreset {
  id: FilterPresetId;
  name: string;
  css: string;
  description: string;
}

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'none',
    name: 'Original',
    css: 'none',
    description: 'Colores puros sin alteración de balance',
  },
  {
    id: 'bw',
    name: 'Blanco & Negro',
    css: 'grayscale(100%) contrast(110%)',
    description: 'Contraste monocromático atemporal y dramático',
  },
  {
    id: 'sepia',
    name: 'Nostalgia Sepia',
    css: 'sepia(80%) contrast(95%) brightness(95%)',
    description: 'Calidez nostálgica estilo fotografía de época',
  },
  {
    id: 'vintage',
    name: 'Vintage 70s',
    css: 'sepia(30%) saturate(120%) contrast(105%) hue-rotate(-10deg)',
    description: 'Tonos terrosos y saturación cálida analógica',
  },
  {
    id: 'vivid',
    name: 'Color Vívido',
    css: 'saturate(145%) contrast(110%)',
    description: 'Resalta la intensidad y viveza de los colores',
  },
  {
    id: 'warm',
    name: 'Golden Hour',
    css: 'sepia(20%) saturate(125%) brightness(105%) hue-rotate(-5deg)',
    description: 'Luz dorada de atardecer mediterráneo',
  },
  {
    id: 'cool',
    name: 'Nórdico Frío',
    css: 'saturate(85%) contrast(105%) hue-rotate(15deg) brightness(102%)',
    description: 'Tonos fríos y atmósfera serena escandinava',
  },
  {
    id: 'cinematic',
    name: 'Cineasta Teal',
    css: 'contrast(120%) saturate(115%) hue-rotate(-15deg)',
    description: 'Gradación cromática de película de cine',
  },
  {
    id: 'matte',
    name: 'Película Mate',
    css: 'contrast(90%) brightness(105%) saturate(85%)',
    description: 'Negros atenuados con tacto de papel de arte',
  },
];

export const AVAILABLE_FONTS = [
  { id: 'Cormorant Garamond', name: 'Cormorant (Clásica & Editorial)', family: "'Cormorant Garamond', serif" },
  { id: 'Inter', name: 'Inter (Moderna & Limpia)', family: "'Inter', sans-serif" },
  { id: 'Great Vibes', name: 'Great Vibes (Cursiva Caligráfica)', family: "'Great Vibes', cursive" },
  { id: 'Cinzel', name: 'Cinzel (Romana Imperial)', family: "'Cinzel', serif" },
  { id: 'Caveat', name: 'Caveat (Manuscrita Espontánea)', family: "'Caveat', cursive" },
];

export const DEFAULT_CURRENCIES: CurrencyConfig[] = [
  { code: 'EUR', symbol: '€', label: 'Euros (EUR)', rate: 1, position: 'suffix' },
  { code: 'GBP', symbol: '£', label: 'Libras (GBP)', rate: 0.85, position: 'prefix' },
  { code: 'USD', symbol: '$', label: 'Dólares (USD)', rate: 1.08, position: 'prefix' },
  { code: 'MXN', symbol: '$', label: 'Pesos (MXN)', rate: 18.5, position: 'prefix' },
];

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'popular', label: 'Popular' },
  { id: 'portrait', label: 'Portrait' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'square', label: 'Square' },
  { id: 'panoramic', label: 'Panoramic' },
];

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  brandName: 'PRINTED DESIRES',
  brandHighlight: 'DESIRES',
  brandTagline: 'FINE ART EDITIONS',
  topBannerText: '',
  showTopBanner: false,
  primaryColor: '#B99A62',
  currencies: DEFAULT_CURRENCIES,
  selectedCurrencyCode: 'EUR',
  globalAutoDiscount: 45,
  enableAutoDiscount: false,
  categories: DEFAULT_CATEGORIES,
  sizes: CANVAS_SIZES,
  frames: FRAMING_OPTIONS,
  depthOptions: [
    { depthCm: 2, label: '2 cm (Estándar)', extraPrice: 0 },
    { depthCm: 4, label: '4 cm Galería (+6,00€)', extraPrice: 6.0 },
  ],
  deliveryNotice: 'Entrega estimada: 2 - 3 días laborables',
  freeShippingThreshold: 60,
  shippingCost: 5.95,
};
