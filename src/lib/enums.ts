export enum Domain {
  Milk = "milk",
  Diaper = "diaper",
}

export enum MilkTransactionType {
  Purchase = "purchase",
  Feeding = "feeding",
}

export enum DiaperTransactionType {
  Purchase = "purchase",
  Change = "change",
}

export enum DiaperChangeType {
  Wet = "wet",
  Dirty = "dirty",
  Both = "both",
}

export enum UndoType {
  Purchase = "purchase",
  Feeding = "feeding",
  DiaperPurchase = "diaper-purchase",
  DiaperChange = "diaper-change",
}
