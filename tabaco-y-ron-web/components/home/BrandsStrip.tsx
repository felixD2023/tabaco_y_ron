"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import marcaPlaceholder from "@/assets/images/empatia.png";
import Reveal from "@/components/Reveal";
import { SectionHead } from "@/components/ui";
import useMarcasService from "@/hooks/use-marcas-service";

/**
 * Strip de marcas — sección "Las Casas" del home. Mantiene la estructura de
 * datos rica del backend (imagen, número correlativo, total de productos,
 * líneas) pero adaptada al tema claro Mármol & Oro: la sección va sobre cream
 * y cada card preserva su interior oscuro (imagen con overlay) para crear
 * contraste editorial sin romper el ritmo de la página.
 */
function useResponsiveCols() {
  const [cols, setCols] = useState(4);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCols(w < 720 ? 2 : w < 1024 ? 3 : 4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

export default function BrandsStrip() {
  const { useList } = useMarcasService();
  const { data: marcas, isLoading, isError, refetch } = useList();
  const cols = useResponsiveCols();

  const showSkeleton = isLoading && !marcas;
  const showError = !isLoading && isError;
  const showEmpty = !isLoading && !isError && (marcas?.length ?? 0) === 0;
  const showGrid = !isError && (marcas?.length ?? 0) > 0;

  return (
    <section
      className="brands-strip relative overflow-hidden py-16 md:py-24 lg:py-[120px]"
      style={{ background: "var(--color-paper-base)" }}
    >
      <div
        aria-hidden
        className="blob warm"
        style={{
          width: 480,
          height: 480,
          top: "30%",
          left: "-10%",
          opacity: 0.3,
        }}
      />
      <div className="container-tr relative">
        <Reveal>
          <SectionHead
            num="II"
            eyebrow="Las Marcas"
            title={
              <>
                Diecinueve marcas.{" "}
                <span className="italic text-gold">Una sola estantería.</span>
              </>
            }
            action={
              <Link href="/tienda" className="btn-tr">
                Ver todas →
              </Link>
            }
          />
        </Reveal>

        {/* Tira de orígenes (decorativa) */}
        <div
          className="mb-9 flex flex-wrap items-center gap-[18px] pb-[18px] text-[11px] uppercase tracking-[0.24em] md:mb-14"
          style={{
            color: "var(--color-ink-mute)",
            borderBottom: "1px solid var(--color-line)",
          }}
        >
          <span className="text-gold">◆</span>
          <span>Cuba</span>
          <span className="diamond" />
          <span>República Dominicana</span>
          <span className="diamond" />
          <span>Nicaragua</span>
          <span className="diamond" />
          <span>Honduras</span>
          <span
            className="hidden h-px min-w-10 flex-1 md:block"
            style={{ background: "var(--color-line)" }}
          />
          <span
            className="font-serif text-[13px] italic normal-case tracking-normal"
            style={{ color: "var(--color-gold)" }}
          >
            diecinueve nombres, una misma firma
          </span>
        </div>

        {showSkeleton && (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse"
                style={{
                  background: "linear-gradient(180deg, #5c5c66 0%, #2a2a2e 100%)",
                  boxShadow:
                    "0 14px 30px rgba(31,29,27,0.12), 0 0 0 1px var(--color-line)",
                }}
              />
            ))}
          </div>
        )}

        {showError && (
          <div
            className="p-10 text-center"
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              color: "var(--color-ink-mute)",
            }}
          >
            <p>No se pudieron cargar las marcas.</p>
            <button onClick={() => refetch()} className="btn-tr mt-4">
              Reintentar
            </button>
          </div>
        )}

        {showEmpty && (
          <div
            className="p-10 text-center"
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              color: "var(--color-ink-mute)",
            }}
          >
            Aún no hay marcas registradas.
          </div>
        )}

        {showGrid && (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {marcas!.map((m, i) => {
              const variantes = m.subcategorias.length;
              const variantesLabel =
                variantes === 1 ? "1 línea" : `${variantes} líneas`;
              const delay = (Math.min((i % cols) + 1, 5)) as 1 | 2 | 3 | 4 | 5;
              return (
                <Reveal key={m.id} direction="up" delay={delay}>
                  <Link
                    href={`/tienda?marca_id=${m.id}`}
                    className="brand-tile group block text-left"
                  >
                  <div
                    className="brand-card relative aspect-square overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(180deg, #5c5c66 0%, #2a2a2e 100%)",
                      boxShadow:
                        "0 14px 30px rgba(31,29,27,0.10), 0 0 0 1px var(--color-line)",
                      transition:
                        "transform .4s cubic-bezier(.2,.7,.2,1), box-shadow .4s ease",
                    }}
                  >
                    <Image
                      src={m.imagen ?? marcaPlaceholder}
                      alt={m.nombre}
                      fill
                      sizes="(max-width: 720px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="brand-bg-img object-cover transition-transform duration-500 ease-out"
                    />

                    {/* Overlay para legibilidad sobre la foto */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(15,12,10,0.30) 0%, rgba(15,12,10,0.05) 35%, rgba(15,12,10,0.55) 70%, rgba(15,12,10,0.94) 100%)",
                      }}
                    />

                    {/* Marco interior oro */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-3 z-[2]"
                      style={{
                        border: "1px solid rgba(196,168,98,0.28)",
                      }}
                    />

                    <div className="absolute top-[22px] right-6 left-6 z-[3] flex items-baseline justify-between">
                      <span
                        className="font-serif text-sm italic"
                        style={{
                          color: "var(--color-gold-pure)",
                          textShadow: "0 1px 6px rgba(0,0,0,0.65)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.22em]"
                        style={{
                          color: "rgba(245,241,234,0.7)",
                          textShadow: "0 1px 6px rgba(0,0,0,0.65)",
                        }}
                      >
                        {variantesLabel}
                      </span>
                    </div>

                    <div className="absolute right-0 bottom-0 left-0 z-[3] flex flex-col gap-2 px-6 pb-6">
                      <span
                        className="mb-1 block h-px w-10"
                        style={{ background: "var(--color-gold-pure)" }}
                      />
                      <div
                        className="brand-card-name font-serif text-[20px] leading-[1.05] transition-colors duration-200 md:text-[22px]"
                        style={{
                          color: "#F5F1EA",
                          letterSpacing: "-0.01em",
                          textShadow: "0 2px 12px rgba(0,0,0,0.7)",
                        }}
                      >
                        {m.nombre}
                      </div>
                      <div
                        className="text-[10px] uppercase tracking-[0.24em]"
                        style={{
                          color: "rgba(245,241,234,0.7)",
                          textShadow: "0 1px 6px rgba(0,0,0,0.7)",
                        }}
                      >
                        {m.total_productos}{" "}
                        {m.total_productos === 1 ? "producto" : "productos"}
                        {variantes > 0 && (
                          <>
                            {" · "}
                            {variantesLabel}
                          </>
                        )}
                      </div>
                    </div>

                    {/* CTA hover (oro sobre la card) */}
                    <div
                      className="brand-cta absolute top-4 right-4 z-[4] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.24em]"
                      style={{
                        background: "var(--color-gold-pure)",
                        color: "var(--color-graphite)",
                        boxShadow: "0 6px 16px rgba(31,29,27,0.35)",
                      }}
                    >
                      Ver colección →
                    </div>
                  </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
