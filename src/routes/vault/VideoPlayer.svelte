<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button";
	import type { VaultItem } from "$lib/models/vault";
	import { cn } from "$lib/utils";
	import { Play } from "@lucide/svelte";
	import "@videojs/html/video/player";
	import "@videojs/html/video/skin";
	import type { VideoPlayerElement } from "@videojs/html/video";
	import { onMount } from "svelte";
	import { logger } from "$lib/core/telemetry";
	import { Constants } from "$lib/core/constants";

	interface Props {
		vaultItem: VaultItem;
	}

	const { vaultItem }: Props = $props();

	const videoSrc = $derived(Constants.BASE_API + "/vault/stream?vault_id=" + vaultItem.id);

	let player = $state<VideoPlayerElement>();
	let dialog = $state<HTMLDialogElement>();
	let isOpen = $state(false);

	function openDialog() {
		isOpen = true;
		// Wait for Svelte to mount the video content before showing the modal
		setTimeout(() => dialog?.showModal(), 0);
	}

	function closeOnBackdrop(e: MouseEvent) {
		if (e.target === dialog) dialog?.close();
	}

	function handleClose() {
		isOpen = false;
	}

	onMount(() => {
		logger.debug("Playing ", vaultItem.destination_path);
	});
</script>

<button class={cn(buttonVariants({ variant: "secondary" }))} onclick={openDialog}>
	<Play />
</button>

<dialog bind:this={dialog} onclick={closeOnBackdrop} onclose={handleClose} class="video-dialog">
	{#if isOpen}
		<video-player bind:this={player}>
			<video-skin class="size-full">
				<video src={videoSrc} autoplay playsinline>
					<track kind="captions" />
				</video>
			</video-skin>
		</video-player>
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
