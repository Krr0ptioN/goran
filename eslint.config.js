const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const nxEslintPlugin = require('@nx/eslint-plugin');


const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

module.exports = [
    {
        ignores: ["./**/eslint.config.js", "./**/webpack.config.js"],
    },
    { plugins: { '@nx': nxEslintPlugin } },
    // ...compat
    //     .config({
    //         extends: ['plugin:@darraghor/nestjs-typed/recommended'],
    //         plugins: ['@darraghor/nestjs-typed'],
    //     })
    //     .map((config) => ({
    //         ...config,
    //         files: ['**/*.ts', '**/*.js'],
    //         rules: {
    //             ...config.rules,
    //             '@darraghor/nestjs-typed/injectable-should-be-provided': 'off',
    //         },
    //         languageOptions: {
    //             parserOptions: { project: ['./tsconfig.base.json'] },
    //         },
    //     })),
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            indent: ['error', 4],
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    enforceBuildableLibDependency: true,
                    allow: [],
                    depConstraints: [
                        {
                            sourceTag: '*',
                            onlyDependOnLibsWithTags: ['*'],
                        },
                    ],
                },
            ],
        },
    },
    ...compat.config({ extends: ['plugin:@nx/typescript'] }).map((config) => ({
        ...config,
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            ...config.rules,
        },
    })),
    ...compat.config({ extends: ['plugin:@nx/javascript'] }).map((config) => ({
        ...config,
        files: ['**/*.js', '**/*.jsx'],
        rules: {
            ...config.rules,
        },
    })),
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
    {
        files: ['**/*.{ts,tsx}'],
        rules: {
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
        },
    },
];
