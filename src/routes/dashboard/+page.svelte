<script lang="ts">
	import type { PageProps } from "./$types";
	import Filters from "./Filters.svelte";

	const { data }: PageProps = $props();
</script>

<Filters />
{#if data.dashboardItems.success}
	{#each data.dashboardItems.data.data as mediaEntry (mediaEntry.media.id)}
		<pre>{JSON.stringify(mediaEntry, null, 2)}</pre>
	{/each}
{:else}
	<p>{data.dashboardItems.error.msg}</p>
{/if}
