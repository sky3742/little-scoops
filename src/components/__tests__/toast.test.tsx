import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ToastProvider, useToast } from "@/components/toast";

function TestComponent() {
  const { toast } = useToast();
  return (
    <div>
      <button onClick={() => toast("Success!")}>Success</button>
      <button onClick={() => toast("Error!", "error")}>Error</button>
      <button onClick={() => toast("Deleted", "success", { label: "Undo", onClick: () => {} })}>
        With Undo
      </button>
    </div>
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ToastProvider", () => {
  it("renders children", () => {
    render(
      <ToastProvider>
        <div>Child</div>
      </ToastProvider>
    );
    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("throws when useToast is used outside provider", () => {
    function Bad() {
      useToast();
      return null;
    }
    expect(() => render(<Bad />)).toThrow("useToast must be used within ToastProvider");
  });

  it("shows toast on success", async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("Success"));
    expect(screen.getByText("Success!")).toBeInTheDocument();
  });

  it("shows error toast", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("Error"));
    expect(screen.getByText("Error!")).toBeInTheDocument();
  });

  it("auto-dismisses after 5 seconds", async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("Success"));
    expect(screen.getByText("Success!")).toBeInTheDocument();

    await act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByText("Success!")).not.toBeInTheDocument();
  });

  it("dismisses toast on X button click", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("Success"));
    expect(screen.getByText("Success!")).toBeInTheDocument();

    const dismissButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg") !== null && btn !== screen.getByText("Success"));
    fireEvent.click(dismissButtons[0]);

    expect(screen.queryByText("Success!")).not.toBeInTheDocument();
  });

  it("renders undo action button", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("With Undo"));
    expect(screen.getByText("Deleted")).toBeInTheDocument();
    expect(screen.getByText("Undo")).toBeInTheDocument();
  });
});
