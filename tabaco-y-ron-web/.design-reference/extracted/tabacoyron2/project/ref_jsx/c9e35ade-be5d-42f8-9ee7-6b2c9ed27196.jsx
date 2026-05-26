// Producto Modal — drawer detallado al hacer clic en una pieza
const { useState: useStatePM, useEffect: useEffectPM } = React;

function ProductModal({ product, onClose, addToCart }) {
  const { BRANDS, PRODUCTS } = window.TR;
  const [qty, setQty] = useStatePM(1);
  const [tab, setTab] = useStatePM('desc');
  const { isMobile } = useViewport();

  useEffectPM(() => {
    if (!product) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [product]);

  if (!product) return null;
  const brand = BRANDS.find(b => b.id === product.brand);
  const related = PRODUCTS.filter(p => p.brand === product.brand && p.id !== product.id).slice(0, 3);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', justifyContent: 'flex-end',
      animation: 'fadeIn 0.25s ease',
    }}>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      <div onClick={e => e.stopPropagation()} style={{
        width: isMobile ? '100vw' : '720px',
        maxWidth: '100vw',
        height: '100vh',
        background: 'var(--bg)',
        borderLeft: '1px solid var(--line)',
        overflowY: 'auto',
        animation: 'slideIn 0.35s cubic-bezier(.2,.7,.2,1)',
      }}>
        {/* Close bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '16px 20px' : '20px 40px', borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 5 }}>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: isMobile ? 13 : 14 }}>
            {brand.name} <span style={{ color: 'var(--muted)' }}>— {brand.origin}</span>
          </div>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--cream-mute)', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            {!isMobile && 'Cerrar'}
            <span style={{ fontSize: 22, lineHeight: 1 }}>✕</span>
          </button>
        </div>

        <div style={{ padding: isMobile ? '24px 20px' : '40px' }}>
          {/* Image */}
          <Placeholder label="" seed={`tr-product-${product.id}-main`} productMode
            style={{ aspectRatio: '5/4', marginBottom: 24 }}>
            <div style={{ position: 'absolute', top: 18, left: 18, padding: '6px 12px', background: 'rgba(255,255,255,0.85)', border: '1px solid var(--gold)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--bg)', fontWeight: 700, zIndex: 3 }}>
              {product.intensity}
            </div>
          </Placeholder>

          {/* Thumbnails */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 32 }}>
            {['frontal', 'anilla', 'corte', 'caja'].map((l, i) => {
              // distintos shots: caja = caja real, los demás ciclo por slot
              const img = l === 'caja'
                ? (product.price > 60 ? 'arturo-fuente-chateau' : 'arturo-fuente-flor-fina')
                : 'arturo-fuente-cuban-corona';
              return (
                <Placeholder key={l} label="" productImage={img} style={{ aspectRatio: '1/1', cursor: 'pointer', border: i === 0 ? '1px solid var(--gold)' : '1px solid transparent' }} />
              );
            })}
          </div>

          {/* Title & price */}
          <div className="eyebrow" style={{ marginBottom: 14 }}>— Pieza —</div>
          <h2 style={{ fontSize: isMobile ? 36 : 48, lineHeight: 1, marginBottom: 14 }}>{product.name}</h2>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 34 : 40, color: 'var(--gold)' }}>{product.price} €</span>
            <span style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cream-mute)' }}>por pieza · IVA incl.</span>
          </div>

          <p style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 18 : 22, fontStyle: 'italic', color: 'var(--cream)', lineHeight: 1.5, marginBottom: 28 }}>
            "{product.note}"
          </p>

          {/* Spec grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '14px 0' : '20px 32px', marginBottom: 32 }}>
            {[
              ['Vitola', product.vitola],
              ['Largo', product.length],
              ['Cepo', product.ring],
              ['Capa', product.wrapper],
              ['Intensidad', product.intensity],
              ['Cosecha', product.vintage || 'En curso'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
                <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)' }}>{k}</span>
                <span style={{ fontFamily: 'var(--serif)', fontSize: 15, color: 'var(--cream)' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Qty + add */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12, marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--gold)', justifyContent: isMobile ? 'space-between' : 'flex-start' }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '14px 20px', color: 'var(--gold)', fontSize: 18 }}>−</button>
              <span style={{ padding: '0 18px', fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--cream)', minWidth: 32, textAlign: 'center' }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ padding: '14px 20px', color: 'var(--gold)', fontSize: 18 }}>+</button>
            </div>
            <button className="btn solid" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { addToCart(product, qty); onClose(); }}>
              Añadir · {(product.price * qty).toFixed(0)} €
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: isMobile ? 18 : 28, borderBottom: '1px solid var(--line)', marginBottom: 20, overflowX: 'auto' }}>
            {[
              ['desc', 'Descripción'],
              ['origin', 'Origen'],
              ['paired', 'Maridajes'],
            ].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                padding: '12px 0', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
                color: tab === k ? 'var(--gold)' : 'var(--cream-mute)',
                borderBottom: tab === k ? '1px solid var(--gold)' : '1px solid transparent',
                marginBottom: -1, whiteSpace: 'nowrap',
              }}>{l}</button>
            ))}
          </div>
          <div style={{ fontSize: 15, color: 'var(--cream-mute)', lineHeight: 1.75, marginBottom: 40 }}>
            {tab === 'desc' && (
              <p>{product.name} es una pieza de la casa {brand.name}. {brand.blurb} Liada con capa {product.wrapper} y construcción {product.vitola.toLowerCase()}, ofrece una experiencia de intensidad {product.intensity.toLowerCase()} con un perfil aromático que invita a una sesión sin interrupciones.</p>
            )}
            {tab === 'origin' && (
              <p>Procedencia: {brand.origin}. Casa fundada en {brand.founded}. {brand.blurb} Trabajamos directamente con la fábrica desde hace años; cada lote que recibimos viaja en bodega humidificada y se reposa en cava al menos quince días antes de salir a venta.</p>
            )}
            {tab === 'paired' && (
              <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li>Ron añejo cubano, mínimo 12 años — perfil cremoso y caramelizado.</li>
                <li>Café espresso ligero, con un punto cítrico — limpia el paladar entre tercios.</li>
                <li>Agua sin gas, a temperatura ambiente — durante toda la sesión.</li>
                <li>Si lleva, un cuadrado de chocolate negro 85% al final del segundo tercio.</li>
              </ul>
            )}
          </div>

          {/* Related */}
          <div className="eyebrow" style={{ marginBottom: 18 }}>— De la misma casa —</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {related.map(r => (
              <div key={r.id} style={{ cursor: 'pointer' }}>
                <Placeholder label="" seed={`tr-product-${r.id}`} productMode style={{ aspectRatio: '4/5', marginBottom: 10 }} />
                <div style={{ fontFamily: 'var(--serif)', fontSize: 14, lineHeight: 1.25, color: 'var(--cream)' }}>{r.name}</div>
                <div style={{ fontSize: 11, color: 'var(--gold)', marginTop: 4 }}>{r.price} €</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.ProductModal = ProductModal;
