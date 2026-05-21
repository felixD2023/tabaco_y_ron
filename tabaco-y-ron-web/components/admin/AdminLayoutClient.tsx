"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import AdminGuard from "./AdminGuard";
import { ToastProvider } from "./Toast";

/**
 * El login vive dentro de `/tr-admin` pero no debe pasar por el guard (evita un
 * bucle de redirección). El resto de rutas se renderiza dentro del shell tras
 * validar la sesión.
 */
export default function AdminLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/tr-admin/login";

  return (
    <ToastProvider>
      {isLogin ? children : <AdminGuard>{children}</AdminGuard>}
    </ToastProvider>
  );
}
