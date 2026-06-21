import { NextResponse } from "next/server";
import { db } from "@/db";
import { milkPurchases, milkFeedings } from "@/db/schema";
import { desc, isNull } from "drizzle-orm";

export async function GET() {
  try {
    const database = db();
    const purchaseHistory = await database
      .select({
        id: milkPurchases.id,
        amountKg: milkPurchases.amountKg,
        createdAt: milkPurchases.createdAt,
      })
      .from(milkPurchases)
      .where(isNull(milkPurchases.deletedAt))
      .orderBy(desc(milkPurchases.createdAt));

    const feedingHistory = await database
      .select({
        id: milkFeedings.id,
        scoops: milkFeedings.scoops,
        gramsPerScoop: milkFeedings.gramsPerScoop,
        createdAt: milkFeedings.createdAt,
      })
      .from(milkFeedings)
      .where(isNull(milkFeedings.deletedAt))
      .orderBy(desc(milkFeedings.createdAt));

    const allTransactions = [
      ...purchaseHistory.map((p) => ({
        id: p.id,
        type: "purchase" as const,
        amountKg: parseFloat(p.amountKg),
        createdAt: p.createdAt,
      })),
      ...feedingHistory.map((f) => ({
        id: f.id,
        type: "feeding" as const,
        scoops: f.scoops,
        gramsPerScoop: parseFloat(f.gramsPerScoop),
        totalGrams: f.scoops * parseFloat(f.gramsPerScoop),
        createdAt: f.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(allTransactions);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
