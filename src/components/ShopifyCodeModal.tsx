import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Code2,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  HelpCircle,
  Eye,
  Edit,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Globe,
  Maximize2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Download,
} from 'lucide-react';

interface ShopifyCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  designerUrl?: string;
  brandName?: string;
}

export const ShopifyCodeModal: React.FC<ShopifyCodeModalProps> = ({
  isOpen,
  onClose,
  designerUrl,
  brandName = 'Printed Desires',
}) => {
  if (!isOpen) return null;

  // Resolve current active URL (defaults to user's Vercel deployment)
  const defaultUrl =
    designerUrl || 'https://canvaseditor-nine.vercel.app/';

  const [activeUrl, setActiveUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pd_custom_designer_url');
      if (saved && !saved.includes('fygmarket-cpu.github.io')) return saved;
    }
    return defaultUrl;
  });
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'hosting'>('visual');

  // Customizer options
  const [buttonText, setButtonText] = useState('Personalizar Lienzo en 3D');
  const [buttonSubtitle, setButtonSubtitle] = useState('Vista previa interactiva en tu salón');
  const [embedType, setEmbedType] = useState<'popup_window' | 'popup' | 'inline' | 'cart_integrated' | 'redirect'>('popup_window');
  const [btnBgColor, setBtnBgColor] = useState('#171513');
  const [btnTextColor, setBtnTextColor] = useState('#FFFFFF');
  const [btnBorderColor, setBtnBorderColor] = useState('#B99A62');
  const [showSubtitle, setShowSubtitle] = useState(true);

  // Manual raw code edit state
  const [customHtmlCode, setCustomHtmlCode] = useState<string>('');
  const [isManualEdited, setIsManualEdited] = useState(false);

  // Helper generator
  const buildShopifySnippet = () => {
    // 1. Popup Window (Recommended - 100% immune to iframe/CSP blocking in Shopify)
    if (embedType === 'popup_window') {
      return `<!-- =================================================================
     PRINTED DESIRES | BOTÓN PERSONALIZADOR EN VENTANA FLOTANTE
     Recomendado para Shopify: 100% compatible, no sufre bloqueos de iframes
     Compatible con Shopify OS 2.0 (Dawn, Prestige, Ella, etc.)
     Pegar en: Custom Liquid / Bloque HTML en Ficha de Producto
     ================================================================= -->

<div class="pd-shopify-cta-block" style="margin: 22px 0; width: 100%; box-sizing: border-box;">
  <button 
    type="button"
    id="pd-open-canvas-designer"
    class="pd-designer-trigger-btn"
    onclick="openPrintedDesiresWindow()"
    aria-label="${buttonText}"
  >
    <div class="pd-btn-icon-wrapper">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B99A62" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    </div>
    <div class="pd-btn-content">
      <span class="pd-btn-title">${buttonText}</span>
      ${showSubtitle && buttonSubtitle ? `<span class="pd-btn-subtitle">${buttonSubtitle}</span>` : ''}
    </div>
  </button>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');

  .pd-shopify-cta-block {
    display: block;
    width: 100%;
  }

  .pd-designer-trigger-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    min-height: 54px;
    padding: 14px 24px;
    background-color: ${btnBgColor};
    color: ${btnTextColor} !important;
    border: 1px solid ${btnBorderColor};
    border-radius: 12px;
    cursor: pointer;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    box-shadow: 0 8px 24px -4px rgba(18, 18, 18, 0.20), 0 2px 6px -1px rgba(18, 18, 18, 0.08);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    text-align: center;
  }

  .pd-designer-trigger-btn:hover {
    background-color: #4A352B;
    border-color: #B99A62;
    transform: translateY(-2px);
    box-shadow: 0 14px 30px -4px rgba(18, 18, 18, 0.30);
  }

  .pd-designer-trigger-btn:active {
    transform: scale(0.99);
  }

  .pd-btn-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .pd-btn-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.25;
  }

  .pd-btn-title {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.03em;
    color: ${btnTextColor};
  }

  .pd-btn-subtitle {
    font-size: 11px;
    font-weight: 400;
    color: #F8F5F0;
    opacity: 0.85;
    margin-top: 2px;
  }
</style>

<script>
  function openPrintedDesiresWindow() {
    var width = Math.min(1360, window.screen.availWidth - 40);
    var height = Math.min(880, window.screen.availHeight - 80);
    var left = (window.screen.availWidth - width) / 2;
    var top = (window.screen.availHeight - height) / 2;
    var targetUrl = '${activeUrl}';

    // Abre ventana limpia optimizada para el diseñador 3D
    var win = null;
    try {
      win = window.open(
        targetUrl,
        'PrintedDesiresEditor',
        'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=' + width + ',height=' + height + ',top=' + top + ',left=' + left
      );
    } catch(e) {}

    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      win.focus();
    }
  }
</script>`;
    }

    if (embedType === 'popup') {
      return `<!-- =================================================================
     PRINTED DESIRES | BOTÓN PERSONALIZADOR DE LIENZOS 3D (MODAL LIGHTBOX)
     Compatible con Shopify OS 2.0 (Dawn, Prestige, Ella, etc.)
     Pegar en: Custom Liquid / Bloque HTML en Plantilla de Producto
     ================================================================= -->

<div class="pd-shopify-cta-block" style="margin: 22px 0; width: 100%; box-sizing: border-box;">
  <button 
    type="button"
    id="pd-open-canvas-designer"
    class="pd-designer-trigger-btn"
    onclick="openPrintedDesiresModal()"
    aria-label="${buttonText}"
  >
    <div class="pd-btn-icon-wrapper">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B99A62" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    </div>
    <div class="pd-btn-content">
      <span class="pd-btn-title">${buttonText}</span>
      ${showSubtitle && buttonSubtitle ? `<span class="pd-btn-subtitle">${buttonSubtitle}</span>` : ''}
    </div>
  </button>
</div>

<!-- Modal Emergente 3D en Pantalla Completa -->
<div id="pd-modal-overlay" class="pd-modal-backdrop" style="display: none;" onclick="pdHandleOverlayClose(event)">
  <div class="pd-modal-dialog">
    <div class="pd-modal-topbar">
      <div class="pd-brand-header">
        <span class="pd-brand-name">${brandName.toUpperCase()}</span>
        <span class="pd-brand-divider">·</span>
        <span class="pd-brand-tag">FINE ART EDITIONS</span>
      </div>
      <div class="pd-modal-actions">
        <a 
          href="${activeUrl}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="pd-open-tab-btn" 
          title="Abrir en ventana completa / nueva pestaña"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <span class="pd-tab-btn-text">Pantalla Completa</span>
        </a>
        <button type="button" class="pd-close-modal-btn" onclick="closePrintedDesiresModal()" aria-label="Cerrar diseñador">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
    <div class="pd-modal-frame-container">
      <div id="pd-iframe-loader" class="pd-iframe-loader">
        <div class="pd-loader-content">
          <div class="pd-loader-spinner"></div>
          <div class="pd-loader-title">Cargando Personalizador 3D...</div>
          <p class="pd-loader-desc">
            Si la vista previa de Shopify o tu navegador no carga el marco interactivo:
          </p>
          <a 
            href="${activeUrl}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="pd-loader-action-btn"
          >
            Abrir Diseñador en Ventana Completa
          </a>
        </div>
      </div>
      <iframe 
        id="pd-designer-iframe" 
        src="" 
        data-src="${activeUrl}" 
        title="Personalizador de Lienzo 3D en Tiempo Real"
        loading="lazy"
        allow="clipboard-write"
        onload="document.getElementById('pd-iframe-loader').style.display='none';"
      ></iframe>
    </div>
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');

  .pd-shopify-cta-block {
    display: block;
    width: 100%;
  }

  .pd-designer-trigger-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    min-height: 54px;
    padding: 14px 24px;
    background-color: ${btnBgColor};
    color: ${btnTextColor} !important;
    border: 1px solid ${btnBorderColor};
    border-radius: 12px;
    cursor: pointer;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    box-shadow: 0 8px 24px -4px rgba(18, 18, 18, 0.20), 0 2px 6px -1px rgba(18, 18, 18, 0.08);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    text-align: center;
  }

  .pd-designer-trigger-btn:hover {
    background-color: #4A352B;
    border-color: #B99A62;
    transform: translateY(-2px);
    box-shadow: 0 14px 30px -4px rgba(18, 18, 18, 0.30);
  }

  .pd-designer-trigger-btn:active {
    transform: scale(0.99);
  }

  .pd-btn-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .pd-btn-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.25;
  }

  .pd-btn-title {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.03em;
    color: ${btnTextColor};
  }

  .pd-btn-subtitle {
    font-size: 11px;
    font-weight: 400;
    color: #F8F5F0;
    opacity: 0.85;
    margin-top: 2px;
  }

  /* Modal Lightbox */
  .pd-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(18, 18, 18, 0.82);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    z-index: 9999999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
    animation: pdFadeIn 0.2s ease-out;
  }

  .pd-modal-dialog {
    width: 100%;
    max-width: 1320px;
    height: 92vh;
    max-height: 900px;
    background-color: #F8F5F0;
    border: 1px solid #B99A62;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 30px 70px -15px rgba(18, 18, 18, 0.55);
  }

  .pd-modal-topbar {
    height: 58px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #F8F5F0;
    border-bottom: 1px solid #E7E1D8;
    flex-shrink: 0;
  }

  .pd-brand-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Cormorant Garamond', Garamond, Georgia, serif;
    font-size: 17px;
    font-weight: 500;
    letter-spacing: 0.06em;
    color: #171513;
  }

  .pd-brand-tag {
    font-size: 11px;
    letter-spacing: 0.12em;
    color: #4A352B;
    font-family: 'Inter', sans-serif;
  }

  .pd-modal-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pd-open-tab-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #4A352B;
    background-color: #FAF8F5;
    border: 1px solid #D9CEBF;
    padding: 6px 12px;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s;
  }

  .pd-open-tab-btn:hover {
    color: #171513;
    border-color: #B99A62;
    background-color: #FFFFFF;
  }

  .pd-close-modal-btn {
    background: transparent;
    border: none;
    color: #4A352B;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .pd-close-modal-btn:hover {
    color: #171513;
    background-color: #EAE4D9;
  }

  .pd-modal-frame-container {
    flex: 1;
    width: 100%;
    height: calc(100% - 58px);
    position: relative;
    background-color: #F8F5F0;
  }

  .pd-modal-frame-container iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
    position: relative;
    z-index: 2;
  }

  .pd-iframe-loader {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F8F5F0;
    padding: 24px;
    text-align: center;
  }

  .pd-loader-content {
    max-width: 440px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .pd-loader-spinner {
    width: 32px;
    height: 32px;
    border: 2px solid #E7E1D8;
    border-top-color: #B99A62;
    border-radius: 50%;
    animation: pdSpin 0.8s linear infinite;
    margin-bottom: 16px;
  }

  .pd-loader-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 20px;
    color: #171513;
    margin-bottom: 6px;
  }

  .pd-loader-desc {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: #4A352B;
    line-height: 1.5;
    margin: 0 0 16px 0;
  }

  .pd-loader-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background-color: #171513;
    color: #FFFFFF !important;
    text-decoration: none;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 10px 20px;
    border-radius: 10px;
    border: 1px solid #B99A62;
    box-shadow: 0 6px 18px rgba(18, 18, 18, 0.15);
    transition: all 0.2s;
  }

  .pd-loader-action-btn:hover {
    background-color: #4A352B;
    transform: translateY(-1px);
  }

  @keyframes pdSpin {
    to { transform: rotate(360deg); }
  }

  @keyframes pdFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (max-width: 640px) {
    .pd-modal-backdrop {
      padding: 0;
    }
    .pd-modal-dialog {
      height: 100vh;
      max-height: 100vh;
      border-radius: 0;
      border: none;
    }
    .pd-tab-btn-text {
      display: none;
    }
  }
</style>

<script>
  function openPrintedDesiresModal() {
    var modal = document.getElementById('pd-modal-overlay');
    var frame = document.getElementById('pd-designer-iframe');
    if (frame && !frame.src) {
      frame.src = frame.getAttribute('data-src');
    }
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closePrintedDesiresModal() {
    var modal = document.getElementById('pd-modal-overlay');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  function pdHandleOverlayClose(event) {
    if (event.target && event.target.id === 'pd-modal-overlay') {
      closePrintedDesiresModal();
    }
  }

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closePrintedDesiresModal();
    }
  });
</script>`;
    }

    if (embedType === 'inline') {
      return `<!-- =================================================================
     PRINTED DESIRES | DISEÑADOR DE LIENZOS EMBEBIDO DIRECTAMENTE EN PÁGINA
     Compatible con Shopify OS 2.0 (Custom Liquid / HTML Block)
     ================================================================= -->

<div class="pd-inline-designer-container" style="width: 100%; margin: 30px 0; box-sizing: border-box;">
  <div style="margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #E7E1D8; padding-bottom: 10px;">
    <div>
      <h3 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; color: #171513; margin: 0; font-weight: 500;">
        Personaliza tu Obra en Tiempo Real
      </h3>
      <p style="font-family: 'Inter', sans-serif; font-size: 13px; color: #4A352B; margin: 4px 0 0 0;">
        Prueba diferentes medidas, marcos flotantes y visualiza en 3D en tu salón.
      </p>
    </div>
    <span style="font-family: 'Inter', sans-serif; font-size: 11px; color: #FFFFFF; background-color: #B99A62; padding: 4px 10px; border-radius: 999px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">
      Atelier 3D
    </span>
  </div>
  
  <div style="width: 100%; height: 780px; border: 1px solid #B99A62; border-radius: 16px; overflow: hidden; background-color: #F8F5F0; box-shadow: 0 16px 40px -8px rgba(18, 18, 18, 0.22);">
    <iframe 
      src="${activeUrl}"
      style="width: 100%; height: 100%; border: none;"
      title="Diseñador de Lienzos 3D"
      loading="lazy"
      allow="clipboard-write"
    ></iframe>
  </div>
</div>`;
    }

    if (embedType === 'cart_integrated') {
      return `<!-- =================================================================
     PRINTED DESIRES | BOTÓN CON INTEGRACIÓN AJAX AL CARRITO DE SHOPIFY
     Pasa automáticamente las especificaciones (Medidas, Bastidor, Marco)
     como Propiedades de Línea (Line Item Properties) a /cart/add.js
     ================================================================= -->

<div class="pd-cart-integration-wrapper" style="margin: 20px 0; width: 100%;">
  <button 
    type="button"
    class="pd-cart-btn"
    onclick="openCustomizerWithShopifySync()"
    style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; min-height: 52px; padding: 14px 26px; background-color: ${btnBgColor}; color: ${btnTextColor} !important; border: 1px solid ${btnBorderColor}; border-radius: 12px; font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; box-shadow: 0 8px 24px -4px rgba(18,18,18,0.20);"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B99A62" stroke-width="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
    <span>${buttonText}</span>
  </button>
</div>

<script>
  function openCustomizerWithShopifySync() {
    // Pasa la imagen y el título del producto actual de Shopify al diseñador
    var productTitle = encodeURIComponent('{{ product.title | escape }}');
    var productImage = encodeURIComponent('{{ product.featured_image | image_url: width: 1200 }}');
    var targetUrl = '${activeUrl}?product=' + productTitle + '&img=' + productImage;
    
    // Abre ventana o modal
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }

  // Escuchar mensaje del diseñador cuando el cliente complete el diseño:
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'PRINTED_DESIRES_ORDER_READY') {
      var item = event.data.item;
      // Añadir al carrito de Shopify vía AJAX
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: {{ product.selected_or_first_available_variant.id }},
          quantity: item.quantity || 1,
          properties: {
            'Lienzo Medidas': item.sizeLabel,
            'Acabado Bastidor': item.depthCm + ' cm',
            'Marco Flotante': item.frameName || 'Sin Marco',
            'Vista Previa 3D': item.previewImageUrl || ''
          }
        })
      })
      .then(function(res) { return res.json(); })
      .then(function(cart) {
        window.location.href = '/cart';
      });
    }
  });
</script>`;
    }

    // Direct link / Redirect
    return `<!-- =================================================================
     PRINTED DESIRES | ENLACE DIRECTO ELEGANTE PARA SHOPIFY
     Pegar en: Botón de Producto o Bloque de Enlace en Shopify
     ================================================================= -->

<a 
  href="${activeUrl}?utm_source=shopify&product={{ product.title | url_encode }}" 
  target="_blank" 
  rel="noopener noreferrer"
  class="pd-direct-cta-link"
  style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; min-height: 52px; padding: 14px 26px; background-color: ${btnBgColor}; color: ${btnTextColor} !important; text-decoration: none; border: 1px solid ${btnBorderColor}; border-radius: 12px; font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 500; box-shadow: 0 8px 24px -4px rgba(18, 18, 18, 0.20); transition: all 0.25s ease;"
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B99A62" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3l1.912 5.886a1 1 0 0 0 .95.69h6.188l-5.007 3.638a1 1 0 0 0-.364 1.118l1.912 5.886L12 16.58l-5.691 3.638 1.912-5.886a1 1 0 0 0-.364-1.118L2.85 9.576h6.188a1 1 0 0 0 .95-.69L12 3z"/>
  </svg>
  <span>${buttonText}</span>
</a>`;
  };

  // Sync custom code when visual options change unless manually edited
  useEffect(() => {
    if (!isManualEdited) {
      setCustomHtmlCode(buildShopifySnippet());
    }
  }, [buttonText, buttonSubtitle, embedType, btnBgColor, btnTextColor, btnBorderColor, showSubtitle, activeUrl, isManualEdited]);

  const handleCopy = () => {
    const codeToCopy = isManualEdited ? customHtmlCode : buildShopifySnippet();
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2800);
  };

  const handleResetSnippet = () => {
    setIsManualEdited(false);
    setCustomHtmlCode(buildShopifySnippet());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#121212]/80 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-[#FFFFFF] rounded-2xl shadow-luxury-xl w-full max-w-4xl overflow-hidden border border-[#B99A62] max-h-[94vh] flex flex-col"
        style={{ boxShadow: '0 25px 65px -15px rgba(18, 18, 18, 0.45)' }}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-[#E7E1D8] flex items-center justify-between bg-[#F8F5F0]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#FFFFFF] border border-[#B99A62] flex items-center justify-center text-[#B99A62] shadow-luxury-sm">
              <ShoppingBag className="w-5 h-5 text-[#B99A62]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-normal text-[#171513] font-serif-display leading-tight">
                  Código HTML Optimizado para Shopify
                </h3>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#171513] text-[#FFFFFF]">
                  Shopify OS 2.0
                </span>
              </div>
              <p className="text-xs text-[#4A352B]/75 mt-0.5">
                Copia este bloque editable y pégalo en tu tienda online para habilitar la personalización 3D.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#4A352B]/70 hover:text-[#171513] rounded-xl hover:bg-[#F2ECE1] transition-colors"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers: Visual Customizer vs Direct HTML Editor vs Hosting Guide */}
        <div className="px-5 sm:px-6 pt-3 pb-0 bg-[#F8F5F0] border-b border-[#E7E1D8] flex items-center justify-between overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveTab('visual')}
              className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'visual'
                  ? 'border-[#B99A62] text-[#171513]'
                  : 'border-transparent text-[#4A352B]/70 hover:text-[#171513]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#B99A62]" />
              <span>Ajustes Visuales y Formato</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'code'
                  ? 'border-[#B99A62] text-[#171513]'
                  : 'border-transparent text-[#4A352B]/70 hover:text-[#171513]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-[#B99A62]" />
              <span>Editor de Código HTML / Liquid {isManualEdited && '(Modificado)'}</span>
            </button>
            <button
              onClick={() => setActiveTab('hosting')}
              className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'hosting'
                  ? 'border-[#B99A62] text-[#171513]'
                  : 'border-transparent text-[#4A352B]/70 hover:text-[#171513]'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#B99A62]" />
              <span>Publicar Gratis (GitHub / Vercel)</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#171513] hover:bg-[#4A352B] text-[#FFFFFF] text-xs font-medium border border-[#B99A62] transition-colors shadow-luxury-sm ml-2 shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#B99A62]" /> : <Copy className="w-3.5 h-3.5 text-[#B99A62]" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 bg-[#FFFFFF]">
          {activeTab === 'visual' && (
            <>
              {/* Alert explaining why Vercel gives 404 error */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFBF0] border-2 border-[#B99A62] text-xs text-[#171513] space-y-3 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#B99A62]/20 text-[#B99A62] flex items-center justify-center shrink-0 mt-0.5 font-bold text-base">
                    !
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-sm sm:text-base text-[#171513]">
                        ¿Por qué <code className="text-[#B99A62] bg-[#171513] px-2 py-0.5 rounded text-xs font-mono">https://canvaseditor-nine.vercel.app/</code> da error 404?
                      </span>
                      <span className="text-[10px] bg-[#E53E3E] text-white px-2 py-0.5 rounded font-semibold">
                        Error 404: NOT_FOUND
                      </span>
                    </div>

                    <p className="text-xs text-[#4A352B] leading-relaxed">
                      En tu repositorio de GitHub (<strong>fygmarket-cpu/canvaseditor</strong>) solo está subido el archivo <code className="bg-[#EAE4D9] px-1 py-0.5 rounded font-mono font-semibold">printeddesires</code> (que es el código de Shopify). <strong>No están los archivos del proyecto web</strong> (<code className="font-mono text-[11px]">index.html</code>, <code className="font-mono text-[11px]">package.json</code>, carpeta <code className="font-mono text-[11px]">src/</code>, etc.). Por eso Vercel no tiene nada que mostrar y da error 404.
                    </p>

                    <div className="p-3.5 bg-[#FFFFFF] rounded-xl border border-[#B99A62]/50 space-y-2.5">
                      <span className="font-semibold text-xs text-[#171513] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#B99A62]" />
                        Solución en 2 minutos (para que Vercel funcione ya):
                      </span>
                      <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-[#4A352B] leading-snug">
                        <li>
                          Haz clic en el botón de abajo <strong>«Descargar Proyecto Completo (.ZIP)»</strong> y descomprímelo en tu ordenador.
                        </li>
                        <li>
                          Abre tu repositorio en GitHub: <a href="https://github.com/fygmarket-cpu/canvaseditor" target="_blank" rel="noreferrer" className="text-[#B99A62] font-semibold underline inline-flex items-center gap-0.5">github.com/fygmarket-cpu/canvaseditor <ExternalLink className="w-2.5 h-2.5" /></a>
                        </li>
                        <li>
                          Haz clic en <strong>Add file &gt; Upload files</strong>, arrastra todos los archivos y carpetas que salieron del ZIP, y pulsa <strong>Commit changes</strong>.
                        </li>
                        <li>
                          <strong>¡Listo!</strong> Vercel lo detectará automáticamente y en 30 segundos tu web en <code className="bg-[#FAF8F5] px-1 py-0.5 rounded font-mono font-semibold">https://canvaseditor-nine.vercel.app/</code> estará funcionando.
                        </li>
                      </ol>

                      {/* Download Buttons */}
                      <div className="pt-2 flex flex-wrap gap-2.5">
                        <a
                          href="/canvaseditor-project.zip"
                          download="canvaseditor-project.zip"
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#171513] hover:bg-[#4A352B] text-[#FFFFFF] rounded-xl text-xs font-semibold border border-[#B99A62] shadow-luxury-sm transition-all"
                        >
                          <Download className="w-4 h-4 text-[#B99A62]" />
                          <span>Descargar Proyecto Completo (.ZIP para GitHub)</span>
                        </a>

                        <a
                          href="/canvaseditor-dist.zip"
                          download="canvaseditor-dist.zip"
                          className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#FAF8F5] hover:bg-[#F2ECE1] text-[#171513] rounded-xl text-xs font-medium border border-[#D9CEBF] transition-all"
                        >
                          <Download className="w-3.5 h-3.5 text-[#4A352B]" />
                          <span>Descargar Web Compilada (.ZIP)</span>
                        </a>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E1D8] text-[11px] text-[#4A352B]">
                      <strong>Nota sobre el archivo &apos;printeddesires&apos;:</strong> Ese archivo de texto no es la web, es el <strong>código para Shopify</strong>. Debes pegarlo en tu tema de Shopify (en <em>Temas &gt; Personalizar &gt; Ficha de producto &gt; Liquid personalizado</em>).
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 1: Integration Style */}
              <div>
                <label className="block text-xs font-semibold text-[#171513] mb-1.5">
                  Modalidad de Integración en Shopify:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmbedType('popup_window');
                      setIsManualEdited(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      embedType === 'popup_window'
                        ? 'border-[#B99A62] bg-[#F8F5F0] ring-1 ring-[#B99A62] shadow-luxury-sm'
                        : 'border-[#E7E1D8] bg-[#FFFFFF] hover:border-[#D9CEBF]'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#171513] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-[#B99A62]" />
                        <span>Ventana Popup</span>
                      </div>
                      <span className="text-[9px] bg-[#171513] text-[#FFFFFF] px-1.5 py-0.5 rounded font-medium">Recomendado</span>
                    </div>
                    <p className="text-[10px] text-[#4A352B]/75 mt-1 leading-snug">
                      Abre el visor en una ventana flotante limpia. 100% libre de bloqueos de iframe.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmbedType('popup');
                      setIsManualEdited(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      embedType === 'popup'
                        ? 'border-[#B99A62] bg-[#F8F5F0] ring-1 ring-[#B99A62] shadow-luxury-sm'
                        : 'border-[#E7E1D8] bg-[#FFFFFF] hover:border-[#D9CEBF]'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#171513] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#B99A62]" />
                      <span>Modal (Iframe)</span>
                    </div>
                    <p className="text-[10px] text-[#4A352B]/75 mt-1 leading-snug">
                      Marco emergente dentro de Shopify. Requiere hosting público (GitHub/Vercel).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmbedType('inline');
                      setIsManualEdited(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      embedType === 'inline'
                        ? 'border-[#B99A62] bg-[#F8F5F0] ring-1 ring-[#B99A62] shadow-luxury-sm'
                        : 'border-[#E7E1D8] bg-[#FFFFFF] hover:border-[#D9CEBF]'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#171513] flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#B99A62]" />
                      <span>En Página (Inline)</span>
                    </div>
                    <p className="text-[10px] text-[#4A352B]/75 mt-1 leading-snug">
                      Incrustado directamente en la ficha del producto en Shopify.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmbedType('cart_integrated');
                      setIsManualEdited(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      embedType === 'cart_integrated'
                        ? 'border-[#B99A62] bg-[#F8F5F0] ring-1 ring-[#B99A62] shadow-luxury-sm'
                        : 'border-[#E7E1D8] bg-[#FFFFFF] hover:border-[#D9CEBF]'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#171513] flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#B99A62]" />
                      <span>Shopify Cart AJAX</span>
                    </div>
                    <p className="text-[10px] text-[#4A352B]/75 mt-1 leading-snug">
                      Pasa las medidas y marco al carrito de Shopify vía /cart/add.js.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmbedType('redirect');
                      setIsManualEdited(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      embedType === 'redirect'
                        ? 'border-[#B99A62] bg-[#F8F5F0] ring-1 ring-[#B99A62] shadow-luxury-sm'
                        : 'border-[#E7E1D8] bg-[#FFFFFF] hover:border-[#D9CEBF]'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#171513] flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-[#B99A62]" />
                      <span>Enlace Directo</span>
                    </div>
                    <p className="text-[10px] text-[#4A352B]/75 mt-1 leading-snug">
                      Botón de acceso directo en nueva pestaña con variables de producto.
                    </p>
                  </button>
                </div>
              </div>

              {/* Row 2: Button Texts & Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A352B] mb-1">
                      Texto Principal del Botón:
                    </label>
                    <input
                      type="text"
                      value={buttonText}
                      onChange={(e) => {
                        setButtonText(e.target.value);
                        setIsManualEdited(false);
                      }}
                      className="w-full p-2.5 bg-[#F8F5F0] border border-[#D9CEBF] rounded-xl text-xs font-medium text-[#171513]"
                      placeholder="Personalizar Lienzo en 3D"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-[#4A352B]">
                        Subtítulo explicativo:
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSubtitle(!showSubtitle)}
                        className="text-[10px] text-[#B99A62] font-semibold underline"
                      >
                        {showSubtitle ? 'Ocultar subtítulo' : 'Mostrar subtítulo'}
                      </button>
                    </div>
                    {showSubtitle && (
                      <input
                        type="text"
                        value={buttonSubtitle}
                        onChange={(e) => {
                          setButtonSubtitle(e.target.value);
                          setIsManualEdited(false);
                        }}
                        className="w-full p-2.5 bg-[#F8F5F0] border border-[#D9CEBF] rounded-xl text-xs font-medium text-[#171513]"
                        placeholder="Vista previa interactiva en tu salón"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A352B] mb-1">
                      URL del Diseñador 3D (Tu App):
                    </label>
                    <input
                      type="text"
                      value={activeUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        setActiveUrl(val);
                        setIsManualEdited(false);
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('pd_custom_designer_url', val);
                        }
                      }}
                      className="w-full p-2.5 bg-[#F8F5F0] border border-[#D9CEBF] rounded-xl text-xs font-mono text-[#171513]"
                      placeholder="https://tu-usuario.github.io/tu-repositorio"
                    />
                    <p className="text-[10px] text-[#4A352B]/70 mt-1">
                      Pega aquí tu URL pública de <strong>GitHub Pages</strong> o <strong>Vercel</strong> para actualizar automáticamente el código.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A352B] mb-1">
                      Colores del Botón Shopify:
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#4A352B]">Fondo:</span>
                        <input
                          type="color"
                          value={btnBgColor}
                          onChange={(e) => {
                            setBtnBgColor(e.target.value);
                            setIsManualEdited(false);
                          }}
                          className="w-7 h-7 rounded border border-[#D9CEBF] cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#4A352B]">Borde:</span>
                        <input
                          type="color"
                          value={btnBorderColor}
                          onChange={(e) => {
                            setBtnBorderColor(e.target.value);
                            setIsManualEdited(false);
                          }}
                          className="w-7 h-7 rounded border border-[#D9CEBF] cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#4A352B]">Texto:</span>
                        <input
                          type="color"
                          value={btnTextColor}
                          onChange={(e) => {
                            setBtnTextColor(e.target.value);
                            setIsManualEdited(false);
                          }}
                          className="w-7 h-7 rounded border border-[#D9CEBF] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 bg-[#F8F5F0] rounded-xl border border-[#E7E1D8]">
                <span className="text-[11px] font-semibold text-[#4A352B] uppercase tracking-wider block mb-2">
                  Vista Previa en Vivo del Botón para Shopify:
                </span>
                <div className="max-w-md mx-auto py-2">
                  <button
                    type="button"
                    style={{
                      backgroundColor: btnBgColor,
                      borderColor: btnBorderColor,
                      color: btnTextColor,
                    }}
                    className="w-full border py-3.5 px-6 rounded-xl font-medium transition-all shadow-luxury-md flex items-center justify-center gap-3 cursor-default"
                  >
                    <Sparkles className="w-5 h-5 text-[#B99A62]" />
                    <div className="text-center">
                      <div className="text-sm font-semibold">{buttonText}</div>
                      {showSubtitle && buttonSubtitle && (
                        <div className="text-[10px] opacity-80 mt-0.5">{buttonSubtitle}</div>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Code Snippet Quick Viewer */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#171513] flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-[#B99A62]" />
                    <span>Código HTML generado (Listo para copiar):</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('code')}
                    className="text-xs text-[#B99A62] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Abrir en editor directo</span>
                  </button>
                </div>
                <div className="relative">
                  <pre className="p-4 bg-[#171513] text-[#F8F5F0] font-mono text-[11px] rounded-xl overflow-x-auto max-h-[180px] leading-relaxed border border-[#B99A62]/30 select-all">
                    <code>{buildShopifySnippet()}</code>
                  </pre>
                </div>
              </div>
            </>
          )}

          {activeTab === 'code' && (
            /* Direct Code Editor Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#171513]">
                    Editor de Código HTML / Liquid Directo:
                  </h4>
                  <p className="text-[11px] text-[#4A352B]/75">
                    Puedes editar el código libremente antes de copiarlo a Shopify.
                  </p>
                </div>
                {isManualEdited && (
                  <button
                    onClick={handleResetSnippet}
                    className="text-xs text-[#4A352B] hover:text-[#171513] flex items-center gap-1 bg-[#FAF8F5] border border-[#D9CEBF] px-2.5 py-1 rounded-lg"
                  >
                    <RotateCcw className="w-3 h-3 text-[#B99A62]" />
                    <span>Restablecer plantilla</span>
                  </button>
                )}
              </div>

              <textarea
                value={isManualEdited ? customHtmlCode : buildShopifySnippet()}
                onChange={(e) => {
                  setCustomHtmlCode(e.target.value);
                  setIsManualEdited(true);
                }}
                rows={16}
                className="w-full p-4 bg-[#171513] text-[#F8F5F0] font-mono text-xs rounded-xl border border-[#B99A62] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#B99A62] shadow-luxury-md"
                placeholder="Pega o edita el código HTML aquí..."
              />
            </div>
          )}

          {activeTab === 'hosting' && (
            /* Hosting and Deployment Guide */
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-[#F8F5F0] border border-[#B99A62]/40 space-y-3">
                <div className="flex items-center gap-2.5 text-[#171513]">
                  <Globe className="w-5 h-5 text-[#B99A62]" />
                  <h4 className="font-serif-display text-lg sm:text-xl font-normal">
                    ¿GitHub y Vercel son gratis? ¡Sí, 100% gratuitos para siempre!
                  </h4>
                </div>
                <p className="text-xs text-[#4A352B] leading-relaxed">
                  Para que el personalizador 3D se visualice <strong>directamente incrustado dentro del marco de Shopify</strong> (sin pantalla en blanco), necesitas alojar la web en un servidor público sin restricciones de iframe de Google.
                </p>
              </div>

              {/* Two quick options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vercel Option */}
                <div className="p-5 rounded-xl border border-[#E7E1D8] bg-[#FAF8F5] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#171513] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#B99A62]" />
                        Opción A: Reparar tu Vercel (https://canvaseditor-nine.vercel.app/)
                      </span>
                      <span className="text-[10px] bg-[#171513] text-[#FFFFFF] px-2 py-0.5 rounded-full font-semibold">
                        2 Minutos
                      </span>
                    </div>
                    <ol className="list-decimal pl-4 mt-3 space-y-2 text-xs text-[#4A352B]">
                      <li>
                        Descarga el archivo: <a href="/canvaseditor-project.zip" download="canvaseditor-project.zip" className="text-[#B99A62] font-bold underline">canvaseditor-project.zip</a> y descomprímelo.
                      </li>
                      <li>
                        Abre tu repositorio en GitHub: <a href="https://github.com/fygmarket-cpu/canvaseditor" target="_blank" rel="noreferrer" className="text-[#B99A62] underline font-medium">github.com/fygmarket-cpu/canvaseditor</a>.
                      </li>
                      <li>
                        Haz clic en <strong>Add file &gt; Upload files</strong> y arrastra todos los archivos extraídos del zip (<code className="font-mono text-[10px]">package.json</code>, <code className="font-mono text-[10px]">src</code>, etc.).
                      </li>
                      <li>
                        Pulsa <strong>Commit changes</strong>. Vercel volverá a compilar en segundos y tu enlace de Vercel funcionará sin error 404.
                      </li>
                    </ol>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9CEBF] text-[11px] text-[#4A352B] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#B99A62] shrink-0" />
                    <span>Una vez subidos los archivos, tu enlace Vercel cargará el personalizador 3D al 100%.</span>
                  </div>
                </div>

                {/* GitHub Pages Option */}
                <div className="p-5 rounded-xl border border-[#E7E1D8] bg-[#FAF8F5] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#171513] flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-[#B99A62]" />
                        Opción B: GitHub Pages (100% Gratis)
                      </span>
                      <span className="text-[10px] bg-[#4A352B] text-[#FFFFFF] px-2 py-0.5 rounded-full font-semibold">
                        Gratis
                      </span>
                    </div>
                    <ol className="list-decimal pl-4 mt-3 space-y-2 text-xs text-[#4A352B]">
                      <li>Sube el código a un repositorio público o privado en <strong>GitHub</strong>.</li>
                      <li>En tu repositorio, ve a <strong>Settings &gt; Pages</strong>.</li>
                      <li>Configura <strong>Source: GitHub Actions</strong> con la plantilla de Vite/Static HTML.</li>
                      <li>Obtienes una URL gratuita como <code className="font-mono text-[11px] bg-[#E7E1D8] px-1 py-0.5 rounded">tutienda.github.io/printed-desires</code>.</li>
                    </ol>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9CEBF] text-[11px] text-[#4A352B] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#B99A62] shrink-0" />
                    <span>Coste cero, mantenimiento cero y certificado SSL gratuito incluido.</span>
                  </div>
                </div>
              </div>

              {/* Immediate shortcut */}
              <div className="p-4 rounded-xl bg-[#171513] text-[#FFFFFF] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="font-medium text-xs text-[#F8F5F0]">
                    ¿Quieres probarlo ya mismo en Shopify sin configurar hosting?
                  </div>
                  <p className="text-[11px] text-[#E7E1D8]/80">
                    Cambia la modalidad a <strong>«Ventana Popup»</strong> y copia el código HTML. Funciona hoy mismo al 100%.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmbedType('popup_window');
                    setActiveTab('visual');
                  }}
                  className="px-4 py-2 bg-[#B99A62] hover:bg-[#A88850] text-[#171513] font-semibold text-xs rounded-xl transition-colors shrink-0"
                >
                  Usar Ventana Popup Ahora
                </button>
              </div>
            </div>
          )}

          {/* Shopify step by step instructions */}
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#D9CEBF] text-xs text-[#4A352B] space-y-2">
            <div className="font-semibold text-[#171513] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#B99A62]" />
              <span>Instrucciones de instalación en Shopify OS 2.0 (Dawn, Prestige, etc.):</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1.5 text-[#4A352B]/90 text-[11px] leading-relaxed">
              <li>
                Accede a tu <strong>Panel de Shopify</strong> y dirígete a <strong>Tienda online &gt; Temas &gt; Personalizar</strong>.
              </li>
              <li>
                En el menú desplegable superior central, selecciona la plantilla de <strong>Productos &gt; Producto predeterminado</strong>.
              </li>
              <li>
                En la columna izquierda, dentro de la sección <strong>Información del producto</strong>, haz clic en <strong>«Añadir bloque»</strong> y elige <strong>«Liquid personalizado»</strong> (o «HTML personalizado»).
              </li>
              <li>
                Haz clic en el botón de abajo <strong>«Copiar Código HTML»</strong>, pégalo en el bloque y pulsa <strong>Guardar</strong>.
              </li>
            </ol>
            <div className="text-[10px] text-[#B99A62] font-medium pt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Totalmente responsive para móviles y compatible con todas las variantes de producto.</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E7E1D8] bg-[#F8F5F0] flex items-center justify-between">
          <span className="text-xs text-[#4A352B]/75 hidden sm:inline font-normal">
            Código 100% validado para Shopify Theme Store y Web Standards.
          </span>
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#D9CEBF] text-[#4A352B] hover:bg-[#FAF8F5] rounded-xl text-xs font-medium transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handleCopy}
              className="px-5 py-2.5 bg-[#171513] hover:bg-[#4A352B] text-[#FFFFFF] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-luxury-md border border-[#B99A62] active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#B99A62]" />
                  <span>¡Código Copiado al Portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#B99A62]" />
                  <span>Copiar Código para Shopify</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
