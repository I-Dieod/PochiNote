// src/app/api/auth/login/route.ts

import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from 'jose';
import { randomUUID } from "crypto";


import { getUserByEmail } from "@/lib/models/userModel";

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

        // 既存のセッションがあれば無効化
        // 成功レスポンス
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
        const userName = user.userName
        const jti = randomUUID(); // JWT ID（ランダム性を追加）
        const iat = Math.floor(Date.now() / 1000); // issued at time
        const exp = iat + 3600; // 1時間後
        // TODO: トークン発行アルゴリズムにランダム性を持たせる
        try {
            token = await new SignJWT({ 
                userName,
                jti,
                iat,
                // 必要に応じて他のクレームも追加
                email: user.email,
                userId: user.tableId
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime(exp)
                .setIssuedAt(iat)
                .setJti(jti) // JWT ID
                .sign(new TextEncoder().encode(jwtSecret));
        } catch (error) {
            console.error("Error generating JWT:", error);
            return NextResponse.json(
                { error: "Failed to generate token" },
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