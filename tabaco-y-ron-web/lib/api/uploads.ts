import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { BadRequest, httpError } from "./errors";

export const UPLOAD_DIR = path.join(process.cwd(), "public", "static", "uploads");
export const PUBLIC_BASE = "/static/uploads";

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const MAX_BYTES = 5 * 1024 * 1024;

function tokenUrlSafe(bytes: number): string {
  return randomBytes(bytes).toString("base64url");
}

export async function saveUploadedImage(file: File): Promise<{ filename: string; url: string }> {
  const ext = ALLOWED[file.type];
  if (!ext) {
    throw httpError(
      415,
      `Tipo no soportado. Permitidos: ${Object.keys(ALLOWED).sort().join(", ")}`,
    );
  }
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.byteLength > MAX_BYTES) {
    throw httpError(413, "Imagen demasiado grande (>5MB)");
  }
  if (buf.byteLength === 0) throw BadRequest("Archivo vacío");

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${tokenUrlSafe(16)}${ext}`;
  await writeFile(path.join(UPLOAD_DIR, filename), buf);

  return { filename, url: `${PUBLIC_BASE}/${filename}` };
}
