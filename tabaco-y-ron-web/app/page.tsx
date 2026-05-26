import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import Link from "next/link";

import AnimatedHeadline from "@/components/home/AnimatedHeadline";
import BrandsMarquee from "@/components/home/BrandsMarquee";
import BrandsStrip from "@/components/home/BrandsStrip";
import FeaturedProduct from "@/components/home/FeaturedProduct";
import HeroBackground from "@/components/home/HeroBackground";
import HeroMetricsBar from "@/components/home/HeroMetricsBar";
import RitualSection from "@/components/home/RitualSection";
import Testimonials from "@/components/home/Testimonials";
import ValuesSection from "@/components/home/ValuesSection";
import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import { SectionHead } from "@/components/ui";
import { QUERY_KEYS } from "@/constants/query-keys";
import { getQueryClient } from "@/lib/react-query-server";
import { SITE, SITE_URL } from "@/lib/site-config";
import marcasService from "@/services/marcas.service";

export const metadata: Metadata = {
  title: { absolute: `${SITE.name} — El arte de fumar con calma` },
  description:
    "Tabaquería premium en Casco Antiguo, Ciudad de Panamá. 22 años curando habanos cubanos, dominicanos y nicaragüenses, humidores, cortadores y accesorios para el ritual del puro.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${SITE.name} — El arte de fumar con calma`,
    description:
      "Curaduría de habanos y accesorios premium en Ciudad de Panamá. Doce casas representadas, traídas directamente sin intermediarios.",
    images: [SITE.ogImage],
  },
};

/* ─────────────────────────────── Hero ─────────────────────────────── */
function Hero() {
  return (
    <section
      className="relative flex min-h-[720px] flex-col overflow-hidden lg:min-h-[100svh]"
      style={{ color: "#F5F1EA" }}
    >
      {/* Imagen de fondo cálida con parallax sutil */}
      <HeroBackground />

      {/* Triple overlay cinematográfico */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: [
            "radial-gradient(ellipse at 30% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 90%)",
            "linear-gradient(180deg, rgba(15,12,10,0.55) 0%, rgba(15,12,10,0.05) 25%, rgba(15,12,10,0.10) 55%, rgba(15,12,10,0.85) 100%)",
            "linear-gradient(95deg, rgba(15,12,10,0.55) 0%, rgba(15,12,10,0) 50%)",
          ].join(", "),
        }}
      />

      {/* Blobs decorativos flotantes (solo desktop) */}
      <div
        aria-hidden
        className="blob warm float-y hidden md:block"
        style={{
          width: 380,
          height: 380,
          top: "20%",
          right: "8%",
          zIndex: 1,
          opacity: 0.35,
        }}
      />
      <div
        aria-hidden
        className="blob gold float-x hidden md:block"
        style={{
          width: 220,
          height: 220,
          bottom: "25%",
          left: "6%",
          zIndex: 1,
          opacity: 0.3,
          animationDelay: "2s",
        }}
      />

      {/* Etiqueta vertical lateral */}
      <div className="absolute inset-y-0 left-6 z-[4] hidden items-center md:flex">
        <div
          className="text-[10px] font-bold uppercase tracking-[0.52em]"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            color: "rgba(245,241,234,0.55)",
          }}
        >
          Casa fundada en 2003{" "}
          <span style={{ color: "var(--color-gold-pure)" }}>◆</span>{" "}
          Una sola dirección
        </div>
      </div>

      {/* Contenido pegado al borde izquierdo */}
      <div
        className="relative z-[3] flex flex-1 flex-col justify-end pt-[100px] pb-[150px] md:pt-[120px] md:pb-[140px] md:pr-14 md:pl-14 lg:pl-24"
        style={{ paddingLeft: "20px", paddingRight: "20px" }}
      >
        <div className="max-w-[920px]">
          <div
            className="fade-up mb-[22px] flex items-center gap-3.5 md:mb-8"
            style={{ animationDelay: "0.1s" }}
          >
            <span
              className="h-px w-7 md:w-[60px]"
              style={{ background: "var(--color-gold-pure)" }}
            />
            <span
              className="text-[10.5px] font-bold uppercase tracking-[0.36em]"
              style={{ color: "var(--color-gold-pure)" }}
            >
              Edición MMXXVI{" "}
              <span
                className="diamond"
                style={{ background: "var(--color-gold-pure)" }}
              />{" "}
              Tabaquería Premium
            </span>
          </div>

          <AnimatedHeadline />

          <p
            className="fade-up mt-6 max-w-[580px] text-[15px] leading-[1.7] md:mt-9 md:text-[19px]"
            style={{
              color: "rgba(245,241,234,0.82)",
              animationDelay: "1.6s",
            }}
          >
            22 años en Ciudad de Panamá curando el tabaco premium más exigente de
            Centroamérica. 600+ referencias, doce casas, una sola idea:{" "}
            <span
              className="italic"
              style={{ color: "var(--color-gold-pure)" }}
            >
              premium es exacto, cuidado y excepcional.
            </span>
          </p>

          <div
            className="fade-up mt-8 flex flex-col gap-3 md:mt-12 md:flex-row md:gap-4"
            style={{ animationDelay: "1.85s" }}
          >
            <Link
              href="/tienda"
              className="btn-tr on-image justify-center md:justify-start"
            >
              Ver el catálogo <span className="ml-1 text-base">→</span>
            </Link>
            <Link
              href="/nosotros"
              className="btn-tr on-image-ghost justify-center md:justify-start"
            >
              Conocer la casa
            </Link>
          </div>
        </div>
      </div>

      {/* Barra inferior de métricas con CountUp */}
      <HeroMetricsBar />

      {/* Indicador de scroll (desktop) */}
      <div
        aria-hidden
        className="absolute right-14 z-[6] hidden flex-col items-center gap-3.5 md:flex"
        style={{ bottom: 124, color: "rgba(245,241,234,0.7)" }}
      >
        <span
          className="text-[9.5px] font-bold uppercase tracking-[0.36em]"
          style={{ writingMode: "vertical-rl" }}
        >
          Desplazar
        </span>
        <span
          className="relative block overflow-hidden"
          style={{
            width: 1,
            height: 56,
            background:
              "linear-gradient(180deg, rgba(196,168,98,0.6), rgba(196,168,98,0))",
          }}
        >
          <span
            className="absolute inset-x-0 top-0 block"
            style={{
              height: 14,
              background: "var(--color-gold-pure)",
              animation: "scrollPulse 2.2s ease-in-out infinite",
            }}
          />
        </span>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Manifiesto ─────────────────────────────── */
function ManifestoSection() {
  return (
    <section
      className="relative overflow-hidden py-16 md:py-24 lg:py-[120px]"
      style={{
        background: "var(--color-paper-2)",
        borderTop: "1px solid var(--color-line)",
        borderBottom: "1px solid var(--color-line)",
      }}
    >
      <div className="container-tr relative grid items-center gap-9 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
        <Reveal direction="left">
          <div className="eyebrow mb-6">— I. Manifiesto —</div>
          <div
            className="font-serif italic"
            style={{
              fontSize: "clamp(22px, 2.4vw, 28px)",
              lineHeight: 1.45,
              color: "var(--color-ink)",
            }}
          >
            Hay tabaco que se vende.
            <br />Y hay tabaco que se elige.
          </div>
        </Reveal>
        <Reveal direction="right" delay={1}>
          <p
            className="font-serif"
            style={{
              fontSize: "clamp(24px, 3.4vw, 38px)",
              lineHeight: 1.32,
              color: "var(--color-ink)",
              textWrap: "pretty",
              letterSpacing: "-0.012em",
            }}
          >
            22 años eligiendo cada caja a mano. 35 años de oficio en el fundador.{" "}
            <span
              className="italic"
              style={{ color: "var(--color-gold)" }}
            >
              Premium no es caro: es exacto, cuidado y excepcional.
            </span>{" "}
            Ese es el único filtro.
          </p>
          <div className="mt-9 flex items-center gap-5 md:mt-13">
            <div
              className="flex items-center justify-center font-serif italic"
              style={{
                width: 60,
                height: 60,
                border: "1px solid var(--color-gold)",
                color: "var(--color-gold)",
                fontSize: 22,
                fontWeight: 500,
              }}
            >
              LB
            </div>
            <div>
              <div
                className="font-serif"
                style={{ fontSize: 17, color: "var(--color-ink)" }}
              >
                Leo Bacallao, Fundador
              </div>
              <div
                className="mt-1.5 text-[10.5px] uppercase"
                style={{
                  letterSpacing: "0.26em",
                  color: "var(--color-ink-mute)",
                }}
              >
                35 años de oficio <span className="diamond" /> Ciudad de Panamá
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Lookbook ─────────────────────────────── */
function LookbookTeaser() {
  return (
    <section
      className="relative overflow-hidden py-16 md:py-24 lg:py-[120px]"
      style={{ background: "var(--color-paper-base)" }}
    >
      <div
        aria-hidden
        className="blob warm hidden lg:block"
        style={{
          width: 460,
          height: 460,
          bottom: -120,
          left: -60,
          opacity: 0.35,
        }}
      />
      <div className="container-tr relative">
        <Reveal>
          <SectionHead
            num="V"
            eyebrow="Lookbook"
            title={
              <>
                El gesto,{" "}
                <span className="italic text-gold">antes que el objeto.</span>
              </>
            }
          />
        </Reveal>
      </div>

      {/* Mobile: 2 cols, primer slot full-width */}
      <div className="grid w-full grid-cols-2 gap-2 px-5 lg:hidden">
        <Reveal direction="zoom" delay={1} className="col-span-2">
          <Placeholder
            label="manos · liando"
            tag="hands"
            seed="tr-look-hands"
            variant="warm"
            style={{ aspectRatio: "3/4" }}
          />
        </Reveal>
        <Reveal direction="zoom" delay={2}>
          <Placeholder
            label="humo · macro"
            tag="smoke"
            seed="tr-look-smoke"
            variant="smoke"
            style={{ aspectRatio: "1/1" }}
          />
        </Reveal>
        <Reveal direction="zoom" delay={3}>
          <Placeholder
            label="anillas · detalle"
            tag="ring"
            seed="tr-look-ring"
            style={{ aspectRatio: "1/1" }}
          />
        </Reveal>
        <Reveal direction="zoom" delay={4}>
          <Placeholder
            label="humidor · interior"
            tag="box"
            seed="tr-look-humidor"
            variant="warm"
            style={{ aspectRatio: "1/1" }}
          />
        </Reveal>
        <Reveal direction="zoom" delay={5}>
          <Placeholder
            label="ron · cristalería"
            tag="whiskey"
            seed="tr-look-ron"
            variant="crimson"
            style={{ aspectRatio: "1/1" }}
          />
        </Reveal>
      </div>

      {/* Desktop: grid 12 cols + 2 filas 320px */}
      <div className="container-tr hidden lg:block">
        <div
          className="grid w-full gap-3.5"
          style={{
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: "320px 320px",
          }}
        >
          <Reveal
            direction="zoom"
            delay={1}
            style={{ gridColumn: "span 4", gridRow: "span 2" }}
          >
            <Placeholder
              label="manos · liando"
              tag="hands"
              seed="tr-look-hands"
              variant="warm"
              style={{ width: "100%", height: "100%" }}
            />
          </Reveal>
          <Reveal
            direction="zoom"
            delay={2}
            style={{ gridColumn: "span 5", gridRow: "span 1" }}
          >
            <Placeholder
              label="humo · macro"
              tag="smoke"
              seed="tr-look-smoke"
              variant="smoke"
              style={{ width: "100%", height: "100%" }}
            />
          </Reveal>
          <Reveal
            direction="zoom"
            delay={3}
            style={{ gridColumn: "span 3", gridRow: "span 1" }}
          >
            <Placeholder
              label="anillas · detalle"
              tag="ring"
              seed="tr-look-ring"
              style={{ width: "100%", height: "100%" }}
            />
          </Reveal>
          <Reveal
            direction="zoom"
            delay={4}
            style={{ gridColumn: "span 3", gridRow: "span 1" }}
          >
            <Placeholder
              label="humidor · interior"
              tag="box"
              seed="tr-look-humidor"
              variant="warm"
              style={{ width: "100%", height: "100%" }}
            />
          </Reveal>
          <Reveal
            direction="zoom"
            delay={5}
            style={{ gridColumn: "span 5", gridRow: "span 1" }}
          >
            <Placeholder
              label="ron · cristalería"
              tag="whiskey"
              seed="tr-look-ron"
              variant="crimson"
              style={{ width: "100%", height: "100%" }}
            />
          </Reveal>
        </div>
      </div>

      <div className="container-tr mt-12 flex justify-center">
        <button className="btn-tr">Ver lookbook completo →</button>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.marcas,
    queryFn: marcasService.list,
  });

  return (
    <div className="page">
      <Hero />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BrandsMarquee />
        <ManifestoSection />
        <BrandsStrip />
        <FeaturedProduct />
        <RitualSection />
        <ValuesSection />
        <LookbookTeaser />
        <Testimonials />
      </HydrationBoundary>
    </div>
  );
}
