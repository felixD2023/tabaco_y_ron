import {
  fortalezaFromDb,
  roleFromDb,
  type MarcaRow,
  type ProductoImagenRow,
  type ProductoRow,
  type SubcategoriaRow,
  type UserRow,
  type ValoracionRow,
} from "@/lib/db/schema";

export type UserDTO = {
  id: number;
  nombre: string;
  email: string;
  role: "admin" | "gestor";
  created_at: string;
};

export const userToDTO = (u: UserRow): UserDTO => ({
  id: u.id,
  nombre: u.nombre,
  email: u.email,
  role: roleFromDb(u.role),
  created_at: u.createdAt.toISOString(),
});

export type SubcategoriaDTO = {
  id: number;
  nombre: string;
  marca_id: number;
};

export const subcategoriaToDTO = (s: SubcategoriaRow): SubcategoriaDTO => ({
  id: s.id,
  nombre: s.nombre,
  marca_id: s.marcaId,
});

export type MarcaDTO = {
  id: number;
  nombre: string;
  imagen: string | null;
  subcategorias: SubcategoriaDTO[];
  total_productos: number;
};

export const marcaToDTO = (
  m: MarcaRow,
  subs: SubcategoriaRow[],
  totalProductos: number,
): MarcaDTO => ({
  id: m.id,
  nombre: m.nombre,
  imagen: m.imagen,
  subcategorias: subs.map(subcategoriaToDTO),
  total_productos: totalProductos,
});

export type ProductoImagenDTO = {
  id: number;
  url: string | null;
  tipo: string;
  orden: number;
};

export const productoImagenToDTO = (i: ProductoImagenRow): ProductoImagenDTO => ({
  id: i.id,
  url: i.url,
  tipo: i.tipo,
  orden: i.orden,
});

export type ProductoDTO = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_individual: string | null;
  precio_caja: string | null;
  precio_descuento_individual: string | null;
  precio_descuento_caja: string | null;
  fortaleza: string | null;
  tiempo_fumado: string | null;
  cepo: number | null;
  largo_mm: number | null;
  vitola: string | null;
  unidades_por_caja: number | null;
  rating: number | null;
  existencia: boolean;
  disponible_caja: boolean;
  disponible_individual: boolean;
  imagen: string | null;
  marca_id: number;
  subcategoria_id: number | null;
  imagenes: ProductoImagenDTO[];
};

export const productoToDTO = (
  p: ProductoRow,
  imagenes: ProductoImagenRow[],
): ProductoDTO => ({
  id: p.id,
  nombre: p.nombre,
  descripcion: p.descripcion,
  precio_individual: p.precioIndividual,
  precio_caja: p.precioCaja,
  precio_descuento_individual: p.precioDescuentoIndividual,
  precio_descuento_caja: p.precioDescuentoCaja,
  fortaleza: p.fortaleza ? fortalezaFromDb(p.fortaleza) : null,
  tiempo_fumado: p.tiempoFumado,
  cepo: p.cepo,
  largo_mm: p.largoMm,
  vitola: p.vitola,
  unidades_por_caja: p.unidadesPorCaja,
  rating: p.rating,
  existencia: p.existencia,
  disponible_caja: p.disponibleCaja,
  disponible_individual: p.disponibleIndividual,
  imagen: p.imagen,
  marca_id: p.marcaId,
  subcategoria_id: p.subcategoriaId,
  imagenes: imagenes
    .slice()
    .sort((a, b) => a.orden - b.orden)
    .map(productoImagenToDTO),
});

export type ValoracionMiniDTO = {
  id: number;
  rating: number;
  email: string;
  valoracion: string;
  created_at: string;
};

export const valoracionMiniToDTO = (v: ValoracionRow): ValoracionMiniDTO => ({
  id: v.id,
  rating: v.rating,
  email: v.email,
  valoracion: v.valoracion,
  created_at: v.createdAt.toISOString(),
});

export type ValoracionDTO = ValoracionMiniDTO & { producto_id: number };

export const valoracionToDTO = (v: ValoracionRow): ValoracionDTO => ({
  ...valoracionMiniToDTO(v),
  producto_id: v.productoId,
});

export type ProductoDetailDTO = ProductoDTO & { valoraciones: ValoracionMiniDTO[] };
