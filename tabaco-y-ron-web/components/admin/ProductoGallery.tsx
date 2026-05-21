"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Un elemento de la galería puede estar:
 *  · `uploaded`: ya subido (tiene URL pública, persistido o por persistir).
 *  · `pending`: seleccionado localmente, aún sin subir. Guarda el `File` y una
 *    URL de previsualización (object URL). La subida real ocurre al guardar el
 *    producto, no al seleccionar — así no quedan archivos huérfanos si se cancela.
 */
export type GalleryItem =
  | { kind: "uploaded"; url: string; tipo: string }
  | { kind: "pending"; file: File; preview: string; tipo: string };

const srcOf = (item: GalleryItem) => (item.kind === "uploaded" ? item.url : item.preview);

/**
 * Galería del producto en columna: la imagen principal (índice 0) en grande
 * arriba, y las secundarias en miniaturas debajo. Permite seleccionar varias,
 * marcar cualquiera como principal (la mueve al inicio) y reordenar. No sube
 * nada: solo gestiona la lista; el formulario sube las pendientes al guardar.
 */
export default function ProductoGallery({
  value,
  onChange,
}: {
  value: GalleryItem[];
  onChange: (imagenes: GalleryItem[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  // Object URLs creados, para revocarlos al desmontar y no filtrar memoria.
  const objectUrls = useRef<Set<string>>(new Set());
  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const additions: GalleryItem[] = Array.from(files).map((file) => {
      const preview = URL.createObjectURL(file);
      objectUrls.current.add(preview);
      return { kind: "pending", file, preview, tipo: "detalle" };
    });
    onChange([...value, ...additions]);
  };

  const removeAt = (idx: number) => {
    const item = value[idx];
    if (item.kind === "pending") {
      URL.revokeObjectURL(item.preview);
      objectUrls.current.delete(item.preview);
    }
    onChange(value.filter((_, i) => i !== idx));
  };

  const makePrincipal = (idx: number) => {
    if (idx === 0) return;
    const next = [...value];
    const [item] = next.splice(idx, 1);
    next.unshift(item);
    onChange(next);
  };

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const principal = value[0];
  const resto = value.slice(1);
  const openPicker = () => inputRef.current?.click();

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-cream-mute">
        Galería
      </span>

      {/* Imagen principal (grande) */}
      <div
        onClick={!principal ? openPicker : undefined}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`group relative aspect-square w-full overflow-hidden border bg-coal ${
          dragging ? "border-gold" : "border-line"
        } ${!principal ? "cursor-pointer hover:border-line-strong" : ""}`}
      >
        {principal ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={srcOf(principal)} alt="Imagen principal" className="h-full w-full object-cover" />
            <span className="absolute left-0 top-0 bg-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-coal">
              Principal
            </span>
            {principal.kind === "pending" && (
              <span className="absolute right-1 bottom-1 bg-black/70 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em] text-gold">
                Sin subir
              </span>
            )}
            <button
              type="button"
              aria-label="Eliminar imagen principal"
              onClick={() => removeAt(0)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-black/60 text-cream-mute opacity-0 transition-opacity hover:text-crimson group-hover:opacity-100"
            >
              ×
            </button>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-[11px] uppercase tracking-[0.14em] text-cream-mute">
            <span className="text-2xl text-gold">+</span>
            Seleccionar imagen principal
          </div>
        )}
      </div>

      {/* Miniaturas secundarias + añadir */}
      <div className="grid grid-cols-3 gap-2">
        {resto.map((img, i) => {
          const idx = i + 1; // posición real en value
          return (
            <div
              key={`${srcOf(img)}-${idx}`}
              className="group relative aspect-square overflow-hidden border border-line bg-coal"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={srcOf(img)} alt="" className="h-full w-full object-cover" />
              {img.kind === "pending" && (
                <span className="absolute left-0 bottom-0 bg-black/70 px-1 text-[8px] uppercase tracking-[0.1em] text-gold">
                  Sin subir
                </span>
              )}
              <div className="absolute inset-0 flex flex-col justify-between bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex justify-between p-1">
                  <button
                    type="button"
                    aria-label="Mover antes"
                    onClick={() => move(idx, -1)}
                    className="px-1 text-sm text-cream-mute hover:text-gold"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    aria-label="Eliminar"
                    onClick={() => removeAt(idx)}
                    className="px-1 text-sm text-cream-mute hover:text-crimson"
                  >
                    ×
                  </button>
                  <button
                    type="button"
                    aria-label="Mover después"
                    onClick={() => move(idx, 1)}
                    className="px-1 text-sm text-cream-mute hover:text-gold"
                  >
                    ›
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => makePrincipal(idx)}
                  className="bg-gold/90 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-coal hover:bg-gold"
                >
                  ★ Principal
                </button>
              </div>
            </div>
          );
        })}

        {principal && (
          <button
            type="button"
            onClick={openPicker}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
            className="flex aspect-square items-center justify-center border border-dashed border-line text-center text-[10px] uppercase tracking-[0.12em] text-cream-mute transition-colors hover:border-line-strong"
          >
            + Añadir
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <span className="text-[11px] leading-snug text-muted">
        Las imágenes se suben al guardar el producto. La principal será la portada del catálogo.
        Pasa el cursor sobre una miniatura para marcarla como principal, reordenar o eliminar.
        Máx. 5MB c/u.
      </span>
    </div>
  );
}
