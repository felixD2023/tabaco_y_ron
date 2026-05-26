// App principal de Tabaco y Ron — router + estado global
const { useState: useStateApp, useEffect: useEffectApp } = React;

function App() {
  const [page, setPageRaw] = useStateApp('home');
  const [pageMeta, setPageMeta] = useStateApp({});
  const [product, setProduct] = useStateApp(null);
  const [cart, setCart] = useStateApp([]);

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
    <>
      <TopBar page={page} setPage={setPage} cartCount={cartCount} />
      <main data-screen-label={`${page}`}>
        {page === 'home'       && <HomePage setPage={setPage} openProduct={openProduct} />}
        {page === 'tienda'     && <ShopPage initialBrand={pageMeta.brand} openProduct={openProduct} />}
        {page === 'accesorios' && <AccessoriesPage />}
        {page === 'blog'       && <BlogPage />}
        {page === 'nosotros'   && <NosotrosPage />}
      </main>
      <Footer setPage={setPage} />
      <ProductModal product={product} onClose={closeProduct} addToCart={addToCart} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
