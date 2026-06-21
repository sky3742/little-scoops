"use client";

import * as React from "react";
import { MilkTransactionType, DiaperTransactionType, DiaperChangeType, Domain } from "@/lib/enums";

interface DemoStockData {
  currentStock: number;
  avgDailyUsage: number;
  daysLeft: number | null;
  totalPurchased: number;
  totalUsed: number;
  babysitterStock: number;
  combinedStock: number;
  babysitterAvgDailyUsage: number;
  babysitterDaysLeft: number | null;
}

interface DemoDiaperStockData extends DemoStockData {
  typeBreakdown: Record<string, number>;
}

interface DemoMilkTransaction {
  id: number;
  type: MilkTransactionType;
  amountKg?: number;
  scoops?: number;
  gramsPerScoop?: number;
  totalGrams?: number;
  createdAt: string;
}

interface DemoDiaperTransaction {
  id: number;
  type: DiaperTransactionType;
  count: number;
  changeType?: DiaperChangeType;
  changeDate?: string;
  createdAt: string;
}

interface DemoHandoff {
  id: number;
  itemType: Domain;
  amount: number;
  createdAt: string;
}

interface DemoBabysitterDay {
  id: number;
  date: string;
  createdAt: string;
}

interface DemoModeContextValue {
  enabled: boolean;
  toggle: () => void;
  milkStock: DemoStockData;
  diaperStock: DemoDiaperStockData;
  milkHistory: DemoMilkTransaction[];
  diaperHistory: DemoDiaperTransaction[];
  handoffs: DemoHandoff[];
  babysitterDays: DemoBabysitterDay[];
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function generateDemoData(): Omit<DemoModeContextValue, "enabled" | "toggle"> {
  const GRAMS_PER_SCOOP = 4.3;
  const HISTORY_DAYS = 21;

  // Milk: 3 purchases totaling 2.8kg, ~110g/day usage → ~500g left (~4-5 days)
  const milkPurchases: DemoMilkTransaction[] = [
    { id: 101, type: MilkTransactionType.Purchase, amountKg: 1, createdAt: daysAgo(18) },
    { id: 102, type: MilkTransactionType.Purchase, amountKg: 0.8, createdAt: daysAgo(10) },
    { id: 103, type: MilkTransactionType.Purchase, amountKg: 1, createdAt: daysAgo(3) },
  ];

  const milkFeedings: DemoMilkTransaction[] = [];
  let feedingId = 201;
  for (let day = 0; day < HISTORY_DAYS; day++) {
    const feedingsPerDay = day === 0 ? 5 : Math.floor(Math.random() * 2) + 5;
    for (let f = 0; f < feedingsPerDay; f++) {
      const scoops = Math.floor(Math.random() * 2) + 3;
      milkFeedings.push({
        id: feedingId++,
        type: MilkTransactionType.Feeding,
        scoops,
        gramsPerScoop: GRAMS_PER_SCOOP,
        totalGrams: Math.round(scoops * GRAMS_PER_SCOOP * 10) / 10,
        createdAt: (() => {
          const d = new Date();
          d.setDate(d.getDate() - day);
          d.setHours(6 + f * 3 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
          return d.toISOString();
        })(),
      });
    }
  }

  const totalMilkPurchased = milkPurchases.reduce((s, p) => s + (p.amountKg ?? 0) * 1000, 0);
  const totalMilkUsed = milkFeedings.reduce((s, f) => s + (f.totalGrams ?? 0), 0);
  const milkCurrentStock = Math.round(totalMilkPurchased - totalMilkUsed);
  const milkAvgDaily = Math.round(totalMilkUsed / HISTORY_DAYS);
  const milkDaysLeft = milkAvgDaily > 0 ? Math.round(milkCurrentStock / milkAvgDaily) : null;

  const milkStock: DemoStockData = {
    currentStock: milkCurrentStock,
    avgDailyUsage: milkAvgDaily,
    daysLeft: milkDaysLeft,
    totalPurchased: totalMilkPurchased,
    totalUsed: Math.round(totalMilkUsed),
    babysitterStock: 400,
    combinedStock: milkCurrentStock + 400,
    babysitterAvgDailyUsage: 120,
    babysitterDaysLeft: 3,
  };

  // Diapers: 3 purchases totaling 180, ~6/day usage → ~60 left (~10 days)
  const diaperPurchases: DemoDiaperTransaction[] = [
    { id: 301, type: DiaperTransactionType.Purchase, count: 72, createdAt: daysAgo(19) },
    { id: 302, type: DiaperTransactionType.Purchase, count: 72, createdAt: daysAgo(12) },
    { id: 303, type: DiaperTransactionType.Purchase, count: 36, createdAt: daysAgo(4) },
  ];

  const diaperChanges: DemoDiaperTransaction[] = [];
  let diaperId = 401;
  const changeTypes: DiaperChangeType[] = [
    DiaperChangeType.Wet,
    DiaperChangeType.Dirty,
    DiaperChangeType.Both,
  ];
  for (let day = 0; day < HISTORY_DAYS; day++) {
    const changesPerDay = day === 0 ? 5 : Math.floor(Math.random() * 3) + 5;
    for (let c = 0; c < changesPerDay; c++) {
      diaperChanges.push({
        id: diaperId++,
        type: DiaperTransactionType.Change,
        count: 1,
        changeType: changeTypes[Math.floor(Math.random() * 3)],
        createdAt: (() => {
          const d = new Date();
          d.setDate(d.getDate() - day);
          d.setHours(7 + c * 3 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
          return d.toISOString();
        })(),
      });
    }
  }

  const totalDiaperPurchased = diaperPurchases.reduce((s, p) => s + p.count, 0);
  const totalDiaperUsed = diaperChanges.reduce((s, c) => s + c.count, 0);
  const diaperCurrentStock = totalDiaperPurchased - totalDiaperUsed;
  const diaperAvgDaily = Math.round(totalDiaperUsed / HISTORY_DAYS);
  const diaperDaysLeft =
    diaperAvgDaily > 0 ? Math.round(diaperCurrentStock / diaperAvgDaily) : null;

  const typeBreakdown: Record<string, number> = {};
  for (const c of diaperChanges) {
    if (c.changeType) typeBreakdown[c.changeType] = (typeBreakdown[c.changeType] || 0) + 1;
  }

  const diaperStock: DemoDiaperStockData = {
    currentStock: diaperCurrentStock,
    avgDailyUsage: diaperAvgDaily,
    daysLeft: diaperDaysLeft,
    totalPurchased: totalDiaperPurchased,
    totalUsed: totalDiaperUsed,
    typeBreakdown,
    babysitterStock: 24,
    combinedStock: diaperCurrentStock + 24,
    babysitterAvgDailyUsage: 8,
    babysitterDaysLeft: 3,
  };

  const handoffs: DemoHandoff[] = [
    { id: 501, itemType: Domain.Milk, amount: 600, createdAt: daysAgo(5) },
    { id: 502, itemType: Domain.Diaper, amount: 36, createdAt: daysAgo(5) },
    { id: 503, itemType: Domain.Milk, amount: 300, createdAt: daysAgo(1) },
  ];

  const babysitterDays: DemoBabysitterDay[] = [];
  let bdId = 601;
  const d = new Date();
  let count = 0;
  while (count < 2) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    babysitterDays.push({
      id: bdId++,
      date: d.toISOString().split("T")[0],
      createdAt: daysAgo(0),
    });
    count++;
  }

  return {
    milkStock,
    diaperStock,
    milkHistory: [...milkPurchases, ...milkFeedings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    diaperHistory: [...diaperPurchases, ...diaperChanges].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    handoffs,
    babysitterDays,
  };
}

const DemoModeContext = React.createContext<DemoModeContextValue | null>(null);

function useDemoMode() {
  return React.useContext(DemoModeContext);
}

function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = React.useState(false);
  const [data] = React.useState(() => generateDemoData());

  const toggle = React.useCallback(() => setEnabled((prev) => !prev), []);

  const value = React.useMemo(() => ({ ...data, enabled, toggle }), [data, enabled, toggle]);

  return <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>;
}

export { DemoModeProvider, useDemoMode };
export type {
  DemoStockData,
  DemoDiaperStockData,
  DemoMilkTransaction,
  DemoDiaperTransaction,
  DemoHandoff,
  DemoBabysitterDay,
};
