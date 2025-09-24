// src/lib/config/db/db.ts

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: "postgresql://postgres:EpthtJSRkXtdHkwMBVlXJkdIukqaVXMV@shinkansen.proxy.rlwy.net:46288/railway",
});

export const db = drizzle(pool);