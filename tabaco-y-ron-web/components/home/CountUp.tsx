"use client";

import { useEffect, useMemo, useState } from "react";

type Part = { text: string } | { num: number };

/**
 * Anima cualquier string con números desde 0 hasta su valor real, preservando
 * separadores ("22", "600+", "70/70"). Cuando `trigger` es true arranca un raf
 * loop con easing ease-out quartic (rápido al inicio, asienta al final).
 */
export default function CountUp({
  value,
  durationMs = 2800,
  trigger = true,
}: {
  value: string;
  durationMs?: number;
  trigger?: boolean;
}) {
  const parts = useMemo<Part[]>(() => {
    const result: Part[] = [];
    const regex = /(\d+)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(value)) !== null) {
      if (m.index > last) result.push({ text: value.slice(last, m.index) });
      result.push({ num: Number(m[0]) });
      last = m.index + m[0].length;
    }
    if (last < value.length) result.push({ text: value.slice(last) });
    return result;
  }, [value]);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!trigger) {
      setProgress(0);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 4); // ease-out quartic
      setProgress(eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [trigger, durationMs]);

  return (
    <>
      {parts.map((p, i) =>
        "num" in p ? (
          <span key={i}>{Math.round(p.num * progress)}</span>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}
