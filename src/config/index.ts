import {
	copyFileLink,
	copyFilesLinks,
	copyListLink,
	downloadCurrentFile,
	downloadCurrentList,
	sendFileToAria2,
	sendListToAria2,
	sendZipToAria2,
} from "@/features/download";

export const CONFIG = {
	buttons: [
		{ icon: "save_alt", text: "DL file", action: downloadCurrentFile },
		{ icon: "save_alt", text: "DL list zip", action: downloadCurrentList },
		{ icon: "content_copy", text: "Copy link", action: copyFileLink },
		{ icon: "content_copy", text: "Copy all links", action: copyFilesLinks },
		{ icon: "folder", text: "Copy list link", action: copyListLink },
		{ icon: "open_in_new", text: "Aria2 (file)", action: sendFileToAria2 },
		{ icon: "open_in_new", text: "Aria2 (list)", action: sendListToAria2 },
		{ icon: "open_in_new", text: "Aria2 (zip)", action: sendZipToAria2 },
		{ icon: "add_link", text: "Show links", attrs: { popovertarget: "pdt-urls" } },
		{ icon: "settings", text: "Settings", attrs: { popovertarget: "pdt-menu" } },
	],
};
