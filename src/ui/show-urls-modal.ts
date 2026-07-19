import { getFileProxyURL, getFilesProxyURLs, getListProxyURL } from "@/file";
import { $window } from "@/states";
import { createModal } from "./modal";

export function createShowUrlsModal(): HTMLDivElement {
	const viewerData = $window.viewer_data;
	if (!viewerData) {
		throw new Error("Can't create Show URLs modal, viewer data is empty.");
	}

	const urls: string[] = [];

	if (viewerData.type === "file") {
		urls.push(getFileProxyURL());
	} else {
		urls.push(...getFilesProxyURLs(), getListProxyURL());
	}

	const content = document.createElement("div");
	content.className = "pdt-urls__content";

	const textarea = document.createElement("textarea");
	textarea.className = "pdt-urls__textarea";
	textarea.readOnly = true;
	textarea.value = urls.join("\n");
	textarea.rows = Math.min(urls.length + 1, 15);

	const copyBtn = document.createElement("button");
	copyBtn.className = "pdt-urls__copy";
	copyBtn.textContent = "Copy all";
	copyBtn.addEventListener("click", () => {
		$window.navigator.clipboard.writeText(textarea.value);
	});

	content.append(textarea, copyBtn);
	return createModal("pdt-urls", "Show URLs", content);
}
