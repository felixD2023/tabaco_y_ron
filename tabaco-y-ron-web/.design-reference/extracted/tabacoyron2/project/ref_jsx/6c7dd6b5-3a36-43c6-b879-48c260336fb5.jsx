// Tienda / Shop — Catálogo con filtros por marca, intensidad, vitola, precio
const { useState: useStateShop, useMemo: useMemoShop } = React;

function ProductCard({ product, onClick }) {
  const { BRANDS } = window.TR;
  const brand = BRANDS.find(b => b.id === product.brand);
  const [hover, setHover] = useStateShop(false);

  return (
    <button
      onClick={() => onClick(product)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: 'left',
        display: 'flex', flexDirection: 'column',
        background: 'transparent',
        transition: 'all .3s',
      }}
    >
      <Placeholder
        label=""
        seed={`tr-product-${product.id}`}
        productMode
        style={{ aspectRatio: '4/5', position: 'relative', overflow: 'hidden' }}
      >
        {/* Hover overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 4,
          background: 'rgba(10,10,10,0.5)',
          opacity: hover ? 1 : 0, transition: 'opacity .3s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            border: '1px solid var(--gold)',
            color: 'var(--gold)',
            padding: '12px 22px',
            fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 700,
          }}>
            Ver pieza →
          </div>
        </div>
        {/* Intensity badge */}
        <div style={{
          position: 'absolute', top: 14, left: 14, zIndex: 3,
          padding: '4px 10px',
          background: 'rgba(0,0,0,0.55)', border: '1px solid var(--line)',
          fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cream)',
        }}>
          {product.intensity}
        </div>
      </Placeholder>
      <div style={{ padding: '20px 4px 0' }}>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: 13, marginBottom: 6 }}>
          {brand.name}
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 22, lineHeight: 1.2, color: 'var(--cream)', marginBottom: 8 }}>
          {product.name}
        </div>
        <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          {product.vitola} · {product.length}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--cream)' }}>{product.price} €</span>
          <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: hover ? 'var(--gold)' : 'var(--muted)', fontWeight: 700, transition: 'color .2s' }}>
            por pieza
          </span>
        </div>
      </div>
    </button>
  );
}

function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useStateShop(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--line)', padding: '24px 0' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
        <span className="eyebrow">{title}</span>
        <span style={{ color: 'var(--gold)', fontSize: 16, transition: 'transform .2s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </button>
      {open && <div style={{ marginTop: 18 }}>{children}</div>}
    </div>
  );
}

function CheckRow({ label, count, checked, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 0', textAlign: 'left',
      color: checked ? 'var(--gold)' : 'var(--cream-mute)',
      transition: 'color .2s',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          width: 14, height: 14, border: '1px solid currentColor', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: checked ? 'var(--gold)' : 'transparent',
        }}>
          {checked && <span style={{ color: 'var(--bg)', fontSize: 10, lineHeight: 1 }}>✓</span>}
        </span>
        <span style={{ fontSize: 14 }}>{label}</span>
      </span>
      <span style={{ fontSize: 11, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>({count})</span>
    </button>
  );
}

function PriceSlider({ value, onChange, min, max }) {
  // Two-handle range; simple implementation
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 14, color: 'var(--cream)' }}>{value[0]} €</span>
        <span style={{ fontSize: 14, color: 'var(--cream)' }}>{value[1]} €</span>
      </div>
      <div style={{ position: 'relative', height: 4, background: 'var(--bg-3)' }}>
        <div style={{
          position: 'absolute',
          left: `${((value[0]-min)/(max-min))*100}%`,
          right: `${100 - ((value[1]-min)/(max-min))*100}%`,
          top: 0, bottom: 0, background: 'var(--gold)',
        }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <input type="number" value={value[0]} min={min} max={value[1]} onChange={e => onChange([+e.target.value, value[1]])} style={{
          flex: 1, background: 'transparent', border: '1px solid var(--line)', padding: '8px 10px',
          color: 'var(--cream)', fontSize: 13, fontFamily: 'var(--sans)',
        }} />
        <input type="number" value={value[1]} min={value[0]} max={max} onChange={e => onChange([value[0], +e.target.value])} style={{
          flex: 1, background: 'transparent', border: '1px solid var(--line)', padding: '8px 10px',
          color: 'var(--cream)', fontSize: 13, fontFamily: 'var(--sans)',
        }} />
      </div>
    </div>
  );
}

function ShopPage({ initialBrand, openProduct }) {
  const { PRODUCTS, BRANDS, VITOLAS, INTENSIDADES } = window.TR;
  const { isMobile, isTablet } = useViewport();
  const compact = isMobile || isTablet;

  const [brands, setBrands] = useStateShop(initialBrand ? [initialBrand] : []);
  const [vitolas, setVitolas] = useStateShop([]);
  const [intensities, setIntensities] = useStateShop([]);
  const [price, setPrice] = useStateShop([0, 200]);
  const [sort, setSort] = useStateShop('curated');
  const [view, setView] = useStateShop('grid');
  const [filtersOpen, setFiltersOpen] = useStateShop(false);

  const filtered = useMemoShop(() => {
    let r = PRODUCTS.filter(p => {
      if (brands.length && !brands.includes(p.brand)) return false;
      if (vitolas.length && !vitolas.includes(p.vitola)) return false;
      if (intensities.length && !intensities.includes(p.intensity)) return false;
      if (p.price < price[0] || p.price > price[1]) return false;
      return true;
    });
    if (sort === 'price-asc') r = [...r].sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') r = [...r].sort((a,b) => b.price - a.price);
    if (sort === 'name') r = [...r].sort((a,b) => a.name.localeCompare(b.name));
    return r;
  }, [brands, vitolas, intensities, price, sort]);

  const toggle = (list, setList) => (item) => {
    setList(list.includes(item) ? list.filter(x => x !== item) : [...list, item]);
  };

  const brandCounts = useMemoShop(() => {
    const m = {};
    PRODUCTS.forEach(p => { m[p.brand] = (m[p.brand] || 0) + 1; });
    return m;
  }, []);
  const vitolaCounts = useMemoShop(() => {
    const m = {};
    PRODUCTS.forEach(p => { m[p.vitola] = (m[p.vitola] || 0) + 1; });
    return m;
  }, []);
  const intensityCounts = useMemoShop(() => {
    const m = {};
    PRODUCTS.forEach(p => { m[p.intensity] = (m[p.intensity] || 0) + 1; });
    return m;
  }, []);

  const activeCount = brands.length + vitolas.length + intensities.length + (price[0] > 0 || price[1] < 200 ? 1 : 0);
  const gridCols = isMobile ? 2 : isTablet ? 2 : 3;

  // Reusable filter panel (inline o en bottom-sheet)
  const FilterPanel = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div className="eyebrow" style={{ color: 'var(--cream)' }}>Filtros</div>
        {activeCount > 0 && (
          <button onClick={() => { setBrands([]); setVitolas([]); setIntensities([]); setPrice([0,200]); }} style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'underline', textUnderlineOffset: 4 }}>
            Limpiar ({activeCount})
          </button>
        )}
      </div>

      <FilterGroup title="Marca">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 260, overflowY: 'auto', paddingRight: 8 }}>
          {BRANDS.map(b => (
            <CheckRow key={b.id} label={b.name} count={brandCounts[b.id] || 0}
              checked={brands.includes(b.id)} onClick={() => toggle(brands, setBrands)(b.id)} />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Intensidad">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {INTENSIDADES.map(i => (
            <CheckRow key={i} label={i} count={intensityCounts[i] || 0}
              checked={intensities.includes(i)} onClick={() => toggle(intensities, setIntensities)(i)} />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Vitola">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {VITOLAS.map(v => (
            <CheckRow key={v} label={v} count={vitolaCounts[v] || 0}
              checked={vitolas.includes(v)} onClick={() => toggle(vitolas, setVitolas)(v)} />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Precio (€)">
        <PriceSlider value={price} onChange={setPrice} min={0} max={200} />
      </FilterGroup>
    </>
  );

  return (
    <div className="page">
      {/* Page header */}
      <div style={{ borderBottom: '1px solid var(--line)', background: 'var(--bg-2)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
          <Placeholder label="" seed="tr-shop-header-bg" tag="interior" variant="warm" style={{ position: 'absolute', inset: 0 }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,10,0.3) 0%, var(--bg-2) 100%)' }} />
        <div className="container" style={{ position: 'relative', padding: isMobile ? '80px 20px 56px' : '120px 56px 80px' }}>
          <div className="eyebrow" style={{ marginBottom: 24 }}>— Catálogo —</div>
          <h1 style={{ fontSize: 'clamp(40px, 7vw, 96px)', lineHeight: 0.96, marginBottom: 24 }}>
            La <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>cava</span> entera.
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 18, color: 'var(--cream-mute)', maxWidth: 580, lineHeight: 1.65 }}>
            {PRODUCTS.length} referencias activas, repartidas entre {BRANDS.length} casas. Filtre por marca, intensidad,
            vitola o precio. Las novedades se publican el primer viernes de cada mes.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: isMobile ? '32px 20px 64px' : '60px 56px 120px', display: 'grid', gridTemplateColumns: compact ? '1fr' : '260px 1fr', gap: compact ? 24 : 56 }}>
        {/* Sidebar filters — solo en desktop */}
        {!compact && (
          <aside>
            <div style={{ position: 'sticky', top: 100 }}>
              {FilterPanel}
            </div>
          </aside>
        )}

        {/* Results */}
        <div>
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, marginBottom: 24, borderBottom: '1px solid var(--line)', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 13, color: 'var(--cream-mute)' }}>
              <span style={{ color: 'var(--gold)', fontFamily: 'var(--serif)', fontSize: 18, marginRight: 8 }}>{filtered.length}</span>
              piezas
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 24, flexWrap: 'wrap' }}>
              {compact && (
                <button onClick={() => setFiltersOpen(true)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px', border: '1px solid var(--gold)', color: 'var(--gold)',
                  fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700,
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M6 12h12M10 18h4"/></svg>
                  Filtros {activeCount > 0 && `(${activeCount})`}
                </button>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {!isMobile && <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>Ordenar:</span>}
                <select value={sort} onChange={e => setSort(e.target.value)} style={{
                  background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream)',
                  padding: '6px 12px', fontSize: 12, fontFamily: 'var(--sans)',
                }}>
                  <option value="curated">Curaduría</option>
                  <option value="price-asc">Precio ↑</option>
                  <option value="price-desc">Precio ↓</option>
                  <option value="name">Nombre A–Z</option>
                </select>
              </div>
              {!isMobile && (
                <div style={{ display: 'flex', border: '1px solid var(--line)' }}>
                  {[['grid', '⊞'], ['list', '☰']].map(([v, icon]) => (
                    <button key={v} onClick={() => setView(v)} style={{
                      padding: '6px 12px', fontSize: 14,
                      background: view === v ? 'var(--gold)' : 'transparent',
                      color: view === v ? 'var(--bg)' : 'var(--cream-mute)',
                    }}>{icon}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {brands.map(b => {
                const br = BRANDS.find(x => x.id === b);
                return <Chip key={b} label={`✕ ${br.name}`} active onClick={() => toggle(brands, setBrands)(b)} />;
              })}
              {intensities.map(i => <Chip key={i} label={`✕ ${i}`} active onClick={() => toggle(intensities, setIntensities)(i)} />)}
              {vitolas.map(v => <Chip key={v} label={`✕ ${v}`} active onClick={() => toggle(vitolas, setVitolas)(v)} />)}
            </div>
          )}

          {/* Grid */}
          {(view === 'grid' || isMobile) ? (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: isMobile ? '28px 14px' : '48px 32px' }}>
              {filtered.map(p => <ProductCard key={p.id} product={p} onClick={openProduct} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--line)' }}>
              {filtered.map(p => <ProductRow key={p.id} product={p} onClick={openProduct} />)}
            </div>
          )}

          {filtered.length === 0 && (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--cream-mute)' }}>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 26, color: 'var(--gold)', marginBottom: 12 }}>Ninguna pieza coincide.</div>
              <div>Pruebe relajar los filtros, o escríbanos: encontramos lo que falta.</div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom sheet de filtros (mobile/tablet) */}
      {compact && filtersOpen && (
        <div onClick={() => setFiltersOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 80,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'flex-end',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', maxHeight: '88vh',
            background: 'var(--bg)', borderTop: '1px solid var(--gold)',
            overflowY: 'auto', padding: '20px 24px 32px',
            animation: 'slideUp 0.3s cubic-bezier(.2,.7,.2,1)',
          }}>
            <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <div style={{ width: 48, height: 4, background: 'var(--line-strong)', borderRadius: 2 }} />
            </div>
            {FilterPanel}
            <button onClick={() => setFiltersOpen(false)} className="btn solid" style={{ width: '100%', justifyContent: 'center', marginTop: 28 }}>
              Ver {filtered.length} piezas →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductRow({ product, onClick }) {
  const { BRANDS } = window.TR;
  const brand = BRANDS.find(b => b.id === product.brand);
  return (
    <button onClick={() => onClick(product)} style={{
      background: 'var(--bg)', display: 'grid',
      gridTemplateColumns: '120px 1fr 1fr 1fr 120px 100px',
      gap: 24, alignItems: 'center', padding: '20px 24px', textAlign: 'left',
      transition: 'background .2s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
    >
      <Placeholder label="" seed={`tr-product-${product.id}`} productMode style={{ width: 100, height: 80 }} />
      <div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: 12 }}>{brand.name}</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 20, marginTop: 4 }}>{product.name}</div>
      </div>
      <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-mute)' }}>{product.vitola}</div>
      <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-mute)' }}>{product.intensity}</div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--cream)' }}>{product.price} €</div>
      <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>Ver →</span>
    </button>
  );
}

window.ShopPage = ShopPage;
window.ProductCard = ProductCard;
