"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import useAuthService from "@/hooks/use-auth-service";
import { Logo } from "@/components/ui";

import { useAdmin } from "./AdminContext";

type NavItem = { href: string; label: string; adminOnly?: boolean };

const NAV: NavItem[] = [
  { href: "/tr-admin", label: "Panel" },
  { href: "/tr-admin/productos", label: "Productos" },
  { href: "/tr-admin/marcas", label: "Marcas y subcategorías" },
  { href: "/tr-admin/usuarios", label: "Usuarios", adminOnly: true },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin } = useAdmin();
  const { useLogout } = useAuthService();
  const logout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);

  const items = NAV.filter((i) => !i.adminOnly || isAdmin);

  const isActive = (href: string) =>
    href === "/tr-admin" ? pathname === href : pathname.startsWith(href);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => router.replace("/tr-admin/login"),
    });
  };

  const navLinks = (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMenuOpen(false)}
          className={`border-l-2 px-4 py-3 text-[12px] font-bold uppercase tracking-[0.16em] transition-colors ${
            isActive(item.href)
              ? "border-gold bg-coal-raised text-gold"
              : "border-transparent text-cream-mute hover:border-line-strong hover:text-cream"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-coal text-cream">
      {/* Barra superior */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-coal-deep/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <button
            className="text-cream-mute lg:hidden"
            aria-label="Menú"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="block text-2xl leading-none">☰</span>
          </button>
          <Link href="/tr-admin" className="flex items-center gap-3">
            <Logo size={13} />
            <span className="hidden text-[11px] font-bold uppercase tracking-[0.22em] text-cream-mute sm:inline">
              Panel
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <div className="text-sm text-cream">{user.nombre}</div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-gold">{user.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="border border-line px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-mute transition-colors hover:border-crimson/60 hover:text-crimson"
          >
            Salir
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar desktop */}
        <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-64 shrink-0 border-r border-line bg-coal-soft py-6 lg:block">
          {navLinks}
        </aside>

        {/* Drawer móvil */}
        {menuOpen && (
          <div className="fixed inset-0 z-30 lg:hidden">
            <div
              className="anim-fade-in absolute inset-0 bg-black/60"
              onClick={() => setMenuOpen(false)}
            />
            <aside className="anim-slide-in-right absolute left-0 top-[57px] h-[calc(100vh-57px)] w-64 border-r border-line bg-coal-soft py-6">
              {navLinks}
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
