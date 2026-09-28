<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { parsedTitleCache } from "$lib/core/cache";
	import type { VaultItem } from "$lib/models/models";
	import { Play } from "@lucide/svelte";
	import { betterSubtitleName } from "./vault_service";
	import { tick } from "svelte";
	import { Constants } from "$lib/core/constants";
	import "vidstack/bundle";
	import type { MediaPlayerElement } from "vidstack/elements";
	import { setupPlayer } from "./vault";

	interface Props {
		item: VaultItem;
	}

	const { item }: Props = $props();

	const baseUrl = $derived(Constants.BASE_API + "/stream/video/" + item.id + "/");

	let playerTitle = $derived(item.file_name);

	$effect(() => {
		parsedTitleCache
			.fetch(item.file_name)
			.then((v) => (playerTitle = v?.title?.[0] || item.file_name));
	});

	let player: MediaPlayerElement | undefined = $state.raw();

	let dialog = $state<HTMLDialogElement>();
	let isOpen = $state(false);

	function getFileName(fullName: string | undefined) {
		return fullName?.split(/[/\\]/).pop();
	}

	function openDialog() {
		isOpen = true;
		// Wait for Svelte to mount the video content before showing the modal
		tick().then(() => dialog?.showModal());
	}

	function closeOnBackdrop(e: MouseEvent) {
		if (e.target === dialog) dialog?.close();
	}

	function handleClose() {
		isOpen = false;
	}
</script>

<Button variant="outline" onclick={openDialog}>
	<Play />
</Button>

<dialog bind:this={dialog} onclick={closeOnBackdrop} onclose={handleClose} class="video-dialog">
	{#if isOpen}
		<media-player
			class="h-full w-full bg-black text-white"
			bind:this={player}
			title={playerTitle}
			playsInline
			autoPlay
			streamType="on-demand"
			storage="komorebi-video-progress"
			autofocus
			src={baseUrl + getFileName("master.m3u8")}
			{...{
				"onprovider-setup": () => setupPlayer(player, baseUrl, isOpen, item)
			}}
		>
			<media-provider>
				{#each item.video_subtitles as subs (subs.id)}
					<track
						kind="subtitles"
						src={baseUrl + getFileName(subs.file_path)}
						srclang={subs.lang}
						label={betterSubtitleName(subs.lang, subs.title)}
						default={subs.is_forced}
						data-type={subs.format}
					/>
				{/each}
			</media-provider>
			<media-video-layout></media-video-layout>
		</media-player>
	{/if}
</dialog>

<style lang="postcss">
	@reference "tailwindcss";

	.video-dialog {
		@apply m-auto w-full overflow-hidden border-0 bg-transparent p-0 outline-none;
		@apply backdrop:bg-black/60 backdrop:backdrop-blur-xs;

		aspect-ratio: 16/9;
		max-width: calc(90vh * 16 / 9);
	}
</style>
