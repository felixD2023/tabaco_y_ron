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

const MATERIALS: ReadonlyArray<readonly [string, string]> = [
  ["Cedro", "humidores"],
  ["Acero", "cortadores"],
  ["Latón", "encendedores"],
  ["Mármol", "ceniceros"],
];

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
        className="relative transition-all duration-300"
        style={{ aspectRatio: "1/1" }}
      >
        {/* Badge cream sobre la imagen */}
        <div
          className="absolute top-3.5 right-3.5 z-[3] px-2.5 py-[5px] text-[9px] font-semibold uppercase"
          style={{
            background: "var(--color-paper)",
            border: "1px solid var(--color-line-strong)",
            color: "var(--color-ink)",
            letterSpacing: "0.22em",
          }}
        >
          {item.category}
        </div>
      </Placeholder>
      <div className="px-1 pt-5">
        <div
          className="mb-2.5 font-serif text-[22px] leading-[1.25]"
          style={{ color: "var(--color-ink)", fontWeight: 500 }}
        >
          {item.name}
        </div>
        <p
          className="mb-[18px] text-[13.5px] leading-[1.6]"
          style={{ color: "var(--color-ink-2)" }}
        >
          {item.blurb}
        </p>
        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid var(--color-line)" }}
        >
          <span
            className="font-serif text-[22px]"
            style={{ color: "var(--color-ink)" }}
          >
            USD {item.price}
          </span>
          <button
            className="btn-tr"
            style={{
              padding: "9px 16px",
              fontSize: 10,
              letterSpacing: "0.26em",
            }}
          >
            Añadir →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccesoriosClient() {
  const [cat, setCat] = useState("Todos");
  const filtered = useMemo(
    () =>
      cat === "Todos"
        ? ACCESSORIES
        : ACCESSORIES.filter((a) => a.category === cat),
    [cat],
  );

  return (
    <div className="page">
      {/* ─── Header editorial ─── */}
      <header
        className="relative overflow-hidden"
        style={{
          background: "var(--color-paper-2)",
          borderBottom: "1px solid var(--color-line)",
        }}
      >
        {/* Watermark "Ritual" */}
        <div
          aria-hidden
          className="watermark"
          style={{
            top: 40,
            right: -40,
            fontSize: "clamp(180px, 22vw, 300px)",
          }}
        >
          Ritual
        </div>

        <div
          className="container-tr relative grid items-end gap-8 px-5 pt-[72px] pb-14 md:gap-16 md:px-8 md:pt-[112px] md:pb-20 lg:grid-cols-[1.2fr_1fr] lg:px-14"
        >
          <div>
            <div className="eyebrow mb-6">— Accesorios —</div>
            <h1
              className="mb-6 leading-[0.94]"
              style={{
                fontSize: "clamp(40px, 7.5vw, 104px)",
                color: "var(--color-ink)",
                letterSpacing: "-0.025em",
              }}
            >
              Los{" "}
              <span className="italic" style={{ color: "var(--color-gold)" }}>
                objetos
              </span>
              <br />
              del ritual.
            </h1>
            <p
              className="max-w-[560px] text-[15px] leading-[1.7] md:text-[18px]"
              style={{ color: "var(--color-ink-2)" }}
            >
              Un buen puro merece un buen instrumento. Trabajamos con artesanos
              en España, Italia, Cuba y Panamá para tener piezas que envejezcan
              bien — no objetos para presumir.
            </p>
          </div>

          {/* Grid de materiales — paper sobre línea fuerte */}
          <div className="pb-2">
            <div
              className="grid grid-cols-2"
              style={{
                gap: 1,
                background: "var(--color-line-strong)",
                border: "1px solid var(--color-line-strong)",
              }}
            >
              {MATERIALS.map(([material, type]) => (
                <div
                  key={material}
                  className="px-4 py-[18px] md:px-[22px] md:py-6"
                  style={{ background: "var(--color-paper)" }}
                >
                  <div
                    className="font-serif text-[20px] md:text-[26px]"
                    style={{
                      color: "var(--color-gold)",
                      fontWeight: 500,
                    }}
                  >
                    {material}
                  </div>
                  <div
                    className="mt-1.5 text-[10.5px] uppercase"
                    style={{
                      letterSpacing: "0.24em",
                      color: "var(--color-ink-mute)",
                    }}
                  >
                    {type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Tabs de categoría (sticky bajo el TopBar) ─── */}
      <div
        className="sticky z-30"
        style={{
          top: "var(--topbar-h)",
          background: "rgba(245,241,234,0.95)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--color-line)",
        }}
      >
        <div className="container-tr flex gap-2 overflow-x-auto py-3.5 md:py-5">
          {ACCESSORY_CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={cat === c} onClick={() => setCat(c)} />
          ))}
        </div>
      </div>

      {/* ─── Grid ─── */}
      <section
        className="container-tr px-5 pt-12 pb-16 md:px-8 md:pt-20 md:pb-[100px] lg:px-14"
      >
        <div
          className="grid grid-cols-2 gap-x-3.5 gap-y-8 md:grid-cols-3 md:gap-x-7 md:gap-y-14 lg:grid-cols-4"
        >
          {filtered.map((a) => (
            <AccessoryCard key={a.id} item={a} />
          ))}
        </div>

        {/* ─── Pieza destacada (editorial) ─── */}
        <div
          className="mt-[72px] grid md:mt-[120px] lg:grid-cols-2"
          style={{
            border: "1px solid var(--color-line-strong)",
            background: "var(--color-paper)",
          }}
        >
          <Placeholder
            label="humidor toscana · detalle de cedro"
            tag="box"
            seed="tr-feat-humidor-toscana"
            variant="warm"
            style={{ aspectRatio: "1/1" }}
          />
          <div className="flex flex-col justify-center px-6 py-10 md:px-14 md:py-16">
            <div className="eyebrow mb-[22px]">— Pieza destacada —</div>
            <div
              className="mb-2.5 font-serif text-[17px] italic"
              style={{ color: "var(--color-gold)" }}
            >
              Humidor
            </div>
            <h3
              className="mb-6 leading-none"
              style={{
                fontSize: "clamp(40px, 5vw, 60px)",
                color: "var(--color-ink)",
                fontWeight: 500,
              }}
            >
              Toscana
            </h3>
            <p
              className="mb-8 max-w-[460px] text-[14px] leading-[1.75] md:text-[16px]"
              style={{ color: "var(--color-ink-2)" }}
            >
              Cedro español envejecido seis meses al aire. Cierre alemán
              hermético. Capacidad para 50 piezas y un higrómetro analógico
              calibrado pieza por pieza. Hecho a mano en Florencia.
            </p>
            <div className="mb-8 grid grid-cols-3 gap-3.5 md:gap-6">
              {(
                [
                  ["Material", "Cedro español"],
                  ["Capacidad", "50 piezas"],
                  ["Garantía", "5 años"],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <div
                    className="mb-2 text-[9.5px] uppercase"
                    style={{
                      letterSpacing: "0.28em",
                      color: "var(--color-ink-mute)",
                    }}
                  >
                    {k}
                  </div>
                  <div
                    className="font-serif text-[14px] md:text-[17px]"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-baseline md:gap-8">
              <span
                className="font-serif"
                style={{
                  fontSize: "clamp(32px, 3.5vw, 44px)",
                  color: "var(--color-gold)",
                  fontWeight: 500,
                }}
              >
                USD 480
              </span>
              <button className="btn-tr solid">Añadir a la bolsa →</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
