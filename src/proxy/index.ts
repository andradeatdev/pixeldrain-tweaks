import { getSetting } from "@/settings";
import { getRandom } from "@/utils";

export function getProxyURL(): string {
	const raw = getSetting("customProxies");
	const proxies: string[] = [];

	for (const line of raw.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed) continue;

		if (trimmed.startsWith("#")) continue;

		proxies.push(trimmed);
	}

	if (proxies.length === 0) {
		throw new Error("No proxy URLs configured. Add at least one in Settings.");
	}

	return getRandom(proxies);
}
