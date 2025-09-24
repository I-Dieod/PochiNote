// scripts/check-db.ts

import { db } from '../src/lib/config/db/db';

async function checkDatabase() {
    try {
        console.log('🔍 Checking database connection...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 30) + '...');
        
        // 基本的な接続テスト
        const result = await db.execute('SELECT version()');
        console.log('✅ Database connection successful');
        console.log('PostgreSQL version:', result.rows[0]);
        
        // テーブル存在確認
        const tables = await db.execute(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        
        console.log('📋 Existing tables:');
        if (tables.rows.length === 0) {
            console.log('  No tables found');
        } else {
            tables.rows.forEach((row: any) => {
                console.log(`  - ${row.table_name}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

checkDatabase();