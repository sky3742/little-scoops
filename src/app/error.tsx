"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <p className="text-4xl font-bold">Something went wrong</p>
        <p className="text-muted-foreground text-sm">{error.message}</p>
        <button onClick={reset} className="text-primary text-sm underline underline-offset-4">
          Try again
        </button>
      </div>
    </div>
  );
}
