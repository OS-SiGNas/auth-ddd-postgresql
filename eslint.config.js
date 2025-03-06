import globals from "globals";
import pluginJs from "@eslint/js";
import pluginSecurity from "eslint-plugin-security";
import tseslint from "typescript-eslint";

export default [
	// { files: ["**/*.{js,mts,cts,ts}"] },
	{ ignores: ["dist", "node_modules"] },
	{ files: ["src/**/*.{js,mts,cts,ts}"] },
	{
		rules: {
			"@typescript-eslint/interface-name-prefix": "off",
			"@typescript-eslint/explicit-function-return-type": "error",
			"@typescript-eslint/explicit-module-boundary-types": "warn",
			"@typescript-eslint/no-explicit-any": "warn",
		},
	},
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginSecurity.configs.recommended,
];
