import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    onConsoleLog: () => false,
    onUnhandledError: (error) => {
      throw error;
    },
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/__tests__/**",
        "src/app/api/__tests__/**",
        "src/**/__tests__/**",
        "src/app/apple-icon.tsx",
        "src/app/icon.tsx",
        "src/app/opengraph-image.tsx",
        "src/app/error.tsx",
        "src/app/loading.tsx",
        "src/app/not-found.tsx",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
