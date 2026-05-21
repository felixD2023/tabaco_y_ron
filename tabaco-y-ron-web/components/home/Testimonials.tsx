"use client";

import { useEffect, useState } from "react";

import { TESTIMONIALS } from "@/lib/data";

export default function Testimonials() {
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
