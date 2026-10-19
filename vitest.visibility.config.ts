import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    include: ["tests/visibility/**/*.test.ts"],
    pool: "forks",
    maxWorkers: 2,
  },
});
