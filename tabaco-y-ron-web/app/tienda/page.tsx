import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";

import { QUERY_KEYS } from "@/constants/query-keys";
import { getQueryClient } from "@/lib/react-query-server";
import { SITE, SITE_URL } from "@/lib/site-config";
import marcasService from "@/services/marcas.service";
import productosService from "@/services/productos.service";
import type { Fortaleza, ProductoSort, ProductosListParams } from "@/types/api";

import TiendaClient from "./TiendaClient";

const PAGE_SIZE = 24;
const FORTALEZA_VALUES = new Set<Fortaleza>([
  "suave",
  "suave_medio",
  "medio",
  "medio_fuerte",
  "fuerte",
]);
const SORT_VALUES = new Set<ProductoSort>(["name", "precio_asc", "precio_desc", "rating_desc"]);

type RawSearch = Record<string, string | string[] | undefined>;

function asArray(v: string | string[] | undefined): string[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

function parseInts(v: string | string[] | undefined): number[] {
  return asArray(v)
    .map((x) => Number(x))
    .filter((n) => Number.isFinite(n) && n > 0);
}

function parseNum(v: string | string[] | undefined): number | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  if (s == null) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

function searchParamsToApiParams(sp: RawSearch): ProductosListParams {
  const page = Math.max(1, parseNum(sp.page) ?? 1);
  const sortCandidate = (Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) as ProductoSort | undefined;
  const sort: ProductoSort = sortCandidate && SORT_VALUES.has(sortCandidate) ? sortCandidate : "name";

  const fortalezas = asArray(sp.fortaleza).filter((v): v is Fortaleza =>
    FORTALEZA_VALUES.has(v as Fortaleza),
  );
  const marcaIds = parseInts(sp.marca_id);
  const subcategoriaIds = parseInts(sp.subcategoria_id);
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim() || undefined;

  return {
    page,
    page_size: PAGE_SIZE,
    sort,
    q,
    marca_id: marcaIds.length ? marcaIds : undefined,
    subcategoria_id: subcategoriaIds.length ? subcategoriaIds : undefined,
    fortaleza: fortalezas.length ? fortalezas : undefined,
    precio_min: parseNum(sp.precio_min),
    precio_max: parseNum(sp.precio_max),
    solo_existentes: sp.solo_existentes === "1" || undefined,
  };
}

export const metadata: Metadata = {
  title: "Catálogo de habanos y puros premium",
  description:
    "Catálogo curado de habanos y puros premium. Filtre por marca, subcategoría, intensidad y precio.",
  alternates: { canonical: "/tienda" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/tienda`,
    title: `Catálogo — ${SITE.name}`,
    description: "Referencias activas repartidas entre las casas que representamos.",
    images: [SITE.ogImage],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Catálogo", item: `${SITE_URL}/tienda` },
  ],
};

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<RawSearch>;
}) {
  const sp = await searchParams;
  const apiParams = searchParamsToApiParams(sp);
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.marcas,
      queryFn: marcasService.list,
    }),
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.productos(apiParams as Record<string, unknown>),
      queryFn: () => productosService.list(apiParams),
    }),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TiendaClient />
      </HydrationBoundary>
    </>
  );
}
