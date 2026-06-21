"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

function Export() {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground">Export Data</h2>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="h-auto py-3 flex-col gap-1"
          onClick={() => window.open("/api/milk/export", "_blank")}
        >
          <Download className="size-4 text-primary" />
          <span className="text-xs">Milk CSV</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-3 flex-col gap-1"
          onClick={() => window.open("/api/export/diaper", "_blank")}
        >
          <Download className="size-4 text-primary" />
          <span className="text-xs">Diaper CSV</span>
        </Button>
      </div>
    </div>
  );
}

export { Export };
