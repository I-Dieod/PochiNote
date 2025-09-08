import 'dotenv/config';

export default {
    schema: './src/lib/config/db/schema/*.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DB_URL!,
    },
} as const;
