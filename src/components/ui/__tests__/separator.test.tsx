import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Separator } from "../separator";

describe("Separator", () => {
  it("renders horizontal by default", () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toHaveAttribute("data-slot", "separator");
  });

  it("applies custom className", () => {
    const { container } = render(<Separator className="custom" />);
    expect((container.firstChild as HTMLElement).className).toContain("custom");
  });
});
