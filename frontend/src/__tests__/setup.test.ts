import { describe, it, expect } from 'vitest';

describe('Test Setup', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true);
  });

  it('should have localStorage mock available', () => {
    expect(window.localStorage).toBeDefined();
  });

  it('should have matchMedia mock available', () => {
    expect(window.matchMedia).toBeDefined();
  });
});
