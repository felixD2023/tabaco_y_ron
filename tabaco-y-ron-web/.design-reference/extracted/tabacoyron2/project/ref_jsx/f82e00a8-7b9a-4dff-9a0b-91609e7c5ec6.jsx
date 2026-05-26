// Blog — guías, historia, maridajes, eventos
const { useState: useStateBlog, useMemo: useMemoBlog } = React;

function PostCard({ post, large = false }) {
  const variants = { 'Guías': 'warm', 'Historia': 'smoke', 'Maridajes': 'crimson', 'Eventos': '' };
  const catTag = { 'Guías': 'cigar', 'Historia': 'interior', 'Maridajes': 'whiskey', 'Eventos': 'interior' }[post.category] || 'cigar';
  const { isMobile } = useViewport();
  if (large) {
    return (
      <article style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.3fr 1fr', gap: isMobile ? 28 : 56, alignItems: 'center', cursor: 'pointer' }}>
        <Placeholder label={`featured · ${post.title.slice(0, 40)}`} seed={`tr-post-${post.id}-feat`} tag={catTag} variant={variants[post.category]}
          style={{ aspectRatio: isMobile ? '16/10' : '16/11' }}>
          <div style={{ position: 'absolute', top: 18, left: 18, padding: '6px 12px', background: 'var(--gold)', color: 'var(--bg)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, zIndex: 3 }}>
            Editorial del mes
          </div>
        </Placeholder>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            <span className="eyebrow">{post.category}</span>
            <span style={{ width: 24, height: 1, background: 'var(--line-strong)' }} />
            <span style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{post.date} · {post.read} min</span>
          </div>
          <h2 style={{ fontSize: isMobile ? 32 : 52, lineHeight: 1.05, marginBottom: 20, textWrap: 'pretty' }}>{post.title}</h2>
          <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--cream-mute)', lineHeight: 1.7, marginBottom: 28 }}>
            {post.excerpt}
          </p>
          <button className="btn">Leer la entrada →</button>
        </div>
      </article>
    );
  }
  return (
    <article style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
      onMouseEnter={e => { const img = e.currentTarget.querySelector('.ph'); if (img) img.style.transform = 'scale(1.02)'; }}
      onMouseLeave={e => { const img = e.currentTarget.querySelector('.ph'); if (img) img.style.transform = 'scale(1)'; }}>
      <Placeholder label={post.category.toLowerCase()} seed={`tr-post-${post.id}`} tag={catTag} variant={variants[post.category]}
        style={{ aspectRatio: '4/3', transition: 'transform .4s ease' }} />
      <div style={{ padding: '24px 0 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>{post.category}</span>
          <span style={{ width: 1, height: 10, background: 'var(--line-strong)' }} />
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{post.read} min</span>
        </div>
        <h3 style={{ fontSize: 22, lineHeight: 1.2, marginBottom: 14, textWrap: 'pretty' }}>{post.title}</h3>
        <p style={{ fontSize: 14, color: 'var(--cream-mute)', lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
          {post.excerpt}
        </p>
        <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.16em', textTransform: 'uppercase', paddingTop: 16, borderTop: '1px solid var(--line)' }}>
          {post.date}
        </div>
      </div>
    </article>
  );
}

function BlogPage() {
  const { POSTS, POST_CATEGORIES } = window.TR;
  const [cat, setCat] = useStateBlog('Todos');
  const { isMobile, isTablet } = useViewport();
  const cols = isMobile ? 1 : isTablet ? 2 : 3;

  const featured = POSTS[0];
  const rest = POSTS.slice(1);
  const filtered = useMemoBlog(() => {
    if (cat === 'Todos') return rest;
    return rest.filter(p => p.category === cat);
  }, [cat]);

  return (
    <div className="page">
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="container" style={{ padding: isMobile ? '80px 20px 56px' : '120px 56px 80px' }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between', gap: isMobile ? 28 : 64 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 24 }}>— El Cuaderno —</div>
              <h1 style={{ fontSize: 'clamp(40px, 7vw, 96px)', lineHeight: 0.96, marginBottom: 24 }}>
                Lecturas para<br/>
                <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>los pacientes.</span>
              </h1>
            </div>
            <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--cream-mute)', maxWidth: 380, lineHeight: 1.7 }}>
              Guías de cata, historia del habano, maridajes con ron y nuestras catas privadas. Sin
              prisa. Una nueva entrada cada quince días.
            </p>
          </div>
        </div>
      </div>

      {/* Featured */}
      <div className="container" style={{ padding: isMobile ? '48px 20px' : '80px 56px' }}>
        <PostCard post={featured} large />
      </div>

      {/* Tabs */}
      <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', position: 'sticky', top: isMobile ? 80 : 96, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)', zIndex: 30 }}>
        <div className="container" style={{ padding: isMobile ? '14px 20px' : '20px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', flex: 1 }}>
            {POST_CATEGORIES.map(c => (
              <Chip key={c} label={c} active={cat === c} onClick={() => setCat(c)} />
            ))}
          </div>
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--cream-mute)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              <input placeholder="Buscar en el cuaderno…" style={{
                background: 'transparent', border: 'none', color: 'var(--cream)',
                fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', width: 200,
              }} />
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="container" style={{ padding: isMobile ? '48px 20px' : '80px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: isMobile ? 48 : '64px 36px' }}>
          {filtered.map(p => <PostCard key={p.id} post={p} />)}
        </div>

        {/* Newsletter inline */}
        <div style={{ marginTop: isMobile ? 64 : 120, padding: isMobile ? '40px 24px' : '72px', background: 'var(--bg-2)', border: '1px solid var(--line)', textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>— El Boletín —</div>
          <h3 style={{ fontSize: isMobile ? 32 : 44, marginBottom: 18 }}>Una carta. Una vez al mes.</h3>
          <p style={{ fontSize: isMobile ? 14 : 16, color: 'var(--cream-mute)', maxWidth: 540, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Nuevas llegadas a la casa, lecturas largas, invitaciones a catas privadas. Sin promociones,
            sin urgencia.
          </p>
          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: 480, margin: '0 auto', border: isMobile ? 'none' : '1px solid var(--gold)', gap: isMobile ? 10 : 0 }}>
            <input type="email" placeholder="tu@correo.com" style={{
              flex: 1, background: 'transparent', border: isMobile ? '1px solid var(--gold)' : 'none', padding: '14px 18px',
              color: 'var(--cream)', fontFamily: 'var(--sans)', fontSize: 14, outline: 'none'
            }} />
            <button type="submit" style={{ background: 'var(--gold)', color: 'var(--bg)', padding: isMobile ? '14px 24px' : '0 28px', fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', border: 'none' }}>
              Unirme
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

window.BlogPage = BlogPage;
