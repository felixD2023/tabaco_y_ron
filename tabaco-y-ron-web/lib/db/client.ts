import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL no está definida (revisa .env.local)");
}

declare global {
  // eslint-disable-next-line no-var
  var __pg_client__: ReturnType<typeof postgres> | undefined;
}

const client =
  globalThis.__pg_client__ ??
  postgres(connectionString, { prepare: false, max: 10 });

if (process.env.NODE_ENV !== "production") {
  globalThis.__pg_client__ = client;
}

export const db = drizzle(client, { schema });
export { schema };
