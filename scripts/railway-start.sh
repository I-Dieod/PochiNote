#!/bin/bash

echo "🚀 Starting Railway deployment process..."

# 環境変数の確認
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is not set"
    exit 1
fi
if [ -z "$REDIS_URL" ]; then
    echo "❌ REDIS_URL is not set"
    exit 1
fi

echo "✅ Environment variables validated"

# データベースのスキーマを同期（テーブル作成）
echo "📊 Pushing database schema..."
npx drizzle-kit push --verbose

# データベースの初期化とシード
echo "🌱 Running database seed..."
npx tsx src/lib/config/db/init_db.ts

# アプリケーション起動
echo "🎯 Starting Next.js application..."
npm start