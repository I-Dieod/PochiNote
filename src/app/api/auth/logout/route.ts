// src/app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, invalidateToken } from "@/lib/middleware/authMiddleware";

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, error: "No token provided" },
                { status: 401 }
            );
        }

        const token = request.headers.get("Authorization")?.replace("Bearer ", "") || "";

        // トークンの検証
        const verificationResult = await verifyAuthToken(token);

        if (!verificationResult.valid) {
            return NextResponse.json(
                {
                    success: false,
                    error: verificationResult.error || "Invalid token"
                },
                { status: 401 }
            );
        }

        // Redisからトークンを削除
        const userName = verificationResult.user?.userName;
        if (userName) {
            const invalidated = await invalidateToken(userName);

            if (!invalidated) {
                return NextResponse.json(
                    { success: false, error: "Failed to invalidate session" },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}