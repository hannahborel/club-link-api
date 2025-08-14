// ESLint v9 flat config for club-link-api
const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const unusedImports = require('eslint-plugin-unused-imports');
const globals = require('globals');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
	{ ignores: ['node_modules/', 'dist/', 'build/', '.next/', 'out/', 'coverage/'] },
	js.configs.recommended,
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.es2021,
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			import: importPlugin,
			'unused-imports': unusedImports,
		},
		rules: {
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'unused-imports/no-unused-imports': 'error',
			'import/order': [
				'warn',
				{
					groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
					'newlines-between': 'always',
					alphabetize: { order: 'asc', caseInsensitive: true },
				},
			],
		},
	},
	{
		files: ['**/*.{js,jsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.es2021,
			},
		},
		plugins: { import: importPlugin, 'unused-imports': unusedImports },
		rules: {
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'unused-imports/no-unused-imports': 'error',
			'import/order': [
				'warn',
				{
					groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
					'newlines-between': 'always',
					alphabetize: { order: 'asc', caseInsensitive: true },
				},
			],
		},
	},
];


