<script lang="ts">
	import CustomEmpty from "$lib/components/custom/CustomEmpty.svelte";
	import * as Accordion from "$lib/components/ui/accordion/";
	import { Button } from "$lib/components/ui/button";
	import * as Item from "$lib/components/ui/item";
	import { Spinner } from "$lib/components/ui/spinner";
	import { parsedTitleCache } from "$lib/core/cache";
	import { Constants } from "$lib/core/constants";
	import { getTitlePrefix } from "$lib/core/utils";
	import { DownloadStatus } from "$lib/models/models";
	import type { MediaType } from "$lib/models/dto";
	import { vaultStore } from "$lib/store/vault.svelte";
	import { Book, FileQuestionMark, Image, SearchX, Video, X } from "@lucide/svelte";
	import { fetchEventSource } from "@microsoft/fetch-event-source";
	import prettyBytes from "pretty-bytes";
	import prettyMilliseconds from "pretty-ms";
	import { type Component, onMount } from "svelte";
	import { Virtualizer } from "virtua/svelte";
	import { handleVaultItemDelete } from "./vault_service";
	import VideoPlayer from "./VideoPlayer.svelte";

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

	let isConnected = $state(false);

	onMount(() => {
		const controller = new AbortController();

		fetchEventSource(Constants.BASE_API + "/vault/all", {
			signal: controller.signal,
			onopen: async () => {
				isConnected = true;
			},
			onclose: () => {
				isConnected = false;
			},
			onmessage: (event) => {
				try {
					vaultStore.vaultItems = JSON.parse(event.data);
				} catch {
					// Reset
					vaultStore.vaultItems = [];
				}
			}
		});

		return () => {
			isConnected = false;
			controller.abort();
		};
	});
</script>

<div class="mt-2 rounded border p-1">
	<div class="text-lg font-medium">Vault</div>
	{#if !isConnected}
		<CustomEmpty Icon={Spinner} title="Loading vault items" desc="" />
	{:else if vaultStore.vaultItems.length == 0}
		<CustomEmpty Icon={SearchX} title="Vault Empty" desc="No downloaded media" />
	{:else}
		<div class="h-full">
			<Accordion.Root type="single" value={vaultStore.vaultItems[0]?.id ?? ""}>
				<Virtualizer data={vaultStore.vaultItems} getKey={(q) => q.id}>
					{#snippet children(item)}
						<Item.Root variant="outline" class="my-0.5 p-1">
							<Item.Media class="min-w-8 self-center! text-lg">
								{const Icon = getMediaTypeIcon(item.file_type)}
								<Icon />
							</Item.Media>
							<Item.Content>
								<Item.Title class="line-clamp-1 ">
									{#await parsedTitleCache.fetch(item.file_name)}
										<span class="line-clamp-1 break-all">{item.file_name}</span>
									{:then parsedTitle}
										<span class="line-clamp-1 break-all"
											>{getTitlePrefix(
												parsedTitle?.season,
												parsedTitle?.episode,
												item.file_type
											).join(" : ")}&nbsp;{parsedTitle?.title || item.file_name}</span
										>
									{/await}
								</Item.Title>
								<Item.Description>
									<div class="line-clamp-1 break-all">
										{item.file_name}
									</div>
									<div>
										{#if item.duration_sec}
											{prettyMilliseconds(item.duration_sec * 1000, {
												unitCount: 2,
												secondsDecimalDigits: 0
											})}
										{/if}
										&middot;
										{prettyBytes(item.size_in_bytes)}
										<!--	TODO: Add more fields -->
									</div>
								</Item.Description>
							</Item.Content>
							<Item.Actions>
								{#if item.status == DownloadStatus.Ready}
									<VideoPlayer {item} />
								{:else}
									<Button disabled variant="outline">
										<Spinner />
									</Button>
								{/if}
								<Button
									variant="destructive"
									onclick={(e) => {
										e.stopPropagation();
										handleVaultItemDelete(item);
									}}
								>
									<X />
								</Button>
							</Item.Actions>
						</Item.Root>
					{/snippet}
				</Virtualizer>
			</Accordion.Root>
		</div>
	{/if}
</div>
