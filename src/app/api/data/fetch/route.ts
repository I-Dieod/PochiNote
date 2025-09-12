// src/qpp/qpi/data/fetch/route.ts

import { NextRequest, NextResponse } from "next/server";

import { getData } from "@/lib/models/dataModel";
import { verifyAuthToken } from "@/lib/middleware/authMiddleware";

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        // 認証チェック
        const token = request.headers.get("Authorization")?.replace("Bearer ", "") || "";
        const authCheck = await verifyAuthToken(token);
        if (!authCheck.valid) {
            return NextResponse.json(
                { message: "Unauthorized request", error: authCheck.error || "Invalid token" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const userName = searchParams.get("userName");

        console.log("Received data fetch request:", { userName: userName });

        if (!userName) {
            return NextResponse.json(
                { message: "User Name is required" },
                { status: 400 }
            );
        }

        // 認証されたユーザーが自分のデータのみアクセスできるようチェック
        if (!authCheck.user || authCheck.user.userName !== userName) {
            return NextResponse.json(
                { success: false, error: "Access denied - you can only access your own data" },
                { status: 403 }
            );
        }
        const decodedUserName = decodeURIComponent(userName);
        try {
            const fetchDataResponse = await getData(decodedUserName);
            // データが空の場合でもエラーではなく空の配列を返す
            return NextResponse.json(
                {
                    success: true,
                    message: "Data fetched successfully",
                    userName: decodedUserName,
                    data: fetchDataResponse || []
                },
                { status: 200 } // 201ではなく200が適切
            );
        } catch (dataError) {
            console.error("Error fetching user data:", dataError);
            // データベースエラーでも500ではなく、空のデータを返すことも考慮
            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to fetch data",
                    userName: decodedUserName,
                    data: []
                },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("Error in data fetch function:", error);

        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}