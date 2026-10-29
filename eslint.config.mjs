import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tailwind from 'eslint-plugin-tailwindcss';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{ignores: ['.next', 'out', 'public', 'next-env.d.ts']},
	js.configs.recommended,
	importPlugin.flatConfigs.recommended,
	react.configs.flat.recommended,
	reactHooks.configs['recommended-latest'],
	...tailwind.configs['flat/recommended'],
	tseslint.configs.recommended,
	{
		plugins: {'@next/next': nextPlugin},
		rules: {
			...nextPlugin.configs.recommended.rules,
			...nextPlugin.configs['core-web-vitals'].rules
		}
	},
	{
		languageOptions: {
			globals: {...globals.browser, ...globals.node},
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		},
		plugins: {
			'@stylistic': stylistic,
			'unused-imports': unusedImports,
			'simple-import-sort': simpleImportSort
		},
		settings: {
			'react': {'version': 'detect'},
			'import/resolver': {'typescript': {}}
		},
		rules: {
			'import/default': 0,
			'react/prop-types': 0,
			// the static export has no image optimizer, so next/image buys nothing over a plain img
			'@next/next/no-img-element': 0,
			'@typescript-eslint/no-explicit-any': 'warn',
			'react/react-in-jsx-scope': 0,
			'no-async-promise-executor': 0,
			'import/no-unresolved': 0,
			'no-else-return': ['error', {'allowElseIf': false}],
			'import/no-named-as-default-member': 2,
			'tailwindcss/no-custom-classname': 0,
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn', {
					'vars': 'all',
					'varsIgnorePattern': '^_',
					'args': 'after-used',
					'argsIgnorePattern': '^_'
				}
			],
			'simple-import-sort/imports': 2,
			'simple-import-sort/exports': 2,
			'import/first': 2,
			'import/newline-after-import': 2,
			'import/no-duplicates': 2,
			'curly': ['error', 'all'],
			'prefer-destructuring': ['error', {'array': true, 'object': true}, {'enforceForRenamedProperties': false}],
			'@typescript-eslint/consistent-type-imports': [
				2, {
					'prefer': 'type-imports',
					'disallowTypeAnnotations': true,
					'fixStyle': 'separate-type-imports'
				}
			],
			'@typescript-eslint/no-require-imports': 0,
			'@typescript-eslint/no-unused-vars': 2,
			'@typescript-eslint/array-type': ['error', {'default': 'array'}],
			'@typescript-eslint/consistent-type-assertions': ['error', {'assertionStyle': 'as', 'objectLiteralTypeAssertions': 'never'}],
			'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
			'@typescript-eslint/consistent-indexed-object-style': ['error', 'index-signature'],
			'@typescript-eslint/naming-convention': [
				'error',
				{'selector': 'default', 'format': ['camelCase']},
				{'selector': 'function', 'format': ['camelCase', 'PascalCase']},

				{'selector': 'variableLike', 'format': ['camelCase', 'PascalCase', 'UPPER_CASE'], 'leadingUnderscore': 'allow'},
				{'selector': 'variable', 'types': ['boolean'], 'format': ['PascalCase'], 'prefix': ['is', 'should', 'has', 'can', 'did', 'will', 'with']},
				{
					'selector': 'default',
					'format': null,
					'filter': {'regex': '^(0-9)$', 'match': false}
				},
				{
					'selector': 'variableLike',
					'filter': {'regex': '^(set)', 'match': true},
					'format': ['camelCase'],
					'prefix': ['set_']
				},
				{
					'selector': 'variableLike',
					'format': ['PascalCase'],
					'filter': {'regex': '(Context)$|(ContextApp)$|^Component$', 'match': true}
				},
				{'selector': ['typeParameter', 'typeAlias'], 'format': ['PascalCase'], 'prefix': ['T']},
				{'selector': 'interface', 'format': ['PascalCase'], 'prefix': ['I']},
				{
					'selector': ['default', 'variableLike', 'parameter'],
					'format': null,
					'filter': {'regex': '^(__html|_css)$', 'match': true}
				}
			],
			'@typescript-eslint/no-misused-promises': ['error', {'checksConditionals': true, 'checksVoidReturn': false}],
			'@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
			'@typescript-eslint/no-unnecessary-qualifier': 'error',
			'@typescript-eslint/no-unnecessary-type-arguments': 'error',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': [
				'error', {
					'allowComparingNullableBooleansToTrue': false,
					'allowComparingNullableBooleansToFalse': false
				}
			],
			'@typescript-eslint/prefer-for-of': 'error',
			'@typescript-eslint/prefer-function-type': 'error',
			'@typescript-eslint/prefer-includes': 'error',
			'@typescript-eslint/prefer-optional-chain': 'error',
			'@typescript-eslint/promise-function-async': 'error',
			'@typescript-eslint/require-array-sort-compare': 'error',
			'dot-notation': 'off',
			'@typescript-eslint/dot-notation': ['error'],
			'@stylistic/no-mixed-spaces-and-tabs': 2,
			'@stylistic/quotes': [2, 'single', {'avoidEscape': true}],
			'@stylistic/object-curly-spacing': [2, 'never'],
			'@stylistic/array-bracket-spacing': [2, 'never'],
			'@stylistic/semi': 'error',
			'@stylistic/eol-last': ['error', 'always'],
			'@stylistic/array-bracket-newline': ['error', {'multiline': true}],
			'@stylistic/jsx-curly-brace-presence': ['error', {'props': 'always', 'children': 'always'}],
			'@stylistic/jsx-first-prop-new-line': ['error', 'multiline'],
			'@stylistic/jsx-max-props-per-line': ['error', {'maximum': {'single': 2, 'multi': 1}}],
			'@stylistic/jsx-closing-tag-location': 2,
			'@stylistic/object-curly-newline': [
				'error', {
					'ObjectExpression': {'multiline': true, 'consistent': true},
					'ObjectPattern': {'multiline': true, 'consistent': true},
					'ImportDeclaration': 'never',
					'ExportDeclaration': {'multiline': true, 'minProperties': 3}
				}
			],
			'@stylistic/object-property-newline': ['error', {'allowAllPropertiesOnSameLine': true}],
			'@stylistic/no-multi-spaces': ['error', {ignoreEOLComments: false}],
			'@stylistic/type-annotation-spacing': [
				'error', {
					'before': true,
					'after': true,
					'overrides': {'colon': {'before': false, 'after': true}}
				}
			],
			'@stylistic/brace-style': ['error', '1tbs'],
			'@stylistic/comma-dangle': ['error'],
			'@stylistic/comma-spacing': ['error'],
			'@stylistic/indent': ['error', 'tab']
		}
	},
	{
		// plain js (configs and scripts) sits outside the typescript project
		files: ['**/*.{js,mjs,cjs}'],
		extends: [tseslint.configs.disableTypeChecked]
	},
	{
		files: ['**/*.{ts,tsx}'],
		rules: {
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						[
							'^react',
							'^next',
							'^tailwindcss',
							'^@?\\w',
							'^(@yearn-finance/.*)?\\w',
							'^(@common/.*)?\\w',
							'^(@y.*)?\\w'
						],
						// Parent imports.
						['^\\u0000', '^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./?$', '^\\.(?!/?$)', '^\\./(?=.*/)(?!/?$)'],
						//Types imports.
						[
							'^node:.*\\u0000$',
							'^(@yearn-finance)?\\w.*\\u0000$',
							'^(@common)?\\w.*\\u0000$',
							'^(@y.*)?\\w.*\\u0000$',
							'^@?\\w.*\\u0000$',
							'^[^.].*\\u0000$',
							'^\\..*\\u0000$'
						],
						// Style imports.
						['^.+\\.s?css$']
					]
				}
			]
		}
	}
);
