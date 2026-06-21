import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SwipeToDelete } from "../swipe-to-delete";

describe("SwipeToDelete", () => {
  it("renders children", () => {
    render(
      <SwipeToDelete onDelete={vi.fn()}>
        <div>Content</div>
      </SwipeToDelete>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders delete button", () => {
    render(
      <SwipeToDelete onDelete={vi.fn()}>
        <div>Content</div>
      </SwipeToDelete>
    );
    expect(screen.getByTestId("delete-button")).toBeInTheDocument();
  });

  it("reveals delete button on swipe left", () => {
    render(
      <SwipeToDelete onDelete={vi.fn()}>
        <div>Content</div>
      </SwipeToDelete>
    );

    const content = screen.getByTestId("swipe-content");
    fireEvent.touchStart(content, { touches: [{ clientX: 100, clientY: 0 }] });
    fireEvent.touchMove(content, { touches: [{ clientX: 20, clientY: 0 }] });
    fireEvent.touchEnd(content);

    const deleteButton = screen.getByTestId("delete-button");
    expect(deleteButton).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = vi.fn();
    render(
      <SwipeToDelete onDelete={onDelete}>
        <div>Content</div>
      </SwipeToDelete>
    );

    const content = screen.getByTestId("swipe-content");
    fireEvent.touchStart(content, { touches: [{ clientX: 100, clientY: 0 }] });
    fireEvent.touchMove(content, { touches: [{ clientX: 20, clientY: 0 }] });
    fireEvent.touchEnd(content);

    fireEvent.click(screen.getByTestId("delete-button"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("snaps back on small swipe", () => {
    render(
      <SwipeToDelete onDelete={vi.fn()}>
        <div>Content</div>
      </SwipeToDelete>
    );

    const content = screen.getByTestId("swipe-content");
    fireEvent.touchStart(content, { touches: [{ clientX: 100, clientY: 0 }] });
    fireEvent.touchMove(content, { touches: [{ clientX: 80, clientY: 0 }] });
    fireEvent.touchEnd(content);

    expect(content.style.transform).toBe("translateX(0px)");
  });

  it("stays open on large swipe left", () => {
    render(
      <SwipeToDelete onDelete={vi.fn()}>
        <div>Content</div>
      </SwipeToDelete>
    );

    const content = screen.getByTestId("swipe-content");
    fireEvent.touchStart(content, { touches: [{ clientX: 100, clientY: 0 }] });
    fireEvent.touchMove(content, { touches: [{ clientX: 10, clientY: 0 }] });
    fireEvent.touchEnd(content);

    expect(content.style.transform).toBe("translateX(-56px)");
  });

  it("closes on right swipe when already open", () => {
    render(
      <SwipeToDelete onDelete={vi.fn()}>
        <div>Content</div>
      </SwipeToDelete>
    );

    const content = screen.getByTestId("swipe-content");

    // Open
    fireEvent.touchStart(content, { touches: [{ clientX: 100, clientY: 0 }] });
    fireEvent.touchMove(content, { touches: [{ clientX: 10, clientY: 0 }] });
    fireEvent.touchEnd(content);
    expect(content.style.transform).toBe("translateX(-56px)");

    // Close by swiping right
    fireEvent.touchStart(content, { touches: [{ clientX: 10, clientY: 0 }] });
    fireEvent.touchMove(content, { touches: [{ clientX: 80, clientY: 0 }] });
    fireEvent.touchEnd(content);
    expect(content.style.transform).toBe("translateX(0px)");
  });

  it("clamps swipe to delete threshold", () => {
    render(
      <SwipeToDelete onDelete={vi.fn()}>
        <div>Content</div>
      </SwipeToDelete>
    );

    const content = screen.getByTestId("swipe-content");
    fireEvent.touchStart(content, { touches: [{ clientX: 200, clientY: 0 }] });
    fireEvent.touchMove(content, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchEnd(content);

    expect(content.style.transform).toBe("translateX(-56px)");
  });

  it("ignores touch move when not dragging", () => {
    render(
      <SwipeToDelete onDelete={vi.fn()}>
        <div>Content</div>
      </SwipeToDelete>
    );

    const content = screen.getByTestId("swipe-content");
    fireEvent.touchMove(content, { touches: [{ clientX: 20, clientY: 0 }] });
    expect(content.style.transform).toBe("translateX(0px)");
  });
});
