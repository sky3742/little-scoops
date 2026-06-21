import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress, ProgressLabel, ProgressValue } from "../progress";

describe("Progress", () => {
  it("renders with value", () => {
    render(<Progress value={50} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
  });

  it("renders children content", () => {
    render(
      <Progress value={50}>
        <ProgressLabel>Milk</ProgressLabel>
        <ProgressValue />
      </Progress>
    );
    expect(screen.getByText("Milk")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Progress value={50} className="custom" />);
    expect(container.firstChild).toHaveAttribute("data-slot", "progress");
    expect((container.firstChild as HTMLElement).className).toContain("custom");
  });

  it("renders track and indicator", () => {
    const { container } = render(<Progress value={50} />);
    expect(container.querySelector('[data-slot="progress-track"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="progress-indicator"]')).toBeInTheDocument();
  });
});
