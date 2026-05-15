"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Placeholder from "@/components/Placeholder";
import { Chip } from "@/components/ui";
import { useSite } from "@/components/SiteProvider";
import { BRANDS, INTENSIDADES, PRODUCTS, VITOLAS, type Product } from "@/lib/data";

function ProductCard({ product }: { product: Product }) {
  const { openProduct } = useSite();
  const [hover, setHover] = useState(false);
  const brand = BRANDS.find((b) => b.id === product.brand)!;
  return (
    <button
      onClick={() => openProduct(product)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex flex-col text-left transition-all"
    >
      <Placeholder
        seed={`tr-product-${product.id}`}
        productMode
        style={{ aspectRatio: "4/5" }}
        className="relative"
      >
        <div
          className="absolute inset-0 z-[4] flex items-center justify-center transition-opacity"
          style={{ background: "rgba(10,10,10,0.5)", opacity: hover ? 1 : 0 }}
        >
          <div className="border border-gold px-[22px] py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-gold">
            Ver pieza →
          </div>
        </div>
        <div className="absolute left-3.5 top-3.5 z-[3] border border-line bg-[rgba(0,0,0,0.55)] px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-cream">
          {product.intensity}
        </div>
      </Placeholder>
      <div className="px-1 pt-5">
        <div className="mb-1.5 font-serif text-[13px] italic text-gold">{brand.name}</div>
        <div className="mb-2 font-serif text-[22px] leading-[1.2] text-cream">{product.name}</div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted">
          {product.vitola} · {product.length}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="font-serif text-[22px] text-cream">{product.price} €</span>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
            style={{ color: hover ? "var(--color-gold)" : "var(--color-muted)" }}
          >
            por pieza
          </span>
        </div>
      </div>
    </button>
  );
}

function ProductRow({ product }: { product: Product }) {
  const { openProduct } = useSite();
  const brand = BRANDS.find((b) => b.id === product.brand)!;
  return (
    <button
      onClick={() => openProduct(product)}
      className="grid items-center gap-6 bg-coal px-6 py-5 text-left transition-colors hover:bg-coal-soft"
      style={{ gridTemplateColumns: "120px 1fr 1fr 1fr 120px 100px" }}
    >
      <Placeholder seed={`tr-product-${product.id}`} productMode style={{ width: 100, height: 80 }} />
      <div>
        <div className="font-serif text-xs italic text-gold">{brand.name}</div>
        <div className="mt-1 font-serif text-xl">{product.name}</div>
      </div>
      <div className="text-xs uppercase tracking-[0.18em] text-cream-mute">{product.vitola}</div>
      <div className="text-xs uppercase tracking-[0.18em] text-cream-mute">{product.intensity}</div>
      <div className="font-serif text-[22px] text-cream">{product.price} €</div>
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Ver →</span>
    </button>
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
  count: number;
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
      <span className="text-[11px] tabular-nums text-muted">({count})</span>
    </button>
  );
}

function PriceSlider({
  value,
  onChange,
  min,
  max,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <div className="mb-3.5 flex justify-between">
        <span className="text-sm text-cream">{value[0]} €</span>
        <span className="text-sm text-cream">{value[1]} €</span>
      </div>
      <div className="relative h-1 bg-coal-raised">
        <div
          className="absolute inset-y-0 bg-gold"
          style={{
            left: `${((value[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((value[1] - min) / (max - min)) * 100}%`,
          }}
        />
      </div>
      <div className="mt-3.5 flex gap-2">
        <input
          type="number"
          value={value[0]}
          min={min}
          max={value[1]}
          onChange={(e) => onChange([+e.target.value, value[1]])}
          className="w-full border border-line bg-transparent px-2.5 py-2 text-[13px] text-cream"
        />
        <input
          type="number"
          value={value[1]}
          min={value[0]}
          max={max}
          onChange={(e) => onChange([value[0], +e.target.value])}
          className="w-full border border-line bg-transparent px-2.5 py-2 text-[13px] text-cream"
        />
      </div>
    </div>
  );
}

function ShopPageInner() {
  const initialBrand = useSearchParams().get("brand");
  const [brands, setBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [vitolas, setVitolas] = useState<string[]>([]);
  const [intensities, setIntensities] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>([0, 200]);
  const [sort, setSort] = useState("curated");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let r = PRODUCTS.filter((p) => {
      if (brands.length && !brands.includes(p.brand)) return false;
      if (vitolas.length && !vitolas.includes(p.vitola)) return false;
      if (intensities.length && !intensities.includes(p.intensity)) return false;
      if (p.price < price[0] || p.price > price[1]) return false;
      return true;
    });
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "name") r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [brands, vitolas, intensities, price, sort]);

  const toggle = (list: string[], setList: (v: string[]) => void) => (item: string) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const count = (key: "brand" | "vitola" | "intensity") => {
    const m: Record<string, number> = {};
    PRODUCTS.forEach((p) => {
      const k = p[key];
      m[k] = (m[k] || 0) + 1;
    });
    return m;
  };
  const brandCounts = useMemo(() => count("brand"), []);
  const vitolaCounts = useMemo(() => count("vitola"), []);
  const intensityCounts = useMemo(() => count("intensity"), []);

  const activeCount =
    brands.length +
    vitolas.length +
    intensities.length +
    (price[0] > 0 || price[1] < 200 ? 1 : 0);

  const clearAll = () => {
    setBrands([]);
    setVitolas([]);
    setIntensities([]);
    setPrice([0, 200]);
  };

  const FilterPanel = (
    <>
      <div className="mb-2 flex items-center justify-between">
        <div className="eyebrow text-cream">Filtros</div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-[11px] uppercase tracking-[0.18em] text-gold underline underline-offset-4"
          >
            Limpiar ({activeCount})
          </button>
        )}
      </div>

      <FilterGroup title="Marca">
        <div className="flex max-h-[260px] flex-col gap-0.5 overflow-y-auto pr-2">
          {BRANDS.map((b) => (
            <CheckRow
              key={b.id}
              label={b.name}
              count={brandCounts[b.id] || 0}
              checked={brands.includes(b.id)}
              onClick={() => toggle(brands, setBrands)(b.id)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Intensidad">
        <div className="flex flex-col gap-0.5">
          {INTENSIDADES.map((i) => (
            <CheckRow
              key={i}
              label={i}
              count={intensityCounts[i] || 0}
              checked={intensities.includes(i)}
              onClick={() => toggle(intensities, setIntensities)(i)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Vitola">
        <div className="flex flex-col gap-0.5">
          {VITOLAS.map((v) => (
            <CheckRow
              key={v}
              label={v}
              count={vitolaCounts[v] || 0}
              checked={vitolas.includes(v)}
              onClick={() => toggle(vitolas, setVitolas)(v)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Precio (€)">
        <PriceSlider value={price} onChange={setPrice} min={0} max={200} />
      </FilterGroup>
    </>
  );

  return (
    <div className="page">
      {/* Encabezado */}
      <div className="relative overflow-hidden border-b border-line bg-coal-soft">
        <div className="absolute inset-0 opacity-40">
          <Placeholder
            seed="tr-shop-header-bg"
            tag="interior"
            variant="warm"
            className="absolute inset-0"
            style={{ position: "absolute", inset: 0 }}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(10,10,10,0.3) 0%, var(--color-coal-soft) 100%)",
          }}
        />
        <div className="container-tr relative py-20 md:py-30 lg:pb-20 lg:pt-30">
          <div className="eyebrow mb-6">— Catálogo —</div>
          <h1 className="mb-6 leading-[0.96]" style={{ fontSize: "clamp(40px, 7vw, 96px)" }}>
            La <span className="italic text-gold">cava</span> entera.
          </h1>
          <p className="max-w-[580px] text-[15px] leading-[1.65] text-cream-mute md:text-lg">
            {PRODUCTS.length} referencias activas, repartidas entre {BRANDS.length} casas. Filtre por
            marca, intensidad, vitola o precio. Las novedades se publican el primer viernes de cada
            mes.
          </p>
        </div>
      </div>

      <div className="container-tr grid gap-6 py-8 pb-16 lg:grid-cols-[260px_1fr] lg:gap-14 lg:py-15 lg:pb-30">
        {/* Filtros laterales (solo escritorio) */}
        <aside className="hidden lg:block">
          <div className="sticky top-25">{FilterPanel}</div>
        </aside>

        {/* Resultados */}
        <div>
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div className="text-[13px] text-cream-mute">
              <span className="mr-2 font-serif text-lg text-gold">{filtered.length}</span>
              piezas
            </div>
            <div className="flex flex-wrap items-center gap-2.5 md:gap-6">
              <button
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 border border-gold px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold lg:hidden"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M6 12h12M10 18h4" />
                </svg>
                Filtros {activeCount > 0 && `(${activeCount})`}
              </button>
              <div className="flex items-center gap-2.5">
                <span className="hidden text-[11px] uppercase tracking-[0.2em] text-muted md:inline">
                  Ordenar:
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-line bg-transparent px-3 py-1.5 text-xs text-cream"
                >
                  <option value="curated">Curaduría</option>
                  <option value="price-asc">Precio ↑</option>
                  <option value="price-desc">Precio ↓</option>
                  <option value="name">Nombre A–Z</option>
                </select>
              </div>
              <div className="hidden border border-line md:flex">
                {(["grid", "list"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className="px-3 py-1.5 text-sm"
                    style={{
                      background: view === v ? "var(--color-gold)" : "transparent",
                      color: view === v ? "var(--color-coal)" : "var(--color-cream-mute)",
                    }}
                  >
                    {v === "grid" ? "⊞" : "☰"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chips de filtros activos */}
          {activeCount > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {brands.map((b) => {
                const br = BRANDS.find((x) => x.id === b)!;
                return (
                  <Chip key={b} label={`✕ ${br.name}`} active onClick={() => toggle(brands, setBrands)(b)} />
                );
              })}
              {intensities.map((i) => (
                <Chip key={i} label={`✕ ${i}`} active onClick={() => toggle(intensities, setIntensities)(i)} />
              ))}
              {vitolas.map((v) => (
                <Chip key={v} label={`✕ ${v}`} active onClick={() => toggle(vitolas, setVitolas)(v)} />
              ))}
            </div>
          )}

          {/* Grid / Lista */}
          {view === "grid" ? (
            <div className="grid grid-cols-2 gap-x-3.5 gap-y-7 md:gap-x-8 md:gap-y-12 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-px bg-line">
              {filtered.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="py-15 text-center text-cream-mute">
              <div className="mb-3 font-serif text-[26px] italic text-gold">
                Ninguna pieza coincide.
              </div>
              <div>Pruebe relajar los filtros, o escríbanos: encontramos lo que falta.</div>
            </div>
          )}
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
              Ver {filtered.length} piezas →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="page min-h-screen" />}>
      <ShopPageInner />
    </Suspense>
  );
}
