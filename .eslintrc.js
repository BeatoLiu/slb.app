/* eslint-disable */
/**
 * 0 = off, 1 = warn, 2 = error
 */
module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true
	},
	extends: [
		"eslint:recommended",
		'standard',
		"plugin:vue/vue3-essential",
		"@vue/typescript/recommended",
		"@vue/prettier",
		"@vue/prettier/@typescript-eslint",
		// 'plugin:vue/vue3-recommended',
		// 'plugin:@typescript-eslint/recommended',
		// 'prettier',
		'plugin:prettier/recommended'
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		ecmaVersion: 2020,
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
	},
	plugins: [
		'vue',
		'@typescript-eslint',
		'prettier'
	],
	rules: {
		// 'prettier/prettier': 'error',
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		indent: ['off', 4],
		'linebreak-style': [
			'error',
			'unix'
		],
		'@typescript-eslint/no-explicit-any': 'error', // 是否对any进行提示
		'@typescript-eslint/no-non-null-assertion': 'off'
	}
}
