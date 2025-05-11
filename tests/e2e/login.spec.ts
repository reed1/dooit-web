import { describe, test, expect } from 'vitest';
import { setup, createPage } from '@nuxt/test-utils/e2e';

describe('Authentication', async () => {
  await setup({
    host: 'http://127.0.0.1:3000',
  });

  test('root route redirects to login page', async () => {
    const page = await createPage('/');
    // Wait for navigation to complete
    await page.waitForURL('**/login');
    // Verify we're on the login page
    expect(await page.url()).toContain('/login');
    expect(await page.title()).toContain('Login');
  });
});