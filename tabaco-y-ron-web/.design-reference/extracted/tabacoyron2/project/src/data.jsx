// Catálogo Tabaco & Ron — adaptado al manual oficial (Ciudad de Panamá · 22 años · 600+ ref)

const BRANDS = [
  { id: 'cohiba',        name: 'Cohiba',           origin: 'Cuba',                  founded: 1966, blurb: 'La cumbre del habano. Reservada en su día a los más altos diplomáticos.' },
  { id: 'romeo-julieta', name: 'Romeo y Julieta',  origin: 'Cuba',                  founded: 1875, blurb: 'Elegancia clásica con notas de cedro y café tostado.' },
  { id: 'trinidad',      name: 'Trinidad',         origin: 'Cuba',                  founded: 1969, blurb: 'Cuerpo medio, aromática y profundamente equilibrada.' },
  { id: 'partagas',      name: 'Partagás',         origin: 'Cuba',                  founded: 1845, blurb: 'Sabor especiado y maderoso. Ícono de fuerza y carácter cubano.' },
  { id: 'rocky-patel',   name: 'Rocky Patel',      origin: 'Honduras / Nicaragua',  founded: 1995, blurb: 'Blends boutique de gran intensidad y carácter.' },
  { id: 'arturo-fuente', name: 'Arturo Fuente',    origin: 'Rep. Dominicana',       founded: 1912, blurb: 'Dinastía familiar, reconocida por su consistencia legendaria.' },
  { id: 'la-aurora',     name: 'La Aurora',        origin: 'Rep. Dominicana',       founded: 1903, blurb: 'La primera fábrica dominicana. Tradición viva.' },
  { id: 'padron',        name: 'Padrón',           origin: 'Nicaragua',             founded: 1964, blurb: 'Liga nicaragüense — referencia de equilibrio y dulzor maderoso.' },
  { id: 'davidoff',      name: 'Davidoff',         origin: 'Rep. Dominicana / Suiza', founded: 1968, blurb: 'Refinamiento suizo aplicado a la hoja dominicana.' },
  { id: 'oliva',         name: 'Oliva',            origin: 'Nicaragua',             founded: 1995, blurb: 'Liga nicaragüense premiada — perfil cremoso y completo.' },
  { id: 'tabaco-ron',    name: 'Casa T&R',         origin: 'Panamá',                founded: 2003, blurb: 'Marca propia de la casa. Tabaco premium fabricado bajo estándar de la industria.' },
  { id: 'montecristo',   name: 'Montecristo',      origin: 'Cuba',                  founded: 1935, blurb: 'El habano más reconocido del mundo. Equilibrio y carácter clásico.' },
];

const VITOLAS = ['Robusto', 'Toro', 'Corona', 'Churchill', 'Petit Corona', 'Lonsdale', 'Double Corona', 'Belicoso'];
const INTENSIDADES = ['Suave', 'Medio', 'Medio–Fuerte', 'Fuerte'];

// Productos — referencias adaptadas, precios en USD (Balboa = USD en Panamá)
const PRODUCTS = [
  { id: 'p01', name: 'Behike 56',              brand: 'cohiba',        vitola: 'Robusto Extra', intensity: 'Fuerte',       price: 178, vintage: 2021, length: '166 mm', ring: '56', wrapper: 'Medio Tiempo',      note: 'Especiado, cacao, cuero. La cumbre de la línea Cohiba.' },
  { id: 'p02', name: 'Siglo VI Gran Reserva',  brand: 'cohiba',        vitola: 'Cañonazo',      intensity: 'Medio–Fuerte', price: 105, vintage: 2019, length: '150 mm', ring: '52', wrapper: 'Vuelta Abajo',      note: 'Dulce y maderoso, con final largo de cuero curado.' },
  { id: 'p03', name: 'Churchill Reserva',      brand: 'romeo-julieta', vitola: 'Churchill',     intensity: 'Medio',        price: 54,                length: '178 mm', ring: '47', wrapper: 'Cuba',              note: 'Café tostado, cedro, miel. Un clásico imperecedero.' },
  { id: 'p04', name: 'Wide Churchill',         brand: 'romeo-julieta', vitola: 'Toro',          intensity: 'Medio',        price: 42,                length: '130 mm', ring: '55', wrapper: 'Cuba',              note: 'Versión más robusta del Churchill, cremosa.' },
  { id: 'p05', name: 'Fundadores',             brand: 'trinidad',      vitola: 'Lonsdale',      intensity: 'Medio',        price: 62,                length: '192 mm', ring: '40', wrapper: 'Vuelta Abajo',      note: 'Aromas de frutos secos y vainilla, gran complejidad.' },
  { id: 'p06', name: 'Reyes',                  brand: 'trinidad',      vitola: 'Petit Corona',  intensity: 'Suave',        price: 26,                length: '110 mm', ring: '40', wrapper: 'Cuba',              note: 'Inicio elegante. Para una pausa breve.' },
  { id: 'p07', name: 'Serie D No.4',           brand: 'partagas',      vitola: 'Robusto',       intensity: 'Fuerte',       price: 34,                length: '124 mm', ring: '50', wrapper: 'Cuba',              note: 'Especiado, tierra mojada, café. Habano de carácter.' },
  { id: 'p08', name: 'Lusitania',              brand: 'partagas',      vitola: 'Double Corona', intensity: 'Medio–Fuerte', price: 52,                length: '194 mm', ring: '49', wrapper: 'Cuba',              note: 'Una sesión completa. Construcción impecable.' },
  { id: 'p09', name: 'Décimo Aniversario',     brand: 'rocky-patel',   vitola: 'Toro',          intensity: 'Fuerte',       price: 32,                length: '152 mm', ring: '50', wrapper: 'Honduras',          note: 'Madera, pimienta negra, café espresso.' },
  { id: 'p10', name: 'Vintage 1990',           brand: 'rocky-patel',   vitola: 'Robusto',       intensity: 'Medio–Fuerte', price: 28,                length: '127 mm', ring: '50', wrapper: 'Honduras',          note: 'Capa Habano añejada 12 años. Cremoso y profundo.' },
  { id: 'p11', name: 'Hemingway Signature',    brand: 'arturo-fuente', vitola: 'Belicoso',      intensity: 'Medio',        price: 38,                length: '152 mm', ring: '47', wrapper: 'Camerún',           note: 'Especiado, dulce, perfectamente equilibrado.' },
  { id: 'p12', name: 'Don Carlos No. 4',       brand: 'arturo-fuente', vitola: 'Petit Corona',  intensity: 'Medio',        price: 30,                length: '116 mm', ring: '43', wrapper: 'Camerún',           note: 'Homenaje al patriarca. Notas de cacao y nuez.' },
  { id: 'p13', name: '107 Maduro',             brand: 'la-aurora',     vitola: 'Robusto',       intensity: 'Fuerte',       price: 22,                length: '127 mm', ring: '50', wrapper: 'Brasil',            note: 'Chocolate amargo, café, pimienta dulce.' },
  { id: 'p14', name: 'Preferidos Sapphire',    brand: 'la-aurora',     vitola: 'Perfecto',      intensity: 'Medio',        price: 36,                length: '127 mm', ring: '48', wrapper: 'Ecuador',           note: 'Estilo perfecto. Edición de aniversario.' },
  { id: 'p15', name: '1964 Anniversary',       brand: 'padron',        vitola: 'Toro',          intensity: 'Medio–Fuerte', price: 28,                length: '152 mm', ring: '52', wrapper: 'Nicaragua',         note: 'Cremoso, café, cocoa. La referencia del 90 puntos.' },
  { id: 'p16', name: 'Family Reserve 50',      brand: 'padron',        vitola: 'Churchill',     intensity: 'Fuerte',       price: 75,                length: '171 mm', ring: '50', wrapper: 'Nicaragua',         note: 'Edición conmemorativa. Cinco años añejado.' },
  { id: 'p17', name: 'Robusto Intenso',        brand: 'davidoff',      vitola: 'Robusto',       intensity: 'Medio–Fuerte', price: 48,                length: '127 mm', ring: '50', wrapper: 'Ecuador',           note: 'Refinamiento Davidoff con cuerpo medio-fuerte.' },
  { id: 'p18', name: 'Serie V Melanio',        brand: 'oliva',         vitola: 'Toro',          intensity: 'Medio–Fuerte', price: 19,                length: '152 mm', ring: '52', wrapper: 'Sumatra',           note: 'Una de las relaciones precio/calidad más comentadas del catálogo.' },
  { id: 'p19', name: 'No.2 Edmundo',           brand: 'montecristo',   vitola: 'Belicoso',      intensity: 'Medio',        price: 44,                length: '156 mm', ring: '52', wrapper: 'Cuba',              note: 'Cremoso, dulce, con final largo. Clásico universal.' },
  { id: 'p20', name: 'Petit No. 2',            brand: 'montecristo',   vitola: 'Petit Corona',  intensity: 'Medio',        price: 22,                length: '113 mm', ring: '52', wrapper: 'Cuba',              note: 'La versión corta del clásico. Para tardes ocupadas.' },
  { id: 'p21', name: 'Edición Panamá',         brand: 'tabaco-ron',    vitola: 'Toro',          intensity: 'Medio–Fuerte', price: 16,                length: '152 mm', ring: '50', wrapper: 'Sumatra',           note: 'Marca propia. Liga nicaragüense con capa Sumatra.' },
  { id: 'p22', name: 'Casa Reserva 2003',      brand: 'tabaco-ron',    vitola: 'Robusto',       intensity: 'Medio',        price: 14,                length: '127 mm', ring: '50', wrapper: 'Ecuador',           note: 'Marca propia. Construido para la tarde panameña.' },
];

const ACCESSORIES = [
  { id: 'a01', name: 'Humidor Toscana',           category: 'Humidores',     price: 480, blurb: 'Cedro español, capacidad 50 piezas, higrómetro analógico.' },
  { id: 'a02', name: 'Humidor de Viaje Soto',     category: 'Humidores',     price: 220, blurb: 'Cuero marrón cosido a mano. 5 piezas. Sistema Boveda incluido.' },
  { id: 'a03', name: 'Cortador Doble Hoja Acero', category: 'Cortadores',    price: 95,  blurb: 'Acero quirúrgico alemán. Resorte de retorno autocalibrado.' },
  { id: 'a04', name: 'Cortador V Premium',        category: 'Cortadores',    price: 78,  blurb: 'Para vitolas robustas. Concentra el sabor en el centro.' },
  { id: 'a05', name: 'Encendedor Triple Llama',   category: 'Encendedores',  price: 145, blurb: 'Cuerpo en latón cepillado, recargable, llama azul a 1.300°C.' },
  { id: 'a06', name: 'Encendedor Soft Flame',     category: 'Encendedores',  price: 88,  blurb: 'Llama suave, no altera el perfil aromático.' },
  { id: 'a07', name: 'Cenicero Mármol Negro',     category: 'Ceniceros',     price: 165, blurb: 'Mármol Marquina pulido. 4 reposos. Pieza de mesa.' },
  { id: 'a08', name: 'Cenicero Cuero Cosido',     category: 'Ceniceros',     price: 110, blurb: 'Cuero curtido vegetal, base de fundición. Pieza portátil.' },
  { id: 'a09', name: 'Estuche de Viaje 3',        category: 'Estuches',      price: 130, blurb: 'Cuero italiano. Capacidad 3 puros. Higrómetro digital incluido.' },
  { id: 'a10', name: 'Estuche Diplomático',       category: 'Estuches',      price: 280, blurb: 'Doble compartimento. Cuero negro con costura dorada.' },
  { id: 'a11', name: 'Sistema de Humidificación', category: 'Humidores',     price: 35,  blurb: 'Pack Boveda 72% — 4 sobres. Mantiene 70-72% HR.' },
  { id: 'a12', name: 'Punzón de Bolsillo',        category: 'Cortadores',    price: 42,  blurb: 'Inox titanizado. Apertura central limpia y precisa.' },
];
const ACCESSORY_CATEGORIES = ['Todos', 'Humidores', 'Cortadores', 'Encendedores', 'Ceniceros', 'Estuches'];

const POSTS = [
  { id: 'b01', title: 'El ritual completo: encender un habano como debe encenderse',   category: 'Guías',     read: 7,  date: '12 Abr 2026', excerpt: 'Tomarse tres minutos al inicio cambia toda la experiencia. Los pasos que separan al iniciado del aficionado.' },
  { id: 'b02', title: 'Vuelta Abajo: la geografía sagrada del tabaco',                  category: 'Historia',  read: 11, date: '02 Abr 2026', excerpt: 'En una franja de tierra de Pinar del Río se produce la hoja más codiciada del planeta. Por qué allí y no en otro lugar.' },
  { id: 'b03', title: 'Maridaje: cinco rones del istmo para cinco habanos clásicos',    category: 'Maridajes', read: 9,  date: '24 Mar 2026', excerpt: 'No todos los rones se llevan bien con todos los puros. Esta guía abre el camino del maridaje serio en clave centroamericana.' },
  { id: 'b04', title: 'Cata privada Cohiba Behike — abril en la casa',                  category: 'Eventos',   read: 4,  date: '18 Mar 2026', excerpt: 'Doce asientos, una caja, una velada. Convocamos a nuestros socios a la próxima velada de cata en Ciudad de Panamá.' },
  { id: 'b05', title: 'Cómo leer una anilla: marca, fábrica y año en cinco símbolos',   category: 'Guías',     read: 6,  date: '08 Mar 2026', excerpt: 'La anilla habla. Aprender a leerla es entender qué hay realmente entre los dedos.' },
  { id: 'b06', title: 'La tradición torcedora dominicana: un siglo de manos',           category: 'Historia',  read: 13, date: '20 Feb 2026', excerpt: 'De La Aurora a Arturo Fuente, la República Dominicana convirtió la liadura en un arte familiar.' },
  { id: 'b07', title: 'Por qué un buen humidor importa más que el puro mismo',          category: 'Guías',     read: 8,  date: '04 Feb 2026', excerpt: 'Mantener 70/70 no es opcional. La diferencia entre un tabaco vivo y uno arruinado se mide en humedad.' },
  { id: 'b08', title: 'Maridaje atípico: habano y café panameño de altura',             category: 'Maridajes', read: 7,  date: '15 Ene 2026', excerpt: 'Boquete y Volcán dan algunos de los mejores cafés del mundo. Cómo se llevan con la hoja cubana.' },
];
const POST_CATEGORIES = ['Todos', 'Guías', 'Historia', 'Maridajes', 'Eventos'];

const TESTIMONIALS = [
  { quote: 'Es la única tabaquería de Panamá donde te tratan como si llevaras décadas fumando, aunque sea tu primera vez.', author: 'Daniel A.',     role: 'Socio desde 2019',  city: 'Ciudad de Panamá' },
  { quote: 'La curaduría de Tabaco & Ron es seria. No te venden, te recomiendan. La diferencia se nota.',                  author: 'Mariana V.',    role: 'Coleccionista',     city: 'Ciudad de México' },
  { quote: 'Me ayudaron a montar mi humidor de cero. Cuatro años después sigo entrando con la misma confianza.',           author: 'Roberto S.',    role: 'Cliente frecuente', city: 'Bogotá' },
  { quote: '600 referencias y aun así, cuando entras, te traen exactamente el puro que necesitabas. Sin exagerar.',         author: 'Luis Felipe G.', role: 'Aficionado',         city: 'Ciudad de Panamá' },
];

// Valores del manual oficial
const VALUES = [
  { k: 'Variedad',     v: '600+ referencias. La respuesta siempre está aquí.' },
  { k: 'Honestidad',   v: 'Decimos la verdad aunque no sea lo que el cliente quiere escuchar.' },
  { k: 'Lealtad',      v: 'Con nuestros clientes, nuestras marcas y nuestro equipo.' },
  { k: 'Garantía',     v: 'Cada producto que vendemos lo respaldamos con nuestra reputación.' },
  { k: 'Respeto',      v: 'Por la cultura del tabaco, por el cliente y por los maestros del oficio.' },
  { k: 'Lujo',         v: 'Premium no es caro. Premium es exacto, cuidado y excepcional.' },
  { k: 'Exclusividad', v: 'Lo que aquí se encuentra no se encuentra en otro lado.' },
  { k: 'Fidelidad',    v: '22 años construyendo relaciones que duran más que una caja de puros.' },
];

// Imágenes Unsplash temáticas (usando URLs directas)
const IMG_BASE = 'https://images.unsplash.com';
const IMG_LIB = {
  hero:     ['photo-1577931170527-cb5c8f39020c', 'photo-1637248990333-e66e027538f4', 'photo-1547652577-b4fe2f34d7ee'],
  cigar:    ['photo-1547652577-b4fe2f34d7ee', 'photo-1612659429508-b429d6b07ac1', 'photo-1612659429327-8f59b894959b'],
  smoke:    ['photo-1577931170527-cb5c8f39020c', 'photo-1577931061564-e746adda00ec'],
  lighter:  ['photo-1592505690387-24e71ca99897', 'photo-1577931170527-cb5c8f39020c'],
  whiskey:  ['photo-1637248990333-e66e027538f4', 'photo-1614846147847-7d12ca7866ed', 'photo-1613140506142-277c6241b858'],
  hands:    ['photo-1577931061564-e746adda00ec', 'photo-1592505690387-24e71ca99897'],
  box:      ['photo-1612659429508-b429d6b07ac1', 'photo-1610476362995-dff7b9a4e4c1'],
  ring:     ['photo-1603292503723-bb45c35b1903', 'photo-1520644204196-4a478546826f'],
  bottle:   ['photo-1614846147847-7d12ca7866ed', 'photo-1616189221504-67b2a569922a'],
  interior: ['photo-1610476362995-dff7b9a4e4c1', 'photo-1637248990333-e66e027538f4'],
  portrait: ['photo-1610561164062-fe4b65086c66', 'photo-1603292503723-bb45c35b1903'],
};
const IMG_POOL = [].concat(...Object.values(IMG_LIB));

function _hash(s) {
  let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function pickImg(seed, tag) {
  const pool = (tag && IMG_LIB[tag]) ? IMG_LIB[tag] : IMG_POOL;
  return pool[_hash(String(seed || 'default')) % pool.length];
}
function imgUrl(photoId, w = 1200) {
  return `${IMG_BASE}/${photoId}?fm=jpg&q=70&w=${w}&auto=format&fit=crop`;
}

window.TR = {
  BRANDS, VITOLAS, INTENSIDADES, PRODUCTS,
  ACCESSORIES, ACCESSORY_CATEGORIES,
  POSTS, POST_CATEGORIES,
  TESTIMONIALS, VALUES,
  pickImg, imgUrl,
};
