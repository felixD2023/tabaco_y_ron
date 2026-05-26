import Reveal from "@/components/Reveal";
import { SectionHead } from "@/components/ui";

const VALUES: ReadonlyArray<readonly [string, string]> = [
  ["Variedad", "600+ referencias. La respuesta siempre está aquí."],
  ["Honestidad", "Decimos la verdad aunque no sea lo que el cliente quiere escuchar."],
  ["Lealtad", "Con nuestros clientes, nuestras marcas y nuestro equipo."],
  ["Garantía", "Cada producto que vendemos lo respaldamos con nuestra reputación."],
  ["Respeto", "Por la cultura del tabaco, por el cliente y por los maestros del oficio."],
  ["Lujo", "Premium no es caro. Premium es exacto, cuidado y excepcional."],
  ["Exclusividad", "Lo que aquí se encuentra no se encuentra en otro lado."],
  ["Fidelidad", "22 años construyendo relaciones que duran más que una caja de puros."],
];

/**
 * Los 8 principios del manual sobre grafito. T&R gigante italic saliendo de
 * la esquina inferior derecha y un halo dorado acompañando. Cada card entra
 * con stagger por columna y tiene hover sutil (oscurece + borde gold).
 */
export default function ValuesSection() {
  return (
    <section
      className="inverse relative overflow-hidden py-16 md:py-24 lg:py-[120px]"
      style={{ background: "var(--color-graphite)" }}
    >
      {/* T&R gigante saliendo de la esquina inferior derecha */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          bottom: "-10%",
          right: "-6%",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          color: "var(--color-gold-pure)",
          opacity: 0.18,
          fontSize: "clamp(260px, 36vw, 540px)",
          lineHeight: 0.82,
          letterSpacing: "-0.06em",
          userSelect: "none",
          zIndex: 0,
          whiteSpace: "nowrap",
          fontWeight: 500,
        }}
      >
        T&amp;R
      </div>

      {/* Halo gold en la misma esquina */}
      <div
        aria-hidden
        className="blob gold"
        style={{
          width: "min(600px, 60vw)",
          height: "min(600px, 60vw)",
          bottom: "-15%",
          right: "-10%",
          opacity: 0.28,
        }}
      />

      <div className="container-tr relative z-[2]">
        <Reveal>
          <SectionHead
            num="IV"
            eyebrow="Lo que somos"
            title={
              <span style={{ color: "var(--color-paper)" }}>
                Ocho principios.{" "}
                <span
                  className="italic"
                  style={{ color: "var(--color-gold-pure)" }}
                >
                  Cero atajos.
                </span>
              </span>
            }
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {VALUES.map(([title, desc], i) => {
            const delay = (Math.min((i % 4) + 1, 5)) as 1 | 2 | 3 | 4 | 5;
            return (
              <Reveal key={title} direction="up" delay={delay}>
                <div className="value-card relative flex h-full flex-col overflow-hidden px-7 py-9 md:min-h-[220px]">
                  {/* Brillo sutil interior superior */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0"
                    style={{
                      height: 1,
                      background:
                        "linear-gradient(90deg, transparent, rgba(245,241,234,0.18), transparent)",
                    }}
                  />
                  <div
                    className="mb-4 font-serif text-[13px] italic"
                    style={{ color: "var(--color-gold-pure)" }}
                  >
                    — {String(i + 1).padStart(2, "0")} —
                  </div>
                  <h3
                    className="mb-3.5 font-sans text-[22px] font-semibold uppercase leading-[1.2]"
                    style={{
                      color: "var(--color-paper)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-[13.5px] leading-[1.7]"
                    style={{ color: "rgba(245,241,234,0.78)" }}
                  >
                    {desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <style>{`
        .value-card {
          background: rgba(31, 29, 27, 0.72);
          border: 1px solid rgba(196, 168, 98, 0.22);
          transition: background .3s ease, border-color .3s ease;
        }
        .value-card:hover {
          background: rgba(31, 29, 27, 0.86);
          border-color: rgba(196, 168, 98, 0.50);
        }
      `}</style>
    </section>
  );
}
