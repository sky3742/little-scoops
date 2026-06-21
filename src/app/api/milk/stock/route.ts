import { NextResponse } from "next/server";
import { db } from "@/db";
import { milkPurchases, milkFeedings, handoffs, babysitterDays } from "@/db/schema";
import { sql, gte, isNull, eq } from "drizzle-orm";
import { ROLLING_AVG_DAYS } from "@/lib/constants";

export async function GET() {
  try {
    const database = db();

    // Parent stock
    const totalPurchased = await database
      .select({
        total: sql<string>`COALESCE(SUM(CAST(${milkPurchases.amountKg} AS NUMERIC) * 1000), 0)`,
      })
      .from(milkPurchases)
      .where(isNull(milkPurchases.deletedAt));

    const totalConsumed = await database
      .select({
        total: sql<string>`COALESCE(SUM(CAST(${milkFeedings.scoops} AS NUMERIC) * CAST(${milkFeedings.gramsPerScoop} AS NUMERIC)), 0)`,
      })
      .from(milkFeedings)
      .where(isNull(milkFeedings.deletedAt));

    const currentStockGrams =
      parseFloat(totalPurchased[0].total) - parseFloat(totalConsumed[0].total);

    // Parent rolling avg
    const rollingAvgDate = new Date();
    rollingAvgDate.setDate(rollingAvgDate.getDate() - ROLLING_AVG_DAYS);

    const recentFeedings = await database
      .select({
        totalGrams: sql<string>`COALESCE(SUM(CAST(${milkFeedings.scoops} AS NUMERIC) * CAST(${milkFeedings.gramsPerScoop} AS NUMERIC)), 0)`,
        dayCount: sql<string>`COUNT(DISTINCT DATE(${milkFeedings.createdAt}))`,
      })
      .from(milkFeedings)
      .where(
        sql`${gte(milkFeedings.createdAt, rollingAvgDate)} AND ${isNull(milkFeedings.deletedAt)}`
      );

    const totalGramsLast7Days = parseFloat(recentFeedings[0].totalGrams);
    const daysWithFeedings = parseInt(recentFeedings[0].dayCount);

    const avgDailyUsage = daysWithFeedings > 0 ? totalGramsLast7Days / ROLLING_AVG_DAYS : 0;

    const daysLeft = avgDailyUsage > 0 ? Math.floor(currentStockGrams / avgDailyUsage) : null;

    // Babysitter stock
    const totalHandedOff = await database
      .select({
        total: sql<string>`COALESCE(SUM(${handoffs.amount}), 0)`,
      })
      .from(handoffs)
      .where(eq(handoffs.itemType, "milk"));

    const handedOffGrams = parseFloat(totalHandedOff[0].total);

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
    const babysitterStock = Math.max(handedOffGrams - babysitterConsumed, 0);
    const combinedStock = Math.max(currentStockGrams + babysitterStock, 0);

    const babysitterDaysLeft =
      babysitterAvgDailyUsage > 0 ? Math.floor(babysitterStock / babysitterAvgDailyUsage) : null;

    return NextResponse.json({
      currentStock: Math.round(currentStockGrams),
      avgDailyUsage: Math.round(avgDailyUsage * 10) / 10,
      daysLeft,
      totalPurchased: Math.round(parseFloat(totalPurchased[0].total)),
      totalUsed: Math.round(parseFloat(totalConsumed[0].total)),
      babysitterStock: Math.round(babysitterStock),
      combinedStock: Math.round(combinedStock),
      babysitterAvgDailyUsage: Math.round(babysitterAvgDailyUsage * 10) / 10,
      babysitterDaysLeft,
    });
  } catch (error) {
    console.error("Error fetching stock:", error);
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
  }
}
