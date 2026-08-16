<script lang="ts">
	import * as Empty from "$lib/components/ui/empty";
	import { CircleX, SearchX, Settings2, UserRoundX } from "@lucide/svelte";
	import DashboadTile from "./DashboadTile.svelte";
	import Filters from "./Filters.svelte";
	import type { FailureResponse } from "$lib/core/api";
	import { userStore } from "$lib/store/user.svelte";
	import { m } from "$lib/paraglide/messages";
	import { Button } from "$lib/components/ui/button";
	import type { Component, Snippet } from "svelte";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { Spinner } from "$lib/components/ui/spinner";
	import { getDashboardItems } from "./dashboard_service";
	import { createQuery } from "@tanstack/svelte-query";
	import { dashboardStore } from "./dashboard.svelte";

	const itemsQuery = createQuery(() => ({
		queryKey: ["getDashboardItems-query", userStore.currentUser?.id, dashboardStore.filters],
		queryFn: () => getDashboardItems(userStore.currentUser?.id, dashboardStore.filters)
	}));

	const resp = $derived(itemsQuery.data);
</script>

<Filters />

{#snippet errorBoundary(
	Icon: Component,
	title: string,
	desc: string | FailureResponse,
	content?: Snippet
)}
	<Empty.Root>
		<Empty.Header>
			<Empty.Media variant="icon">
				<Icon />
			</Empty.Media>
			<Empty.Title>{title}</Empty.Title>
			<Empty.Description>
				{#if typeof desc === "object"}
					<div>{desc.error.code}</div>
					<div>{desc.error.msg}</div>
				{:else}
					<div>{desc}</div>
				{/if}
			</Empty.Description>
			{#if content}
				<Empty.Content>
					{@render content()}
				</Empty.Content>
			{/if}
		</Empty.Header>
	</Empty.Root>
{/snippet}

{#if itemsQuery.isLoading}
	{@render errorBoundary(Spinner, "", "")}
{:else if resp}
	{#if resp.success}
		{#if resp.data.data.length > 0}
			{#each resp.data.data as mediaEntry (mediaEntry.media.provider_id)}
				<div class="flex gap-2">
					<DashboadTile {mediaEntry} />
				</div>
			{/each}
		{:else}
			{@render errorBoundary(
				SearchX,
				"No results found",
				"Try adjusting your filters to find what you're looking for, or refresh the page."
			)}
		{/if}
	{:else if userStore.currentUser}
		{@render errorBoundary(CircleX, "Some technical error occurred", resp)}
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
		{@render errorBoundary(
			UserRoundX,
			m.no_user_configured(),
			"Please configure user in settings",
			navigateBtn
		)}
	{/if}
{/if}
