import { CONFIG } from "@/config";
import { getRandom } from "@/utils";

export function getProxyURL(): string {
	const raw = GM_getValue<string>("customProxies", CONFIG.fields.customProxies.value);
	const proxies: string[] = [];

	for (const line of raw.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed) continue;

		proxies.push(line);
	}

	return getRandom(proxies);
}
