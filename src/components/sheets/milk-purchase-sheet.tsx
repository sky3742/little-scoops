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
import { ShoppingCart } from "lucide-react";

interface MilkPurchaseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (amountKg: number) => Promise<void>;
}

function MilkPurchaseSheet({ open, onOpenChange, onSubmit }: MilkPurchaseSheetProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      await onSubmit(parseFloat(amount));
      setAmount("");
      onOpenChange(false);
    } catch {
      toast("Failed to add milk stock", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-xl max-w-lg mx-auto">
        <SheetHeader>
          <SheetTitle>Add Milk Stock</SheetTitle>
          <SheetDescription>How much powder did you buy?</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (kg)</label>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 3"
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
                <ShoppingCart className="size-4" />
              )}
              Add Stock
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export { MilkPurchaseSheet };
