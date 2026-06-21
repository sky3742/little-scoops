import { NextResponse } from "next/server";
import { db } from "@/db";
import { milkPurchases, milkFeedings } from "@/db/schema";
import { desc, isNull } from "drizzle-orm";

export async function GET() {
  try {
    const database = db();

    const purchaseHistory = await database
      .select({
        createdAt: milkPurchases.createdAt,
        amountKg: milkPurchases.amountKg,
      })
      .from(milkPurchases)
      .where(isNull(milkPurchases.deletedAt))
      .orderBy(desc(milkPurchases.createdAt));

    const feedingHistory = await database
      .select({
        createdAt: milkFeedings.createdAt,
        scoops: milkFeedings.scoops,
        gramsPerScoop: milkFeedings.gramsPerScoop,
      })
      .from(milkFeedings)
      .where(isNull(milkFeedings.deletedAt))
      .orderBy(desc(milkFeedings.createdAt));

    const rows: string[][] = [["Date", "Type", "Details"]];

    for (const p of purchaseHistory) {
      rows.push([new Date(p.createdAt).toLocaleDateString(), "Purchase", `${p.amountKg} kg`]);
    }
    for (const f of feedingHistory) {
      const totalGrams = f.scoops * parseFloat(f.gramsPerScoop);
      rows.push([
        new Date(f.createdAt).toLocaleDateString(),
        "Feeding",
        `${f.scoops} scoops (${totalGrams.toFixed(1)}g)`,
      ]);
    }

    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="little-scoops-milk-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting milk data:", error);
    return NextResponse.json({ error: "Failed to export milk data" }, { status: 500 });
  }
}
