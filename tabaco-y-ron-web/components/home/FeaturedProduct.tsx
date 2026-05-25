"use client";

import Placeholder from "@/components/Placeholder";
import { useSite } from "@/components/SiteProvider";
import { PRODUCTS } from "@/lib/data";

export default function FeaturedProduct() {
  const { openProduct } = useSite();
  const featured = PRODUCTS.find((p) => p.id === "p01")!;
  return (
    <section className="flex min-h-[calc(100svh-56px)] items-center bg-coal py-12 lg:h-[calc(100svh-68px)] lg:max-h-[900px] lg:min-h-0 lg:py-14">
      <div className="container-tr grid items-center gap-9 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <Placeholder
          productImage="arturo-fuente-cuban-corona"
          className="mx-auto w-full max-w-[640px]"
          style={{
            aspectRatio: "1/1",
            maxHeight: "min(calc(100svh - 180px), 640px)",
          }}
        >
          <div className="absolute left-5 top-5 z-[3] bg-crimson px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cream">
            Pieza del mes
          </div>
        </Placeholder>
        <div>
          <div className="eyebrow mb-4">— III. La pieza del mes —</div>
          <div className="mb-3 font-serif text-base italic text-gold">Cohiba</div>
          <h2 className="mb-5 text-5xl leading-[0.95] md:text-[60px] lg:text-[64px]">
            {featured.name}
          </h2>
          <p className="font-serif text-base italic leading-[1.5] text-cream md:text-lg lg:text-xl">
            &ldquo;{featured.note}&rdquo;
          </p>
          <div className="mt-7 grid grid-cols-3 gap-4 border-t border-line pt-6 md:gap-7">
            {[
              ["Vitola", featured.vitola],
              ["Intensidad", featured.intensity],
              ["Cosecha", featured.vintage],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-muted">{k}</div>
                <div className="font-serif text-[15px] text-cream md:text-base">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-col items-start gap-4 md:flex-row md:items-baseline md:gap-6">
            <span className="font-serif text-[36px] text-gold md:text-[44px]">
              {featured.price} €
            </span>
            <button className="btn-tr solid" onClick={() => openProduct(featured)}>
              Ver producto →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
