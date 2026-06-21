"use client";

interface DemoToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

function DemoToggle({ enabled, onToggle }: DemoToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="relative flex items-center h-6 w-20 rounded-full bg-muted border border-border cursor-pointer transition-colors"
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={`absolute left-1 top-1 h-4 w-8 rounded-full bg-foreground transition-transform duration-200 ease-in-out ${
          enabled ? "translate-x-9.5" : "translate-x-0"
        }`}
      />
      <span
        className={`relative z-10 w-10 text-center text-[9px] font-medium leading-4 transition-colors duration-200 ${
          enabled ? "text-muted-foreground" : "text-background"
        }`}
      >
        Live
      </span>
      <span
        className={`relative z-10 w-10 text-center text-[9px] font-medium leading-4 transition-colors duration-200 ${
          enabled ? "text-background" : "text-muted-foreground"
        }`}
      >
        Demo
      </span>
    </button>
  );
}

export { DemoToggle };
