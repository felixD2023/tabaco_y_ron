// App principal de Tabaco & Ron — router + estado global + Tweaks
const { useState: useStateApp, useEffect: useEffectApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "gold",
  "fontPair": "georgia",
  "ctaStyle": "ink",
  "heroLayout": "image"
}/*EDITMODE-END*/;

function TweaksUI({ tweaks, setTweak }) {
  if (!window.TweaksPanel) return null;
  const { TweaksPanel, TweakSection, TweakRadio, TweakSelect } = window;
  return (
    <TweaksPanel title="Tweaks · Tabaco & Ron">
      <TweakSection label="Visuales">
        <TweakRadio label="Acento principal"
          value={tweaks.accent}
          onChange={v => setTweak('accent', v)}
          options={[
            { value: 'gold',  label: 'Oro' },
            { value: 'red',   label: 'Rojo' },
            { value: 'mixed', label: 'Mixto' },
          ]} />
        <TweakRadio label="CTA estilo"
          value={tweaks.ctaStyle}
          onChange={v => setTweak('ctaStyle', v)}
          options={[
            { value: 'ink',  label: 'Grafito' },
            { value: 'gold', label: 'Dorado' },
          ]} />
      </TweakSection>
      <TweakSection label="Hero">
        <TweakSelect label="Layout del hero"
          value={tweaks.heroLayout}
          onChange={v => setTweak('heroLayout', v)}
          options={[
            { value: 'image',     label: 'Imagen de fondo (cinematográfico)' },
            { value: 'editorial', label: 'Editorial (texto + imagen lateral)' },
            { value: 'centered',  label: 'Centrado (etéreo)' },
            { value: 'split',     label: 'Asimétrico (tipografía masiva)' },
          ]} />
      </TweakSection>
      <TweakSection label="Tipografía">
        <TweakSelect label="Pareja tipográfica"
          value={tweaks.fontPair}
          onChange={v => setTweak('fontPair', v)}
          options={[
            { value: 'georgia', label: 'Georgia + Lato (clásica)' },
            { value: 'manual',  label: 'Bodoni Moda + Jost (manual)' },
            { value: 'classic', label: 'Playfair + Inter' },
            { value: 'serif',   label: 'Cormorant + Lato' },
          ]} />
      </TweakSection>
    </TweaksPanel>
  );
}

// Aplica los tweaks como custom properties / clases en :root
function applyTweaks(t) {
  const root = document.documentElement;
  const body = document.body;

  // Acento
  if (t.accent === 'red') {
    root.style.setProperty('--gold', '#B91C1C');
    root.style.setProperty('--gold-pure', '#D43A3A');
    root.style.setProperty('--gold-soft', '#F2A8A8');
    root.style.setProperty('--line-gold', 'rgba(185,28,28,0.30)');
  } else {
    root.style.setProperty('--gold', '#B08545');
    root.style.setProperty('--gold-pure', '#C4A862');
    root.style.setProperty('--gold-soft', '#D9C28C');
    root.style.setProperty('--line-gold', 'rgba(176,133,69,0.30)');
  }

  // CTA gold: usa clase en body que CSS controla
  body.classList.toggle('cta-gold', t.ctaStyle === 'gold');
  body.classList.toggle('hero-centered',  t.heroLayout === 'centered');
  body.classList.toggle('hero-split',     t.heroLayout === 'split');
  body.classList.toggle('hero-editorial', t.heroLayout === 'editorial');

  // Tipografía
  if (t.fontPair === 'classic') {
    root.style.setProperty('--serif', "'Playfair Display', Georgia, serif");
    root.style.setProperty('--sans',  "'Inter', 'Helvetica Neue', Arial, sans-serif");
  } else if (t.fontPair === 'serif') {
    root.style.setProperty('--serif', "'Cormorant Garamond', Georgia, serif");
    root.style.setProperty('--sans',  "'Lato', 'Helvetica Neue', Arial, sans-serif");
  } else if (t.fontPair === 'manual') {
    root.style.setProperty('--serif', "'Bodoni Moda', 'Didot', Georgia, serif");
    root.style.setProperty('--sans',  "'Jost', 'Helvetica Neue', Helvetica, Arial, sans-serif");
  } else {
    // 'georgia' (default): Georgia para títulos, Lato para todo lo demás
    root.style.setProperty('--serif', "Georgia, 'Times New Roman', 'Bodoni Moda', serif");
    root.style.setProperty('--sans',  "'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif");
  }
}

// Loader for additional fonts when tweaks need them
function ensureFontsLoaded(t) {
  if (t.fontPair === 'manual' && !document.getElementById('font-manual')) {
    const l = document.createElement('link');
    l.id = 'font-manual'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;0,6..96,700;1,6..96,400;1,6..96,500&family=Jost:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(l);
  }
  if (t.fontPair === 'classic' && !document.getElementById('font-classic')) {
    const l = document.createElement('link');
    l.id = 'font-classic'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(l);
  }
  if (t.fontPair === 'serif' && !document.getElementById('font-serif')) {
    const l = document.createElement('link');
    l.id = 'font-serif'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap';
    document.head.appendChild(l);
  }
}

function App() {
  const [page, setPageRaw] = useStateApp('home');
  const [pageMeta, setPageMeta] = useStateApp({});
  const [product, setProduct] = useStateApp(null);
  const [cart, setCart] = useStateApp([]);

  const [tweaks, _setTweaks] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : [TWEAK_DEFAULTS, () => {}];

  const setTweak = (k, v) => {
    if (typeof k === 'object') _setTweaks(k);
    else _setTweaks({ [k]: v });
  };

  useEffectApp(() => {
    ensureFontsLoaded(tweaks);
    applyTweaks(tweaks);
  }, [tweaks]);

  const setPage = (p, meta = {}) => {
    setPageRaw(p);
    setPageMeta(meta);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openProduct = (p) => setProduct(p);
  const closeProduct = () => setProduct(null);

  const addToCart = (p, qty = 1) => {
    setCart(prev => {
      const i = prev.findIndex(x => x.id === p.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { id: p.id, qty, name: p.name, price: p.price }];
    });
  };
  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  return (
    <React.Fragment>
      <TopBar page={page} setPage={setPage} cartCount={cartCount} />
      <main data-screen-label={`screen-${page}`}>
        {page === 'home'       && <HomePage setPage={setPage} openProduct={openProduct} tweaks={tweaks} />}
        {page === 'tienda'     && <ShopPage initialBrand={pageMeta.brand} openProduct={openProduct} />}
        {page === 'accesorios' && <AccessoriesPage />}
        {page === 'blog'       && <BlogPage />}
        {page === 'nosotros'   && <NosotrosPage />}
      </main>
      <Footer setPage={setPage} />
      <ProductModal product={product} onClose={closeProduct} addToCart={addToCart} />
      <TweaksUI tweaks={tweaks} setTweak={setTweak} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
