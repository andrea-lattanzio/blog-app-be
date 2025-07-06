module.exports = {
	env: {
		es6: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/all",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"prettier",
	],
	ignorePatterns: ["node_modules", "dist", ".eslintrc.js"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "tsconfig.json",
		sourceType: "module",
	},
	plugins: [
		"@typescript-eslint",
		"@typescript-eslint/tslint",
		"prefer-arrow",
		"import",
		"no-null",
		"unicorn",
		"jsdoc",
		"promise",
		"prettier",
		"disable-autofix",
		"babel",
		"unused-imports",
	],
	rules: {
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
		"unused-imports/no-unused-imports": "warn",
		"unused-imports/no-unused-vars": [
			"warn",
			{ vars: "all", varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
		],

		"sort-imports": [
			"warn",
			{
				allowSeparatedGroups: true,
				ignoreDeclarationSort: true,
			},
		],

		"import/order": [
			"warn",
			{
				groups: [
					"builtin",
					"type",
					"external",
					"internal",
					"parent",
					"sibling",
					"index",
					"object",
				],
				pathGroups: [
					{
						pattern: "../../../**",
						group: "parent",
						position: "before",
					},
					{
						pattern: "../../**",
						group: "parent",
						position: "before",
					},
					{
						pattern: "../**",
						group: "parent",
						position: "before",
					},
					{
						pattern: "@apps/**",
						group: "internal",
						position: "before",
					},
					{
						pattern: "@libs/**",
						group: "internal",
						position: "before",
					},
				],
				pathGroupsExcludedImportTypes: ["type"],
				"newlines-between": "always",
				alphabetize: {
					order:
						"asc" /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
					caseInsensitive: true /* ignore case. Options: [true, false] */,
				},
			},
		],

		quotes: ["error", "single"],
		indent: [
			"error",
			2,
			{
				SwitchCase: 1,
				ignoredNodes: [
					`FunctionExpression > .params[decorators.length > 0]`,
					`FunctionExpression > .params > :matches(Decorator, :not(:first-child))`,
					`ClassBody.body > PropertyDefinition[decorators.length > 0] > .key`,
				],
			},
		],
		"max-len": ["warn", { code: 120 }],
		"space-before-blocks": ["warn"],
		"no-case-declarations": "warn",
		"padding-line-between-statements": [
			"warn",
			{ blankLine: "always", prev: "*", next: "return" },
		],
		"object-curly-spacing": ["warn", "always"],
		"array-bracket-spacing": ["warn", "never"],
		"computed-property-spacing": ["warn", "never"],
		"no-multiple-empty-lines": ["warn", { max: 1 }],
		"padded-blocks": ["warn", { blocks: "never" }],
		"no-multi-spaces": "warn",
		"comma-dangle": [
			"warn",
			{
				arrays: "always-multiline",
				objects: "always-multiline",
				imports: "always-multiline",
				exports: "always-multiline",
				functions: "always-multiline",
			},
		],
		"eol-last": ["warn", "always"],
		"no-trailing-spaces": "error",
		"space-in-parens": "warn",

		// disable auto fix on some rules
		"@typescript-eslint/non-nullable-type-assertion-style": "off",
		"disable-autofix/@typescript-eslint/non-nullable-type-assertion-style":
			"error",
		"@typescript-eslint/no-unnecessary-condition": "off",
		"disable-autofix/@typescript-eslint/no-unnecessary-condition": "error",

		// disabled rules after discussion
		"no-magic-numbers": "off",
		"@typescript-eslint/no-magic-numbers": "off",

		// babel rules
		semi: "off",
		"babel/semi": 1,

		// basic typescript rules
		"@typescript-eslint/typedef": [
			"error",
			{
				arrowParameter: true,
				variableDeclaration: true,
				propertyDeclaration: true,
				memberVariableDeclaration: true,
				variableDeclarationIgnoreFunction: true,
			},
		],
		"@typescript-eslint/prefer-readonly-parameter-types": "off",
		"@typescript-eslint/array-type": ["warn", { default: "array-simple" }],
		"@typescript-eslint/no-inferrable-types": "off",
		"@typescript-eslint/no-unnecessary-type-arguments": "off",
		"@typescript-eslint/prefer-regexp-exec": "off",
		"@typescript-eslint/no-confusing-void-expression": [
			"warn",
			{ ignoreArrowShorthand: true },
		],
		"@typescript-eslint/no-use-before-define": "off",
		"@typescript-eslint/init-declarations": "off",
		"@typescript-eslint/require-array-sort-compare": [
			"error",
			{ ignoreStringArrays: true },
		],
		"no-return-await": "off",
		"@typescript-eslint/return-await": ["error", "in-try-catch"],

		// member ordering
		"@typescript-eslint/member-ordering": "off",

		// any -> to be put in error later
		"@typescript-eslint/no-explicit-any": "warn",
		"@typescript-eslint/no-unsafe-assignment": "warn",
		"@typescript-eslint/no-unsafe-member-access": "warn",
		"@typescript-eslint/no-unsafe-argument": "warn",
		"@typescript-eslint/no-unsafe-call": "warn",
		"@typescript-eslint/no-unsafe-return": "warn",
		"@typescript-eslint/explicit-module-boundary-types": "warn",

		// NestJS
		"@typescript-eslint/no-extraneous-class": ["error", { allowEmpty: true }],
		"@typescript-eslint/no-useless-constructor": "off",
		"@typescript-eslint/explicit-member-accessibility": "off",
		"@typescript-eslint/parameter-properties": "off",
		"@typescript-eslint/class-methods-use-this": [
			"warn",
			{
				exceptMethods: [
					// used in NestModule
					"configure",
				],
			},
		],

		// inputs or args without graphql decorator
		"@typescript-eslint/lines-between-class-members": "off",

		// because of key like `lines.department`
		"@typescript-eslint/naming-convention": [
			"warn",
			{ selector: ["enumMember"], format: ["UPPER_CASE"] },
		],
	},
};
