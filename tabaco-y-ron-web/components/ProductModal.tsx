"use client";

import { useEffect, useState } from "react";
import { BRANDS, PRODUCTS, type Product } from "@/lib/data";
import Placeholder from "./Placeholder";
import { useSite } from "./SiteProvider";

export default function ProductModal() {
  const { product } = useSite();
  if (!product) return null;
  // La `key` remonta el contenido por pieza: cantidad y pestaña arrancan limpias.
  return <ModalContent key={product.id} product={product} />;
}

function ModalContent({ product }: { product: Product }) {
  const { closeProduct, addToCart, openProduct } = useSite();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "origin" | "paired">("desc");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProduct();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [closeProduct]);

  const brand = BRANDS.find((b) => b.id === product.brand)!;
  const related = PRODUCTS.filter((p) => p.brand === product.brand && p.id !== product.id).slice(
    0,
    3,
  );

  const specs: [string, string | number][] = [
    ["Vitola", product.vitola],
    ["Largo", product.length],
    ["Cepo", product.ring],
    ["Capa", product.wrapper],
    ["Intensidad", product.intensity],
    ["Cosecha", product.vintage || "En curso"],
  ];

  return (
    <div
      onClick={closeProduct}
      className="fixed inset-0 z-[100] flex justify-end"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", animation: "fadeIn 0.25s ease" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-screen w-screen max-w-screen overflow-y-auto border-l border-line bg-coal md:w-[720px]"
        style={{ animation: "slideInRight 0.35s cubic-bezier(.2,.7,.2,1)" }}
      >
        {/* Barra de cierre */}
        <div className="sticky top-0 z-[5] flex items-center justify-between border-b border-line bg-coal px-5 py-4 md:px-10 md:py-5">
          <div className="font-serif text-[13px] italic text-gold md:text-sm">
            {brand.name} <span className="text-muted">— {brand.origin}</span>
          </div>
          <button
            onClick={closeProduct}
            className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] text-cream-mute"
          >
            <span className="hidden md:inline">Cerrar</span>
            <span className="text-[22px] leading-none">✕</span>
          </button>
        </div>

        <div className="p-5 md:p-10">
          {/* Imagen principal */}
          <Placeholder
            seed={`tr-product-${product.id}-main`}
            productMode
            className="mb-6"
            style={{ aspectRatio: "5/4" }}
          >
            <div className="absolute left-[18px] top-[18px] z-[3] border border-gold bg-[rgba(255,255,255,0.85)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-coal">
              {product.intensity}
            </div>
          </Placeholder>

          {/* Miniaturas */}
          <div className="mb-8 grid grid-cols-4 gap-2">
            {["frontal", "anilla", "corte", "caja"].map((l, i) => {
              const img =
                l === "caja"
                  ? product.price > 60
                    ? "arturo-fuente-chateau"
                    : "arturo-fuente-flor-fina"
                  : "arturo-fuente-cuban-corona";
              return (
                <Placeholder
                  key={l}
                  productImage={img}
                  className="cursor-pointer"
                  style={{
                    aspectRatio: "1/1",
                    border: i === 0 ? "1px solid var(--color-gold)" : "1px solid transparent",
                  }}
                />
              );
            })}
          </div>

          {/* Título y precio */}
          <div className="eyebrow mb-3.5">— Pieza —</div>
          <h2 className="mb-3.5 text-4xl leading-none md:text-5xl">{product.name}</h2>
          <div className="mb-7 flex flex-wrap items-baseline gap-[18px] border-b border-line pb-7">
            <span className="font-serif text-[34px] text-gold md:text-[40px]">{product.price} €</span>
            <span className="text-xs uppercase tracking-[0.2em] text-cream-mute">
              por pieza · IVA incl.
            </span>
          </div>

          <p className="mb-7 font-serif text-lg italic leading-[1.5] text-cream md:text-[22px]">
            &ldquo;{product.note}&rdquo;
          </p>

          {/* Specs */}
          <div className="mb-8 grid grid-cols-1 gap-x-8 gap-y-3.5 md:grid-cols-2 md:gap-y-5">
            {specs.map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-line pb-3">
                <span className="text-[11px] uppercase tracking-[0.22em] text-muted">{k}</span>
                <span className="font-serif text-[15px] text-cream">{v}</span>
              </div>
            ))}
          </div>

          {/* Cantidad + añadir */}
          <div className="mb-10 flex flex-col gap-3 md:flex-row">
            <div className="flex items-center justify-between border border-gold md:justify-start">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-5 py-3.5 text-lg text-gold"
              >
                −
              </button>
              <span className="min-w-8 px-[18px] text-center font-serif text-lg text-cream">
                {qty}
              </span>
              <button onClick={() => setQty(qty + 1)} className="px-5 py-3.5 text-lg text-gold">
                +
              </button>
            </div>
            <button
              className="btn-tr solid flex-1 justify-center"
              onClick={() => {
                addToCart(product, qty);
                closeProduct();
              }}
            >
              Añadir · {(product.price * qty).toFixed(0)} €
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-5 flex gap-[18px] overflow-x-auto border-b border-line md:gap-7">
            {(
              [
                ["desc", "Descripción"],
                ["origin", "Origen"],
                ["paired", "Maridajes"],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className="whitespace-nowrap py-3 text-[11px] font-bold uppercase tracking-[0.22em]"
                style={{
                  color: tab === k ? "var(--color-gold)" : "var(--color-cream-mute)",
                  borderBottom:
                    tab === k ? "1px solid var(--color-gold)" : "1px solid transparent",
                  marginBottom: -1,
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="mb-10 text-[15px] leading-[1.75] text-cream-mute">
            {tab === "desc" && (
              <p>
                {product.name} es una pieza de la casa {brand.name}. {brand.blurb} Liada con capa{" "}
                {product.wrapper} y construcción {product.vitola.toLowerCase()}, ofrece una
                experiencia de intensidad {product.intensity.toLowerCase()} con un perfil aromático
                que invita a una sesión sin interrupciones.
              </p>
            )}
            {tab === "origin" && (
              <p>
                Procedencia: {brand.origin}. Casa fundada en {brand.founded}. {brand.blurb}{" "}
                Trabajamos directamente con la fábrica desde hace años; cada lote que recibimos
                viaja en bodega humidificada y se reposa en cava al menos quince días antes de salir
                a venta.
              </p>
            )}
            {tab === "paired" && (
              <ul className="m-0 flex list-disc flex-col gap-2.5 pl-5">
                <li>Ron añejo cubano, mínimo 12 años — perfil cremoso y caramelizado.</li>
                <li>Café espresso ligero, con un punto cítrico — limpia el paladar entre tercios.</li>
                <li>Agua sin gas, a temperatura ambiente — durante toda la sesión.</li>
                <li>Si lleva, un cuadrado de chocolate negro 85% al final del segundo tercio.</li>
              </ul>
            )}
          </div>

          {/* Relacionados */}
          <div className="eyebrow mb-[18px]">— De la misma casa —</div>
          <div className="grid grid-cols-3 gap-3">
            {related.map((r) => (
              <button key={r.id} onClick={() => openProduct(r)} className="cursor-pointer text-left">
                <Placeholder
                  seed={`tr-product-${r.id}`}
                  productMode
                  className="mb-2.5"
                  style={{ aspectRatio: "4/5" }}
                />
                <div className="font-serif text-sm leading-[1.25] text-cream">{r.name}</div>
                <div className="mt-1 text-[11px] text-gold">{r.price} €</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
