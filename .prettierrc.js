module.exports = {
	'printWidth': 120, //一行的字符数，如果超过会进行换行，默认为80
	'tabWidth': 4, //一个tab代表几个空格数
	'useTabs': true, //是否使用tab进行缩进，默认为false，表示用空格进行缩减
	'singleQuote': true, //字符串是否使用单引号，默认为false，使用双引号
	'semi': false, //行位是否使用分号，默认为true
	'trailingComma': 'none', //是否使用尾逗号，有三个可选值"<none|es5|all>"
	'bracketSpacing': true, //对象大括号之间是否有空格，默认为true，效果：{ foo: bar }
	// 'parser': 'vue', //代码的解析引擎，默认为babylon，与babel相同。
	// "vueIndentScriptAndStyle": false,
	'arrowParens': 'avoid', //单参数箭头函数参数周围使用圆括号-eg: (x) => x
	// "embeddedLanguageFormatting": "off",
	// "ignorePath": "./prettifying",
	// "proseWrap": "never"
	'vueIndentScriptAndStyle': false, // vue文件首行是否缩进
	'quoteProps': 'as-needed', //仅在必需时为对象的key添加引号
	'jsxBracketSameLine': false,
	'jsxSingleQuote': false,
	'insertPragma': false,
	'requirePragma': false, //无需顶部注释即可格式化
	'endOfLine': 'lf', //结束行形式
	// "proseWrap": 'never',
	// "htmlWhitespaceSensitivity": 'strict',
	// "endOfLine": 'auto',
	'overrides': [
		{
			'files': '*.vue',
			'options': {
				'parser': 'vue'
			}
		}
	]
}
