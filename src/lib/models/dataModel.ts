// src/lib/models/dataModel.ts

import { eq } from "drizzle-orm";

import { categories, transactions } from "@/lib/config/db/schema/transaction";
import { db } from "@/lib/config/db/db";

export const addData = async (
    userName: string,
    transactionType: "income" | "expense",
    amount: string,
    categoryId: number,
    description: string | null,
    transactionDate: string
) => {
    try {
        const dateObj = new Date(transactionDate);
        const result = await db.insert(transactions).values({
            userName: userName,
            transactionType: transactionType,
            amount: amount,
            categoryId: categoryId,
            description: description,
            transactionDate: dateObj
        }).returning();

        return result[0];

    } catch (error) {
        console.error("Error in addData function:", error);
        throw new Error("Failed to add data");
    }
}

export const getData = async (userName: string) => {
    try {
        console.log("Fetching data for user:", userName);

        const result = await db.select().from(transactions).where(eq(transactions.userName, userName));

        console.log(`Found ${result.length} transactions for user ${userName}`);

        // データが空でもエラーではない - 空の配列を返す
        return result || [];
    } catch (error) {
        console.error("Error in getData function:", error);
        // データベース接続エラーなど、実際のエラーの場合のみthrow
        throw new Error("Database error: Failed to get data");
    }
}

export const fetchCategories = async () => {
    try {
        const result = await db.select({
            categoryId: categories.categoryId,
            categoryName: categories.categoryName,
            categoryType: categories.categoryType,
            description: categories.description
        }).from(categories);

        const categoriesByType = {
            income: result.filter(c => c.categoryType === 'income'),
            expense: result.filter(c => c.categoryType === 'expense')
        };
        return categoriesByType;

    } catch (error) {
        console.error("Error in fetch categories function:", error);
        throw new Error("Failed to fetch categories");
    }
}