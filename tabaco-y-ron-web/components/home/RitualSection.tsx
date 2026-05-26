import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import { SectionHead } from "@/components/ui";
import type { ImgTag } from "@/lib/images";

type Step = {
  n: string;
  title: string;
  tag: ImgTag;
  desc: string;
};

const STEPS: ReadonlyArray<Step> = [
  {
    n: "01",
    title: "La elección",
    tag: "cigar",
    desc: "Elija la pieza según el tiempo del que dispone. Nunca al revés. Una sesión que se interrumpe es una sesión perdida.",
  },
  {
    n: "02",
    title: "El corte",
    tag: "hands",
    desc: "Limpio, recto, justo por encima del hombro de la perilla. Sin presión innecesaria. La capa lo agradece.",
  },
  {
    n: "03",
    title: "La encendida",
    tag: "lighter",
    desc: "Pie a centímetro y medio del fuego, en rotación lenta. La primera bocanada nunca se cuenta. Solo se observa.",
  },
];

/**
 * "El ritual" — tres pasos editoriales conectados por una hairline dorada que
 * cruza horizontalmente al alto de las imágenes en desktop. Cada paso entra
 * con stagger al cruzar el viewport.
 */
export default function RitualSection() {
  return (
    <section
      className="relative overflow-hidden py-16 md:py-24 lg:py-[120px]"
      style={{ background: "var(--color-paper-base)" }}
    >
      <div
        className="blob gold"
        style={{ width: 520, height: 520, top: "20%", right: "-10%" }}
        aria-hidden
      />
      <div className="container-tr relative">
        <Reveal>
          <SectionHead
            num="II·5"
            eyebrow="El ritual"
            title={
              <>
                Tres gestos.{" "}
                <span className="italic" style={{ color: "var(--color-gold)" }}>
                  Diez minutos.
                </span>
              </>
            }
          />
        </Reveal>

        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-9">
          {/* Línea conectora horizontal (desktop) */}
          <span
            aria-hidden
            className="absolute hidden md:block"
            style={{
              top: "34%",
              left: "8%",
              right: "8%",
              height: 1,
              background:
                "linear-gradient(90deg, transparent, var(--color-line-gold) 20%, var(--color-line-gold) 80%, transparent)",
              zIndex: 0,
            }}
          />
          {STEPS.map((s, i) => (
            <Reveal
              key={s.n}
              delay={(i + 1) as 1 | 2 | 3}
              className="relative z-[1]"
            >
              <Placeholder
                label={s.title.toLowerCase()}
                tag={s.tag}
                seed={`tr-ritual-${s.n}`}
                variant="warm"
                className="relative mb-6"
                style={{ aspectRatio: "1/1" }}
              >
                <span
                  className="absolute top-4 left-4 z-[4] font-serif text-base italic"
                  style={{
                    color: "var(--color-gold-pure)",
                    background: "rgba(15,12,10,0.55)",
                    padding: "4px 10px",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                  }}
                >
                  — {s.n} —
                </span>
              </Placeholder>
              <h3
                className="mb-3.5 leading-tight"
                style={{
                  fontSize: "clamp(28px, 3vw, 36px)",
                  color: "var(--color-ink)",
                  fontWeight: 500,
                }}
              >
                {s.title}
              </h3>
              <p
                className="text-[14.5px] leading-[1.75]"
                style={{ color: "var(--color-ink-2)" }}
              >
                {s.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
