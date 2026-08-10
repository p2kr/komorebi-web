<script lang="ts">
	import { page } from "$app/state";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
	import { SidebarTrigger } from "$lib/components/ui/sidebar";
	import { Constants } from "$lib/core/constants";
	import { appRoutes } from "./routes";

	// @ts-expect-error "/" is not declared in appRoutes
	const currentPage = appRoutes[page.url.pathname]?.label;
</script>

<div class="mb-2 flex items-center gap-4">
	<SidebarTrigger />
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>{Constants.APP_NAME}</Breadcrumb.Item>
			{#if currentPage}
				<Breadcrumb.Separator />
				<!-- TODO: Replace with active screen -->
				<Breadcrumb.Item>{currentPage}</Breadcrumb.Item>
			{/if}
		</Breadcrumb.List>
	</Breadcrumb.Root>
</div>
