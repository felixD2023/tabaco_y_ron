"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import Footer from "./Footer";
import ProductModal from "./ProductModal";
import TopBar from "./TopBar";

/**
 * Envuelve el contenido del sitio con el chrome público (TopBar/Footer/modal de
 * producto). El TopBar es `fixed` y flota transparente sobre el hero del home;
 * en cualquier otra ruta el main se desplaza con `padding-top` para no quedar
 * tapado. En `/tr-admin` el chrome público se omite por completo.
 */
export default function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/tr-admin") ?? false;
  const isHome = pathname === "/";

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <TopBar />
      <main style={{ paddingTop: isHome ? 0 : "var(--topbar-h)" }}>{children}</main>
      <Footer />
      <ProductModal />
    </>
  );
}
