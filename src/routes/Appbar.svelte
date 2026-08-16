<script lang="ts">
	import { page } from "$app/state";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
	import Button from "$lib/components/ui/button/button.svelte";
	import { SidebarTrigger } from "$lib/components/ui/sidebar";
	import { Constants } from "$lib/core/constants";
	import { Eye, EyeOff } from "@lucide/svelte";
	import { appRoutes } from "./routes";
	import { settingsStore } from "$lib/store/settings.svelte";
	import SimpleTooltip from "$lib/components/custom/SimpleTooltip.svelte";

	// @ts-expect-error "/" is not declared in appRoutes
	const currentPageLabel = appRoutes[page.url.pathname]?.label;

	const isCensorEnabled = $derived(settingsStore.global.censor.enabled);
</script>

<div class="mb-2 flex items-center gap-4">
	<SidebarTrigger />
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>{Constants.APP_NAME}</Breadcrumb.Item>
			{#if currentPageLabel}
				<Breadcrumb.Separator />
				<!-- TODO: Replace with active screen -->
				<Breadcrumb.Item>{currentPageLabel}</Breadcrumb.Item>
			{/if}
		</Breadcrumb.List>
	</Breadcrumb.Root>
	<div class="flex-1"></div>
	<SimpleTooltip tip={isCensorEnabled ? "Disable Censor" : "Enable Censor"} side="bottom">
		<Button
			variant="ghost"
			size="icon"
			onclick={() => {
				settingsStore.updateSettings({
					global: { censor: { enabled: !isCensorEnabled } }
				});
			}}
		>
			{#if isCensorEnabled}
				<EyeOff />
			{:else}
				<Eye />
			{/if}
		</Button>
	</SimpleTooltip>
</div>
