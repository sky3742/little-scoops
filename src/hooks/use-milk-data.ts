"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/toast";
import { useDemoMode } from "@/lib/demo-mode";
import { MilkTransactionType, UndoType } from "@/lib/enums";

interface StockData {
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

interface MilkTransaction {
  id: number;
  type: MilkTransactionType;
  amountKg?: number;
  scoops?: number;
  gramsPerScoop?: number;
  totalGrams?: number;
  createdAt: string;
}

function useMilkData() {
  const { toast } = useToast();
  const demo = useDemoMode();
  const [stock, setStock] = useState<StockData | null>(null);
  const [history, setHistory] = useState<MilkTransaction[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [stockRes, historyRes] = await Promise.all([
        fetch("/api/milk/stock"),
        fetch("/api/milk/history"),
      ]);
      if (!stockRes.ok || !historyRes.ok) throw new Error("Failed to fetch milk data");
      setStock(await stockRes.json());
      setHistory(await historyRes.json());
    } catch (error) {
      console.error("Error fetching milk data:", error);
      throw error;
    }
  }, []);

  const loadDemoData = useCallback(() => {
    if (!demo?.enabled) return;
    setStock(demo.milkStock);
    setHistory(demo.milkHistory);
  }, [demo]);

  const addPurchase = useCallback(
    async (amountKg: number) => {
      if (demo?.enabled) {
        toast("Demo mode — purchase recorded");
        return;
      }
      const res = await fetch("/api/milk/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountKg }),
      });
      if (!res.ok) throw new Error("Failed to add purchase");
      await fetchData();
      toast("Milk stock added");
    },
    [demo, fetchData, toast]
  );

  const addFeeding = useCallback(
    async (scoops: number, gramsPerScoop: number) => {
      if (demo?.enabled) {
        toast("Demo mode — feeding recorded");
        return;
      }
      const res = await fetch("/api/milk/feeding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scoops, gramsPerScoop }),
      });
      if (!res.ok) throw new Error("Failed to log feeding");
      await fetchData();
      toast("Feeding logged");
    },
    [demo, fetchData, toast]
  );

  const deleteEntry = useCallback(
    async (id: number, type: MilkTransactionType) => {
      if (demo?.enabled) {
        toast("Demo mode — entry deleted");
        return;
      }
      const endpoint =
        type === MilkTransactionType.Purchase
          ? `/api/milk/purchase/${id}`
          : `/api/milk/feeding/${id}`;
      const undoType = type === MilkTransactionType.Purchase ? UndoType.Purchase : UndoType.Feeding;
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchData();
      toast("Entry deleted", "success", {
        label: "Undo",
        onClick: async () => {
          try {
            const undoRes = await fetch(`/api/undo/${undoType}/${id}`, { method: "POST" });
            if (!undoRes.ok) throw new Error("Failed to undo");
            await fetchData();
            toast("Entry restored");
          } catch {
            toast("Failed to restore entry", "error");
          }
        },
      });
    },
    [demo, fetchData, toast]
  );

  return { stock, history, fetchData, loadDemoData, addPurchase, addFeeding, deleteEntry };
}

export { useMilkData };
export type { StockData, MilkTransaction };
