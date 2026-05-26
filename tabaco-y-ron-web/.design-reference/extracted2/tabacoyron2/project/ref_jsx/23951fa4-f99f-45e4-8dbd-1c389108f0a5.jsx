// Componentes compartidos: Logo, Nav, Footer, Placeholders, etc.
const { useState, useEffect, useMemo, useRef } = React;

// Hook responsivo — devuelve el ancho actual y banderas isMobile/isTablet
function useViewport() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return { width: w, isMobile: w < 720, isTablet: w >= 720 && w < 1024, isDesktop: w >= 1024 };
}

function Logo({ size = 18 }) {
  return (
    <span className="logo-pill" style={{ fontSize: `${size}px`, padding: `${size*0.45}px ${size*1.05}px ${size*0.55}px` }}>
      Tabaco &amp; Ron
    </span>
  );
}

function Monogram({ size = 28 }) {
  // Compact monogram for tight contexts: red pill with "T&R"
  return (
    <span className="logo-pill" style={{ fontSize: `${size}px`, padding: `${size*0.25}px ${size*0.7}px ${size*0.35}px`, letterSpacing: 0 }}>
      T&amp;R
    </span>
  );
}

function NavLink({ label, page, num, active, onClick }) {
  return (
    <button
      onClick={() => onClick(page)}
      style={{
        fontFamily: 'var(--sans)',
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        color: active ? 'var(--gold)' : 'var(--cream)',
        padding: '8px 0',
        position: 'relative',
        transition: 'color .2s',
      }}
    >
      <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', marginRight: 8, fontSize: 11, opacity: active ? 1 : 0.6 }}>
        {num}
      </span>
      {label}
      {active && (
        <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'var(--gold)' }} />
      )}
    </button>
  );
}

function TopBar({ page, setPage, cartCount }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile, isTablet } = useViewport();
  const compact = isMobile || isTablet;

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
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled || menuOpen ? 'rgba(10,10,10,0.92)' : 'transparent',
      backdropFilter: scrolled || menuOpen ? 'blur(14px) saturate(120%)' : 'none',
      borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
      transition: 'all .3s ease',
    }}>
      {/* Announcement bar */}
      <div style={{
        background: '#070707',
        borderBottom: '1px solid rgba(200,169,106,0.08)',
        textAlign: 'center',
        padding: isMobile ? '8px 16px' : '10px 24px',
        fontSize: isMobile ? 9 : 11,
        letterSpacing: isMobile ? '0.14em' : '0.2em',
        textTransform: 'uppercase',
        color: 'var(--cream-mute)',
      }}>
        <span style={{ color: 'var(--gold)' }}>◆</span>
        <span style={{ margin: '0 14px' }}>
          {isMobile ? 'Envío discreto · 48h en pedidos +200 €' : 'Envío discreto a toda Europa — entrega en 48h en pedidos sobre 200 €'}
        </span>
        <span style={{ color: 'var(--gold)' }}>◆</span>
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '16px 20px' : '22px 56px' }}>
        <button onClick={() => go('home')} style={{ display: 'flex', alignItems: 'center' }}>
          <Logo size={isMobile ? 15 : 17} />
        </button>

        {!compact && (
          <nav style={{ display: 'flex', gap: 38 }}>
            <NavLink label="Tienda"     page="tienda"     num="01" active={page === 'tienda'}     onClick={setPage} />
            <NavLink label="Accesorios" page="accesorios" num="02" active={page === 'accesorios'} onClick={setPage} />
            <NavLink label="Blog"       page="blog"       num="03" active={page === 'blog'}       onClick={setPage} />
            <NavLink label="Nosotros"   page="nosotros"   num="04" active={page === 'nosotros'}   onClick={setPage} />
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 14 : 24 }}>
          {!isMobile && (
            <>
              <button style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--cream-mute)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }} title="Buscar">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--cream-mute)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }} title="Cuenta">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </button>
            </>
          )}
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gold)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 2-1.6L23 6H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>
            {!isMobile && <span>Bolsa · {cartCount}</span>}
            {isMobile && <span style={{ fontFamily: 'var(--serif)', fontSize: 13 }}>{cartCount}</span>}
          </button>
          {compact && (
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú" style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5,
              width: 32, height: 32, color: 'var(--cream)',
            }}>
              <span style={{ width: 22, height: 1, background: 'currentColor', transform: menuOpen ? 'translateY(3px) rotate(45deg)' : 'none', transition: 'transform .2s' }} />
              <span style={{ width: 22, height: 1, background: 'currentColor', transform: menuOpen ? 'translateY(-3px) rotate(-45deg)' : 'none', transition: 'transform .2s' }} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile / tablet menu drawer */}
      {compact && menuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 49,
          background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(20px)',
          paddingTop: 92, // espacio para el header
          animation: 'fadeIn 0.25s ease',
        }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
          <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['tienda', 'Tienda', '01'],
              ['accesorios', 'Accesorios', '02'],
              ['blog', 'Blog', '03'],
              ['nosotros', 'Nosotros', '04'],
            ].map(([p, l, n]) => (
              <button key={p} onClick={() => go(p)} style={{
                display: 'flex', alignItems: 'baseline', gap: 16,
                padding: '22px 8px', textAlign: 'left',
                borderBottom: '1px solid var(--line)',
                color: page === p ? 'var(--gold)' : 'var(--cream)',
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
            <div style={{ marginTop: 40, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', lineHeight: 1.8 }}>
              Almirante 14 · Madrid<br/>
              Mar–Sáb · 11–21h<br/>
              +34 91 308 12 09
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer({ setPage }) {
  const { isMobile } = useViewport();
  return (
    <footer style={{ background: '#060606', borderTop: '1px solid var(--line)', padding: isMobile ? '64px 0 24px' : '96px 0 32px', marginTop: 80 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr 1fr 1fr 1.2fr', gap: isMobile ? 40 : 48, marginBottom: isMobile ? 48 : 80 }}>
          <div>
            <Logo size={17} />
            <p style={{ marginTop: 24, fontSize: 14, color: 'var(--cream-mute)', lineHeight: 1.7, maxWidth: 280 }}>
              Curaduría de habanos y accesorios desde 2009. Una pequeña casa especializada en lo serio.
            </p>
            <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
              {['IG', 'FB', 'YT'].map(s => (
                <button key={s} style={{ width: 36, height: 36, border: '1px solid var(--line)', color: 'var(--gold)', fontSize: 10, letterSpacing: '0.1em' }}>{s}</button>
              ))}
            </div>
          </div>

          {[
            { title: 'Catálogo', items: ['Habanos', 'Por marca', 'Edición limitada', 'Reservas privadas'], page: 'tienda' },
            { title: 'Accesorios', items: ['Humidores', 'Cortadores', 'Encendedores', 'Estuches'], page: 'accesorios' },
            { title: 'Casa', items: ['Nuestra historia', 'Club privado', 'Catas', 'Contacto'], page: 'nosotros' },
          ].map((col, i) => (
            <div key={i}>
              <div className="eyebrow" style={{ marginBottom: 22 }}>{col.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {col.items.map(it => (
                  <li key={it}>
                    <button onClick={() => setPage(col.page)} style={{ fontSize: 14, color: 'var(--cream-mute)', transition: 'color .2s' }}
                      onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                      onMouseLeave={e => e.target.style.color = 'var(--cream-mute)'}>
                      {it}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <div className="eyebrow" style={{ marginBottom: 22 }}>El Boletín</div>
            <p style={{ fontSize: 14, color: 'var(--cream-mute)', marginBottom: 18, lineHeight: 1.6 }}>
              Una carta al mes. Nuevas llegadas, lecturas, catas privadas.
            </p>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', border: '1px solid var(--line-strong)' }}>
              <input type="email" placeholder="tu@correo.com" style={{
                flex: 1, background: 'transparent', border: 'none', padding: '14px 16px',
                color: 'var(--cream)', fontFamily: 'var(--sans)', fontSize: 13, outline: 'none'
              }} />
              <button type="submit" style={{ background: 'var(--gold)', color: 'var(--bg)', padding: '0 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Unirme
              </button>
            </form>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 28, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 18, fontSize: 12, color: 'var(--muted)' }}>
          <div>© 2026 Tabaco &amp; Ron · Casa fundada en 2009</div>
          <div style={{ display: 'flex', gap: isMobile ? 18 : 28, flexWrap: 'wrap' }}>
            <a href="#">Aviso legal</a>
            <a href="#">Privacidad</a>
            <a href="#">Política de mayoría de edad</a>
          </div>
        </div>

        <div style={{ marginTop: 48, padding: '20px', border: '1px solid rgba(185,28,28,0.4)', background: 'rgba(185,28,28,0.06)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', textAlign: 'center', color: 'var(--cream-mute)' }}>
          ⚠ &nbsp; El tabaco perjudica gravemente la salud — Venta exclusiva a mayores de 18 años
        </div>
      </div>
    </footer>
  );
}

// Librería de imágenes temáticas (Unsplash) — fotografías de tabaquería,
// encendedores, lounge de alta sociedad, cigarros, maderas y cuero.
// Cada slot recibe una imagen distinta y deterministica según su seed.
const IMG_BASE = 'https://images.unsplash.com';

// Imágenes reales de productos (catálogo) — vendrán inlinadas en standalone
const PRODUCT_IMG_NAMES = [
  'arturo-fuente-cuban-corona',
  'arturo-fuente-flor-fina',
  'arturo-fuente-chateau',
];
function productImg(seed) {
  const s = String(seed || 'default');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return PRODUCT_IMG_NAMES[Math.abs(h) % PRODUCT_IMG_NAMES.length];
}
function productImgUrl(name) {
  const key = 'prod-' + name;
  if (typeof window !== 'undefined' && window.__resources && window.__resources[key]) {
    return window.__resources[key];
  }
  return `assets/products/${name}.png`;
}
const IMG_LIB = {
  // tag → [array de photo IDs]
  hero:     ['photo-1577931170527-cb5c8f39020c', 'photo-1637248990333-e66e027538f4', 'photo-1547652577-b4fe2f34d7ee'],
  cigar:    ['photo-1547652577-b4fe2f34d7ee', 'photo-1612659429508-b429d6b07ac1', 'photo-1612659429327-8f59b894959b'],
  smoke:    ['photo-1577931170527-cb5c8f39020c', 'photo-1577931061564-e746adda00ec'],
  lighter:  ['photo-1592505690387-24e71ca99897', 'photo-1577931170527-cb5c8f39020c'],
  whiskey:  ['photo-1637248990333-e66e027538f4', 'photo-1612659429327-8f59b894959b', 'photo-1614846147847-7d12ca7866ed', 'photo-1613140506142-277c6241b858'],
  hands:    ['photo-1577931061564-e746adda00ec', 'photo-1592505690387-24e71ca99897'],
  box:      ['photo-1612659429508-b429d6b07ac1', 'photo-1610476362995-dff7b9a4e4c1'],
  ring:     ['photo-1603292503723-bb45c35b1903', 'photo-1520644204196-4a478546826f'],
  door:     ['photo-1610476362995-dff7b9a4e4c1'],
  bottle:   ['photo-1614846147847-7d12ca7866ed', 'photo-1616189221504-67b2a569922a', 'photo-1613140506142-277c6241b858'],
  interior: ['photo-1610476362995-dff7b9a4e4c1', 'photo-1637248990333-e66e027538f4'],
  portrait: ['photo-1610561164062-fe4b65086c66', 'photo-1603292503723-bb45c35b1903'],
};
const IMG_POOL = [
  ...IMG_LIB.cigar, ...IMG_LIB.lighter, ...IMG_LIB.whiskey, ...IMG_LIB.hands,
  ...IMG_LIB.box, ...IMG_LIB.bottle, ...IMG_LIB.interior, ...IMG_LIB.door,
  ...IMG_LIB.ring,
];
function pickImg(seed, tag) {
  const pool = (tag && IMG_LIB[tag]) ? IMG_LIB[tag] : IMG_POOL;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return pool[Math.abs(h) % pool.length];
}
// Devuelve la URL de una foto. Si el documento está empaquetado (standalone),
// window.__resources contiene un blob URL ya inlineado para cada photoId.
function imgUrl(photoId, w = 1200) {
  const key = 'img-' + photoId;
  if (typeof window !== 'undefined' && window.__resources && window.__resources[key]) {
    return window.__resources[key];
  }
  return `${IMG_BASE}/${photoId}?fm=jpg&q=70&w=${w}&auto=format&fit=crop`;
}

// Placeholder con fotografía temática (Unsplash) + tratamiento noir.
// Pasar `noPhoto` para mantener solo el gradiente. `tag` orienta a un sub-pool.
// `productImg`/`productMode` cambia a galería con imagen real de catálogo.
function Placeholder({ label, variant = '', style = {}, children, seed, tag, noPhoto = false, eager = false, w = 1200, h = 1500, productMode = false, productImage }) {
  // Modo producto: imagen real, fondo cream, sin filtro noir
  if (productMode || productImage) {
    const imgName = productImage || productImg(seed || label || 'default');
    const src = productImgUrl(imgName);
    return (
      <div className={`ph ph-product`} style={style}>
        <img
          className="ph-img-product"
          src={src}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
        />
        {children}
      </div>
    );
  }

  const derivedSeed = seed !== undefined ? seed : (label ? `tr-${String(label).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}` : `tr-${tag || 'default'}`);
  const showPhoto = !noPhoto;
  const photoId = showPhoto ? pickImg(String(derivedSeed), tag) : null;
  const src = photoId ? imgUrl(photoId, w) : null;
  return (
    <div className={`ph ${variant}`} style={style}>
      {src && (
        <img
          className="ph-img"
          src={src}
          alt=""
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

// Filter chip
function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        fontSize: 11,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        fontWeight: 700,
        border: active ? '1px solid var(--gold)' : '1px solid var(--line)',
        background: active ? 'var(--gold)' : 'transparent',
        color: active ? 'var(--bg)' : 'var(--cream-mute)',
        transition: 'all .2s',
      }}
    >
      {label}
    </button>
  );
}

// Section heading
function SectionHead({ eyebrow, title, action, num }) {
  return (
    <div className="section-head">
      <div>
        {num && <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: 14, marginBottom: 18 }}>— {num} —</div>}
        {eyebrow && <div className="eyebrow" style={{ marginBottom: 18 }}>{eyebrow}</div>}
        <h2 className="title">{title}</h2>
      </div>
      {action}
    </div>
  );
}

Object.assign(window, { Logo, Monogram, TopBar, Footer, Placeholder, Chip, SectionHead, NavLink });
