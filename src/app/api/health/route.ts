// src/app/api/health/route.ts

import { db } from '@/lib/config/db/db';

export async function GET() {
    try {
        // データベース接続確認
        await db.execute('SELECT 1');

        return Response.json({
            status: 'ok',
            database: 'connected',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
            port: process.env.PORT
        });

    } catch (error) {
        console.error('Health check failed:', error);

        return Response.json(
            {
                status: 'error',
                database: 'disconnected',
                message: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}