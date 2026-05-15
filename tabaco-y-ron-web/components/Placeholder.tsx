"use client";

import type { CSSProperties, ReactNode } from "react";
import { ambientUrl, productImg, productImgUrl, type ImgTag } from "@/lib/images";

type Variant = "" | "warm" | "smoke" | "crimson";

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
};

// Placeholder con fotografía temática (Unsplash) + tratamiento noir.
// `productMode`/`productImage` cambia a galería con imagen real de catálogo.
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
}: PlaceholderProps) {
  // Modo producto: imagen real, fondo cream, sin filtro noir
  if (productMode || productImage) {
    const imgName = productImage || productImg(seed || label || "default");
    return (
      <div className={`ph ph-product ${className}`} style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="ph-img-product"
          src={productImgUrl(imgName)}
          alt=""
          loading={eager ? "eager" : "lazy"}
        />
        {children}
      </div>
    );
  }

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
