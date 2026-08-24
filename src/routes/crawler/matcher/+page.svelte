<script lang="ts">
	import { Button } from "$lib/components/ui/button";

	import { page } from "$app/state";
	import { Input } from "$lib/components/ui/input";
	import * as Tabs from "$lib/components/ui/tabs";
	import type { MediaType, MediaEntry } from "$lib/models/media";
	import { getTitle, toastFailure } from "$lib/core/utils";
	import { settingsStore } from "$lib/store/settings.svelte";
	import { createQuery, useQueryClient } from "@tanstack/svelte-query";
	import { search } from "$lib/services/crawler_service";
	import { Spinner } from "$lib/components/ui/spinner";
	import ResultTiles from "./ResultTiles.svelte";
	import CustomEmpty from "$lib/components/custom/CustomEmpty.svelte";
	import { Search, SearchX } from "@lucide/svelte";
	import { Separator } from "$lib/components/ui/separator";

	const { mediaEntry }: { mediaEntry?: MediaEntry } = page.state;

	let mediaType = $state<MediaType>("Anime");
	const primaryTitle = mediaEntry
		? getTitle(mediaEntry?.media.title, settingsStore.dashboard.title_pref)
		: "";
	let query = $state<string>(primaryTitle);

	let fetchedQuery = $state<string>();

	const resp = createQuery(() => ({
		queryKey: ["crawler-search-query", mediaType],
		queryFn: async ({ signal }) => {
			fetchedQuery = query;
			return await search(query, mediaType, signal);
		},
		enabled: false
	}));

	const queryClient = useQueryClient();

	const isFetchReady = $derived(query.trim().length > 0 && mediaType && !resp.isFetching);
</script>

<!-- <div class="flex flex-col"> -->
<form class="rounded border p-1">
	<div class="mb-1 flex items-center gap-1 text-lg">
		<span>Search for</span>
		<Tabs.Root bind:value={mediaType}>
			<Tabs.List>
				<Tabs.Trigger value="Anime">Anime</Tabs.Trigger>
				<Tabs.Trigger value="Manga">Manga</Tabs.Trigger>
				<!-- TODO: Add functionality -->
				<Tabs.Trigger value="Novel" disabled>Novel</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	</div>
	<div class="mb-1 flex items-center gap-1">
		<Input
			name="query"
			type="search"
			placeholder="e.g. Attack on titan s1 ep 2"
			bind:value={query}
			autofocus
		/>
		{#if !resp.isFetching}
			<Button
				type="submit"
				disabled={!isFetchReady}
				onclick={() => {
					if (isFetchReady) {
						resp.refetch();
					}
				}}
			>
				Run crawler
			</Button>
		{:else}
			<Button
				variant="destructive"
				disabled={isFetchReady}
				onclick={() => {
					queryClient.cancelQueries({ queryKey: ["crawler-search-query"] });
				}}
			>
				Cancel
			</Button>
		{/if}
	</div>
</form>
<div class="mt-2 h-full rounded border p-1">
	<div class="text-lg">
		<span>Ranked Scraping Results</span>
		{#if resp.isFetched}
			for <em>{fetchedQuery}</em>
		{/if}
	</div>
	<Separator />
	{#if resp.isFetching}
		<CustomEmpty Icon={Spinner} title="Searching..." desc="" />
	{:else if resp.data?.success && resp.data.data.length > 0}
		<ResultTiles data={resp.data.data} {mediaType} />
	{:else if resp.data?.success && resp.data.data.length == 0}
		<CustomEmpty Icon={SearchX} title="No Results" desc="Try again with different query" />
	{:else if resp.data && !resp.data?.success}
		{toastFailure(resp.data)}
	{:else if !resp.isFetching}
		<CustomEmpty Icon={Search} title="Search something" desc="" />
	{/if}
</div>
<!-- </div> -->
