"use client";

import { useState } from "react";

import useUsersService from "@/hooks/use-users-service";
import { getApiErrorMessage } from "@/lib/api-error";
import type { User, UserRole } from "@/types/api";

import Modal from "./Modal";
import { useToast } from "./Toast";
import { AdminButton, AdminInput, AdminSelect, Field } from "./ui";

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "gestor", label: "Gestor (catálogo)" },
  { value: "admin", label: "Administrador (todo + usuarios)" },
];

export default function UserForm({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user?: User | null;
}) {
  const isEdit = Boolean(user);
  const toast = useToast();
  const { useCreate, useUpdate } = useUsersService();
  const create = useCreate();
  const update = useUpdate();

  const [nombre, setNombre] = useState(user?.nombre ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(user?.role ?? "gestor");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitting = create.isPending || update.isPending;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nombre.trim()) e.nombre = "Obligatorio";
    if (!email.trim()) e.email = "Obligatorio";
    // En alta la contraseña es obligatoria; en edición es opcional (se deja en blanco para no cambiarla).
    if (!isEdit && password.length < 8) e.password = "Mínimo 8 caracteres";
    if (isEdit && password && password.length < 8) e.password = "Mínimo 8 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const onError = (err: unknown) => toast.error(getApiErrorMessage(err));

    if (isEdit && user) {
      update.mutate(
        {
          id: user.id,
          payload: {
            nombre: nombre.trim(),
            email: email.trim(),
            role,
            ...(password ? { password } : {}),
          },
        },
        {
          onSuccess: () => {
            toast.success("Usuario actualizado");
            onClose();
          },
          onError,
        },
      );
    } else {
      create.mutate(
        { nombre: nombre.trim(), email: email.trim(), password, role },
        {
          onSuccess: () => {
            toast.success("Usuario creado");
            onClose();
          },
          onError,
        },
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar usuario" : "Nuevo usuario"}
      footer={
        <>
          <AdminButton variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </AdminButton>
          <AdminButton type="submit" form="user-form" loading={submitting}>
            {isEdit ? "Guardar" : "Crear usuario"}
          </AdminButton>
        </>
      }
    >
      <form id="user-form" onSubmit={onSubmit} className="flex flex-col gap-5">
        <Field label="Nombre" required error={errors.nombre}>
          <AdminInput value={nombre} onChange={(e) => setNombre(e.target.value)} autoFocus />
        </Field>
        <Field label="Email" required error={errors.email}>
          <AdminInput
            type="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field
          label={isEdit ? "Nueva contraseña" : "Contraseña"}
          required={!isEdit}
          error={errors.password}
          hint={isEdit ? "Déjala en blanco para mantener la actual." : "Mínimo 8 caracteres."}
        >
          <AdminInput
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field label="Rol" required>
          <AdminSelect value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </AdminSelect>
        </Field>
      </form>
    </Modal>
  );
}
