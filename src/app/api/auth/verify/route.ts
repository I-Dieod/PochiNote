// src/app/api/auth/verify/route.ts
// This is used in "@/components/AuthProvider.tsx" to verify stored JWT token on app load

import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/middleware/authMiddleware";

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, error: "No token provided" },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);

        // トークンの検証
        const verificationResult = await verifyAuthToken(token);

        if (!verificationResult.valid) {
            return NextResponse.json(
                {
                    success: false,
                    error: verificationResult.error || "Token verification failed"
                },
                { status: 401 }
            );
        }

        // 検証成功
        return NextResponse.json({
            success: true,
            message: "Token is valid",
            user: {
                userName: verificationResult.user?.userName
            }
        });

    } catch (error) {
        console.error("Token verification error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}