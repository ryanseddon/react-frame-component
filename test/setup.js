import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

self.expect = expect;
self.sinon = {
  spy: (...args) => vi.fn(...args),
  stub: (...args) => vi.fn(...args)
};

afterEach(() => {
  cleanup();
});
