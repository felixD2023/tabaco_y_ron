import { relations } from "drizzle-orm";
import {
  boolean,
  check,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Los enums de Postgres se crearon con SQLAlchemy usando los *nombres* de la
// enum class (mayúsculas). El contrato JSON externo usa minúsculas — la
// conversión ida/vuelta se hace en serializers/validators.
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "GESTOR"]);
export const fortalezaEnum = pgEnum("fortaleza", [
  "SUAVE",
  "MEDIO",
  "FUERTE",
  "SUAVE_MEDIO",
  "MEDIO_FUERTE",
]);

export type DbUserRole = (typeof userRoleEnum.enumValues)[number];
export type DbFortaleza = (typeof fortalezaEnum.enumValues)[number];

export type ApiUserRole = "admin" | "gestor";
export type ApiFortaleza = "suave" | "medio" | "fuerte" | "suave_medio" | "medio_fuerte";

export const roleToDb = (r: ApiUserRole): DbUserRole => r.toUpperCase() as DbUserRole;
export const roleFromDb = (r: DbUserRole): ApiUserRole => r.toLowerCase() as ApiUserRole;
export const fortalezaToDb = (f: ApiFortaleza): DbFortaleza =>
  f.toUpperCase() as DbFortaleza;
export const fortalezaFromDb = (f: DbFortaleza): ApiFortaleza =>
  f.toLowerCase() as ApiFortaleza;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  hashedPassword: varchar("hashed_password", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull().default("GESTOR"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const marcas = pgTable("marcas", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 120 }).notNull().unique(),
  imagen: varchar("imagen", { length: 500 }),
});

export const subcategorias = pgTable(
  "subcategorias",
  {
    id: serial("id").primaryKey(),
    nombre: varchar("nombre", { length: 120 }).notNull(),
    marcaId: integer("marca_id")
      .notNull()
      .references(() => marcas.id, { onDelete: "cascade" }),
  },
  (t) => [unique("uq_subcategoria_marca_nombre").on(t.marcaId, t.nombre)],
);

export const productos = pgTable(
  "productos",
  {
    id: serial("id").primaryKey(),
    nombre: varchar("nombre", { length: 200 }).notNull(),
    descripcion: text("descripcion"),
    precioIndividual: numeric("precio_individual", { precision: 10, scale: 2 }),
    precioCaja: numeric("precio_caja", { precision: 10, scale: 2 }),
    precioDescuentoIndividual: numeric("precio_descuento_individual", { precision: 10, scale: 2 }),
    precioDescuentoCaja: numeric("precio_descuento_caja", { precision: 10, scale: 2 }),
    fortaleza: fortalezaEnum("fortaleza"),
    tiempoFumado: varchar("tiempo_fumado", { length: 60 }),
    cepo: integer("cepo"),
    largoMm: integer("largo_mm"),
    vitola: varchar("vitola", { length: 60 }),
    unidadesPorCaja: integer("unidades_por_caja"),
    rating: integer("rating"),
    existencia: boolean("existencia").notNull().default(true),
    disponibleCaja: boolean("disponible_caja").notNull().default(true),
    disponibleIndividual: boolean("disponible_individual").notNull().default(true),
    imagen: varchar("imagen", { length: 500 }),
    marcaId: integer("marca_id")
      .notNull()
      .references(() => marcas.id, { onDelete: "cascade" }),
    subcategoriaId: integer("subcategoria_id").references(() => subcategorias.id, {
      onDelete: "restrict",
    }),
  },
  (t) => [check("ck_producto_rating_range", sql`${t.rating} BETWEEN 1 AND 100`)],
);

export const productoImagenes = pgTable("producto_imagenes", {
  id: serial("id").primaryKey(),
  productoId: integer("producto_id")
    .notNull()
    .references(() => productos.id, { onDelete: "cascade" }),
  url: varchar("url", { length: 500 }),
  tipo: varchar("tipo", { length: 40 }).notNull().default("detalle"),
  orden: integer("orden").notNull().default(0),
});

export const valoraciones = pgTable(
  "valoraciones",
  {
    id: serial("id").primaryKey(),
    rating: integer("rating").notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    valoracion: text("valoracion").notNull(),
    productoId: integer("producto_id")
      .notNull()
      .references(() => productos.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [check("ck_valoracion_rating_range", sql`${t.rating} BETWEEN 1 AND 5`)],
);

export const marcasRelations = relations(marcas, ({ many }) => ({
  subcategorias: many(subcategorias),
  productos: many(productos),
}));

export const subcategoriasRelations = relations(subcategorias, ({ one, many }) => ({
  marca: one(marcas, { fields: [subcategorias.marcaId], references: [marcas.id] }),
  productos: many(productos),
}));

export const productosRelations = relations(productos, ({ one, many }) => ({
  marca: one(marcas, { fields: [productos.marcaId], references: [marcas.id] }),
  subcategoria: one(subcategorias, {
    fields: [productos.subcategoriaId],
    references: [subcategorias.id],
  }),
  imagenes: many(productoImagenes),
  valoraciones: many(valoraciones),
}));

export const productoImagenesRelations = relations(productoImagenes, ({ one }) => ({
  producto: one(productos, {
    fields: [productoImagenes.productoId],
    references: [productos.id],
  }),
}));

export const valoracionesRelations = relations(valoraciones, ({ one }) => ({
  producto: one(productos, {
    fields: [valoraciones.productoId],
    references: [productos.id],
  }),
}));

export type UserRow = typeof users.$inferSelect;
export type MarcaRow = typeof marcas.$inferSelect;
export type SubcategoriaRow = typeof subcategorias.$inferSelect;
export type ProductoRow = typeof productos.$inferSelect;
export type ProductoImagenRow = typeof productoImagenes.$inferSelect;
export type ValoracionRow = typeof valoraciones.$inferSelect;
