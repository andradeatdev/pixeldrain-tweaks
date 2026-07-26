import { $window } from "@/shared/states";
import { showToast } from "@/ui/toast";

export function getRandom<T>(arr: T[]): T {
	if (arr.length === 0) throw new Error("Can't get random item, array is empty.");

	const index = Math.floor(Math.random() * arr.length);
	const item = arr[index];
	if (item === undefined) throw new Error("Can't get random item, array element is undefined.");

	return item;
}

export async function copyToClipboard(text: string): Promise<void> {
	try {
		return $window.navigator.clipboard.writeText(text);
	} catch {
		showToast("Failed to copy to clipboard");
	}
}

export function openTab(url: string) {
	if (typeof GM_openInTab !== "undefined") return GM_openInTab(url);
	return window.open(url, "_blank");
}
