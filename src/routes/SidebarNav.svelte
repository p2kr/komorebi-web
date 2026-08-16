<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import { Settings } from "@lucide/svelte";
	import { appRoutes } from "./routes";
	import type { Entries } from "type-fest";
	import UserManagement from "./UserManagement.svelte";
	import { m } from "$lib/paraglide/messages";

	// Safe to call here — this component is always rendered inside <Sidebar.Provider>
	const sidebar = Sidebar.useSidebar();
</script>

<!-- Using ml-2 because icons were not centered when collapsed. -->
<Sidebar.Content class="ml-2">
	<Sidebar.Menu>
		{const routes = Object.entries(appRoutes) as Entries<typeof appRoutes>}
		{#each routes as [routeKey, routeDetails] (routeKey)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					class="cursor-pointer"
					onclick={() => {
						sidebar.setOpenMobile(false);
						goto(resolve(routeKey));
					}}
					tooltipContent={routeDetails.label}
				>
					<routeDetails.icon />
					<span>{routeDetails.label}</span>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Content>

<Sidebar.Footer>
	<Sidebar.Menu>
		<Sidebar.MenuItem>
			<UserManagement />
		</Sidebar.MenuItem>
	</Sidebar.Menu>
	<Sidebar.Menu>
		<Sidebar.MenuItem>
			<Sidebar.MenuButton
				class="cursor-pointer"
				onclick={() => {
					sidebar.setOpenMobile(false);
					goto(resolve("/settings"));
				}}
				tooltipContent={m.settings()}
			>
				<Settings />
				<span>{m.settings()}</span>
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	</Sidebar.Menu>
</Sidebar.Footer>
