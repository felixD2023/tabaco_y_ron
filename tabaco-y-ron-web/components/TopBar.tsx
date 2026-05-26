"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "./ui";
import { useSite } from "./SiteProvider";

const NAV = [
  { href: "/tienda", label: "Tienda", num: "01" },
  { href: "/accesorios", label: "Accesorios", num: "02" },
  { href: "/blog", label: "El Cuaderno", num: "03" },
  { href: "/nosotros", label: "La Casa", num: "04" },
];

/**
 * Header fixed que flota sobre el hero del home (transparente, texto cream) y
 * se materializa con blur cream al hacer scroll o en cualquier otra ruta.
 */
export default function TopBar() {
  const pathname = usePathname();
  const { cartCount } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const overImage = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out"
        style={{
          background: overImage ? "transparent" : "rgba(245,241,234,0.55)",
          backdropFilter: overImage ? "none" : "blur(22px) saturate(140%)",
          WebkitBackdropFilter: overImage ? "none" : "blur(22px) saturate(140%)",
          borderBottom: overImage
            ? "1px solid transparent"
            : "1px solid rgba(31,29,27,0.10)",
          color: overImage ? "#F5F1EA" : "var(--color-ink)",
        }}
      >
        {/* Announcement bar */}
        <div
          className="text-center text-[9px] font-medium uppercase tracking-[0.18em] transition-all duration-300 md:text-[10.5px] md:tracking-[0.28em]"
          style={{
            background: overImage ? "rgba(15,12,10,0.45)" : "var(--color-graphite)",
            backdropFilter: overImage ? "blur(8px)" : "none",
            WebkitBackdropFilter: overImage ? "blur(8px)" : "none",
            color: "#E0D6BD",
            padding: "7px 16px",
          }}
        >
          <span className="text-gold-pure">◆</span>
          <span className="mx-3.5">
            <span className="md:hidden">22 años · 600+ referencias · Panamá</span>
            <span className="hidden md:inline">
              22 años en Ciudad de Panamá · 600+ referencias · Asesoría experta desde 2003
            </span>
          </span>
          <span className="text-gold-pure">◆</span>
        </div>

        {/* Barra principal */}
        <div className="container-tr flex items-center justify-between py-3.5 md:py-5">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center"
            aria-label="Tabaco & Ron — Inicio"
          >
            <Logo size={15} />
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden gap-[38px] lg:flex">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative py-2 text-[11px] font-semibold uppercase tracking-[0.28em] transition-opacity"
                  style={{
                    color: active ? "var(--color-gold)" : "currentColor",
                    opacity: active ? 1 : 0.85,
                  }}
                >
                  <span
                    className="mr-2 font-serif text-[11px] italic text-gold"
                    style={{ opacity: active ? 1 : 0.7 }}
                  >
                    {item.num}
                  </span>
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-0 bottom-0 h-px bg-gold" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3.5 md:gap-[22px]">
            <button
              className="hidden items-center md:flex"
              title="Buscar"
              aria-label="Buscar"
              style={{ color: "currentColor", opacity: 0.85 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            <button
              className="hidden items-center md:flex"
              title="Cuenta"
              aria-label="Cuenta"
              style={{ color: "currentColor", opacity: 0.85 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button
              className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: "currentColor" }}
              aria-label={`Bolsa con ${cartCount} producto${cartCount === 1 ? "" : "s"}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 2-1.6L23 6H6" />
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
              </svg>
              <span className="hidden md:inline">
                Bolsa · <span className="text-gold">{cartCount}</span>
              </span>
              <span className="font-serif text-[13px] text-gold md:hidden">{cartCount}</span>
            </button>

            {/* Hamburguesa móvil / tablet */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
              className="flex h-8 w-8 flex-col justify-center gap-[5px] lg:hidden"
              style={{ color: "currentColor" }}
            >
              <span
                className="block h-[1.5px] w-[22px] bg-current transition-transform"
                style={{
                  transform: menuOpen ? "translateY(3px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="block h-[1.5px] w-[22px] bg-current transition-transform"
                style={{
                  transform: menuOpen ? "translateY(-3px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer móvil / tablet */}
      {menuOpen && (
        <div
          className="anim-fade-in fixed inset-0 z-[49] lg:hidden"
          style={{
            background: "rgba(245,241,234,0.98)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            paddingTop: 92,
          }}
        >
          <div className="flex flex-col gap-2 px-7 py-8">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-baseline gap-4 border-b border-line px-2 py-[22px] text-left"
                  style={{
                    color: active ? "var(--color-gold)" : "var(--color-ink)",
                  }}
                >
                  <span className="font-serif text-sm italic text-gold opacity-70">
                    — {item.num}
                  </span>
                  <span className="font-serif text-4xl leading-none">{item.label}</span>
                  <span className="ml-auto text-lg text-gold">→</span>
                </Link>
              );
            })}
            <div className="mt-8 flex gap-3 border-t border-line pt-6">
              <button className="btn-tr flex-1 justify-center">Buscar</button>
              <button className="btn-tr flex-1 justify-center">Cuenta</button>
            </div>
            <div className="mt-10 text-[11px] uppercase leading-[1.85] tracking-[0.22em] text-ink-mute">
              Casco Antiguo · Ciudad de Panamá
              <br />
              Lun–Sáb · 11–21h
              <br />
              +507 6000 1234
            </div>
          </div>
        </div>
      )}
    </>
  );
}
