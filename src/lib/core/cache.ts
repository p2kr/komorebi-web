import { doApiCall } from "$lib/core/api";
import type { ParsedTitle } from "$lib/models/dto";
import { LRUCache } from "lru-cache/raw";

export const parsedTitleCache = new LRUCache<string, ParsedTitle>({
	max: 1000,
	fetchMethod: async (key: string, _, { signal }) => {
		const resp = await doApiCall<ParsedTitle>(
			"crawler/parsed_title",
			{
				title: key
			},
			{ signal }
		);
		return resp.success ? resp.data : undefined;
	}
});
