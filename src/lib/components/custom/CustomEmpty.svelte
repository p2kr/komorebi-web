<script lang="ts">
	import type { FailureResponse } from "$lib/core/api";
	import type { Component, Snippet } from "svelte";
	import * as Empty from "$lib/components/ui/empty";
	import type { ClassValue } from "svelte/elements";

	interface Props {
		Icon: Component;
		title: string;
		desc: string | FailureResponse;
		content?: Snippet;
		class?: ClassValue;
	}

	const { Icon, title, desc, content, class: className }: Props = $props();
</script>

<Empty.Root class={className}>
	<Empty.Header>
		<Empty.Media variant="icon">
			<Icon />
		</Empty.Media>
		<Empty.Title>{title}</Empty.Title>
		<Empty.Description>
			{#if typeof desc === "object"}
				<div>{desc.error}</div>
				<div>{desc.description}</div>
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
