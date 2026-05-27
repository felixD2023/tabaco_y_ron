import type { NextRequest } from "next/server";

import { handleApiError, jsonOk } from "@/lib/api/errors";
import { getCurrentUser } from "@/lib/auth/guard";
import { userToDTO } from "@/lib/api/serializers";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    return jsonOk(userToDTO(user));
  } catch (err) {
    return handleApiError(err);
  }
}
