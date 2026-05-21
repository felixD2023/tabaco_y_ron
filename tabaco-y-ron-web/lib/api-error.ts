import { AxiosError } from "axios";

interface ApiErrorBody {
  detail?:
    | string
    | Array<{ msg?: string; loc?: (string | number)[] }>;
}

/**
 * Normaliza el `detail` que devuelve FastAPI (string para HTTPException, o lista
 * de errores de validación de Pydantic) a un mensaje legible en español.
 */
export function getApiErrorMessage(error: unknown, fallback = "Ocurrió un error"): string {
  if (error instanceof AxiosError) {
    const detail = (error.response?.data as ApiErrorBody | undefined)?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      const msgs = detail
        .map((d) => {
          const field = Array.isArray(d.loc) ? d.loc.filter((p) => p !== "body").join(".") : "";
          return field ? `${field}: ${d.msg ?? ""}` : d.msg ?? "";
        })
        .filter(Boolean);
      if (msgs.length) return msgs.join(" · ");
    }
    if (error.code === "ERR_NETWORK") return "No se pudo conectar con el servidor";
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
