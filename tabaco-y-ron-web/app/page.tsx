"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Placeholder from "@/components/Placeholder";
import { SectionHead } from "@/components/ui";
import { useSite } from "@/components/SiteProvider";
import { BRANDS, PRODUCTS, TESTIMONIALS } from "@/lib/data";

function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden md:min-h-[720px]">
      <Placeholder
        tag="hero"
        seed="tr-home-hero"
        eager
        variant="smoke"
        label="HERO · 1920×1080 · puro encendido + humo + claroscuro"
        className="absolute inset-0"
        style={{ position: "absolute", inset: 0 }}
      >
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 90%)",
          }}
        />
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0) 30%, rgba(10,10,10,0) 60%, rgba(10,10,10,0.9) 100%)",
          }}
        />
      </Placeholder>

      {/* Etiqueta lateral flotante */}
      <div className="absolute inset-y-0 left-6 z-[3] hidden items-center md:flex">
        <div
          className="text-[10px] font-bold uppercase tracking-[0.5em] text-cream-mute"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Casa fundada en 2009 · Una sola dirección, una sola idea
        </div>
      </div>

      <div className="container-tr relative z-[4] flex h-full flex-col justify-end pb-[130px] md:pb-[100px]">
        <div className="fade-up max-w-[880px]">
          <div className="mb-5 flex items-center gap-3.5 md:mb-7">
            <span className="h-px w-7 bg-gold md:w-12" />
            <span className="eyebrow">Edición Primavera · MMXXVI</span>
          </div>
          <h1
            className="font-normal leading-[0.96]"
            style={{ fontSize: "clamp(46px, 8vw, 124px)", letterSpacing: "-0.02em" }}
          >
            El arte
            <br />
            <span className="italic text-gold">de fumar</span>
            <br />
            con calma.
          </h1>
          <p className="mt-6 max-w-[540px] text-[15px] leading-[1.65] text-cream-mute md:mt-9 md:text-lg">
            Una selección curada de los mejores habanos del mundo, traídos directamente de las casas
            que aún liden la hoja a mano. Sin atajos, sin prisa, sin concesiones.
          </p>
          <div className="mt-8 flex flex-col gap-3 md:mt-12 md:flex-row md:gap-4">
            <Link href="/tienda" className="btn-tr solid justify-center md:justify-start">
              Ver el catálogo <span className="ml-1 text-base">→</span>
            </Link>
            <Link href="/nosotros" className="btn-tr ghost justify-center md:justify-start">
              Conocer la casa
            </Link>
          </div>
        </div>
      </div>

      {/* Tira de estadísticas */}
      <div
        className="absolute inset-x-0 bottom-0 z-[5] border-t border-line"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)" }}
      >
        <div className="container-tr grid grid-cols-2 gap-x-4 gap-y-3 py-4 md:grid-cols-4 md:gap-0 md:py-6">
          {[
            ["12", "casas representadas"],
            ["200+", "referencias activas"],
            ["17", "años de oficio"],
            ["70 / 70", "humedad / temperatura"],
          ].map(([n, l], i) => (
            <div
              key={l}
              className="flex items-baseline gap-2 md:gap-3.5 md:pr-6"
              style={{ borderRight: i < 3 ? "1px solid var(--color-line)" : "none" }}
            >
              <span className="font-serif text-2xl leading-none text-gold md:text-4xl">{n}</span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-cream-mute md:text-[11px]">
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ManifestoSection() {
  return (
    <section className="relative bg-coal py-16 md:py-22 lg:py-30">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, rgba(200,169,106,0.06), transparent 40%), radial-gradient(circle at 10% 80%, rgba(185,28,28,0.05), transparent 45%)",
        }}
      />
      <div className="container-tr relative grid items-center gap-9 lg:grid-cols-[1fr_1.4fr] lg:gap-25">
        <div>
          <div className="eyebrow mb-6">— I. Manifiesto —</div>
          <div className="font-serif text-[22px] leading-[1.5] text-cream md:text-[26px]">
            Hay tabaco que se vende. Y hay tabaco que se elige.
          </div>
        </div>
        <div>
          <p
            className="font-serif text-[22px] leading-[1.35] text-cream md:text-4xl"
            style={{ textWrap: "pretty", letterSpacing: "-0.01em" }}
          >
            Cada caja que entra a nuestra casa pasa por dos manos: las del torcedor que la liga y las
            del catador que la aprueba.{" "}
            <span className="italic text-gold">
              Si no nos gustaría regalársela a un amigo, no la vendemos.
            </span>{" "}
            Ese es el único filtro.
          </p>
          <div className="mt-8 flex items-center gap-5 md:mt-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1a1611] font-serif text-lg italic text-gold">
              EM
            </div>
            <div>
              <div className="font-serif text-base">Esteban Marrero</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted">
                Fundador · Catador certificado
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandsStrip() {
  return (
    <section className="border-y border-line bg-coal-soft py-16 md:py-25">
      <div className="container-tr">
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
        <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {BRANDS.map((b, i) => (
            <Link
              key={b.id}
              href={`/tienda?brand=${b.id}`}
              className="flex min-h-[160px] flex-col items-start gap-3.5 bg-coal-soft p-7 text-left transition-colors hover:bg-[#1f1c15] md:min-h-[200px] md:p-10"
            >
              <div className="font-serif text-xs italic text-gold">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="font-serif text-[22px] leading-[1.1] text-cream md:text-[26px]">
                {b.name}
              </div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-cream-mute">
                {b.origin} · {b.founded}
              </div>
              <div className="mt-auto text-[13px] leading-[1.5] text-cream-mute">{b.blurb}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProduct() {
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

function LookbookTeaser() {
  return (
    <section className="border-y border-line bg-coal-soft py-16 md:py-22 lg:py-30">
      <div className="container-tr">
        <SectionHead num="IV" eyebrow="Lookbook" title="El gesto, antes que el objeto." />
        {/* Móvil / tablet: grid simple */}
        <div className="grid grid-cols-2 gap-2 lg:hidden">
          <Placeholder label="hands · liando" tag="hands" seed="tr-look-hands" variant="warm" className="col-span-2" style={{ aspectRatio: "3/4" }} />
          <Placeholder label="humo · macro" tag="smoke" seed="tr-look-smoke" variant="smoke" style={{ aspectRatio: "1/1" }} />
          <Placeholder label="anillas · detalle" tag="ring" seed="tr-look-ring" style={{ aspectRatio: "1/1" }} />
          <Placeholder label="humidor · interior" tag="box" seed="tr-look-humidor" variant="warm" style={{ aspectRatio: "1/1" }} />
          <Placeholder label="ron · cristalería" tag="whiskey" seed="tr-look-ron" variant="crimson" style={{ aspectRatio: "1/1" }} />
        </div>
        {/* Escritorio: grid asimétrico de 12 columnas */}
        <div
          className="hidden gap-4 lg:grid"
          style={{ gridTemplateColumns: "repeat(12, 1fr)", gridTemplateRows: "300px 300px" }}
        >
          <Placeholder label="hands · liando" tag="hands" seed="tr-look-hands" variant="warm" style={{ gridColumn: "span 4", gridRow: "span 2" }} />
          <Placeholder label="humo · macro" tag="smoke" seed="tr-look-smoke" variant="smoke" style={{ gridColumn: "span 5", gridRow: "span 1" }} />
          <Placeholder label="anillas · detalle" tag="ring" seed="tr-look-ring" style={{ gridColumn: "span 3", gridRow: "span 1" }} />
          <Placeholder label="humidor · interior" tag="box" seed="tr-look-humidor" variant="warm" style={{ gridColumn: "span 3", gridRow: "span 1" }} />
          <Placeholder label="ron · cristalería" tag="whiskey" seed="tr-look-ron" variant="crimson" style={{ gridColumn: "span 5", gridRow: "span 1" }} />
        </div>
        <div className="mt-8 flex justify-center md:mt-12">
          <button className="btn-tr">Ver lookbook completo →</button>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[idx];
  return (
    <section className="bg-coal py-22 md:py-35">
      <div className="container-tr mx-auto max-w-[1080px]">
        <div className="eyebrow mb-7 text-center md:mb-10">— V. Cartas de clientes —</div>
        <blockquote key={idx} className="fade-up m-0 p-0">
          <div className="mb-4 text-center font-serif text-[52px] leading-none text-gold md:text-[72px]">
            &ldquo;
          </div>
          <p
            className="text-center font-serif text-[22px] italic leading-[1.4] text-cream md:text-4xl"
            style={{ letterSpacing: "-0.01em" }}
          >
            {t.quote}
          </p>
          <div className="mt-8 text-center md:mt-12">
            <div className="font-serif text-lg">— {t.author}</div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-cream-mute">
              {t.role} · {t.city}
            </div>
          </div>
        </blockquote>
        <div className="mt-14 flex justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Testimonio ${i + 1}`}
              className="h-0.5 transition-all"
              style={{
                width: i === idx ? 36 : 8,
                background: i === idx ? "var(--color-gold)" : "var(--color-line-strong)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="page">
      <Hero />
      <ManifestoSection />
      <BrandsStrip />
      <FeaturedProduct />
      <LookbookTeaser />
      <Testimonials />
    </div>
  );
}
