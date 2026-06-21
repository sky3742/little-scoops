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
import { Plus } from "lucide-react";

interface DiaperPurchaseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (count: number) => Promise<void>;
}

function DiaperPurchaseSheet({ open, onOpenChange, onSubmit }: DiaperPurchaseSheetProps) {
  const { toast } = useToast();
  const [count, setCount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!count || parseInt(count) <= 0) return;
    setLoading(true);
    try {
      await onSubmit(parseInt(count));
      setCount("");
      onOpenChange(false);
    } catch {
      toast("Failed to add diapers", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-xl max-w-lg mx-auto">
        <SheetHeader>
          <SheetTitle>Add Diapers</SheetTitle>
          <SheetDescription>How many did you buy?</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Number of Diapers</label>
            <Input
              type="number"
              min="1"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="e.g. 96"
              required
            />
          </div>
          <SheetFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Add Stock
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export { DiaperPurchaseSheet };
