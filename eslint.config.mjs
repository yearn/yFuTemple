import js from '@eslint/js';
import react from '@eslint-react/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';
import {createTypeScriptImportResolver} from 'eslint-import-resolver-typescript';
import astro from 'eslint-plugin-astro';
import {importX} from 'eslint-plugin-import-x';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tailwind from 'eslint-plugin-tailwindcss';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{ignores: ['.astro', 'dist', 'public', '.claude']},
	js.configs.recommended,
	importX.flatConfigs.recommended,
	importX.flatConfigs.typescript,
	tailwind.configs.recommended,
	tseslint.configs.recommended,
	...astro.configs.recommended,
	{
		files: ['**/*.{ts,tsx}'],
		// names follow the naming-convention rule below rather than the plugin's own
		extends: [react.configs['recommended-typescript'], react.configs['disable-naming-convention']],
		plugins: {'react-hooks': reactHooks},
		settings: {'react-x': {importSource: 'preact'}},
		rules: {
			// the islands run on preact, so of the hooks plugin only the rules of hooks apply; its other
			// rules check code for the react compiler and don't know preact's hooks
			'react-hooks/rules-of-hooks': 2,
			'react-hooks/exhaustive-deps': 2,
			// an effect is the place to read browser-only state (storage, the url hash)
			// after the static render and to scroll once the dom has updated
			'@eslint-react/set-state-in-effect': 0,
			// preact reads a context with useContext, it has no use()
			'@eslint-react/no-use-context': 0,
			// setters are named set_ + the state, which this rule doesn't know
			'@eslint-react/use-state': 0,
			// comic pages and markdown paragraphs are known by their position, which never changes
			'@eslint-react/no-array-index-key': 0
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
			'import-x/resolver-next': [createTypeScriptImportResolver()],
			'tailwindcss': {'cssConfigPath': 'src/style.css'}
		},
		rules: {
			'import-x/default': 0,
			'@typescript-eslint/no-explicit-any': 'warn',
			'no-async-promise-executor': 0,
			'import-x/no-unresolved': 0,
			'no-else-return': ['error', {'allowElseIf': false}],
			'import-x/no-named-as-default-member': 2,
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
			'import-x/first': 2,
			'import-x/newline-after-import': 2,
			'import-x/no-duplicates': 2,
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
		// plain js (configs and scripts) sits outside the typescript project, and so do astro components
		files: ['**/*.{js,mjs,cjs,astro}'],
		extends: [tseslint.configs.disableTypeChecked]
	},
	{
		// eslint plugins document their configs as members of the default export
		files: ['eslint.config.mjs'],
		rules: {'import-x/no-named-as-default-member': 0}
	},
	{
		// astro templates are html: attributes are plain strings and elements are laid out as markup
		files: ['**/*.astro'],
		rules: {
			'@stylistic/jsx-curly-brace-presence': 0,
			'@stylistic/jsx-max-props-per-line': 0,
			'@stylistic/jsx-closing-tag-location': 0
		}
	},
	{
		files: ['**/*.{ts,tsx,astro}'],
		rules: {
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						[
							'^react',
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
