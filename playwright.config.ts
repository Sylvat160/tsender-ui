import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  workers: 1,
  timeout: 120_000,
  tsconfig: "./tsconfig.e2e.json",
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
  },
  webServer: {
    command: "bun dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
