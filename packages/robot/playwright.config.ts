import { nxE2EPreset } from "@nx/playwright/preset";
import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: "./e2e" }),
  timeout: 60 * 1000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    actionTimeout: 10 * 60 * 1000,
    // headless: false,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    video: "retain-on-failure",
    trace: "on-first-retry",

    permissions: [],

    /** INFO:
     * sepertinya ini yang menyebabkan error ketika mode headless
     */
    // viewport: { width: 1920, height: 1080 },

    launchOptions: {
      args: [
        // "--disable-notifications",
        // "--disable-blink-features=AutomationControlled",
        /** Mematikan hardware acceleration dan codec video */
        // "--disable-software-rasterizer",
        // "--mute-audio",
      ],
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // Not used first
    /* {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    }, */
    /* {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }, */

    // Uncomment for mobile browsers support
    /* {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    }, */

    // Uncomment for branded browsers
    /* {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    } */
  ],
});
