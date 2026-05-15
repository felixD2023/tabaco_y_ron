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
      className="shrink-0 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] transition-all"
      style={{
        border: active ? "1px solid var(--color-gold)" : "1px solid var(--color-line)",
        background: active ? "var(--color-gold)" : "transparent",
        color: active ? "var(--color-coal)" : "var(--color-cream-mute)",
      }}
    >
      {label}
    </button>
  );
}

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
          <div className="mb-[18px] font-serif text-sm italic text-gold">— {num} —</div>
        )}
        {eyebrow && <div className="eyebrow mb-[18px]">{eyebrow}</div>}
        <h2 className="max-w-[720px] text-[34px] leading-[1.05] md:text-5xl lg:text-[64px]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
