import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ApiDetailItem = {
  msg: string;
  loc: (string | number)[];
  type?: string;
};

export type ApiErrorBody = { detail: string | ApiDetailItem[] };

export class HttpError extends Error {
  status: number;
  detail: string | ApiDetailItem[];
  headers?: Record<string, string>;

  constructor(
    status: number,
    detail: string | ApiDetailItem[],
    headers?: Record<string, string>,
  ) {
    super(typeof detail === "string" ? detail : "ValidationError");
    this.status = status;
    this.detail = detail;
    this.headers = headers;
  }
}

export const httpError = (status: number, detail: string) => new HttpError(status, detail);

export const NotFound = (msg = "No encontrado") => new HttpError(404, msg);
export const BadRequest = (msg: string) => new HttpError(400, msg);
export const Conflict = (msg: string) => new HttpError(409, msg);
export const Unauthorized = (msg = "No se pudieron validar las credenciales") =>
  new HttpError(401, msg, { "WWW-Authenticate": "Bearer" });
export const Forbidden = (msg = "No tienes permisos para esta acción") =>
  new HttpError(403, msg);

function zodToDetail(err: ZodError): ApiDetailItem[] {
  return err.issues.map((issue) => ({
    type: issue.code,
    loc: ["body", ...issue.path.map((p) => (typeof p === "symbol" ? String(p) : (p as string | number)))],
    msg: issue.message,
  }));
}

export function handleApiError(err: unknown): NextResponse<ApiErrorBody> {
  if (err instanceof HttpError) {
    return NextResponse.json({ detail: err.detail }, { status: err.status, headers: err.headers });
  }
  if (err instanceof ZodError) {
    return NextResponse.json({ detail: zodToDetail(err) }, { status: 422 });
  }
  console.error("[api] unhandled error", err);
  return NextResponse.json({ detail: "Internal server error" }, { status: 500 });
}

export function jsonOk<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}
