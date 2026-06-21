import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";

const mockMilkStock = {
  currentStock: 2500,
  avgDailyUsage: 30,
  daysLeft: 83,
  totalPurchased: 5000,
  totalUsed: 2500,
  babysitterStock: 4200,
  combinedStock: 6700,
  babysitterAvgDailyUsage: 30,
  babysitterDaysLeft: 140,
};

const mockDiaperStock = {
  currentStock: 80,
  avgDailyUsage: 5,
  daysLeft: 16,
  totalPurchased: 100,
  totalUsed: 20,
  typeBreakdown: { wet: 12, dirty: 5, both: 3 },
  babysitterStock: 30,
  combinedStock: 110,
  babysitterAvgDailyUsage: 5,
  babysitterDaysLeft: 6,
};

const mockMilkHistory = [
  { id: 1, type: "purchase" as const, amountKg: 3, createdAt: "2026-05-01T10:00:00Z" },
  {
    id: 2,
    type: "feeding" as const,
    scoops: 10,
    gramsPerScoop: 4.3,
    totalGrams: 43,
    createdAt: "2026-05-02T10:00:00Z",
  },
];

const mockDiaperHistory = [
  { id: 1, type: "purchase" as const, count: 48, createdAt: "2026-05-01T10:00:00Z" },
  {
    id: 2,
    type: "change" as const,
    count: 1,
    changeType: "wet" as const,
    changeDate: "2026-05-02",
    createdAt: "2026-05-02T10:00:00Z",
  },
];

function createMockFetch() {
  return vi.fn().mockImplementation((url: string, options?: RequestInit) => {
    if (options?.method === "POST") return { ok: true, json: () => Promise.resolve({}) };
    if (options?.method === "DELETE") return { ok: true, json: () => Promise.resolve({}) };
    if (url === "/api/milk/stock") return { ok: true, json: () => Promise.resolve(mockMilkStock) };
    if (url === "/api/milk/history")
      return { ok: true, json: () => Promise.resolve(mockMilkHistory) };
    if (url === "/api/diaper/stock")
      return { ok: true, json: () => Promise.resolve(mockDiaperStock) };
    if (url === "/api/diaper/history")
      return { ok: true, json: () => Promise.resolve(mockDiaperHistory) };
    if (url === "/api/babysitter/handoff") return { ok: true, json: () => Promise.resolve([]) };
    if (url === "/api/babysitter/days") return { ok: true, json: () => Promise.resolve([]) };
    return { ok: true, json: () => Promise.resolve({}) };
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("Home", () => {
  it("shows loading state initially", async () => {
    vi.stubGlobal("fetch", createMockFetch());
    render(<Home />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders dashboard after loading", async () => {
    vi.stubGlobal("fetch", createMockFetch());
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("LittleScoops")).toBeInTheDocument();
    expect(screen.getByText("Milk Powder")).toBeInTheDocument();
    expect(screen.getAllByText("Diapers").length).toBeGreaterThan(0);
    expect(screen.getByText("2.5")).toBeInTheDocument();
    expect(screen.getAllByText("80").length).toBeGreaterThan(0);
    expect(screen.getByText("83 days")).toBeInTheDocument();
    expect(screen.getByText("16 days")).toBeInTheDocument();
    expect(screen.getAllByText("30").length).toBeGreaterThan(0);
    expect(screen.getAllByText("5").length).toBeGreaterThan(0);
  });

  it("renders today's feedings time-of-day breakdown", async () => {
    vi.stubGlobal("fetch", createMockFetch());
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Today's Feedings")).toBeInTheDocument();
    expect(screen.getByText("Morning")).toBeInTheDocument();
    expect(screen.getByText("Afternoon")).toBeInTheDocument();
    expect(screen.getByText("Evening")).toBeInTheDocument();
    expect(screen.getByText("Night")).toBeInTheDocument();
  });

  it("renders export buttons", async () => {
    vi.stubGlobal("fetch", createMockFetch());
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Export Data")).toBeInTheDocument();
    expect(screen.getByText("Milk CSV")).toBeInTheDocument();
    expect(screen.getByText("Diaper CSV")).toBeInTheDocument();
  });

  it("shows 'No data' when daysLeft is null", async () => {
    const fetchMock = createMockFetch();
    fetchMock.mockImplementation((url: string) => {
      if (url === "/api/milk/stock")
        return { ok: true, json: () => Promise.resolve({ ...mockMilkStock, daysLeft: null }) };
      if (url === "/api/milk/history") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/diaper/stock")
        return { ok: true, json: () => Promise.resolve({ ...mockDiaperStock, daysLeft: null }) };
      if (url === "/api/diaper/history") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/babysitter/handoff") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/babysitter/days") return { ok: true, json: () => Promise.resolve([]) };
      return { ok: true, json: () => Promise.resolve({}) };
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const noDataElements = screen.getAllByText("No data");
    expect(noDataElements.length).toBe(2);
  });

  it("shows Low badge when daysLeft <= 3", async () => {
    const fetchMock = createMockFetch();
    fetchMock.mockImplementation((url: string) => {
      if (url === "/api/milk/stock")
        return { ok: true, json: () => Promise.resolve({ ...mockMilkStock, daysLeft: 2 }) };
      if (url === "/api/milk/history") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/diaper/stock")
        return { ok: true, json: () => Promise.resolve({ ...mockDiaperStock, daysLeft: 1 }) };
      if (url === "/api/diaper/history") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/babysitter/handoff") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/babysitter/days") return { ok: true, json: () => Promise.resolve([]) };
      return { ok: true, json: () => Promise.resolve({}) };
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const lowBadges = screen.getAllByText("Low");
    expect(lowBadges.length).toBe(2);
  });

  it("renders recent activity items", async () => {
    vi.stubGlobal("fetch", createMockFetch());
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("+3 kg milk")).toBeInTheDocument();
    expect(screen.getByText("10 scoops fed")).toBeInTheDocument();
    expect(screen.getByText("+48 diapers")).toBeInTheDocument();
    expect(screen.getByText("Wet diaper")).toBeInTheDocument();
  });

  it("shows empty state when no activity", async () => {
    const fetchMock = createMockFetch();
    fetchMock.mockImplementation((url: string) => {
      if (url === "/api/milk/stock")
        return { ok: true, json: () => Promise.resolve(mockMilkStock) };
      if (url === "/api/milk/history") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/diaper/stock")
        return { ok: true, json: () => Promise.resolve(mockDiaperStock) };
      if (url === "/api/diaper/history") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/babysitter/handoff") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/babysitter/days") return { ok: true, json: () => Promise.resolve([]) };
      return { ok: true, json: () => Promise.resolve({}) };
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("No activity yet. Start tracking!")).toBeInTheDocument();
  });

  it("sends purchase POST request", async () => {
    const user = userEvent.setup();
    const fetchMock = createMockFetch();
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Add Milk"));

    await waitFor(() => {
      expect(screen.getByText("Add Milk Stock")).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText("e.g. 3"), "2");
    await user.click(screen.getByText("Add Stock", { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/milk/purchase",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("sends feeding POST request", async () => {
    const user = userEvent.setup();
    const fetchMock = createMockFetch();
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Log Feeding"));

    await waitFor(() => {
      expect(
        screen.getByText("Log Feeding", { selector: "h2, [data-slot='sheet-title']" })
      ).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText("e.g. 10"), "5");
    await user.click(screen.getByText("Log Feeding", { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/milk/feeding",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("sends diaper purchase POST request", async () => {
    const user = userEvent.setup();
    const fetchMock = createMockFetch();
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Add Diapers"));

    await waitFor(() => {
      expect(
        screen.getByText("Add Diapers", { selector: "h2, [data-slot='sheet-title']" })
      ).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText("e.g. 96"), "24");
    await user.click(screen.getByText("Add Stock", { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/diaper/purchase",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("sends diaper change POST request on quick log", async () => {
    const user = userEvent.setup();
    const fetchMock = createMockFetch();
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Log Diaper Change"));

    await waitFor(() => {
      expect(
        screen.getByText("Log Diaper Change", { selector: "h2, [data-slot='sheet-title']" })
      ).toBeInTheDocument();
    });

    await user.click(screen.getByText("Log Change"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/diaper/change",
        expect.objectContaining({ method: "POST" })
      );
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/diaper/stock");
    });
  });

  it("displays feeding total calculation", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", createMockFetch());
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Log Feeding"));

    await waitFor(() => {
      expect(
        screen.getByText("Log Feeding", { selector: "h2, [data-slot='sheet-title']" })
      ).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText("e.g. 10"), "3");

    expect(screen.getByText("12.9g")).toBeInTheDocument();
  });

  it("closes milk purchase sheet on cancel", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", createMockFetch());
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Add Milk"));

    await waitFor(() => {
      expect(screen.getByText("Add Milk Stock")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(screen.queryByText("Add Milk Stock")).not.toBeInTheDocument();
    });
  });

  it("closes feeding sheet on cancel", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", createMockFetch());
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Log Feeding"));

    await waitFor(() => {
      expect(
        screen.getByText("Log Feeding", { selector: "h2, [data-slot='sheet-title']" })
      ).toBeInTheDocument();
    });

    await user.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(
        screen.queryByText("Log Feeding", { selector: "h2, [data-slot='sheet-title']" })
      ).not.toBeInTheDocument();
    });
  });

  it("closes diaper purchase sheet on cancel", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", createMockFetch());
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Add Diapers"));

    await waitFor(() => {
      expect(
        screen.getByText("Add Diapers", { selector: "h2, [data-slot='sheet-title']" })
      ).toBeInTheDocument();
    });

    await user.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(
        screen.queryByText("Add Diapers", { selector: "h2, [data-slot='sheet-title']" })
      ).not.toBeInTheDocument();
    });
  });

  it("updates feeding grams per scoop", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", createMockFetch());
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Log Feeding"));

    await waitFor(() => {
      expect(
        screen.getByText("Log Feeding", { selector: "h2, [data-slot='sheet-title']" })
      ).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText("e.g. 10"), "2");

    const gramsInput = screen.getByDisplayValue("4.3");
    await user.clear(gramsInput);
    await user.type(gramsInput, "5");

    expect(screen.getByText("10.0g")).toBeInTheDocument();
  });

  it("handles fetch errors gracefully", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Failed to load data")).toBeInTheDocument();
  });

  it("does not submit purchase when input is empty", async () => {
    const user = userEvent.setup();
    const fetchMock = createMockFetch();
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Add Milk"));

    await waitFor(() => {
      expect(screen.getByText("Add Milk Stock")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Add Stock", { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(fetchMock).not.toHaveBeenCalledWith(
        "/api/milk/purchase",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("does not submit feeding when input is empty", async () => {
    const user = userEvent.setup();
    const fetchMock = createMockFetch();
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Log Feeding"));

    await waitFor(() => {
      expect(
        screen.getByText("Log Feeding", { selector: "h2, [data-slot='sheet-title']" })
      ).toBeInTheDocument();
    });

    await user.click(screen.getByText("Log Feeding", { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(fetchMock).not.toHaveBeenCalledWith(
        "/api/milk/feeding",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("does not submit diaper purchase when input is empty", async () => {
    const user = userEvent.setup();
    const fetchMock = createMockFetch();
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Add Diapers"));

    await waitFor(() => {
      expect(
        screen.getByText("Add Diapers", { selector: "h2, [data-slot='sheet-title']" })
      ).toBeInTheDocument();
    });

    await user.click(screen.getByText("Add Stock", { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(fetchMock).not.toHaveBeenCalledWith(
        "/api/diaper/purchase",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("shows delete button after swipe on activity item", async () => {
    vi.stubGlobal("fetch", createMockFetch());
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const swipeContent = screen.getAllByTestId("swipe-content")[0];
    fireEvent.touchStart(swipeContent, { touches: [{ clientX: 100, clientY: 0 }] });
    fireEvent.touchMove(swipeContent, { touches: [{ clientX: 20, clientY: 0 }] });
    fireEvent.touchEnd(swipeContent);

    expect(screen.getAllByTestId("delete-button")[0]).toBeInTheDocument();
  });

  it("calls DELETE endpoint on swipe delete", async () => {
    const fetchMock = createMockFetch();
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const swipeContent = screen.getAllByTestId("swipe-content")[0];
    fireEvent.touchStart(swipeContent, { touches: [{ clientX: 100, clientY: 0 }] });
    fireEvent.touchMove(swipeContent, { touches: [{ clientX: 20, clientY: 0 }] });
    fireEvent.touchEnd(swipeContent);

    fireEvent.click(screen.getAllByTestId("delete-button")[0]);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(
          /^\/api\/(milk\/purchase|milk\/feeding|diaper\/purchase|diaper\/change)\/\d+$/
        ),
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });

  it("shows undo toast after delete", async () => {
    const fetchMock = createMockFetch();
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const swipeContent = screen.getAllByTestId("swipe-content")[0];
    fireEvent.touchStart(swipeContent, { touches: [{ clientX: 100, clientY: 0 }] });
    fireEvent.touchMove(swipeContent, { touches: [{ clientX: 20, clientY: 0 }] });
    fireEvent.touchEnd(swipeContent);

    fireEvent.click(screen.getAllByTestId("delete-button")[0]);

    await waitFor(() => {
      expect(screen.getByText("Entry deleted")).toBeInTheDocument();
    });
    expect(screen.getByText("Undo")).toBeInTheDocument();
  });

  it("calls DELETE and refetches diaper data on swipe delete", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === "DELETE") return { ok: true, json: () => Promise.resolve({}) };
      if (url === "/api/milk/stock")
        return { ok: true, json: () => Promise.resolve(mockMilkStock) };
      if (url === "/api/milk/history") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/diaper/stock")
        return { ok: true, json: () => Promise.resolve(mockDiaperStock) };
      if (url === "/api/diaper/history")
        return {
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 10,
                type: "change" as const,
                count: 1,
                changeType: "wet" as const,
                changeDate: "2026-05-02",
                createdAt: "2026-05-02T10:00:00Z",
              },
            ]),
        };
      return { ok: true, json: () => Promise.resolve({}) };
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const swipeContent = screen.getAllByTestId("swipe-content")[0];
    fireEvent.touchStart(swipeContent, { touches: [{ clientX: 100, clientY: 0 }] });
    fireEvent.touchMove(swipeContent, { touches: [{ clientX: 20, clientY: 0 }] });
    fireEvent.touchEnd(swipeContent);
    fireEvent.click(screen.getAllByTestId("delete-button")[0]);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(/^\/api\/diaper\/change\/\d+$/),
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });

  it("shows error toast on failed delete", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === "DELETE") return Promise.reject(new Error("fail"));
      if (url === "/api/milk/stock")
        return { ok: true, json: () => Promise.resolve(mockMilkStock) };
      if (url === "/api/milk/history")
        return { ok: true, json: () => Promise.resolve(mockMilkHistory) };
      if (url === "/api/diaper/stock")
        return { ok: true, json: () => Promise.resolve(mockDiaperStock) };
      if (url === "/api/diaper/history")
        return { ok: true, json: () => Promise.resolve(mockDiaperHistory) };
      return { ok: true, json: () => Promise.resolve({}) };
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const swipeContent = screen.getAllByTestId("swipe-content")[0];
    fireEvent.touchStart(swipeContent, { touches: [{ clientX: 100, clientY: 0 }] });
    fireEvent.touchMove(swipeContent, { touches: [{ clientX: 20, clientY: 0 }] });
    fireEvent.touchEnd(swipeContent);
    fireEvent.click(screen.getAllByTestId("delete-button")[0]);

    await waitFor(() => {
      expect(screen.getByText("Failed to delete entry")).toBeInTheDocument();
    });
  });

  it("shows error toast on failed delete for diaper", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === "DELETE") return Promise.reject(new Error("fail"));
      if (url === "/api/milk/stock")
        return { ok: true, json: () => Promise.resolve(mockMilkStock) };
      if (url === "/api/milk/history") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/diaper/stock")
        return { ok: true, json: () => Promise.resolve(mockDiaperStock) };
      if (url === "/api/diaper/history")
        return {
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 10,
                type: "change" as const,
                count: 1,
                changeType: "wet" as const,
                changeDate: "2026-05-02",
                createdAt: "2026-05-02T10:00:00Z",
              },
            ]),
        };
      return { ok: true, json: () => Promise.resolve({}) };
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const swipeContent = screen.getAllByTestId("swipe-content")[0];
    fireEvent.touchStart(swipeContent, { touches: [{ clientX: 100, clientY: 0 }] });
    fireEvent.touchMove(swipeContent, { touches: [{ clientX: 20, clientY: 0 }] });
    fireEvent.touchEnd(swipeContent);
    fireEvent.click(screen.getAllByTestId("delete-button")[0]);

    await waitFor(() => {
      expect(screen.getByText("Failed to delete entry")).toBeInTheDocument();
    });
  });

  it("allows selecting diaper change type in sheet", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", createMockFetch());
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Log Diaper Change"));

    await waitFor(() => {
      expect(
        screen.getByText("Log Diaper Change", { selector: "h2, [data-slot='sheet-title']" })
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Wet")).toBeInTheDocument();
    expect(screen.getByText("Dirty")).toBeInTheDocument();
    expect(screen.getByText("Wet & Dirty")).toBeInTheDocument();

    await user.click(screen.getByText("Dirty"));

    await waitFor(() => {
      expect(screen.getByText("Dirty")).toBeInTheDocument();
    });
  });

  it("sends diaper change with selected type", async () => {
    const user = userEvent.setup();
    const fetchMock = createMockFetch();
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Log Diaper Change"));

    await waitFor(() => {
      expect(
        screen.getByText("Log Diaper Change", { selector: "h2, [data-slot='sheet-title']" })
      ).toBeInTheDocument();
    });

    await user.click(screen.getByText("Dirty"));
    await user.click(screen.getByText("Log Change"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/diaper/change",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ count: 1, type: "dirty" }),
        })
      );
    });
  });

  it("closes diaper change sheet on cancel", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", createMockFetch());
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Log Diaper Change"));

    await waitFor(() => {
      expect(
        screen.getByText("Log Diaper Change", { selector: "h2, [data-slot='sheet-title']" })
      ).toBeInTheDocument();
    });

    await user.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(
        screen.queryByText("Log Diaper Change", { selector: "h2, [data-slot='sheet-title']" })
      ).not.toBeInTheDocument();
    });
  });

  it("renders diaper type icons in activity", async () => {
    vi.stubGlobal("fetch", createMockFetch());
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Wet diaper")).toBeInTheDocument();
  });

  it("displays diaper change with dirty type", async () => {
    const fetchMock = createMockFetch();
    fetchMock.mockImplementation((url: string) => {
      if (url === "/api/milk/stock")
        return { ok: true, json: () => Promise.resolve(mockMilkStock) };
      if (url === "/api/milk/history") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/diaper/stock")
        return { ok: true, json: () => Promise.resolve(mockDiaperStock) };
      if (url === "/api/diaper/history")
        return {
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 1,
                type: "change" as const,
                count: 1,
                changeType: "dirty" as const,
                changeDate: "2026-05-02",
                createdAt: "2026-05-02T10:00:00Z",
              },
            ]),
        };
      return { ok: true, json: () => Promise.resolve({}) };
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Dirty diaper")).toBeInTheDocument();
  });

  it("displays diaper change with both type", async () => {
    const fetchMock = createMockFetch();
    fetchMock.mockImplementation((url: string) => {
      if (url === "/api/milk/stock")
        return { ok: true, json: () => Promise.resolve(mockMilkStock) };
      if (url === "/api/milk/history") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/diaper/stock")
        return { ok: true, json: () => Promise.resolve(mockDiaperStock) };
      if (url === "/api/diaper/history")
        return {
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 1,
                type: "change" as const,
                count: 1,
                changeType: "both" as const,
                changeDate: "2026-05-02",
                createdAt: "2026-05-02T10:00:00Z",
              },
            ]),
        };
      return { ok: true, json: () => Promise.resolve({}) };
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Wet & Dirty diaper")).toBeInTheDocument();
  });

  it("shows feeding counts in time-of-day breakdown", async () => {
    const today = new Date();
    today.setHours(8, 30, 0, 0);
    const fetchMock = createMockFetch();
    fetchMock.mockImplementation((url: string) => {
      if (url === "/api/milk/stock")
        return { ok: true, json: () => Promise.resolve(mockMilkStock) };
      if (url === "/api/milk/history")
        return {
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 1,
                type: "feeding" as const,
                scoops: 5,
                gramsPerScoop: 4.3,
                totalGrams: 21.5,
                createdAt: today.toISOString(),
              },
            ]),
        };
      if (url === "/api/diaper/stock")
        return { ok: true, json: () => Promise.resolve(mockDiaperStock) };
      if (url === "/api/diaper/history") return { ok: true, json: () => Promise.resolve([]) };
      return { ok: true, json: () => Promise.resolve({}) };
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Today's Feedings")).toBeInTheDocument();
    const morningCount = screen.getAllByText("1");
    expect(morningCount.length).toBeGreaterThanOrEqual(1);
  });

  it("counts night feedings (10pm-6am)", async () => {
    const night = new Date();
    night.setHours(23, 0, 0, 0);
    const fetchMock = createMockFetch();
    fetchMock.mockImplementation((url: string) => {
      if (url === "/api/milk/stock")
        return { ok: true, json: () => Promise.resolve(mockMilkStock) };
      if (url === "/api/milk/history")
        return {
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 1,
                type: "feeding" as const,
                scoops: 5,
                gramsPerScoop: 4.3,
                totalGrams: 21.5,
                createdAt: night.toISOString(),
              },
            ]),
        };
      if (url === "/api/diaper/stock")
        return { ok: true, json: () => Promise.resolve(mockDiaperStock) };
      if (url === "/api/diaper/history") return { ok: true, json: () => Promise.resolve([]) };
      return { ok: true, json: () => Promise.resolve({}) };
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Today's Feedings")).toBeInTheDocument();
  });

  it("opens export buttons in new tab", async () => {
    const openSpy = vi.fn();
    vi.stubGlobal("open", openSpy);
    vi.stubGlobal("fetch", createMockFetch());
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Milk CSV"));
    expect(openSpy).toHaveBeenCalledWith("/api/milk/export", "_blank");

    fireEvent.click(screen.getByText("Diaper CSV"));
    expect(openSpy).toHaveBeenCalledWith("/api/export/diaper", "_blank");

    vi.unstubAllGlobals();
  });

  it("shows error toast on failed purchase", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === "POST" && url === "/api/milk/purchase")
        return Promise.reject(new Error("fail"));
      if (url === "/api/milk/stock")
        return { ok: true, json: () => Promise.resolve(mockMilkStock) };
      if (url === "/api/milk/history") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/diaper/stock")
        return { ok: true, json: () => Promise.resolve(mockDiaperStock) };
      if (url === "/api/diaper/history") return { ok: true, json: () => Promise.resolve([]) };
      return { ok: true, json: () => Promise.resolve({}) };
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Add Milk"));
    await waitFor(() => {
      expect(screen.getByText("Add Milk Stock")).toBeInTheDocument();
    });
    await user.type(screen.getByPlaceholderText("e.g. 3"), "2");
    await user.click(screen.getByText("Add Stock", { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(screen.getByText("Failed to add milk stock")).toBeInTheDocument();
    });
  });

  it("shows error toast on failed feeding", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === "POST" && url === "/api/milk/feeding")
        return Promise.reject(new Error("fail"));
      if (url === "/api/milk/stock")
        return { ok: true, json: () => Promise.resolve(mockMilkStock) };
      if (url === "/api/milk/history") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/diaper/stock")
        return { ok: true, json: () => Promise.resolve(mockDiaperStock) };
      if (url === "/api/diaper/history") return { ok: true, json: () => Promise.resolve([]) };
      return { ok: true, json: () => Promise.resolve({}) };
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Log Feeding"));
    await waitFor(() => {
      expect(
        screen.getByText("Log Feeding", { selector: "h2, [data-slot='sheet-title']" })
      ).toBeInTheDocument();
    });
    await user.type(screen.getByPlaceholderText("e.g. 10"), "5");
    await user.click(screen.getByText("Log Feeding", { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(screen.getByText("Failed to log feeding")).toBeInTheDocument();
    });
  });

  it("shows error toast on failed diaper purchase", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === "POST" && url === "/api/diaper/purchase")
        return Promise.reject(new Error("fail"));
      if (url === "/api/milk/stock")
        return { ok: true, json: () => Promise.resolve(mockMilkStock) };
      if (url === "/api/milk/history") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/diaper/stock")
        return { ok: true, json: () => Promise.resolve(mockDiaperStock) };
      if (url === "/api/diaper/history") return { ok: true, json: () => Promise.resolve([]) };
      return { ok: true, json: () => Promise.resolve({}) };
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Add Diapers"));
    await waitFor(() => {
      expect(
        screen.getByText("Add Diapers", { selector: "h2, [data-slot='sheet-title']" })
      ).toBeInTheDocument();
    });
    await user.type(screen.getByPlaceholderText("e.g. 96"), "24");
    await user.click(screen.getByText("Add Stock", { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(screen.getByText("Failed to add diapers")).toBeInTheDocument();
    });
  });

  it("shows error toast on failed diaper change", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === "POST" && url === "/api/diaper/change")
        return Promise.reject(new Error("fail"));
      if (url === "/api/milk/stock")
        return { ok: true, json: () => Promise.resolve(mockMilkStock) };
      if (url === "/api/milk/history") return { ok: true, json: () => Promise.resolve([]) };
      if (url === "/api/diaper/stock")
        return { ok: true, json: () => Promise.resolve(mockDiaperStock) };
      if (url === "/api/diaper/history") return { ok: true, json: () => Promise.resolve([]) };
      return { ok: true, json: () => Promise.resolve({}) };
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Log Diaper Change"));
    await waitFor(() => {
      expect(
        screen.getByText("Log Diaper Change", { selector: "h2, [data-slot='sheet-title']" })
      ).toBeInTheDocument();
    });
    await user.click(screen.getByText("Log Change"));

    await waitFor(() => {
      expect(screen.getByText("Failed to log diaper change")).toBeInTheDocument();
    });
  });
});
