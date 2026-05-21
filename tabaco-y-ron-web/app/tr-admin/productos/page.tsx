"use client";

import { useMemo, useState } from "react";

import Combobox from "@/components/admin/Combobox";
import { ConfirmDialog } from "@/components/admin/Modal";
import ProductoForm from "@/components/admin/ProductoForm";
import { useToast } from "@/components/admin/Toast";
import {
  AdminButton,
  AdminInput,
  AdminSelect,
  Badge,
  Card,
  EmptyState,
  PageHeader,
  Spinner,
} from "@/components/admin/ui";
import useMarcasService from "@/hooks/use-marcas-service";
import useProductosService from "@/hooks/use-productos-service";
import { getApiErrorMessage } from "@/lib/api-error";
import type { Producto } from "@/types/api";

const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

function formatPrecio(value?: string | null) {
  if (value == null || value === "") return "—";
  const n = Number(value);
  return Number.isNaN(n) ? value : `$${n.toFixed(2)}`;
}

export default function AdminProductosPage() {
  const toast = useToast();
  const { useList, useUpdate, useRemove } = useProductosService();
  const { useList: useMarcas } = useMarcasService();
  const update = useUpdate();
  const remove = useRemove();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [q, setQ] = useState("");
  const [marcaId, setMarcaId] = useState("");
  const [subcategoriaId, setSubcategoriaId] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [toDelete, setToDelete] = useState<Producto | null>(null);

  const marcas = useMarcas();
  const marcaMap = useMemo(() => {
    const map = new Map<number, string>();
    (marcas.data ?? []).forEach((m) => map.set(m.id, m.nombre));
    return map;
  }, [marcas.data]);

  const subcatMap = useMemo(() => {
    const map = new Map<number, string>();
    (marcas.data ?? []).forEach((m) =>
      m.subcategorias.forEach((s) => map.set(s.id, s.nombre)),
    );
    return map;
  }, [marcas.data]);

  // Sublíneas de la marca seleccionada para el segundo filtro.
  const filterSubcategorias = useMemo(
    () => (marcas.data ?? []).find((m) => String(m.id) === marcaId)?.subcategorias ?? [],
    [marcas.data, marcaId],
  );

  const { data, isLoading, isFetching, isError } = useList({
    page,
    page_size: pageSize,
    q: q.trim() || undefined,
    marca_id: marcaId ? [Number(marcaId)] : undefined,
    subcategoria_id: subcategoriaId ? [Number(subcategoriaId)] : undefined,
  });

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p: Producto) => {
    setEditing(p);
    setFormOpen(true);
  };

  const toggleExistencia = (p: Producto) => {
    update.mutate(
      { id: p.id, payload: { existencia: !p.existencia } },
      {
        onSuccess: () =>
          toast.success(p.existencia ? "Marcado como agotado" : "Marcado en stock"),
        onError: (err) => toast.error(getApiErrorMessage(err)),
      },
    );
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    remove.mutate(toDelete.id, {
      onSuccess: () => {
        toast.success("Producto eliminado");
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
        title="Productos"
        subtitle={data ? `${data.total} producto(s) en el catálogo` : "Gestión del catálogo"}
        action={
          <AdminButton onClick={openCreate} disabled={marcas.isLoading}>
            + Nuevo producto
          </AdminButton>
        }
      />

      {/* Filtros */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <AdminInput
          placeholder="Buscar por nombre…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-xs"
        />
        <div className="sm:w-56">
          <Combobox
            placeholder="Todas las marcas"
            value={marcaId}
            options={(marcas.data ?? []).map((m) => ({ value: String(m.id), label: m.nombre }))}
            onChange={(v) => {
              setMarcaId(v);
              setSubcategoriaId(""); // resetea la sublínea al cambiar de marca
              setPage(1);
            }}
          />
        </div>
        <div className="sm:w-56">
          <Combobox
            placeholder={marcaId ? "Todas las sublíneas" : "Elige una marca primero"}
            value={subcategoriaId}
            disabled={!marcaId || filterSubcategorias.length === 0}
            options={filterSubcategorias.map((s) => ({ value: String(s.id), label: s.nombre }))}
            onChange={(v) => {
              setSubcategoriaId(v);
              setPage(1);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <Spinner label="Cargando productos" />
      ) : isError ? (
        <EmptyState title="Error al cargar" description="No se pudieron obtener los productos." />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title="Sin productos"
          description="No hay productos que coincidan con los filtros."
          action={<AdminButton onClick={openCreate}>+ Nuevo producto</AdminButton>}
        />
      ) : (
        <Card className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-[0.16em] text-cream-mute">
                  <th className="px-4 py-3 font-bold">Producto</th>
                  <th className="px-4 py-3 font-bold">Marca</th>
                  <th className="px-4 py-3 font-bold">Subcat.</th>
                  <th className="px-4 py-3 font-bold">Indiv.</th>
                  <th className="px-4 py-3 font-bold">Caja</th>
                  <th className="px-4 py-3 font-bold">Estado</th>
                  <th className="px-4 py-3 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((p) => (
                  <tr key={p.id} className="border-b border-line/50 hover:bg-coal-raised/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden border border-line bg-coal">
                          {p.imagen ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.imagen} alt="" className="h-full w-full object-cover" />
                          ) : null}
                        </div>
                        <span className="font-medium text-cream">{p.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-cream-mute">
                      {marcaMap.get(p.marca_id) ?? `#${p.marca_id}`}
                    </td>
                    <td className="px-4 py-3 text-cream-mute">
                      {p.subcategoria_id != null
                        ? subcatMap.get(p.subcategoria_id) ?? `#${p.subcategoria_id}`
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-cream-mute">
                      {formatPrecio(p.precio_individual)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-cream-mute">
                      {formatPrecio(p.precio_caja)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleExistencia(p)}
                        disabled={update.isPending && update.variables?.id === p.id}
                        title={p.existencia ? "Marcar como agotado" : "Marcar en stock"}
                        className="transition-opacity hover:opacity-80 disabled:opacity-50"
                      >
                        {p.existencia ? (
                          <Badge tone="green">● En stock</Badge>
                        ) : (
                          <Badge tone="red">○ Agotado</Badge>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="border border-line px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-mute transition-colors hover:border-gold hover:text-gold"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setToDelete(p)}
                          className="border border-line px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-mute transition-colors hover:border-crimson/60 hover:text-crimson"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Paginación + elementos por página */}
      {data && data.items.length > 0 && (
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-mute">
            Por página
            <AdminSelect
              value={String(pageSize)}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="w-20"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </AdminSelect>
          </label>

          {data.pages > 1 && (
            <div className="flex items-center gap-4">
              <AdminButton
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Anterior
              </AdminButton>
              <span className="text-xs uppercase tracking-[0.16em] text-cream-mute">
                Página {data.page} de {data.pages}
              </span>
              <AdminButton
                variant="ghost"
                disabled={page >= data.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente →
              </AdminButton>
            </div>
          )}
        </div>
      )}

      {formOpen && (
        <ProductoForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          producto={editing}
          marcas={marcas.data ?? []}
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar producto"
        message={
          <>
            ¿Seguro que quieres eliminar <strong className="text-cream">{toDelete?.nombre}</strong>?
            Esta acción no se puede deshacer.
          </>
        }
        loading={remove.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
