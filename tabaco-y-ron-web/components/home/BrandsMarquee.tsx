"use client";

import useMarcasService from "@/hooks/use-marcas-service";

/**
 * Cinta horizontal con scroll infinito de marcas, justo bajo el hero. Se
 * duplica el array para que el loop CSS de 40s no se note. Pausa al hover.
 * Reutiliza el `useList()` ya hidratado por el SSR del home.
 */
export default function BrandsMarquee() {
  const { useList } = useMarcasService();
  const { data: marcas } = useList();

  if (!marcas || marcas.length === 0) return null;

  const items = [...marcas, ...marcas];

  return (
    <div
      className="marquee relative overflow-hidden"
      style={{
        background: "var(--color-paper-base)",
        borderTop: "1px solid var(--color-line)",
        borderBottom: "1px solid var(--color-line)",
        padding: "28px 0",
      }}
    >
      <div className="marquee-track">
        {items.map((m, i) => (
          <div
            key={`${m.id}-${i}`}
            className="flex items-center gap-6 whitespace-nowrap font-serif"
            style={{
              fontSize: 28,
              color: "var(--color-ink)",
              fontWeight: 500,
            }}
          >
            <span
              className="italic"
              style={{ color: "var(--color-gold)", fontSize: 14 }}
            >
              —
            </span>
            {m.nombre}
            <span
              className="font-sans font-semibold uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "0.24em",
                color: "var(--color-ink-mute)",
              }}
            >
              {m.total_productos}{" "}
              {m.total_productos === 1 ? "pieza" : "piezas"}
            </span>
            <span
              className="ml-4 inline-block"
              style={{
                width: 6,
                height: 6,
                background: "var(--color-gold)",
                transform: "rotate(45deg)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
