"use client";

import useReveal from "@/hooks/use-reveal";

import CountUp from "./CountUp";

const METRICS: ReadonlyArray<readonly [string, string]> = [
  ["22", "años en Panamá"],
  ["600+", "referencias premium"],
  ["19", "marcas en catálogo"],
  ["35", "años de oficio"],
];

/**
 * Barra inferior del hero con cuatro métricas. Cuando la barra entra en
 * viewport, los números cuentan simultáneamente desde 0 con easing quartic
 * y la fila aparece con un stagger sutil de opacidad por elemento.
 */
export default function HeroMetricsBar() {
  const [ref, visible] = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="absolute inset-x-0 bottom-0 z-[5]"
      style={{
        background: "rgba(15,12,10,0.50)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        borderTop: "1px solid rgba(196,168,98,0.28)",
      }}
    >
      <div className="container-tr grid grid-cols-2 gap-x-4 gap-y-3.5 py-[18px] md:grid-cols-4 md:gap-0 md:py-[26px]">
        {METRICS.map(([n, l], i) => (
          <div
            key={l}
            className="flex items-baseline gap-2.5 md:gap-4 md:pr-6"
            style={{
              borderRight: i < 3 ? "1px solid rgba(245,241,234,0.14)" : "none",
              opacity: visible ? 1 : 0,
              transition: `opacity .6s ease ${0.05 * i}s`,
            }}
          >
            <span
              className="font-serif leading-none"
              style={{
                fontSize: "clamp(26px, 3vw, 40px)",
                fontWeight: 500,
                letterSpacing: "-0.025em",
                color: "var(--color-gold-pure)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <CountUp value={n} trigger={visible} durationMs={2800} />
            </span>
            <span
              className="uppercase"
              style={{
                fontSize: "clamp(9px, 0.85vw, 10.5px)",
                letterSpacing: "0.24em",
                color: "rgba(245,241,234,0.65)",
              }}
            >
              {l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
