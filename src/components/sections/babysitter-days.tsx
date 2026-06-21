"use client";

import type { BabysitterDay } from "@/hooks/use-babysitter-data";

interface BabysitterDaysProps {
  days: BabysitterDay[];
  onToggle: (date: string) => void;
}

function BabysitterDays({ days, onToggle }: BabysitterDaysProps) {
  const weekdays: { date: string; day: string; label: string }[] = [];
  const d = new Date();
  while (weekdays.length < 5) {
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      weekdays.push({
        date: d.toISOString().split("T")[0],
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      });
    }
    d.setDate(d.getDate() + 1);
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground">Babysitter Days</h2>
      <p className="text-xs text-muted-foreground">
        Weekdays are auto-marked. Tap to toggle exceptions.
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {weekdays.map(({ date, day, label }) => {
          const isMarked = days.some((bd) => bd.date === date);
          return (
            <button
              key={date}
              onClick={() => onToggle(date)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isMarked
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <div>{day}</div>
              <div>{label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { BabysitterDays };
