"use client";

import { useMemo, useState } from "react";
import Placeholder from "@/components/Placeholder";
import { Chip } from "@/components/ui";
import { POSTS, POST_CATEGORIES, type Post } from "@/lib/data";
import type { ImgTag } from "@/lib/images";

const VARIANTS: Record<string, "" | "warm" | "smoke" | "crimson"> = {
  Guías: "warm",
  Historia: "smoke",
  Maridajes: "crimson",
  Eventos: "",
};
const CAT_TAG: Record<string, ImgTag> = {
  Guías: "cigar",
  Historia: "interior",
  Maridajes: "whiskey",
  Eventos: "interior",
};

function PostCard({ post, large = false }: { post: Post; large?: boolean }) {
  if (large) {
    return (
      <article className="grid cursor-pointer items-center gap-7 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
        <Placeholder
          label={`featured · ${post.title.slice(0, 40)}`}
          seed={`tr-post-${post.id}-feat`}
          tag={CAT_TAG[post.category]}
          variant={VARIANTS[post.category]}
          style={{ aspectRatio: "16/11" }}
        >
          <div className="absolute left-[18px] top-[18px] z-[3] bg-gold px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-coal">
            Editorial del mes
          </div>
        </Placeholder>
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-4">
            <span className="eyebrow">{post.category}</span>
            <span className="h-px w-6 bg-line-strong" />
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted">
              {post.date} · {post.read} min
            </span>
          </div>
          <h2
            className="mb-5 text-[32px] leading-[1.05] md:text-[52px]"
            style={{ textWrap: "pretty" }}
          >
            {post.title}
          </h2>
          <p className="mb-7 text-[15px] leading-[1.7] text-cream-mute md:text-[17px]">
            {post.excerpt}
          </p>
          <button className="btn-tr">Leer la entrada →</button>
        </div>
      </article>
    );
  }
  return (
    <article className="group flex cursor-pointer flex-col">
      <Placeholder
        label={post.category.toLowerCase()}
        seed={`tr-post-${post.id}`}
        tag={CAT_TAG[post.category]}
        variant={VARIANTS[post.category]}
        className="transition-transform duration-[400ms] ease-out group-hover:scale-[1.02]"
        style={{ aspectRatio: "4/3" }}
      />
      <div className="flex flex-1 flex-col pt-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
            {post.category}
          </span>
          <span className="h-2.5 w-px bg-line-strong" />
          <span className="text-[11px] text-muted">{post.read} min</span>
        </div>
        <h3 className="mb-3.5 text-[22px] leading-[1.2]" style={{ textWrap: "pretty" }}>
          {post.title}
        </h3>
        <p className="mb-5 flex-1 text-sm leading-[1.6] text-cream-mute">{post.excerpt}</p>
        <div className="border-t border-line pt-4 text-[11px] uppercase tracking-[0.16em] text-muted">
          {post.date}
        </div>
      </div>
    </article>
  );
}

const FEATURED = POSTS[0];
const REST = POSTS.slice(1);

export default function BlogClient() {
  const [cat, setCat] = useState("Todos");
  const filtered = useMemo(
    () => (cat === "Todos" ? REST : REST.filter((p) => p.category === cat)),
    [cat],
  );

  return (
    <div className="page">
      {/* Encabezado */}
      <div className="border-b border-line">
        <div className="container-tr py-20 md:py-30 lg:pb-20 lg:pt-30">
          <div className="flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-end lg:gap-16">
            <div>
              <div className="eyebrow mb-6">— El Cuaderno —</div>
              <h1 className="leading-[0.96]" style={{ fontSize: "clamp(40px, 7vw, 96px)" }}>
                Lecturas para
                <br />
                <span className="italic text-gold">los pacientes.</span>
              </h1>
            </div>
            <p className="max-w-[380px] text-[15px] leading-[1.7] text-cream-mute md:text-[17px]">
              Guías de cata, historia del habano, maridajes con ron y nuestras catas privadas. Sin
              prisa. Una nueva entrada cada quince días.
            </p>
          </div>
        </div>
      </div>

      {/* Destacado */}
      <div className="container-tr py-12 md:py-20">
        <PostCard post={FEATURED} large />
      </div>

      {/* Tabs */}
      <div
        className="sticky top-20 z-30 border-y border-line md:top-24"
        style={{ background: "rgba(10,10,10,0.95)", backdropFilter: "blur(10px)" }}
      >
        <div className="container-tr flex items-center justify-between gap-4 py-3.5 md:py-5">
          <div className="flex flex-1 gap-2 overflow-x-auto">
            {POST_CATEGORIES.map((c) => (
              <Chip key={c} label={c} active={cat === c} onClick={() => setCat(c)} />
            ))}
          </div>
          <div className="hidden items-center gap-3 text-cream-mute md:flex">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              placeholder="Buscar en el cuaderno…"
              className="w-[200px] bg-transparent text-[13px] text-cream outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container-tr py-12 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-9 md:gap-y-16 lg:grid-cols-3">
          {filtered.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-16 border border-line bg-coal-soft p-6 py-10 text-center md:mt-30 md:p-18">
          <div className="eyebrow mb-[18px]">— El Boletín —</div>
          <h3 className="mb-[18px] text-[32px] md:text-[44px]">Una carta. Una vez al mes.</h3>
          <p className="mx-auto mb-8 max-w-[540px] text-sm leading-[1.7] text-cream-mute md:text-base">
            Nuevas llegadas a la casa, lecturas largas, invitaciones a catas privadas. Sin
            promociones, sin urgencia.
          </p>
          <form className="mx-auto flex max-w-[480px] flex-col gap-2.5 md:flex-row md:gap-0 md:border md:border-gold">
            <input
              type="email"
              placeholder="tu@correo.com"
              className="flex-1 border border-gold bg-transparent px-[18px] py-3.5 text-sm text-cream outline-none md:border-none"
            />
            <button
              type="submit"
              className="bg-gold px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] text-coal md:px-7 md:py-0"
            >
              Unirme
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
