"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import marcaPlaceholder from "@/assets/images/empatia.png";
import { Chip } from "@/components/ui";
import useMarcasService from "@/hooks/use-marcas-service";
import useProductosService from "@/hooks/use-productos-service";
import type {
  Fortaleza,
  Marca,
  Producto,
  ProductoSort,
  ProductosListParams,
} from "@/types/api";

const FORTALEZA_OPTIONS: ReadonlyArray<{ value: Fortaleza; label: string }> = [
  { value: "suave", label: "Suave" },
  { value: "suave_medio", label: "Suave-Medio" },
  { value: "medio", label: "Medio" },
  { value: "medio_fuerte", label: "Medio-Fuerte" },
  { value: "fuerte", label: "Fuerte" },
];

const SORT_OPTIONS: ReadonlyArray<{ value: ProductoSort; label: string }> = [
  { value: "name", label: "Nombre A–Z" },
  { value: "precio_asc", label: "Precio ↑" },
  { value: "precio_desc", label: "Precio ↓" },
  { value: "rating_desc", label: "Rating ↓" },
];

const PAGE_SIZE = 24;
const PRECIO_MAX_BOUND = 500;

type Filters = {
  page: number;
  sort: ProductoSort;
  q: string;
  marcaIds: number[];
  subcategoriaIds: number[];
  fortalezas: Fortaleza[];
  precioMin: number | null;
  precioMax: number | null;
  soloExistentes: boolean;
  view: "grid" | "list";
};

const DEFAULT_FILTERS: Filters = {
  page: 1,
  sort: "name",
  q: "",
  marcaIds: [],
  subcategoriaIds: [],
  fortalezas: [],
  precioMin: null,
  precioMax: null,
  soloExistentes: false,
  view: "grid",
};

function parseFilters(sp: URLSearchParams): Filters {
  const ints = (k: string) =>
    sp.getAll(k).map((v) => Number(v)).filter((n) => Number.isFinite(n) && n > 0);
  const num = (k: string) => {
    const v = sp.get(k);
    if (v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  return {
    page: Math.max(1, num("page") ?? 1),
    sort: (SORT_OPTIONS.find((o) => o.value === sp.get("sort"))?.value ?? "name") as ProductoSort,
    q: sp.get("q") ?? "",
    marcaIds: ints("marca_id"),
    subcategoriaIds: ints("subcategoria_id"),
    fortalezas: sp
      .getAll("fortaleza")
      .filter((v): v is Fortaleza => FORTALEZA_OPTIONS.some((o) => o.value === v)),
    precioMin: num("precio_min"),
    precioMax: num("precio_max"),
    soloExistentes: sp.get("solo_existentes") === "1",
    view: sp.get("view") === "list" ? "list" : "grid",
  };
}

function filtersToSearchString(f: Filters): string {
  const sp = new URLSearchParams();
  if (f.page > 1) sp.set("page", String(f.page));
  if (f.sort !== "name") sp.set("sort", f.sort);
  if (f.q.trim()) sp.set("q", f.q.trim());
  f.marcaIds.forEach((id) => sp.append("marca_id", String(id)));
  f.subcategoriaIds.forEach((id) => sp.append("subcategoria_id", String(id)));
  f.fortalezas.forEach((v) => sp.append("fortaleza", v));
  if (f.precioMin != null) sp.set("precio_min", String(f.precioMin));
  if (f.precioMax != null) sp.set("precio_max", String(f.precioMax));
  if (f.soloExistentes) sp.set("solo_existentes", "1");
  if (f.view === "list") sp.set("view", "list");
  const s = sp.toString();
  return s ? `?${s}` : "";
}

function filtersToApiParams(f: Filters): ProductosListParams {
  return {
    page: f.page,
    page_size: PAGE_SIZE,
    sort: f.sort,
    q: f.q.trim() || undefined,
    marca_id: f.marcaIds.length ? f.marcaIds : undefined,
    subcategoria_id: f.subcategoriaIds.length ? f.subcategoriaIds : undefined,
    fortaleza: f.fortalezas.length ? f.fortalezas : undefined,
    precio_min: f.precioMin ?? undefined,
    precio_max: f.precioMax ?? undefined,
    solo_existentes: f.soloExistentes || undefined,
  };
}

function activeCount(f: Filters): number {
  return (
    f.marcaIds.length +
    f.subcategoriaIds.length +
    f.fortalezas.length +
    (f.precioMin != null || f.precioMax != null ? 1 : 0) +
    (f.soloExistentes ? 1 : 0) +
    (f.q.trim() ? 1 : 0)
  );
}

function precioInfo(p: Producto) {
  const num = (v?: string | null) => {
    if (v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  // Un formato no disponible (flag en false) no muestra su precio. Si el flag
  // viene undefined (API antigua) se asume disponible.
  const dispCaja = p.disponible_caja !== false;
  const dispInd = p.disponible_individual !== false;
  return {
    caja: dispCaja ? num(p.precio_caja) : null,
    cajaDesc: num(p.precio_descuento_caja),
    ind: dispInd ? num(p.precio_individual) : null,
    indDesc: num(p.precio_descuento_individual),
  };
}

/**
 * Una línea de precio: etiqueta ("Caja"/"Unidad"), precio tachado si hay
 * rebaja, precio final y badge con el % de descuento. `emphasis` la pinta
 * más grande y en dorado (se reserva para el precio principal).
 */
function PriceLine({
  label,
  base,
  desc,
  emphasis = false,
  size = "card",
}: {
  label: string;
  base: number;
  desc: number | null;
  emphasis?: boolean;
  size?: "card" | "row";
}) {
  const hasDesc = desc != null && desc > 0 && desc < base;
  const final = hasDesc ? desc! : base;
  const pct = hasDesc ? Math.round((1 - final / base) * 100) : 0;
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="text-[10px] uppercase tracking-[0.16em] text-cream-mute">{label}</span>
      {hasDesc && (
        <span
          className={`text-cream-mute line-through opacity-55 ${
            size === "row" ? "text-[13px]" : "text-[12px]"
          }`}
        >
          ${base.toFixed(2)}
        </span>
      )}
      <span
        className={`font-serif tabular-nums ${
          emphasis
            ? `text-gold ${size === "row" ? "text-[16px]" : "text-[15px]"}`
            : `text-cream ${size === "row" ? "text-[14px]" : "text-[13px]"}`
        }`}
      >
        ${final.toFixed(2)}
      </span>
      {hasDesc && pct > 0 && (
        <span className="rounded-sm bg-gold/15 px-1 py-px text-[9px] font-bold uppercase tracking-wide text-gold">
          −{pct}%
        </span>
      )}
    </div>
  );
}

/**
 * Bloque de precios del catálogo: caja primero (énfasis), unidad debajo.
 * Si solo existe uno, ese toma el énfasis. Sin precios → "Bajo consulta".
 */
function PriceBlock({ p, size = "card" }: { p: Producto; size?: "card" | "row" }) {
  const { caja, cajaDesc, ind, indDesc } = precioInfo(p);
  if (caja == null && ind == null) {
    return (
      <span className="text-[11px] uppercase tracking-[0.18em] text-cream-mute">
        Bajo consulta
      </span>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      {caja != null && (
        <PriceLine label="Caja" base={caja} desc={cajaDesc} emphasis size={size} />
      )}
      {ind != null && (
        <PriceLine label="Unidad" base={ind} desc={indDesc} emphasis={caja == null} size={size} />
      )}
    </div>
  );
}

/** Fila de precio para el drawer de detalle: etiqueta, precio tachado si hay
 *  rebaja, precio final grande en dorado y badge con el % de descuento. */
function DetailPriceRow({
  label,
  base,
  desc,
}: {
  label: string;
  base: number;
  desc: number | null;
}) {
  const hasDesc = desc != null && desc > 0 && desc < base;
  const final = hasDesc ? desc! : base;
  const pct = hasDesc ? Math.round((1 - final / base) * 100) : 0;
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
      <span className="text-[10px] uppercase tracking-[0.22em] text-cream-mute">{label}</span>
      <div className="flex items-baseline gap-2.5">
        {hasDesc && (
          <span className="font-serif text-[16px] text-cream-mute line-through opacity-55">
            ${base.toFixed(2)}
          </span>
        )}
        <span className="font-serif text-[26px] leading-none text-gold tabular-nums">
          ${final.toFixed(2)}
        </span>
        {hasDesc && pct > 0 && (
          <span className="rounded-sm bg-gold/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold">
            −{pct}%
          </span>
        )}
      </div>
    </div>
  );
}

function fortalezaLabel(f: Fortaleza | null | undefined): string | null {
  if (!f) return null;
  return FORTALEZA_OPTIONS.find((o) => o.value === f)?.label ?? null;
}

function ProductCard({
  p,
  marca,
  onClick,
}: {
  p: Producto;
  marca?: Marca;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col text-left transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
    >
      <div className="card-product-bg relative aspect-square overflow-hidden">
        {p.imagen ? (
          <Image
            src={p.imagen}
            alt={p.nombre}
            fill
            sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, (max-width:1280px) 25vw, 20vw"
            className="z-[2] object-contain drop-shadow-[0_18px_28px_rgba(40,20,10,0.28)] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-2 text-coal/40"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <rect x="3" y="5" width="18" height="14" rx="1" />
              <circle cx="8.5" cy="10.5" r="1.5" />
              <path d="m21 16-5-5L8 19" />
            </svg>
            <span className="text-[9px] uppercase tracking-[0.28em]">Imagen no disponible</span>
          </div>
        )}
      </div>
      <div className="pt-3">
        {marca && (
          <div className="mb-1 font-serif text-[11px] italic text-gold">{marca.nombre}</div>
        )}
        <div className="line-clamp-2 font-serif text-[14px] leading-[1.25] text-cream">
          {p.nombre}
        </div>
        <div className="mt-2">
          <PriceBlock p={p} />
        </div>
      </div>
    </button>
  );
}

function ProductRow({
  p,
  marca,
  onClick,
}: {
  p: Producto;
  marca?: Marca;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid items-center gap-6 bg-coal px-6 py-4 text-left transition-colors hover:bg-coal-soft"
      style={{ gridTemplateColumns: "100px 1fr 1fr 160px" }}
    >
      <div className="relative" style={{ width: 80, height: 64 }}>
        {p.imagen ? (
          <Image src={p.imagen} alt={p.nombre} fill className="object-cover" sizes="80px" />
        ) : (
          <Image src={marcaPlaceholder} alt="" aria-hidden fill className="object-cover opacity-50" sizes="80px" />
        )}
      </div>
      <div>
        {marca && <div className="font-serif text-[11px] italic text-gold">{marca.nombre}</div>}
        <div className="mt-0.5 font-serif text-base">{p.nombre}</div>
      </div>
      <div className="text-[11px] uppercase tracking-[0.18em] text-cream-mute">
        {fortalezaLabel(p.fortaleza) ?? "—"}
      </div>
      <PriceBlock p={p} size="row" />
    </button>
  );
}

function AttrRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line py-3">
      <dt className="text-[10px] uppercase tracking-[0.22em] text-cream-mute">{label}</dt>
      <dd className="text-right text-[13px] text-cream">{value}</dd>
    </div>
  );
}

type GallerySlot = {
  url: string | null;
  tipo: string; // 'caja' | 'tabaco_suelto' | 'detalle' | 'vacio'
};

function ProductDetailDrawer({
  p,
  marca,
  onClose,
}: {
  p: Producto;
  marca?: Marca;
  onClose: () => void;
}) {
  // Solo monta el portal cuando estamos en cliente.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Galería: 1 slot principal (la caja, o la única imagen si no hay caja) + 3 thumbs.
  // El primer thumb es la imagen tipo 'tabaco_suelto' si existe; los demás son
  // placeholders (rellenan visualmente, se completarán más adelante).
  const slots: GallerySlot[] = useMemo(() => {
    const main: GallerySlot = { url: p.imagen ?? null, tipo: "caja" };
    const galleryItems = (p.imagenes ?? [])
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .slice(0, 3)
      .map<GallerySlot>((img) => ({ url: img.url, tipo: img.tipo }));
    const padded = [
      ...galleryItems,
      ...Array.from({ length: Math.max(0, 3 - galleryItems.length) }).map<GallerySlot>(() => ({
        url: null,
        tipo: "vacio",
      })),
    ];
    return [main, ...padded];
  }, [p.imagen, p.imagenes]);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = slots[selectedIdx];

  const intensity = fortalezaLabel(p.fortaleza);
  // Un formato no disponible no muestra su precio (coherente con la card).
  const caja = p.disponible_caja !== false && p.precio_caja ? Number(p.precio_caja) : null;
  const ind =
    p.disponible_individual !== false && p.precio_individual ? Number(p.precio_individual) : null;
  const descCaja = p.precio_descuento_caja ? Number(p.precio_descuento_caja) : null;
  const descInd = p.precio_descuento_individual ? Number(p.precio_descuento_individual) : null;
  const hayPrecio = caja != null || ind != null;
  const subcatNombre =
    marca?.subcategorias.find((s) => s.id === p.subcategoria_id)?.nombre ?? null;

  // Construimos las filas dinámicamente: solo las que tienen valor en la BD.
  const attrs: { label: string; value: string | number }[] = [];
  if (subcatNombre) attrs.push({ label: "Línea", value: subcatNombre });
  if (p.vitola) attrs.push({ label: "Vitola", value: p.vitola });
  if (p.largo_mm != null) attrs.push({ label: "Largo", value: `${p.largo_mm} mm` });
  if (p.cepo != null) attrs.push({ label: "Cepo", value: p.cepo });
  if (intensity) attrs.push({ label: "Fortaleza", value: intensity });
  if (p.tiempo_fumado)
    attrs.push({ label: "Tiempo de fumada", value: `${p.tiempo_fumado} minutos` });
  if (p.unidades_por_caja != null)
    attrs.push({ label: "Unidades por caja", value: p.unidades_por_caja });
  if (p.rating != null) attrs.push({ label: "Valoración", value: `${p.rating.toFixed(1)} / 5` });
  attrs.push({ label: "Existencia", value: p.existencia ? "En stock" : "Sin stock" });

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="anim-fade-in fixed inset-0 z-[80]"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
        aria-hidden
      />
      {/* Drawer — viewport completo */}
      <aside
        className="anim-slide-up fixed inset-y-0 right-0 z-[90] flex w-full max-w-[520px] flex-col border-l border-line bg-coal"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de ${p.nombre}`}
      >
        {/* Header sticky */}
        <div className="flex shrink-0 items-center justify-between border-b border-line bg-coal px-6 py-4">
          {marca ? (
            <span className="font-serif text-[14px] italic text-gold">{marca.nombre}</span>
          ) : (
            <span />
          )}
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-cream-mute transition-colors hover:text-gold"
            aria-label="Cerrar"
          >
            Cerrar
            <span aria-hidden className="text-base leading-none">
              ✕
            </span>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-6 py-7 md:px-8">
            {/* Galería: imagen principal grande */}
            <div
              className="card-product-bg relative mb-3 flex items-center justify-center overflow-hidden border border-line"
              style={{ height: 320 }}
            >
              {active.url ? (
                <Image
                  src={active.url}
                  alt={p.nombre}
                  fill
                  sizes="(max-width:768px) 100vw, 520px"
                  className="relative z-[2] object-contain p-4 drop-shadow-[0_18px_28px_rgba(40,20,10,0.28)]"
                  key={active.url}
                />
              ) : (
                <div className="relative z-[2] flex flex-col items-center gap-3 text-coal/45">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <rect x="3" y="5" width="18" height="14" rx="1" />
                    <circle cx="8.5" cy="10.5" r="1.5" />
                    <path d="m21 16-5-5L8 19" />
                  </svg>
                  <span className="text-[10px] uppercase tracking-[0.32em]">
                    Imagen no disponible
                  </span>
                </div>
              )}
            </div>

            {/* Galería: thumbnails */}
            <div className="mb-8 grid grid-cols-4 gap-2">
              {slots.map((s, i) => {
                const isActive = i === selectedIdx;
                const isEmpty = s.tipo === "vacio";
                const title =
                  s.tipo === "caja"
                    ? "Caja"
                    : s.tipo === "tabaco_suelto"
                      ? "Tabaco suelto"
                      : isEmpty
                        ? "Próximamente"
                        : "Detalle";
                return (
                  <button
                    type="button"
                    key={i}
                    onClick={() => !isEmpty && setSelectedIdx(i)}
                    disabled={isEmpty}
                    aria-label={title}
                    title={title}
                    className={`card-product-bg relative flex aspect-square items-center justify-center overflow-hidden border transition-colors ${
                      isActive
                        ? "border-gold"
                        : isEmpty
                          ? "border-line opacity-40"
                          : "border-line hover:border-gold/60"
                    }`}
                  >
                    {s.url ? (
                      <Image
                        src={s.url}
                        alt={title}
                        fill
                        sizes="80px"
                        className="relative z-[2] object-contain p-1.5"
                      />
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        className="relative z-[2] text-coal/40"
                      >
                        <rect x="3" y="5" width="18" height="14" rx="1" />
                        <circle cx="8.5" cy="10.5" r="1.5" />
                        <path d="m21 16-5-5L8 19" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Eyebrow PIEZA */}
            <div className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-gold">
              <span className="h-px w-6 bg-gold" />
              Pieza
              <span className="h-px w-6 bg-gold" />
            </div>

            {/* Título */}
            <h2 className="mb-5 font-serif text-[32px] leading-[1.05] text-cream md:text-[38px]">
              {p.nombre}
            </h2>

            {/* Precios: caja y unidad, con rebaja si aplica */}
            {hayPrecio ? (
              <div className="mb-8 flex flex-col gap-3">
                {caja != null && <DetailPriceRow label="Por caja" base={caja} desc={descCaja} />}
                {ind != null && <DetailPriceRow label="Por unidad" base={ind} desc={descInd} />}
              </div>
            ) : (
              <div className="mb-8 text-[13px] uppercase tracking-[0.2em] text-cream-mute">
                Precio bajo consulta
              </div>
            )}

            {/* Atributos en 2 columnas — solo los que existen en BD */}
            {attrs.length > 0 && (
              <dl className="mb-8 grid grid-cols-1 gap-x-8 border-t border-line sm:grid-cols-2">
                {attrs.map((a) => (
                  <AttrRow key={a.label} label={a.label} value={a.value} />
                ))}
              </dl>
            )}

            {/* Descripción */}
            {p.descripcion && (
              <div className="pb-2">
                <div className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-gold">
                  <span className="h-px w-6 bg-gold" />
                  Descripción
                </div>
                <p className="text-[14px] leading-[1.7] text-cream-mute">{p.descripcion}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>,
    document.body,
  );
}

function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line py-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between"
      >
        <span className="eyebrow">{title}</span>
        <span
          className="text-base text-gold transition-transform"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      {open && <div className="mt-[18px]">{children}</div>}
    </div>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onClick,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between py-2 text-left transition-colors"
      style={{ color: checked ? "var(--color-gold)" : "var(--color-cream-mute)" }}
    >
      <span className="flex items-center gap-3">
        <span
          className="inline-flex h-3.5 w-3.5 items-center justify-center border border-current"
          style={{ background: checked ? "var(--color-gold)" : "transparent" }}
        >
          {checked && <span className="text-[10px] leading-none text-coal">✓</span>}
        </span>
        <span className="text-sm">{label}</span>
      </span>
      {count != null && (
        <span className="text-[11px] tabular-nums text-muted">({count})</span>
      )}
    </button>
  );
}

function PriceRange({
  min,
  max,
  onChange,
}: {
  min: number | null;
  max: number | null;
  onChange: (next: { min: number | null; max: number | null }) => void;
}) {
  return (
    <div className="flex gap-2">
      <input
        type="number"
        inputMode="numeric"
        placeholder="Mín"
        value={min ?? ""}
        min={0}
        max={PRECIO_MAX_BOUND}
        onChange={(e) => onChange({ min: e.target.value === "" ? null : +e.target.value, max })}
        className="w-full border border-line bg-transparent px-2.5 py-2 text-[13px] text-cream"
      />
      <input
        type="number"
        inputMode="numeric"
        placeholder="Máx"
        value={max ?? ""}
        min={0}
        max={PRECIO_MAX_BOUND}
        onChange={(e) => onChange({ min, max: e.target.value === "" ? null : +e.target.value })}
        className="w-full border border-line bg-transparent px-2.5 py-2 text-[13px] text-cream"
      />
    </div>
  );
}

function Pagination({
  page,
  pages,
  onPage,
}: {
  page: number;
  pages: number;
  onPage: (n: number) => void;
}) {
  if (pages <= 1) return null;

  // Páginas mostradas: ventana de 5 + extremos
  const window: number[] = [];
  const start = Math.max(2, page - 2);
  const end = Math.min(pages - 1, page + 2);
  for (let i = start; i <= end; i++) window.push(i);

  const Btn = ({ n, active }: { n: number; active?: boolean }) => (
    <button
      key={n}
      onClick={() => onPage(n)}
      aria-current={active ? "page" : undefined}
      className="inline-flex h-9 min-w-9 items-center justify-center px-2.5 text-[13px] tabular-nums transition-colors"
      style={{
        background: active ? "var(--color-gold)" : "transparent",
        color: active ? "var(--color-coal)" : "var(--color-cream-mute)",
        border: "1px solid var(--color-line)",
      }}
    >
      {n}
    </button>
  );

  return (
    <nav aria-label="Paginación" className="mt-12 flex flex-wrap items-center justify-center gap-1.5">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="inline-flex h-9 items-center px-3 text-[11px] uppercase tracking-[0.18em] text-cream-mute disabled:opacity-40"
        style={{ border: "1px solid var(--color-line)" }}
      >
        ← Anterior
      </button>
      <Btn n={1} active={page === 1} />
      {start > 2 && <span className="px-1 text-cream-mute">…</span>}
      {window.map((n) => (
        <Btn key={n} n={n} active={page === n} />
      ))}
      {end < pages - 1 && <span className="px-1 text-cream-mute">…</span>}
      {pages > 1 && <Btn n={pages} active={page === pages} />}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= pages}
        className="inline-flex h-9 items-center px-3 text-[11px] uppercase tracking-[0.18em] text-cream-mute disabled:opacity-40"
        style={{ border: "1px solid var(--color-line)" }}
      >
        Siguiente →
      </button>
    </nav>
  );
}

function TiendaInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const setFilters = useCallback(
    (updater: (prev: Filters) => Filters, resetPage = true) => {
      const next = updater(filters);
      const final: Filters = resetPage ? { ...next, page: 1 } : next;
      router.replace(`/tienda${filtersToSearchString(final)}`, { scroll: false });
    },
    [filters, router],
  );

  const goToPage = useCallback(
    (n: number) => {
      router.push(`/tienda${filtersToSearchString({ ...filters, page: Math.max(1, n) })}`, {
        scroll: true,
      });
    },
    [filters, router],
  );

  const { useList: useMarcasList } = useMarcasService();
  const { data: marcas = [] } = useMarcasList();
  const { useList: useProductos } = useProductosService();
  const productosQuery = useProductos(filtersToApiParams(filters));

  const marcaById = useMemo(() => {
    const m = new Map<number, Marca>();
    marcas.forEach((mk) => m.set(mk.id, mk));
    return m;
  }, [marcas]);

  // Subcategorías disponibles según las marcas seleccionadas.
  // Si no hay marca seleccionada, mostramos todas (aplanadas).
  const subcategoriasDisponibles = useMemo(() => {
    const source = filters.marcaIds.length
      ? marcas.filter((m) => filters.marcaIds.includes(m.id))
      : marcas;
    const seen = new Set<number>();
    const out: { id: number; nombre: string; marcaNombre: string }[] = [];
    source.forEach((m) =>
      m.subcategorias.forEach((s) => {
        if (seen.has(s.id)) return;
        seen.add(s.id);
        out.push({ id: s.id, nombre: s.nombre, marcaNombre: m.nombre });
      }),
    );
    out.sort((a, b) => a.nombre.localeCompare(b.nombre));
    return out;
  }, [filters.marcaIds, marcas]);

  // Si el usuario quita la marca de una subcat seleccionada, limpiamos la subcat.
  // Lo hacemos derivando: filtramos las subcategoriaIds vivas según las disponibles.
  const activeSubcatIds = useMemo(
    () =>
      filters.subcategoriaIds.filter((id) => subcategoriasDisponibles.some((s) => s.id === id)),
    [filters.subcategoriaIds, subcategoriasDisponibles],
  );

  const toggleArr = <T,>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersHidden, setFiltersHidden] = useState(false);
  const [selected, setSelected] = useState<Producto | null>(null);

  const data = productosQuery.data;
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 0;
  const isError = productosQuery.isError;
  const isLoading = productosQuery.isLoading && !data;

  const FilterPanel = (
    <>
      <div className="mb-2 flex items-center justify-between">
        <div className="eyebrow text-cream">Filtros</div>
        {activeCount(filters) > 0 && (
          <button
            onClick={() => router.replace("/tienda")}
            className="text-[11px] uppercase tracking-[0.18em] text-gold underline underline-offset-4"
          >
            Limpiar ({activeCount(filters)})
          </button>
        )}
      </div>

      <FilterGroup title="Búsqueda">
        <input
          type="search"
          value={filters.q}
          placeholder="Nombre del producto…"
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          className="w-full border border-line bg-transparent px-2.5 py-2 text-[13px] text-cream"
        />
      </FilterGroup>

      <FilterGroup title="Marca">
        <div className="flex max-h-[260px] flex-col gap-0.5 overflow-y-auto pr-2">
          {marcas.map((m) => (
            <CheckRow
              key={m.id}
              label={m.nombre}
              count={m.total_productos}
              checked={filters.marcaIds.includes(m.id)}
              onClick={() =>
                setFilters((f) => {
                  const nextMarcas = toggleArr(f.marcaIds, m.id);
                  // Si se quita la marca, también limpiar sus subcategorías
                  const removed = !nextMarcas.includes(m.id);
                  const nextSubs = removed
                    ? f.subcategoriaIds.filter(
                        (sid) => !m.subcategorias.some((s) => s.id === sid),
                      )
                    : f.subcategoriaIds;
                  return { ...f, marcaIds: nextMarcas, subcategoriaIds: nextSubs };
                })
              }
            />
          ))}
        </div>
      </FilterGroup>

      {subcategoriasDisponibles.length > 0 && (
        <FilterGroup
          title={
            filters.marcaIds.length
              ? "Subcategoría"
              : "Subcategoría · seleccione una marca primero"
          }
          defaultOpen={filters.marcaIds.length > 0}
        >
          <div className="flex max-h-[260px] flex-col gap-0.5 overflow-y-auto pr-2">
            {filters.marcaIds.length === 0 ? (
              <div className="py-1 text-[12px] text-cream-mute">
                Marque una o más marcas para filtrar por subcategoría.
              </div>
            ) : (
              subcategoriasDisponibles.map((s) => (
                <CheckRow
                  key={s.id}
                  label={`${s.nombre}`}
                  checked={activeSubcatIds.includes(s.id)}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      subcategoriaIds: toggleArr(f.subcategoriaIds, s.id),
                    }))
                  }
                />
              ))
            )}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Intensidad">
        <div className="flex flex-col gap-0.5">
          {FORTALEZA_OPTIONS.map((o) => (
            <CheckRow
              key={o.value}
              label={o.label}
              checked={filters.fortalezas.includes(o.value)}
              onClick={() =>
                setFilters((f) => ({ ...f, fortalezas: toggleArr(f.fortalezas, o.value) }))
              }
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Precio ($)">
        <PriceRange
          min={filters.precioMin}
          max={filters.precioMax}
          onChange={({ min, max }) => setFilters((f) => ({ ...f, precioMin: min, precioMax: max }))}
        />
      </FilterGroup>

      <FilterGroup title="Disponibilidad" defaultOpen={false}>
        <CheckRow
          label="Solo en stock"
          checked={filters.soloExistentes}
          onClick={() => setFilters((f) => ({ ...f, soloExistentes: !f.soloExistentes }))}
        />
      </FilterGroup>
    </>
  );

  return (
    <div className="page">
      {/* Encabezado */}
      <div className="relative overflow-hidden border-b border-line bg-coal-soft">
        <div className="container-tr relative py-20 md:py-30 lg:pb-20 lg:pt-30">
          <div className="eyebrow mb-6">— Catálogo —</div>
          <h1 className="mb-6 leading-[0.96]" style={{ fontSize: "clamp(40px, 7vw, 96px)" }}>
            La <span className="italic text-gold">cava</span> entera.
          </h1>
          <p className="max-w-[580px] text-[15px] leading-[1.65] text-cream-mute md:text-lg">
            Filtre por marca, subcategoría, intensidad o precio. Las cajas aparecen siempre primero;
            después los individuales.
          </p>
        </div>
      </div>

      <div
        className={`container-tr grid gap-6 py-8 pb-16 lg:gap-14 lg:py-15 lg:pb-30 ${
          filtersHidden ? "lg:grid-cols-1" : "lg:grid-cols-[260px_1fr]"
        }`}
      >
        {!filtersHidden && (
          <aside className="hidden lg:block">
            <div className="sticky top-25">{FilterPanel}</div>
          </aside>
        )}

        <div>
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div className="text-[13px] text-cream-mute">
              <span className="mr-2 font-serif text-lg text-gold">{total}</span>
              {total === 1 ? "pieza" : "piezas"}
            </div>
            <div className="flex flex-wrap items-center gap-2.5 md:gap-6">
              <button
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 border border-gold px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold lg:hidden"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M6 12h12M10 18h4" />
                </svg>
                Filtros {activeCount(filters) > 0 && `(${activeCount(filters)})`}
              </button>
              <button
                onClick={() => setFiltersHidden((v) => !v)}
                className="hidden items-center gap-2 border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-cream-mute transition-colors hover:border-gold hover:text-gold lg:flex"
                aria-pressed={!filtersHidden}
                title={filtersHidden ? "Mostrar filtros" : "Ocultar filtros"}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M6 12h12M10 18h4" />
                </svg>
                {filtersHidden ? "Mostrar" : "Ocultar"} filtros
                {activeCount(filters) > 0 && ` (${activeCount(filters)})`}
              </button>
              <div className="flex items-center gap-2.5">
                <span className="hidden text-[11px] uppercase tracking-[0.2em] text-muted md:inline">
                  Ordenar:
                </span>
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, sort: e.target.value as ProductoSort }))
                  }
                  className="border border-line bg-transparent px-3 py-1.5 text-xs text-cream"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="hidden border border-line md:flex">
                {(["grid", "list"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setFilters((f) => ({ ...f, view: v }), false)}
                    className="px-3 py-1.5 text-sm"
                    style={{
                      background: filters.view === v ? "var(--color-gold)" : "transparent",
                      color: filters.view === v ? "var(--color-coal)" : "var(--color-cream-mute)",
                    }}
                  >
                    {v === "grid" ? "⊞" : "☰"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chips de filtros activos */}
          {activeCount(filters) > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {filters.q.trim() && (
                <Chip
                  label={`✕ "${filters.q.trim()}"`}
                  active
                  onClick={() => setFilters((f) => ({ ...f, q: "" }))}
                />
              )}
              {filters.marcaIds.map((id) => {
                const m = marcaById.get(id);
                return (
                  <Chip
                    key={`m-${id}`}
                    label={`✕ ${m?.nombre ?? `Marca ${id}`}`}
                    active
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        marcaIds: toggleArr(f.marcaIds, id),
                        subcategoriaIds: m
                          ? f.subcategoriaIds.filter(
                              (sid) => !m.subcategorias.some((s) => s.id === sid),
                            )
                          : f.subcategoriaIds,
                      }))
                    }
                  />
                );
              })}
              {activeSubcatIds.map((id) => {
                const s = subcategoriasDisponibles.find((x) => x.id === id);
                return (
                  <Chip
                    key={`s-${id}`}
                    label={`✕ ${s?.nombre ?? `Sub ${id}`}`}
                    active
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        subcategoriaIds: toggleArr(f.subcategoriaIds, id),
                      }))
                    }
                  />
                );
              })}
              {filters.fortalezas.map((v) => (
                <Chip
                  key={`f-${v}`}
                  label={`✕ ${fortalezaLabel(v)}`}
                  active
                  onClick={() =>
                    setFilters((f) => ({ ...f, fortalezas: toggleArr(f.fortalezas, v) }))
                  }
                />
              ))}
              {(filters.precioMin != null || filters.precioMax != null) && (
                <Chip
                  label={`✕ $${filters.precioMin ?? 0} – $${filters.precioMax ?? PRECIO_MAX_BOUND}`}
                  active
                  onClick={() => setFilters((f) => ({ ...f, precioMin: null, precioMax: null }))}
                />
              )}
              {filters.soloExistentes && (
                <Chip
                  label="✕ Solo en stock"
                  active
                  onClick={() => setFilters((f) => ({ ...f, soloExistentes: false }))}
                />
              )}
            </div>
          )}

          {/* Resultados */}
          {isError && (
            <div className="border border-line bg-coal-soft p-10 text-center">
              <p className="text-cream-mute">No se pudieron cargar los productos.</p>
              <button onClick={() => productosQuery.refetch()} className="btn-tr mt-4">
                Reintentar
              </button>
            </div>
          )}

          {(() => {
            const gridClass = `grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:gap-x-5 md:gap-y-9 ${
              filtersHidden ? "lg:grid-cols-4 xl:grid-cols-5" : "lg:grid-cols-3 xl:grid-cols-4"
            }`;
            if (isLoading) {
              return (
                <div className={gridClass}>
                  {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <div key={i} className="flex flex-col">
                      <div className="aspect-square animate-pulse bg-line" />
                      <div className="mt-3 h-2.5 w-1/3 animate-pulse bg-line" />
                      <div className="mt-2 h-4 w-3/4 animate-pulse bg-line" />
                    </div>
                  ))}
                </div>
              );
            }
            if (isError) return null;
            if (filters.view === "list") {
              return (
                <div className="flex flex-col gap-px bg-line">
                  {items.map((p) => (
                    <ProductRow
                      key={p.id}
                      p={p}
                      marca={marcaById.get(p.marca_id)}
                      onClick={() => setSelected(p)}
                    />
                  ))}
                </div>
              );
            }
            return (
              <div className={gridClass}>
                {items.map((p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    marca={marcaById.get(p.marca_id)}
                    onClick={() => setSelected(p)}
                  />
                ))}
              </div>
            );
          })()}

          {!isError && !isLoading && items.length === 0 && (
            <div className="py-15 text-center text-cream-mute">
              <div className="mb-3 font-serif text-[26px] italic text-gold">
                Ninguna pieza coincide.
              </div>
              <div>Pruebe relajar los filtros, o escríbanos: encontramos lo que falta.</div>
            </div>
          )}

          <Pagination page={filters.page} pages={pages} onPage={goToPage} />
        </div>
      </div>

      {/* Bottom-sheet de filtros (móvil / tablet) */}
      {filtersOpen && (
        <div
          onClick={() => setFiltersOpen(false)}
          className="anim-fade-in fixed inset-0 z-[80] flex items-end lg:hidden"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="anim-slide-up max-h-[88vh] w-full overflow-y-auto border-t border-gold bg-coal px-6 pb-8 pt-5"
          >
            <div className="mb-3 flex justify-center">
              <div className="h-1 w-12 rounded-sm bg-line-strong" />
            </div>
            {FilterPanel}
            <button
              onClick={() => setFiltersOpen(false)}
              className="btn-tr solid mt-7 w-full justify-center"
            >
              Ver {total} piezas →
            </button>
          </div>
        </div>
      )}

      {/* Detalle de producto (drawer) */}
      {selected && (
        <ProductDetailDrawer
          p={selected}
          marca={marcaById.get(selected.marca_id)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

export default function TiendaClient() {
  return (
    <Suspense fallback={<div className="page min-h-screen" />}>
      <TiendaInner />
    </Suspense>
  );
}
