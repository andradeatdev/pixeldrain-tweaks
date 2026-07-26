import { getFileProxyURL, getFilesProxyURLs, getListProxyURL } from "@/features/download";
import { $window } from "@/shared/states";
import { copyToClipboard } from "@/shared/utils";
import { createModal } from "./modal";

function getUrlsForPage(): string[] {
	const viewerData = $window.viewer_data;
	if (!viewerData) return [];

	if (viewerData.type === "file") {
		return [getFileProxyURL()];
	}

	return [...getFilesProxyURLs(), getListProxyURL()];
}

function refreshUrls(textarea: HTMLTextAreaElement): void {
	const urls = getUrlsForPage();
	textarea.value = urls.join("\n");
	textarea.rows = Math.min(urls.length + 1, 15);
}

export function createShowUrlsModal(): HTMLDivElement {
	const content = document.createElement("div");
	content.className = "pdt-modal__content";

	const textarea = document.createElement("textarea");
	textarea.className = "pdt-textarea pdt-urls__textarea";
	textarea.readOnly = true;

	const copyBtn = document.createElement("button");
	copyBtn.className = "pdt-urls__copy";
	copyBtn.textContent = "Copy all";
	copyBtn.addEventListener("click", () => copyToClipboard(textarea.value));

	content.append(textarea, copyBtn);

	const modal = createModal("pdt-urls", "Show URLs", content);
	refreshUrls(textarea);
	modal.addEventListener("popovershow", () => refreshUrls(textarea));

	return modal;
}
