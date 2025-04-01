import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@db/schema";

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle> | undefined;
};

const connectionString = process.env.DATABASE_URL!;

export const db =
  globalForDb.db ??
  drizzle(
    postgres(connectionString, {
      max: 10,
    }),
    { schema }
  );

if (process.env.NODE_ENV !== "production") globalForDb.db = db;

export default db;
