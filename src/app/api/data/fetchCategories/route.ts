// src/app/api/data/fetchCategories/route.ts

import { NextResponse } from "next/server";

import { fetchCategories } from "@/lib/models/dataModel";

export async function GET() {
    try {
        const categoriesByType = await fetchCategories();

        return NextResponse.json(categoriesByType);

    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}