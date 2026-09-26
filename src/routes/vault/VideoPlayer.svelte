<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button";
	import type { VaultItem } from "$lib/models/models";
	import { cn } from "$lib/utils";
	import { Play } from "@lucide/svelte";
	import { tick } from "svelte";
	import { Constants } from "$lib/core/constants";
	import "vidstack/bundle";
	import "vidstack/player/styles/default/theme.css";
	import "vidstack/player/styles/default/layouts/video.css";
	import type { MediaPlayerElement } from "vidstack/elements";
	// import { betterSubtitleName } from "./vault_service";
	import { setupPlayer } from "./vault";

	interface Props {
		item: VaultItem;
	}

	const { item }: Props = $props();

	const baseUrl = Constants.BASE_API + "/stream/video/";

	const urls = $derived({
		mkv: [baseUrl + encodeURIComponent(item.file_path), "video/x-matroska"]
	} as const);

	let player: MediaPlayerElement | undefined = $state.raw();

	let dialog = $state<HTMLDialogElement>();
	let isOpen = $state(false);

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

<button class={cn(buttonVariants({ variant: "outline" }))} onclick={openDialog}>
	<Play />
</button>

<dialog bind:this={dialog} onclick={closeOnBackdrop} onclose={handleClose} class="video-dialog">
	{#if isOpen}
		<media-player
			class="h-full w-full bg-black text-white"
			bind:this={player}
			title={item.file_name}
			playsInline
			autoPlay
			streamType="live"
			keep-alive
			autofocus
			src={urls.mkv[0]}
			{...{
				"onprovider-setup": () => setupPlayer(player, baseUrl, isOpen, item)
			}}
		>
			<media-provider>
				<!--{#each item.video_subtitles as subs (subs.id)}-->
				<!--	<track-->
				<!--		kind="subtitles"-->
				<!--		src={baseUrl + subs.file_path}-->
				<!--		srclang={subs.lang}-->
				<!--		label={betterSubtitleName(subs.lang, subs.title)}-->
				<!--		default={subs.is_forced}-->
				<!--		data-type={subs.format}-->
				<!--	/>-->
				<!--{/each}-->
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
