"use client";

import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import { useSite } from "@/components/SiteProvider";
import useParallax from "@/hooks/use-parallax";
import { PRODUCTS } from "@/lib/data";

export default function FeaturedProduct() {
  const { openProduct } = useSite();
  const featured = PRODUCTS.find((p) => p.id === "p01")!;
  const imgRef = useParallax<HTMLDivElement>(0.08);

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24 lg:py-[120px]"
      style={{
        background: "var(--color-paper-2)",
        borderTop: "1px solid var(--color-line)",
        borderBottom: "1px solid var(--color-line)",
      }}
    >
      <div
        aria-hidden
        className="blob gold"
        style={{
          width: 460,
          height: 460,
          top: "20%",
          right: "-8%",
          opacity: 0.4,
        }}
      />
      <div className="container-tr relative grid items-center gap-9 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal direction="left">
          <div ref={imgRef} className="relative">
            <Placeholder
              productImage="arturo-fuente-cuban-corona"
              className="relative mx-auto w-full max-w-[640px]"
              style={{ aspectRatio: "4/5" }}
            >
              <div
                className="absolute top-5 left-5 z-[3] px-3.5 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.26em]"
                style={{
                  background: "var(--color-red)",
                  color: "var(--color-paper)",
                }}
              >
                Pieza del mes
              </div>
            </Placeholder>
            {/* Decoración orbital — número 03 italic gigante */}
            <div
              aria-hidden
              className="float-y pointer-events-none absolute"
              style={{
                top: -28,
                right: -28,
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 140,
                color: "var(--color-gold)",
                opacity: 0.18,
                lineHeight: 1,
                zIndex: 0,
              }}
            >
              03
            </div>
          </div>
        </Reveal>

        <Reveal direction="right" delay={2}>
          <div className="eyebrow mb-[22px]">— III. La pieza del mes —</div>
          <div
            className="mb-3.5 font-serif text-lg italic"
            style={{ color: "var(--color-gold)" }}
          >
            Cohiba
          </div>
          <h2
            className="mb-6 leading-[0.96]"
            style={{
              fontSize: "clamp(48px, 7vw, 84px)",
              color: "var(--color-ink)",
              letterSpacing: "-0.025em",
            }}
          >
            {featured.name}
          </h2>
          <p
            className="font-serif italic"
            style={{
              fontSize: "clamp(18px, 1.8vw, 24px)",
              lineHeight: 1.5,
              color: "var(--color-ink)",
            }}
          >
            &ldquo;{featured.note}&rdquo;
          </p>
          <div
            className="mt-10 grid grid-cols-3 gap-4 pt-8 md:gap-7"
            style={{ borderTop: "1px solid var(--color-line)" }}
          >
            {(
              [
                ["Vitola", featured.vitola],
                ["Intensidad", featured.intensity],
                ["Cosecha", featured.vintage ?? "En curso"],
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
                  className="font-serif text-[15px] md:text-[18px]"
                  style={{ color: "var(--color-ink)" }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-start gap-5 md:flex-row md:items-baseline md:gap-7">
            <span
              className="font-serif"
              style={{
                fontSize: "clamp(40px, 4.5vw, 54px)",
                color: "var(--color-gold)",
                fontWeight: 500,
              }}
            >
              USD {featured.price}
            </span>
            <button className="btn-tr solid" onClick={() => openProduct(featured)}>
              Ver la pieza →
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
