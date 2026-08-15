<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import { Settings } from "@lucide/svelte";
	import { appRoutes } from "./routes";
	import type { Entries } from "type-fest";
	import Appbar from "./Appbar.svelte";
	import logo from "$lib/assets/favicon.svg";
	import { m } from "$lib/paraglide/messages";
	import { Constants } from "$lib/core/constants";
	import UserManagement from "./UserManagement.svelte";

	const { children } = $props();
</script>

<Sidebar.Provider>
	<Sidebar.Root collapsible="icon">
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem class="hover:bg-transparent">
					<Sidebar.MenuButton class="active:bg-transparen hover:bg-transparent">
						<img class="size-6 rounded-full object-cover" src={logo} alt={m.app_logo()} />
						<span style:font-family="Segoe Script" class="text-2xl font-bold"
							>{Constants.APP_NAME}</span
						>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>

		<!-- Using ml-2 in because icons were not centered when collapsed. -->
		<Sidebar.Content class="ml-2">
			<Sidebar.Menu>
				{const routes = Object.entries(appRoutes) as Entries<typeof appRoutes>}
				{#each routes as [routeKey, routeDetails] (routeKey)}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							class="cursor-pointer"
							onclick={() => goto(resolve(routeKey))}
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
						onclick={() => goto(resolve("/settings"))}
						tooltipContent={m.settings()}
					>
						<Settings />
						<span>{m.settings()}</span>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Footer>
	</Sidebar.Root>
	<main class="m-2 h-full w-full">
		<Appbar />
		{@render children?.()}
	</main>
</Sidebar.Provider>
