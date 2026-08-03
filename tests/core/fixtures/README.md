# Sample Test Utilities

This directory contains shared utilities for sample plugin tests.

## Usage

### 1. Using the shared fixture (`sampleFixture.ts`)

The `createSampleTest` function creates a Playwright test instance with a `sampleTest` fixture that automatically sets up the plugin for testing.

```typescript
import { expect } from '@playwright/test';
import { createSampleTest } from '../../../tests/core/sampleFixture';
import { checkPluginAvailability } from '../../../tests/core/sampleBeforeAll';

const { test, setPluginUrl, getPluginUrl } = createSampleTest({
  envVarName: 'YOUR_PLUGIN_URL_ENV_VAR', // e.g., 'ACTIONS_BAR_URL'
  getPluginUrl: () => process.env.YOUR_PLUGIN_URL_ENV_VAR,
});
```

### 2. Using the shared beforeAll hook (`sampleBeforeAll.ts`)

The `checkPluginAvailability` function creates a `beforeAll` hook that automatically checks the plugin availability, fetches the plugin manifest and sets up the plugin URL.

```typescript
test.describe.parallel('Your Plugin Tests', () => {
  test.beforeAll(checkPluginAvailability({
    pluginName: 'sample-your-plugin-name', // Must match the folder name in /plugins/
    envVarName: 'YOUR_PLUGIN_URL_ENV_VAR',
    setPluginUrl,
    getPluginUrl,
  }));

  test('your test', async ({ sampleTest }) => {
    // Use sampleTest fixture here
    await sampleTest.modPage.hasElement('your-element');
  });
});
```

## Environment Variable Handling

The utilities support two ways to provide plugin URLs:

1. **Custom URL via environment variable**: Set `YOUR_PLUGIN_URL_ENV_VAR` to a custom plugin URL
2. **Auto-generated URL**: If no custom URL is provided, the `beforeAll` hook will construct the URL using the server configuration and plugin name
