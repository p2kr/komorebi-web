<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import { Settings } from "@lucide/svelte";
	import { appRoutes } from "./routes";
	import type { Entries } from "type-fest";
	import Appbar from "./Appbar.svelte";
	import logo from "$lib/assets/favicon.svg";

	const { children } = $props();
</script>

<Sidebar.Provider>
	<Sidebar.Root collapsible="icon">
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem class="hover:bg-transparent">
					<Sidebar.MenuButton class="hover:bg-transparent active:bg-transparent   ">
						<img class="size-6 rounded-full object-cover" src={logo} alt="app logo" />
						<span style:font-family="Segoe Script" class="text-2xl font-bold">Komorebi</span>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>
		<Sidebar.Header>
			<Sidebar.Menu>
				{const routes = Object.entries(appRoutes) as Entries<typeof appRoutes>}
				{#each routes as [routeKey, routeDetails] (routeKey)}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton class="cursor-pointer" onclick={() => goto(resolve(routeKey))}>
							<routeDetails.icon />
							<span>{routeDetails.label}</span>
						</Sidebar.MenuButton>
						<!-- <Sidebar.MenuButton size="lg">
							{#snippet child({ props })}
								<a href={resolve(routeKey)} {...props}>
									<routeDetails.icon />
									<span>{routeDetails.label}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton> -->
					</Sidebar.MenuItem>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Header>
		<!-- Using header in place of content because icons were not centered when collapsed. -->
		<Sidebar.Content />
		<Sidebar.Footer>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton class="cursor-pointer" onclick={() => goto(resolve("/settings"))}>
						<Settings />
						<span>Settings</span>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Footer>
	</Sidebar.Root>
	<main class="m-2">
		<Appbar />
		{@render children?.()}
	</main>
</Sidebar.Provider>
