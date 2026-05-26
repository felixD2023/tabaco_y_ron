// Accesorios — humidores, cortadores, encendedores, ceniceros, estuches
const { useState: useStateAcc, useMemo: useMemoAcc } = React;

function AccessoryCard({ item }) {
  const [hover, setHover] = useStateAcc(false);
  const catTag = {
    'Humidores': 'box',
    'Cortadores': 'cigar',
    'Encendedores': 'lighter',
    'Ceniceros': 'cigar',
    'Estuches': 'box',
  }[item.category] || 'cigar';
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
      <Placeholder label={item.name.toLowerCase()} seed={`tr-acc-${item.id}`} tag={catTag} variant={hover ? 'warm' : ''}
        style={{ aspectRatio: '1/1', position: 'relative', transition: 'all .3s' }}>
        <div style={{
          position: 'absolute', top: 14, right: 14, zIndex: 3,
          padding: '4px 10px',
          background: 'rgba(0,0,0,0.55)', border: '1px solid var(--line)',
          fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cream)',
        }}>
          {item.category}
        </div>
      </Placeholder>
      <div style={{ padding: '20px 4px 0' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 22, lineHeight: 1.25, color: 'var(--cream)', marginBottom: 10 }}>
          {item.name}
        </div>
        <p style={{ fontSize: 13, color: 'var(--cream-mute)', lineHeight: 1.55, marginBottom: 16 }}>
          {item.blurb}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--line)' }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--cream)' }}>{item.price} €</span>
          <button className="btn" style={{ padding: '10px 18px', fontSize: 10 }}>Añadir →</button>
        </div>
      </div>
    </div>
  );
}

function AccessoriesPage() {
  const { ACCESSORIES, ACCESSORY_CATEGORIES } = window.TR;
  const [cat, setCat] = useStateAcc('Todos');
  const { isMobile, isTablet } = useViewport();
  const cols = isMobile ? 2 : isTablet ? 3 : 4;

  const filtered = useMemoAcc(() => {
    if (cat === 'Todos') return ACCESSORIES;
    return ACCESSORIES.filter(a => a.category === cat);
  }, [cat]);

  return (
    <div className="page">
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--line)', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
          <Placeholder label="" seed="tr-accesorios-header-bg" tag="interior" variant="" style={{ position: 'absolute', inset: 0 }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,10,0.5) 0%, var(--bg) 100%)' }} />

        <div className="container" style={{ position: 'relative', padding: isMobile ? '80px 20px 56px' : '120px 56px 80px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: isMobile ? 32 : 64, alignItems: 'flex-end' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>— Accesorios —</div>
            <h1 style={{ fontSize: 'clamp(40px, 7vw, 96px)', lineHeight: 0.96, marginBottom: 24 }}>
              Los <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>objetos</span><br/>
              del ritual.
            </h1>
            <p style={{ fontSize: isMobile ? 15 : 18, color: 'var(--cream-mute)', maxWidth: 540, lineHeight: 1.65 }}>
              Un buen puro merece un buen instrumento. Trabajamos con artesanos en España, Italia y
              Cuba para tener piezas que envejezcan bien, no objetos para presumir.
            </p>
          </div>
          <div style={{ paddingBottom: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--line)', border: '1px solid var(--line)' }}>
              {[
                ['Cedro', 'humidores'],
                ['Acero', 'cortadores'],
                ['Latón', 'encendedores'],
                ['Mármol', 'ceniceros'],
              ].map(([m, t]) => (
                <div key={m} style={{ background: 'var(--bg-2)', padding: isMobile ? '18px 16px' : '24px 20px' }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 20 : 24, color: 'var(--gold)' }}>{m}</div>
                  <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cream-mute)', marginTop: 6 }}>{t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ borderBottom: '1px solid var(--line)', position: 'sticky', top: isMobile ? 80 : 96, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)', zIndex: 30 }}>
        <div className="container" style={{ padding: isMobile ? '16px 20px' : '24px 56px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {ACCESSORY_CATEGORIES.map(c => (
            <Chip key={c} label={c} active={cat === c} onClick={() => setCat(c)} />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="container" style={{ padding: isMobile ? '48px 20px 64px' : '80px 56px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: isMobile ? '32px 14px' : '48px 28px' }}>
          {filtered.map(a => <AccessoryCard key={a.id} item={a} />)}
        </div>

        {/* Featured / editorial */}
        <div style={{ marginTop: isMobile ? 72 : 120, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 0, border: '1px solid var(--line)' }}>
          <Placeholder label="humidor toscana · detalle de cedro" tag="box" seed="tr-feat-humidor-toscana" variant="warm" style={{ aspectRatio: '1/1' }} />
          <div style={{ padding: isMobile ? '40px 24px' : '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="eyebrow" style={{ marginBottom: 22 }}>— Pieza destacada —</div>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: 16, marginBottom: 10 }}>Humidor</div>
            <h3 style={{ fontSize: isMobile ? 40 : 56, lineHeight: 1, marginBottom: 24 }}>Toscana</h3>
            <p style={{ fontSize: isMobile ? 14 : 16, color: 'var(--cream-mute)', lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
              Cedro español envejecido seis meses al aire. Cierre alemán hermético. Capacidad para 50
              piezas y un higrómetro analógico calibrado pieza por pieza. Hecho a mano en Florencia.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: isMobile ? 14 : 24, marginBottom: 32 }}>
              {[
                ['Material', 'Cedro español'],
                ['Capacidad', '50 piezas'],
                ['Garantía', '5 años'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>{k}</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 14 : 16, color: 'var(--cream)' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'baseline', gap: isMobile ? 16 : 32 }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 32 : 40, color: 'var(--gold)' }}>480 €</span>
              <button className="btn solid">Añadir a la bolsa →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.AccessoriesPage = AccessoriesPage;
