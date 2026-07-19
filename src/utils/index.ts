export function openTab(url: string) {
	if (typeof GM_openInTab !== "undefined") return GM_openInTab(url);
	return window.open(url, "_blank");
}

export function getRandom<T>(arr: T[]): T {
	if (arr.length === 0) throw new Error("Can't get random item, array is empty.");
	return arr[Math.floor(Math.random() * arr.length)]!;
}
