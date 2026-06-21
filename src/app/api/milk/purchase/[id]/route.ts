import { NextResponse } from "next/server";
import { db } from "@/db";
import { milkPurchases } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numericId = parseInt(id);

    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const result = await db()
      .update(milkPurchases)
      .set({ deletedAt: new Date() })
      .where(eq(milkPurchases.id, numericId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error deleting purchase:", error);
    return NextResponse.json({ error: "Failed to delete purchase" }, { status: 500 });
  }
}
