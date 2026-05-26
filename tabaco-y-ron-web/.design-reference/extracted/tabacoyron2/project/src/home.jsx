// Home — hero editorial claro + secciones de Tabaco & Ron
const { useState: useStateHome, useEffect: useEffectHome } = React;

// ─────────────────────────────── Hero ───────────────────────────────
function Hero({ setPage, layout = 'image' }) {
  const { isMobile, isTablet } = useViewport();

  // Variante IMAGEN DE FONDO (default — cinematográfica, full-bleed)
  if (layout === 'image' || (!['editorial','centered','split'].includes(layout))) {
    return (
      <section style={{
        position: 'relative', overflow: 'hidden', padding: 0,
        minHeight: isMobile ? 720 : '100vh',
        display: 'flex', flexDirection: 'column',
        color: '#F5F1EA',
      }}>
        {/* Imagen de fondo */}
        <Placeholder
          tag="hero" seed="tr-home-hero-bg" variant="warm" eager
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        />
        {/* Overlay cinematográfico — oscurece bordes para legibilidad */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: [
            'radial-gradient(ellipse at 30% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 90%)',
            'linear-gradient(180deg, rgba(15,12,10,0.55) 0%, rgba(15,12,10,0.05) 25%, rgba(15,12,10,0.10) 55%, rgba(15,12,10,0.85) 100%)',
            'linear-gradient(95deg, rgba(15,12,10,0.55) 0%, rgba(15,12,10,0) 50%)',
          ].join(', '),
        }} />

        {/* Etiqueta lateral vertical */}
        {!isMobile && (
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: 24,
            display: 'flex', alignItems: 'center', zIndex: 4,
          }}>
            <div style={{
              writingMode: 'vertical-rl', transform: 'rotate(180deg)',
              fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.52em', textTransform: 'uppercase',
              color: 'rgba(245,241,234,0.55)',
            }}>
              Casa fundada en 2003 <span style={{ color: 'var(--gold-pure)' }}>◆</span> Una sola dirección
            </div>
          </div>
        )}

        {/* Contenido */}
        <div className="fade-up" style={{
          position: 'relative', zIndex: 3, flex: 1,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          paddingBottom: isMobile ? 150 : 140,
          paddingTop: isMobile ? 100 : 120,
          paddingLeft: isMobile ? 20 : isTablet ? 56 : 96,
          paddingRight: isMobile ? 20 : 56,
        }}>
          <div style={{ maxWidth: 920 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: isMobile ? 22 : 32 }}>
              <span style={{ width: isMobile ? 28 : 60, height: 1, background: 'var(--gold-pure)' }} />
              <span style={{
                fontFamily: 'var(--sans)', fontWeight: 700,
                fontSize: 10.5, letterSpacing: '0.36em',
                textTransform: 'uppercase', color: 'var(--gold-pure)',
              }}>
                Edición MMXXVI <span className="diamond" style={{ background: 'var(--gold-pure)' }}></span> Tabaquería Premium
              </span>
            </div>
            <h1 style={{
              fontSize: 'clamp(54px, 9.2vw, 148px)',
              lineHeight: 0.94, fontWeight: 500, letterSpacing: '-0.025em',
              color: '#F5F1EA', textWrap: 'balance',
              textShadow: '0 2px 24px rgba(0,0,0,0.25)',
            }}>
              El arte<br/>
              <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--gold-pure)' }}>de fumar</span><br/>
              con calma.
            </h1>
            <p style={{
              fontSize: isMobile ? 15 : 19, color: 'rgba(245,241,234,0.82)',
              maxWidth: 580, marginTop: isMobile ? 24 : 36, lineHeight: 1.7,
            }}>
              22 años en Ciudad de Panamá curando el tabaco premium más exigente
              de Centroamérica. 600+ referencias, doce casas, una sola idea:
              <span style={{ color: 'var(--gold-pure)', fontStyle: 'italic' }}> premium es exacto, cuidado y excepcional.</span>
            </p>
            <div style={{
              display: 'flex', flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 12 : 16, marginTop: isMobile ? 32 : 48,
            }}>
              <button
                onClick={() => setPage('tienda')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 12,
                  padding: '16px 28px', cursor: 'pointer',
                  fontFamily: 'var(--sans)', fontWeight: 700,
                  fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase',
                  background: 'var(--gold-pure)', color: '#1F1D1B',
                  border: '1px solid var(--gold-pure)',
                  transition: 'all .25s ease',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F5F1EA'; e.currentTarget.style.borderColor = '#F5F1EA'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold-pure)'; e.currentTarget.style.borderColor = 'var(--gold-pure)'; }}
              >
                Ver el catálogo <span style={{ fontSize: 14 }}>→</span>
              </button>
              <button
                onClick={() => setPage('nosotros')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 12,
                  padding: '16px 28px', cursor: 'pointer',
                  fontFamily: 'var(--sans)', fontWeight: 700,
                  fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase',
                  background: 'transparent', color: '#F5F1EA',
                  border: '1px solid rgba(245,241,234,0.5)',
                  transition: 'all .25s ease',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F5F1EA'; e.currentTarget.style.color = '#1F1D1B'; e.currentTarget.style.borderColor = '#F5F1EA'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#F5F1EA'; e.currentTarget.style.borderColor = 'rgba(245,241,234,0.5)'; }}
              >
                Conocer la casa
              </button>
            </div>
          </div>
        </div>

        {/* Barra inferior con métricas */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5,
          borderTop: '1px solid rgba(196,168,98,0.28)',
          background: 'rgba(15,12,10,0.50)',
          backdropFilter: 'blur(14px) saturate(140%)',
          WebkitBackdropFilter: 'blur(14px) saturate(140%)',
        }}>
          <div className="container" style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '14px 16px' : 0,
            padding: isMobile ? '18px 20px' : '26px 56px',
          }}>
            {[
              ['22',    'años en Panamá'],
              ['600+',  'referencias premium'],
              ['12',    'casas representadas'],
              ['70/70', 'humedad / temperatura'],
            ].map(([n, l], i) => (
              <div key={l} style={{
                display: 'flex', alignItems: 'baseline', gap: isMobile ? 10 : 16,
                borderRight: !isMobile && i < 3 ? '1px solid rgba(245,241,234,0.14)' : 'none',
                paddingRight: isMobile ? 0 : 24,
              }}>
                <span style={{
                  fontFamily: 'var(--serif)', fontSize: isMobile ? 26 : 40,
                  color: 'var(--gold-pure)', lineHeight: 1, fontWeight: 500,
                  letterSpacing: '-0.025em',
                }}>{n}</span>
                <span style={{
                  fontSize: isMobile ? 9 : 10.5, letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,241,234,0.65)',
                }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Variante CENTRADA (tipografía centrada, hero etéreo)
  if (layout === 'centered' && !isMobile) {
    return (
      <section style={{
        position: 'relative', overflow: 'hidden', padding: 0, background: 'var(--bg)',
        minHeight: 'calc(100vh - 80px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div className="watermark" style={{
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(280px, 42vw, 580px)',
        }}>T&amp;R</div>
        <div className="container" style={{ position: 'relative', textAlign: 'center', zIndex: 2, paddingTop: 80, paddingBottom: 80 }}>
          <div className="divider-diamond" style={{ maxWidth: 380, margin: '0 auto 32px' }}>
            <span className="diamond"></span>
          </div>
          <div className="eyebrow" style={{ marginBottom: 28, color: 'var(--ink-mute)' }}>
            Tabaquería premium <span className="diamond"></span> Ciudad de Panamá <span className="diamond"></span> Desde 2003
          </div>
          <h1 style={{
            fontSize: 'clamp(56px, 11vw, 180px)',
            lineHeight: 0.92, fontWeight: 500, letterSpacing: '-0.035em',
            color: 'var(--ink)', textWrap: 'balance',
            maxWidth: 1200, margin: '0 auto',
          }}>
            El ritual <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>del puro</span>,<br/>
            sin prisa.
          </h1>
          <p style={{
            fontSize: 18, color: 'var(--ink-2)',
            maxWidth: 620, margin: '36px auto 0', lineHeight: 1.7,
          }}>
            22 años en Ciudad de Panamá. 600+ referencias premium curadas
            con la honestidad de quien lleva 35 años entre torcedores.
          </p>
          <div style={{
            display: 'flex', gap: 16, marginTop: 48, justifyContent: 'center',
          }}>
            <button className="btn solid" onClick={() => setPage('tienda')}>Ver el catálogo →</button>
            <button className="btn ghost" onClick={() => setPage('nosotros')}>Conocer la casa</button>
          </div>
          <div style={{
            marginTop: 96, paddingTop: 32,
            borderTop: '1px solid var(--line)', maxWidth: 720, margin: '96px auto 0',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
          }}>
            {[
              ['22',    'años en Panamá'],
              ['600+',  'referencias'],
              ['12',    'casas'],
              ['70/70', 'humedad/temp'],
            ].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 40, color: 'var(--gold)', lineHeight: 1, fontWeight: 500 }}>{n}</div>
                <div style={{ marginTop: 8, fontSize: 9.5, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Variante ASIMÉTRICA (tipografía masiva a la izq, retazos de imagen)
  if (layout === 'split' && !isMobile) {
    return (
      <section style={{
        position: 'relative', overflow: 'hidden', padding: 0, background: 'var(--bg)',
        minHeight: 'calc(100vh - 80px)',
      }}>
        <div className="container" style={{
          position: 'relative', height: '100%',
          padding: '64px 56px 56px',
        }}>
          {/* Tipografía masiva */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div className="eyebrow" style={{ marginBottom: 28 }}>— Edición MMXXVI —</div>
            <h1 style={{
              fontSize: 'clamp(64px, 13vw, 220px)',
              lineHeight: 0.86, fontWeight: 500, letterSpacing: '-0.035em',
              color: 'var(--ink)',
            }}>
              El ritual<br/>
              <span style={{ fontStyle: 'italic', color: 'var(--gold)', marginLeft: '12vw' }}>del puro</span>
            </h1>
          </div>

          {/* Imágenes flotantes */}
          <div style={{
            position: 'absolute', right: '7vw', top: '14vw',
            width: '22vw', height: '28vw', maxWidth: 360, maxHeight: 460, zIndex: 1,
          }}>
            <Placeholder label="" tag="hero" seed="tr-split-1" variant="warm" eager style={{ position: 'absolute', inset: 0 }} />
          </div>
          <div style={{
            position: 'absolute', right: '24vw', bottom: '6vw',
            width: '16vw', height: '20vw', maxWidth: 260, maxHeight: 340, zIndex: 1,
          }}>
            <Placeholder label="" tag="cigar" seed="tr-split-2" variant="" style={{ position: 'absolute', inset: 0 }} />
          </div>

          {/* Texto inferior */}
          <div style={{
            position: 'absolute', left: 56, bottom: 56, right: '40vw',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            gap: 48, paddingTop: 32, borderTop: '1px solid var(--line)', zIndex: 2,
          }}>
            <p style={{
              fontSize: 17, color: 'var(--ink-2)', maxWidth: 420, lineHeight: 1.7,
            }}>
              22 años en Ciudad de Panamá. 600+ referencias premium curadas
              con la honestidad de quien lleva 35 años entre torcedores.
            </p>
            <div style={{ display: 'flex', gap: 12, whiteSpace: 'nowrap' }}>
              <button className="btn solid" onClick={() => setPage('tienda')}>Ver catálogo →</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Variante EDITORIAL (default)
  return (
    <section style={{
      position: 'relative', padding: 0, overflow: 'hidden', background: 'var(--bg)',
    }}>
      <div className="watermark" style={{
        top: isMobile ? -40 : -60, left: -40,
        fontSize: 'clamp(220px, 32vw, 460px)',
      }}>T&amp;R</div>

      <div className="container" style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr',
        gap: isMobile ? 36 : 64,
        alignItems: 'center',
        paddingTop: isMobile ? 48 : 88,
        paddingBottom: isMobile ? 48 : 88,
        minHeight: isMobile ? 'auto' : 'calc(100vh - 80px)',
      }}>
        <div className="fade-up" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
            <span style={{ width: isMobile ? 28 : 48, height: 1, background: 'var(--gold)' }} />
            <span className="eyebrow">Edición MMXXVI <span className="diamond"></span> Tabaquería Premium</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(48px, 8.4vw, 124px)',
            lineHeight: 0.94, fontWeight: 500, letterSpacing: '-0.025em',
            color: 'var(--ink)', textWrap: 'balance',
          }}>
            El ritual<br/>
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--gold)' }}>del puro</span>,<br/>
            sin prisa.
          </h1>
          <p style={{
            fontSize: isMobile ? 15 : 18, color: 'var(--ink-2)',
            maxWidth: 520, marginTop: isMobile ? 26 : 38, lineHeight: 1.7,
          }}>
            Hace 22 años abrimos en Ciudad de Panamá con una idea simple:
            ser el destino del tabaco premium en Centroamérica. Hoy, 600+ referencias
            y una asesoría que entiende lo que buscas — incluso si todavía no lo sabes.
          </p>
          <div style={{
            display: 'flex', flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 12 : 16, marginTop: isMobile ? 32 : 48,
          }}>
            <button className="btn solid" onClick={() => setPage('tienda')}>
              Ver el catálogo
              <span style={{ fontSize: 14, marginLeft: 2 }}>→</span>
            </button>
            <button className="btn ghost" onClick={() => setPage('nosotros')}>
              Conocer la casa
            </button>
          </div>

          <div style={{
            marginTop: isMobile ? 48 : 72,
            paddingTop: isMobile ? 32 : 40,
            borderTop: '1px solid var(--line)',
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '24px 16px' : 24,
          }}>
            {[
              ['22',    'años en Panamá'],
              ['600+',  'referencias activas'],
              ['12',    'casas representadas'],
              ['70/70', 'humedad / temp.'],
            ].map(([n, l], i) => (
              <div key={i}>
                <div style={{
                  fontFamily: 'var(--serif)', fontSize: isMobile ? 36 : 44,
                  color: 'var(--gold)', lineHeight: 1, fontWeight: 500,
                  letterSpacing: '-0.02em',
                }}>{n}</div>
                <div style={{
                  marginTop: 10,
                  fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: 'var(--ink-mute)',
                }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {!isMobile && (
          <div style={{ position: 'relative', height: '100%', minHeight: 560 }}>
            <Placeholder
              label="hero · habano + humo · tratamiento cálido"
              tag="hero" seed="tr-home-hero-light" variant="warm" eager
              style={{ position: 'absolute', inset: 0, aspectRatio: '4/5' }}
            />
            <div style={{
              position: 'absolute', top: 24, right: 24, zIndex: 4,
              background: 'var(--ink)', color: 'var(--paper)',
              padding: '10px 16px', fontSize: 9.5, letterSpacing: '0.28em',
              textTransform: 'uppercase', fontWeight: 700,
            }}>
              Selección del mes
            </div>
            <div style={{
              position: 'absolute',
              bottom: -32, left: -40,
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              padding: '24px 28px',
              maxWidth: 280,
              boxShadow: '0 24px 48px rgba(31,29,27,0.10)',
              zIndex: 5,
            }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Voz de la casa</div>
              <div style={{
                fontFamily: 'var(--serif)', fontStyle: 'italic',
                fontSize: 17, color: 'var(--ink)', lineHeight: 1.5,
              }}>
                "Sofisticado, cálido y experto. Como un sommelier apasionado:
                con autoridad pero sin arrogancia."
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────── Manifiesto ───────────────────────────────
function ManifestoSection() {
  const { isMobile } = useViewport();
  return (
    <section style={{
      background: 'var(--bg-2)',
      borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="container" style={{
        position: 'relative', display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr',
        gap: isMobile ? 36 : 96, alignItems: 'center',
      }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 24 }}>— I. Manifiesto —</div>
          <div style={{
            fontFamily: 'var(--serif)', fontSize: isMobile ? 22 : 28,
            lineHeight: 1.45, color: 'var(--ink)', fontStyle: 'italic',
          }}>
            Hay tabaco que se vende.<br/>
            Y hay tabaco que se elige.
          </div>
        </div>
        <div>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: isMobile ? 24 : 38,
            lineHeight: 1.32, color: 'var(--ink)', textWrap: 'pretty',
            letterSpacing: '-0.012em', fontWeight: 400,
          }}>
            22 años eligiendo cada caja a mano. 35 años de oficio en el fundador.
            <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}> Premium no es caro: es exacto, cuidado y excepcional.</span>
            {' '}Ese es el único filtro.
          </p>
          <div style={{
            marginTop: isMobile ? 36 : 52,
            display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <div style={{
              width: 60, height: 60,
              border: '1px solid var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--gold)', fontFamily: 'var(--serif)', fontStyle: 'italic',
              fontSize: 22, fontWeight: 500,
            }}>
              T&amp;R
            </div>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 17, color: 'var(--ink)' }}>
                Fundador &amp; equipo de la casa
              </div>
              <div style={{
                fontSize: 10.5, letterSpacing: '0.26em', textTransform: 'uppercase',
                color: 'var(--ink-mute)', marginTop: 6,
              }}>
                35 años de oficio <span className="diamond"></span> Ciudad de Panamá
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────── Brands Strip ───────────────────────────────
function BrandsStrip({ setPage }) {
  const { BRANDS } = window.TR;
  const { isMobile, isTablet } = useViewport();
  const cols = isMobile ? 1 : isTablet ? 2 : 4;

  return (
    <section style={{ background: 'var(--bg)' }}>
      <div className="container">
        <SectionHead
          num="II"
          eyebrow="Las Casas"
          title={<>Doce casas. <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Una sola estantería.</span></>}
          action={<button className="btn" onClick={() => setPage('tienda')}>Ver todas →</button>}
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 1, background: 'var(--line-strong)',
          border: '1px solid var(--line-strong)',
        }}>
          {BRANDS.map((b, i) => (
            <button key={b.id}
              onClick={() => setPage('tienda', { brand: b.id })}
              style={{
                background: 'var(--paper)',
                padding: isMobile ? '28px 22px' : '40px 28px',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14,
                textAlign: 'left', transition: 'all .25s',
                minHeight: isMobile ? 160 : 220,
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--paper)'; }}
            >
              <div style={{
                fontFamily: 'var(--serif)', fontStyle: 'italic',
                color: 'var(--gold)', fontSize: 13,
              }}>{String(i+1).padStart(2, '0')}</div>
              <div style={{
                fontFamily: 'var(--serif)', fontSize: isMobile ? 22 : 28,
                lineHeight: 1.1, color: 'var(--ink)', fontWeight: 500,
              }}>{b.name}</div>
              <div style={{
                fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
                color: 'var(--ink-mute)',
              }}>{b.origin} <span className="diamond"></span> {b.founded}</div>
              <div style={{
                fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55, marginTop: 'auto',
              }}>{b.blurb}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────── Featured Product ───────────────────────────────
function FeaturedProduct({ setPage, openProduct }) {
  const { PRODUCTS, BRANDS } = window.TR;
  const featured = PRODUCTS.find(p => p.id === 'p01');
  const brand = BRANDS.find(b => b.id === featured.brand);
  const { isMobile } = useViewport();

  return (
    <section style={{
      background: 'var(--bg-2)',
      borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
    }}>
      <div className="container" style={{
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr',
        gap: isMobile ? 36 : 80, alignItems: 'center',
      }}>
        <div style={{ position: 'relative' }}>
          <Placeholder
            productMode glyph="❦"
            seed="tr-featured-p01"
            style={{ aspectRatio: '4/5', position: 'relative' }}
          >
            <div style={{
              position: 'absolute', top: 20, left: 20, padding: '6px 14px',
              background: 'var(--red)', color: 'var(--paper)',
              fontSize: 9.5, letterSpacing: '0.26em', textTransform: 'uppercase',
              fontWeight: 700, zIndex: 3,
            }}>
              Pieza del mes
            </div>
          </Placeholder>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 22 }}>— III. La pieza del mes —</div>
          <div style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            color: 'var(--gold)', fontSize: 18, marginBottom: 14,
          }}>{brand.name}</div>
          <h2 style={{
            fontSize: isMobile ? 48 : 84,
            lineHeight: 0.96, marginBottom: 26, color: 'var(--ink)',
            letterSpacing: '-0.025em',
          }}>{featured.name}</h2>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: isMobile ? 18 : 24,
            color: 'var(--ink)', lineHeight: 1.5, fontStyle: 'italic',
          }}>
            "{featured.note}"
          </p>
          <div style={{
            marginTop: 40,
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            gap: isMobile ? 16 : 28, paddingTop: 32,
            borderTop: '1px solid var(--line)',
          }}>
            {[
              ['Vitola',      featured.vitola],
              ['Intensidad',  featured.intensity],
              ['Cosecha',     featured.vintage],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{
                  fontSize: 9.5, letterSpacing: '0.28em', textTransform: 'uppercase',
                  color: 'var(--ink-mute)', marginBottom: 8,
                }}>{k}</div>
                <div style={{
                  fontFamily: 'var(--serif)', fontSize: isMobile ? 15 : 18,
                  color: 'var(--ink)',
                }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 40,
            display: 'flex', flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'baseline',
            gap: isMobile ? 20 : 28,
          }}>
            <span style={{
              fontFamily: 'var(--serif)', fontSize: isMobile ? 40 : 54,
              color: 'var(--gold)', fontWeight: 500,
            }}>USD {featured.price}</span>
            <button className="btn solid" onClick={() => openProduct(featured)}>
              Ver la pieza →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────── Values (del manual) ───────────────────────────────
function ValuesSection() {
  const { VALUES } = window.TR;
  const { isMobile, isTablet } = useViewport();
  return (
    <section style={{ background: 'var(--bg-3)', color: 'var(--paper)' }}>
      <div className="container">
        <SectionHead
          num="IV"
          eyebrow="Lo que somos"
          title={<span style={{ color: 'var(--paper)' }}>Ocho principios. <span style={{ fontStyle: 'italic', color: 'var(--gold-pure)' }}>Cero atajos.</span></span>}
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: 1, background: 'rgba(196,168,98,0.18)',
          border: '1px solid rgba(196,168,98,0.18)',
        }}>
          {VALUES.map((val, i) => (
            <div key={val.k} style={{
              background: 'var(--bg-3)',
              padding: isMobile ? '32px 24px' : '36px 28px',
              minHeight: isMobile ? 'auto' : 200,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                fontFamily: 'var(--serif)', fontStyle: 'italic',
                color: 'var(--gold-pure)', fontSize: 13, marginBottom: 16,
              }}>— {String(i+1).padStart(2, '0')} —</div>
              <h3 style={{
                fontSize: 22, lineHeight: 1.2, marginBottom: 14,
                color: 'var(--paper)', letterSpacing: '0.02em',
                fontFamily: 'var(--sans)', fontWeight: 600,
                textTransform: 'uppercase',
              }}>{val.k}</h3>
              <p style={{
                fontSize: 13.5, color: 'rgba(245,241,234,0.65)', lineHeight: 1.7,
              }}>{val.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────── Lookbook ───────────────────────────────
function LookbookTeaser() {
  const { isMobile } = useViewport();
  const slots = [
    { label: 'manos · liando',     tag: 'hands',   seed: 'tr-look-hands',     variant: 'warm',    span: { col: 4, row: 2 } },
    { label: 'humo · macro',       tag: 'smoke',   seed: 'tr-look-smoke',     variant: 'smoke',   span: { col: 5, row: 1 } },
    { label: 'anillas · detalle',  tag: 'ring',    seed: 'tr-look-ring',      variant: '',        span: { col: 3, row: 1 } },
    { label: 'humidor · interior', tag: 'box',     seed: 'tr-look-humidor',   variant: 'warm',    span: { col: 3, row: 1 } },
    { label: 'ron · cristalería',  tag: 'whiskey', seed: 'tr-look-ron',       variant: 'crimson', span: { col: 5, row: 1 } },
  ];

  if (isMobile) {
    return (
      <section style={{ background: 'var(--bg)' }}>
        <div className="container">
          <SectionHead num="V" eyebrow="Lookbook" title={<>El gesto, <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>antes que el objeto.</span></>} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {slots.map((s, i) => (
              <Placeholder key={i} label={s.label} seed={s.seed} tag={s.tag} variant={s.variant}
                style={{ aspectRatio: i === 0 ? '3/4' : '1/1', gridColumn: i === 0 ? 'span 2' : 'auto' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <button className="btn">Ver lookbook completo →</button>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section style={{ background: 'var(--bg)' }}>
      <div className="container">
        <SectionHead num="V" eyebrow="Lookbook" title={<>El gesto, <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>antes que el objeto.</span></>} />
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: '320px 320px', gap: 14,
        }}>
          {slots.map((s, i) => (
            <Placeholder key={i} label={s.label} seed={s.seed} tag={s.tag} variant={s.variant}
              style={{ gridColumn: `span ${s.span.col}`, gridRow: `span ${s.span.row}` }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
          <button className="btn">Ver lookbook completo →</button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────── Testimonials ───────────────────────────────
function Testimonials() {
  const { TESTIMONIALS } = window.TR;
  const { isMobile } = useViewport();
  const [idx, setIdx] = useStateHome(0);
  useEffectHome(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TESTIMONIALS.length), 6500);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[idx];

  return (
    <section style={{ background: 'var(--bg-2)', position: 'relative', overflow: 'hidden' }}>
      <div className="watermark" style={{
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(280px, 38vw, 540px)',
      }}>"</div>
      <div className="container" style={{ maxWidth: 1080, position: 'relative' }}>
        <div className="eyebrow" style={{
          textAlign: 'center', marginBottom: isMobile ? 28 : 44,
        }}>— VI. Cartas de clientes —</div>
        <blockquote key={idx} className="fade-up" style={{ margin: 0, padding: 0 }}>
          <div style={{
            fontFamily: 'var(--serif)', fontSize: isMobile ? 56 : 80,
            color: 'var(--gold)', lineHeight: 1, marginBottom: 16, textAlign: 'center',
            fontStyle: 'italic',
          }}>"</div>
          <p style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: isMobile ? 22 : 38, lineHeight: 1.4, textAlign: 'center',
            color: 'var(--ink)', letterSpacing: '-0.012em',
            textWrap: 'balance',
          }}>
            {t.quote}
          </p>
          <div style={{ marginTop: isMobile ? 32 : 48, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--ink)' }}>
              — {t.author}
            </div>
            <div style={{
              fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase',
              color: 'var(--ink-mute)', marginTop: 10,
            }}>
              {t.role} <span className="diamond"></span> {t.city}
            </div>
          </div>
        </blockquote>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 56 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Testimonio ${i+1}`} style={{
              width: i === idx ? 36 : 10, height: 2,
              background: i === idx ? 'var(--gold)' : 'var(--line-strong)',
              transition: 'all .3s',
            }}/>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────── HomePage ───────────────────────────────
function HomePage({ setPage, openProduct, tweaks = {} }) {
  return (
    <div className="page" data-screen-label="01 Home">
      <Hero setPage={setPage} layout={tweaks.heroLayout || 'image'} />
      <ManifestoSection />
      <BrandsStrip setPage={setPage} />
      <FeaturedProduct setPage={setPage} openProduct={openProduct} />
      <ValuesSection />
      <LookbookTeaser />
      <Testimonials />
    </div>
  );
}

window.HomePage = HomePage;
