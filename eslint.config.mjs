import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginJest from 'eslint-plugin-jest'; // Jest plugin

export default [
  {
    files: ['**/*.js'],  // Apply the following settings to all JavaScript files
    languageOptions: {
      sourceType: 'commonjs', // Set source type to commonjs for Node.js modules
      globals: {
        ...globals.browser,  // Keep browser globals
        process: 'readonly', // Add process as a global variable
      },
    },
  },

  // Use recommended ESLint rules for general JavaScript
  pluginJs.configs.recommended,

  // Apply the Jest plugin to all test-related files (including .e2e.js)
  {
    files: ['**/*.test.js', '**/*.spec.js', '**/*.e2e.js', '*.setup.js'], // Apply to Jest test files and e2e.js files
    plugins: {
      jest: eslintPluginJest, // Enable the Jest plugin
    },
    languageOptions: {
      globals: {
        ...globals.browser,  // Keep browser globals
        process: 'readonly', // Add process as a global variable
        jest: true, // Add Jest globals (e.g., `describe`, `it`, `expect`)
        page: true, // Add page as a global variable (used by Puppeteer or Playwright)
        describe:true,
        beforeAll:true,
        it:true,
        expect:true,
        afterAll: true, // Add afterAll as a global variable
        beforeEach: true, // Add beforeEach as a global variable
        afterEach: true, // Add afterEach as a global variable
      },
    },
    rules: {
      'jest/expect-expect': 'error',  // Ensure `expect()` is used in every test
      'jest/no-disabled-tests': 'warn', // Warn about skipped tests
      'jest/no-focused-tests': 'error',  // Disallow focused tests (e.g., `it.only`)
      'jest/no-identical-title': 'error',  // Disallow tests with identical titles
    },
  },
];

