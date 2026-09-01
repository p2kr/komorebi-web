<script lang="ts">
	import CustomEmpty from "$lib/components/custom/CustomEmpty.svelte";
	import * as Item from "$lib/components/ui/item";
	import { Spinner } from "$lib/components/ui/spinner";
	import { getTitlePrefix } from "$lib/core/utils";
	import { Book, FileQuestionMark, Image, Play, SearchX, Video, X } from "@lucide/svelte";
	import { Virtualizer } from "virtua/svelte";
	import prettyBytes from "pretty-bytes";
	import { Button } from "$lib/components/ui/button";
	import type { MediaType } from "$lib/models/media";
	import { type Component } from "svelte";
	import { vaultStore } from "$lib/store/vault.svelte";
	import { handleDelete } from "./vault";

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

	const completedItems = $derived(vaultStore.vaultItems.filter((v) => v.status === "COMPLETED"));
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
				<Virtualizer data={completedItems} getKey={(q) => q.id}>
					{#snippet children(item)}
						<Item.Root variant="outline" class="my-0.5">
							<Item.Media class="self-center!">
								<!-- TODO: Show preview/media type thumbnail or combined -->
								{const MediaTypeIcon = getMediaTypeIcon(item.media_type)}
								<MediaTypeIcon />
							</Item.Media>
							<Item.Content>
								<Item.Title class="line-clamp-1">
									{getTitlePrefix(item.season, item.episode, item.media_type).join(" : ")}
									{item.title}
								</Item.Title>
								<Item.Description>
									<span>{prettyBytes(item.total_bytes)}</span>
								</Item.Description>
							</Item.Content>
							<Item.Actions>
								<Button variant="outline">
									<Play />
								</Button>
								<Button variant="destructive" onclick={() => handleDelete(item)}>
									<X />
								</Button>
							</Item.Actions>
						</Item.Root>
					{/snippet}
				</Virtualizer>
			</div>
		{/if}
	{/if}
</div>
