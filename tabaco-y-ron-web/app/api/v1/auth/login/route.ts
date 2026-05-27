import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { Unauthorized, handleApiError, jsonOk } from "@/lib/api/errors";
import { createAccessToken } from "@/lib/auth/jwt";
import { verifyPassword } from "@/lib/auth/password";
import { db, schema } from "@/lib/db/client";
import { roleFromDb } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  try {
    const ctype = req.headers.get("content-type") ?? "";
    let username: string | undefined;
    let password: string | undefined;

    if (ctype.includes("application/x-www-form-urlencoded") || ctype.includes("multipart/form-data")) {
      const form = await req.formData();
      username = form.get("username")?.toString();
      password = form.get("password")?.toString();
    } else {
      const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
      username = typeof body.username === "string" ? body.username : undefined;
      password = typeof body.password === "string" ? body.password : undefined;
    }

    if (!username || !password) {
      throw Unauthorized("Email o contraseña incorrectos");
    }

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, username))
      .limit(1);

    if (!user || !(await verifyPassword(password, user.hashedPassword))) {
      throw Unauthorized("Email o contraseña incorrectos");
    }

    const token = await createAccessToken(user.id, { role: roleFromDb(user.role) });
    return jsonOk({ access_token: token, token_type: "bearer" });
  } catch (err) {
    return handleApiError(err);
  }
}
