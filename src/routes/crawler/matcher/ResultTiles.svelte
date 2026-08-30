<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { logger } from "$lib/core/telemetry";
	import { getTitlePrefix } from "$lib/core/utils";
	import type { CrawlerResult } from "$lib/models/crawler";
	import type { MediaType } from "$lib/models/media";
	import { Download, Globe, TrendingUp } from "@lucide/svelte";
	import type { Component } from "svelte";
	import { VList } from "virtua/svelte";

	interface Props {
		data: CrawlerResult[];
		mediaType: MediaType;
	}

	const { data, mediaType }: Props = $props();

	let ref = $state<HTMLDivElement>();

	$effect(() => {
		const rect = ref?.getBoundingClientRect();
		const distFromTop = rect?.top;
		const paddingOffset = 13;

		ref?.style.setProperty("height", `calc(100svh - ${distFromTop! + paddingOffset}px)`);

		logger.debug(ref, rect, distFromTop);
	});
</script>

{#snippet tags(text: string | undefined | null, Icon: Component)}
	{#if text}
		<div class="flex items-center gap-1 rounded border px-0.5">
			<Icon class="size-(--text-xs)" />
			{text}
		</div>
	{/if}
{/snippet}

<div bind:this={ref} class="mt-1 overflow-hidden" style:height="50vh">
	<VList {data} getKey={(_, i) => i}>
		{#snippet children(item)}
			<div class="py-0.5">
				<div class="flex items-center justify-between gap-1 rounded border p-1">
					<div>
						<div class="line-clamp-1">{item.title}</div>
						<div class="line-clamp-1 text-sm">
							{getTitlePrefix(item.parsed_title.season, item.parsed_title.episode, mediaType).join(
								" : "
							)}
							{item.parsed_title.title}
						</div>
						<div class="flex gap-1 text-sm text-muted-foreground">
							{@render tags(item.source, Globe)}
							{@render tags(item.popularity, TrendingUp)}
						</div>
					</div>
					<Button variant="default" size="lg">
						<Download />
						{#if item.size}
							{item.size}
						{/if}
					</Button>
				</div>
			</div>
		{/snippet}
	</VList>
</div>
