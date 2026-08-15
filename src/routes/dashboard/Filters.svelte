<script lang="ts">
	import { invalidate } from "$app/navigation";
	import * as Field from "$lib/components/ui/field";
	import Item from "$lib/components/ui/item/item.svelte";
	import * as Select from "$lib/components/ui/select";
	import type { FilterDefinition } from "./dashboard_filters";
	import { logger } from "$lib/core/telemetry";
	import { dashboardStore } from "./dashboard.svelte";

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);
		logger.debug(formData.entries());
	}

	$effect(() => {
		logger.debug("filters updated", $state.snapshot(dashboardStore.filters));
		invalidate("dashboard:all");
	});
</script>

{#snippet renderSelect(config: FilterDefinition)}
	<Field.Field class={config.class ?? "min-w-40"}>
		<Field.Label>{config.label}</Field.Label>
		<Select.Root
			type="single"
			value={dashboardStore.filters[config.key]?.toString() ?? ""}
			onValueChange={(val) => {
				dashboardStore.filters[config.key] = val;
				config.onChange?.(val, dashboardStore.filters);
			}}
		>
			<Select.Trigger>
				{dashboardStore.getTriggerLabel(config)}
			</Select.Trigger>
			<Select.Content>
				{#each dashboardStore.getOptions(config) as option (option.value)}
					<Select.Item value={option.value ?? ""}>{option.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</Field.Field>
{/snippet}

<form onsubmit={handleSubmit} class="flex gap-4">
	<Item variant="outline" class="m-0 p-2">
		<!-- TODO: Use flex-wrap -->
		<Field.Set class="flex-row">
			{#each dashboardStore.activeConfigs as config (config.key)}
				{#if config.type === "select"}
					{@render renderSelect(config)}
				{/if}
			{/each}
		</Field.Set>
	</Item>
</form>
