import Placeholder from "@/components/Placeholder";
import { SectionHead } from "@/components/ui";

const STATS = [
  ["17", "años de oficio"],
  ["1", "local. el original."],
  ["12", "casas, visitadas"],
  ["0", "intermediarios"],
];

const PRINCIPLES = [
  {
    n: "01",
    t: "Procedencia directa",
    d: "Compramos a la fábrica. La caja que sale de la galera es la caja que llega a Madrid.",
  },
  {
    n: "02",
    t: "Curaduría real",
    d: "Cada referencia pasa por un panel de tres. Si no convence a los tres, no entra a la cava.",
  },
  {
    n: "03",
    t: "Conservación 70/70",
    d: "Humedad 70 %, temperatura 70 °F. Verificado dos veces al día, 365 días al año.",
  },
  {
    n: "04",
    t: "Sin prisa",
    d: "No tenemos liquidaciones. No hacemos promociones. Lo que está en la cava está porque debe estar.",
  },
];

const TEAM = [
  {
    i: "EM",
    n: "Esteban Marrero",
    r: "Fundador · Catador principal",
    b: "Catador certificado por la Asociación Cubana de Tabaco. Vino a Madrid en 2008 con una caja y una idea.",
  },
  {
    i: "LR",
    n: "Lucía Reyes",
    r: "Directora de cava",
    b: "Veinte años en humidores, doce con nosotros. Mantiene la cava como otros mantienen una orquesta.",
  },
  {
    i: "JC",
    n: "Joaquín Cánovas",
    r: "Curador de accesorios",
    b: "Trabajó como tallista en Florencia. Selecciona uno de cada veinte humidores que ve.",
  },
];

const VISIT = [
  ["Horario", "Mar–Sáb · 11:00–21:00"],
  ["Teléfono", "+34 91 308 12 09"],
  ["Correo", "casa@tabacoyron.com"],
  ["Metro", "Chueca · L5"],
];

export default function NosotrosPage() {
  return (
    <div className="page">
      {/* Hero */}
      <section className="relative min-h-[440px] md:min-h-[560px]">
        <Placeholder
          label="ABOUT · interior tabaquería — luz tenue, estantería con cajas"
          tag="interior"
          seed="tr-about-hero"
          variant="warm"
          className="absolute inset-0"
          style={{ position: "absolute", inset: 0 }}
        >
          <div
            className="absolute inset-0 z-[2]"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,10,0.4) 0%, var(--color-coal) 100%)",
            }}
          />
        </Placeholder>
        <div className="container-tr relative z-[3] py-25 md:py-40 lg:pb-25 lg:pt-40">
          <div className="eyebrow mb-6">— Nuestra Casa —</div>
          <h1
            className="max-w-[1000px] leading-[0.94]"
            style={{ fontSize: "clamp(44px, 9vw, 128px)" }}
          >
            Una tienda
            <br />
            pequeña. Una
            <br />
            <span className="italic text-gold">idea grande.</span>
          </h1>
        </div>
      </section>

      {/* Historia */}
      <section className="py-18 md:py-35">
        <div className="container-tr grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-25">
          <div>
            <div className="eyebrow mb-6">— I. La historia —</div>
            <h2 className="mb-6 text-[36px] leading-[1.05] md:mb-10 md:text-[56px]">
              Empezó como una <span className="italic text-gold">conversación</span>.
            </h2>
            <Placeholder
              label="founders · 2009"
              tag="interior"
              seed="tr-founders"
              className="mt-8"
              style={{ aspectRatio: "4/5" }}
            />
          </div>
          <div className="flex flex-col gap-6 lg:gap-8 lg:pt-20">
            <p className="font-serif text-xl leading-[1.5] text-cream md:text-2xl">
              En 2009, Esteban Marrero volvió de un viaje por Vuelta Abajo con una idea simple:
              traer a Europa la misma caja que le habían fumado en la galera, sin que ningún
              intermediario la tocara.
            </p>
            <p className="text-[15px] leading-[1.8] text-cream-mute md:text-[17px]">
              No abrimos una tienda. Abrimos una conversación. Diecisiete años después, esa
              conversación se sigue manteniendo en el mismo local en Madrid, con las mismas tres
              sillas de cuero gastadas en el mismo orden, y con clientes que entran sin saber qué
              van a llevarse y salen sabiendo exactamente por qué.
            </p>
            <p className="text-[15px] leading-[1.8] text-cream-mute md:text-[17px]">
              Trabajamos directamente con doce casas. Visitamos cada una al menos una vez al año. No
              vendemos lo que no hemos fumado. No fumamos lo que no nos gustaría regalar.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-5 border-t border-line pt-6 md:mt-8 md:gap-8 md:pt-8">
              {STATS.map(([n, l]) => (
                <div key={l}>
                  <div className="font-serif text-5xl leading-none text-gold md:text-[64px]">
                    {n}
                  </div>
                  <div className="mt-3 text-xs uppercase tracking-[0.22em] text-cream-mute">
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principios */}
      <section className="border-y border-line bg-coal-soft py-16 md:py-22 lg:py-30">
        <div className="container-tr">
          <SectionHead
            num="II"
            eyebrow="Cómo trabajamos"
            title={
              <>
                Cuatro <span className="italic text-gold">principios</span>, fijos.
              </>
            }
          />
          <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p) => (
              <div key={p.n} className="bg-coal-soft p-6 py-9 md:p-8 md:py-12">
                <div className="mb-6 font-serif text-base italic text-gold">— {p.n} —</div>
                <h3 className="mb-4 text-[22px] leading-[1.2] md:text-[26px]">{p.t}</h3>
                <p className="text-sm leading-[1.7] text-cream-mute">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-16 md:py-22 lg:py-30">
        <div className="container-tr">
          <SectionHead num="III" eyebrow="Las personas" title="Las tres sillas." />
          <div className="grid grid-cols-1 gap-9 md:grid-cols-3 md:gap-8">
            {TEAM.map((p) => (
              <div key={p.i}>
                <Placeholder
                  label={`retrato · ${p.n}`}
                  tag="portrait"
                  seed={`tr-team-${p.i}`}
                  className="mb-6"
                  style={{ aspectRatio: "3/4" }}
                />
                <div className="mb-2 font-serif text-2xl md:text-[28px]">{p.n}</div>
                <div className="mb-[18px] text-xs uppercase tracking-[0.2em] text-gold">{p.r}</div>
                <p className="text-sm leading-[1.7] text-cream-mute">{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visita */}
      <section className="border-t border-line bg-coal-soft py-16 md:py-22 lg:py-30">
        <div className="container-tr grid items-center gap-9 lg:grid-cols-2 lg:gap-20">
          <Placeholder
            label="local · interior · luz cálida"
            tag="interior"
            seed="tr-local"
            variant="warm"
            style={{ aspectRatio: "5/6" }}
          />
          <div>
            <div className="eyebrow mb-6">— Visítenos —</div>
            <h2 className="mb-7 text-[36px] leading-[1.05] md:text-[56px]">
              Calle del
              <br />
              <span className="italic text-gold">Almirante 14</span>,<br />
              Madrid.
            </h2>
            <p className="mb-9 text-[15px] leading-[1.7] text-cream-mute md:text-[17px]">
              No hace falta cita. La puerta está abierta de martes a sábado. Si trae un puro, lo
              encendemos juntos.
            </p>
            <div className="mb-10 grid grid-cols-2 gap-[18px] md:gap-7">
              {VISIT.map(([k, v]) => (
                <div key={k} className="border-t border-line pt-[18px]">
                  <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-muted">{k}</div>
                  <div className="font-serif text-[15px] text-cream md:text-[17px]">{v}</div>
                </div>
              ))}
            </div>
            <button className="btn-tr solid">Cómo llegar →</button>
          </div>
        </div>
      </section>
    </div>
  );
}
