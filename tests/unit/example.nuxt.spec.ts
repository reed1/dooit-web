import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { renderSuspended } from '@nuxt/test-utils/runtime';
import { screen } from '@testing-library/vue';

describe('Example Test', () => {
  it('can mount a component', async () => {
    const component = await mountSuspended({
      template: '<div>Hello World</div>'
    });
    expect(component.text()).toBe('Hello World');
  });

  it('can render a component with testing library', async () => {
    await renderSuspended({
      template: '<div>Hello World</div>'
    });
    expect(screen.getByText('Hello World')).toBeDefined();
  });
});