"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAdmin } from "@/components/admin/AdminContext";
import { ConfirmDialog } from "@/components/admin/Modal";
import { useToast } from "@/components/admin/Toast";
import UserForm from "@/components/admin/UserForm";
import {
  AdminButton,
  Badge,
  Card,
  EmptyState,
  PageHeader,
  Spinner,
} from "@/components/admin/ui";
import useUsersService from "@/hooks/use-users-service";
import { getApiErrorMessage } from "@/lib/api-error";
import type { User } from "@/types/api";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function AdminUsuariosPage() {
  const router = useRouter();
  const toast = useToast();
  const { user: current, isAdmin } = useAdmin();
  const { useList, useRemove } = useUsersService();
  const list = useList();
  const remove = useRemove();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [toDelete, setToDelete] = useState<User | null>(null);

  // Salvaguarda: la sección es solo para administradores.
  useEffect(() => {
    if (!isAdmin) router.replace("/tr-admin");
  }, [isAdmin, router]);

  if (!isAdmin) {
    return <Spinner label="Redirigiendo…" />;
  }

  const confirmDelete = () => {
    if (!toDelete) return;
    remove.mutate(toDelete.id, {
      onSuccess: () => {
        toast.success("Usuario eliminado");
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
        title="Usuarios"
        subtitle="Gestiona el acceso al panel y los roles."
        action={
          <AdminButton
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            + Nuevo usuario
          </AdminButton>
        }
      />

      {list.isLoading ? (
        <Spinner label="Cargando usuarios" />
      ) : list.isError ? (
        <EmptyState title="Error al cargar" description="No se pudieron obtener los usuarios." />
      ) : !list.data || list.data.length === 0 ? (
        <EmptyState title="Sin usuarios" />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-[0.16em] text-cream-mute">
                  <th className="px-4 py-3 font-bold">Nombre</th>
                  <th className="px-4 py-3 font-bold">Email</th>
                  <th className="px-4 py-3 font-bold">Rol</th>
                  <th className="px-4 py-3 font-bold">Alta</th>
                  <th className="px-4 py-3 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {list.data.map((u) => {
                  const isSelf = u.id === current.id;
                  return (
                    <tr key={u.id} className="border-b border-line/50 hover:bg-coal-raised/40">
                      <td className="px-4 py-3 font-medium text-cream">
                        {u.nombre}
                        {isSelf && <span className="ml-2 text-[10px] text-gold">(tú)</span>}
                      </td>
                      <td className="px-4 py-3 text-cream-mute">{u.email}</td>
                      <td className="px-4 py-3">
                        <Badge tone={u.role === "admin" ? "gold" : "neutral"}>{u.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-cream-mute">{formatDate(u.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditing(u);
                              setFormOpen(true);
                            }}
                            className="border border-line px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-mute transition-colors hover:border-gold hover:text-gold"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setToDelete(u)}
                            disabled={isSelf}
                            title={isSelf ? "No puedes eliminar tu propia cuenta" : undefined}
                            className="border border-line px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-mute transition-colors hover:border-crimson/60 hover:text-crimson disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {formOpen && (
        <UserForm open={formOpen} onClose={() => setFormOpen(false)} user={editing} />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar usuario"
        message={
          <>
            ¿Eliminar a <strong className="text-cream">{toDelete?.nombre}</strong> (
            {toDelete?.email})? Perderá el acceso al panel.
          </>
        }
        loading={remove.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
