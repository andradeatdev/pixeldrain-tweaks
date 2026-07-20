import { DEFAULT_CUSTOM_PROXIES } from "@/constants";
import { copyFileLink, copyFilesLinks, copyListLink, downloadCurrentFile, downloadCurrentList } from "@/file";

export const CONFIG = {
	buttons: [
		{ icon: "save_alt", text: "DL file", action: downloadCurrentFile },
		{ icon: "save_alt", text: "DL list zip", action: downloadCurrentList },
		{ icon: "content_copy", text: "Copy link", action: copyFileLink },
		{ icon: "copy_all", text: "Copy all links", action: copyFilesLinks },
		{ icon: "folder_copy", text: "Copy list link", action: copyListLink },
		{ icon: "link", text: "Show links", attrs: { popovertarget: "pdt-urls" } },
		{ icon: "settings", text: "Settings", attrs: { popovertarget: "pdt-menu" } },
	],

	fields: {
		customProxies: {
			type: "textarea" as const,
			label: "Custom proxy URLs",
			description: "Separated by newline",
			placeholder: "https://proxy1.com/api\nhttps://proxy2.com/api",
			value: GM_getValue("customProxies", DEFAULT_CUSTOM_PROXIES),
		},
		forceViewVideo: {
			type: "toggle" as const,
			label: "Force view video",
			description: "Force view video, even if it's not logged.",
			value: GM_getValue("forceViewVideo", true),
		},
	},
};
