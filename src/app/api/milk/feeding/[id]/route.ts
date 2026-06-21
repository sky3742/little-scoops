import { NextResponse } from "next/server";
import { db } from "@/db";
import { milkFeedings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numericId = parseInt(id);

    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const result = await db()
      .update(milkFeedings)
      .set({ deletedAt: new Date() })
      .where(eq(milkFeedings.id, numericId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Feeding not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error deleting feeding:", error);
    return NextResponse.json({ error: "Failed to delete feeding" }, { status: 500 });
  }
}
