// Producto Modal — drawer detallado al hacer clic en una pieza (tema claro)
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
      background: 'rgba(31,29,27,0.55)', backdropFilter: 'blur(6px)',
      display: 'flex', justifyContent: 'flex-end',
      animation: 'fadeIn 0.25s ease',
    }}>
      <style>{`
        @keyframes slideInR { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      <div onClick={e => e.stopPropagation()} style={{
        width: isMobile ? '100vw' : '720px',
        maxWidth: '100vw', height: '100vh',
        background: 'var(--bg)',
        borderLeft: '1px solid var(--line-strong)',
        overflowY: 'auto',
        animation: 'slideInR 0.35s cubic-bezier(.2,.7,.2,1)',
      }}>
        {/* Close bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: isMobile ? '16px 20px' : '20px 40px',
          borderBottom: '1px solid var(--line)',
          position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 5,
        }}>
          <div style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            color: 'var(--gold)', fontSize: isMobile ? 13 : 15,
          }}>
            {brand.name} <span style={{ color: 'var(--ink-mute)' }}>— {brand.origin}</span>
          </div>
          <button onClick={onClose} style={{
            display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-2)',
            fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 600,
          }}>
            {!isMobile && 'Cerrar'}
            <span style={{ fontSize: 22, lineHeight: 1 }}>✕</span>
          </button>
        </div>

        <div style={{ padding: isMobile ? '24px 20px' : '40px' }}>
          {/* Image */}
          <Placeholder productMode glyph="❦"
            seed={`tr-product-${product.id}-main`}
            style={{ aspectRatio: '5/4', marginBottom: 24 }}>
            <div style={{
              position: 'absolute', top: 18, left: 18, padding: '6px 14px',
              background: 'var(--ink)', color: 'var(--paper)',
              fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
              fontWeight: 700, zIndex: 3,
            }}>
              {product.intensity}
            </div>
          </Placeholder>

          {/* Thumbnails */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 32 }}>
            {['frontal', 'anilla', 'corte', 'caja'].map((l, i) => (
              <Placeholder key={l} productMode glyph={['⁘','◇','◈','▣'][i]}
                style={{
                  aspectRatio: '1/1', cursor: 'pointer',
                  border: i === 0 ? '1px solid var(--gold)' : '1px solid var(--line)',
                }} />
            ))}
          </div>

          {/* Title & price */}
          <div className="eyebrow" style={{ marginBottom: 14 }}>— Pieza —</div>
          <h2 style={{
            fontSize: isMobile ? 36 : 52, lineHeight: 1, marginBottom: 14,
            color: 'var(--ink)', letterSpacing: '-0.025em', fontWeight: 500,
          }}>{product.name}</h2>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 18,
            marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid var(--line)',
            flexWrap: 'wrap',
          }}>
            <span style={{
              fontFamily: 'var(--serif)', fontSize: isMobile ? 34 : 44,
              color: 'var(--gold)', fontWeight: 500,
            }}>USD {product.price}</span>
            <span style={{
              fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--ink-mute)',
            }}>por pieza <span className="diamond"></span> ITBMS incl.</span>
          </div>

          <p style={{
            fontFamily: 'var(--serif)', fontSize: isMobile ? 18 : 22,
            fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.5,
            marginBottom: 28,
          }}>
            "{product.note}"
          </p>

          {/* Spec grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: isMobile ? '14px 0' : '20px 32px', marginBottom: 32,
          }}>
            {[
              ['Vitola',     product.vitola],
              ['Largo',      product.length],
              ['Cepo',       product.ring],
              ['Capa',       product.wrapper],
              ['Intensidad', product.intensity],
              ['Cosecha',    product.vintage || 'En curso'],
            ].map(([k, v]) => (
              <div key={k} style={{
                display: 'flex', justifyContent: 'space-between',
                paddingBottom: 12, borderBottom: '1px solid var(--line)',
              }}>
                <span style={{
                  fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: 'var(--ink-mute)',
                }}>{k}</span>
                <span style={{ fontFamily: 'var(--serif)', fontSize: 15, color: 'var(--ink)' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Qty + add */}
          <div style={{
            display: 'flex', flexDirection: isMobile ? 'column' : 'row',
            gap: 12, marginBottom: 40,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', border: '1px solid var(--ink)',
              justifyContent: isMobile ? 'space-between' : 'flex-start',
            }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{
                padding: '14px 22px', color: 'var(--ink)', fontSize: 18,
              }}>−</button>
              <span style={{
                padding: '0 18px', fontFamily: 'var(--serif)', fontSize: 18,
                color: 'var(--ink)', minWidth: 32, textAlign: 'center',
              }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{
                padding: '14px 22px', color: 'var(--ink)', fontSize: 18,
              }}>+</button>
            </div>
            <button className="btn solid"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => { addToCart(product, qty); onClose(); }}>
              Añadir <span className="diamond"></span> USD {(product.price * qty).toFixed(0)}
            </button>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: isMobile ? 20 : 32,
            borderBottom: '1px solid var(--line)', marginBottom: 20, overflowX: 'auto',
          }}>
            {[
              ['desc',   'Descripción'],
              ['origin', 'Origen'],
              ['paired', 'Maridajes'],
            ].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                padding: '12px 0', fontSize: 11, letterSpacing: '0.22em',
                textTransform: 'uppercase', fontWeight: 700,
                color: tab === k ? 'var(--ink)' : 'var(--ink-mute)',
                borderBottom: tab === k ? '1px solid var(--gold)' : '1px solid transparent',
                marginBottom: -1, whiteSpace: 'nowrap',
              }}>{l}</button>
            ))}
          </div>
          <div style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.8, marginBottom: 40 }}>
            {tab === 'desc' && (
              <p>{product.name} es una pieza de la casa {brand.name}. {brand.blurb} Liada
              con capa {product.wrapper} y construcción {product.vitola.toLowerCase()},
              ofrece una experiencia de intensidad {product.intensity.toLowerCase()} con
              un perfil aromático que invita a una sesión sin interrupciones.</p>
            )}
            {tab === 'origin' && (
              <p>Procedencia: {brand.origin}. Casa fundada en {brand.founded}.
              {' '}{brand.blurb} Trabajamos directamente con la fábrica; cada lote viaja
              en bodega humidificada y se reposa en cava al menos quince días antes de
              salir a la sala de Casco Antiguo.</p>
            )}
            {tab === 'paired' && (
              <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li>Ron añejo del istmo, mínimo 12 años — perfil cremoso y caramelizado.</li>
                <li>Café panameño de Boquete, con un punto cítrico — limpia el paladar entre tercios.</li>
                <li>Agua sin gas, a temperatura ambiente — durante toda la sesión.</li>
                <li>Si lleva, un cuadrado de chocolate negro 85% al final del segundo tercio.</li>
              </ul>
            )}
          </div>

          {/* Related */}
          {related.length > 0 && (
            <>
              <div className="eyebrow" style={{ marginBottom: 18 }}>— De la misma casa —</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {related.map(r => (
                  <div key={r.id} style={{ cursor: 'pointer' }}>
                    <Placeholder productMode glyph="❦"
                      seed={`tr-product-${r.id}`}
                      style={{ aspectRatio: '4/5', marginBottom: 10 }} />
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 14, lineHeight: 1.25, color: 'var(--ink)' }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--gold)', marginTop: 4 }}>USD {r.price}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

window.ProductModal = ProductModal;
