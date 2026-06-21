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
import { ArrowUpRight, Droplets, Baby } from "lucide-react";
import { Domain } from "@/lib/enums";
import type { Handoff } from "@/hooks/use-babysitter-data";

interface HandoffSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (itemType: Domain, amount: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  handoffs: Handoff[];
}

function HandoffSheet({ open, onOpenChange, onSubmit, onDelete, handoffs }: HandoffSheetProps) {
  const { toast } = useToast();
  const [itemType, setItemType] = useState<Domain>(Domain.Milk);
  const [amount, setAmount] = useState("600");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(amount);
    if (!parsed || parsed <= 0) return;
    setLoading(true);
    try {
      await onSubmit(itemType, parsed);
      setAmount("");
      onOpenChange(false);
    } catch {
      toast("Failed to log handoff", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await onDelete(id);
    } catch {
      toast("Failed to delete handoff", "error");
    }
  };

  const handleTypeSwitch = (type: Domain) => {
    setItemType(type);
    setAmount(type === Domain.Milk ? "600" : "36");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-xl max-w-lg mx-auto">
        <SheetHeader>
          <SheetTitle>Hand Off Pack</SheetTitle>
          <SheetDescription>How much are you giving to the babysitter?</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Item</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={itemType === Domain.Milk ? "default" : "outline"}
                onClick={() => handleTypeSwitch(Domain.Milk)}
              >
                <Droplets className="size-4 mr-1" /> Milk (g)
              </Button>
              <Button
                type="button"
                variant={itemType === Domain.Diaper ? "default" : "outline"}
                onClick={() => handleTypeSwitch(Domain.Diaper)}
              >
                <Baby className="size-4 mr-1" /> Diapers
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Amount ({itemType === Domain.Milk ? "grams" : "count"})
            </label>
            <Input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={itemType === Domain.Milk ? "e.g. 600" : "e.g. 36"}
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
                <ArrowUpRight className="size-4" />
              )}
              Log Handoff
            </Button>
          </SheetFooter>
        </form>
        {handoffs.length > 0 && (
          <div className="px-4 pb-4">
            <h4 className="text-xs text-muted-foreground mb-2">Handoff History</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {handoffs.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-border/50 last:border-0"
                >
                  <div>
                    <span className="font-medium">
                      {h.itemType === Domain.Milk ? `${h.amount}g` : `${h.amount} pcs`}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {new Date(h.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-destructive"
                    onClick={() => handleDelete(h.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export { HandoffSheet };
