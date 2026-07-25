import {
	copyFileLink,
	copyFilesLinks,
	copyListLink,
	downloadCurrentFile,
	downloadCurrentList,
	sendFileToAria2,
	sendListToAria2,
	sendZipToAria2,
} from "@/file";

export const CONFIG = {
	buttons: [
		{ icon: "save_alt", text: "DL file", action: downloadCurrentFile },
		{ icon: "save_alt", text: "DL list zip", action: downloadCurrentList },
		{ icon: "content_copy", text: "Copy link", action: copyFileLink },
		{ icon: "copy_all", text: "Copy all links", action: copyFilesLinks },
		{ icon: "folder_copy", text: "Copy list link", action: copyListLink },
		{ icon: "launch", text: "Aria2 (file)", action: sendFileToAria2 },
		{ icon: "launch", text: "Aria2 (list)", action: sendListToAria2 },
		{ icon: "launch", text: "Aria2 (zip)", action: sendZipToAria2 },
		{ icon: "link", text: "Show links", attrs: { popovertarget: "pdt-urls" } },
		{ icon: "settings", text: "Settings", attrs: { popovertarget: "pdt-menu" } },
	],
};
