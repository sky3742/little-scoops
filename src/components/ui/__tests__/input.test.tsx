import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "../input";

describe("Input", () => {
  it("renders with placeholder", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders with default value", () => {
    render(<Input defaultValue="hello" />);
    expect(screen.getByDisplayValue("hello")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" placeholder="test" />);
    expect(screen.getByPlaceholderText("test").className).toContain("custom-class");
  });

  it("sets type correctly", () => {
    render(<Input type="password" placeholder="pw" />);
    expect(screen.getByPlaceholderText("pw")).toHaveAttribute("type", "password");
  });

  it("can be disabled", () => {
    render(<Input disabled placeholder="disabled" />);
    expect(screen.getByPlaceholderText("disabled")).toBeDisabled();
  });

  it("has data-slot attribute", () => {
    render(<Input placeholder="slot" />);
    expect(screen.getByPlaceholderText("slot")).toHaveAttribute("data-slot", "input");
  });
});
