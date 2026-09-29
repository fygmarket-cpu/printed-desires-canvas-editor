import React, { useState } from 'react';
import {
  ShoppingBag,
  Sliders,
  ShieldCheck,
  Code2,
  ChevronDown,
  Palette,
} from 'lucide-react';

import { CurrencyConfig, StoreConfig } from '../types/canvas';
import { formatCurrency } from '../utils/canvasHelpers';
import { PrintedDesiresLogo } from './PrintedDesiresLogo';

import {
  MaterialId,
  MaterialConfig,
} from '../materialConfig';

/* ============================================================
   HEADER PROPS
   ============================================================ */

interface HeaderProps {
  cartCount: number;

  cartTotal: number;

  config: StoreConfig;

  selectedCurrency: CurrencyConfig;

  onCurrencyChange: (code: string) => void;

  onOpenCart: () => void;

  onOpenStoreEditor: () => void;

  onOpenShopify: () => void;

  onOpenHelp: () => void;

  /**
   * Material selected from the Wall Art menu.
   */
  onSelectMaterial?: (material: MaterialId) => void;
}

/* ============================================================
   MATERIAL MENU
   ============================================================ */

/**
 * Current materials available in the store.
 *
 * These are intentionally defined here as the current
 * selectable materials.
 *
 * Later this can be replaced entirely by an editable
 * material configuration from Store Settings.
 */
const WALL_ART_MATERIALS: MaterialId[] = [
  'canvas',
  'framed',
  'metal',
  'acrylic',
  'poster',
];

/**
 * Small commercial descriptions used inside the
 * Wall Art dropdown.
 *
 * The main MaterialConfig remains the source of truth
 * for the material itself.
 */
const MATERIAL_MENU_DESCRIPTIONS: Partial<
  Record<MaterialId, string>
> = {
  canvas: 'Fine-art canvas',

  framed: 'Elegant framed artwork',

  metal: 'Modern metal finish',

  acrylic: 'Luxury acrylic finish',

  poster: 'Premium art paper',
};

/* ============================================================
   COMPONENT
   ============================================================ */

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  config,
  selectedCurrency,
  onCurrencyChange,
  onOpenCart,
  onOpenStoreEditor,
  onOpenShopify,
  onOpenHelp,
  onSelectMaterial,
}) => {
  const [isWallArtOpen, setIsWallArtOpen] =
    useState(false);

  /* ==========================================================
     MATERIAL SELECTION
     ========================================================== */

  const handleMaterialSelect = (
    material: MaterialId
  ) => {
    setIsWallArtOpen(false);

    if (onSelectMaterial) {
      onSelectMaterial(material);
    }
  };

  /* ==========================================================
     CREATE YOUR ART
     ========================================================== */

  const handleCreateYourArt = () => {
    setIsWallArtOpen(false);

    if (onSelectMaterial) {
      onSelectMaterial('canvas');
    }
  };

  /* ==========================================================
     MATERIAL CONFIGURATION
     ========================================================== */

  /**
   * Build the Wall Art menu dynamically from the
   * current material configuration.
   *
   * At the moment WALL_ART_MATERIALS controls which
   * materials are visible.
   *
   * Later this can be replaced by an editable
   * visibleInMenu / enabled property.
   */
  const visibleMaterials: MaterialConfig[] =
    WALL_ART_MATERIALS
      .map(
        (materialId) =>
          materialConfigs[materialId]
      )
      .filter(
        (
          material
        ): material is MaterialConfig =>
          Boolean(material)
      );

  return (
    <header
      className="
        sticky
        top-0
        z-40
        bg-[#F8F5F0]/95
        backdrop-blur-md
        border-b
        border-[#E7E1D8]
        shadow-luxury-sm
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          min-h-20
          flex
          items-center
          justify-between
          gap-4
        "
      >

        {/* ======================================================
            BRAND
        ====================================================== */}

        <div className="flex items-center flex-shrink-0">

          <a
            href="#"
            className="flex items-center py-1 group"
            aria-label="Printed Desires Home"
          >
            <PrintedDesiresLogo size="md" />
          </a>

        </div>

        {/* ======================================================
            NAVIGATION
        ====================================================== */}

        <nav
          className="
            hidden
            md:flex
            items-center
            gap-5
            lg:gap-7
            text-sm
            font-medium
            text-[#4A352B]
          "
        >

          {/* ====================================================
              WALL ART DROPDOWN
          ==================================================== */}

          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setIsWallArtOpen(
                  (previous) =>
                    !previous
                )
              }
              className="
                flex
                items-center
                gap-1.5
                text-xs
                font-semibold
                tracking-wide
                text-[#4A352B]
                hover:text-[#171513]
                transition-colors
              "
              aria-haspopup="menu"
              aria-expanded={
                isWallArtOpen
              }
            >

              <span>
                Wall Art
              </span>

              <ChevronDown
                className={`
                  w-3.5
                  h-3.5
                  transition-transform
                  ${
                    isWallArtOpen
                      ? 'rotate-180'
                      : ''
                  }
                `}
              />

            </button>

            {/* ==================================================
                WALL ART MENU
            ================================================== */}

            {isWallArtOpen && (
              <div
                className="
                  absolute
                  left-0
                  top-full
                  mt-3
                  w-60
                  bg-[#FFFFFF]
                  border
                  border-[#E7E1D8]
                  rounded-xl
                  shadow-xl
                  overflow-hidden
                "
                role="menu"
              >

                {/* ------------------------------------------------
                    MENU HEADER
                ------------------------------------------------ */}

                <div
                  className="
                    px-4
                    py-3
                    border-b
                    border-[#EEE8DF]
                  "
                >

                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      font-semibold
                      text-[#B99A62]
                    "
                  >
                    Create Your Art
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-[#6B625B]
                    "
                  >
                    Choose your wall art finish
                  </p>

                </div>

                {/* ------------------------------------------------
                    DYNAMIC MATERIALS
                ------------------------------------------------ */}

                {visibleMaterials.map(
                  (material) => {
                    const materialId =
                      material.id;

                    const menuDescription =
                      MATERIAL_MENU_DESCRIPTIONS[
                        materialId
                      ];

                    return (
                      <button
                        key={materialId}
                        type="button"
                        onClick={() =>
                          handleMaterialSelect(
                            materialId
                          )
                        }
                        className="
                          w-full
                          text-left
                          px-4
                          py-3
                          text-sm
                          text-[#4A352B]
                          hover:bg-[#F8F5F0]
                          hover:text-[#171513]
                          transition-colors
                        "
                        role="menuitem"
                      >

                        <span
                          className="
                            font-medium
                          "
                        >
                          {
                            material.displayName
                          }
                        </span>

                        <span
                          className="
                            block
                            text-[11px]
                            text-[#8A8179]
                            mt-0.5
                          "
                        >
                          {
                            menuDescription ||
                            material.description
                          }
                        </span>

                      </button>
                    );
                  }
                )}

                {/* ------------------------------------------------
                    EMPTY STATE
                ------------------------------------------------ */}

                {visibleMaterials.length ===
                  0 && (
                    <div
                      className="
                        px-4
                        py-4
                        text-xs
                        text-[#8A8179]
                      "
                    >
                      No wall art materials
                      available.
                    </div>
                  )}

              </div>
            )}

          </div>

          {/* ====================================================
              CREATE YOUR ART
          ==================================================== */}

          <button
            type="button"
            onClick={
              handleCreateYourArt
            }
            className="
              flex
              items-center
              gap-1.5
              text-xs
              font-semibold
              tracking-wide
              text-[#4A352B]
              hover:text-[#171513]
              transition-colors
            "
          >

            <Palette
              className="
                w-3.5
                h-3.5
                text-[#B99A62]
              "
            />

            <span>
              Create Your Art
            </span>

          </button>

          {/* ====================================================
              QUALITY
          ==================================================== */}

          <button
            type="button"
            onClick={onOpenHelp}
            className="
              flex
              items-center
              gap-1.5
              hover:text-[#171513]
              transition-colors
              text-xs
              font-semibold
              text-[#4A352B]
            "
          >

            <ShieldCheck
              className="
                w-4
                h-4
                text-[#B99A62]
              "
            />

            <span>
              Garantía de Calidad 100%
            </span>

          </button>

        </nav>

        {/* ======================================================
            ACTIONS
        ====================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            sm:gap-2.5
            flex-shrink-0
          "
        >

          {/* ====================================================
              SHOPIFY HTML CODE
          ==================================================== */}

          <button
            type="button"
            onClick={
              onOpenShopify
            }
            className="
              flex
              items-center
              gap-1.5
              px-3
              py-2
              text-xs
              font-semibold
              bg-[#FFFFFF]
              hover:bg-[#171513]
              text-[#171513]
              hover:text-[#FFFFFF]
              rounded-lg
              border
              border-[#B99A62]
              transition-all
              shadow-luxury-sm
              active:scale-95
              group
            "
            title="
              Obtener botón y código HTML
              optimizado para Shopify
            "
          >

            <Code2
              className="
                w-3.5
                h-3.5
                text-[#B99A62]
                group-hover:scale-110
                transition-transform
              "
            />

            <span
              className="
                hidden
                sm:inline
              "
            >
              Código Shopify
            </span>

            <span
              className="
                sm:hidden
              "
            >
              Shopify
            </span>

          </button>

          {/* ====================================================
              STORE CONFIGURATION
          ==================================================== */}

          <button
            type="button"
            onClick={
              onOpenStoreEditor
            }
            className="
              flex
              items-center
              gap-1.5
              px-3
              py-2
              text-xs
              font-semibold
              bg-[#FFFFFF]
              hover:bg-[#F2ECE1]
              text-[#171513]
              rounded-lg
              border
              border-[#D9CEBF]
              transition-all
              shadow-luxury-sm
              active:scale-95
            "
            title="
              Editar textos, precios,
              colores, secciones y monedas
            "
          >

            <Sliders
              className="
                w-3.5
                h-3.5
                text-[#B99A62]
              "
            />

            <span
              className="
                hidden
                sm:inline
              "
            >
              Configuración
            </span>

            <span
              className="
                sm:hidden
              "
            >
              Ajustes
            </span>

          </button>

          {/* ====================================================
              CURRENCY
          ==================================================== */}

          <div
            className="
              flex
              items-center
              border
              border-[#D9CEBF]
              rounded-lg
              p-0.5
              bg-[#FFFFFF]
              text-xs
              font-semibold
              text-[#171513]
              shadow-luxury-sm
            "
          >

            {config.currencies.map(
              (curr) => {

                const isSelected =
                  selectedCurrency.code ===
                  curr.code;

                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() =>
                      onCurrencyChange(
                        curr.code
                      )
                    }
                    className={`
                      px-2.5
                      py-1
                      rounded
                      transition-colors
                      ${
                        isSelected
                          ? 'bg-[#171513] text-[#FFFFFF] font-bold'
                          : 'text-[#4A352B] hover:text-[#171513]'
                      }
                    `}
                    title={`
                      ${curr.label}
                      - Tasa: ${curr.rate}
                    `}
                  >
                    {
                      curr.symbol
                    }
                  </button>
                );
              }
            )}

          </div>

          {/* ====================================================
              CART
          ==================================================== */}

          <button
            type="button"
            onClick={
              onOpenCart
            }
            className="
              relative
              flex
              items-center
              gap-2
              text-[#FFFFFF]
              px-4
              py-2.5
              rounded-lg
              font-medium
              text-xs
              sm:text-sm
              transition-all
              shadow-luxury-md
              active:scale-95
              hover:opacity-95
            "
            style={{
              backgroundColor:
                '#171513',
            }}
            aria-label="Ver cesta"
          >

            <ShoppingBag
              className="
                w-4
                h-4
                text-[#B99A62]
              "
            />

            <span
              className="
                hidden
                sm:inline
                font-medium
              "
            >
              Cesta
            </span>

            {/* ------------------------------------------------
                CART COUNT
            ------------------------------------------------ */}

            {cartCount > 0 && (
              <span
                className="
                  bg-[#B99A62]
                  text-[#FFFFFF]
                  font-bold
                  text-xs
                  w-5
                  h-5
                  rounded-full
                  flex
                  items-center
                  justify-center
                  shadow-xs
                "
              >
                {cartCount}
              </span>
            )}

            {/* ------------------------------------------------
                CART TOTAL
            ------------------------------------------------ */}

            {cartTotal > 0 && (
              <span
                className="
                  hidden
                  md:inline
                  border-l
                  border-white/20
                  pl-2
                  font-mono
                  tabular-nums
                  text-xs
                  text-[#F8F5F0]
                "
              >
                {formatCurrency(
                  cartTotal,
                  selectedCurrency
                )}
              </span>
            )}

          </button>

        </div>

      </div>
    </header>
  );
};
