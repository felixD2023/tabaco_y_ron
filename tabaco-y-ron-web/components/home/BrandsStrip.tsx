"use client";

import Image from "next/image";
import Link from "next/link";

import { SectionHead } from "@/components/ui";
import useMarcasService from "@/hooks/use-marcas-service";
import marcaPlaceholder from "@/assets/images/empatia.png";

export default function BrandsStrip() {
  const { useList } = useMarcasService();
  const { data: marcas, isLoading, isError, refetch } = useList();

  const showSkeleton = isLoading && !marcas;
  const showError = !isLoading && isError;
  const showEmpty = !isLoading && !isError && (marcas?.length ?? 0) === 0;
  const showGrid = !isError && (marcas?.length ?? 0) > 0;

  return (
    <section className="brands-strip relative overflow-hidden border-y border-line bg-coal-soft py-16 md:py-30 lg:py-[120px] lg:pb-[140px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(rgba(200,169,106,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      <div className="container-tr relative">
        <SectionHead
          num="II"
          eyebrow="Las Casas"
          title="Doce casas. Una sola estantería."
          action={
            <Link href="/tienda" className="btn-tr">
              Ver todas →
            </Link>
          }
        />

        <div className="mb-9 flex flex-wrap items-center gap-[18px] border-b border-line pb-[18px] text-[11px] uppercase tracking-[0.24em] text-cream-mute md:mb-14">
          <span className="text-gold">✦</span>
          <span>Cuba</span>
          <span className="h-1 w-1 rounded-full bg-muted" />
          <span>República Dominicana</span>
          <span className="h-1 w-1 rounded-full bg-muted" />
          <span>Nicaragua</span>
          <span className="h-1 w-1 rounded-full bg-muted" />
          <span>Honduras</span>
          <span className="hidden h-px min-w-10 flex-1 bg-line md:block" />
          <span className="font-serif text-[13px] italic normal-case tracking-normal text-gold">
            doce manos, una mesa
          </span>
        </div>

        {showSkeleton && (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse bg-[linear-gradient(180deg,#1a1611_0%,#0c0a07_100%)]"
                style={{ boxShadow: "0 14px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,169,106,0.18)" }}
              />
            ))}
          </div>
        )}

        {showError && (
          <div className="border border-line bg-coal-soft p-10 text-center">
            <p className="text-cream-mute">No se pudieron cargar las marcas.</p>
            <button onClick={() => refetch()} className="btn-tr mt-4">
              Reintentar
            </button>
          </div>
        )}

        {showEmpty && (
          <div className="border border-line bg-coal-soft p-10 text-center text-cream-mute">
            Aún no hay marcas registradas.
          </div>
        )}

        {showGrid && (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {marcas!.map((m, i) => {
              const variantes = m.subcategorias.length;
              const variantesLabel =
                variantes === 1 ? "1 línea" : `${variantes} líneas`;
              return (
                <Link
                  key={m.id}
                  href={`/tienda?marca_id=${m.id}`}
                  className="brand-tile group block text-left"
                >
                  <div
                    className="brand-card relative aspect-square overflow-hidden"
                    style={{
                      background: "linear-gradient(180deg, #1a1611 0%, #0c0a07 100%)",
                      boxShadow:
                        "0 14px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,169,106,0.18)",
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

                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(10,8,5,0.30) 0%, rgba(10,8,5,0.05) 35%, rgba(10,8,5,0.55) 70%, rgba(10,8,5,0.94) 100%)",
                      }}
                    />

                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-3 z-[2] border"
                      style={{ borderColor: "rgba(200,169,106,0.28)" }}
                    />

                    <div className="absolute top-[22px] right-6 left-6 z-[3] flex items-baseline justify-between">
                      <span
                        className="font-serif text-sm italic text-gold"
                        style={{ textShadow: "0 1px 6px rgba(0,0,0,0.65)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.22em]"
                        style={{
                          color: "rgba(245,241,232,0.7)",
                          textShadow: "0 1px 6px rgba(0,0,0,0.65)",
                        }}
                      >
                        {variantesLabel}
                      </span>
                    </div>

                    <div className="absolute right-0 bottom-0 left-0 z-[3] flex flex-col gap-2 px-6 pb-6">
                      <span className="mb-1 block h-px w-10 bg-gold" />
                      <div
                        className="brand-card-name font-serif text-[20px] leading-[1.05] text-cream transition-colors duration-200 md:text-[22px]"
                        style={{
                          letterSpacing: "-0.01em",
                          textShadow: "0 2px 12px rgba(0,0,0,0.7)",
                        }}
                      >
                        {m.nombre}
                      </div>
                      <div
                        className="text-[10px] uppercase tracking-[0.24em] text-cream-mute"
                        style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}
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

                    <div
                      className="brand-cta absolute top-4 right-4 z-[4] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.24em]"
                      style={{
                        background: "var(--color-gold)",
                        color: "#1a1611",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
                      }}
                    >
                      Ver colección →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
