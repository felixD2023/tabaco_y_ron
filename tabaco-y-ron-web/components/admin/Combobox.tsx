"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type ComboOption = { value: string; label: string };

/**
 * Selector con búsqueda (combobox). Filtra las opciones por texto y permite
 * navegación con teclado. `value` es el `value` de la opción seleccionada
 * ("" = ninguna). Llama a `onChange` con el nuevo value.
 */
export default function Combobox({
  options,
  value,
  onChange,
  placeholder = "Buscar…",
  disabled = false,
  emptyLabel = "Sin resultados",
}: {
  options: ComboOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyLabel?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);

  const selected = useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  // Cierra al hacer clic fuera.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (opt: ComboOption) => {
    onChange(opt.value);
    setOpen(false);
    setQuery("");
  };

  // Texto que se muestra en el input: la búsqueda en curso o la etiqueta seleccionada.
  const display = open ? query : selected?.label ?? "";

  const inputClass =
    "w-full bg-coal-soft border border-line px-3 py-2.5 text-sm text-cream placeholder:text-muted transition-colors focus:border-gold focus:outline-none disabled:opacity-50";

  return (
    <div ref={wrapRef} className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls="combobox-list"
        autoComplete="off"
        disabled={disabled}
        className={inputClass}
        placeholder={selected ? selected.label : placeholder}
        value={display}
        onFocus={() => {
          setOpen(true);
          setHighlight(0);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setHighlight(0);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setHighlight((h) => Math.min(h + 1, filtered.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => Math.max(h - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            if (open && filtered[highlight]) choose(filtered[highlight]);
          } else if (e.key === "Escape") {
            setOpen(false);
            setQuery("");
          }
        }}
      />
      {/* Indicador / limpiar */}
      {value && !disabled && (
        <button
          type="button"
          aria-label="Limpiar selección"
          onClick={() => {
            onChange("");
            setQuery("");
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-cream-mute hover:text-cream"
        >
          ×
        </button>
      )}

      {open && !disabled && (
        <ul
          id="combobox-list"
          role="listbox"
          className="absolute z-30 mt-1 max-h-60 w-full overflow-y-auto border border-line-strong bg-coal-raised shadow-xl"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2.5 text-sm text-muted">{emptyLabel}</li>
          ) : (
            filtered.map((opt, idx) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(opt);
                }}
                onMouseEnter={() => setHighlight(idx)}
                className={`cursor-pointer px-3 py-2.5 text-sm transition-colors ${
                  idx === highlight ? "bg-coal-soft text-gold" : "text-cream"
                } ${opt.value === value ? "font-semibold" : ""}`}
              >
                {opt.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
