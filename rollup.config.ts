import path from "node:path";
import { fileURLToPath } from "node:url";
import css from "@hdyzen/rollup-plugin-userscript-css";
import metablock from "@hdyzen/rollup-plugin-userscript-meta";
import alias from "@rollup/plugin-alias";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

export default {
	input: "src/index.ts",
	output: {
		file: "dist/script.user.js",
		format: "esm",
		strict: false,
	},
	watch: {
		clearScreen: false,
	},
	plugins: [
		css(),
		metablock({
			name: "Pixeldrain Tweaks",
			namespace: "https://greasyfork.org/users/821661",
			description:
				"Adds direct-download buttons and links for Pixeldrain files using an alternate proxy — inspired by 'Pixeldrain Download Bypass' by hhoneeyy and MegaLime0",
			version: "2.0.1",
			author: "hdyzen",
			match: [
				"https://pixeldrain.com/*",
				"https://pixeldrain.net/*",
				"https://pixeldrain.dev/*",
				"https://pixeldrain.co/*",
				"https://pixeldrain.cc/*",
				"https://pixeldrain.in/*",
			],
			runAt: "document-end",
			grant: ["GM_openInTab", "GM_addStyle", "GM_getValue", "GM_setValue"],
			icon: "https://www.google.com/s2/favicons?domain=pixeldrain.com/&sz=64",
			license: "GPL-3.0-only",
		}),
		alias({
			entries: [
				{
					find: "@",
					replacement: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src"),
				},
			],
		}),
		resolve({ extensions: [".js", ".ts"], browser: true }),
		commonjs(),
		babel({
			babelHelpers: "bundled",
			retainLines: true,
			exclude: "node_modules/**",
			presets: ["@babel/preset-env", "@babel/preset-typescript"],
			extensions: [".js", ".ts"],
		}),
	],
};
