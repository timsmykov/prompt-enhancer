import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.spec.js',
        '**/*.test.js',
        'extension/vendor/'
      ],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    },
    include: ['tests/unit/**/*.{test,spec}.{js,mjs}'],
    testTimeout: 10000,
    hookTimeout: 10000
  }
});
