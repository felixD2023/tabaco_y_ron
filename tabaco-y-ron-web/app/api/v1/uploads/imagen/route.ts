import type { NextRequest } from "next/server";

import { BadRequest, handleApiError, jsonOk } from "@/lib/api/errors";
import { saveUploadedImage } from "@/lib/api/uploads";
import { requireAdminOrGestor } from "@/lib/auth/guard";

export async function POST(req: NextRequest) {
  try {
    await requireAdminOrGestor(req);
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw BadRequest("Campo 'file' requerido");
    const result = await saveUploadedImage(file);
    return jsonOk(result, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
