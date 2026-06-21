# Babysitter Tracking Feature

## Overview

Track babysitter days and handoff events to split stock visibility between parent and babysitter. Weekdays are auto-babysitter days with exception toggle for holidays/sick days.

## Data Model

### New Tables

```ts
// Explicit stock transfers to babysitter
handoffs: {
  id: serial,
  itemType: "milk" | "diaper",
  amount: integer,          // grams (milk) or count (diapers)
  createdAt: timestamp,
}

// Days daughter is at babysitter (auto weekdays + exceptions)
babysitterDays: {
  id: serial,
  date: date,
  createdAt: timestamp,
}
```

### Stock Calculation

```
yourStock       = totalPurchased - parentConsumed
handedOff       = SUM(handoffs WHERE type = milk/diaper)
babysitterUsed  = rollingAvg × babysitterDayCount (last 7 days)
babysitterStock = handedOff - babysitterUsed
combined        = yourStock + babysitterStock
```

`rollingAvg` calculated from babysitter days only.

## API Routes

| Route                                   | Method | Purpose               |
| --------------------------------------- | ------ | --------------------- |
| `/api/babysitter/handoff/route.ts`      | POST   | Log a handoff event   |
| `/api/babysitter/handoff/route.ts`      | GET    | List handoffs         |
| `/api/babysitter/handoff/[id]/route.ts` | DELETE | Undo a handoff        |
| `/api/babysitter/days/route.ts`         | POST   | Mark a babysitter day |
| `/api/babysitter/days/route.ts`         | GET    | List days             |
| `/api/babysitter/days/[id]/route.ts`    | DELETE | Remove a day          |

## Frontend

- Split stock card: "You" / "Babysitter" sections
- Handoff sheet: type selector, amount input, recent handoffs list
- Babysitter day toggle: auto weekdays, exception for holidays
- Consumption rate display for babysitter

## Execution Order

1. Schema + migration
2. Handoff API routes
3. Babysitter day API routes
4. Stock calculation update
5. Frontend: handoff sheet + babysitter stock card
6. Frontend: babysitter day toggle
7. Tests
8. README update
