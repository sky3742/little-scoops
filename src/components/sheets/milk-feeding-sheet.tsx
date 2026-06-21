"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { useToast } from "@/components/toast";
import { Droplets } from "lucide-react";
import { GRAMS_PER_SCOOP_DEFAULT } from "@/lib/constants";

interface MilkFeedingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (scoops: number, gramsPerScoop: number) => Promise<void>;
}

function MilkFeedingSheet({ open, onOpenChange, onSubmit }: MilkFeedingSheetProps) {
  const { toast } = useToast();
  const [scoops, setScoops] = useState("");
  const [gramsPerScoop, setGramsPerScoop] = useState(String(GRAMS_PER_SCOOP_DEFAULT));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoops || parseInt(scoops) <= 0) return;
    setLoading(true);
    try {
      await onSubmit(parseInt(scoops), parseFloat(gramsPerScoop));
      setScoops("");
      onOpenChange(false);
    } catch {
      toast("Failed to log feeding", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-xl max-w-lg mx-auto">
        <SheetHeader>
          <SheetTitle>Log Feeding</SheetTitle>
          <SheetDescription>How many scoops did baby have?</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Number of Scoops</label>
            <Input
              type="number"
              min="1"
              value={scoops}
              onChange={(e) => setScoops(e.target.value)}
              placeholder="e.g. 10"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Grams per Scoop</label>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              value={gramsPerScoop}
              onChange={(e) => setGramsPerScoop(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Default: {GRAMS_PER_SCOOP_DEFAULT}g</p>
          </div>
          {scoops && gramsPerScoop && (
            <div className="bg-muted rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-sm font-semibold">
                {(parseInt(scoops) * parseFloat(gramsPerScoop)).toFixed(1)}g
              </span>
            </div>
          )}
          <SheetFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Droplets className="size-4" />
              )}
              Log Feeding
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export { MilkFeedingSheet };
