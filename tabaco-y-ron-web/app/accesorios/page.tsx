import type { Metadata } from "next";

import { ACCESSORIES, ACCESSORY_CATEGORIES } from "@/lib/data";
import { SITE, SITE_URL } from "@/lib/site-config";

import AccesoriosClient from "./AccesoriosClient";

export const metadata: Metadata = {
  title: "Accesorios para puros: humidores, cortadores y encendedores",
  description:
    "Humidores de cedro, cortadores de doble hoja, encendedores triple llama y ceniceros artesanales. Piezas seleccionadas en España, Italia, Cuba y Panamá para acompañar el ritual del habano.",
  alternates: { canonical: "/accesorios" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/accesorios`,
    title: `Accesorios — ${SITE.name}`,
    description: `${ACCESSORIES.length} piezas en ${ACCESSORY_CATEGORIES.length - 1} categorías: humidores, cortadores, encendedores, ceniceros y estuches.`,
    images: [SITE.ogImage],
  },
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `Accesorios para puros — ${SITE.name}`,
  numberOfItems: ACCESSORIES.length,
  itemListElement: ACCESSORIES.map((a, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: a.name,
      sku: a.id,
      category: a.category,
      description: a.blurb,
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: a.price,
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/accesorios`,
      },
    },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Accesorios", item: `${SITE_URL}/accesorios` },
  ],
};

export default function AccesoriosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AccesoriosClient />
    </>
  );
}
