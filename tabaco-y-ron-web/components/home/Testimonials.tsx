"use client";

import { useEffect, useState } from "react";

import Reveal from "@/components/Reveal";
import { TESTIMONIALS } from "@/lib/data";
import { ambientUrl } from "@/lib/images";

const BG_URL = ambientUrl("tr-testimonial-window", "interior");

/**
 * Testimonios "ventana" — la imagen de fondo queda anclada al viewport con
 * `background-attachment: fixed` (clase .bg-window), de modo que al hacer
 * scroll el contenido se desliza por encima como si fuera un marco editorial.
 * Autoplay 7s, navegable con flechas y dots.
 */
export default function Testimonials() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % TESTIMONIALS.length),
      7000,
    );
    return () => clearInterval(t);
  }, []);

  const t = TESTIMONIALS[idx];
  const prev = () =>
    setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setIdx((i) => (i + 1) % TESTIMONIALS.length);

  return (
    <section
      className="bg-window relative overflow-hidden py-[120px] md:py-[180px]"
      style={{
        color: "#F5F1EA",
        backgroundImage: `url("${BG_URL}")`,
      }}
    >
      {/* Overlay cinematográfico */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: [
            "radial-gradient(ellipse at 50% 40%, rgba(15,12,10,0.10) 0%, rgba(15,12,10,0.78) 90%)",
            "linear-gradient(180deg, rgba(15,12,10,0.65) 0%, rgba(15,12,10,0.45) 50%, rgba(15,12,10,0.78) 100%)",
          ].join(", "),
        }}
      />

      {/* Blobs flotantes (desktop) */}
      <div
        aria-hidden
        className="blob gold float-y hidden md:block"
        style={{
          width: 420,
          height: 420,
          top: "8%",
          left: "6%",
          opacity: 0.22,
          zIndex: 1,
        }}
      />
      <div
        aria-hidden
        className="blob gold float-x hidden md:block"
        style={{
          width: 360,
          height: 360,
          bottom: "8%",
          right: "6%",
          opacity: 0.18,
          zIndex: 1,
          animationDelay: "3s",
        }}
      />

      {/* Watermark gigante " */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-[1] select-none italic"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "var(--font-serif)",
          color: "rgba(196,168,98,0.08)",
          fontSize: "clamp(280px, 42vw, 620px)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
        }}
      >
        &ldquo;
      </div>

      <div className="container-tr relative z-[2] mx-auto max-w-[1180px]">
        <Reveal>
          <div className="mb-9 flex items-center justify-center gap-3.5 md:mb-14">
            <span
              className="block h-px w-10"
              style={{ background: "var(--color-gold-pure)" }}
            />
            <span
              className="text-[10.5px] font-bold uppercase tracking-[0.36em]"
              style={{ color: "var(--color-gold-pure)" }}
            >
              VI{" "}
              <span
                className="diamond"
                style={{ background: "var(--color-gold-pure)" }}
              />{" "}
              Cartas de clientes
            </span>
            <span
              className="block h-px w-10"
              style={{ background: "var(--color-gold-pure)" }}
            />
          </div>
        </Reveal>

        <Reveal delay={1}>
          <blockquote key={idx} className="fade-up m-0 p-0">
            <p
              className="m-0 text-center font-serif italic"
              style={{
                fontSize: "clamp(24px, 4.6vw, 46px)",
                lineHeight: 1.35,
                color: "#F5F1EA",
                letterSpacing: "-0.015em",
                textWrap: "balance",
                textShadow: "0 2px 24px rgba(0,0,0,0.4)",
              }}
            >
              <span
                className="font-serif"
                style={{
                  color: "var(--color-gold-pure)",
                  marginRight: 8,
                  fontSize: "1.2em",
                  lineHeight: 0,
                  verticalAlign: "-0.2em",
                }}
              >
                &ldquo;
              </span>
              {t.quote}
              <span
                className="font-serif"
                style={{
                  color: "var(--color-gold-pure)",
                  marginLeft: 8,
                  fontSize: "1.2em",
                  lineHeight: 0,
                  verticalAlign: "-0.2em",
                }}
              >
                &rdquo;
              </span>
            </p>
          </blockquote>
        </Reveal>

        <Reveal delay={2}>
          <div className="mt-10 flex flex-col items-center gap-[18px] md:mt-14">
            {/* Avatar circular con inicial */}
            <div
              className="flex items-center justify-center font-serif italic"
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "1px solid var(--color-gold-pure)",
                color: "var(--color-gold-pure)",
                fontSize: 22,
                fontWeight: 500,
              }}
            >
              {t.author.charAt(0)}
            </div>
            <div className="text-center">
              <div
                className="font-serif"
                style={{ fontSize: "clamp(18px, 1.8vw, 22px)", color: "#F5F1EA" }}
              >
                {t.author}
              </div>
              <div
                className="mt-2.5 text-[10.5px] uppercase"
                style={{
                  letterSpacing: "0.24em",
                  color: "rgba(245,241,234,0.55)",
                }}
              >
                {t.role}{" "}
                <span
                  className="diamond"
                  style={{ background: "var(--color-gold-pure)" }}
                />{" "}
                {t.city}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Navegación */}
        <div className="mt-12 flex items-center justify-center gap-6 md:mt-[72px]">
          <button
            onClick={prev}
            aria-label="Anterior testimonio"
            className="testi-arrow flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              border: "1px solid rgba(245,241,234,0.32)",
              color: "#F5F1EA",
              cursor: "pointer",
              transition: "all .2s",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Testimonio ${i + 1}`}
                className="cursor-pointer transition-all"
                style={{
                  width: i === idx ? 40 : 8,
                  height: 2,
                  background:
                    i === idx
                      ? "var(--color-gold-pure)"
                      : "rgba(245,241,234,0.32)",
                  border: "none",
                  padding: 0,
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Siguiente testimonio"
            className="testi-arrow flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              border: "1px solid rgba(245,241,234,0.32)",
              color: "#F5F1EA",
              cursor: "pointer",
              transition: "all .2s",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Contador editorial */}
        <div
          className="mt-7 text-center font-serif italic"
          style={{
            color: "rgba(245,241,234,0.55)",
            fontSize: 13,
          }}
        >
          {String(idx + 1).padStart(2, "0")}{" "}
          <span style={{ margin: "0 8px", color: "var(--color-gold-pure)" }}>
            —
          </span>{" "}
          {String(TESTIMONIALS.length).padStart(2, "0")}
        </div>
      </div>

      <style>{`
        .testi-arrow:hover {
          background: var(--color-gold-pure);
          color: var(--color-graphite) !important;
          border-color: var(--color-gold-pure) !important;
        }
      `}</style>
    </section>
  );
}
