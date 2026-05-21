"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { AdminButton } from "./ui";

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  // El portal monta el modal en <body>, fuera de cualquier ancestro con
  // `transform` (p. ej. el contenedor `.page` animado), que de lo contrario se
  // convertiría en el bloque contenedor del `position: fixed` y recortaría el
  // overlay al área de contenido.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const maxW = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl", xl: "max-w-5xl" }[size];

  return createPortal(
    <div
      className="anim-fade-in fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`anim-slide-up my-auto w-full ${maxW} border border-line-strong bg-coal-soft shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-serif text-xl text-cream">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-2xl leading-none text-cream-mute transition-colors hover:text-cream"
          >
            ×
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-line px-6 py-4">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Eliminar",
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <AdminButton variant="ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </AdminButton>
          <AdminButton variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </AdminButton>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-cream-mute">{message}</p>
    </Modal>
  );
}
