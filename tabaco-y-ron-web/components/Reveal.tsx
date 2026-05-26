"use client";

import type { CSSProperties, ReactNode } from "react";

import useReveal from "@/hooks/use-reveal";

type Direction = "up" | "down" | "left" | "right" | "zoom";

/**
 * Aparece al cruzar el viewport con fade + slide direccional. Combina con las
 * clases `.reveal` de globals.css. Usa `delay` 1..5 para escalonar entradas
 * dentro de un grid sin tener que calcular delays a mano.
 */
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
  style,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  className?: string;
  style?: CSSProperties;
}) {
  const [ref, visible] = useReveal<HTMLDivElement>();
  const dirClass = direction !== "up" ? `reveal-${direction}` : "";
  const delayClass = delay ? `reveal-d${delay}` : "";
  return (
    <div
      ref={ref}
      className={`reveal ${dirClass} ${delayClass} ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}
