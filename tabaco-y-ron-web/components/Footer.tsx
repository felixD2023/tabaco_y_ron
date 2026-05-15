import Link from "next/link";
import { Logo } from "./ui";

const COLS = [
  {
    title: "Catálogo",
    items: ["Habanos", "Por marca", "Edición limitada", "Reservas privadas"],
    href: "/tienda",
  },
  {
    title: "Accesorios",
    items: ["Humidores", "Cortadores", "Encendedores", "Estuches"],
    href: "/accesorios",
  },
  {
    title: "Casa",
    items: ["Nuestra historia", "Club privado", "Catas", "Contacto"],
    href: "/nosotros",
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-coal-deep py-16 pb-6 md:py-24 md:pb-8">
      <div className="container-tr">
        <div className="mb-12 grid grid-cols-1 gap-10 md:mb-20 md:gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Logo size={17} />
            <p className="mt-6 max-w-[280px] text-sm leading-[1.7] text-cream-mute">
              Curaduría de habanos y accesorios desde 2009. Una pequeña casa especializada en lo
              serio.
            </p>
            <div className="mt-7 flex gap-3">
              {["IG", "FB", "YT"].map((s) => (
                <button
                  key={s}
                  className="h-9 w-9 border border-line text-[10px] tracking-[0.1em] text-gold"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <div className="eyebrow mb-[22px]">{col.title}</div>
              <ul className="flex list-none flex-col gap-3.5 p-0">
                {col.items.map((it) => (
                  <li key={it}>
                    <Link
                      href={col.href}
                      className="text-sm text-cream-mute transition-colors hover:text-gold"
                    >
                      {it}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <div className="eyebrow mb-[22px]">El Boletín</div>
            <p className="mb-[18px] text-sm leading-[1.6] text-cream-mute">
              Una carta al mes. Nuevas llegadas, lecturas, catas privadas.
            </p>
            <form className="flex border border-line-strong">
              <input
                type="email"
                placeholder="tu@correo.com"
                className="min-w-0 flex-1 bg-transparent px-4 py-3.5 font-sans text-[13px] text-cream outline-none"
              />
              <button
                type="submit"
                className="bg-gold px-5 text-[11px] font-bold uppercase tracking-[0.2em] text-coal"
              >
                Unirme
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-[18px] border-t border-line pt-7 text-xs text-muted md:flex-row md:items-center">
          <div>© 2026 Tabaco &amp; Ron · Casa fundada en 2009</div>
          <div className="flex flex-wrap gap-[18px] md:gap-7">
            <a href="#">Aviso legal</a>
            <a href="#">Privacidad</a>
            <a href="#">Política de mayoría de edad</a>
          </div>
        </div>

        <div className="mt-12 border border-[rgba(185,28,28,0.4)] bg-[rgba(185,28,28,0.06)] p-5 text-center text-[11px] uppercase tracking-[0.16em] text-cream-mute">
          ⚠ &nbsp; El tabaco perjudica gravemente la salud — Venta exclusiva a mayores de 18 años
        </div>
      </div>
    </footer>
  );
}
