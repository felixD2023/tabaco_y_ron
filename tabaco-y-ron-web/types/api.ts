export type UserRole = "admin" | "gestor";

export type Fortaleza = "suave" | "medio" | "fuerte" | "suave_medio" | "medio_fuerte";

export interface Token {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface UserCreate {
  nombre: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UserUpdate {
  nombre?: string;
  email?: string;
  role?: UserRole;
  password?: string;
}

export interface Subcategoria {
  id: number;
  nombre: string;
  marca_id: number;
}

export interface SubcategoriaCreate {
  nombre: string;
  marca_id: number;
}

export interface SubcategoriaUpdate {
  nombre?: string;
  marca_id?: number;
}

export interface Marca {
  id: number;
  nombre: string;
  imagen: string | null;
  subcategorias: Subcategoria[];
  total_productos: number;
}

export interface MarcaCreate {
  nombre: string;
  imagen?: string | null;
}

export interface MarcaUpdate {
  nombre?: string;
  imagen?: string | null;
}

export interface ProductoBase {
  nombre: string;
  descripcion?: string | null;
  precio_individual?: string | null;
  precio_caja?: string | null;
  precio_descuento_individual?: string | null;
  precio_descuento_caja?: string | null;
  fortaleza?: Fortaleza | null;
  tiempo_fumado?: string | null;
  cepo?: number | null;
  largo_mm?: number | null;
  vitola?: string | null;
  unidades_por_caja?: number | null;
  rating?: number | null;
  existencia?: boolean;
  imagen?: string | null;
}

export interface ProductoImagen {
  id: number;
  url: string | null;
  tipo: string; // 'tabaco_suelto' | 'detalle' | ...
  orden: number;
}

export interface Producto extends ProductoBase {
  id: number;
  marca_id: number;
  subcategoria_id: number | null;
  imagenes: ProductoImagen[];
}

export interface ValoracionMini {
  id: number;
  rating: number;
  email: string;
  valoracion: string;
  created_at: string;
}

export interface ProductoDetail extends Producto {
  valoraciones: ValoracionMini[];
}

export interface ProductoImagenInput {
  url: string | null;
  tipo?: string; // 'tabaco_suelto' | 'detalle' | ...
  orden?: number;
}

export interface ProductoCreate extends ProductoBase {
  marca_id: number;
  subcategoria_id: number | null;
  imagenes?: ProductoImagenInput[];
}

export interface ProductoUpdate extends Partial<ProductoBase> {
  marca_id?: number;
  subcategoria_id?: number;
  // Si se incluye (aunque sea []), reemplaza por completo la galería.
  imagenes?: ProductoImagenInput[];
}

export type ProductoSort = "name" | "precio_asc" | "precio_desc" | "rating_desc";

export interface ProductosListParams {
  page?: number;
  page_size?: number;
  sort?: ProductoSort;
  q?: string;
  marca_id?: number[];
  subcategoria_id?: number[];
  fortaleza?: Fortaleza[];
  precio_min?: number;
  precio_max?: number;
  cepo_min?: number;
  cepo_max?: number;
  largo_min?: number;
  largo_max?: number;
  rating_min?: number;
  solo_existentes?: boolean;
}

export interface ProductoListResponse {
  items: Producto[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface Valoracion {
  id: number;
  rating: number;
  email: string;
  valoracion: string;
  producto_id: number;
  created_at: string;
}

export interface ValoracionCreate {
  rating: number;
  email: string;
  valoracion: string;
  producto_id: number;
}

export interface UploadImagenResponse {
  filename: string;
  url: string;
}
