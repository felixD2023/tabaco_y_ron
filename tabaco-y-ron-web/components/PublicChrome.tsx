"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import Footer from "./Footer";
import ProductModal from "./ProductModal";
import TopBar from "./TopBar";

/**
 * Envuelve el contenido del sitio con el chrome público (TopBar/Footer/modal de
 * producto). En las rutas del panel de administración (`/tr-admin`) ese chrome
 * se omite: el panel aporta su propio shell a pantalla completa.
 */
export default function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/tr-admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <TopBar />
      <main>{children}</main>
      <Footer />
      <ProductModal />
    </>
  );
}
