export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tabacoyron.com";

export const SITE = {
  name: "Tabaco & Ron",
  legalName: "Tabaco & Ron",
  description:
    "Casa madrileña fundada en 2009. Curaduría de habanos y accesorios, con tabaco traído directamente de las casas que aún liden la hoja a mano.",
  locale: "es_ES",
  url: SITE_URL,
  ogImage: `${SITE_URL}/og-default.jpg`,
  contact: {
    email: "casa@tabacoyron.com",
    phone: "+34 91 308 12 09",
  },
  address: {
    street: "Calle del Almirante 14",
    locality: "Madrid",
    region: "Madrid",
    postalCode: "28004",
    country: "ES",
  },
  hours: "Tu-Sa 11:00-21:00",
  socials: [] as string[],
} as const;
