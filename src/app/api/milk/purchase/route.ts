import { NextResponse } from "next/server";
import { db } from "@/db";
import { milkPurchases } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amountKg } = body;

    if (!amountKg || amountKg <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
    }

    const result = await db()
      .insert(milkPurchases)
      .values({ amountKg: amountKg.toString() })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error adding purchase:", error);
    return NextResponse.json({ error: "Failed to add purchase" }, { status: 500 });
  }
}
