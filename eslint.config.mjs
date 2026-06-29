import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierConfig from 'eslint-config-prettier'
import prettier from 'eslint-plugin-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
	...nextVitals,
	...nextTs,
	globalIgnores(['#/linting/**']),
	prettierConfig,
	{
		plugins: {
			prettier,
		},
		settings: {
			'import/resolver': {
				typescript: {
					project: './tsconfig.json',
				},
			},
		},
		rules: {
			'prettier/prettier': 'error',
			camelcase: 'off',
			'import/prefer-default-export': 'off',
			'react/jsx-filename-extension': 'off',
			'react/jsx-props-no-spreading': 'off',
			'react/no-unused-prop-types': 'off',
			'react/require-default-props': 'off',
			'react/no-unescaped-entities': 'off',
			'import/extensions': [
				'error',
				'ignorePackages',
				{
					ts: 'never',
					tsx: 'never',
					js: 'never',
					jsx: 'never',
				},
			],
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['../../**', '../../../**', '../../../../**'],
							message: 'Use absolute imports instead of deep (“../../”) relative imports.',
						},
					],
				},
			],
		},
	},
	{
		files: ['**/*.+(ts|tsx)'],
		rules: {
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'no-use-before-define': 'off',
			'@typescript-eslint/no-use-before-define': 'warn',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/consistent-type-imports': 'error',
			'jsx-a11y/alt-text': [
				'warn',
				{
					elements: ['img'],
					img: ['Image'],
				},
			],
			'jsx-a11y/aria-props': 'warn',
			'jsx-a11y/aria-proptypes': 'warn',
			'jsx-a11y/aria-unsupported-elements': 'warn',
			'jsx-a11y/role-has-required-aria-props': 'warn',
			'jsx-a11y/role-supports-aria-props': 'warn',
		},
	},
])
