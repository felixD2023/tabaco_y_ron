// Componentes compartidos — Logo, Nav, Footer, Placeholder, Chip, SectionHead
const { useState, useEffect, useMemo, useRef } = React;

function useViewport() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return { width: w, isMobile: w < 720, isTablet: w >= 720 && w < 1024, isDesktop: w >= 1024 };
}

// ─────────────────────────────── Logo ───────────────────────────────
function Logo({ size = 18 }) {
  return (
    <span className="logo-pill" style={{
      fontSize: `${size}px`,
      padding: `${size*0.45}px ${size*1.05}px ${size*0.55}px`,
    }}>
      Tabaco &amp; Ron
    </span>
  );
}
function Monogram({ size = 28 }) {
  return (
    <span className="logo-pill" style={{
      fontSize: `${size}px`,
      padding: `${size*0.25}px ${size*0.7}px ${size*0.35}px`,
      letterSpacing: 0,
    }}>
      T&amp;R
    </span>
  );
}

// ─────────────────────────────── NavLink ───────────────────────────────
function NavLink({ label, page, num, active, onClick }) {
  return (
    <button
      onClick={() => onClick(page)}
      style={{
        fontFamily: 'var(--sans)',
        fontWeight: 600,
        fontSize: 11,
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: active ? 'var(--gold)' : 'currentColor',
        opacity: active ? 1 : 0.85,
        padding: '8px 0',
        position: 'relative',
        transition: 'all .2s',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.opacity = '1'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.opacity = '0.85'; }}
    >
      <span style={{
        fontFamily: 'var(--serif)', fontStyle: 'italic',
        color: 'var(--gold)', marginRight: 8, fontSize: 11,
        opacity: active ? 1 : 0.7,
      }}>{num}</span>
      {label}
      {active && (
        <span style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 1, background: 'var(--gold)',
        }} />
      )}
    </button>
  );
}

// ─────────────────────────────── TopBar ───────────────────────────────
function TopBar({ page, setPage, cartCount }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile, isTablet } = useViewport();
  const compact = isMobile || isTablet;

  // Solo en Home y arriba del todo el header flota transparente sobre el hero.
  // En el resto de páginas siempre va con su fondo blureado para legibilidad.
  const overImage = page === 'home' && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const go = (p) => { setMenuOpen(false); setPage(p); };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: overImage ? 'transparent' : 'rgba(245,241,234,0.55)',
      backdropFilter: overImage ? 'none' : 'blur(22px) saturate(140%)',
      WebkitBackdropFilter: overImage ? 'none' : 'blur(22px) saturate(140%)',
      borderBottom: !overImage ? '1px solid rgba(31,29,27,0.10)' : '1px solid transparent',
      transition: 'all .35s ease',
      color: overImage ? '#F5F1EA' : 'var(--ink)',
    }}>
      {/* Announcement bar */}
      <div style={{
        background: overImage ? 'rgba(15,12,10,0.45)' : 'var(--bg-3)',
        backdropFilter: overImage ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: overImage ? 'blur(8px)' : 'none',
        color: '#E0D6BD',
        textAlign: 'center',
        padding: isMobile ? '7px 16px' : '9px 24px',
        fontSize: isMobile ? 9 : 10.5,
        letterSpacing: isMobile ? '0.18em' : '0.28em',
        textTransform: 'uppercase',
        fontWeight: 500,
        transition: 'all .35s ease',
      }}>
        <span style={{ color: 'var(--gold-pure)' }}>◆</span>
        <span style={{ margin: '0 14px' }}>
          {isMobile
            ? '22 años · 600+ referencias · Panamá'
            : '22 años en Ciudad de Panamá · 600+ referencias · Asesoría experta desde 2003'}
        </span>
        <span style={{ color: 'var(--gold-pure)' }}>◆</span>
      </div>

      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '14px 20px' : '20px 56px',
      }}>
        <button onClick={() => go('home')} style={{ display: 'flex', alignItems: 'center' }}>
          <Logo size={isMobile ? 15 : 17} />
        </button>

        {!compact && (
          <nav style={{ display: 'flex', gap: 38 }}>
            <NavLink label="Tienda"     page="tienda"     num="01" active={page === 'tienda'}     onClick={setPage} />
            <NavLink label="Accesorios" page="accesorios" num="02" active={page === 'accesorios'} onClick={setPage} />
            <NavLink label="El Cuaderno" page="blog"       num="03" active={page === 'blog'}       onClick={setPage} />
            <NavLink label="La Casa"    page="nosotros"   num="04" active={page === 'nosotros'}   onClick={setPage} />
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 14 : 22 }}>
          {!isMobile && (
            <>
              <button style={{ color: 'currentColor', opacity: 0.85 }} title="Buscar" aria-label="Buscar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
              <button style={{ color: 'currentColor', opacity: 0.85 }} title="Cuenta" aria-label="Cuenta">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </button>
            </>
          )}
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'currentColor', fontSize: 11,
            letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 600,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 2-1.6L23 6H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>
            {!isMobile && <span>Bolsa · <span style={{ color: 'var(--gold)' }}>{cartCount}</span></span>}
            {isMobile && <span style={{ fontFamily: 'var(--serif)', fontSize: 13, color: 'var(--gold)' }}>{cartCount}</span>}
          </button>
          {compact && (
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú" style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5,
              width: 32, height: 32, color: 'currentColor',
            }}>
              <span style={{ width: 22, height: 1.5, background: 'currentColor', transform: menuOpen ? 'translateY(3px) rotate(45deg)' : 'none', transition: 'transform .2s' }} />
              <span style={{ width: 22, height: 1.5, background: 'currentColor', transform: menuOpen ? 'translateY(-3px) rotate(-45deg)' : 'none', transition: 'transform .2s' }} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile / tablet menu drawer */}
      {compact && menuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 49,
          background: 'rgba(245,241,234,0.98)', backdropFilter: 'blur(20px)',
          paddingTop: 92,
          animation: 'fadeIn 0.25s ease',
        }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
          <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['tienda',     'Tienda',      '01'],
              ['accesorios', 'Accesorios',  '02'],
              ['blog',       'El Cuaderno', '03'],
              ['nosotros',   'La Casa',     '04'],
            ].map(([p, l, n]) => (
              <button key={p} onClick={() => go(p)} style={{
                display: 'flex', alignItems: 'baseline', gap: 16,
                padding: '22px 8px', textAlign: 'left',
                borderBottom: '1px solid var(--line)',
                color: page === p ? 'var(--gold)' : 'var(--ink)',
              }}>
                <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: 14, opacity: 0.7 }}>— {n}</span>
                <span style={{ fontFamily: 'var(--serif)', fontSize: 36, lineHeight: 1 }}>{l}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--gold)', fontSize: 18 }}>→</span>
              </button>
            ))}
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line)', display: 'flex', gap: 12 }}>
              <button className="btn" style={{ flex: 1, justifyContent: 'center' }}>Buscar</button>
              <button className="btn" style={{ flex: 1, justifyContent: 'center' }}>Cuenta</button>
            </div>
            <div style={{ marginTop: 40, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-mute)', lineHeight: 1.9 }}>
              Casco Antiguo · Ciudad de Panamá<br/>
              Lun–Sáb · 11–21h<br/>
              +507 6000 1234
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────── Placeholder (con/sin foto) ───────────────────────────────
function Placeholder({
  label, variant = '', style = {}, children,
  seed, tag, noPhoto = false, eager = false, w = 1200,
  productMode = false, glyph,
}) {
  const { pickImg, imgUrl } = window.TR;
  // Modo producto: glyph en lugar de imagen real (sin assets)
  if (productMode) {
    return (
      <div className={`ph ph-product`} style={style}>
        <span className="ph-glyph">{glyph || '⁘'}</span>
        {children}
      </div>
    );
  }
  const derivedSeed = seed !== undefined ? seed
    : (label ? `tr-${String(label).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}` : `tr-${tag || 'default'}`);
  const showPhoto = !noPhoto;
  const photoId = showPhoto ? pickImg(String(derivedSeed), tag) : null;
  const src = photoId ? imgUrl(photoId, w) : null;
  return (
    <div className={`ph ${variant}`} style={style}>
      {src && (
        <img className="ph-img" src={src} alt=""
          loading={eager ? 'eager' : 'lazy'}
          fetchpriority={eager ? 'high' : 'auto'}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}
      {showPhoto && <div className="ph-overlay" />}
      {children}
      {label && <span className="ph-label">{label}</span>}
    </div>
  );
}

// ─────────────────────────────── Chip ───────────────────────────────
function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '9px 18px',
        fontSize: 10.5,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        fontWeight: 600,
        border: active ? '1px solid var(--ink)' : '1px solid var(--line-strong)',
        background: active ? 'var(--ink)' : 'transparent',
        color: active ? 'var(--paper)' : 'var(--ink-2)',
        transition: 'all .2s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────── SectionHead ───────────────────────────────
function SectionHead({ eyebrow, title, action, num }) {
  return (
    <div className="section-head">
      <div>
        {num && (
          <div style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            color: 'var(--gold)', fontSize: 14, marginBottom: 18,
          }}>— {num} —</div>
        )}
        {eyebrow && <div className="eyebrow" style={{ marginBottom: 18 }}>{eyebrow}</div>}
        <h2 className="title">{title}</h2>
      </div>
      {action}
    </div>
  );
}

// ─────────────────────────────── Footer ───────────────────────────────
function Footer({ setPage }) {
  const { isMobile } = useViewport();
  return (
    <footer style={{
      background: 'var(--bg-3)', color: '#D6CFC0',
      borderTop: '1px solid rgba(196,168,98,0.18)',
      padding: isMobile ? '64px 0 24px' : '96px 0 32px',
      marginTop: 0,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decoración: marca de agua */}
      <div className="watermark" style={{
        right: -40, bottom: -80, color: 'rgba(196,168,98,0.05)',
      }}>T&amp;R</div>

      <div className="container" style={{ position: 'relative' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr 1fr 1fr 1.2fr',
          gap: isMobile ? 40 : 48,
          marginBottom: isMobile ? 48 : 80,
        }}>
          <div>
            <Logo size={17} />
            <p style={{
              marginTop: 24, fontSize: 14,
              color: 'rgba(245,241,234,0.65)', lineHeight: 1.75, maxWidth: 300,
            }}>
              Casa fundada en Ciudad de Panamá hace 22 años. Curaduría premium de tabaco
              y accesorios. <span style={{ color: 'var(--gold-pure)' }}>Variedad · Honestidad · Garantía.</span>
            </p>
            <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
              {[
                ['IG', 'Instagram'],
                ['FB', 'Facebook'],
                ['YT', 'YouTube'],
                ['WA', 'WhatsApp'],
              ].map(([s, full]) => (
                <button key={s} title={full} style={{
                  width: 36, height: 36, border: '1px solid rgba(196,168,98,0.3)',
                  color: 'var(--gold-pure)', fontSize: 10, letterSpacing: '0.1em',
                  fontWeight: 700, fontFamily: 'var(--sans)',
                  transition: 'all .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-pure)'; e.currentTarget.style.color = 'var(--bg-3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gold-pure)'; }}
                >{s}</button>
              ))}
            </div>
          </div>

          {[
            { title: 'Catálogo',   items: [['Habanos', 'tienda'], ['Por marca', 'tienda'], ['Edición limitada', 'tienda'], ['Reservas privadas', 'nosotros']] },
            { title: 'Accesorios', items: [['Humidores', 'accesorios'], ['Cortadores', 'accesorios'], ['Encendedores', 'accesorios'], ['Estuches', 'accesorios']] },
            { title: 'La Casa',    items: [['Nuestra historia', 'nosotros'], ['Club privado', 'nosotros'], ['Catas y eventos', 'blog'], ['Contacto', 'nosotros']] },
          ].map((col, i) => (
            <div key={i}>
              <div className="eyebrow" style={{
                color: 'var(--gold-pure)', marginBottom: 22,
              }}>{col.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {col.items.map(([it, p]) => (
                  <li key={it}>
                    <button onClick={() => setPage(p)} style={{
                      fontSize: 14, color: 'rgba(245,241,234,0.7)', transition: 'color .2s',
                    }}
                      onMouseEnter={e => e.target.style.color = 'var(--gold-pure)'}
                      onMouseLeave={e => e.target.style.color = 'rgba(245,241,234,0.7)'}
                    >{it}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <div className="eyebrow" style={{ color: 'var(--gold-pure)', marginBottom: 22 }}>El Boletín</div>
            <p style={{
              fontSize: 14, color: 'rgba(245,241,234,0.65)',
              marginBottom: 18, lineHeight: 1.65,
            }}>
              Una carta al mes. Nuevas llegadas, lecturas, catas privadas.
            </p>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', border: '1px solid var(--gold-pure)' }}>
              <input type="email" placeholder="tu@correo.com" style={{
                flex: 1, background: 'transparent', border: 'none', padding: '13px 16px',
                color: '#F5F1EA', fontFamily: 'var(--sans)', fontSize: 13, outline: 'none',
              }} />
              <button type="submit" style={{
                background: 'var(--gold-pure)', color: 'var(--bg-3)',
                padding: '0 22px', fontSize: 10.5, fontWeight: 700,
                letterSpacing: '0.24em', textTransform: 'uppercase',
              }}>Unirme</button>
            </form>
            <div style={{
              marginTop: 24, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(245,241,234,0.45)', lineHeight: 1.9,
            }}>
              Casco Antiguo, Ciudad de Panamá<br/>
              casa@tabacoyronpa.com<br/>
              +507 6000 1234
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(196,168,98,0.18)', paddingTop: 28,
          display: 'flex', flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
          gap: 18, fontSize: 11.5, color: 'rgba(245,241,234,0.55)',
          letterSpacing: '0.08em',
        }}>
          <div>
            © 2026 Tabaco &amp; Ron <span className="diamond"></span> Casa fundada en Ciudad de Panamá, 2003
          </div>
          <div style={{ display: 'flex', gap: isMobile ? 18 : 28, flexWrap: 'wrap' }}>
            <a href="#">Aviso legal</a>
            <a href="#">Privacidad</a>
            <a href="#">Política de mayoría de edad</a>
          </div>
        </div>

        <div style={{
          marginTop: 40, padding: '16px 20px',
          border: '1px solid rgba(245,241,234,0.18)',
          fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase',
          textAlign: 'center', color: 'rgba(245,241,234,0.55)',
          fontWeight: 500,
        }}>
          El tabaco perjudica gravemente la salud <span className="diamond"></span> Venta exclusiva a mayores de 18 años
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  useViewport, Logo, Monogram, TopBar, Footer,
  Placeholder, Chip, SectionHead, NavLink,
});
