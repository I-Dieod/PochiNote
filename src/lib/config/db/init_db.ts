// src/lib/config/db/init_db.ts

import { db } from './db';
import { categories } from './schema/transaction';

export const initCategories = async () => {
    const initialCategories = [
        // 収入カテゴリ
        { categoryName: '給与', categoryType: 'income' as const, description: '会社からの給与' },
        { categoryName: '副業', categoryType: 'income' as const, description: '副業による収入' },
        { categoryName: '投資', categoryType: 'income' as const, description: '投資による収益' },
        { categoryName: 'ボーナス', categoryType: 'income' as const, description: '賞与・ボーナス' },
        { categoryName: 'その他収入', categoryType: 'income' as const, description: 'その他の収入' },

        // 支出カテゴリ
        { categoryName: '食費', categoryType: 'expense' as const, description: '食事・食材費' },
        { categoryName: '交通費', categoryType: 'expense' as const, description: '交通機関の利用料' },
        { categoryName: '住居費', categoryType: 'expense' as const, description: '家賃・住宅ローン' },
        { categoryName: '光熱費', categoryType: 'expense' as const, description: '電気・ガス・水道' },
        { categoryName: '通信費', categoryType: 'expense' as const, description: 'スマホ・インターネット' },
        { categoryName: '電子機器', categoryType: 'expense' as const, description: 'PC・スマホ等の電子機器' },
        { categoryName: '衣類', categoryType: 'expense' as const, description: '洋服・靴・アクセサリー' },
        { categoryName: '娯楽', categoryType: 'expense' as const, description: '娯楽・レジャー費' },
        { categoryName: '医療費', categoryType: 'expense' as const, description: '病院・薬・健康管理' },
        { categoryName: '教育費', categoryType: 'expense' as const, description: '書籍・セミナー・学習' },
        { categoryName: 'その他支出', categoryType: 'expense' as const, description: 'その他の支出' },
    ];

    try {
        // 既存データがある場合はスキップ
        const existingCategories = await db.select().from(categories).limit(1);
        if (existingCategories.length > 0) {
            console.log('Categories already exist, skipping seed...');
            return;
        }

        await db.insert(categories).values(initialCategories);
        console.log('Categories seeded successfully!');

    } catch (error) {
        console.error('Error seeding categories:', error);
        throw error;
    }
};

if (require.main === module) {
    initCategories()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}