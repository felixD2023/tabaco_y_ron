import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Página no encontrada · 404" },
  description:
    "La página que buscas se ha hecho humo. Vuelve al catálogo de habanos y accesorios de Tabaco & Ron.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section
      className="page relative flex min-h-[78vh] items-center overflow-hidden"
      style={{ background: "var(--color-paper-base)" }}
    >
      {/* Halos sutiles oro / rojo sobre cream */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 70% 25%, rgba(176,133,69,0.10), transparent 42%), radial-gradient(circle at 15% 80%, rgba(185,28,28,0.06), transparent 45%)",
        }}
      />
      {/* Trama diagonal sutil */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(31,29,27,0.04) 0 1px, transparent 1px 16px)",
        }}
      />

      <div className="container-tr relative z-[2] py-20 md:py-28">
        <div className="fade-up mx-auto max-w-[760px] text-center">
          <div className="mb-7 flex items-center justify-center gap-3.5">
            <span className="h-px w-7 bg-gold md:w-12" />
            <span className="eyebrow">Error 404 · Página perdida</span>
            <span className="h-px w-7 bg-gold md:w-12" />
          </div>

          <div
            className="font-serif leading-none"
            style={{
              fontSize: "clamp(96px, 22vw, 260px)",
              letterSpacing: "-0.03em",
              color: "var(--color-gold)",
              opacity: 0.9,
            }}
          >
            404
          </div>

          <h1
            className="mt-2 font-normal leading-[1.0]"
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              letterSpacing: "-0.02em",
              color: "var(--color-ink)",
            }}
          >
            Esta página se ha
            <br />
            <span className="italic text-gold">hecho humo.</span>
          </h1>

          <p
            className="mx-auto mt-7 max-w-[480px] text-[15px] leading-[1.65] md:text-lg"
            style={{ color: "var(--color-ink-2)" }}
          >
            La dirección que buscabas no existe o se ha movido. Pero la casa
            sigue abierta: el catálogo, las marcas y el ritual te esperan donde
            siempre.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-4">
            <Link href="/" className="btn-tr solid justify-center">
              Volver al inicio <span className="ml-1 text-base">→</span>
            </Link>
            <Link href="/tienda" className="btn-tr ghost justify-center">
              Ver el catálogo
            </Link>
          </div>

          <div
            className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.2em]"
            style={{ color: "var(--color-ink-mute)" }}
          >
            <Link href="/accesorios" className="transition-colors hover:text-gold">
              Accesorios
            </Link>
            <span style={{ color: "var(--color-line-strong)" }}>·</span>
            <Link href="/nosotros" className="transition-colors hover:text-gold">
              La casa
            </Link>
            <span style={{ color: "var(--color-line-strong)" }}>·</span>
            <Link href="/blog" className="transition-colors hover:text-gold">
              Bitácora
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
