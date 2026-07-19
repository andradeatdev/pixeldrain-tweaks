import { getProxyURL } from "@/proxy";
import { $window } from "@/states";
import { openTab } from "@/utils";

interface FileItem {
	detail_href: string;
	description: string;
	id: string;
	name: string;
	size: number;
	views: number;
	bandwidth_used: number;
	bandwidth_used_paid: number;
	downloads: number;

	date_created: string;
	date_upload: string;
	date_last_view: string;

	mime_type: string;
	thumbnail_href: string;
	hash_sha256: string;

	delete_after_date: string;
	delete_after_downloads: number;

	availability: string;
	availability_message: string;

	abuse_type: string;
	abuse_reporter_name: string;

	title: string;
	file_count: number;
	files: FileItem[];

	can_edit: boolean;
	can_download: boolean;
	show_ads: boolean;
	allow_video_player: boolean;

	download_speed_limit: number;

	get_href: string;
	info_href: string;
	download_href: string;
	icon_href: string;
	timeseries_href: string;

	selected: boolean;
}

interface ViewerData {
	type: "list" | "file";

	api_response: FileItem;

	captcha_key: string;
	embedded: boolean;
	user_ads_enabled: boolean;
	theme_uri: string;
}

declare global {
	interface Window {
		viewer_data: ViewerData;
	}
}

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

export function showFilesURLs() {}
