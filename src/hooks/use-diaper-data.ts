"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/toast";
import { useDemoMode } from "@/lib/demo-mode";
import { DiaperTransactionType, DiaperChangeType, UndoType } from "@/lib/enums";

interface DiaperStockData {
  currentStock: number;
  avgDailyUsage: number;
  daysLeft: number | null;
  totalPurchased: number;
  totalUsed: number;
  typeBreakdown: Record<string, number>;
  babysitterStock: number;
  combinedStock: number;
  babysitterAvgDailyUsage: number;
  babysitterDaysLeft: number | null;
}

interface DiaperTransaction {
  id: number;
  type: DiaperTransactionType;
  count: number;
  changeType?: DiaperChangeType;
  changeDate?: string;
  createdAt: string;
}

function useDiaperData() {
  const { toast } = useToast();
  const demo = useDemoMode();
  const [stock, setStock] = useState<DiaperStockData | null>(null);
  const [history, setHistory] = useState<DiaperTransaction[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [stockRes, historyRes] = await Promise.all([
        fetch("/api/diaper/stock"),
        fetch("/api/diaper/history"),
      ]);
      if (!stockRes.ok || !historyRes.ok) throw new Error("Failed to fetch diaper data");
      setStock(await stockRes.json());
      setHistory(await historyRes.json());
    } catch (error) {
      console.error("Error fetching diaper data:", error);
      throw error;
    }
  }, []);

  const loadDemoData = useCallback(() => {
    if (!demo?.enabled) return;
    setStock(demo.diaperStock);
    setHistory(demo.diaperHistory);
  }, [demo]);

  const addPurchase = useCallback(
    async (count: number) => {
      if (demo?.enabled) {
        toast("Demo mode — diaper purchase recorded");
        return;
      }
      const res = await fetch("/api/diaper/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count }),
      });
      if (!res.ok) throw new Error("Failed to add diaper purchase");
      await fetchData();
      toast("Diapers added");
    },
    [demo, fetchData, toast]
  );

  const addChange = useCallback(
    async (type: DiaperChangeType) => {
      if (demo?.enabled) {
        toast("Demo mode — diaper change recorded");
        return;
      }
      const res = await fetch("/api/diaper/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 1, type }),
      });
      if (!res.ok) throw new Error("Failed to log diaper change");
      await fetchData();
      toast("Diaper change logged");
    },
    [demo, fetchData, toast]
  );

  const deleteEntry = useCallback(
    async (id: number, type: DiaperTransactionType) => {
      if (demo?.enabled) {
        toast("Demo mode — entry deleted");
        return;
      }
      const endpoint =
        type === DiaperTransactionType.Purchase
          ? `/api/diaper/purchase/${id}`
          : `/api/diaper/change/${id}`;
      const undoType =
        type === DiaperTransactionType.Purchase ? UndoType.DiaperPurchase : UndoType.DiaperChange;
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

  return { stock, history, fetchData, loadDemoData, addPurchase, addChange, deleteEntry };
}

export { useDiaperData };
export type { DiaperStockData, DiaperTransaction };
