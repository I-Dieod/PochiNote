import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/config/db/db";
import { usersProperties } from "@/lib/config/db/schema/users";
import { eq } from "drizzle-orm";
import { verifyAuthToken } from "@/lib/middleware/authMiddleware";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "") || "";
        const authResult = await verifyAuthToken(token);
        if (!authResult.valid || !authResult.user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 });
        }

        const { currentProperty } = await request.json();

        // Update user's current property
        await db.update(usersProperties)
            .set({ currentProperty })
            .where(eq(usersProperties.userName, authResult.user.userName));

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error updating current property:', error);
        return NextResponse.json(
            { success: false, error: "Failed to update current property" },
            { status: 500 }
        );
    }
}