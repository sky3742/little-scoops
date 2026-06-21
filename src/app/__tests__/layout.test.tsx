import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RootLayout, { metadata, viewport } from "../layout";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "font-geist-sans", subsets: ["latin"] }),
  Geist_Mono: () => ({ variable: "font-geist-mono", subsets: ["latin"] }),
}));

describe("RootLayout", () => {
  it("renders children", () => {
    render(
      <RootLayout>
        <div>Test Child</div>
      </RootLayout>
    );
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("renders html element with lang", () => {
    render(
      <RootLayout>
        <div>Child</div>
      </RootLayout>
    );
    expect(document.documentElement).toHaveAttribute("lang", "en");
  });
});

describe("metadata", () => {
  it("has correct title", () => {
    expect(metadata.title).toBe("LittleScoops");
  });

  it("has description", () => {
    expect(metadata.description).toBeTruthy();
  });

  it("has manifest", () => {
    expect(metadata.manifest).toBe("/manifest.json");
  });
});

describe("viewport", () => {
  it("has device-width", () => {
    expect(viewport.width).toBe("device-width");
  });

  it("has initial scale 1", () => {
    expect(viewport.initialScale).toBe(1);
  });

  it("disables maximum scale", () => {
    expect(viewport.maximumScale).toBe(1);
  });
});
