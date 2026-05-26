import Link from "next/link";

import { Logo } from "./ui";

const COLS = [
  {
    title: "Catálogo",
    items: [
      ["Habanos", "/tienda"],
      ["Por marca", "/tienda"],
      ["Edición limitada", "/tienda"],
      ["Reservas privadas", "/nosotros"],
    ] as const,
  },
  {
    title: "Accesorios",
    items: [
      ["Humidores", "/accesorios"],
      ["Cortadores", "/accesorios"],
      ["Encendedores", "/accesorios"],
      ["Estuches", "/accesorios"],
    ] as const,
  },
  {
    title: "La Casa",
    items: [
      ["Nuestra historia", "/nosotros"],
      ["Club privado", "/nosotros"],
      ["Catas y eventos", "/blog"],
      ["Contacto", "/nosotros"],
    ] as const,
  },
];

const SOCIAL: ReadonlyArray<readonly [string, string]> = [
  ["IG", "Instagram"],
  ["FB", "Facebook"],
  ["YT", "YouTube"],
  ["WA", "WhatsApp"],
];

export default function Footer() {
  return (
    <footer
      className="relative mt-0 overflow-hidden pt-16 pb-6 md:pt-24 md:pb-8"
      style={{
        background: "var(--color-graphite)",
        color: "#D6CFC0",
        borderTop: "1px solid rgba(196,168,98,0.18)",
      }}
    >
      {/* Watermark decorativo */}
      <div
        className="watermark"
        aria-hidden
        style={{ right: -40, bottom: -80, color: "rgba(196,168,98,0.05)" }}
      >
        T&amp;R
      </div>

      <div className="container-tr relative">
        <div className="mb-12 grid grid-cols-1 gap-10 md:mb-20 md:gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          {/* Columna 1 — Logo + descripción + social */}
          <div>
            <Logo size={17} />
            <p
              className="mt-6 max-w-[300px] text-sm leading-[1.75]"
              style={{ color: "rgba(245,241,234,0.65)" }}
            >
              Casa fundada en Ciudad de Panamá hace 22 años. Curaduría premium de tabaco y
              accesorios. {""}
              <span style={{ color: "var(--color-gold-pure)" }}>
                Variedad · Honestidad · Garantía.
              </span>
            </p>
            <div className="mt-7 flex gap-2.5">
              {SOCIAL.map(([abbr, full]) => (
                <a
                  key={abbr}
                  href="#"
                  title={full}
                  aria-label={full}
                  className="footer-social flex h-9 w-9 items-center justify-center text-[10px] font-bold tracking-[0.1em] transition-colors"
                  style={{
                    border: "1px solid rgba(196,168,98,0.3)",
                    color: "var(--color-gold-pure)",
                  }}
                >
                  {abbr}
                </a>
              ))}
            </div>
          </div>

          {/* Columnas 2, 3, 4 — Catálogo / Accesorios / La Casa */}
          {COLS.map((col) => (
            <div key={col.title}>
              <div
                className="eyebrow mb-[22px]"
                style={{ color: "var(--color-gold-pure)" }}
              >
                {col.title}
              </div>
              <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
                {col.items.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="footer-link text-sm transition-colors"
                      style={{ color: "rgba(245,241,234,0.7)" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Columna 5 — Newsletter + contacto */}
          <div>
            <div
              className="eyebrow mb-[22px]"
              style={{ color: "var(--color-gold-pure)" }}
            >
              El Boletín
            </div>
            <p
              className="mb-[18px] text-sm leading-[1.65]"
              style={{ color: "rgba(245,241,234,0.65)" }}
            >
              Una carta al mes. Nuevas llegadas, lecturas, catas privadas.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex"
              style={{ border: "1px solid var(--color-gold-pure)" }}
            >
              <input
                type="email"
                placeholder="tu@correo.com"
                aria-label="Correo para el boletín"
                className="min-w-0 flex-1 bg-transparent px-4 py-3.5 font-sans text-[13px] outline-none"
                style={{ color: "#F5F1EA" }}
              />
              <button
                type="submit"
                className="px-5 text-[10.5px] font-bold uppercase tracking-[0.24em] transition-colors hover:bg-gold-soft"
                style={{
                  background: "var(--color-gold-pure)",
                  color: "var(--color-graphite)",
                }}
              >
                Unirme
              </button>
            </form>
            <address
              className="mt-6 text-[11px] not-italic uppercase leading-[1.9] tracking-[0.2em]"
              style={{ color: "rgba(245,241,234,0.45)" }}
            >
              Casco Antiguo, Ciudad de Panamá
              <br />
              casa@tabacoyronpa.com
              <br />
              +507 6000 1234
            </address>
          </div>
        </div>

        <div
          className="flex flex-col items-start justify-between gap-[18px] pt-7 text-[11.5px] md:flex-row md:items-center"
          style={{
            borderTop: "1px solid rgba(196,168,98,0.18)",
            color: "rgba(245,241,234,0.55)",
            letterSpacing: "0.08em",
          }}
        >
          <div>
            © 2026 Tabaco &amp; Ron <span className="diamond" /> Casa fundada en Ciudad de Panamá, 2003
          </div>
          <div className="flex flex-wrap gap-[18px] md:gap-7">
            <a href="#" className="hover:text-gold-pure">
              Aviso legal
            </a>
            <a href="#" className="hover:text-gold-pure">
              Privacidad
            </a>
            <a href="#" className="hover:text-gold-pure">
              Política de mayoría de edad
            </a>
          </div>
        </div>

        <div
          className="mt-10 px-5 py-4 text-center text-[10.5px] font-medium uppercase tracking-[0.22em]"
          style={{
            border: "1px solid rgba(245,241,234,0.18)",
            color: "rgba(245,241,234,0.55)",
          }}
        >
          El tabaco perjudica gravemente la salud <span className="diamond" /> Venta exclusiva a mayores de 18 años
        </div>
      </div>

      <style>{`
        .footer-social:hover {
          background: var(--color-gold-pure);
          color: var(--color-graphite) !important;
        }
        .footer-link:hover {
          color: var(--color-gold-pure) !important;
        }
      `}</style>
    </footer>
  );
}
