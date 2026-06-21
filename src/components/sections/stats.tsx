"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";
import type { StockData } from "@/hooks/use-milk-data";
import type { DiaperStockData } from "@/hooks/use-diaper-data";

interface StatsProps {
  milkStock: StockData | null;
  diaperStock: DiaperStockData | null;
}

function Stats({ milkStock, diaperStock }: StatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card size="sm">
        <CardContent className="space-y-1">
          <div className="flex items-center gap-1.5">
            <TrendingDown className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Avg Milk/Day</span>
          </div>
          <p className="text-xl font-semibold tracking-tight">
            {milkStock?.avgDailyUsage ?? 0}
            <span className="text-xs text-muted-foreground ml-0.5">g</span>
          </p>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardContent className="space-y-1">
          <div className="flex items-center gap-1.5">
            <TrendingDown className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Avg Diapers/Day</span>
          </div>
          <p className="text-xl font-semibold tracking-tight">{diaperStock?.avgDailyUsage ?? 0}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export { Stats };
