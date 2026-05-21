"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/ui";
import { AdminButton, AdminInput, Field } from "@/components/admin/ui";
import useAuthService from "@/hooks/use-auth-service";
import { getApiErrorMessage } from "@/lib/api-error";
import { getAuthToken } from "@/lib/axios";

export default function AdminLoginPage() {
  const router = useRouter();
  const { useLogin } = useAuthService();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Si ya hay sesión, salta directo al panel.
  useEffect(() => {
    if (getAuthToken()) router.replace("/tr-admin");
  }, [router]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    login.mutate(
      { email, password },
      {
        onSuccess: () => router.replace("/tr-admin"),
        onError: (err) => setError(getApiErrorMessage(err, "No se pudo iniciar sesión")),
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-coal px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <Logo size={18} />
          <div>
            <div className="eyebrow mb-2">Acceso privado</div>
            <h1 className="font-serif text-3xl text-cream">Panel de administración</h1>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-5 border border-line bg-coal-soft p-7">
          <Field label="Email" required>
            <AdminInput
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
            />
          </Field>
          <Field label="Contraseña" required>
            <AdminInput
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>

          {error && (
            <p className="border border-crimson/50 bg-crimson/10 px-3 py-2 text-sm text-crimson">
              {error}
            </p>
          )}

          <AdminButton type="submit" loading={login.isPending} className="w-full py-3">
            Entrar
          </AdminButton>
        </form>
      </div>
    </div>
  );
}
