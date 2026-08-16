<script lang="ts">
	import CustomImage from "$lib/components/custom/CustomImage.svelte";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Progress } from "$lib/components/ui/progress";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import { cleanSynopsis } from "$lib/core/utils";
	import type { MediaEntry } from "$lib/models/media";
	import { userStore } from "$lib/store/user.svelte";
	import type { Component } from "svelte";
	import { getPrimaryTitle, getSecondaryTitle } from "./dashboard.svelte";
	import {
		Download,
		Eye,
		EyeDashed,
		EyeOff,
		Hash,
		Minus,
		MonitorPlay,
		Plus,
		Star,
		Tags
	} from "@lucide/svelte";
	import SimpleTooltip from "$lib/components/custom/SimpleTooltip.svelte";
	import { Button } from "$lib/components/ui/input-group";
	import { clamp } from "es-toolkit";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";

	type Props = {
		mediaEntry: MediaEntry;
	};

	const { mediaEntry }: Props = $props();
	const media = $derived(mediaEntry.media);

	const name = $derived(media.media_type === "Anime" ? "Episode" : "Chapter");
	const primaryTitle = $derived(getPrimaryTitle(media.title));
	const secondaryTitle = $derived(getSecondaryTitle(media.title));

	const max = $derived(
		(media.media_type === "Anime" ? media.episodes : media.chapters) ?? undefined
	);
	const synopsis = $derived(cleanSynopsis(media.provider_id, media.synopsis));

	const nsfwIcon = $derived.by(() => {
		switch (media.nsfw) {
			case "Safe":
				return Eye;
			case "Gray":
				return EyeDashed;
			case "Nsfw":
				return EyeOff;
		}
	});

	const nextEntry = $derived.by(() => {
		return clamp((mediaEntry.list_entry.progress ?? 0) + 1, 1, max ?? 1);
	});

	function handleGetNext() {
		// navigate to smart matcher.
		goto(resolve("/crawler/matcher"), {
			state: {
				mediaEntry: mediaEntry
			}
		});
	}
</script>

{#snippet statChip(Icon: Component, value: unknown | undefined, tip: string)}
	{#if value || Icon}
		<SimpleTooltip {tip}>
			<div
				class="inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-xs whitespace-nowrap text-muted-foreground"
			>
				<Icon class="size-3.5 shrink-0" />
				{#if value}
					<span>{String(value).toUpperCase()}</span>
				{/if}
			</div>
		</SimpleTooltip>
	{/if}
{/snippet}

<div
	class="row-span-3 mb-2 grid w-full min-w-0 grid-rows-subgrid overflow-hidden rounded border bg-card"
>
	<div class="flex min-w-0 justify-start gap-1 pr-1">
		<!-- Cover Image -->
		<CustomImage
			src={media.cover.large}
			alt={primaryTitle}
			wrapperClass="w-[28%] min-w-24 max-w-30 h-full shrink"
			class="h-full w-full object-cover"
		/>
		<!-- Title -->
		<div class="flex w-full min-w-0 flex-col gap-1">
			<div class="line-clamp-2 font-serif text-base leading-snug font-semibold">
				{primaryTitle}
			</div>
			{#if secondaryTitle}
				<div class="line-clamp-1 text-sm leading-snug text-muted-foreground italic">
					{secondaryTitle}
				</div>
			{/if}
			<!-- Genre pill -->
			<div class="flex min-w-0 items-center gap-1 overflow-hidden rounded border bg-muted p-1">
				<Tags class="size-3.5 shrink-0 text-muted-foreground" />
				<span class="truncate text-xs text-muted-foreground">
					{media.genres.join(" · ")}
				</span>
			</div>

			<!-- Stat chips -->
			<div class="flex min-w-0 flex-wrap gap-1">
				{@render statChip(Star, media.mean_score, "Rating")}
				{@render statChip(Hash, media.popularity, "Popularity")}
				{@render statChip(MonitorPlay, media.format, "Format")}
				{@render statChip(nsfwIcon, undefined, "Nsfw: " + media.nsfw)}
			</div>
			<div class="flex-1"></div>
			<!-- Episode / Progress -->
			<div class="min-w-0">
				<div class="mb-1 flex items-center justify-between gap-1">
					<span class="text-sm font-medium sm:hidden lg:inline">{name}</span>
					<div class="inline-flex items-center gap-1">
						{#if !userStore.currentUser?.is_sandbox}
							<SimpleTooltip tip="Decrease progress">
								<Button variant="ghost">
									<Minus />
								</Button>
							</SimpleTooltip>
						{/if}

						<span class="text-sm text-muted-foreground tabular-nums">
							{mediaEntry.list_entry.progress ?? "?"} / {media.chapters ?? media.episodes ?? "?"}
						</span>

						{#if !userStore.currentUser?.is_sandbox}
							<SimpleTooltip tip="Increase progress">
								<Button variant="ghost">
									<Plus />
								</Button>
							</SimpleTooltip>
						{/if}
					</div>
				</div>
				{#if !userStore.currentUser?.is_sandbox}
					<Progress value={mediaEntry.list_entry.progress} {max} class="h-1.5" />
				{:else}
					<Progress class="h-1.5" />
				{/if}
			</div>
		</div>
	</div>

	<!-- Synopsis — fills remaining space, clickable for full text -->
	<Dialog.Root>
		<Dialog.Trigger class="min-w-0 p-1 text-left">
			<p
				class="line-clamp-3 cursor-pointer text-justify text-xs leading-relaxed text-muted-foreground transition-colors hover:text-foreground"
			>
				{synopsis}
			</p>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>
					<div class="text-lg">Synopsis</div>
					<div class="pt-1 font-serif">{primaryTitle}</div>
				</Dialog.Title>
			</Dialog.Header>
			<ScrollArea class="max-h-[50vh]">
				<Dialog.Description class="text-primary">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html synopsis}
				</Dialog.Description>
			</ScrollArea>
		</Dialog.Content>
	</Dialog.Root>

	<!-- Actions -->
	<Button variant="outline" onclick={handleGetNext} class="mx-1 mb-1 h-8 gap-1.5 text-xs ">
		<Download class="size-3.5" />
		<span>Get {name} {nextEntry}</span>
	</Button>
</div>
