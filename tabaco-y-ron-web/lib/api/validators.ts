import { z } from "zod";

export const fortalezaSchema = z.enum([
  "suave",
  "medio",
  "fuerte",
  "suave_medio",
  "medio_fuerte",
]);
export const userRoleSchema = z.enum(["admin", "gestor"]);

// Precios llegan como string (JSON-safe), Numeric en Postgres.
const decimalString = z
  .union([z.string(), z.number()])
  .transform((v) => (typeof v === "number" ? v.toString() : v))
  .refine((v) => /^\d+(\.\d+)?$/.test(v), { message: "Decimal inválido" })
  .refine((v) => Number(v) >= 0, { message: "Debe ser >= 0" });

const optDecimal = decimalString.nullable().optional();
const optStr = (max: number) => z.string().min(1).max(max).nullable().optional();
const optText = z.string().nullable().optional();
const optInt = z.number().int().nonnegative().nullable().optional();
const optPositiveInt = z.number().int().positive().nullable().optional();

// ───── Usuarios ─────
export const userCreateSchema = z.object({
  nombre: z.string().min(1).max(120),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  role: userRoleSchema.default("gestor"),
});

export const userUpdateSchema = z.object({
  nombre: z.string().min(1).max(120).optional(),
  email: z.string().email().max(255).optional(),
  role: userRoleSchema.optional(),
  password: z.string().min(8).max(128).optional(),
});

// ───── Marcas ─────
export const marcaCreateSchema = z.object({
  nombre: z.string().min(1).max(120),
  imagen: z.string().max(500).nullable().optional(),
});

export const marcaUpdateSchema = z.object({
  nombre: z.string().min(1).max(120).optional(),
  imagen: z.string().max(500).nullable().optional(),
});

// ───── Subcategorías ─────
export const subcategoriaCreateSchema = z.object({
  nombre: z.string().min(1).max(120),
  marca_id: z.number().int().positive(),
});

export const subcategoriaUpdateSchema = z.object({
  nombre: z.string().min(1).max(120).optional(),
  marca_id: z.number().int().positive().optional(),
});

// ───── Productos ─────
const productoImagenInput = z.object({
  url: z.string().max(500).nullable().optional(),
  tipo: z.string().max(40).default("detalle"),
  orden: z.number().int().nonnegative().default(0),
});

const productoBaseFields = {
  nombre: z.string().min(1).max(200),
  descripcion: optText,
  precio_individual: optDecimal,
  precio_caja: optDecimal,
  precio_descuento_individual: optDecimal,
  precio_descuento_caja: optDecimal,
  fortaleza: fortalezaSchema.nullable().optional(),
  tiempo_fumado: optStr(60),
  cepo: optInt,
  largo_mm: optInt,
  vitola: optStr(60),
  unidades_por_caja: optPositiveInt,
  rating: z.number().int().min(1).max(100).nullable().optional(),
  existencia: z.boolean().default(true),
  disponible_caja: z.boolean().default(true),
  disponible_individual: z.boolean().default(true),
  imagen: z.string().max(500).nullable().optional(),
};

export const productoCreateSchema = z
  .object({
    ...productoBaseFields,
    marca_id: z.number().int().positive(),
    subcategoria_id: z.number().int().positive().nullable().optional(),
    imagenes: z.array(productoImagenInput).default([]),
  })
  .refine(
    (p) => p.precio_individual != null || p.precio_caja != null,
    { message: "Debe especificarse al menos precio_individual o precio_caja" },
  )
  .refine(
    (p) => !(p.precio_descuento_individual != null && p.precio_individual == null),
    { message: "precio_descuento_individual requiere precio_individual" },
  )
  .refine(
    (p) => !(p.precio_descuento_caja != null && p.precio_caja == null),
    { message: "precio_descuento_caja requiere precio_caja" },
  );

export const productoUpdateSchema = z.object({
  nombre: z.string().min(1).max(200).optional(),
  descripcion: optText,
  precio_individual: optDecimal,
  precio_caja: optDecimal,
  precio_descuento_individual: optDecimal,
  precio_descuento_caja: optDecimal,
  fortaleza: fortalezaSchema.nullable().optional(),
  tiempo_fumado: optStr(60),
  cepo: optInt,
  largo_mm: optInt,
  vitola: optStr(60),
  unidades_por_caja: optPositiveInt,
  rating: z.number().int().min(1).max(100).nullable().optional(),
  existencia: z.boolean().optional(),
  disponible_caja: z.boolean().optional(),
  disponible_individual: z.boolean().optional(),
  imagen: z.string().max(500).nullable().optional(),
  marca_id: z.number().int().positive().optional(),
  subcategoria_id: z.number().int().positive().nullable().optional(),
  imagenes: z.array(productoImagenInput).optional(),
});

export type ProductoCreateInput = z.infer<typeof productoCreateSchema>;
export type ProductoUpdateInput = z.infer<typeof productoUpdateSchema>;

// ───── Valoraciones ─────
export const valoracionCreateSchema = z.object({
  rating: z.number().int().min(1).max(5),
  email: z.string().email().max(255),
  valoracion: z.string().min(1),
  producto_id: z.number().int().positive(),
});
