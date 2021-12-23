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
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 2018,
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
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
		indent: ['off', 4]
    }
}
