// Nosotros — La Casa · historia, principios, equipo, visita (datos del manual oficial)
function NosotrosPage() {
  const { isMobile, isTablet } = useViewport();
  return (
    <div className="page" data-screen-label="05 Nosotros">
      {/* Hero */}
      <section style={{
        position: 'relative', minHeight: isMobile ? 440 : 600,
        padding: 0, overflow: 'hidden',
      }}>
        <Placeholder label="ABOUT · interior tabaquería — Casco Antiguo · luz cálida"
          tag="interior" seed="tr-about-hero" variant="warm"
          style={{ position: 'absolute', inset: 0 }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(245,241,234,0.2) 0%, var(--bg) 100%)',
            zIndex: 2,
          }} />
        </Placeholder>
        <div className="container" style={{
          position: 'relative', zIndex: 3,
          padding: isMobile ? '100px 20px 64px' : '160px 56px 100px',
        }}>
          <div className="eyebrow" style={{ marginBottom: 24 }}>— Nuestra Casa —</div>
          <h1 style={{
            fontSize: 'clamp(44px, 9vw, 132px)', lineHeight: 0.92, maxWidth: 1000,
            color: 'var(--ink)', letterSpacing: '-0.03em',
          }}>
            22 años.<br/>
            Una sola dirección.<br/>
            <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Una idea grande.</span>
          </h1>
        </div>
      </section>

      {/* Story */}
      <section style={{
        padding: isMobile ? '72px 0' : '140px 0', background: 'var(--bg)',
      }}>
        <div className="container" style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr',
          gap: isMobile ? 32 : 100,
        }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>— I. La historia —</div>
            <h2 style={{
              fontSize: isMobile ? 36 : 60, lineHeight: 1.04, marginBottom: isMobile ? 24 : 40,
              color: 'var(--ink)', letterSpacing: '-0.02em',
            }}>
              Empezó como una<br/>
              <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>conversación</span>.
            </h2>
            <Placeholder label="archivo · 2003" tag="interior" seed="tr-archive-2003" variant=""
              style={{ aspectRatio: '4/5', marginTop: 32 }} />
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column',
            gap: isMobile ? 24 : 32, paddingTop: isMobile ? 0 : 80,
          }}>
            <p style={{
              fontFamily: 'var(--serif)', fontSize: isMobile ? 20 : 26,
              lineHeight: 1.5, color: 'var(--ink)', fontStyle: 'italic',
              letterSpacing: '-0.01em',
            }}>
              Hace 22 años abrimos en Ciudad de Panamá. La idea era simple: ser el
              destino del tabaco premium en Centroamérica, donde cada cliente — sin
              importar su nivel de experiencia — encontrara exactamente lo que buscaba.
            </p>
            <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--ink-2)', lineHeight: 1.85 }}>
              Detrás de la tienda hay 35 años de oficio. Más de una década antes de
              abrir las puertas, nuestro fundador ya recorría fábricas, conocía maestros
              torcedores, distribuía marcas y construía el conocimiento que hoy convierte
              cada recomendación en una garantía.
            </p>
            <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--ink-2)', lineHeight: 1.85 }}>
              Hoy somos la tienda con la mayor variedad de Panamá — más de 600 referencias —
              y el lugar donde fumar deja de ser una transacción para convertirse en
              un ritual. <span style={{ fontStyle: 'italic', color: 'var(--ink)' }}>«Si no la fumaríamos nosotros, no la vendemos.»</span>
            </p>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
              gap: isMobile ? 20 : 32, marginTop: isMobile ? 16 : 32,
              paddingTop: isMobile ? 24 : 32, borderTop: '1px solid var(--line)',
            }}>
              {[
                ['22',   'años de la marca'],
                ['35',   'años de oficio del fundador'],
                ['600+', 'referencias activas'],
                ['#1',   'en Google Maps · Panamá'],
              ].map(([n, l]) => (
                <div key={l}>
                  <div style={{
                    fontFamily: 'var(--serif)', fontSize: isMobile ? 44 : 64,
                    color: 'var(--gold)', lineHeight: 1, fontWeight: 500,
                    letterSpacing: '-0.025em',
                  }}>{n}</div>
                  <div style={{
                    fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase',
                    color: 'var(--ink-mute)', marginTop: 12,
                  }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section style={{
        background: 'var(--bg-3)', color: 'var(--paper)',
      }}>
        <div className="container">
          <SectionHead num="II" eyebrow={<span style={{ color: 'var(--gold-pure)' }}>Cómo trabajamos</span>}
            title={<span style={{ color: 'var(--paper)' }}>Cuatro <span style={{ fontStyle: 'italic', color: 'var(--gold-pure)' }}>principios</span>, fijos.</span>} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: 1, background: 'rgba(196,168,98,0.20)',
            border: '1px solid rgba(196,168,98,0.20)',
          }}>
            {[
              { n: '01', t: 'Procedencia directa',   d: 'Compramos a la fábrica. La caja que sale de la galera es la caja que llega a Panamá.' },
              { n: '02', t: 'Curaduría real',         d: 'Cada referencia pasa por un panel de tres. Si no convence a los tres, no entra a la cava.' },
              { n: '03', t: 'Conservación 70/70',     d: 'Humedad 70 %, temperatura 70 °F. Verificado dos veces al día, 365 días al año.' },
              { n: '04', t: 'Sin prisa',              d: 'No tenemos liquidaciones. No hacemos promociones. Lo que está en la cava está porque debe estar.' },
            ].map(p => (
              <div key={p.n} style={{ background: 'var(--bg-3)', padding: isMobile ? '36px 24px' : '52px 32px' }}>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold-pure)', fontSize: 16, marginBottom: 24 }}>— {p.n} —</div>
                <h3 style={{ fontSize: isMobile ? 22 : 28, lineHeight: 1.2, marginBottom: 18, color: 'var(--paper)', fontWeight: 500 }}>{p.t}</h3>
                <p style={{ fontSize: 14, color: 'rgba(245,241,234,0.65)', lineHeight: 1.75 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalidad de Marca (del manual) */}
      <section style={{ background: 'var(--bg)' }}>
        <div className="container" style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.3fr',
          gap: isMobile ? 36 : 80, alignItems: 'flex-start',
        }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>— III. Personalidad —</div>
            <h2 style={{
              fontSize: isMobile ? 36 : 56, lineHeight: 1.04, marginBottom: 28,
              color: 'var(--ink)', letterSpacing: '-0.02em',
            }}>
              Si Tabaco &amp; Ron fuera <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>una persona…</span>
            </h2>
            <p style={{
              fontFamily: 'var(--serif)', fontSize: isMobile ? 20 : 24,
              lineHeight: 1.55, color: 'var(--ink)', fontStyle: 'italic', marginBottom: 24,
            }}>
              «Un maestro con 35 años de oficio que prefiere hablar contigo en
              el mostrador que desde un podio.»
            </p>
            <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.8 }}>
              Con la calidez de un amigo y la precisión de un experto.
              Sofisticado, cálido y experto. Como un sommelier apasionado:
              con autoridad pero sin arrogancia.
            </p>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
            gap: 1, background: 'var(--line-strong)',
            border: '1px solid var(--line-strong)',
          }}>
            {[
              { t: 'Sofisticado', d: 'Preciso. Conoce los términos técnicos pero no los usa para excluir.' },
              { t: 'Cálido',      d: 'Hace que el cliente más intimidado se sienta cómodo preguntando.' },
              { t: 'Experto',     d: '35 años del fundador y 22 de la tienda respaldan cada recomendación.' },
              { t: 'Apasionado',  d: 'El tabaco no es un producto — es una filosofía. Y eso se transmite.' },
              { t: 'Honesto',     d: 'Si algo no le va al cliente, lo decimos. Aunque signifique menos venta.' },
              { t: 'Ritual',      d: 'Cada interacción con la marca es una experiencia — no una transacción.' },
            ].map((r, i) => (
              <div key={r.t} style={{ background: 'var(--paper)', padding: isMobile ? '22px 18px' : '28px 22px' }}>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: 11, marginBottom: 10 }}>
                  — {String(i+1).padStart(2,'0')} —
                </div>
                <div style={{
                  fontFamily: 'var(--sans)', fontWeight: 700, fontSize: 11,
                  letterSpacing: '0.26em', textTransform: 'uppercase',
                  color: 'var(--ink)', marginBottom: 12,
                }}>{r.t}</div>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--line)' }}>
        <div className="container">
          <SectionHead num="IV" eyebrow="Las personas" title={<>El <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>equipo</span> del mostrador.</>} />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 36 : 32 }}>
            {[
              { i: 'F', n: 'El Fundador',     r: 'Catador principal · 35 años de oficio', b: 'Recorrió fábricas de Cuba, Nicaragua y República Dominicana durante más de una década antes de abrir Tabaco & Ron en Panamá.' },
              { i: 'C', n: 'Catadora de Cava', r: 'Directora de inventario',                b: 'Veinte años en humidores. Mantiene la cava como otros mantienen una orquesta — afinada, viva, en silencio.' },
              { i: 'A', n: 'Curador de Accesorios', r: 'Selección y proveeduría',          b: 'Selecciona uno de cada veinte humidores que evalúa. Trabaja con artesanos en Florencia, Praga y la Ciudad de Panamá.' },
            ].map(p => (
              <div key={p.i}>
                <Placeholder label={`retrato · ${p.n.toLowerCase()}`} tag="portrait" seed={`tr-team-${p.i}`} variant=""
                  style={{ aspectRatio: '3/4', marginBottom: 24 }} />
                <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 24 : 28, marginBottom: 8, color: 'var(--ink)', fontWeight: 500 }}>{p.n}</div>
                <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18, fontWeight: 600 }}>{p.r}</div>
                <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.75 }}>{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit */}
      <section style={{ background: 'var(--bg)', borderTop: '1px solid var(--line)' }}>
        <div className="container" style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 36 : 80, alignItems: 'center',
        }}>
          <Placeholder label="local · interior · luz cálida del istmo" tag="interior" seed="tr-local" variant="warm"
            style={{ aspectRatio: isMobile ? '4/3' : '5/6' }} />
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>— Visítenos —</div>
            <h2 style={{
              fontSize: isMobile ? 36 : 60, lineHeight: 1.02, marginBottom: 28,
              color: 'var(--ink)', letterSpacing: '-0.025em',
            }}>
              Casco Antiguo,<br/>
              <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Ciudad de Panamá.</span>
            </h2>
            <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--ink-2)', lineHeight: 1.75, marginBottom: 36 }}>
              No hace falta cita. La puerta está abierta de lunes a sábado. Si trae un
              puro, lo encendemos juntos. Si trae una duda, mejor todavía.
            </p>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
              gap: isMobile ? 18 : 28, marginBottom: 40,
            }}>
              {[
                ['Horario',  'Lun–Sáb · 11:00–21:00'],
                ['Teléfono', '+507 6000 1234'],
                ['Correo',   'casa@tabacoyronpa.com'],
                ['Web',      'tabacoyronpa.com'],
              ].map(([k, v]) => (
                <div key={k} style={{ paddingTop: 18, borderTop: '1px solid var(--line)' }}>
                  <div style={{ fontSize: 9.5, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 8 }}>{k}</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 15 : 17, color: 'var(--ink)' }}>{v}</div>
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
