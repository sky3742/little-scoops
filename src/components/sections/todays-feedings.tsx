"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Sunrise, Sun, Sunset, Moon } from "lucide-react";
import { MilkTransactionType } from "@/lib/enums";
import type { MilkTransaction } from "@/hooks/use-milk-data";

interface TodaysFeedingsProps {
  feedings: MilkTransaction[];
}

type TimePeriod = "morning" | "afternoon" | "evening" | "night";

const timePeriods: {
  key: TimePeriod;
  label: string;
  icon: React.ReactNode;
  hours: [number, number];
}[] = [
  {
    key: "morning",
    label: "Morning",
    icon: <Sunrise className="size-3.5 text-orange-500" />,
    hours: [6, 12],
  },
  {
    key: "afternoon",
    label: "Afternoon",
    icon: <Sun className="size-3.5 text-yellow-500" />,
    hours: [12, 18],
  },
  {
    key: "evening",
    label: "Evening",
    icon: <Sunset className="size-3.5 text-orange-700" />,
    hours: [18, 22],
  },
  {
    key: "night",
    label: "Night",
    icon: <Moon className="size-3.5 text-indigo-500" />,
    hours: [22, 6],
  },
];

function TodaysFeedings({ feedings }: TodaysFeedingsProps) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayFeedings = feedings.filter(
    (item) => item.type === MilkTransactionType.Feeding && new Date(item.createdAt) >= todayStart
  );

  const feedingByPeriod: Record<TimePeriod, number> = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
  };
  for (const f of todayFeedings) {
    const h = new Date(f.createdAt).getHours();
    for (const p of timePeriods) {
      const [start, end] = p.hours;
      if (start < end ? h >= start && h < end : h >= start || h < end) {
        feedingByPeriod[p.key]++;
        break;
      }
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs text-muted-foreground font-medium">
            Today&apos;s Feedings
          </CardTitle>
          <Clock className="size-3.5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {timePeriods.map((p) => (
            <div key={p.key} className="text-center space-y-1">
              <div className="flex justify-center">{p.icon}</div>
              <p className="text-xl font-semibold tracking-tight">{feedingByPeriod[p.key]}</p>
              <p className="text-[10px] text-muted-foreground">{p.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { TodaysFeedings };
