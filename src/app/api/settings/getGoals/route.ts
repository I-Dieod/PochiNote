// src/app/api/settings/getGoal/route.ts

import { NextRequest, NextResponse } from "next/server";

import { getGoals } from "@/lib/models/settingModel";
import { verifyAuthToken } from "@/lib/middleware/authMiddleware";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // 認証チェック
    const token =
      request.headers.get("Authorization")?.replace("Bearer ", "") || "";
    const authCheck = await verifyAuthToken(token);
    if (!authCheck.valid) {
      return NextResponse.json(
        {
          message: "Unauthorized request",
          error: authCheck.error || "Invalid token",
        },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const userName = searchParams.get("userName");

    console.log("Received get goal request:", { userName: userName });

    if (!userName) {
      return NextResponse.json(
        { message: "User Name is required" },
        { status: 400 },
      );
    }

    // 認証されたユーザーが自分のデータのみアクセスできるようチェック
    if (!authCheck.user || authCheck.user.userName !== userName) {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied - you can only access your own data",
        },
        { status: 403 },
      );
    }
    const decodedUserName = decodeURIComponent(userName);
    try {
      const getGoalResponse = await getGoals(decodedUserName);
      return NextResponse.json(
        {
          success: true,
          message: "Get goals successfully",
          userName: decodedUserName,
          goalData: getGoalResponse || [],
        },
        { status: 200 },
      );
    } catch (dataError) {
      console.error("Error fetching user data:", dataError);
      // データベースエラーでも500ではなく、空のデータを返すことも考慮
      return NextResponse.json(
        {
          success: false,
          error: "Failed to get goal",
          userName: decodedUserName,
          data: [],
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error in get goal function:", error);

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
