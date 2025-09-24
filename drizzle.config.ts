import type { Config } from "drizzle-kit";
import 'dotenv/config';

// 環境変数の確認とログ出力
const databaseUrl = "postgresql://postgres:EpthtJSRkXtdHkwMBVlXJkdIukqaVXMV@shinkansen.proxy.rlwy.net:46288/railway";
console.log("DATABASE_URL exists:", !!databaseUrl);
if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
}

export default {
    schema: "./src/lib/config/db/schema/*.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: databaseUrl,
    },
    verbose: true,
    strict: true,
} satisfies Config;