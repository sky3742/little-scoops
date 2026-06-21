import { NextResponse } from "next/server";
import { db } from "@/db";
import { diaperPurchases } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { count } = body;

    if (!count || count <= 0) {
      return NextResponse.json({ error: "Count must be a positive number" }, { status: 400 });
    }

    const result = await db().insert(diaperPurchases).values({ count }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error adding diaper purchase:", error);
    return NextResponse.json({ error: "Failed to add diaper purchase" }, { status: 500 });
  }
}
