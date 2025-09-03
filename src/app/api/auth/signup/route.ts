// src/app/signup/page.tsx

import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { createUser, getUserByEmail } from "@/lib/models/userModel";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { email, password, userName } = await req.json();
        console.log("Received signup request:", { email, password, userName });

        // バリデーション
        if (!email || !password || !userName) {
            return NextResponse.json(
                { message: "All fields are required" },
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
        if (userName == password) {
            return NextResponse.json(
                { message: "User Name and Password must be different"},
                { status: 400 }
            )
        }

        // 重複チェック
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { message: "Email already in use" },
                { status: 409 }
            );
        }
        const existingUserName = await getUserByEmail(userName);
        if (existingUserName) {
            return NextResponse.json(
                { message: "UserName already in use" },
                { status: 409 }
            );
        }


        // パスワードハッシュ化
        const passwordHash = await bcrypt.hash(password, 10);

        // ユーザー作成
        const user = await createUser(userName, email, passwordHash);
        if (!user) {
            return NextResponse.json(
                { message: "User creation failed" },
                { status: 500 }
            );
        }

        // 必要な情報のみ返す
        return NextResponse.json(
            {
                success: true,
                message: "User created successfully",
                user: {
                    email: email,
                    userName: userName
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in register function:", error);

        // サーバーエラー
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
