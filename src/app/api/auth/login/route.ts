// src/app/api/auth/login/route.ts

import bcrypt from "bcryptjs";
import { useAtom } from "jotai";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from 'jose';

import { authTokenAtom } from "@/atoms/auth/login.atom";
import { getUserByEmail } from "@/lib/models/userModel";
import { redisClient } from "@/lib/config/redisClient";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { email, password } = await request.json();
        console.log("Received login request:", { email, password });

        // バリデーション
        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }
        if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
            return NextResponse.json(
                { message: "Invalid email format" },
                { status: 400 }
            );
        }
        if (password.length < 8) {
            return NextResponse.json(
                { message: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // ここでユーザー認証のロジックを実装（例：データベース照会）
        const user = await getUserByEmail(email);
        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials, Empty search results by Email" },
                { status: 401 }
            );
        }

        // パスワードの検証（ハッシュ化されている場合はハッシュを比較）
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        // パスワードが一致しない場合、エラーレスポンスを返す
        if (!isPasswordMatch) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        console.log("User Login successfully:", { user });
        // 成功レスポンス
        {/* TODO:セッションによるユーザー情報の状態管理 */ }
        // トークン生成
        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) {
            console.error("JWT_SECRET is not defined");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }
        let token: string;
        try {
            token = await new SignJWT({ userId: 123 })
                .setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime('1h')
                .sign(new TextEncoder().encode(jwtSecret));
        } catch (error) {
            console.error("Error generating JWT:", error);
            return NextResponse.json(
                { erorr: "Failed to generate token" },
                { status: 500 }
            );
        }
        // トークン保存
        try {
            await redisClient.set(`user:${user.userName}`, token, { EX: 3600 }); // TODO:セッションちゃんと切れるか確認
            console.log(`Saved JWT in redis: user: ${user.userName} -> ${token}`)
        } catch (error) {
            console.error("Failed to save JWT for redis");
            return NextResponse.json(
                { error: "Failed to save token" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Login successful",
                token: token,
                user: {
                    id: user.tableId,
                    userName: user.userName,
                    email: user.email
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in login function:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}