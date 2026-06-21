"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";

interface SwipeToDeleteProps {
  onDelete: () => void;
  children: React.ReactNode;
}

function SwipeToDelete({ onDelete, children }: SwipeToDeleteProps) {
  const [offsetX, setOffsetX] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const startX = React.useRef(0);
  const currentX = React.useRef(0);

  const DELETE_THRESHOLD = 56;

  const handleStart = (clientX: number) => {
    startX.current = clientX;
    currentX.current = clientX;
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    currentX.current = clientX;
    const diff = currentX.current - startX.current;
    if (diff < 0) {
      setOffsetX(Math.max(diff, -DELETE_THRESHOLD));
    } else if (offsetX < 0) {
      setOffsetX(Math.min(offsetX + diff, 0));
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (offsetX < -DELETE_THRESHOLD / 2) {
      setOffsetX(-DELETE_THRESHOLD);
    } else {
      setOffsetX(0);
    }
  };

  return (
    <div className="relative overflow-hidden" data-testid="swipe-container">
      <div
        className="absolute top-0 right-0 bottom-0 flex items-center justify-center w-14"
        onClick={onDelete}
        data-testid="delete-button"
      >
        <Trash2 className="size-4 text-destructive" />
      </div>
      <div
        className="relative z-10 bg-background"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? "none" : "transform 200ms ease-out",
        }}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => {
          if (isDragging) {
            e.preventDefault();
            handleMove(e.clientX);
          }
        }}
        onMouseUp={handleEnd}
        onMouseLeave={() => {
          if (isDragging) handleEnd();
        }}
        data-testid="swipe-content"
      >
        {children}
      </div>
    </div>
  );
}

export { SwipeToDelete };
export type { SwipeToDeleteProps };
