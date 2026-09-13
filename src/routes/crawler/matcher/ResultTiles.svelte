<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { Button } from "$lib/components/ui/button";
	import * as Item from "$lib/components/ui/item";
	import { doApiCall } from "$lib/core/api";
	import { getTitlePrefix, toastFailure } from "$lib/core/utils";
	import type { CrawlerResult } from "$lib/models/crawler";
	import type { MediaType } from "$lib/models/media";
	import type { VaultAddPayload, VaultItem } from "$lib/models/vault";
	import { userStore } from "$lib/store/user.svelte";
	import { vaultStore } from "$lib/store/vault.svelte";
	import { Download, Hd, Languages, Link, TrendingUp } from "@lucide/svelte";
	import type { Component } from "svelte";
	import { toast } from "svelte-sonner";
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

		// logger.debug(ref, rect, distFromTop);
	});

	async function handleDownload(item: CrawlerResult) {
		if (!userStore.currentUser?.id) {
			toastFailure("Connect a user to download");
			return;
		}
		if (vaultStore.urlMap.has(item.link)) {
			goto(resolve("/vault"));
			return;
		}

		const resp = await doApiCall<VaultItem, VaultAddPayload>("vault/add", {
			crawler_result: item,
			user_id: userStore.currentUser?.id
		});

		if (!resp.success) {
			toastFailure(resp);
		} else {
			toast("Added to queue");
		}
	}

	function getResultsBtnText(item: VaultItem) {
		switch (item.status) {
			case "DOWNLOADING":
				return item.status.toString() + " " + item.progress.toFixed(1) + "%";
			default:
				return item.status.toString();
		}
	}
</script>

{#snippet tags(text: string | undefined | null, Icon: Component)}
	{#if text}
		<div class="flex items-center gap-1 rounded border px-0.5">
			<Icon class="size-(--text-sm)" />
			{text}
		</div>
	{/if}
{/snippet}

<div bind:this={ref} class="mt-1 overflow-hidden" style:height="50vh">
	<VList {data} getKey={(_, i) => i}>
		{#snippet children(item)}
			<Item.Root variant="outline" class="my-0.5 p-1">
				<Item.Content>
					<Item.Title class="line-clamp-2 text-base">
						{item.title}
					</Item.Title>
					<Item.Description>
						<div class="line-clamp-1">
							{getTitlePrefix(item.parsed_title.season, item.parsed_title.episode, mediaType).join(
								" : "
							)}
							{item.parsed_title.title}
						</div>
						<div class="flex gap-1 text-sm text-muted-foreground">
							{@render tags(item.source, Link)}
							{@render tags(item.popularity, TrendingUp)}
							{@render tags(item.parsed_title.video_resolution?.[0], Hd)}
							{@render tags(item.parsed_title.language?.join(","), Languages)}
						</div>
					</Item.Description>
				</Item.Content>
				<Item.Actions>
					{const queueItem = $derived(vaultStore.urlMap.get(item.link))}
					<Button
						onclick={() => handleDownload(item)}
						variant={!queueItem ? "default" : "secondary"}
					>
						{#if queueItem}
							{getResultsBtnText(queueItem)}
						{:else}
							<Download />
							{item.size}
						{/if}
					</Button>
				</Item.Actions>
			</Item.Root>
		{/snippet}
	</VList>
</div>
