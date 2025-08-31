// src/lib/models/userModel.ts

import { eq } from "drizzle-orm";

import { users } from "@/lib/config/db/schema/users";
import { db } from "@/lib/config/db/db";

export const createUser = async (userName: string, email: string, passwordHash: string) => {
    try {
        const result = await db.insert(users).values({
            userName: userName,
            email: email,
            password: passwordHash,
        }).returning();
        return result;
    } catch (error) {
        console.error("Error in createUser function:", error);
        throw new Error("Failed to create user"); //クライアント側でキャッチされるようにエラーを再スロー;
    }
}

export const getUserByEmail = async (email: string) => {
    try {
        const [result] = await db.select().from(users).where(eq(users.email, email));
        // ユーザーが見つからない場合は null を返す
        if (!result) {
            console.warn(`User with email ${email} not found`);
            return null;
        }

        return result;
    } catch (error) {
        console.error("Error in findUserByEmail function:", error);
        throw new Error("Failed to get user by email");
    }
}