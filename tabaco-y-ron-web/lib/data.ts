// Catálogo de marcas, productos, accesorios y blog para Tabaco & Ron

export type Brand = {
  id: string;
  name: string;
  origin: string;
  founded: number;
  blurb: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  vitola: string;
  intensity: string;
  price: number;
  vintage?: number;
  length: string;
  ring: string;
  wrapper: string;
  note: string;
};

export type Accessory = {
  id: string;
  name: string;
  category: string;
  price: number;
  blurb: string;
};

export type Post = {
  id: string;
  title: string;
  category: string;
  read: number;
  date: string;
  excerpt: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  city: string;
};

export const BRANDS: Brand[] = [
  { id: "cohiba", name: "Cohiba", origin: "Cuba", founded: 1966, blurb: "La cumbre del habano. Reservada en su día a los más altos diplomáticos." },
  { id: "romeo-julieta", name: "Romeo y Julieta", origin: "Cuba", founded: 1875, blurb: "Elegancia clásica con notas de cedro y café tostado." },
  { id: "trinidad", name: "Trinidad", origin: "Cuba", founded: 1969, blurb: "Cuerpo medio, aromática y profundamente equilibrada." },
  { id: "guantanamera", name: "Guantanamera", origin: "Cuba", founded: 2002, blurb: "El habano del cotidiano. Honesto y bien construido." },
  { id: "rocky-patel", name: "Rocky Patel", origin: "Honduras / Nicaragua", founded: 1995, blurb: "Blends boutique de gran intensidad y carácter." },
  { id: "arturo-fuente", name: "Arturo Fuente", origin: "Rep. Dominicana", founded: 1912, blurb: "Dinastía familiar, reconocida por su consistencia legendaria." },
  { id: "la-aurora", name: "La Aurora", origin: "Rep. Dominicana", founded: 1903, blurb: "La primera fábrica dominicana. Tradición viva." },
  { id: "pichardo", name: "Pichardo", origin: "Nicaragua", founded: 2010, blurb: "Liga nicaragüense de autor, intensa y especiada." },
  { id: "don-esteban", name: "Don Esteban", origin: "Rep. Dominicana", founded: 1987, blurb: "Edición limitada de tabaco añejado a mano." },
  { id: "habana-1934", name: "Habana 1934", origin: "Cuba", founded: 1934, blurb: "Homenaje a la edad de oro del puro cubano." },
  { id: "vega-real", name: "Vega Real", origin: "Rep. Dominicana", founded: 1998, blurb: "Cosecha boutique del Cibao, dulce y cremosa." },
  { id: "marques", name: "El Marqués", origin: "Nicaragua", founded: 2008, blurb: "Vitolas robustas con liga de capa Habano Rosado." },
];

export const VITOLAS = [
  "Robusto",
  "Toro",
  "Corona",
  "Churchill",
  "Petit Corona",
  "Lonsdale",
  "Double Corona",
  "Belicoso",
];

export const INTENSIDADES = ["Suave", "Medio", "Medio–Fuerte", "Fuerte"];

export const PRODUCTS: Product[] = [
  { id: "p01", name: "Behike 56", brand: "cohiba", vitola: "Robusto Extra", intensity: "Fuerte", price: 158, vintage: 2021, length: "166 mm", ring: "56", wrapper: "Medio Tiempo", note: "Especiado, cacao, cuero. La cumbre de la línea Cohiba." },
  { id: "p02", name: "Siglo VI Gran Reserva", brand: "cohiba", vitola: "Cañonazo", intensity: "Medio–Fuerte", price: 92, vintage: 2019, length: "150 mm", ring: "52", wrapper: "Vuelta Abajo", note: "Dulce y maderoso, con final largo de cuero curado." },
  { id: "p03", name: "Churchill Reserva", brand: "romeo-julieta", vitola: "Churchill", intensity: "Medio", price: 48, length: "178 mm", ring: "47", wrapper: "Cuba", note: "Café tostado, cedro, miel. Un clásico imperecedero." },
  { id: "p04", name: "Wide Churchill", brand: "romeo-julieta", vitola: "Toro", intensity: "Medio", price: 38, length: "130 mm", ring: "55", wrapper: "Cuba", note: "Versión más robusta del Churchill, cremosa." },
  { id: "p05", name: "Fundadores", brand: "trinidad", vitola: "Lonsdale", intensity: "Medio", price: 54, length: "192 mm", ring: "40", wrapper: "Vuelta Abajo", note: "Aromas de frutos secos y vainilla, gran complejidad." },
  { id: "p06", name: "Reyes", brand: "trinidad", vitola: "Petit Corona", intensity: "Suave", price: 22, length: "110 mm", ring: "40", wrapper: "Cuba", note: "Inicio elegante. Para una pausa breve." },
  { id: "p07", name: "Décimo Aniversario", brand: "rocky-patel", vitola: "Toro", intensity: "Fuerte", price: 28, length: "152 mm", ring: "50", wrapper: "Honduras", note: "Madera, pimienta negra, café espresso." },
  { id: "p08", name: "Vintage 1990", brand: "rocky-patel", vitola: "Robusto", intensity: "Medio–Fuerte", price: 24, length: "127 mm", ring: "50", wrapper: "Honduras", note: "Capa Habano añejada 12 años. Cremoso y profundo." },
  { id: "p09", name: "Hemingway Signature", brand: "arturo-fuente", vitola: "Belicoso", intensity: "Medio", price: 34, length: "152 mm", ring: "47", wrapper: "Camerún", note: "Especiado, dulce, perfectamente equilibrado." },
  { id: "p10", name: "Don Carlos No. 4", brand: "arturo-fuente", vitola: "Petit Corona", intensity: "Medio", price: 26, length: "116 mm", ring: "43", wrapper: "Camerún", note: "Homenaje al patriarca. Notas de cacao y nuez." },
  { id: "p11", name: "107 Maduro", brand: "la-aurora", vitola: "Robusto", intensity: "Fuerte", price: 19, length: "127 mm", ring: "50", wrapper: "Brasil", note: "Chocolate amargo, café, pimienta dulce." },
  { id: "p12", name: "Preferidos Sapphire", brand: "la-aurora", vitola: "Perfecto", intensity: "Medio", price: 32, length: "127 mm", ring: "48", wrapper: "Ecuador", note: "Estilo perfecto. Edición de aniversario." },
  { id: "p13", name: "Reserva Familiar", brand: "pichardo", vitola: "Toro", intensity: "Fuerte", price: 21, length: "152 mm", ring: "54", wrapper: "Nicaragua", note: "Tierra mojada, pimienta blanca, regaliz." },
  { id: "p14", name: "Clásica Sumatra", brand: "pichardo", vitola: "Corona", intensity: "Medio", price: 16, length: "142 mm", ring: "44", wrapper: "Sumatra", note: "Suave, floral, ideal para tarde temprana." },
  { id: "p15", name: "Décadas Edición", brand: "don-esteban", vitola: "Double Corona", intensity: "Medio–Fuerte", price: 64, length: "194 mm", ring: "50", wrapper: "Rep. Dominicana", note: "Añejado 8 años. Caja de cedro español." },
  { id: "p16", name: "Crillón 1934", brand: "habana-1934", vitola: "Churchill", intensity: "Medio", price: 72, length: "178 mm", ring: "47", wrapper: "Vuelta Abajo", note: "Edición limitada conmemorativa. Solo 1.500 cajas." },
  { id: "p17", name: "Decisión", brand: "guantanamera", vitola: "Corona", intensity: "Suave", price: 9, length: "142 mm", ring: "42", wrapper: "Cuba", note: "El compañero diario. Honesto y bien hecho." },
  { id: "p18", name: "Cosecha 18", brand: "vega-real", vitola: "Robusto", intensity: "Suave", price: 14, length: "127 mm", ring: "50", wrapper: "Ecuador", note: "Crema, mantequilla, almendra tostada." },
  { id: "p19", name: "Habano Rosado", brand: "marques", vitola: "Belicoso", intensity: "Fuerte", price: 23, length: "146 mm", ring: "52", wrapper: "Nicaragua", note: "Capa rosada. Intenso, especiado, picante." },
  { id: "p20", name: "Doble Corona", brand: "marques", vitola: "Double Corona", intensity: "Medio–Fuerte", price: 36, length: "194 mm", ring: "49", wrapper: "Nicaragua", note: "Para tardes largas y conversaciones más largas aún." },
];

export const ACCESSORIES: Accessory[] = [
  { id: "a01", name: "Humidor Toscana", category: "Humidores", price: 480, blurb: "Cedro español, capacidad 50 piezas, higrómetro analógico." },
  { id: "a02", name: "Humidor de Viaje Soto", category: "Humidores", price: 220, blurb: "Cuero marrón cosido a mano. 5 piezas. Sistema Boveda incluido." },
  { id: "a03", name: "Cortador Doble Hoja Acero", category: "Cortadores", price: 95, blurb: "Acero quirúrgico alemán. Resorte de retorno autocalibrado." },
  { id: "a04", name: "Cortador V Premium", category: "Cortadores", price: 78, blurb: "Para vitolas robustas. Concentra el sabor en el centro." },
  { id: "a05", name: "Encendedor Triple Llama", category: "Encendedores", price: 145, blurb: "Cuerpo en latón cepillado, recargable, llama azul a 1.300°C." },
  { id: "a06", name: "Encendedor Soft Flame", category: "Encendedores", price: 88, blurb: "Llama suave, no altera el perfil aromático." },
  { id: "a07", name: "Cenicero Mármol Negro", category: "Ceniceros", price: 165, blurb: "Mármol Marquina pulido. 4 reposos. Pieza de mesa." },
  { id: "a08", name: "Cenicero Cuero Cosido", category: "Ceniceros", price: 110, blurb: "Cuero curtido vegetal, base de fundición. Pieza portátil." },
  { id: "a09", name: "Estuche de Viaje 3", category: "Estuches", price: 130, blurb: "Cuero italiano. Capacidad 3 puros. Higrómetro digital incluido." },
  { id: "a10", name: "Estuche Diplomático", category: "Estuches", price: 280, blurb: "Doble compartimento. Cuero negro con costura dorada." },
  { id: "a11", name: "Sistema de Humidificación", category: "Humidores", price: 35, blurb: "Pack Boveda 72% — 4 sobres. Mantiene 70-72% HR." },
  { id: "a12", name: "Punzón de Bolsillo", category: "Cortadores", price: 42, blurb: "Inox titanizado. Apertura central limpia y precisa." },
];

export const ACCESSORY_CATEGORIES = [
  "Todos",
  "Humidores",
  "Cortadores",
  "Encendedores",
  "Ceniceros",
  "Estuches",
];

export const POSTS: Post[] = [
  { id: "b01", title: "El ritual completo: encender un habano como debe encenderse", category: "Guías", read: 7, date: "12 Abr 2026", excerpt: "Tomarse tres minutos al inicio cambia toda la experiencia. Los pasos que separan al iniciado del aficionado." },
  { id: "b02", title: "Vuelta Abajo: la geografía sagrada del tabaco", category: "Historia", read: 11, date: "02 Abr 2026", excerpt: "En una franja de tierra de Pinar del Río se produce la hoja más codiciada del planeta. Por qué allí y no en otro lugar." },
  { id: "b03", title: "Maridaje: cinco rones cubanos para cinco habanos clásicos", category: "Maridajes", read: 9, date: "24 Mar 2026", excerpt: "No todos los rones se llevan bien con todos los puros. Esta guía abre el camino del maridaje serio." },
  { id: "b04", title: "Cata privada Cohiba Behike — abril", category: "Eventos", read: 4, date: "18 Mar 2026", excerpt: "Doce asientos, una caja, una velada. Convocamos a nuestros socios a la próxima velada de cata." },
  { id: "b05", title: "Cómo leer una anilla: marca, fábrica y año en cinco símbolos", category: "Guías", read: 6, date: "08 Mar 2026", excerpt: "La anilla habla. Aprender a leerla es entender qué hay realmente entre los dedos." },
  { id: "b06", title: "La tradición torcedora dominicana: un siglo de manos", category: "Historia", read: 13, date: "20 Feb 2026", excerpt: "De La Aurora a Arturo Fuente, la República Dominicana convirtió la liadura en un arte familiar." },
  { id: "b07", title: "Por qué un buen humidor importa más que el puro mismo", category: "Guías", read: 8, date: "04 Feb 2026", excerpt: "Mantener 70/70 no es opcional. La diferencia entre un tabaco vivo y uno arruinado se mide en humedad." },
  { id: "b08", title: "Maridaje atípico: habano y mezcal", category: "Maridajes", read: 7, date: "15 Ene 2026", excerpt: "Una hipótesis aventurada que cada vez convence a más entendidos. Pruebas de campo." },
];

export const POST_CATEGORIES = ["Todos", "Guías", "Historia", "Maridajes", "Eventos"];

export const TESTIMONIALS: Testimonial[] = [
  { quote: "Es la única tabaquería donde te tratan como si llevaras décadas fumando, aunque sea tu primera vez.", author: "Daniel A.", role: "Socio desde 2019", city: "Madrid" },
  { quote: "La curaduría de Tabaco & Ron es seria. No te venden, te recomiendan. La diferencia se nota.", author: "Mariana V.", role: "Coleccionista", city: "Ciudad de México" },
  { quote: "Me ayudaron a montar mi humidor de cero. Cuatro años después sigo entrando con la misma confianza.", author: "Esteban R.", role: "Cliente frecuente", city: "La Habana" },
];
