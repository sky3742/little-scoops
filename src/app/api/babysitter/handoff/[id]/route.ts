import { NextResponse } from "next/server";
import { db } from "@/db";
import { handoffs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numericId = parseInt(id);

    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const result = await db().delete(handoffs).where(eq(handoffs.id, numericId)).returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Handoff not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error deleting handoff:", error);
    return NextResponse.json({ error: "Failed to delete handoff" }, { status: 500 });
  }
}
