import { z } from "zod";
import type { NextRequest } from "next/server";

import { handleApiError, jsonOk } from "@/lib/api/errors";
import { marcaCreateSchema } from "@/lib/api/validators";
import { requireAdminOrGestor } from "@/lib/auth/guard";
import { bulkCreateMarcas } from "../route";

const bodySchema = z.array(marcaCreateSchema).min(1);

export async function POST(req: NextRequest) {
  try {
    await requireAdminOrGestor(req);
    const body = bodySchema.parse(await req.json());
    const dtos = await bulkCreateMarcas(body);
    return jsonOk(dtos, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
