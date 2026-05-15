"use client";

import { useMemo, useState } from "react";
import Placeholder from "@/components/Placeholder";
import { Chip } from "@/components/ui";
import { ACCESSORIES, ACCESSORY_CATEGORIES, type Accessory } from "@/lib/data";
import type { ImgTag } from "@/lib/images";

const CAT_TAG: Record<string, ImgTag> = {
  Humidores: "box",
  Cortadores: "cigar",
  Encendedores: "lighter",
  Ceniceros: "cigar",
  Estuches: "box",
};

function AccessoryCard({ item }: { item: Accessory }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex cursor-pointer flex-col"
    >
      <Placeholder
        label={item.name.toLowerCase()}
        seed={`tr-acc-${item.id}`}
        tag={CAT_TAG[item.category] || "cigar"}
        variant={hover ? "warm" : ""}
        className="relative transition-all"
        style={{ aspectRatio: "1/1" }}
      >
        <div className="absolute right-3.5 top-3.5 z-[3] border border-line bg-[rgba(0,0,0,0.55)] px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-cream">
          {item.category}
        </div>
      </Placeholder>
      <div className="px-1 pt-5">
        <div className="mb-2.5 font-serif text-[22px] leading-[1.25] text-cream">{item.name}</div>
        <p className="mb-4 text-[13px] leading-[1.55] text-cream-mute">{item.blurb}</p>
        <div className="flex items-center justify-between border-t border-line pt-4">
          <span className="font-serif text-[22px] text-cream">{item.price} €</span>
          <button className="btn-tr px-[18px] py-2.5 text-[10px]">Añadir →</button>
        </div>
      </div>
    </div>
  );
}

export default function AccessoriesPage() {
  const [cat, setCat] = useState("Todos");
  const filtered = useMemo(
    () => (cat === "Todos" ? ACCESSORIES : ACCESSORIES.filter((a) => a.category === cat)),
    [cat],
  );

  return (
    <div className="page">
      {/* Encabezado */}
      <div className="relative overflow-hidden border-b border-line bg-coal">
        <div className="absolute inset-0 opacity-50">
          <Placeholder
            seed="tr-accesorios-header-bg"
            tag="interior"
            className="absolute inset-0"
            style={{ position: "absolute", inset: 0 }}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(10,10,10,0.5) 0%, var(--color-coal) 100%)",
          }}
        />
        <div className="container-tr relative grid items-end gap-8 py-20 md:py-30 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:pb-20 lg:pt-30">
          <div>
            <div className="eyebrow mb-6">— Accesorios —</div>
            <h1 className="mb-6 leading-[0.96]" style={{ fontSize: "clamp(40px, 7vw, 96px)" }}>
              Los <span className="italic text-gold">objetos</span>
              <br />
              del ritual.
            </h1>
            <p className="max-w-[540px] text-[15px] leading-[1.65] text-cream-mute md:text-lg">
              Un buen puro merece un buen instrumento. Trabajamos con artesanos en España, Italia y
              Cuba para tener piezas que envejezcan bien, no objetos para presumir.
            </p>
          </div>
          <div className="pb-2">
            <div className="grid grid-cols-2 gap-px border border-line bg-line">
              {[
                ["Cedro", "humidores"],
                ["Acero", "cortadores"],
                ["Latón", "encendedores"],
                ["Mármol", "ceniceros"],
              ].map(([m, t]) => (
                <div key={m} className="bg-coal-soft p-4 md:p-5">
                  <div className="font-serif text-xl text-gold md:text-2xl">{m}</div>
                  <div className="mt-1.5 text-[11px] uppercase tracking-[0.2em] text-cream-mute">
                    {t}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de categoría */}
      <div
        className="sticky top-20 z-30 border-b border-line md:top-24"
        style={{ background: "rgba(10,10,10,0.95)", backdropFilter: "blur(10px)" }}
      >
        <div className="container-tr flex gap-2 overflow-x-auto py-4 md:py-6">
          {ACCESSORY_CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={cat === c} onClick={() => setCat(c)} />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="container-tr py-12 pb-16 md:py-20 md:pb-25">
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-8 md:grid-cols-3 md:gap-x-7 md:gap-y-12 lg:grid-cols-4">
          {filtered.map((a) => (
            <AccessoryCard key={a.id} item={a} />
          ))}
        </div>

        {/* Pieza destacada */}
        <div className="mt-18 grid border border-line md:mt-30 lg:grid-cols-2">
          <Placeholder
            label="humidor toscana · detalle de cedro"
            tag="box"
            seed="tr-feat-humidor-toscana"
            variant="warm"
            style={{ aspectRatio: "1/1" }}
          />
          <div className="flex flex-col justify-center p-6 py-10 md:p-14">
            <div className="eyebrow mb-[22px]">— Pieza destacada —</div>
            <div className="mb-2.5 font-serif text-base italic text-gold">Humidor</div>
            <h3 className="mb-6 text-[40px] leading-none md:text-[56px]">Toscana</h3>
            <p className="mb-8 max-w-[440px] text-sm leading-[1.7] text-cream-mute md:text-base">
              Cedro español envejecido seis meses al aire. Cierre alemán hermético. Capacidad para
              50 piezas y un higrómetro analógico calibrado pieza por pieza. Hecho a mano en
              Florencia.
            </p>
            <div className="mb-8 grid grid-cols-3 gap-3.5 md:gap-6">
              {[
                ["Material", "Cedro español"],
                ["Capacidad", "50 piezas"],
                ["Garantía", "5 años"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="mb-1.5 text-[10px] uppercase tracking-[0.24em] text-muted">
                    {k}
                  </div>
                  <div className="font-serif text-sm text-cream md:text-base">{v}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-baseline md:gap-8">
              <span className="font-serif text-[32px] text-gold md:text-[40px]">480 €</span>
              <button className="btn-tr solid">Añadir a la bolsa →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
