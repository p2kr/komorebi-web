<script lang="ts">
	import CustomEmpty from "$lib/components/custom/CustomEmpty.svelte";
	import * as Item from "$lib/components/ui/item";
	import { Spinner } from "$lib/components/ui/spinner";
	import { Book, FileQuestionMark, Image, SearchX, Video, X } from "@lucide/svelte";
	import { Virtualizer } from "virtua/svelte";
	import prettyBytes from "pretty-bytes";
	import { Button } from "$lib/components/ui/button";
	import type { MediaType } from "$lib/models/media";
	import { type Component } from "svelte";
	import { vaultStore } from "$lib/store/vault.svelte";
	import { handleDelete, get_vault_metadata } from "./vault_service";
	import VideoPlayer from "./VideoPlayer.svelte";
	import { createQuery } from "@tanstack/svelte-query";
	import * as Accordion from "$lib/components/ui/accordion/";
	import { getTitlePrefix } from "$lib/core/utils";
	import { isNil } from "es-toolkit";

	function getMediaTypeIcon(mediaType: MediaType | null): Component {
		switch (mediaType) {
			case "Anime":
				return Video;
			case "Manga":
				return Image;
			case "Novel":
				return Book;
			default:
				return FileQuestionMark;
		}
	}

	const completedItems = $derived(
		vaultStore.vaultItems.filter((v) => v.status === "READY" || v.status === "PARTIAL")
	);

	const completedItemsId = $derived(completedItems.map((item) => item.id));

	// Get meta data
	const metadataQuery = createQuery(() => ({
		queryKey: ["metadata-query", ...completedItemsId],
		queryFn: () => get_vault_metadata(completedItemsId),
		enabled: completedItemsId.length > 0
	}));
</script>

<div class="mt-2 rounded border p-1">
	<div class="text-lg font-medium">Vault</div>
	{#if !vaultStore.isConnected}
		<CustomEmpty Icon={Spinner} title="Loading vault items" desc="" />
	{:else}
		{#if !completedItems || completedItems.length == 0}
			<CustomEmpty Icon={SearchX} title="Vault Empty" desc="No downloaded media" />
		{:else}
			<div class="h-full">
				<Accordion.Root type="single" value={completedItems[0]?.id ?? ""}>
					<Virtualizer data={completedItems} getKey={(q) => q.id}>
						{#snippet children(item)}
							{const sub_items = $derived(metadataQuery.data?.[item.id])}
							<Accordion.Item class="my-0.5 rounded border p-1">
								<Accordion.Trigger
									class="items-center p-0 hover:no-underline!"
									disabled={isNil(sub_items) || sub_items.length == 0}
								>
									<Item.Root variant="default" class="p-1">
										<Item.Media class="min-w-8 self-center! text-lg">
											{#if metadataQuery.isFetching}
												<Spinner />
											{:else}
												{sub_items?.length || "0"}
											{/if}
										</Item.Media>
										<Item.Content>
											<Item.Title class="line-clamp-1 hover:underline">
												{item.title}
											</Item.Title>
											<Item.Description>
												<span>{item.raw_title}</span>
											</Item.Description>
										</Item.Content>
										<Item.Actions>
											<Button
												variant="destructive"
												onclick={(e) => {
													e.stopPropagation();
													handleDelete(item);
												}}
											>
												<X />
											</Button>
										</Item.Actions>
									</Item.Root>
								</Accordion.Trigger>
								{#if sub_items && sub_items.length > 0}
									<Virtualizer data={sub_items} getKey={(q) => q.id}>
										{#snippet children(sub_item)}
											<Accordion.Content class="my-0.5 p-0">
												<Item.Root variant="muted" class="my-0.5">
													<Item.Media class="self-center!">
														<!-- TODO: Show preview/media type thumbnail or combined -->
														{const MediaTypeIcon = getMediaTypeIcon(item.media_type)}
														<MediaTypeIcon />
													</Item.Media>
													<Item.Content>
														<Item.Title class="line-clamp-1">
															{getTitlePrefix(sub_item.season, sub_item.episode)}
															{sub_item.title || sub_item.raw_title}
														</Item.Title>
														<Item.Description>
															<span>{prettyBytes(sub_item.total_bytes)}</span>
														</Item.Description>
													</Item.Content>
													<Item.Actions>
														<VideoPlayer dto={sub_item} />
													</Item.Actions>
												</Item.Root>
											</Accordion.Content>
										{/snippet}
									</Virtualizer>
								{/if}
							</Accordion.Item>
						{/snippet}
					</Virtualizer>
				</Accordion.Root>
			</div>
		{/if}
	{/if}
</div>
