import { $window } from "@/shared/states";
import type { FileItem, ViewerData } from "@/types/file";

function getViewerData(): ViewerData {
	const viewerData = $window.viewer_data;
	if (!viewerData) {
		throw new Error("Viewer data is empty.");
	}
	return viewerData;
}

export function getCurrentFile(): FileItem {
	const data = getViewerData();

	if (data.type === "file") {
		return data.api_response;
	}

	const file = data.api_response.files.find((f) => f.selected);
	if (!file) {
		throw new Error("Can't get current file, not found selected.");
	}

	return file;
}

export function getAllFiles(): FileItem[] {
	const data = getViewerData();

	if (data.type === "file") {
		return [data.api_response];
	}

	return data.api_response.files;
}

export function getCurrentList(): string {
	const data = getViewerData();

	if (data.type === "file") {
		throw new Error("Can't get current list, page is a type file.");
	}

	return data.api_response.id;
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
