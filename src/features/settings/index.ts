import { DEFAULT_ARIA2_URL, DEFAULT_CUSTOM_PROXIES } from "@/shared/constants";

export interface FieldDeclarations {
	customProxies: {
		type: "textarea";
		label: string;
		description: string;
		placeholder: string;
		default: string;
	};
	aria2URL: {
		type: "input";
		label: string;
		description: string;
		placeholder: string;
		default: string;
	};
	aria2Secret: {
		type: "input";
		label: string;
		description: string;
		placeholder: string;
		default: string;
	};
	forceViewVideo: {
		type: "toggle";
		label: string;
		description: string;
		default: boolean;
	};
}

export type FieldKey = keyof FieldDeclarations;

export const FIELDS: FieldDeclarations = {
	customProxies: {
		type: "textarea",
		label: "Custom proxy URLs",
		description: "Separated by newline",
		placeholder: DEFAULT_CUSTOM_PROXIES,
		default: DEFAULT_CUSTOM_PROXIES,
	},
	aria2URL: {
		type: "input",
		label: "Aria2 RPC URL",
		description: "Aria2 RPC URL",
		placeholder: DEFAULT_ARIA2_URL,
		default: DEFAULT_ARIA2_URL,
	},
	aria2Secret: {
		type: "input",
		label: "Aria2 RPC Secret",
		description: "Secret token for aria2 RPC authentication (leave empty if not needed)",
		placeholder: "",
		default: "",
	},
	forceViewVideo: {
		type: "toggle",
		label: "Force view video",
		description: "Force view video, even if it's not logged.",
		default: true,
	},
};

export function getSetting<K extends FieldKey>(key: K): FieldDeclarations[K]["default"] {
	const field = FIELDS[key];
	return GM_getValue(key, field.default);
}

export function setSetting<K extends FieldKey>(key: K, value: FieldDeclarations[K]["default"]): void {
	GM_setValue(key, value);
}
