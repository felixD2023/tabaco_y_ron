import type { Metadata } from "next";

import { POSTS } from "@/lib/data";
import { SITE, SITE_URL } from "@/lib/site-config";

import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Cuaderno: guías, historia y maridajes del habano",
  description:
    "Guías de cata, historia del puro, maridajes con ron y eventos privados de Tabaco & Ron. Una nueva entrada cada quince días.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: `Cuaderno — ${SITE.name}`,
    description:
      "Lecturas para los pacientes: cata, historia, maridajes y eventos. Una nueva entrada cada quince días.",
    images: [SITE.ogImage],
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: `Cuaderno — ${SITE.name}`,
  url: `${SITE_URL}/blog`,
  inLanguage: "es-ES",
  publisher: {
    "@type": "Organization",
    name: SITE.name,
    url: SITE_URL,
  },
  blogPost: POSTS.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    articleSection: p.category,
    datePublished: p.date,
    timeRequired: `PT${p.read}M`,
    url: `${SITE_URL}/blog#${p.id}`,
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Cuaderno", item: `${SITE_URL}/blog` },
  ],
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogClient />
    </>
  );
}
