// src/app/api/settings/setGoal/route.ts

import { NextRequest, NextResponse } from "next/server";

import { verifyAuthToken } from "@/lib/middleware/authMiddleware";
import { setGoal } from "@/lib/models/settingModel";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const token =
      request.headers.get("Authorization")?.replace("Bearer ", "") || "";
    const authResult = await verifyAuthToken(token);
    if (!authResult.valid || !authResult.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { userName, goalData } = await request.json();
    console.log("Received to set goal request:", {
      userName,
      goalData,
    });

    // バリデーション
    if (
      !goalData.propertyGoal ||
      !goalData.goalDeadline ||
      !goalData.goalMotivation ||
      !goalData.goalNote
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 },
      );
    }

    const setGoalResult = await setGoal(userName, goalData);
    if (!setGoalResult) {
      return NextResponse.json(
        { message: "To set goal was failed" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Set goal successfully",
        data: {
          userName: userName,
          goalData: goalData,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
