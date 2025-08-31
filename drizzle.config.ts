import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/lib/config/db/schema/*.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DB_URL!,
    },
});
