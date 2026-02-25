import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';

const isCI = process.env.CI === 'true';
const isMac = process.platform === 'darwin';

export default defineConfig({
  plugins: [react()],
  test: {
    browser: {
      enabled: true,
      provider: playwright({
        launchOptions: {
          headless: true
        }
      }),
      instances: [
        {
          browser: 'chromium',
          headless: true
        },
        ...(isCI ? [{ browser: 'firefox', headless: true }] : []),
        ...(!isCI && isMac ? [{ browser: 'webkit', headless: true }] : [])
      ]
    },
    globals: true,
    setupFiles: ['./test/setup.js']
  }
});
