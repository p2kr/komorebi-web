<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import type { CrawlerResult } from "$lib/models/crawler";
	import type { MediaType } from "$lib/models/media";
	import { Download } from "@lucide/svelte";
	import { isNil } from "es-toolkit";
	import { VList } from "virtua/svelte";

	interface Props {
		data: CrawlerResult[];
		mediaType: MediaType;
	}

	const { data, mediaType }: Props = $props();

	function getPrefix(item: CrawlerResult) {
		let prefix1 = "";
		let prefix2 = "";
		switch (mediaType) {
			case "Anime":
				prefix1 = "S";
				prefix2 = "E";
				break;
			case "Manga":
			case "Novel":
				prefix1 = "V";
				prefix2 = "C";
				break;
		}

		const s = item.parsed_title.season[0];
		const e = item.parsed_title.episode[0];

		return [prefix1 + (isNil(s) ? "?" : s), prefix2 + (isNil(e) ? "?" : e)];
	}
</script>

<div class="mt-1 overflow-hidden" style:height="100svh">
	<VList {data} getKey={(_, i) => i}>
		{#snippet children(item)}
			<div class="py-0.5">
				<div class="flex rounded border p-1">
					<div>
						<div class="line-clamp-1">{item.title}</div>
						<div class="line-clamp-1 text-sm">
							{getPrefix(item).join(" : ")}
							{item.parsed_title.title}
						</div>
					</div>
					<div>
						<Button><Download /> <span>{item.size}</span></Button>
					</div>
				</div>
			</div>
		{/snippet}
	</VList>
</div>
