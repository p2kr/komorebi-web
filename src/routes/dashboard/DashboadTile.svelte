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

{#snippet chip(Icon?: Component, value?: unknown, tip?: string)}
	{#if value || Icon}
		<SimpleTooltip {tip}>
			<div
				class="mt-1 line-clamp-1 flex items-center gap-1 rounded border p-0.5 text-sm text-muted-foreground"
			>
				<Icon class="size-4" />
				{#if value}
					<span>{String(value).toUpperCase()}</span>
				{/if}
			</div>
		</SimpleTooltip>
	{/if}
{/snippet}

<!-- todo: fix layout to css grid  -->
<div class="w-full rounded border p-2">
	<div class="flex w-full gap-1">
		<!-- Cover Image -->
		<CustomImage src={media.cover.medium} alt={primaryTitle} class="w-25" />
		<div class="flex w-full flex-col items-start">
			<!-- Title -->
			<div class="line-clamp-2 font-serif text-base font-semibold">
				{primaryTitle}
			</div>
			<div class="line-clamp-1">
				{secondaryTitle}
			</div>

			<!-- Genre Chips -->
			{@render chip(Tags, media.genres.join(" \u00b7 "), "Genres")}
			<!-- Other Chips -->
			<div class="flex gap-1">
				{@render chip(Star, media.mean_score, "Rating")}
				{@render chip(Hash, media.popularity, "Popularity")}
				{@render chip(MonitorPlay, media.format, "Format")}
				{@render chip(nsfwIcon, undefined, "Nsfw: " + media.nsfw)}
			</div>

			<div class="flex-1"></div>

			<!-- Progress Bar -->
			<div class="w-full">
				<div class="flex justify-between">
					<div>
						{name}
					</div>
					<div>
						{mediaEntry.list_entry.progress ?? "?"} / {media.chapters ?? media.episodes ?? "?"}
					</div>
				</div>
				<div>
					{#if !userStore.currentUser?.is_sandbox}
						<Progress value={mediaEntry.list_entry.progress} {max} />
					{:else}
						<Progress />
					{/if}
				</div>
			</div>
		</div>
	</div>
	<!-- Synopsis and its dialog -->
	<Dialog.Root>
		<Dialog.Trigger>
			<div class="line-clamp-3 w-full text-justify text-sm">
				{synopsis}
			</div>
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
	<div class="flex">
		<Button variant="outline" onclick={handleGetNext}>
			<Download />
			<span>
				Get {name}
				{nextEntry}
			</span>
		</Button>
		<div class="flex-1"></div>
		<div class="flex gap-1">
			<SimpleTooltip tip="Decrease progress">
				<Button variant="ghost">
					<Minus />
				</Button>
			</SimpleTooltip>
			<SimpleTooltip tip="Increase progress">
				<Button variant="ghost">
					<Plus />
				</Button>
			</SimpleTooltip>
		</div>
	</div>
</div>
