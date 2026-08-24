import { doApiCall } from "$lib/core/api";
import { logger } from "$lib/core/telemetry";
import type { CrawlerResult } from "$lib/models/crawler";
import type { MediaType } from "$lib/models/media";
import pms from "pretty-ms";

export async function search(query: string, media_type: MediaType, signal: AbortSignal) {
	const start = performance.now();
	const resp = await doApiCall<CrawlerResult[]>(
		"crawler/search",
		{
			query,
			media_type
		},
		{
			// 30s should be enough on most network speeds
			timeout: 30_000,
			signal
		}
	);

	logger.debug(
		"fetched",
		resp.success ? resp.data.length : false,
		"crawler search results for",
		query,
		"and",
		media_type
	);

	return [resp, pms(performance.now() - start)] as const;
}
