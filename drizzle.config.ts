import { defineConfig } from "drizzle-kit";

// 環境変数の確認とログ出力
const databaseUrl = process.env.PUBLIC_DATABASE_URL;
console.log("PUBLIC_DATABASE_URL exists:", !!databaseUrl);
if (!databaseUrl) {
    throw new Error("PUBLIC_DATABASE_URL environment variable is required");
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