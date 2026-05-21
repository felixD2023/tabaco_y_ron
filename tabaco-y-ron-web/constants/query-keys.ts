export const QUERY_KEYS = {
  // auth / users
  me: ["me"] as const,
  users: ["users"] as const,
  user: (id: number) => ["users", id] as const,

  // marcas
  marcas: ["marcas"] as const,
  marca: (id: number) => ["marcas", id] as const,

  // subcategorias
  subcategorias: (marcaId?: number) =>
    marcaId === undefined ? (["subcategorias"] as const) : (["subcategorias", { marcaId }] as const),
  subcategoria: (id: number) => ["subcategorias", id] as const,

  // productos
  productos: (params?: Record<string, unknown>) =>
    params && Object.keys(params).length > 0
      ? (["productos", params] as const)
      : (["productos"] as const),
  producto: (id: number) => ["productos", id] as const,

  // valoraciones
  valoraciones: (productoId?: number) =>
    productoId === undefined
      ? (["valoraciones"] as const)
      : (["valoraciones", { productoId }] as const),
};
