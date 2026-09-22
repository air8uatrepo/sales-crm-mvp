import { defineConfig, devices } from "@playwright/test";

// E2E base URL is a runtime input from the environment. A local target must be
// a loopback URL; preview/production must be a non-loopback HTTPS URL. The
// global setup fails closed when these are missing.
const baseURL = process.env.BUSINESS_DIRECT_E2E_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
