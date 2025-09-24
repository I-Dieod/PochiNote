import { defineConfig } from "drizzle-kit";

// 環境変数の確認とログ出力
const databaseUrl = process.env.DATABASE_URL;
console.log("DATABASE_URL exists:", !!databaseUrl);
if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
}

export default defineConfig({
    schema: "./src/lib/config/db/schema/*.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: databaseUrl,
    },
    verbose: true,
    strict: true,
});