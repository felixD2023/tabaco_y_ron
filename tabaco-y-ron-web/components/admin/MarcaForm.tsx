"use client";

import { useState } from "react";

import useMarcasService from "@/hooks/use-marcas-service";
import { getApiErrorMessage } from "@/lib/api-error";
import type { Marca } from "@/types/api";

import ImageUploader from "./ImageUploader";
import Modal from "./Modal";
import { useToast } from "./Toast";
import { AdminButton, AdminInput, Field } from "./ui";

export default function MarcaForm({
  open,
  onClose,
  marca,
}: {
  open: boolean;
  onClose: () => void;
  marca?: Marca | null;
}) {
  const isEdit = Boolean(marca);
  const toast = useToast();
  const { useCreate, useUpdate } = useMarcasService();
  const create = useCreate();
  const update = useUpdate();

  const [nombre, setNombre] = useState(marca?.nombre ?? "");
  const [imagen, setImagen] = useState<string | null>(marca?.imagen ?? null);
  const [error, setError] = useState<string | null>(null);

  const submitting = create.isPending || update.isPending;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setError(null);
    const onSuccess = (msg: string) => () => {
      toast.success(msg);
      onClose();
    };
    const onError = (err: unknown) => toast.error(getApiErrorMessage(err));

    if (isEdit && marca) {
      update.mutate(
        { id: marca.id, payload: { nombre: nombre.trim(), imagen } },
        { onSuccess: onSuccess("Marca actualizada"), onError },
      );
    } else {
      create.mutate(
        { nombre: nombre.trim(), imagen },
        { onSuccess: onSuccess("Marca creada"), onError },
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar marca" : "Nueva marca"}
      footer={
        <>
          <AdminButton variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </AdminButton>
          <AdminButton type="submit" form="marca-form" loading={submitting}>
            {isEdit ? "Guardar" : "Crear marca"}
          </AdminButton>
        </>
      }
    >
      <form id="marca-form" onSubmit={onSubmit} className="flex flex-col gap-5">
        <Field label="Nombre" required error={error ?? undefined}>
          <AdminInput value={nombre} onChange={(e) => setNombre(e.target.value)} autoFocus />
        </Field>
        <Field label="Logotipo / imagen">
          <ImageUploader value={imagen} onChange={setImagen} />
        </Field>
      </form>
    </Modal>
  );
}
