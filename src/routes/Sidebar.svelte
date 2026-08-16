<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar";
	import Appbar from "./Appbar.svelte";
	import SidebarNav from "./SidebarNav.svelte";
	import logo from "$lib/assets/favicon.svg";
	import { m } from "$lib/paraglide/messages";
	import { Constants } from "$lib/core/constants";
	import { settingsStore } from "$lib/store/settings.svelte";

	const { children } = $props();
</script>

<Sidebar.Provider
	bind:open={
		() => settingsStore.global.isSidebarOpen,
		(newValue) => settingsStore.updateSettings({ global: { isSidebarOpen: newValue } })
	}
>
	<Sidebar.Root collapsible="icon">
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem class="hover:bg-transparent">
					<Sidebar.MenuButton class="hover:bg-transparent active:bg-transparent">
						<img class="size-6 rounded-full object-cover" src={logo} alt={m.app_logo()} />
						<span style:font-family="Segoe Script" class="text-2xl font-bold">
							{Constants.APP_NAME}
						</span>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>

		<SidebarNav />
	</Sidebar.Root>
	<main class="m-2 h-full w-full">
		<Appbar />
		{@render children?.()}
	</main>
</Sidebar.Provider>
