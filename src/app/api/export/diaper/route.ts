import { NextResponse } from "next/server";
import { db } from "@/db";
import { diaperPurchases, diaperChanges } from "@/db/schema";
import { desc, isNull } from "drizzle-orm";

export async function GET() {
  try {
    const database = db();

    const purchaseHistory = await database
      .select({
        createdAt: diaperPurchases.createdAt,
        count: diaperPurchases.count,
      })
      .from(diaperPurchases)
      .where(isNull(diaperPurchases.deletedAt))
      .orderBy(desc(diaperPurchases.createdAt));

    const changeHistory = await database
      .select({
        createdAt: diaperChanges.createdAt,
        count: diaperChanges.count,
        type: diaperChanges.type,
      })
      .from(diaperChanges)
      .where(isNull(diaperChanges.deletedAt))
      .orderBy(desc(diaperChanges.createdAt));

    const rows: string[][] = [["Date", "Type", "Details"]];

    for (const p of purchaseHistory) {
      rows.push([new Date(p.createdAt).toLocaleDateString(), "Purchase", `${p.count} diapers`]);
    }
    for (const c of changeHistory) {
      const typeLabel = c.type.charAt(0).toUpperCase() + c.type.slice(1);
      rows.push([new Date(c.createdAt).toLocaleDateString(), "Change", `${c.count}x ${typeLabel}`]);
    }

    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="little-scoops-diaper-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting diaper data:", error);
    return NextResponse.json({ error: "Failed to export diaper data" }, { status: 500 });
  }
}
