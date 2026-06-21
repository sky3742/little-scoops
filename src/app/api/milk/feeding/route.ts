import { NextResponse } from "next/server";
import { db } from "@/db";
import { milkFeedings } from "@/db/schema";
import { GRAMS_PER_SCOOP_DEFAULT } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scoops, gramsPerScoop = GRAMS_PER_SCOOP_DEFAULT } = body;

    if (!scoops || scoops <= 0) {
      return NextResponse.json({ error: "Scoops must be a positive number" }, { status: 400 });
    }

    const result = await db()
      .insert(milkFeedings)
      .values({
        scoops,
        gramsPerScoop: gramsPerScoop.toString(),
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error adding feeding:", error);
    return NextResponse.json({ error: "Failed to add feeding" }, { status: 500 });
  }
}
