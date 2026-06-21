import { pgTable, serial, decimal, integer, timestamp, date, pgEnum } from "drizzle-orm/pg-core";

export const milkPurchases = pgTable("milk_purchases", {
  id: serial("id").primaryKey(),
  amountKg: decimal("amount_kg", { precision: 10, scale: 3 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const milkFeedings = pgTable("milk_feedings", {
  id: serial("id").primaryKey(),
  scoops: integer("scoops").notNull(),
  gramsPerScoop: decimal("grams_per_scoop", {
    precision: 5,
    scale: 2,
  })
    .default("4.30")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const diaperPurchases = pgTable("diaper_purchases", {
  id: serial("id").primaryKey(),
  count: integer("count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const diaperChangeTypeEnum = pgEnum("diaper_change_type", ["wet", "dirty", "both"]);

export const diaperChanges = pgTable("diaper_changes", {
  id: serial("id").primaryKey(),
  count: integer("count").default(1).notNull(),
  type: diaperChangeTypeEnum("type").default("wet").notNull(),
  changeDate: date("change_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const handoffItemTypeEnum = pgEnum("handoff_item_type", ["milk", "diaper"]);

export const handoffs = pgTable("handoffs", {
  id: serial("id").primaryKey(),
  itemType: handoffItemTypeEnum("item_type").notNull(),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const babysitterDays = pgTable("babysitter_days", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
