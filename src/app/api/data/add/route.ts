// src/app/api/data/add/route.ts

import { NextRequest, NextResponse } from "next/server";

import { addData } from "@/lib/models/dataModel";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { userName, transactionType, amount, categoryId, description, transactionDate } = await request.json();
        console.log("Received add data request:", {
            userName,
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
        // TODO:DQLインジェクション対策のバリデーション追加

        const result = await addData(
            userName,
            transactionType,
            amount,
            categoryId,
            description || null,
            transactionDate)
        if (!result) {
            return NextResponse.json(
                { message: "To add data was failed" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "User created successfully",
                data: {
                    userName: userName,
                    transactionType: transactionType,
                    amount: amount,
                    categoryId: categoryId,
                    description: description,
                    transactionDate: transactionDate
                }
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error in data adding function:", error);

        // サーバーエラー
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}