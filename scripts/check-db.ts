// scripts/check-db.ts

import { db } from '../src/lib/config/db/db';

async function checkDatabase() {
    try {
        console.log('🔍 Checking database connection...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
        
        // 基本的な接続テスト
        const result = await db.execute('SELECT version()');
        console.log('✅ Database connection successful');
        
        // テーブル存在確認
        const tables = await db.execute(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);
        
        console.log('📋 Existing tables:');
        if (tables.rows.length === 0) {
            console.log('  No tables found - this is normal for initial deployment');
        } else {
            tables.rows.forEach((row: any) => {
                console.log(`  - ${row.table_name}`);
            });
        }
        
        console.log('✅ Database check completed successfully');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        console.error('Error details:', {
            name: (error as Error).name,
            message: (error as Error).message,
        });
        process.exit(1);
    }
}

checkDatabase();