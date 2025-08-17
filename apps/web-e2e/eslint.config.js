// apps/web-e2e/eslint.config.js
const baseConfig = require('../../eslint.config.js');
const cypress = require('eslint-plugin-cypress');

module.exports = [
  ...baseConfig,

  // Cypress (flat config)
  {
    name: 'cypress-web-e2e',
    files: [
      '**/*.cy.{ts,tsx,js,jsx}',
      'cypress/**/*.{ts,tsx,js,jsx}',
    ],
    plugins: { cypress },
    languageOptions: {
      // Define Cypress/Chai globals explicitly (robust across plugin versions)
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
        // add more if you use them:
        // chai: 'readonly',
        // sinon: 'readonly',
      },
    },
    // Safely apply recommended rules if exposed; otherwise fall back to {}
    rules: (cypress.configs && cypress.configs.recommended && cypress.configs.recommended.rules) || {},
  },

  // Local overrides (optional)
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {},
  },
];
