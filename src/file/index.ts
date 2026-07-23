import { getProxyURL } from "@/proxy";
import { $window } from "@/states";
import type { FileItem } from "@/types/file";
import { openTab } from "@/utils";

function getCurrentFile(): FileItem {
	const viewerData = $window.viewer_data;
	if (!viewerData) {
		throw new Error("Can't get current file, viewer data is empty.");
	}

	if (viewerData.type === "file") {
		return viewerData.api_response;
	}

	const file = viewerData.api_response.files.find((f) => f.selected);
	if (!file) {
		throw new Error("Can't get current file, not found selected.");
	}

	return file;
}

function getAllFiles(): FileItem[] {
	const viewerData = $window.viewer_data;
	if (!viewerData) {
		throw new Error("Can't get files, viewer data is empty.");
	}

	if (viewerData.type === "file") {
		return [viewerData.api_response];
	}

	return viewerData.api_response.files;
}

function getCurrentList(): string {
	const viewerData = $window.viewer_data;
	if (!viewerData) {
		throw new Error("Can't get current list, viewer data is empty.");
	}

	if (viewerData.type === "file") {
		throw new Error("Can't get current list, page is a type file.");
	}

	return viewerData.api_response.id;
}

export function getFileProxyURL(): string {
	const currentFile = getCurrentFile();
	const proxyURL = getProxyURL();
	return `${proxyURL}/${currentFile.id}?download=`;
}

export function getFilesProxyURLs(): string[] {
	const filesIDs = getAllFiles();
	const proxyURL = getProxyURL();
	return filesIDs.map((f) => `${proxyURL}/${f.id}?filename=${f.id}.${f.name.split(".").at(-1) || "txt"}`);
}

export function getListProxyURL(): string {
	const currentListID = getCurrentList();
	const proxyURL = getProxyURL();
	return `${proxyURL}/zip/${currentListID}`;
}

export function downloadCurrentFile() {
	openTab(getFileProxyURL());
}

export function downloadCurrentList() {
	openTab(getListProxyURL());
}

export function copyFileLink() {
	const currentFile = getCurrentFile();
	const proxyURL = getProxyURL();
	$window.navigator.clipboard.writeText(
		`${proxyURL}/${currentFile.id}?filename=${currentFile.id}.${currentFile.name.split(".").at(-1) || "txt"}`,
	);
}

export function copyFilesLinks() {
	$window.navigator.clipboard.writeText(getFilesProxyURLs().join("\n"));
}

export function copyListLink() {
	const currentListID = getCurrentList();
	const proxyURL = getProxyURL();
	$window.navigator.clipboard.writeText(`${proxyURL}/zip/${currentListID}?filename=${currentListID}.zip`);
}

export function patchViewerData() {
	Object.defineProperty($window, "viewer_data", {
		get() {
			return $window._viewer_data;
		},
		set(v) {
			if (v.type === "file") v.api_response.allow_video_player = true;

			if (v.type === "list") {
				for (const f of v.api_response.files) {
					f.allow_video_player = true;
				}
			}

			$window._viewer_data = v;
		},
	});
}
