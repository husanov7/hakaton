import '@testing-library/jest-dom';

// Reset zustand stores between tests
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  // Clear localStorage used by persist middleware
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.clear();
  }
});
