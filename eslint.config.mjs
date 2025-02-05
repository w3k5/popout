import { fixupConfigRules } from "@eslint/compat";
import js from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import reactHooks from "eslint-plugin-react-hooks";
import reactJsx from "eslint-plugin-react/configs/jsx-runtime.js";
import react from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";
import ts from "typescript-eslint";

export default [
	perfectionist.configs["recommended-natural"],
	{ languageOptions: { globals: globals.browser } },
	js.configs.recommended,
	...ts.configs.recommended,
	...fixupConfigRules([
		{
			...react,
			settings: {
				react: { version: "detect" },
			},
		},
		reactJsx,
	]),
	{
		plugins: {
			"react-hooks": reactHooks,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"react/no-children-prop": "off",
		},
	},
	{ ignores: ["dist/"] },
];
