"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Observa el elemento y devuelve `visible = true` la primera vez que cruza el
 * viewport. Pareja del CSS `.reveal` / `.is-visible` y los componentes que
 * combinen opacity + transform con backdrop-filter (que rompe con un transform
 * en un ancestro, así que en esos casos animar solo opacity).
 */
export default function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12, ...options },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, visible];
}
