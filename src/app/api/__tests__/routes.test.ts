import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/db", () => ({
  db: vi.fn(),
}));

function mockDbChain(result: unknown) {
  return {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([result]),
    delete: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    groupBy: vi.fn().mockReturnThis(),
  };
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("POST /api/milk/feeding", () => {
  it("creates a feeding record", async () => {
    const chain = mockDbChain({ id: 1, scoops: 5, gramsPerScoop: "4.30" });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../milk/feeding/route");
    const req = new Request("http://localhost/api/milk/feeding", {
      method: "POST",
      body: JSON.stringify({ scoops: 5, gramsPerScoop: 4.3 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.scoops).toBe(5);
  });

  it("returns 400 when scoops is missing", async () => {
    const { POST } = await import("../milk/feeding/route");
    const req = new Request("http://localhost/api/milk/feeding", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when scoops <= 0", async () => {
    const { POST } = await import("../milk/feeding/route");
    const req = new Request("http://localhost/api/milk/feeding", {
      method: "POST",
      body: JSON.stringify({ scoops: 0 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 on db error", async () => {
    const chain = mockDbChain({});
    chain.values.mockImplementation(() => {
      throw new Error("db error");
    });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../milk/feeding/route");
    const req = new Request("http://localhost/api/milk/feeding", {
      method: "POST",
      body: JSON.stringify({ scoops: 5 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});

describe("POST /api/milk/purchase", () => {
  it("creates a purchase record", async () => {
    const chain = mockDbChain({ id: 1, amountKg: "2.500" });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../milk/purchase/route");
    const req = new Request("http://localhost/api/milk/purchase", {
      method: "POST",
      body: JSON.stringify({ amountKg: 2.5 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.amountKg).toBe("2.500");
  });

  it("returns 400 when amountKg is missing", async () => {
    const { POST } = await import("../milk/purchase/route");
    const req = new Request("http://localhost/api/milk/purchase", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 on db error", async () => {
    const chain = mockDbChain({});
    chain.values.mockImplementation(() => {
      throw new Error("db error");
    });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../milk/purchase/route");
    const req = new Request("http://localhost/api/milk/purchase", {
      method: "POST",
      body: JSON.stringify({ amountKg: 2.5 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});

describe("POST /api/diaper/change", () => {
  it("creates a diaper change record", async () => {
    const chain = mockDbChain({ id: 1, count: 1, type: "wet" });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../diaper/change/route");
    const req = new Request("http://localhost/api/diaper/change", {
      method: "POST",
      body: JSON.stringify({ count: 1, type: "wet" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.count).toBe(1);
  });

  it("returns 400 for invalid type", async () => {
    const { POST } = await import("../diaper/change/route");
    const req = new Request("http://localhost/api/diaper/change", {
      method: "POST",
      body: JSON.stringify({ count: 1, type: "invalid" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("defaults type to wet when not provided", async () => {
    const chain = mockDbChain({ id: 1, count: 1, type: "wet" });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../diaper/change/route");
    const req = new Request("http://localhost/api/diaper/change", {
      method: "POST",
      body: JSON.stringify({ count: 1 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.count).toBe(1);
  });

  it("returns 500 on db error", async () => {
    const chain = mockDbChain({});
    chain.values.mockImplementation(() => {
      throw new Error("db error");
    });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../diaper/change/route");
    const req = new Request("http://localhost/api/diaper/change", {
      method: "POST",
      body: JSON.stringify({ count: 1, type: "wet" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});

describe("POST /api/diaper/purchase", () => {
  it("creates a diaper purchase record", async () => {
    const chain = mockDbChain({ id: 1, count: 48 });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../diaper/purchase/route");
    const req = new Request("http://localhost/api/diaper/purchase", {
      method: "POST",
      body: JSON.stringify({ count: 48 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.count).toBe(48);
  });

  it("returns 400 when count is missing", async () => {
    const { POST } = await import("../diaper/purchase/route");
    const req = new Request("http://localhost/api/diaper/purchase", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 on db error", async () => {
    const chain = mockDbChain({});
    chain.values.mockImplementation(() => {
      throw new Error("db error");
    });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../diaper/purchase/route");
    const req = new Request("http://localhost/api/diaper/purchase", {
      method: "POST",
      body: JSON.stringify({ count: 48 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});

function makeThenable(result: unknown) {
  const obj = {
    then: (resolve: (value: unknown) => void) => resolve(result),
    where: vi.fn().mockReturnValue({
      then: (resolve: (value: unknown) => void) => resolve(result),
      groupBy: vi.fn().mockReturnValue({
        then: (resolve: (value: unknown) => void) => resolve(result),
      }),
    }),
  };
  return obj;
}

describe("GET /api/milk/stock", () => {
  it("returns stock data", async () => {
    const fromResults = [
      makeThenable([{ total: "5000" }]),
      makeThenable([{ total: "2500" }]),
      makeThenable([{ totalGrams: "210", dayCount: "3" }]),
      makeThenable([{ total: "1200" }]),
      makeThenable([{ count: "2" }]),
    ];
    let callIndex = 0;
    const chain = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockImplementation(() => fromResults[callIndex++]),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../milk/stock/route");
    const res = await GET();
    const data = await res.json();

    expect(data).toHaveProperty("currentStock");
    expect(data).toHaveProperty("daysLeft");
    expect(data).toHaveProperty("babysitterStock");
    expect(data).toHaveProperty("combinedStock");
  });

  it("returns 500 on db error", async () => {
    const chain = {
      select: vi.fn().mockImplementation(() => {
        throw new Error("db error");
      }),
      from: vi.fn(),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../milk/stock/route");
    const res = await GET();
    expect(res.status).toBe(500);
  });

  it("returns null daysLeft when no recent feedings", async () => {
    const fromResults = [
      makeThenable([{ total: "5000" }]),
      makeThenable([{ total: "2500" }]),
      makeThenable([{ totalGrams: "0", dayCount: "0" }]),
      makeThenable([{ total: "0" }]),
      makeThenable([{ count: "0" }]),
    ];
    let callIndex = 0;
    const chain = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockImplementation(() => fromResults[callIndex++]),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../milk/stock/route");
    const res = await GET();
    const data = await res.json();

    expect(data.daysLeft).toBeNull();
    expect(data.avgDailyUsage).toBe(0);
  });
});

describe("GET /api/diaper/stock", () => {
  it("returns diaper stock data", async () => {
    const fromResults = [
      makeThenable([{ total: "100" }]),
      makeThenable([{ total: "20" }]),
      makeThenable([{ totalCount: "35", dayCount: "5" }]),
      makeThenable([
        { type: "wet", total: "20" },
        { type: "dirty", total: "10" },
        { type: "both", total: "5" },
      ]),
      makeThenable([{ total: "36" }]),
      makeThenable([{ count: "2" }]),
    ];
    let callIndex = 0;
    const chain = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockImplementation(() => fromResults[callIndex++]),
      groupBy: vi.fn().mockReturnThis(),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../diaper/stock/route");
    const res = await GET();
    const data = await res.json();

    expect(data).toHaveProperty("currentStock");
    expect(data).toHaveProperty("daysLeft");
    expect(data).toHaveProperty("babysitterStock");
    expect(data).toHaveProperty("combinedStock");
  });

  it("returns 500 on db error", async () => {
    const chain = {
      select: vi.fn().mockImplementation(() => {
        throw new Error("db error");
      }),
      from: vi.fn(),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../diaper/stock/route");
    const res = await GET();
    expect(res.status).toBe(500);
  });

  it("returns null daysLeft when no recent changes", async () => {
    const fromResults = [
      makeThenable([{ total: "100" }]),
      makeThenable([{ total: "20" }]),
      makeThenable([{ totalCount: "0", dayCount: "0" }]),
      makeThenable([]),
      makeThenable([{ total: "0" }]),
      makeThenable([{ count: "0" }]),
    ];
    let callIndex = 0;
    const chain = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockImplementation(() => fromResults[callIndex++]),
      groupBy: vi.fn().mockReturnThis(),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../diaper/stock/route");
    const res = await GET();
    const data = await res.json();

    expect(data.daysLeft).toBeNull();
    expect(data.avgDailyUsage).toBe(0);
  });
});

describe("GET /api/milk/history", () => {
  it("returns combined history", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue([]),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../milk/history/route");
    const res = await GET();
    const data = await res.json();

    expect(Array.isArray(data)).toBe(true);
  });

  it("combines and sorts purchase and feeding history", async () => {
    const purchases = [{ id: 1, type: "2.5", createdAt: "2026-05-01T10:00:00Z" }];
    const feedings = [
      { id: 2, scoops: 5, gramsPerScoop: "4.30", createdAt: "2026-05-02T10:00:00Z" },
    ];
    const chain = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValueOnce(purchases).mockResolvedValueOnce(feedings),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../milk/history/route");
    const res = await GET();
    const data = await res.json();

    expect(data).toHaveLength(2);
    expect(data[0].type).toBe("feeding");
    expect(data[1].type).toBe("purchase");
  });

  it("returns 500 on db error", async () => {
    const chain = {
      select: vi.fn().mockImplementation(() => {
        throw new Error("db error");
      }),
      from: vi.fn(),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../milk/history/route");
    const res = await GET();
    expect(res.status).toBe(500);
  });
});

describe("GET /api/diaper/history", () => {
  it("returns combined diaper history", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue([]),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../diaper/history/route");
    const res = await GET();
    const data = await res.json();

    expect(Array.isArray(data)).toBe(true);
  });

  it("combines and sorts purchase and change history", async () => {
    const purchases = [{ id: 1, count: 48, createdAt: "2026-05-01T10:00:00Z" }];
    const changes = [
      {
        id: 2,
        count: 1,
        changeType: "wet",
        changeDate: "2026-05-02",
        createdAt: "2026-05-02T10:00:00Z",
      },
    ];
    const chain = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValueOnce(purchases).mockResolvedValueOnce(changes),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../diaper/history/route");
    const res = await GET();
    const data = await res.json();

    expect(data).toHaveLength(2);
    expect(data[0].type).toBe("change");
    expect(data[1].type).toBe("purchase");
  });

  it("returns 500 on db error", async () => {
    const chain = {
      select: vi.fn().mockImplementation(() => {
        throw new Error("db error");
      }),
      from: vi.fn(),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../diaper/history/route");
    const res = await GET();
    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/milk/purchase/[id]", () => {
  it("soft deletes a purchase record", async () => {
    const chain = mockDbChain({ id: 1, amountKg: "2.500" });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { DELETE } = await import("../milk/purchase/[id]/route");
    const req = new Request("http://localhost/api/milk/purchase/1");
    const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe(1);
    expect(chain.update).toHaveBeenCalled();
    expect(chain.set).toHaveBeenCalledWith(
      expect.objectContaining({ deletedAt: expect.any(Date) })
    );
  });

  it("returns 400 for invalid id", async () => {
    const { DELETE } = await import("../milk/purchase/[id]/route");
    const req = new Request("http://localhost/api/milk/purchase/abc");
    const res = await DELETE(req, { params: Promise.resolve({ id: "abc" }) });
    expect(res.status).toBe(400);
  });

  it("returns 404 when not found", async () => {
    const chain = mockDbChain([]);
    chain.returning.mockResolvedValue([]);
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { DELETE } = await import("../milk/purchase/[id]/route");
    const req = new Request("http://localhost/api/milk/purchase/999");
    const res = await DELETE(req, { params: Promise.resolve({ id: "999" }) });
    expect(res.status).toBe(404);
  });

  it("returns 500 on db error", async () => {
    const chain = mockDbChain({});
    chain.update.mockImplementation(() => {
      throw new Error("db error");
    });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { DELETE } = await import("../milk/purchase/[id]/route");
    const req = new Request("http://localhost/api/milk/purchase/1");
    const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/milk/feeding/[id]", () => {
  it("soft deletes a feeding record", async () => {
    const chain = mockDbChain({ id: 1, scoops: 5 });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { DELETE } = await import("../milk/feeding/[id]/route");
    const req = new Request("http://localhost/api/milk/feeding/1");
    const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe(1);
    expect(chain.update).toHaveBeenCalled();
  });

  it("returns 400 for invalid id", async () => {
    const { DELETE } = await import("../milk/feeding/[id]/route");
    const req = new Request("http://localhost/api/milk/feeding/abc");
    const res = await DELETE(req, { params: Promise.resolve({ id: "abc" }) });
    expect(res.status).toBe(400);
  });

  it("returns 404 when not found", async () => {
    const chain = mockDbChain([]);
    chain.returning.mockResolvedValue([]);
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { DELETE } = await import("../milk/feeding/[id]/route");
    const req = new Request("http://localhost/api/milk/feeding/999");
    const res = await DELETE(req, { params: Promise.resolve({ id: "999" }) });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/diaper/purchase/[id]", () => {
  it("soft deletes a diaper purchase record", async () => {
    const chain = mockDbChain({ id: 1, count: 48 });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { DELETE } = await import("../diaper/purchase/[id]/route");
    const req = new Request("http://localhost/api/diaper/purchase/1");
    const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe(1);
    expect(chain.update).toHaveBeenCalled();
  });

  it("returns 400 for invalid id", async () => {
    const { DELETE } = await import("../diaper/purchase/[id]/route");
    const req = new Request("http://localhost/api/diaper/purchase/abc");
    const res = await DELETE(req, { params: Promise.resolve({ id: "abc" }) });
    expect(res.status).toBe(400);
  });

  it("returns 404 when not found", async () => {
    const chain = mockDbChain([]);
    chain.returning.mockResolvedValue([]);
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { DELETE } = await import("../diaper/purchase/[id]/route");
    const req = new Request("http://localhost/api/diaper/purchase/999");
    const res = await DELETE(req, { params: Promise.resolve({ id: "999" }) });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/diaper/change/[id]", () => {
  it("soft deletes a diaper change record", async () => {
    const chain = mockDbChain({ id: 1, count: 1 });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { DELETE } = await import("../diaper/change/[id]/route");
    const req = new Request("http://localhost/api/diaper/change/1");
    const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe(1);
    expect(chain.update).toHaveBeenCalled();
  });

  it("returns 400 for invalid id", async () => {
    const { DELETE } = await import("../diaper/change/[id]/route");
    const req = new Request("http://localhost/api/diaper/change/abc");
    const res = await DELETE(req, { params: Promise.resolve({ id: "abc" }) });
    expect(res.status).toBe(400);
  });

  it("returns 404 when not found", async () => {
    const chain = mockDbChain([]);
    chain.returning.mockResolvedValue([]);
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { DELETE } = await import("../diaper/change/[id]/route");
    const req = new Request("http://localhost/api/diaper/change/999");
    const res = await DELETE(req, { params: Promise.resolve({ id: "999" }) });
    expect(res.status).toBe(404);
  });
});

describe("GET /api/milk/export", () => {
  it("returns CSV with header and data rows", async () => {
    const purchases = [{ createdAt: "2026-05-01T10:00:00Z", amountKg: "3.000" }];
    const feedings = [{ createdAt: "2026-05-02T10:00:00Z", scoops: 5, gramsPerScoop: "4.30" }];
    const chain = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValueOnce(purchases).mockResolvedValueOnce(feedings),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../milk/export/route");
    const res = await GET();

    expect(res.headers.get("Content-Type")).toBe("text/csv");
    expect(res.headers.get("Content-Disposition")).toContain("little-scoops-milk-");
    const body = await res.text();
    expect(body).toContain('"Date"');
    expect(body).toContain("Purchase");
  });

  it("returns 500 on db error", async () => {
    const chain = {
      select: vi.fn().mockImplementation(() => {
        throw new Error("db error");
      }),
      from: vi.fn(),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../milk/export/route");
    const res = await GET();
    expect(res.status).toBe(500);
  });
});

describe("GET /api/export/diaper", () => {
  it("returns CSV with header and data rows", async () => {
    const purchases = [{ createdAt: "2026-05-01T10:00:00Z", count: 48 }];
    const changes = [{ createdAt: "2026-05-02T10:00:00Z", count: 1, type: "wet" }];
    const chain = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValueOnce(purchases).mockResolvedValueOnce(changes),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../export/diaper/route");
    const res = await GET();

    expect(res.headers.get("Content-Type")).toBe("text/csv");
    expect(res.headers.get("Content-Disposition")).toContain("little-scoops-diaper-");
    const body = await res.text();
    expect(body).toContain('"Date"');
    expect(body).toContain("Purchase");
    expect(body).toContain("Change");
  });

  it("returns 500 on db error", async () => {
    const chain = {
      select: vi.fn().mockImplementation(() => {
        throw new Error("db error");
      }),
      from: vi.fn(),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../export/diaper/route");
    const res = await GET();
    expect(res.status).toBe(500);
  });
});

describe("POST /api/undo/[type]/[id]", () => {
  it("restores a soft-deleted milk purchase", async () => {
    const chain = {
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([{ id: 1, deletedAt: null }]),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../undo/[type]/[id]/route");
    const req = new Request("http://localhost/api/undo/purchase/1");
    const res = await POST(req, { params: Promise.resolve({ type: "purchase", id: "1" }) });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe(1);
  });

  it("restores a soft-deleted feeding", async () => {
    const chain = {
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([{ id: 2, deletedAt: null }]),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../undo/[type]/[id]/route");
    const req = new Request("http://localhost/api/undo/feeding/2");
    const res = await POST(req, { params: Promise.resolve({ type: "feeding", id: "2" }) });

    expect(res.status).toBe(200);
  });

  it("restores a soft-deleted diaper purchase", async () => {
    const chain = {
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([{ id: 3, deletedAt: null }]),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../undo/[type]/[id]/route");
    const req = new Request("http://localhost/api/undo/diaper-purchase/3");
    const res = await POST(req, {
      params: Promise.resolve({ type: "diaper-purchase", id: "3" }),
    });

    expect(res.status).toBe(200);
  });

  it("restores a soft-deleted diaper change", async () => {
    const chain = {
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([{ id: 4, deletedAt: null }]),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../undo/[type]/[id]/route");
    const req = new Request("http://localhost/api/undo/diaper-change/4");
    const res = await POST(req, {
      params: Promise.resolve({ type: "diaper-change", id: "4" }),
    });

    expect(res.status).toBe(200);
  });

  it("returns 400 for invalid type", async () => {
    const { POST } = await import("../undo/[type]/[id]/route");
    const req = new Request("http://localhost/api/undo/invalid/1");
    const res = await POST(req, { params: Promise.resolve({ type: "invalid", id: "1" }) });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid type");
  });

  it("returns 400 for invalid id", async () => {
    const { POST } = await import("../undo/[type]/[id]/route");
    const req = new Request("http://localhost/api/undo/purchase/abc");
    const res = await POST(req, { params: Promise.resolve({ type: "purchase", id: "abc" }) });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid id");
  });

  it("returns 400 for non-positive id", async () => {
    const { POST } = await import("../undo/[type]/[id]/route");
    const req = new Request("http://localhost/api/undo/purchase/0");
    const res = await POST(req, { params: Promise.resolve({ type: "purchase", id: "0" }) });

    expect(res.status).toBe(400);
  });

  it("returns 404 when record not found", async () => {
    const chain = {
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([]),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../undo/[type]/[id]/route");
    const req = new Request("http://localhost/api/undo/purchase/999");
    const res = await POST(req, { params: Promise.resolve({ type: "purchase", id: "999" }) });

    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("Not found");
  });

  it("returns 500 on db error", async () => {
    const chain = {
      update: vi.fn().mockImplementation(() => {
        throw new Error("db error");
      }),
      set: vi.fn(),
      where: vi.fn(),
      returning: vi.fn(),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../undo/[type]/[id]/route");
    const req = new Request("http://localhost/api/undo/purchase/1");
    const res = await POST(req, { params: Promise.resolve({ type: "purchase", id: "1" }) });

    expect(res.status).toBe(500);
  });
});

describe("POST /api/cleanup", () => {
  it("purges soft-deleted records older than 5 minutes", async () => {
    const chain = {
      delete: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue({ rowCount: 3 }),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../cleanup/route");
    const res = await POST();

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.purged).toBe(12);
  });

  it("returns 500 on db error", async () => {
    const chain = {
      delete: vi.fn().mockImplementation(() => {
        throw new Error("db error");
      }),
      where: vi.fn(),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../cleanup/route");
    const res = await POST();

    expect(res.status).toBe(500);
  });
});

describe("POST /api/babysitter/handoff", () => {
  it("creates a handoff record", async () => {
    const chain = mockDbChain({ id: 1, itemType: "milk", amount: 600 });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../babysitter/handoff/route");
    const req = new Request("http://localhost/api/babysitter/handoff", {
      method: "POST",
      body: JSON.stringify({ itemType: "milk", amount: 600 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.amount).toBe(600);
  });

  it("returns 400 for invalid itemType", async () => {
    const { POST } = await import("../babysitter/handoff/route");
    const req = new Request("http://localhost/api/babysitter/handoff", {
      method: "POST",
      body: JSON.stringify({ itemType: "invalid", amount: 600 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing amount", async () => {
    const { POST } = await import("../babysitter/handoff/route");
    const req = new Request("http://localhost/api/babysitter/handoff", {
      method: "POST",
      body: JSON.stringify({ itemType: "milk" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 on db error", async () => {
    const chain = mockDbChain({});
    chain.values.mockImplementation(() => {
      throw new Error("db error");
    });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../babysitter/handoff/route");
    const req = new Request("http://localhost/api/babysitter/handoff", {
      method: "POST",
      body: JSON.stringify({ itemType: "milk", amount: 600 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});

describe("GET /api/babysitter/handoff", () => {
  it("returns handoff list", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      orderBy: vi
        .fn()
        .mockResolvedValue([
          { id: 1, itemType: "milk", amount: 600, createdAt: "2026-05-01T10:00:00Z" },
        ]),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../babysitter/handoff/route");
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
  });

  it("returns 500 on db error", async () => {
    const chain = {
      select: vi.fn().mockImplementation(() => {
        throw new Error("db error");
      }),
      from: vi.fn(),
      orderBy: vi.fn(),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../babysitter/handoff/route");
    const res = await GET();
    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/babysitter/handoff/[id]", () => {
  it("deletes a handoff", async () => {
    const chain = {
      delete: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([{ id: 1 }]),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { DELETE } = await import("../babysitter/handoff/[id]/route");
    const req = new Request("http://localhost/api/babysitter/handoff/1");
    const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });

    expect(res.status).toBe(200);
  });

  it("returns 400 for invalid id", async () => {
    const { DELETE } = await import("../babysitter/handoff/[id]/route");
    const req = new Request("http://localhost/api/babysitter/handoff/abc");
    const res = await DELETE(req, { params: Promise.resolve({ id: "abc" }) });

    expect(res.status).toBe(400);
  });

  it("returns 404 when not found", async () => {
    const chain = {
      delete: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([]),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { DELETE } = await import("../babysitter/handoff/[id]/route");
    const req = new Request("http://localhost/api/babysitter/handoff/999");
    const res = await DELETE(req, { params: Promise.resolve({ id: "999" }) });

    expect(res.status).toBe(404);
  });
});

describe("POST /api/babysitter/days", () => {
  it("creates a babysitter day", async () => {
    const chain = mockDbChain({ id: 1, date: "2026-05-01" });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../babysitter/days/route");
    const req = new Request("http://localhost/api/babysitter/days", {
      method: "POST",
      body: JSON.stringify({ date: "2026-05-01" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.date).toBe("2026-05-01");
  });

  it("returns 400 for missing date", async () => {
    const { POST } = await import("../babysitter/days/route");
    const req = new Request("http://localhost/api/babysitter/days", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 on db error", async () => {
    const chain = mockDbChain({});
    chain.values.mockImplementation(() => {
      throw new Error("db error");
    });
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { POST } = await import("../babysitter/days/route");
    const req = new Request("http://localhost/api/babysitter/days", {
      method: "POST",
      body: JSON.stringify({ date: "2026-05-01" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});

describe("GET /api/babysitter/days", () => {
  it("returns babysitter days list", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      orderBy: vi
        .fn()
        .mockResolvedValue([{ id: 1, date: "2026-05-01", createdAt: "2026-05-01T10:00:00Z" }]),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../babysitter/days/route");
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
  });

  it("returns 500 on db error", async () => {
    const chain = {
      select: vi.fn().mockImplementation(() => {
        throw new Error("db error");
      }),
      from: vi.fn(),
      orderBy: vi.fn(),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { GET } = await import("../babysitter/days/route");
    const res = await GET();
    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/babysitter/days/[id]", () => {
  it("deletes a babysitter day", async () => {
    const chain = {
      delete: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([{ id: 1 }]),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { DELETE } = await import("../babysitter/days/[id]/route");
    const req = new Request("http://localhost/api/babysitter/days/1");
    const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });

    expect(res.status).toBe(200);
  });

  it("returns 400 for invalid id", async () => {
    const { DELETE } = await import("../babysitter/days/[id]/route");
    const req = new Request("http://localhost/api/babysitter/days/abc");
    const res = await DELETE(req, { params: Promise.resolve({ id: "abc" }) });

    expect(res.status).toBe(400);
  });

  it("returns 404 when not found", async () => {
    const chain = {
      delete: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([]),
    };
    vi.mocked(await import("@/db")).db.mockReturnValue(chain as never);

    const { DELETE } = await import("../babysitter/days/[id]/route");
    const req = new Request("http://localhost/api/babysitter/days/999");
    const res = await DELETE(req, { params: Promise.resolve({ id: "999" }) });

    expect(res.status).toBe(404);
  });
});
