import { NextResponse } from "next/server";
import { db } from "@/db";
import { diaperChanges } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { count = 1, type = "wet" } = body;

    if (!["wet", "dirty", "both"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const result = await db().insert(diaperChanges).values({ count, type }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error logging diaper change:", error);
    return NextResponse.json({ error: "Failed to log diaper change" }, { status: 500 });
  }
}
