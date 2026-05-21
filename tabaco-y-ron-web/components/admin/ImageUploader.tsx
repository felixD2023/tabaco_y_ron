"use client";

import { useRef, useState } from "react";

import useUploadsService from "@/hooks/use-uploads-service";
import { getApiErrorMessage } from "@/lib/api-error";

import { useToast } from "./Toast";

/**
 * Sube una imagen al backend (`POST /uploads/imagen`) y devuelve la URL pública
 * resultante a través de `onChange`. Muestra una previsualización del valor
 * actual. Se usa `<img>` nativo a propósito: es herramienta interna `noindex`,
 * la URL puede provenir de cualquier host devuelto por el backend.
 */
export default function ImageUploader({
  value,
  onChange,
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { useUploadImagen } = useUploadsService();
  const upload = useUploadImagen();
  const toast = useToast();
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    upload.mutate(file, {
      onSuccess: (data) => onChange(data.url),
      onError: (err) => toast.error(getApiErrorMessage(err, "No se pudo subir la imagen")),
    });
  };

  return (
    <div className="flex items-start gap-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex h-28 w-28 shrink-0 cursor-pointer items-center justify-center overflow-hidden border text-center text-[10px] uppercase tracking-[0.14em] transition-colors ${
          dragging ? "border-gold bg-coal-raised" : "border-line bg-coal-soft hover:border-line-strong"
        }`}
      >
        {upload.isPending ? (
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Previsualización" className="h-full w-full object-cover" />
        ) : (
          <span className="px-2 text-cream-mute">Subir / arrastrar</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="border border-line px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-mute transition-colors hover:border-gold hover:text-gold"
        >
          {value ? "Cambiar" : "Seleccionar"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="px-1 text-left text-[11px] uppercase tracking-[0.14em] text-crimson/80 hover:text-crimson"
          >
            Quitar imagen
          </button>
        )}
        <span className="max-w-[180px] text-[11px] text-muted">JPG, PNG, WEBP o GIF · máx. 5MB</span>
      </div>
    </div>
  );
}
