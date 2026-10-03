module.exports = {
    preset: 'jest-puppeteer', // Use jest-puppeteer preset for headless browser testing
    testMatch: ['**/?(*.)+(e2e).[tj]s?(x)'], // Match test files with .e2e.js extension
    setupFilesAfterEnv: ['./jest.setup.js'], // Load setup file for each test
  };
  
  