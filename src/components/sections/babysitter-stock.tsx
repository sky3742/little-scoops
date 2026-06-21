"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby } from "lucide-react";
import type { StockData } from "@/hooks/use-milk-data";
import type { DiaperStockData } from "@/hooks/use-diaper-data";

interface BabysitterStockProps {
  milkStock: StockData | null;
  diaperStock: DiaperStockData | null;
}

function BabysitterStock({ milkStock, diaperStock }: BabysitterStockProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs text-muted-foreground font-medium">
            Babysitter Stock
          </CardTitle>
          <Baby className="size-3.5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Milk</p>
            <p className="text-lg font-semibold">
              {milkStock ? (milkStock.babysitterStock / 1000).toFixed(1) : "0"}
              <span className="text-xs text-muted-foreground ml-1">kg</span>
            </p>
            <p className="text-[10px] text-muted-foreground">
              {milkStock?.babysitterDaysLeft !== null
                ? `${milkStock?.babysitterDaysLeft} days left`
                : "No data"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Diapers</p>
            <p className="text-lg font-semibold">
              {diaperStock?.babysitterStock ?? 0}
              <span className="text-xs text-muted-foreground ml-1">pcs</span>
            </p>
            <p className="text-[10px] text-muted-foreground">
              {diaperStock?.babysitterDaysLeft !== null
                ? `${diaperStock?.babysitterDaysLeft} days left`
                : "No data"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { BabysitterStock };
