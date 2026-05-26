"use client";

import { useEffect, useRef } from "react";

/**
 * Parallax sutil — modula `transform: translateY` del elemento según su
 * distancia al centro del viewport. Throttled con `requestAnimationFrame`.
 *
 * Strength 0.08 ~ 0.18 da buenos resultados sin sentirse exagerado.
 * Respeta `prefers-reduced-motion`.
 */
export default function useParallax<T extends HTMLElement = HTMLDivElement>(
  strength = 0.18,
): React.RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    let raf: number | null = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const winCenter = window.innerHeight / 2;
        const offset = (center - winCenter) * -strength;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        raf = null;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return ref;
}
