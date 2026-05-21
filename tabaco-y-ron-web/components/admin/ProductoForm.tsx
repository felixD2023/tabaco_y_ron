"use client";

import { useMemo, useState } from "react";

import useProductosService from "@/hooks/use-productos-service";
import useUploadsService from "@/hooks/use-uploads-service";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  Fortaleza,
  Marca,
  Producto,
  ProductoCreate,
  ProductoImagenInput,
  ProductoUpdate,
} from "@/types/api";

import Combobox from "./Combobox";
import Modal from "./Modal";
import ProductoGallery, { type GalleryItem } from "./ProductoGallery";
import { useToast } from "./Toast";
import { AdminButton, AdminInput, AdminSelect, AdminTextarea, Field } from "./ui";

export const FORTALEZA_OPTIONS: { value: Fortaleza; label: string }[] = [
  { value: "suave", label: "Suave" },
  { value: "suave_medio", label: "Suave-Medio" },
  { value: "medio", label: "Medio" },
  { value: "medio_fuerte", label: "Medio-Fuerte" },
  { value: "fuerte", label: "Fuerte" },
];

type FormState = {
  nombre: string;
  descripcion: string;
  precio_individual: string;
  precio_caja: string;
  precio_descuento_individual: string;
  precio_descuento_caja: string;
  fortaleza: Fortaleza | "";
  tiempo_fumado: string;
  cepo: string;
  largo_mm: string;
  vitola: string;
  unidades_por_caja: string;
  rating: string;
  existencia: boolean;
  imagenes: GalleryItem[];
  marca_id: string;
  subcategoria_id: string;
};

function buildInitialImagenes(producto?: Producto | null): GalleryItem[] {
  if (producto?.imagenes && producto.imagenes.length > 0) {
    return [...producto.imagenes]
      .sort((a, b) => a.orden - b.orden)
      .filter((i): i is typeof i & { url: string } => Boolean(i.url))
      .map((i) => ({ kind: "uploaded" as const, url: i.url, tipo: i.tipo }));
  }
  // Producto antiguo con solo imagen principal: la sembramos como portada.
  if (producto?.imagen) {
    return [{ kind: "uploaded", url: producto.imagen, tipo: "detalle" }];
  }
  return [];
}

function buildInitial(producto?: Producto | null): FormState {
  return {
    nombre: producto?.nombre ?? "",
    descripcion: producto?.descripcion ?? "",
    precio_individual: producto?.precio_individual ?? "",
    precio_caja: producto?.precio_caja ?? "",
    precio_descuento_individual: producto?.precio_descuento_individual ?? "",
    precio_descuento_caja: producto?.precio_descuento_caja ?? "",
    fortaleza: producto?.fortaleza ?? "",
    tiempo_fumado: producto?.tiempo_fumado ?? "",
    cepo: producto?.cepo != null ? String(producto.cepo) : "",
    largo_mm: producto?.largo_mm != null ? String(producto.largo_mm) : "",
    vitola: producto?.vitola ?? "",
    unidades_por_caja:
      producto?.unidades_por_caja != null ? String(producto.unidades_por_caja) : "",
    rating: producto?.rating != null ? String(producto.rating) : "",
    existencia: producto?.existencia ?? true,
    imagenes: buildInitialImagenes(producto),
    marca_id: producto?.marca_id != null ? String(producto.marca_id) : "",
    subcategoria_id: producto?.subcategoria_id != null ? String(producto.subcategoria_id) : "",
  };
}

const decOrNull = (s: string): string | null => {
  const t = s.trim();
  return t === "" ? null : t;
};
const intOrNull = (s: string): number | null => {
  const t = s.trim();
  return t === "" ? null : Number(t);
};
// Un precio vacío o 0 (o no numérico) significa "sin ese precio" → null.
const priceOrNull = (s: string): string | null => {
  const t = s.trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isNaN(n) || n <= 0 ? null : t;
};

export default function ProductoForm({
  open,
  onClose,
  producto,
  marcas,
}: {
  open: boolean;
  onClose: () => void;
  producto?: Producto | null;
  marcas: Marca[];
}) {
  const isEdit = Boolean(producto);
  const toast = useToast();
  const { useCreate, useUpdate } = useProductosService();
  const { useUploadImagen } = useUploadsService();
  const create = useCreate();
  const update = useUpdate();
  const uploadImagen = useUploadImagen();

  const [form, setForm] = useState<FormState>(() => buildInitial(producto));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const selectedMarca = useMemo(
    () => marcas.find((m) => String(m.id) === form.marca_id),
    [marcas, form.marca_id],
  );
  const subcategorias = selectedMarca?.subcategorias ?? [];

  // Reglas de precio:
  //  · vacío o 0 → null (se elimina ese precio del producto).
  //  · un descuento solo se conserva si su precio base tiene valor; si no, el
  //    descuento también se anula.
  const resolvePrices = () => {
    const precio_individual = priceOrNull(form.precio_individual);
    const precio_caja = priceOrNull(form.precio_caja);
    return {
      precio_individual,
      precio_caja,
      precio_descuento_individual:
        precio_individual === null ? null : priceOrNull(form.precio_descuento_individual),
      precio_descuento_caja:
        precio_caja === null ? null : priceOrNull(form.precio_descuento_caja),
    };
  };

  const validate = (prices: ReturnType<typeof resolvePrices>): boolean => {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.marca_id) e.marca_id = "Selecciona una marca";
    if (!form.subcategoria_id) e.subcategoria_id = "Selecciona una subcategoría";
    if (prices.precio_individual === null && prices.precio_caja === null) {
      e.precio_individual = "Indica al menos un precio (individual o caja) mayor que 0";
    }
    if (form.rating.trim()) {
      const r = Number(form.rating);
      if (Number.isNaN(r) || r < 1 || r > 100) e.rating = "Entre 1 y 100";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Sube las imágenes pendientes (en orden) y devuelve la galería resuelta con
  // URLs públicas. Las ya subidas se conservan tal cual.
  const resolveImagenes = async (): Promise<ProductoImagenInput[]> => {
    const out: ProductoImagenInput[] = [];
    for (let idx = 0; idx < form.imagenes.length; idx++) {
      const img = form.imagenes[idx];
      const url = img.kind === "uploaded" ? img.url : (await uploadImagen.mutateAsync(img.file)).url;
      out.push({ url, tipo: img.tipo ?? "detalle", orden: idx });
    }
    return out;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const prices = resolvePrices();
    if (!validate(prices)) return;

    // Primero subimos las imágenes nuevas; solo si todo va bien guardamos.
    let imagenes: ProductoImagenInput[];
    setUploading(true);
    try {
      imagenes = await resolveImagenes();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "No se pudieron subir las imágenes"));
      return;
    } finally {
      setUploading(false);
    }

    const base = {
      nombre: form.nombre.trim(),
      descripcion: decOrNull(form.descripcion),
      ...prices,
      fortaleza: form.fortaleza === "" ? null : form.fortaleza,
      tiempo_fumado: decOrNull(form.tiempo_fumado),
      cepo: intOrNull(form.cepo),
      largo_mm: intOrNull(form.largo_mm),
      vitola: decOrNull(form.vitola),
      unidades_por_caja: intOrNull(form.unidades_por_caja),
      rating: intOrNull(form.rating),
      existencia: form.existencia,
      // La portada (primera imagen) sincroniza el campo `imagen` que usa el
      // storefront; la galería completa va en `imagenes` con su orden recalculado.
      imagen: imagenes[0]?.url ?? null,
      imagenes,
    };

    if (isEdit && producto) {
      const payload: ProductoUpdate = {
        ...base,
        marca_id: Number(form.marca_id),
        subcategoria_id: Number(form.subcategoria_id),
      };
      update.mutate(
        { id: producto.id, payload },
        {
          onSuccess: () => {
            toast.success("Producto actualizado");
            onClose();
          },
          onError: (err) => toast.error(getApiErrorMessage(err)),
        },
      );
    } else {
      const payload: ProductoCreate = {
        ...base,
        marca_id: Number(form.marca_id),
        subcategoria_id: Number(form.subcategoria_id),
      };
      create.mutate(payload, {
        onSuccess: () => {
          toast.success("Producto creado");
          onClose();
        },
        onError: (err) => toast.error(getApiErrorMessage(err)),
      });
    }
  };

  const submitting = uploading || create.isPending || update.isPending;

  // El descuento solo es editable si su precio base tiene un valor > 0.
  const hasIndividual = priceOrNull(form.precio_individual) !== null;
  const hasCaja = priceOrNull(form.precio_caja) !== null;

  // Al cambiar un precio base, si queda en vacío/0 limpiamos su descuento.
  const onBasePrice =
    (field: "precio_individual" | "precio_caja", discount: "precio_descuento_individual" | "precio_descuento_caja") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setForm((f) => ({
        ...f,
        [field]: v,
        ...(priceOrNull(v) === null ? { [discount]: "" } : {}),
      }));
    };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar producto" : "Nuevo producto"}
      size="xl"
      footer={
        <>
          <AdminButton variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </AdminButton>
          <AdminButton type="submit" form="producto-form" loading={submitting}>
            {isEdit ? "Guardar cambios" : "Crear producto"}
          </AdminButton>
        </>
      }
    >
      <form
        id="producto-form"
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]"
      >
        {/* Columna izquierda (más pequeña): galería de imágenes */}
        <div className="lg:border-r lg:border-line lg:pr-6">
          <ProductoGallery
            value={form.imagenes}
            onChange={(imagenes) => set("imagenes", imagenes)}
          />
        </div>

        {/* Columna derecha (más grande): datos del producto */}
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <Field label="Nombre" required error={errors.nombre}>
                <AdminInput value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
              </Field>
            </div>
            <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap pb-2.5 text-sm text-cream">
              <input
                type="checkbox"
                checked={form.existencia}
                onChange={(e) => set("existencia", e.target.checked)}
                className="h-4 w-4 accent-[var(--color-gold)]"
              />
              En existencia
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Marca" required error={errors.marca_id}>
            <Combobox
              placeholder="Buscar marca…"
              value={form.marca_id}
              options={marcas.map((m) => ({ value: String(m.id), label: m.nombre }))}
              onChange={(v) => {
                set("marca_id", v);
                set("subcategoria_id", ""); // resetea al cambiar de marca
              }}
            />
          </Field>
          <Field
            label="Subcategoría"
            required
            error={errors.subcategoria_id}
            hint={
              form.marca_id && subcategorias.length === 0
                ? "Esta marca no tiene subcategorías; crea una primero."
                : undefined
            }
          >
            <Combobox
              placeholder="Buscar subcategoría…"
              value={form.subcategoria_id}
              disabled={!form.marca_id || subcategorias.length === 0}
              options={subcategorias.map((s) => ({ value: String(s.id), label: s.nombre }))}
              onChange={(v) => set("subcategoria_id", v)}
            />
          </Field>
        </div>

        <Field label="Descripción">
          <AdminTextarea
            rows={3}
            value={form.descripcion}
            onChange={(e) => set("descripcion", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Precio individual ($)" error={errors.precio_individual}>
            <AdminInput
              type="number"
              step="0.01"
              min="0"
              value={form.precio_individual}
              onChange={onBasePrice("precio_individual", "precio_descuento_individual")}
            />
          </Field>
          <Field label="Precio caja ($)">
            <AdminInput
              type="number"
              step="0.01"
              min="0"
              value={form.precio_caja}
              onChange={onBasePrice("precio_caja", "precio_descuento_caja")}
            />
          </Field>
          <Field
            label="Descuento individual ($)"
            hint={hasIndividual ? undefined : "Establece primero el precio individual."}
          >
            <AdminInput
              type="number"
              step="0.01"
              min="0"
              disabled={!hasIndividual}
              value={form.precio_descuento_individual}
              onChange={(e) => set("precio_descuento_individual", e.target.value)}
            />
          </Field>
          <Field
            label="Descuento caja ($)"
            hint={hasCaja ? undefined : "Establece primero el precio de caja."}
          >
            <AdminInput
              type="number"
              step="0.01"
              min="0"
              disabled={!hasCaja}
              value={form.precio_descuento_caja}
              onChange={(e) => set("precio_descuento_caja", e.target.value)}
            />
          </Field>
        </div>

        <Field
          label="Unidades por caja"
          hint="Solo para productos vendidos por caja (nº de tabacos que contiene)."
        >
          <AdminInput
            type="number"
            min="1"
            step="1"
            className="sm:max-w-[220px]"
            value={form.unidades_por_caja}
            onChange={(e) => set("unidades_por_caja", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Fortaleza">
            <AdminSelect
              value={form.fortaleza}
              onChange={(e) => set("fortaleza", e.target.value as Fortaleza | "")}
            >
              <option value="">— Sin definir —</option>
              {FORTALEZA_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </AdminSelect>
          </Field>
          <Field label="Tiempo de fumado">
            <AdminInput
              value={form.tiempo_fumado}
              placeholder="p. ej. 45–60 min"
              onChange={(e) => set("tiempo_fumado", e.target.value)}
            />
          </Field>
          <Field label="Vitola">
            <AdminInput value={form.vitola} onChange={(e) => set("vitola", e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Cepo">
            <AdminInput
              type="number"
              min="0"
              value={form.cepo}
              onChange={(e) => set("cepo", e.target.value)}
            />
          </Field>
          <Field label="Largo (mm)">
            <AdminInput
              type="number"
              min="0"
              value={form.largo_mm}
              onChange={(e) => set("largo_mm", e.target.value)}
            />
          </Field>
          <Field label="Rating (1–100)" error={errors.rating}>
            <AdminInput
              type="number"
              min="1"
              max="100"
              value={form.rating}
              onChange={(e) => set("rating", e.target.value)}
            />
          </Field>
        </div>

        </div>
      </form>
    </Modal>
  );
}
