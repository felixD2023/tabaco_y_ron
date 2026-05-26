// Home — cinematic hero + secciones de Tabaco & Ron
const { useState: useStateHome, useEffect: useEffectHome } = React;

function Hero({ setPage }) {
  const { isMobile } = useViewport();
  return (
    <section style={{ position: 'relative', height: '100vh', minHeight: isMobile ? 600 : 720, padding: 0, overflow: 'hidden' }}>
      {/* Background image placeholder */}
      <Placeholder label="HERO · 1920×1080 · puro encendido + humo + claroscuro"
        tag="hero" seed="tr-home-hero" eager
        variant="smoke"
        style={{ position: 'absolute', inset: 0 }}>
        {/* extra cinematic vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 90%)', zIndex: 2 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0) 30%, rgba(10,10,10,0) 60%, rgba(10,10,10,0.9) 100%)', zIndex: 2 }} />
      </Placeholder>

      {/* Floating side label */}
      {!isMobile && (
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 24, display: 'flex', alignItems: 'center', zIndex: 3 }}>
          <div style={{
            writingMode: 'vertical-rl', transform: 'rotate(180deg)',
            fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--cream-mute)'
          }}>
            Casa fundada en 2009 · Una sola dirección, una sola idea
          </div>
        </div>
      )}

      <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: isMobile ? 130 : 100, zIndex: 4 }}>
        <div style={{ maxWidth: 880 }} className="fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: isMobile ? 20 : 28 }}>
            <span style={{ width: isMobile ? 28 : 48, height: 1, background: 'var(--gold)' }} />
            <span className="eyebrow">Edición Primavera · MMXXVI</span>
          </div>
          <h1 style={{ fontSize: 'clamp(46px, 8vw, 124px)', lineHeight: 0.96, fontWeight: 400, letterSpacing: '-0.02em' }}>
            El arte<br/>
            <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>de fumar</span><br/>
            con calma.
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 18, color: 'var(--cream-mute)', maxWidth: 540, marginTop: isMobile ? 24 : 36, lineHeight: 1.65 }}>
            Una selección curada de los mejores habanos del mundo, traídos directamente de las
            casas que aún liden la hoja a mano. Sin atajos, sin prisa, sin concesiones.
          </p>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 16, marginTop: isMobile ? 32 : 48 }}>
            <button className="btn solid" style={{ justifyContent: isMobile ? 'center' : 'flex-start' }} onClick={() => setPage('tienda')}>
              Ver el catálogo
              <span style={{ fontSize: 16, marginLeft: 4 }}>→</span>
            </button>
            <button className="btn ghost" style={{ justifyContent: isMobile ? 'center' : 'flex-start' }} onClick={() => setPage('nosotros')}>
              Conocer la casa
            </button>
          </div>
        </div>
      </div>

      {/* Bottom strip with stats */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5,
        borderTop: '1px solid var(--line)',
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '12px 16px' : 0, padding: isMobile ? '16px 20px' : '24px 56px' }}>
          {[
            ['12', 'casas representadas'],
            ['200+', 'referencias activas'],
            ['17', 'años de oficio'],
            ['70 / 70', 'humedad / temperatura'],
          ].map(([n, l], i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'baseline', gap: isMobile ? 8 : 14,
              borderRight: !isMobile && i < 3 ? '1px solid var(--line)' : 'none',
              paddingRight: isMobile ? 0 : 24,
            }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 24 : 36, color: 'var(--gold)', lineHeight: 1 }}>{n}</span>
              <span style={{ fontSize: isMobile ? 9 : 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-mute)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ManifestoSection() {
  const { isMobile } = useViewport();
  return (
    <section style={{ background: 'var(--bg)', position: 'relative' }}>
      <div className="smoke-bg" />
      <div className="container" style={{ position: 'relative', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr', gap: isMobile ? 36 : 100, alignItems: 'center' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 24 }}>— I. Manifiesto —</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 22 : 26, lineHeight: 1.5, color: 'var(--cream)' }}>
            Hay tabaco que se vende. Y hay tabaco que se elige.
          </div>
        </div>
        <div>
          <p style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 22 : 36, lineHeight: 1.35, color: 'var(--cream)', textWrap: 'pretty', letterSpacing: '-0.01em' }}>
            Cada caja que entra a nuestra casa pasa por dos manos: las del torcedor que la liga
            y las del catador que la aprueba. <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Si no nos gustaría regalársela a un amigo, no la
            vendemos.</span> Ese es el único filtro.
          </p>
          <div style={{ marginTop: isMobile ? 32 : 48, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#1a1611', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18 }}>
              EM
            </div>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 16 }}>Esteban Marrero</div>
              <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 4 }}>Fundador · Catador certificado</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandsStrip({ setPage }) {
  const { BRANDS } = window.TR;
  const { isMobile, isTablet } = useViewport();
  const cols = isMobile ? 1 : isTablet ? 2 : 4;
  return (
    <section style={{ background: 'var(--bg-2)', padding: isMobile ? '64px 0' : '100px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="container">
        <SectionHead
          num="II"
          eyebrow="Las Casas"
          title={<>Doce casas. Una sola estantería.</>}
          action={<button className="btn" onClick={() => setPage('tienda')}>Ver todas →</button>}
        />
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 1, background: 'var(--line)', border: '1px solid var(--line)' }}>
          {BRANDS.map((b, i) => (
            <button key={b.id} onClick={() => setPage('tienda', { brand: b.id })} className="brand-cell" style={{
              background: 'var(--bg-2)', padding: isMobile ? '28px 22px' : '40px 28px',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14,
              textAlign: 'left', transition: 'background .25s',
              minHeight: isMobile ? 160 : 200,
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#1f1c15'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-2)'}
            >
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: 12 }}>0{i+1 < 10 ? i+1 : i+1}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 22 : 26, lineHeight: 1.1, color: 'var(--cream)' }}>{b.name}</div>
              <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cream-mute)' }}>{b.origin} · {b.founded}</div>
              <div style={{ fontSize: 13, color: 'var(--cream-mute)', lineHeight: 1.5, marginTop: 'auto' }}>{b.blurb}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProduct({ setPage, openProduct }) {
  const { PRODUCTS } = window.TR;
  const featured = PRODUCTS.find(p => p.id === 'p01');
  const { isMobile } = useViewport();

  return (
    <section style={{ background: 'var(--bg)', padding: isMobile ? '80px 0' : '160px 0' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr', gap: isMobile ? 36 : 80, alignItems: 'center' }}>
        <Placeholder label="" productImage="arturo-fuente-cuban-corona"
          style={{ aspectRatio: '4/5', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 20, left: 20, padding: '6px 12px', background: 'var(--red)', color: 'var(--cream)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, zIndex: 3 }}>
            Pieza del mes
          </div>
        </Placeholder>
        <div>
          <div className="eyebrow" style={{ marginBottom: 22 }}>— III. La pieza del mes —</div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: 16, marginBottom: 14 }}>{featured.brand === 'cohiba' ? 'Cohiba' : ''}</div>
          <h2 style={{ fontSize: isMobile ? 48 : 80, lineHeight: 0.95, marginBottom: 24 }}>{featured.name}</h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 18 : 22, color: 'var(--cream)', lineHeight: 1.5, fontStyle: 'italic' }}>
            "{featured.note}"
          </p>
          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: isMobile ? 16 : 28, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
            {[
              ['Vitola', featured.vitola],
              ['Intensidad', featured.intensity],
              ['Cosecha', featured.vintage],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>{k}</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 15 : 18, color: 'var(--cream)' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'baseline', gap: isMobile ? 20 : 28 }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 40 : 48, color: 'var(--gold)' }}>{featured.price} €</span>
            <button className="btn solid" onClick={() => openProduct(featured)}>Ver producto →</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LookbookTeaser() {
  const { isMobile, isTablet } = useViewport();
  // Mobile: simple stacked 2-row grid. Desktop: 12-col asymmetric.
  if (isMobile) {
    return (
      <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <SectionHead num="IV" eyebrow="Lookbook" title={<>El gesto, antes que el objeto.</>} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Placeholder label="hands · liando"    tag="hands"   seed="tr-look-hands"   variant="warm"    style={{ aspectRatio: '3/4', gridColumn: 'span 2' }} />
            <Placeholder label="humo · macro"      tag="smoke"   seed="tr-look-smoke"   variant="smoke"   style={{ aspectRatio: '1/1' }} />
            <Placeholder label="anillas · detalle" tag="ring"    seed="tr-look-ring"    variant=""        style={{ aspectRatio: '1/1' }} />
            <Placeholder label="humidor · interior" tag="box"    seed="tr-look-humidor" variant="warm"    style={{ aspectRatio: '1/1' }} />
            <Placeholder label="ron · cristalería" tag="whiskey" seed="tr-look-ron"     variant="crimson" style={{ aspectRatio: '1/1' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <button className="btn">Ver lookbook completo →</button>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="container">
        <SectionHead num="IV" eyebrow="Lookbook" title={<>El gesto, antes que el objeto.</>} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: '300px 300px', gap: 16 }}>
          <Placeholder label="hands · liando"       tag="hands"   seed="tr-look-hands"   variant="warm"   style={{ gridColumn: 'span 4', gridRow: 'span 2' }} />
          <Placeholder label="humo · macro"        tag="smoke"   seed="tr-look-smoke"   variant="smoke"  style={{ gridColumn: 'span 5', gridRow: 'span 1' }} />
          <Placeholder label="anillas · detalle"  tag="ring"    seed="tr-look-ring"    variant=""       style={{ gridColumn: 'span 3', gridRow: 'span 1' }} />
          <Placeholder label="humidor · interior" tag="box"     seed="tr-look-humidor" variant="warm"   style={{ gridColumn: 'span 3', gridRow: 'span 1' }} />
          <Placeholder label="ron · cristalería"  tag="whiskey" seed="tr-look-ron"     variant="crimson" style={{ gridColumn: 'span 5', gridRow: 'span 1' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
          <button className="btn">Ver lookbook completo →</button>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const { TESTIMONIALS } = window.TR;
  const { isMobile } = useViewport();
  const [idx, setIdx] = useStateHome(0);
  useEffectHome(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[idx];

  return (
    <section style={{ background: 'var(--bg)', padding: isMobile ? '88px 0' : '140px 0', position: 'relative' }}>
      <div className="container" style={{ maxWidth: 1080 }}>
        <div className="eyebrow" style={{ textAlign: 'center', marginBottom: isMobile ? 28 : 40 }}>— V. Cartas de clientes —</div>
        <blockquote key={idx} className="fade-up" style={{ margin: 0, padding: 0 }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 52 : 72, color: 'var(--gold)', lineHeight: 1, marginBottom: 16, textAlign: 'center' }}>"</div>
          <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: isMobile ? 22 : 36, lineHeight: 1.4, textAlign: 'center', color: 'var(--cream)', letterSpacing: '-0.01em' }}>
            {t.quote}
          </p>
          <div style={{ marginTop: isMobile ? 32 : 48, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>— {t.author}</div>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cream-mute)', marginTop: 8 }}>
              {t.role} · {t.city}
            </div>
          </div>
        </blockquote>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 56 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{
              width: i === idx ? 36 : 8, height: 2, background: i === idx ? 'var(--gold)' : 'var(--line-strong)',
              transition: 'all .3s',
            }}/>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage({ setPage, openProduct }) {
  return (
    <div className="page">
      <Hero setPage={setPage} />
      <ManifestoSection />
      <BrandsStrip setPage={setPage} />
      <FeaturedProduct setPage={setPage} openProduct={openProduct} />
      <LookbookTeaser />
      <Testimonials />
    </div>
  );
}

window.HomePage = HomePage;
