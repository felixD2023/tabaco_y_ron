import type { ReactNode } from "react";

export function Logo({ size = 17 }: { size?: number }) {
  return (
    <span
      className="logo-pill"
      style={{
        fontSize: `${size}px`,
        padding: `${size * 0.45}px ${size * 1.05}px ${size * 0.55}px`,
      }}
    >
      Tabaco &amp; Ron
    </span>
  );
}

export function Monogram({ size = 28 }: { size?: number }) {
  return (
    <span
      className="logo-pill"
      style={{
        fontSize: `${size}px`,
        padding: `${size * 0.25}px ${size * 0.7}px ${size * 0.35}px`,
        letterSpacing: 0,
      }}
    >
      T&amp;R
    </span>
  );
}

export function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.22em] transition-all"
      style={{
        border: active
          ? "1px solid var(--color-ink)"
          : "1px solid var(--color-line-strong)",
        background: active ? "var(--color-ink)" : "transparent",
        color: active ? "var(--color-paper)" : "var(--color-ink-2)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

/**
 * Cabecera editorial — número romano italic + eyebrow + título 68px.
 * Acepta `action` (botón a la derecha) para layouts "ver todas" estilo strip.
 */
export function SectionHead({
  eyebrow,
  title,
  action,
  num,
}: {
  eyebrow?: string;
  title: ReactNode;
  action?: ReactNode;
  num?: string;
}) {
  return (
    <div className="mb-9 flex flex-col items-start gap-6 md:mb-12 lg:mb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
      <div>
        {num && (
          <div className="mb-[18px] font-serif text-[14px] italic text-gold">
            — {num} —
          </div>
        )}
        {eyebrow && <div className="eyebrow mb-[18px]">{eyebrow}</div>}
        <h2
          className="max-w-[760px] leading-[1.02]"
          style={{
            fontSize: "clamp(36px, 5.5vw, 68px)",
            letterSpacing: "-0.015em",
          }}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
