// Nosotros — historia, valores, equipo
function NosotrosPage() {
  const { isMobile, isTablet } = useViewport();
  return (
    <div className="page">
      {/* Hero */}
      <section style={{ position: 'relative', minHeight: isMobile ? 440 : 560, padding: 0 }}>
        <Placeholder label="ABOUT · interior tabaquería — luz tenue, estantería con cajas"
          tag="interior" seed="tr-about-hero"
          variant="warm" style={{ position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,10,0.4) 0%, var(--bg) 100%)', zIndex: 2 }} />
        </Placeholder>
        <div className="container" style={{ position: 'relative', zIndex: 3, padding: isMobile ? '100px 20px 64px' : '160px 56px 100px' }}>
          <div className="eyebrow" style={{ marginBottom: 24 }}>— Nuestra Casa —</div>
          <h1 style={{ fontSize: 'clamp(44px, 9vw, 128px)', lineHeight: 0.94, maxWidth: 1000 }}>
            Una tienda<br/>
            pequeña. Una<br/>
            <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>idea grande.</span>
          </h1>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: isMobile ? '72px 0' : '140px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr', gap: isMobile ? 32 : 100 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>— I. La historia —</div>
            <h2 style={{ fontSize: isMobile ? 36 : 56, lineHeight: 1.05, marginBottom: isMobile ? 24 : 40 }}>
              Empezó como una <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>conversación</span>.
            </h2>
            <Placeholder label="founders · 2009" tag="interior" seed="tr-founders" variant="" style={{ aspectRatio: '4/5', marginTop: 32 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 24 : 32, paddingTop: isMobile ? 0 : 80 }}>
            <p style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 20 : 24, lineHeight: 1.5, color: 'var(--cream)' }}>
              En 2009, Esteban Marrero volvió de un viaje por Vuelta Abajo con una idea simple: traer
              a Europa la misma caja que le habían fumado en la galera, sin que ningún intermediario
              la tocara.
            </p>
            <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--cream-mute)', lineHeight: 1.8 }}>
              No abrimos una tienda. Abrimos una conversación. Diecisiete años después, esa
              conversación se sigue manteniendo en el mismo local en Madrid, con las mismas tres sillas
              de cuero gastadas en el mismo orden, y con clientes que entran sin saber qué van a
              llevarse y salen sabiendo exactamente por qué.
            </p>
            <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--cream-mute)', lineHeight: 1.8 }}>
              Trabajamos directamente con doce casas. Visitamos cada una al menos una vez al año.
              No vendemos lo que no hemos fumado. No fumamos lo que no nos gustaría regalar.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: isMobile ? 20 : 32, marginTop: isMobile ? 16 : 32, paddingTop: isMobile ? 24 : 32, borderTop: '1px solid var(--line)' }}>
              <div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 48 : 64, color: 'var(--gold)', lineHeight: 1 }}>17</div>
                <div style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cream-mute)', marginTop: 12 }}>años de oficio</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 48 : 64, color: 'var(--gold)', lineHeight: 1 }}>1</div>
                <div style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cream-mute)', marginTop: 12 }}>local. el original.</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 48 : 64, color: 'var(--gold)', lineHeight: 1 }}>12</div>
                <div style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cream-mute)', marginTop: 12 }}>casas, visitadas</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 48 : 64, color: 'var(--gold)', lineHeight: 1 }}>0</div>
                <div style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cream-mute)', marginTop: 12 }}>intermediarios</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <SectionHead num="II" eyebrow="Cómo trabajamos" title={<>Cuatro <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>principios</span>, fijos.</>} />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 1, background: 'var(--line)', border: '1px solid var(--line)' }}>
            {[
              { n: '01', t: 'Procedencia directa', d: 'Compramos a la fábrica. La caja que sale de la galera es la caja que llega a Madrid.' },
              { n: '02', t: 'Curaduría real', d: 'Cada referencia pasa por un panel de tres. Si no convence a los tres, no entra a la cava.' },
              { n: '03', t: 'Conservación 70/70', d: 'Humedad 70 %, temperatura 70 °F. Verificado dos veces al día, 365 días al año.' },
              { n: '04', t: 'Sin prisa', d: 'No tenemos liquidaciones. No hacemos promociones. Lo que está en la cava está porque debe estar.' },
            ].map(p => (
              <div key={p.n} style={{ background: 'var(--bg-2)', padding: isMobile ? '36px 24px' : '48px 32px' }}>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: 16, marginBottom: 24 }}>— {p.n} —</div>
                <h3 style={{ fontSize: isMobile ? 22 : 26, lineHeight: 1.2, marginBottom: 16 }}>{p.t}</h3>
                <p style={{ fontSize: 14, color: 'var(--cream-mute)', lineHeight: 1.7 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section>
        <div className="container">
          <SectionHead num="III" eyebrow="Las personas" title={<>Las tres sillas.</>} />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 36 : 32 }}>
            {[
              { i: 'EM', n: 'Esteban Marrero', r: 'Fundador · Catador principal', b: 'Catador certificado por la Asociación Cubana de Tabaco. Vino a Madrid en 2008 con una caja y una idea.' },
              { i: 'LR', n: 'Lucía Reyes',     r: 'Directora de cava',           b: 'Veinte años en humidores, doce con nosotros. Mantiene la cava como otros mantienen una orquesta.' },
              { i: 'JC', n: 'Joaquín Cánovas', r: 'Curador de accesorios',      b: 'Trabajó como tallista en Florencia. Selecciona uno de cada veinte humidores que ve.' },
            ].map(p => (
              <div key={p.i}>
                <Placeholder label={`retrato · ${p.n}`} tag="portrait" seed={`tr-team-${p.i}`} variant="" style={{ aspectRatio: '3/4', marginBottom: 24 }} />
                <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 24 : 28, marginBottom: 8 }}>{p.n}</div>
                <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>{p.r}</div>
                <p style={{ fontSize: 14, color: 'var(--cream-mute)', lineHeight: 1.7 }}>{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit */}
      <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--line)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 36 : 80, alignItems: 'center' }}>
          <Placeholder label="local · interior · luz cálida" tag="interior" seed="tr-local" variant="warm" style={{ aspectRatio: isMobile ? '4/3' : '5/6' }} />
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>— Visítenos —</div>
            <h2 style={{ fontSize: isMobile ? 36 : 56, lineHeight: 1.05, marginBottom: 28 }}>
              Calle del<br/>
              <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Almirante 14</span>,<br/>
              Madrid.
            </h2>
            <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--cream-mute)', lineHeight: 1.7, marginBottom: 36 }}>
              No hace falta cita. La puerta está abierta de martes a sábado. Si trae un puro, lo
              encendemos juntos.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: isMobile ? 18 : 28, marginBottom: 40 }}>
              {[
                ['Horario', 'Mar–Sáb · 11:00–21:00'],
                ['Teléfono', '+34 91 308 12 09'],
                ['Correo', 'casa@tabacoyron.com'],
                ['Metro', 'Chueca · L5'],
              ].map(([k, v]) => (
                <div key={k} style={{ paddingTop: 18, borderTop: '1px solid var(--line)' }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>{k}</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 15 : 17, color: 'var(--cream)' }}>{v}</div>
                </div>
              ))}
            </div>
            <button className="btn solid">Cómo llegar →</button>
          </div>
        </div>
      </section>
    </div>
  );
}

window.NosotrosPage = NosotrosPage;
