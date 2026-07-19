import { copyFileLink, copyFilesLinks, copyListLink, downloadCurrentFile, downloadCurrentList } from "@/file";

export const CONFIG = {
	buttons: [
		{ icon: "download", text: "DL file", action: downloadCurrentFile },
		{ icon: "download", text: "DL list zip", action: downloadCurrentList },
		{ icon: "content_copy", text: "Copy file", action: copyFileLink },
		{ icon: "content_copy", text: "Copy all files", action: copyFilesLinks },
		{ icon: "content_copy", text: "Copy list zip", action: copyListLink },
		{ icon: "link", text: "Show URLs", attrs: { popovertarget: "pdt-urls" } },
		{ icon: "settings", text: "Settings", attrs: { popovertarget: "pdt-menu" } },
	],

	fields: {
		customProxies: {
			type: "textarea" as const,
			label: "Custom proxy URLs",
			description: "Separated by newline",
			placeholder: "https://proxy1.com/api\nhttps://proxy2.com/api",
			value: GM_getValue(
				"customProxies",
				["http://cdn.pixeldrain.eu.cc", "https://pixeldrain.fdyzen.workers.dev"].join("\n"),
			),
		},
		forceViewVideo: {
			type: "toggle" as const,
			label: "Force view video",
			description: "Force view video, even if it's not logged.",
			value: GM_getValue("forceViewVideo", true),
		},
	},
};
