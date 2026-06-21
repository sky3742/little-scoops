"use client";

import { Badge } from "@/components/ui/badge";
import { DemoToggle } from "@/components/demo-toggle";

interface HeaderProps {
  demoEnabled: boolean;
  onToggleDemo: () => void;
}

function Header({ demoEnabled, onToggleDemo }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">LittleScoops</h1>
        <div className="flex items-center gap-2">
          <DemoToggle enabled={demoEnabled} onToggle={onToggleDemo} />
          <Badge variant="secondary" className="text-[10px]">
            v1.1
          </Badge>
        </div>
      </div>
    </header>
  );
}

export { Header };
