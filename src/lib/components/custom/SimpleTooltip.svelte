<script lang="ts">
	import * as Tooltip from "$lib/components/ui/tooltip";
	import type { Snippet } from "svelte";

	type SimpleTooltipProps = {
		tip: string | undefined;
		side?: "top" | "right" | "bottom" | "left";
		delayDuration?: number;
		children: Snippet;
	};

	let { tip, side = "top", children, delayDuration = 700 }: SimpleTooltipProps = $props();
</script>

{#if tip}
	<Tooltip.Root {delayDuration}>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<span {...props} class="inline-flex">
					{@render children()}
				</span>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content {side}>
			<p>{tip}</p>
		</Tooltip.Content>
	</Tooltip.Root>
{:else}
	{@render children()}
{/if}
