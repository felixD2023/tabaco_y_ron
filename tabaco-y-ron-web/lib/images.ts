// Librería de imágenes temáticas (Unsplash) — fotografías de tabaquería,
// encendedores, lounge de alta sociedad, cigarros, maderas y cuero.
// Cada slot recibe una imagen distinta y determinística según su seed.
// Las imágenes están servidas localmente desde /public/ambient/ para no
// depender de la CDN externa (algunas redes / extensiones bloquean Unsplash).

export type ImgTag =
  | "hero"
  | "cigar"
  | "smoke"
  | "lighter"
  | "whiskey"
  | "hands"
  | "box"
  | "ring"
  | "door"
  | "bottle"
  | "interior"
  | "portrait";

const IMG_LIB: Record<ImgTag, string[]> = {
  hero: ["photo-1577931170527-cb5c8f39020c", "photo-1637248990333-e66e027538f4", "photo-1547652577-b4fe2f34d7ee"],
  cigar: ["photo-1547652577-b4fe2f34d7ee", "photo-1612659429508-b429d6b07ac1", "photo-1612659429327-8f59b894959b"],
  smoke: ["photo-1577931170527-cb5c8f39020c", "photo-1577931061564-e746adda00ec"],
  lighter: ["photo-1592505690387-24e71ca99897", "photo-1577931170527-cb5c8f39020c"],
  whiskey: ["photo-1637248990333-e66e027538f4", "photo-1612659429327-8f59b894959b", "photo-1614846147847-7d12ca7866ed", "photo-1613140506142-277c6241b858"],
  hands: ["photo-1577931061564-e746adda00ec", "photo-1592505690387-24e71ca99897"],
  box: ["photo-1612659429508-b429d6b07ac1", "photo-1610476362995-dff7b9a4e4c1"],
  ring: ["photo-1603292503723-bb45c35b1903", "photo-1520644204196-4a478546826f"],
  door: ["photo-1610476362995-dff7b9a4e4c1"],
  bottle: ["photo-1614846147847-7d12ca7866ed", "photo-1616189221504-67b2a569922a", "photo-1613140506142-277c6241b858"],
  interior: ["photo-1610476362995-dff7b9a4e4c1", "photo-1637248990333-e66e027538f4"],
  portrait: ["photo-1610561164062-fe4b65086c66", "photo-1603292503723-bb45c35b1903"],
};

const IMG_POOL = [
  ...IMG_LIB.cigar,
  ...IMG_LIB.lighter,
  ...IMG_LIB.whiskey,
  ...IMG_LIB.hands,
  ...IMG_LIB.box,
  ...IMG_LIB.bottle,
  ...IMG_LIB.interior,
  ...IMG_LIB.door,
  ...IMG_LIB.ring,
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickImg(seed: string, tag?: ImgTag): string {
  const pool = tag && IMG_LIB[tag] ? IMG_LIB[tag] : IMG_POOL;
  return pool[hash(seed) % pool.length];
}

export function ambientUrl(seed: string, tag?: ImgTag, _w = 1200): string {
  void _w; // ancho fijo: las imágenes están preempaquetadas a 1600
  const photoId = pickImg(seed, tag);
  return `/ambient/${photoId}.jpg`;
}

// Imágenes reales de productos (catálogo)
const PRODUCT_IMG_NAMES = [
  "arturo-fuente-cuban-corona",
  "arturo-fuente-flor-fina",
  "arturo-fuente-chateau",
];

export function productImg(seed: string): string {
  return PRODUCT_IMG_NAMES[hash(seed) % PRODUCT_IMG_NAMES.length];
}

export function productImgUrl(name: string): string {
  return `/products/${name}.png`;
}
