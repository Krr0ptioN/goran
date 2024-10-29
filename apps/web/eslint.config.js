const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const baseConfig = require('../../eslint.config.js');

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

module.exports = [
    ...baseConfig,
    ...compat.extends(
        'plugin:@nx/react-typescript',
        'next',
        'next/core-web-vitals'
    ),
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@next/next/no-html-link-for-pages': ['error', 'apps/web/pages'],
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        // Override or add rules here
        rules: {},
    },
    {
        files: ['**/*.js', '**/*.jsx'],
        // Override or add rules here
        rules: {},
    },
    ...compat.config({ env: { jest: true } }).map((config) => ({
        ...config,
        files: [
            '**/*.spec.ts',
            '**/*.spec.tsx',
            '**/*.spec.js',
            '**/*.spec.jsx',
        ],
        rules: {
            ...config.rules,
        },
    })),
    { ignores: ['.next/**/*'] },
];
