"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import useAuthService from "@/hooks/use-auth-service";
import { getAuthToken } from "@/lib/axios";

import { AdminProvider } from "./AdminContext";
import AdminShell from "./AdminShell";
import { Spinner } from "./ui";

/**
 * Protege todas las rutas de `/tr-admin` salvo el login. Verifica el token en
 * localStorage y valida la sesión contra `GET /users/me`. Cualquier fallo
 * (sin token, token expirado/inválido → 401) redirige al login.
 */
export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { useMe } = useAuthService();
  const hasToken = typeof window !== "undefined" && Boolean(getAuthToken());
  const { data: user, isLoading, isError } = useMe(hasToken);

  useEffect(() => {
    if (!hasToken || isError) {
      router.replace("/tr-admin/login");
    }
  }, [hasToken, isError, router]);

  if (!hasToken || isError) {
    return <Spinner label="Redirigiendo…" />;
  }

  if (isLoading || !user) {
    return <Spinner label="Verificando sesión" />;
  }

  return (
    <AdminProvider user={user}>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
