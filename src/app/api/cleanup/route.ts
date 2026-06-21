import { NextResponse } from "next/server";
import { db } from "@/db";
import { milkPurchases, milkFeedings, diaperPurchases, diaperChanges } from "@/db/schema";
import { and, isNotNull, lt } from "drizzle-orm";

const PURGE_AFTER_MS = 5 * 60 * 1000; // 5 minutes

export async function POST() {
  try {
    const cutoff = new Date(Date.now() - PURGE_AFTER_MS);
    const database = db();

    const [p1, p2, p3, p4] = await Promise.all([
      database
        .delete(milkPurchases)
        .where(and(isNotNull(milkPurchases.deletedAt), lt(milkPurchases.deletedAt, cutoff))),
      database
        .delete(milkFeedings)
        .where(and(isNotNull(milkFeedings.deletedAt), lt(milkFeedings.deletedAt, cutoff))),
      database
        .delete(diaperPurchases)
        .where(and(isNotNull(diaperPurchases.deletedAt), lt(diaperPurchases.deletedAt, cutoff))),
      database
        .delete(diaperChanges)
        .where(and(isNotNull(diaperChanges.deletedAt), lt(diaperChanges.deletedAt, cutoff))),
    ]);

    return NextResponse.json({
      purged: p1.rowCount + p2.rowCount + p3.rowCount + p4.rowCount,
    });
  } catch (error) {
    console.error("Error cleaning up:", error);
    return NextResponse.json({ error: "Failed to clean up" }, { status: 500 });
  }
}
