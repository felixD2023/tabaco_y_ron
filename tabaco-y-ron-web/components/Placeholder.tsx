"use client";

import type { CSSProperties, ReactNode } from "react";
import { ambientUrl, productImg, productImgUrl, type ImgTag } from "@/lib/images";

type Variant = "" | "warm" | "smoke" | "crimson" | "dark";

type PlaceholderProps = {
  label?: string;
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  seed?: string;
  tag?: ImgTag;
  noPhoto?: boolean;
  eager?: boolean;
  w?: number;
  productMode?: boolean;
  productImage?: string;
  glyph?: string;
};

/**
 * Placeholder con fotografía temática + tratamiento noir sobre gradiente
 * acero (paleta Mármol & Oro · manual 2025). Modos:
 *  - default: imagen ambiente sobre gradiente acero `#5C5C66 → #2A2A2E`.
 *  - productMode + productImage: imagen real de catálogo sobre fondo cream.
 *  - productMode (sin imagen): glyph serif italic centrado como pieza editorial.
 */
export default function Placeholder({
  label,
  variant = "",
  className = "",
  style,
  children,
  seed,
  tag,
  noPhoto = false,
  eager = false,
  w = 1200,
  productMode = false,
  productImage,
  glyph,
}: PlaceholderProps) {
  // Modo producto con imagen real (fondo cream, sin filtro noir)
  if (productImage) {
    return (
      <div className={`ph ph-product ${className}`} style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="ph-img-product"
          src={productImgUrl(productImage)}
          alt=""
          loading={eager ? "eager" : "lazy"}
        />
        {children}
      </div>
    );
  }

  // Modo producto sin imagen — glyph editorial sobre cream
  if (productMode) {
    return (
      <div className={`ph ph-product ${className}`} style={style}>
        <span className="ph-glyph">{glyph || "⁘"}</span>
        {children}
      </div>
    );
  }

  // Modo ambiente — imagen temática con tratamiento noir cálido
  const derivedSeed =
    seed !== undefined
      ? seed
      : label
        ? `tr-${String(label).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50)}`
        : `tr-${tag || "default"}`;
  const showPhoto = !noPhoto;
  const src = showPhoto ? ambientUrl(String(derivedSeed), tag, w) : null;

  return (
    <div className={`ph ${variant} ${className}`} style={style}>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="ph-img"
          src={src}
          alt=""
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
      {showPhoto && <div className="ph-overlay" />}
      {children}
      {label && <span className="ph-label">{label}</span>}
    </div>
  );
}
