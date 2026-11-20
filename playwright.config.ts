import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/growth-lab.spec.ts",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: process.env.LAB_URL || "http://localhost:4173",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {},
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "android-viewport", use: { ...devices["Pixel 7"], defaultBrowserType: "chromium" } },
    { name: "iphone-viewport", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
});
