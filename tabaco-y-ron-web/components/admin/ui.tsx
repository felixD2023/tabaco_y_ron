"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

/* ============================================================
   Primitivas de UI del panel de administración.
   Reutilizan los tokens de diseño de globals.css (coal/gold/cream).
   ============================================================ */

type Variant = "solid" | "outline" | "ghost" | "danger";

const VARIANT_CLASS: Record<Variant, string> = {
  solid: "bg-gold text-ink border border-gold hover:bg-gold-bright hover:border-gold-bright",
  outline: "bg-transparent text-gold border border-gold hover:bg-gold hover:text-ink",
  ghost:
    "bg-transparent text-cream-mute border border-line hover:border-line-strong hover:text-cream",
  danger:
    "bg-transparent text-crimson border border-crimson/60 hover:bg-crimson hover:text-cream",
};

export function AdminButton({
  variant = "solid",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] transition-all disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASS[variant]} ${className}`}
    >
      {loading && (
        <span className="inline-block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-cream-mute">
        {label}
        {required && <span className="text-crimson"> *</span>}
      </span>
      {children}
      {hint && !error && <span className="text-xs text-muted">{hint}</span>}
      {error && <span className="text-xs text-crimson">{error}</span>}
    </label>
  );
}

const inputClass =
  "w-full bg-coal-soft border border-line px-3 py-2.5 text-sm text-cream placeholder:text-muted transition-colors focus:border-gold focus:outline-none disabled:opacity-50";

export const AdminInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function AdminInput({ className = "", ...props }, ref) {
    return <input ref={ref} className={`${inputClass} ${className}`} {...props} />;
  },
);

export const AdminTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function AdminTextarea({ className = "", ...props }, ref) {
  return <textarea ref={ref} className={`${inputClass} resize-y ${className}`} {...props} />;
});

export const AdminSelect = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function AdminSelect({ className = "", children, ...props }, ref) {
  return (
    <select ref={ref} className={`${inputClass} appearance-none ${className}`} {...props}>
      {children}
    </select>
  );
});

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "gold" | "green" | "red";
}) {
  const tones: Record<string, string> = {
    neutral: "border-line text-cream-mute",
    gold: "border-gold/50 text-gold",
    green: "border-emerald-500/40 text-emerald-400",
    red: "border-crimson/50 text-crimson",
  };
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-line bg-coal-soft ${className}`}>{children}</div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-cream-mute">
      <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      {label && <span className="text-xs uppercase tracking-[0.2em]">{label}</span>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-line px-6 py-16 text-center">
      <h3 className="font-serif text-2xl text-cream">{title}</h3>
      {description && <p className="max-w-sm text-sm text-cream-mute">{description}</p>}
      {action}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-3xl text-cream lg:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-cream-mute">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
