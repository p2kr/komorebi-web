<script lang="ts">
	import { CircleX, SearchX, Settings2, UserRoundX } from "@lucide/svelte";
	import DashboadTile from "./DashboadTile.svelte";
	import Filters from "./Filters.svelte";
	import { userStore } from "$lib/store/user.svelte";
	import { m } from "$lib/paraglide/messages";
	import { Button } from "$lib/components/ui/button";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { Spinner } from "$lib/components/ui/spinner";
	import { getDashboardItems } from "./dashboard_service";
	import { createQuery } from "@tanstack/svelte-query";
	import { dashboardStore } from "./dashboard.svelte";
	import CustomEmpty from "$lib/components/custom/CustomEmpty.svelte";

	const itemsQuery = createQuery(() => ({
		queryKey: ["getDashboardItems-query", userStore.currentUser?.id, dashboardStore.filters],
		queryFn: () => getDashboardItems(userStore.currentUser?.id, dashboardStore.filters)
	}));

	const resp = $derived(itemsQuery.data);
</script>

<Filters />

{#if itemsQuery.isLoading}
	<CustomEmpty Icon={Spinner} desc="" title="" />
{:else if resp}
	{#if resp.success}
		{#if resp.data.data.length > 0}
			<div class="mt-2 grid gap-x-2 gap-y-0 md:grid-cols-2 lg:grid-cols-3">
				{#each resp.data.data as mediaEntry (mediaEntry.media.provider_id)}
					<DashboadTile {mediaEntry} />
				{/each}
			</div>
		{:else}
			<CustomEmpty
				Icon={SearchX}
				title="No results found"
				desc="Try adjusting your filters to find what you're looking for, or refresh the page."
			/>
		{/if}
	{:else if userStore.currentUser}
		<CustomEmpty Icon={CircleX} title="Some technical error occurred" desc={resp} />
	{:else}
		{#snippet navigateBtn()}
			<Button
				variant="outline"
				onclick={() => {
					goto(resolve("/settings/user"));
				}}
			>
				<Settings2 />
				<span>Open user settings</span>
			</Button>
		{/snippet}
		<CustomEmpty
			Icon={UserRoundX}
			title={m.no_user_configured()}
			desc="Please configure user in settings"
			content={navigateBtn}
		/>
	{/if}
{/if}
