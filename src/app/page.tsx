"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToastProvider, useToast } from "@/components/toast";
import { MilkPurchaseSheet } from "@/components/sheets/milk-purchase-sheet";
import { MilkFeedingSheet } from "@/components/sheets/milk-feeding-sheet";
import { DiaperPurchaseSheet } from "@/components/sheets/diaper-purchase-sheet";
import { DiaperChangeSheet } from "@/components/sheets/diaper-change-sheet";
import { HandoffSheet } from "@/components/sheets/handoff-sheet";
import { Header } from "@/components/sections/header";
import { StockOverview } from "@/components/sections/stock-overview";
import { BabysitterStock } from "@/components/sections/babysitter-stock";
import { Stats } from "@/components/sections/stats";
import { TodaysFeedings } from "@/components/sections/todays-feedings";
import { RecentActivities } from "@/components/sections/recent-activities";
import { BabysitterDays } from "@/components/sections/babysitter-days";
import { Export } from "@/components/sections/export";
import { useMilkData } from "@/hooks/use-milk-data";
import { useDiaperData } from "@/hooks/use-diaper-data";
import { useBabysitterData } from "@/hooks/use-babysitter-data";
import { RECENT_ACTIVITY_LIMIT } from "@/lib/constants";
import { useDemoMode } from "@/lib/demo-mode";
import { Domain } from "@/lib/enums";
import { AlertTriangle, Droplets, ShoppingCart, Plus, ArrowUpRight, Minus } from "lucide-react";

function Home() {
  const { toast } = useToast();
  const demo = useDemoMode();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const milk = useMilkData();
  const diaper = useDiaperData();
  const babysitter = useBabysitterData(milk.fetchData, diaper.fetchData);

  const [milkSheetOpen, setMilkSheetOpen] = useState(false);
  const [milkFeedingSheetOpen, setMilkFeedingSheetOpen] = useState(false);
  const [diaperSheetOpen, setDiaperSheetOpen] = useState(false);
  const [diaperChangeSheetOpen, setDiaperChangeSheetOpen] = useState(false);
  const [handoffSheetOpen, setHandoffSheetOpen] = useState(false);

  const { loadDemoData: loadMilkDemo, fetchData: fetchMilk } = milk;
  const { loadDemoData: loadDiaperDemo, fetchData: fetchDiaper } = diaper;
  const { loadDemoData: loadBabysitterDemo, fetchData: fetchBabysitter } = babysitter;

  useEffect(() => {
    async function load() {
      if (demo?.enabled) {
        loadMilkDemo();
        loadDiaperDemo();
        loadBabysitterDemo();
      } else {
        try {
          await Promise.all([fetchMilk(), fetchDiaper(), fetchBabysitter()]);
        } catch {
          setFetchError(true);
        }
      }
      setLoading(false);
    }
    load();
  }, [
    demo?.enabled,
    loadMilkDemo,
    loadDiaperDemo,
    loadBabysitterDemo,
    fetchMilk,
    fetchDiaper,
    fetchBabysitter,
  ]);

  const handleDelete = async (
    id: number,
    domain: Domain,
    type: Parameters<typeof milk.deleteEntry>[1] | Parameters<typeof diaper.deleteEntry>[1]
  ) => {
    try {
      if (domain === Domain.Milk)
        await milk.deleteEntry(id, type as Parameters<typeof milk.deleteEntry>[1]);
      else await diaper.deleteEntry(id, type as Parameters<typeof diaper.deleteEntry>[1]);
    } catch {
      toast("Failed to delete entry", "error");
    }
  };

  const recentActivity = [
    ...milk.history.slice(0, 3).map((item) => ({ ...item, _domain: Domain.Milk })),
    ...diaper.history.slice(0, 3).map((item) => ({ ...item, _domain: Domain.Diaper })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, RECENT_ACTIVITY_LIMIT);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (fetchError && !milk.stock && !diaper.stock) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3 px-4">
          <AlertTriangle className="size-10 text-destructive mx-auto" />
          <p className="text-lg font-semibold">Failed to load data</p>
          <p className="text-muted-foreground text-sm">Check your connection and try again.</p>
          <Button
            onClick={() => {
              setFetchError(false);
              setLoading(true);
              window.location.reload();
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      <Header demoEnabled={demo?.enabled ?? false} onToggleDemo={demo?.toggle ?? (() => {})} />

      <main className="max-w-lg mx-auto px-4 py-5 space-y-5">
        <StockOverview milkStock={milk.stock} diaperStock={diaper.stock} />
        <BabysitterStock milkStock={milk.stock} diaperStock={diaper.stock} />

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-auto py-3 flex-col gap-1"
            onClick={() => setMilkFeedingSheetOpen(true)}
          >
            <Droplets className="size-4 text-primary" />
            <span className="text-xs">Log Feeding</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-3 flex-col gap-1"
            onClick={() => setMilkSheetOpen(true)}
          >
            <ShoppingCart className="size-4 text-primary" />
            <span className="text-xs">Add Milk</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-3 flex-col gap-1"
            onClick={() => setDiaperSheetOpen(true)}
          >
            <Plus className="size-4 text-primary" />
            <span className="text-xs">Add Diapers</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-3 flex-col gap-1"
            onClick={() => setHandoffSheetOpen(true)}
          >
            <ArrowUpRight className="size-4 text-primary" />
            <span className="text-xs">Hand Off Pack</span>
          </Button>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setDiaperChangeSheetOpen(true)}
        >
          <Minus className="size-4" /> Log Diaper Change
        </Button>

        <Separator />
        <Stats milkStock={milk.stock} diaperStock={diaper.stock} />
        <Separator />
        <TodaysFeedings feedings={milk.history} />
        <Separator />
        <RecentActivities activities={recentActivity} onDelete={handleDelete} />
        <Separator />
        <BabysitterDays days={babysitter.days} onToggle={babysitter.toggleDay} />
        <Separator />
        <Export />
      </main>

      <MilkPurchaseSheet
        open={milkSheetOpen}
        onOpenChange={setMilkSheetOpen}
        onSubmit={milk.addPurchase}
      />
      <MilkFeedingSheet
        open={milkFeedingSheetOpen}
        onOpenChange={setMilkFeedingSheetOpen}
        onSubmit={milk.addFeeding}
      />
      <DiaperPurchaseSheet
        open={diaperSheetOpen}
        onOpenChange={setDiaperSheetOpen}
        onSubmit={diaper.addPurchase}
      />
      <DiaperChangeSheet
        open={diaperChangeSheetOpen}
        onOpenChange={setDiaperChangeSheetOpen}
        onSubmit={diaper.addChange}
      />
      <HandoffSheet
        open={handoffSheetOpen}
        onOpenChange={setHandoffSheetOpen}
        onSubmit={babysitter.addHandoff}
        onDelete={babysitter.deleteHandoff}
        handoffs={babysitter.handoffs}
      />
    </div>
  );
}

export default function HomeWithToast() {
  return (
    <ToastProvider>
      <Home />
    </ToastProvider>
  );
}
