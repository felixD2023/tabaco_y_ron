import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import SiteProvider from "@/components/SiteProvider";
import QueryProvider from "@/components/QueryProvider";
import PublicChrome from "@/components/PublicChrome";
import { SITE, SITE_URL } from "@/lib/site-config";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — El arte de fumar`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "habanos",
    "puros",
    "tabaco premium",
    "tienda de puros Madrid",
    "humidores",
    "accesorios para puros",
    "ron",
    "Cohiba",
    "Romeo y Julieta",
    "tabaquería",
  ],
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE_URL,
    siteName: SITE.name,
    title: `${SITE.name} — El arte de fumar`,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — tabaquería en Madrid`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — El arte de fumar`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "shopping",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: SITE.description,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: SITE.contact.phone,
    email: SITE.contact.email,
    contactType: "customer service",
    areaServed: "ES",
    availableLanguage: ["Spanish"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE_URL,
  inLanguage: "es-ES",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/tienda?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={lato.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <QueryProvider>
          <SiteProvider>
            <PublicChrome>{children}</PublicChrome>
          </SiteProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
