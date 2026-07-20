import { DEFAULT_CUSTOM_PROXIES } from "@/constants";
import { getRandom } from "@/utils";

export function getProxyURL(): string {
	const raw = GM_getValue<string>("customProxies", DEFAULT_CUSTOM_PROXIES);
	const proxies: string[] = [];

	for (const line of raw.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed) continue;

		proxies.push(line);
	}

	return getRandom(proxies);
}
