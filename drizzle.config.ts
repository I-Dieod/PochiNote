import 'dotenv/config';

export default {
    schema: './src/lib/config/db/schema/*.ts',
    dialect: 'postgresql',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL,
    },
} as const;
