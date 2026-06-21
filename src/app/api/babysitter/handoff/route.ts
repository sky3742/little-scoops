import { NextResponse } from "next/server";
import { db } from "@/db";
import { handoffs } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db().select().from(handoffs).orderBy(desc(handoffs.createdAt));

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching handoffs:", error);
    return NextResponse.json({ error: "Failed to fetch handoffs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemType, amount } = body;

    if (!itemType || !["milk", "diaper"].includes(itemType)) {
      return NextResponse.json({ error: "itemType must be 'milk' or 'diaper'" }, { status: 400 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
    }

    const result = await db().insert(handoffs).values({ itemType, amount }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error adding handoff:", error);
    return NextResponse.json({ error: "Failed to add handoff" }, { status: 500 });
  }
}
