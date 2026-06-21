"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { useToast } from "@/components/toast";
import { Minus, Sun, CloudRain, Droplet } from "lucide-react";
import { DiaperChangeType } from "@/lib/enums";

const diaperTypeLabel: Record<DiaperChangeType, string> = {
  [DiaperChangeType.Wet]: "Wet",
  [DiaperChangeType.Dirty]: "Dirty",
  [DiaperChangeType.Both]: "Wet & Dirty",
};

const diaperTypeIcon: Record<DiaperChangeType, React.ReactNode> = {
  [DiaperChangeType.Wet]: <Droplet className="size-3 text-blue-500" />,
  [DiaperChangeType.Dirty]: <CloudRain className="size-3 text-amber-600" />,
  [DiaperChangeType.Both]: <Sun className="size-3 text-purple-500" />,
};

interface DiaperChangeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (type: DiaperChangeType) => Promise<void>;
}

function DiaperChangeSheet({ open, onOpenChange, onSubmit }: DiaperChangeSheetProps) {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<DiaperChangeType>(DiaperChangeType.Wet);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(selectedType);
      onOpenChange(false);
    } catch {
      toast("Failed to log diaper change", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-xl max-w-lg mx-auto">
        <SheetHeader>
          <SheetTitle>Log Diaper Change</SheetTitle>
          <SheetDescription>What type of change?</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4 space-y-2">
          {Object.values(DiaperChangeType).map((t) => (
            <Button
              key={t}
              variant={selectedType === t ? "default" : "outline"}
              className="w-full justify-start gap-3"
              onClick={() => setSelectedType(t)}
            >
              {diaperTypeIcon[t]}
              {diaperTypeLabel[t]}
            </Button>
          ))}
        </div>
        <SheetFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Minus className="size-4" />
            )}
            Log Change
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export { DiaperChangeSheet, diaperTypeLabel, diaperTypeIcon };
