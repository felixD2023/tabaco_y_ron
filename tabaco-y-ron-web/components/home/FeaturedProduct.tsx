"use client";

import Placeholder from "@/components/Placeholder";
import { useSite } from "@/components/SiteProvider";
import { PRODUCTS } from "@/lib/data";

export default function FeaturedProduct() {
  const { openProduct } = useSite();
  const featured = PRODUCTS.find((p) => p.id === "p01")!;
  return (
    <section className="bg-coal py-20 md:py-40">
      <div className="container-tr grid items-center gap-9 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Placeholder productImage="arturo-fuente-cuban-corona" style={{ aspectRatio: "4/5" }}>
          <div className="absolute left-5 top-5 z-[3] bg-crimson px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cream">
            Pieza del mes
          </div>
        </Placeholder>
        <div>
          <div className="eyebrow mb-[22px]">— III. La pieza del mes —</div>
          <div className="mb-3.5 font-serif text-base italic text-gold">Cohiba</div>
          <h2 className="mb-6 text-5xl leading-[0.95] md:text-[80px]">{featured.name}</h2>
          <p className="font-serif text-lg italic leading-[1.5] text-cream md:text-[22px]">
            &ldquo;{featured.note}&rdquo;
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8 md:gap-7">
            {[
              ["Vitola", featured.vitola],
              ["Intensidad", featured.intensity],
              ["Cosecha", featured.vintage],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-muted">{k}</div>
                <div className="font-serif text-[15px] text-cream md:text-lg">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-start gap-5 md:flex-row md:items-baseline md:gap-7">
            <span className="font-serif text-[40px] text-gold md:text-5xl">{featured.price} €</span>
            <button className="btn-tr solid" onClick={() => openProduct(featured)}>
              Ver producto →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
