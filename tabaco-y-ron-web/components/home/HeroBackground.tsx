"use client";

import Placeholder from "@/components/Placeholder";
import useParallax from "@/hooks/use-parallax";

/**
 * Imagen de fondo del hero con un parallax sutil. Se monta más alta que el
 * viewport (inset: -8% 0) para que el desplazamiento por scroll no exponga
 * bordes vacíos.
 */
export default function HeroBackground() {
  const ref = useParallax<HTMLDivElement>(0.12);
  return (
    <div
      ref={ref}
      className="absolute inset-x-0 z-0"
      style={{ top: "-8%", bottom: "-8%" }}
    >
      <Placeholder
        tag="hero"
        seed="tr-home-hero-bg"
        variant="warm"
        eager
        className="absolute inset-0"
        style={{ position: "absolute", inset: 0 }}
      />
    </div>
  );
}
