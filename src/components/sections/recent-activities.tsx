"use client";

import { Separator } from "@/components/ui/separator";
import { SwipeToDelete } from "@/components/swipe-to-delete";
import { Droplets, Baby, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Domain, MilkTransactionType, DiaperTransactionType, DiaperChangeType } from "@/lib/enums";
import { diaperTypeLabel, diaperTypeIcon } from "@/components/sheets/diaper-change-sheet";
import type { MilkTransaction } from "@/hooks/use-milk-data";
import type { DiaperTransaction } from "@/hooks/use-diaper-data";

interface ActivityItem {
  id: number;
  type: string;
  _domain: Domain;
  createdAt: string;
}

interface RecentActivitiesProps {
  activities: ActivityItem[];
  onDelete: (id: number, domain: Domain, type: MilkTransactionType | DiaperTransactionType) => void;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function RecentActivities({ activities, onDelete }: RecentActivitiesProps) {
  if (activities.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Recent Activity</h2>
        <p className="text-sm text-muted-foreground text-center py-8">
          No activity yet. Start tracking!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground">Recent Activity</h2>
      <div className="space-y-0">
        {activities.map((item, i) => {
          const isMilk = item._domain === Domain.Milk;
          const milkItem = isMilk ? (item as unknown as MilkTransaction) : null;
          const diaperItem = !isMilk ? (item as unknown as DiaperTransaction) : null;

          return (
            <div key={`${item._domain}-${item.id}-${item.createdAt}`}>
              <SwipeToDelete
                onDelete={() =>
                  onDelete(item.id, item._domain, isMilk ? milkItem!.type : diaperItem!.type)
                }
              >
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-8 rounded-lg flex items-center justify-center ${isMilk ? "bg-primary/10" : "bg-secondary"}`}
                    >
                      {isMilk ? (
                        <Droplets className="size-3.5 text-primary" />
                      ) : diaperItem?.type === DiaperTransactionType.Change ? (
                        diaperTypeIcon[diaperItem?.changeType ?? DiaperChangeType.Wet]
                      ) : (
                        <Baby className="size-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {isMilk
                          ? milkItem?.type === MilkTransactionType.Purchase
                            ? `+${milkItem.amountKg} kg milk`
                            : `${milkItem?.scoops} scoops fed`
                          : diaperItem?.type === DiaperTransactionType.Purchase
                            ? `+${diaperItem.count} diapers`
                            : `${diaperTypeLabel[diaperItem?.changeType ?? DiaperChangeType.Wet]} diaper`}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      (isMilk && milkItem?.type === MilkTransactionType.Feeding) ||
                      (!isMilk && diaperItem?.type === DiaperTransactionType.Change)
                        ? "text-destructive"
                        : "text-primary"
                    }`}
                  >
                    {(isMilk && milkItem?.type === MilkTransactionType.Feeding) ||
                    (!isMilk && diaperItem?.type === DiaperTransactionType.Change) ? (
                      <ArrowDownRight className="size-3.5 inline" />
                    ) : (
                      <ArrowUpRight className="size-3.5 inline" />
                    )}
                    {isMilk
                      ? milkItem?.type === MilkTransactionType.Purchase
                        ? `+${milkItem.amountKg} kg`
                        : `-${Number((milkItem?.totalGrams ?? 0).toFixed(1))}g`
                      : diaperItem?.type === DiaperTransactionType.Purchase
                        ? `+${diaperItem.count}`
                        : "-1"}
                  </span>
                </div>
              </SwipeToDelete>
              {i < activities.length - 1 && <Separator />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { RecentActivities };
export type { ActivityItem };
