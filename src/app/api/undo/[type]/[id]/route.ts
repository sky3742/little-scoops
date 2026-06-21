import { NextResponse } from "next/server";
import { db } from "@/db";
import { milkPurchases, milkFeedings, diaperPurchases, diaperChanges } from "@/db/schema";
import { eq } from "drizzle-orm";

const tables = {
  purchase: milkPurchases,
  feeding: milkFeedings,
  "diaper-purchase": diaperPurchases,
  "diaper-change": diaperChanges,
} as const;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type, id } = await params;
    const table = tables[type as keyof typeof tables];

    if (!table) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const numericId = parseInt(id);
    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const result = await db()
      .update(table)
      .set({ deletedAt: null })
      .where(eq(table.id, numericId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error restoring record:", error);
    return NextResponse.json({ error: "Failed to restore record" }, { status: 500 });
  }
}
