"use client";

/**
 * Headline del hero — tres líneas con animación letra a letra (opacity +
 * translateY + blur que se desenfoca). El delay base por línea junto con un
 * incremento por letra le da el efecto "se va escribiendo" cinematográfico.
 */
const LINES: ReadonlyArray<{
  text: string;
  italic: boolean;
  color: string;
  delayBase: number;
}> = [
  { text: "El arte", italic: false, color: "#F5F1EA", delayBase: 0.3 },
  {
    text: "de fumar",
    italic: true,
    color: "var(--color-gold-pure)",
    delayBase: 0.85,
  },
  { text: "con calma.", italic: false, color: "#F5F1EA", delayBase: 1.3 },
];

export default function AnimatedHeadline() {
  return (
    <h1
      className="letters"
      style={{
        fontSize: "clamp(54px, 9.2vw, 148px)",
        lineHeight: 0.94,
        fontWeight: 500,
        letterSpacing: "-0.025em",
        color: "#F5F1EA",
        textWrap: "balance",
        textShadow: "0 2px 24px rgba(0,0,0,0.25)",
        margin: 0,
      }}
    >
      {LINES.map((line, li) => (
        <span key={li} style={{ display: "block", whiteSpace: "nowrap" }}>
          {[...line.text].map((ch, ci) => (
            <span
              key={ci}
              style={{
                fontStyle: line.italic ? "italic" : "normal",
                fontWeight: line.italic ? 400 : 500,
                color: line.color,
                animationDelay: `${line.delayBase + ci * 0.035}s`,
              }}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
