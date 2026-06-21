import { NextResponse } from "next/server";
import { db } from "@/db";
import { diaperPurchases, diaperChanges, handoffs, babysitterDays } from "@/db/schema";
import { sql, gte, isNull, eq } from "drizzle-orm";
import { ROLLING_AVG_DAYS } from "@/lib/constants";

export async function GET() {
  try {
    const database = db();

    // Parent stock
    const totalPurchased = await database
      .select({
        total: sql<string>`COALESCE(SUM(${diaperPurchases.count}), 0)`,
      })
      .from(diaperPurchases)
      .where(isNull(diaperPurchases.deletedAt));

    const totalUsed = await database
      .select({
        total: sql<string>`COALESCE(SUM(${diaperChanges.count}), 0)`,
      })
      .from(diaperChanges)
      .where(isNull(diaperChanges.deletedAt));

    const currentStock = parseInt(totalPurchased[0].total) - parseInt(totalUsed[0].total);

    // Parent rolling avg
    const rollingAvgDate = new Date();
    rollingAvgDate.setDate(rollingAvgDate.getDate() - ROLLING_AVG_DAYS);

    const recentChanges = await database
      .select({
        totalCount: sql<string>`COALESCE(SUM(${diaperChanges.count}), 0)`,
        dayCount: sql<string>`COUNT(DISTINCT ${diaperChanges.changeDate})`,
      })
      .from(diaperChanges)
      .where(
        sql`${gte(diaperChanges.changeDate, rollingAvgDate.toISOString().split("T")[0])} AND ${isNull(diaperChanges.deletedAt)}`
      );

    const typeBreakdown = await database
      .select({
        type: diaperChanges.type,
        total: sql<string>`COALESCE(SUM(${diaperChanges.count}), 0)`,
      })
      .from(diaperChanges)
      .where(
        sql`${gte(diaperChanges.changeDate, rollingAvgDate.toISOString().split("T")[0])} AND ${isNull(diaperChanges.deletedAt)}`
      )
      .groupBy(diaperChanges.type);

    const totalChangesLast7Days = parseInt(recentChanges[0].totalCount);
    const daysWithChanges = parseInt(recentChanges[0].dayCount);

    const avgDailyUsage = daysWithChanges > 0 ? totalChangesLast7Days / ROLLING_AVG_DAYS : 0;

    const daysLeft = avgDailyUsage > 0 ? Math.floor(currentStock / avgDailyUsage) : null;

    const breakdown: Record<string, number> = {};
    for (const row of typeBreakdown) {
      breakdown[row.type] = parseInt(row.total);
    }

    // Babysitter stock
    const totalHandedOff = await database
      .select({
        total: sql<string>`COALESCE(SUM(${handoffs.amount}), 0)`,
      })
      .from(handoffs)
      .where(eq(handoffs.itemType, "diaper"));

    const handedOffCount = parseInt(totalHandedOff[0].total);

    // Babysitter days in rolling avg window
    const babysitterDayCount = await database
      .select({
        count: sql<string>`COUNT(*)`,
      })
      .from(babysitterDays)
      .where(gte(babysitterDays.date, rollingAvgDate.toISOString().split("T")[0]));

    const numBabysitterDays = parseInt(babysitterDayCount[0].count);

    // Babysitter rolling avg (from parent's avg daily usage)
    const babysitterAvgDailyUsage = avgDailyUsage;
    const babysitterConsumed =
      numBabysitterDays > 0 ? babysitterAvgDailyUsage * numBabysitterDays : 0;
    const babysitterStock = Math.max(handedOffCount - babysitterConsumed, 0);
    const combinedStock = Math.max(currentStock + babysitterStock, 0);

    const babysitterDaysLeft =
      babysitterAvgDailyUsage > 0 ? Math.floor(babysitterStock / babysitterAvgDailyUsage) : null;

    return NextResponse.json({
      currentStock,
      avgDailyUsage: Math.round(avgDailyUsage * 10) / 10,
      daysLeft,
      totalPurchased: parseInt(totalPurchased[0].total),
      totalUsed: parseInt(totalUsed[0].total),
      typeBreakdown: breakdown,
      babysitterStock: Math.round(babysitterStock),
      combinedStock: Math.round(combinedStock),
      babysitterAvgDailyUsage: Math.round(babysitterAvgDailyUsage * 10) / 10,
      babysitterDaysLeft,
    });
  } catch (error) {
    console.error("Error fetching diaper stock:", error);
    return NextResponse.json({ error: "Failed to fetch diaper stock data" }, { status: 500 });
  }
}
