"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { QUERY_KEYS } from "@/constants/query-keys";
import useSubcategoriasService from "@/hooks/use-subcategorias-service";
import { getApiErrorMessage } from "@/lib/api-error";
import type { Marca, Subcategoria } from "@/types/api";

import Modal, { ConfirmDialog } from "./Modal";
import { useToast } from "./Toast";
import { AdminButton, AdminInput, EmptyState, Spinner } from "./ui";

export default function SubcategoriasManager({
  open,
  onClose,
  marca,
}: {
  open: boolean;
  onClose: () => void;
  marca: Marca;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { useList, useCreate, useUpdate, useRemove } = useSubcategoriasService();
  const list = useList(marca.id);
  const create = useCreate();
  const update = useUpdate();
  const remove = useRemove();

  const [nuevo, setNuevo] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [toDelete, setToDelete] = useState<Subcategoria | null>(null);

  // Refresca la lista de marcas para que cuente bien las subcategorías anidadas.
  const refreshMarcas = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marcas });
  const onError = (err: unknown) => toast.error(getApiErrorMessage(err));

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevo.trim()) return;
    create.mutate(
      { nombre: nuevo.trim(), marca_id: marca.id },
      {
        onSuccess: () => {
          setNuevo("");
          refreshMarcas();
          toast.success("Subcategoría añadida");
        },
        onError,
      },
    );
  };

  const saveEdit = (id: number) => {
    if (!editNombre.trim()) return;
    update.mutate(
      { id, payload: { nombre: editNombre.trim() } },
      {
        onSuccess: () => {
          setEditId(null);
          refreshMarcas();
          toast.success("Subcategoría actualizada");
        },
        onError,
      },
    );
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    remove.mutate(toDelete.id, {
      onSuccess: () => {
        setToDelete(null);
        refreshMarcas();
        toast.success("Subcategoría eliminada");
      },
      onError: (err) => {
        onError(err);
        setToDelete(null);
      },
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={`Subcategorías · ${marca.nombre}`}>
      <form onSubmit={add} className="mb-5 flex gap-2">
        <AdminInput
          placeholder="Nueva subcategoría…"
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
        />
        <AdminButton type="submit" loading={create.isPending} className="shrink-0">
          Añadir
        </AdminButton>
      </form>

      {list.isLoading ? (
        <Spinner />
      ) : !list.data || list.data.length === 0 ? (
        <EmptyState title="Sin subcategorías" description="Añade la primera arriba." />
      ) : (
        <ul className="flex flex-col divide-y divide-line border border-line">
          {list.data.map((s) => (
            <li key={s.id} className="flex items-center gap-2 px-3 py-2.5">
              {editId === s.id ? (
                <>
                  <AdminInput
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    autoFocus
                  />
                  <AdminButton
                    onClick={() => saveEdit(s.id)}
                    loading={update.isPending}
                    className="shrink-0"
                  >
                    Guardar
                  </AdminButton>
                  <AdminButton
                    variant="ghost"
                    onClick={() => setEditId(null)}
                    className="shrink-0"
                  >
                    Cancelar
                  </AdminButton>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-cream">{s.nombre}</span>
                  <button
                    onClick={() => {
                      setEditId(s.id);
                      setEditNombre(s.nombre);
                    }}
                    className="px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-mute hover:text-gold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setToDelete(s)}
                    className="px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-mute hover:text-crimson"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar subcategoría"
        message={
          <>
            ¿Eliminar <strong className="text-cream">{toDelete?.nombre}</strong>? Solo es posible
            si no tiene productos asociados.
          </>
        }
        loading={remove.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </Modal>
  );
}
