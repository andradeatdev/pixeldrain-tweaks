import {
	getFileCopyURL,
	getFileProxyURL,
	getFileRawURL,
	getFilesProxyURLs,
	getFilesRawURLs,
	getListCopyURL,
	getListProxyURL,
	getZipRawURL,
} from "@/file/url-builder";
import { getSetting } from "@/settings";
import { showToast } from "@/ui/toast";
import { copyToClipboard, openTab } from "@/utils";

export {
	getFileCopyURL,
	getFileProxyURL,
	getFileRawURL,
	getFilesProxyURLs,
	getListCopyURL,
	getListProxyURL,
	getZipRawURL as getListRawURL,
} from "@/file/url-builder";
export { getAllFiles, getCurrentFile, getCurrentList, patchViewerData } from "@/file/viewer-data";

export function downloadCurrentFile() {
	openTab(getFileProxyURL());
}

export function downloadCurrentList() {
	openTab(getListProxyURL());
}

export async function copyFileLink() {
	await copyToClipboard(getFileCopyURL());
}

export async function copyFilesLinks() {
	await copyToClipboard(getFilesProxyURLs().join("\n"));
}

export async function copyListLink() {
	await copyToClipboard(getListCopyURL());
}

function sendToAria2(url: string | string[]) {
	const aria2URL = getSetting("aria2URL");
	if (!aria2URL) throw new Error("Aria2 URL is not set, check if you have it in Settings.");

	const aria2Secret = getSetting("aria2Secret");
	const params: (string | string[])[] = [Array.isArray(url) ? url : [url]];
	if (aria2Secret) {
		params.unshift(`token:${aria2Secret}`);
	}

	GM_xmlhttpRequest({
		url: aria2URL,
		method: "POST",
		responseType: "json",
		data: JSON.stringify({
			jsonrpc: "2.0",
			id: `pdt-${Date.now()}`,
			method: "aria2.addUri",
			params,
		}),
		headers: { "Content-Type": "application/json" },
		onerror() {
			showToast("Aria2: connection failed. Check if the server is running.");
		},
		onload(response) {
			console.log("Response", response);
			if (response.status === 200) {
				showToast("Aria2: success");
				return;
			}

			const body = response.response as { error: { message: string } };
			if (body?.error.message) {
				showToast(`Aria2: ${body.error.message || "RPC error"}`);
				return;
			}

			showToast(`Aria2: HTTP ${response.status}`);
		},
	});
}

export function sendFileToAria2() {
	sendToAria2(getFileRawURL());
}

export function sendListToAria2() {
	sendToAria2(getFilesRawURLs());
}

export function sendZipToAria2() {
	sendToAria2(getZipRawURL());
}
