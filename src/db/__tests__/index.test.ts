import { describe, it, expect, vi } from "vitest";

vi.mock("@neondatabase/serverless", () => ({
  neon: vi.fn(() => vi.fn()),
}));

vi.mock("drizzle-orm/neon-http", () => ({
  drizzle: vi.fn(() => ({ select: vi.fn() })),
}));

describe("db", () => {
  it("exports db function", async () => {
    const { db } = await import("@/db");
    expect(typeof db).toBe("function");
  });

  it("returns a drizzle instance", async () => {
    vi.resetModules();
    const { db } = await import("@/db");
    const instance = db();
    expect(instance).toBeDefined();
    expect(instance).toHaveProperty("select");
  });
});
