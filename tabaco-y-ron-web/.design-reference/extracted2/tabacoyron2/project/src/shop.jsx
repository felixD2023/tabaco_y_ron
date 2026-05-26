// Tienda / Shop — Catálogo con filtros (tema claro)
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
        textAlign: 'left', display: 'flex', flexDirection: 'column',
        background: 'transparent', transition: 'all .3s', cursor: 'pointer',
      }}
    >
      <Placeholder
        productMode glyph={['❦','✦','✶','◆','♣'][product.id.charCodeAt(product.id.length-1) % 5]}
        seed={`tr-product-${product.id}`}
        style={{ aspectRatio: '4/5', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{
          position: 'absolute', inset: 0, zIndex: 4,
          background: 'rgba(31,29,27,0.45)',
          opacity: hover ? 1 : 0, transition: 'opacity .3s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            border: '1px solid var(--paper)', color: 'var(--paper)',
            padding: '12px 22px', fontSize: 10, letterSpacing: '0.28em',
            textTransform: 'uppercase', fontWeight: 700,
          }}>
            Ver pieza →
          </div>
        </div>
        <div style={{
          position: 'absolute', top: 14, left: 14, zIndex: 3,
          padding: '5px 10px',
          background: 'var(--paper)', border: '1px solid var(--line-strong)',
          fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--ink)', fontWeight: 600,
        }}>
          {product.intensity}
        </div>
      </Placeholder>
      <div style={{ padding: '20px 4px 0' }}>
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          color: 'var(--gold)', fontSize: 13, marginBottom: 6,
        }}>{brand.name}</div>
        <div style={{
          fontFamily: 'var(--serif)', fontSize: 22, lineHeight: 1.2,
          color: 'var(--ink)', marginBottom: 8, fontWeight: 500,
        }}>{product.name}</div>
        <div style={{
          fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--ink-mute)',
        }}>{product.vitola} <span className="diamond"></span> {product.length}</div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)',
        }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--ink)' }}>
            USD {product.price}
          </span>
          <span style={{
            fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: hover ? 'var(--gold)' : 'var(--ink-mute)',
            fontWeight: 600, transition: 'color .2s',
          }}>
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
    <div style={{ borderBottom: '1px solid var(--line)', padding: '22px 0' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span className="eyebrow ink">{title}</span>
        <span style={{
          color: 'var(--gold)', fontSize: 18, transition: 'transform .2s',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>+</span>
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
      padding: '7px 0', textAlign: 'left',
      color: checked ? 'var(--ink)' : 'var(--ink-2)',
      transition: 'color .2s', cursor: 'pointer',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          width: 14, height: 14,
          border: '1px solid ' + (checked ? 'var(--gold)' : 'var(--line-strong)'),
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: checked ? 'var(--gold)' : 'transparent',
        }}>
          {checked && <span style={{ color: 'var(--paper)', fontSize: 10, lineHeight: 1 }}>✓</span>}
        </span>
        <span style={{ fontSize: 14 }}>{label}</span>
      </span>
      <span style={{ fontSize: 11, color: 'var(--ink-soft)', fontVariantNumeric: 'tabular-nums' }}>
        ({count})
      </span>
    </button>
  );
}

function PriceSlider({ value, onChange, min, max }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 14, color: 'var(--ink)', fontFamily: 'var(--serif)' }}>USD {value[0]}</span>
        <span style={{ fontSize: 14, color: 'var(--ink)', fontFamily: 'var(--serif)' }}>USD {value[1]}</span>
      </div>
      <div style={{ position: 'relative', height: 4, background: 'var(--line)' }}>
        <div style={{
          position: 'absolute',
          left: `${((value[0]-min)/(max-min))*100}%`,
          right: `${100 - ((value[1]-min)/(max-min))*100}%`,
          top: 0, bottom: 0, background: 'var(--gold)',
        }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <input type="number" value={value[0]} min={min} max={value[1]}
          onChange={e => onChange([+e.target.value, value[1]])} style={{
          flex: 1, background: 'var(--paper)', border: '1px solid var(--line-strong)',
          padding: '8px 10px', color: 'var(--ink)', fontSize: 13, fontFamily: 'var(--sans)',
        }} />
        <input type="number" value={value[1]} min={value[0]} max={max}
          onChange={e => onChange([value[0], +e.target.value])} style={{
          flex: 1, background: 'var(--paper)', border: '1px solid var(--line-strong)',
          padding: '8px 10px', color: 'var(--ink)', fontSize: 13, fontFamily: 'var(--sans)',
        }} />
      </div>
    </div>
  );
}

function ProductRow({ product, onClick }) {
  const { BRANDS } = window.TR;
  const brand = BRANDS.find(b => b.id === product.brand);
  return (
    <button onClick={() => onClick(product)} style={{
      background: 'var(--paper)', display: 'grid',
      gridTemplateColumns: '120px 1fr 1fr 1fr 120px 100px',
      gap: 24, alignItems: 'center', padding: '20px 24px', textAlign: 'left',
      transition: 'background .2s', cursor: 'pointer',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--paper)'}
    >
      <Placeholder productMode glyph="❦"
        seed={`tr-product-${product.id}`}
        style={{ width: 100, height: 80 }} />
      <div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: 12 }}>{brand.name}</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 20, marginTop: 4, color: 'var(--ink)' }}>{product.name}</div>
      </div>
      <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-2)' }}>{product.vitola}</div>
      <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-2)' }}>{product.intensity}</div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--ink)' }}>USD {product.price}</div>
      <span style={{ fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>Ver →</span>
    </button>
  );
}

function ShopPage({ initialBrand, openProduct }) {
  const { PRODUCTS, BRANDS, VITOLAS, INTENSIDADES } = window.TR;
  const { isMobile, isTablet } = useViewport();
  const compact = isMobile || isTablet;

  const [brands, setBrands]           = useStateShop(initialBrand ? [initialBrand] : []);
  const [vitolas, setVitolas]         = useStateShop([]);
  const [intensities, setIntensities] = useStateShop([]);
  const [price, setPrice]             = useStateShop([0, 200]);
  const [sort, setSort]               = useStateShop('curated');
  const [view, setView]               = useStateShop('grid');
  const [filtersOpen, setFiltersOpen] = useStateShop(false);

  const filtered = useMemoShop(() => {
    let r = PRODUCTS.filter(p => {
      if (brands.length && !brands.includes(p.brand)) return false;
      if (vitolas.length && !vitolas.includes(p.vitola)) return false;
      if (intensities.length && !intensities.includes(p.intensity)) return false;
      if (p.price < price[0] || p.price > price[1]) return false;
      return true;
    });
    if (sort === 'price-asc')  r = [...r].sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') r = [...r].sort((a,b) => b.price - a.price);
    if (sort === 'name')       r = [...r].sort((a,b) => a.name.localeCompare(b.name));
    return r;
  }, [brands, vitolas, intensities, price, sort]);

  const toggle = (list, setList) => (item) =>
    setList(list.includes(item) ? list.filter(x => x !== item) : [...list, item]);

  const brandCounts     = useMemoShop(() => { const m = {}; PRODUCTS.forEach(p => m[p.brand] = (m[p.brand]||0)+1); return m; }, []);
  const vitolaCounts    = useMemoShop(() => { const m = {}; PRODUCTS.forEach(p => m[p.vitola] = (m[p.vitola]||0)+1); return m; }, []);
  const intensityCounts = useMemoShop(() => { const m = {}; PRODUCTS.forEach(p => m[p.intensity] = (m[p.intensity]||0)+1); return m; }, []);

  const activeCount = brands.length + vitolas.length + intensities.length + (price[0] > 0 || price[1] < 200 ? 1 : 0);
  const gridCols = isMobile ? 2 : isTablet ? 2 : 3;

  const FilterPanel = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div className="eyebrow ink">Filtros</div>
        {activeCount > 0 && (
          <button onClick={() => { setBrands([]); setVitolas([]); setIntensities([]); setPrice([0,200]); }} style={{
            fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--gold)', textDecoration: 'underline', textUnderlineOffset: 4,
            fontWeight: 600,
          }}>
            Limpiar ({activeCount})
          </button>
        )}
      </div>

      <FilterGroup title="Marca">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 280, overflowY: 'auto', paddingRight: 8 }}>
          {BRANDS.map(b => (
            <CheckRow key={b.id} label={b.name} count={brandCounts[b.id] || 0}
              checked={brands.includes(b.id)} onClick={() => toggle(brands, setBrands)(b.id)} />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Intensidad">
        {INTENSIDADES.map(i => (
          <CheckRow key={i} label={i} count={intensityCounts[i] || 0}
            checked={intensities.includes(i)} onClick={() => toggle(intensities, setIntensities)(i)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Vitola">
        {VITOLAS.map(v => (
          <CheckRow key={v} label={v} count={vitolaCounts[v] || 0}
            checked={vitolas.includes(v)} onClick={() => toggle(vitolas, setVitolas)(v)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Precio (USD)">
        <PriceSlider value={price} onChange={setPrice} min={0} max={200} />
      </FilterGroup>
    </>
  );

  return (
    <div className="page" data-screen-label="02 Tienda">
      {/* Page header */}
      <div style={{
        borderBottom: '1px solid var(--line)', background: 'var(--bg-2)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div className="watermark" style={{
          top: '50%', right: -40, transform: 'translateY(-50%)',
          fontSize: 'clamp(180px, 24vw, 340px)',
        }}>Catálogo</div>
        <div className="container" style={{
          position: 'relative',
          padding: isMobile ? '72px 20px 56px' : '112px 56px 80px',
          maxWidth: 1480,
        }}>
          <div className="eyebrow" style={{ marginBottom: 24 }}>— La Cava —</div>
          <h1 style={{
            fontSize: 'clamp(40px, 7.5vw, 104px)', lineHeight: 0.94,
            marginBottom: 24, color: 'var(--ink)', letterSpacing: '-0.025em',
            textWrap: 'balance',
          }}>
            La <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>cava</span> entera.
          </h1>
          <p style={{
            fontSize: isMobile ? 15 : 18, color: 'var(--ink-2)',
            maxWidth: 600, lineHeight: 1.7,
          }}>
            {PRODUCTS.length} referencias destacadas, repartidas entre {BRANDS.length} casas.
            En la tienda física tenemos más de 600. Filtre por marca, intensidad, vitola o precio.
            Las novedades se publican el primer viernes de cada mes.
          </p>
        </div>
      </div>

      <div className="container" style={{
        padding: isMobile ? '32px 20px 64px' : '60px 56px 120px',
        display: 'grid', gridTemplateColumns: compact ? '1fr' : '260px 1fr',
        gap: compact ? 24 : 56,
      }}>
        {!compact && (
          <aside>
            <div style={{ position: 'sticky', top: 110 }}>{FilterPanel}</div>
          </aside>
        )}

        <div>
          {/* Toolbar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingBottom: 16, marginBottom: 24, borderBottom: '1px solid var(--line)',
            flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>
              <span style={{ color: 'var(--gold)', fontFamily: 'var(--serif)', fontSize: 22, marginRight: 8 }}>
                {filtered.length}
              </span>
              piezas mostradas
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 24, flexWrap: 'wrap' }}>
              {compact && (
                <button onClick={() => setFiltersOpen(true)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px', border: '1px solid var(--ink)', color: 'var(--ink)',
                  fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M6 12h12M10 18h4"/></svg>
                  Filtros {activeCount > 0 && `(${activeCount})`}
                </button>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {!isMobile && <span style={{ fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>Ordenar:</span>}
                <select value={sort} onChange={e => setSort(e.target.value)} style={{
                  background: 'var(--paper)', border: '1px solid var(--line-strong)', color: 'var(--ink)',
                  padding: '6px 12px', fontSize: 12, fontFamily: 'var(--sans)',
                }}>
                  <option value="curated">Curaduría</option>
                  <option value="price-asc">Precio ↑</option>
                  <option value="price-desc">Precio ↓</option>
                  <option value="name">Nombre A–Z</option>
                </select>
              </div>
              {!isMobile && (
                <div style={{ display: 'flex', border: '1px solid var(--line-strong)' }}>
                  {[['grid', '⊞'], ['list', '☰']].map(([v, icon]) => (
                    <button key={v} onClick={() => setView(v)} style={{
                      padding: '6px 12px', fontSize: 14,
                      background: view === v ? 'var(--ink)' : 'transparent',
                      color: view === v ? 'var(--paper)' : 'var(--ink-2)',
                    }}>{icon}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

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

          {(view === 'grid' || isMobile) ? (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: isMobile ? '28px 14px' : '52px 32px' }}>
              {filtered.map(p => <ProductCard key={p.id} product={p} onClick={openProduct} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--line-strong)', border: '1px solid var(--line-strong)' }}>
              {filtered.map(p => <ProductRow key={p.id} product={p} onClick={openProduct} />)}
            </div>
          )}

          {filtered.length === 0 && (
            <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--ink-2)' }}>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 30, color: 'var(--gold)', marginBottom: 14 }}>
                Ninguna pieza coincide.
              </div>
              <div>Relaje los filtros, o escríbanos: en la tienda física hay más de 600 referencias.</div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom sheet de filtros (mobile/tablet) */}
      {compact && filtersOpen && (
        <div onClick={() => setFiltersOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 80,
          background: 'rgba(31,29,27,0.55)', backdropFilter: 'blur(6px)',
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

window.ShopPage = ShopPage;
window.ProductCard = ProductCard;
