"use client";

import { useState } from "react";

import MarcaForm from "@/components/admin/MarcaForm";
import { ConfirmDialog } from "@/components/admin/Modal";
import SubcategoriasManager from "@/components/admin/SubcategoriasManager";
import { useToast } from "@/components/admin/Toast";
import {
  AdminButton,
  Badge,
  Card,
  EmptyState,
  PageHeader,
  Spinner,
} from "@/components/admin/ui";
import useMarcasService from "@/hooks/use-marcas-service";
import { getApiErrorMessage } from "@/lib/api-error";
import type { Marca } from "@/types/api";

export default function AdminMarcasPage() {
  const toast = useToast();
  const { useList, useRemove } = useMarcasService();
  const list = useList();
  const remove = useRemove();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Marca | null>(null);
  const [subsOf, setSubsOf] = useState<Marca | null>(null);
  const [toDelete, setToDelete] = useState<Marca | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    remove.mutate(toDelete.id, {
      onSuccess: () => {
        toast.success("Marca eliminada");
        setToDelete(null);
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err));
        setToDelete(null);
      },
    });
  };

  return (
    <div className="page">
      <PageHeader
        title="Marcas y subcategorías"
        subtitle="Administra las marcas del catálogo y sus subcategorías."
        action={<AdminButton onClick={openCreate}>+ Nueva marca</AdminButton>}
      />

      {list.isLoading ? (
        <Spinner label="Cargando marcas" />
      ) : list.isError ? (
        <EmptyState title="Error al cargar" description="No se pudieron obtener las marcas." />
      ) : !list.data || list.data.length === 0 ? (
        <EmptyState
          title="Sin marcas"
          description="Crea la primera marca para empezar el catálogo."
          action={<AdminButton onClick={openCreate}>+ Nueva marca</AdminButton>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.data.map((m) => (
            <Card key={m.id} className="flex flex-col gap-4 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-line bg-coal">
                  {m.imagen ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.imagen} alt={m.nombre} className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-serif text-xl text-gold">{m.nombre.charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-serif text-lg text-cream">{m.nombre}</h3>
                  <div className="mt-1 flex gap-2">
                    <Badge tone="gold">{m.total_productos} prod.</Badge>
                    <Badge>{m.subcategorias.length} subcat.</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 border-t border-line pt-3">
                <button
                  onClick={() => setSubsOf(m)}
                  className="border border-line px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-mute transition-colors hover:border-gold hover:text-gold"
                >
                  Subcategorías
                </button>
                <button
                  onClick={() => {
                    setEditing(m);
                    setFormOpen(true);
                  }}
                  className="border border-line px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-mute transition-colors hover:border-gold hover:text-gold"
                >
                  Editar
                </button>
                <button
                  onClick={() => setToDelete(m)}
                  className="border border-line px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-mute transition-colors hover:border-crimson/60 hover:text-crimson"
                >
                  Eliminar
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {formOpen && (
        <MarcaForm open={formOpen} onClose={() => setFormOpen(false)} marca={editing} />
      )}
      {subsOf && (
        <SubcategoriasManager open={Boolean(subsOf)} onClose={() => setSubsOf(null)} marca={subsOf} />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar marca"
        message={
          <>
            ¿Eliminar <strong className="text-cream">{toDelete?.nombre}</strong>? Se eliminarán
            también sus <strong className="text-crimson">{toDelete?.subcategorias.length} subcategoría(s)</strong> y
            sus <strong className="text-crimson">{toDelete?.total_productos} producto(s)</strong> en
            cascada. Esta acción no se puede deshacer.
          </>
        }
        loading={remove.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
