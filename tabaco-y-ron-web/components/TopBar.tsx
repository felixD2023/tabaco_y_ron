"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./ui";
import { useSite } from "./SiteProvider";

const NAV = [
  { href: "/tienda", label: "Tienda", num: "01" },
  { href: "/accesorios", label: "Accesorios", num: "02" },
  { href: "/blog", label: "Blog", num: "03" },
  { href: "/nosotros", label: "Nosotros", num: "04" },
];

export default function TopBar() {
  const pathname = usePathname();
  const { cartCount } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled || menuOpen ? "rgba(10,10,10,0.92)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(14px) saturate(120%)" : "none",
        borderBottom: scrolled ? "1px solid var(--color-line)" : "1px solid transparent",
      }}
    >
      {/* Barra de anuncio */}
      <div
        className="border-b border-[rgba(200,169,106,0.08)] bg-coal-deep px-4 py-2 text-center text-[9px] uppercase tracking-[0.14em] text-cream-mute md:px-6 md:py-2.5 md:text-[11px] md:tracking-[0.2em]"
      >
        <span className="text-gold">◆</span>
        <span className="mx-3.5">
          <span className="md:hidden">Envío discreto · 48h en pedidos +200 €</span>
          <span className="hidden md:inline">
            Envío discreto a toda Europa — entrega en 48h en pedidos sobre 200 €
          </span>
        </span>
        <span className="text-gold">◆</span>
      </div>

      <div className="container-tr flex items-center justify-between py-4 md:py-[22px]">
        <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center">
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
                className="relative py-2 text-[11px] font-bold uppercase tracking-[0.24em] transition-colors"
                style={{ color: active ? "var(--color-gold)" : "var(--color-cream)" }}
              >
                <span
                  className="mr-2 font-serif text-[11px] italic text-gold"
                  style={{ opacity: active ? 1 : 0.6 }}
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

        <div className="flex items-center gap-3.5 md:gap-6">
          <button
            className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-cream-mute md:flex"
            title="Buscar"
            aria-label="Buscar"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button
            className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-cream-mute md:flex"
            title="Cuenta"
            aria-label="Cuenta"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 2-1.6L23 6H6" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
            </svg>
            <span className="hidden md:inline">Bolsa · {cartCount}</span>
            <span className="font-serif text-[13px] md:hidden">{cartCount}</span>
          </button>

          {/* Hamburguesa móvil / tablet */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
            className="flex h-8 w-8 flex-col justify-center gap-[5px] text-cream lg:hidden"
          >
            <span
              className="h-px w-[22px] bg-current transition-transform"
              style={{ transform: menuOpen ? "translateY(3px) rotate(45deg)" : "none" }}
            />
            <span
              className="h-px w-[22px] bg-current transition-transform"
              style={{ transform: menuOpen ? "translateY(-3px) rotate(-45deg)" : "none" }}
            />
          </button>
        </div>
      </div>

      {/* Drawer móvil / tablet */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[49] lg:hidden"
          style={{
            background: "rgba(10,10,10,0.97)",
            backdropFilter: "blur(20px)",
            paddingTop: 92,
            animation: "fadeIn 0.25s ease",
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
                  style={{ color: active ? "var(--color-gold)" : "var(--color-cream)" }}
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
            <div className="mt-10 text-[11px] uppercase leading-[1.8] tracking-[0.2em] text-muted">
              Almirante 14 · Madrid
              <br />
              Mar–Sáb · 11–21h
              <br />
              +34 91 308 12 09
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
