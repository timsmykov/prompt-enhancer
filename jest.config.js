module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/unit/**/*.test.{js,ts}'],
  collectCoverageFrom: [
    'extension/src/**/*.js',
    '!extension/src/vendor/**',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/extension/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/unit/setup.js'],
  testTimeout: 10000,
  verbose: true,
};
