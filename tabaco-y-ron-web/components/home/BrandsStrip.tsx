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
    <section className="border-y border-line bg-coal-soft py-16 md:py-25">
      <div className="container-tr">
        <SectionHead
          num="II"
          eyebrow="Las Casas"
          title="Las casas. Una sola estantería."
          action={
            <Link href="/tienda" className="btn-tr">
              Ver todas →
            </Link>
          }
        />

        {showSkeleton && (
          <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex min-h-[160px] flex-col gap-3.5 bg-coal-soft p-7 md:min-h-[200px] md:p-10"
              >
                <div className="h-3 w-6 animate-pulse bg-line" />
                <div className="h-6 w-2/3 animate-pulse bg-line" />
                <div className="mt-auto h-3 w-1/3 animate-pulse bg-line" />
              </div>
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
          <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {marcas!.map((m, i) => (
              <Link
                key={m.id}
                href={`/tienda?marca_id=${m.id}`}
                className="group relative isolate flex min-h-[160px] flex-col items-start gap-3.5 overflow-hidden bg-coal-soft p-7 text-left md:min-h-[200px] md:p-10"
              >
                <Image
                  src={m.imagen ?? marcaPlaceholder}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="-z-10 object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-coal-soft/75 transition-colors duration-300 group-hover:bg-[#1f1c15]/80"
                />

                <div className="font-serif text-xs italic text-gold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="font-serif text-[22px] leading-[1.1] text-cream md:text-[26px]">
                  {m.nombre}
                </div>
                <div className="mt-auto text-[11px] uppercase tracking-[0.2em] text-cream-mute">
                  {m.subcategorias.length}{" "}
                  {m.subcategorias.length === 1 ? "variante" : "variantes"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
