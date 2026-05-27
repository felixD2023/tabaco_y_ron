/**
 * Crea (o actualiza) un usuario del panel de administración.
 * Idempotente por email. Equivalente al antiguo `scripts/seed_admin_user.py`.
 *
 * Uso:
 *   pnpm tsx scripts/seed-admin.ts --email admin@tabacoyron.com --password "Secreta123" --nombre "Admin" --role admin
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { eq } from "drizzle-orm";

import { hashPassword } from "@/lib/auth/password";
import { db, schema } from "@/lib/db/client";
import { roleToDb } from "@/lib/db/schema";

type Args = {
  email: string;
  password?: string;
  nombre: string;
  role: "admin" | "gestor";
};

function parseArgs(argv: string[]): Args {
  const out: Record<string, string> = { nombre: "Administrador", role: "admin" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const val = argv[i + 1];
    if (val == null || val.startsWith("--")) continue;
    out[key] = val;
    i++;
  }
  if (!out.email) {
    throw new Error("--email es obligatorio");
  }
  if (out.role !== "admin" && out.role !== "gestor") {
    throw new Error("--role debe ser 'admin' o 'gestor'");
  }
  return {
    email: out.email,
    password: out.password,
    nombre: out.nombre,
    role: out.role as "admin" | "gestor",
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const [existing] = await db.select().from(schema.users).where(eq(schema.users.email, args.email)).limit(1);

  if (existing) {
    const patch: Partial<typeof schema.users.$inferInsert> = { nombre: args.nombre, role: roleToDb(args.role) };
    if (args.password) patch.hashedPassword = await hashPassword(args.password);
    await db.update(schema.users).set(patch).where(eq(schema.users.id, existing.id));
    console.log(`[OK] Usuario actualizado: ${args.email} (rol=${args.role})`);
    return;
  }

  if (!args.password) {
    console.error("[ABORTAR] Para crear un usuario nuevo, --password es obligatorio.");
    process.exit(1);
  }

  await db.insert(schema.users).values({
    nombre: args.nombre,
    email: args.email,
    hashedPassword: await hashPassword(args.password),
    role: roleToDb(args.role),
  });
  console.log(`[OK] Usuario creado: ${args.email} (rol=${args.role})`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
