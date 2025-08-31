// src/app/api/auth/login/route.ts

import { getUserByEmail } from "@/lib/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

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
        return NextResponse.json(
            { message: "Login successful", user: { email } },
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