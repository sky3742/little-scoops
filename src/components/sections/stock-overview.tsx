"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Droplets, Baby, Timer } from "lucide-react";
import { LOW_STOCK_THRESHOLD_DAYS } from "@/lib/constants";
import type { StockData } from "@/hooks/use-milk-data";
import type { DiaperStockData } from "@/hooks/use-diaper-data";

interface StockOverviewProps {
  milkStock: StockData | null;
  diaperStock: DiaperStockData | null;
}

function StockOverview({ milkStock, diaperStock }: StockOverviewProps) {
  const milkProgress = milkStock
    ? Math.min((milkStock.currentStock / Math.max(milkStock.totalPurchased, 1)) * 100, 100)
    : 0;
  const diaperProgress = diaperStock
    ? Math.min((diaperStock.currentStock / Math.max(diaperStock.totalPurchased, 1)) * 100, 100)
    : 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs text-muted-foreground font-medium">Milk Powder</CardTitle>
            <Droplets className="size-3.5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold tracking-tight">
              {milkStock ? (milkStock.currentStock / 1000).toFixed(1) : "0"}
            </span>
            <span className="text-xs text-muted-foreground">kg</span>
          </div>
          <Progress value={milkProgress} className="h-1.5" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Timer className="size-3" />
              {milkStock?.daysLeft !== null ? (
                <span>{milkStock?.daysLeft} days</span>
              ) : (
                <span>No data</span>
              )}
            </div>
            {milkStock &&
              milkStock.daysLeft != null &&
              milkStock.daysLeft <= LOW_STOCK_THRESHOLD_DAYS && (
                <Badge variant="destructive" className="text-[10px] h-4 px-1.5">
                  Low
                </Badge>
              )}
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs text-muted-foreground font-medium">Diapers</CardTitle>
            <Baby className="size-3.5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold tracking-tight">
              {diaperStock?.currentStock ?? 0}
            </span>
            <span className="text-xs text-muted-foreground">pcs</span>
          </div>
          <Progress value={diaperProgress} className="h-1.5" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Timer className="size-3" />
              {diaperStock?.daysLeft !== null ? (
                <span>{diaperStock?.daysLeft} days</span>
              ) : (
                <span>No data</span>
              )}
            </div>
            {diaperStock &&
              diaperStock.daysLeft != null &&
              diaperStock.daysLeft <= LOW_STOCK_THRESHOLD_DAYS && (
                <Badge variant="destructive" className="text-[10px] h-4 px-1.5">
                  Low
                </Badge>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { StockOverview };
