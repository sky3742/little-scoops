"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/toast";
import { useDemoMode } from "@/lib/demo-mode";
import { Domain } from "@/lib/enums";

interface Handoff {
  id: number;
  itemType: Domain;
  amount: number;
  createdAt: string;
}

interface BabysitterDay {
  id: number;
  date: string;
  createdAt: string;
}

function useBabysitterData(refreshMilk?: () => Promise<void>, refreshDiaper?: () => Promise<void>) {
  const { toast } = useToast();
  const demo = useDemoMode();
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [days, setDays] = useState<BabysitterDay[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [handoffsRes, daysRes] = await Promise.all([
        fetch("/api/babysitter/handoff"),
        fetch("/api/babysitter/days"),
      ]);
      if (!handoffsRes.ok || !daysRes.ok) throw new Error("Failed to fetch babysitter data");
      const handoffsData = await handoffsRes.json();
      const daysData = await daysRes.json();
      setHandoffs(Array.isArray(handoffsData) ? handoffsData : []);
      setDays(Array.isArray(daysData) ? daysData : []);
    } catch (error) {
      console.error("Error fetching babysitter data:", error);
    }
  }, []);

  const loadDemoData = useCallback(() => {
    if (!demo?.enabled) return;
    setHandoffs(demo.handoffs);
    setDays(demo.babysitterDays);
  }, [demo]);

  const addHandoff = useCallback(
    async (itemType: Domain, amount: number) => {
      if (demo?.enabled) {
        toast("Demo mode — handoff recorded");
        return;
      }
      const res = await fetch("/api/babysitter/handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType, amount }),
      });
      if (!res.ok) throw new Error("Failed to log handoff");
      await fetchData();
      if (itemType === Domain.Milk) refreshMilk?.();
      else refreshDiaper?.();
      toast("Handoff logged");
    },
    [demo, fetchData, refreshMilk, refreshDiaper, toast]
  );

  const deleteHandoff = useCallback(
    async (id: number) => {
      if (demo?.enabled) {
        toast("Demo mode — handoff removed");
        return;
      }
      const res = await fetch(`/api/babysitter/handoff/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete handoff");
      await fetchData();
      refreshMilk?.();
      refreshDiaper?.();
      toast("Handoff removed");
    },
    [demo, fetchData, refreshMilk, refreshDiaper, toast]
  );

  const toggleDay = useCallback(
    async (date: string) => {
      if (demo?.enabled) {
        toast("Demo mode — babysitter day toggled");
        return;
      }
      const existing = days.find((d) => d.date === date);
      try {
        if (existing) {
          const res = await fetch(`/api/babysitter/days/${existing.id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to remove day");
        } else {
          const res = await fetch("/api/babysitter/days", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date }),
          });
          if (!res.ok) throw new Error("Failed to add day");
        }
        await fetchData();
      } catch {
        toast("Failed to update babysitter day", "error");
      }
    },
    [demo, days, fetchData, toast]
  );

  return { handoffs, days, fetchData, loadDemoData, addHandoff, deleteHandoff, toggleDay };
}

export { useBabysitterData };
export type { Handoff, BabysitterDay };
