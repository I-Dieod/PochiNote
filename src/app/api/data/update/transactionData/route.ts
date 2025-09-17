// src/app/api/data/edit/transaction/route.ts

import { NextRequest, NextResponse } from "next/server";

import { verifyAuthToken } from "@/lib/middleware/authMiddleware";
import { updateData } from "@/lib/models/dataModel";


export async function PUT(request: NextRequest): Promise<NextResponse> {
    try {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "") || "";
        const authResult = await verifyAuthToken(token);
        if (!authResult.valid || !authResult.user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 });
        }

        const { userName, transactionId, transactionType, amount, categoryId, description, transactionDate } = await request.json();
        console.log("Received update data request:", {
            userName,
            transactionId,
            transactionType,
            amount,
            categoryId,
            description,
            transactionDate
        });

        // バリデーション
        if (!userName || !transactionType || !amount || !categoryId || !transactionDate) {
            return NextResponse.json(
                { error: "Required fields are missing" },
                { status: 400 }
            );
        }
        // transactionTypeの値チェック
        if (!["income", "expense"].includes(transactionType)) {
            return NextResponse.json(
                { error: "Invalid transaction type" },
                { status: 400 }
            );
        }

        const result = await updateData(
            userName,
            transactionId,
            transactionType,
            amount,
            categoryId,
            description,
            transactionDate
        );
        if (!result) {
            return NextResponse.json(
                { message: "To update data was failed" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: result
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in /api/data/edit/transaction:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}