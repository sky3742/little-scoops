import { NextResponse } from "next/server";
import { db } from "@/db";
import { diaperPurchases, diaperChanges } from "@/db/schema";
import { desc, isNull } from "drizzle-orm";

export async function GET() {
  try {
    const database = db();

    const purchaseHistory = await database
      .select({
        id: diaperPurchases.id,
        count: diaperPurchases.count,
        createdAt: diaperPurchases.createdAt,
      })
      .from(diaperPurchases)
      .where(isNull(diaperPurchases.deletedAt))
      .orderBy(desc(diaperPurchases.createdAt));

    const changeHistory = await database
      .select({
        id: diaperChanges.id,
        count: diaperChanges.count,
        changeType: diaperChanges.type,
        changeDate: diaperChanges.changeDate,
        createdAt: diaperChanges.createdAt,
      })
      .from(diaperChanges)
      .where(isNull(diaperChanges.deletedAt))
      .orderBy(desc(diaperChanges.createdAt));

    const allTransactions = [
      ...purchaseHistory.map((p) => ({
        id: p.id,
        type: "purchase" as const,
        count: p.count,
        createdAt: p.createdAt,
      })),
      ...changeHistory.map((c) => ({
        id: c.id,
        type: "change" as const,
        count: c.count,
        changeType: c.changeType,
        changeDate: c.changeDate,
        createdAt: c.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(allTransactions);
  } catch (error) {
    console.error("Error fetching diaper history:", error);
    return NextResponse.json({ error: "Failed to fetch diaper history" }, { status: 500 });
  }
}
