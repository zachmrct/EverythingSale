module.exports = {
    testEnvironment: 'node', // Use 'node' as the environment for Node.js projects
    transform: {},
    testMatch: ['**/?(*.)+(test).[tj]s?(x)'], // Match test files with .test.js or .test.ts extension
    collectCoverage: true,
    coverageReporters: ['text', 'lcov'], // Generate coverage report
    modulePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/build/'], // Ignore build directories
};
  