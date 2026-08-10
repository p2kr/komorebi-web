<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import { ChevronsUpDown, Plus, Settings, User } from "@lucide/svelte";
	import { appRoutes } from "./routes";
	import type { Entries } from "type-fest";
	import Appbar from "./Appbar.svelte";
	import logo from "$lib/assets/favicon.svg";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { userStore } from "./user.svelte";
	import * as Avatar from "$lib/components/ui/avatar";

	const { children } = $props();

	const users = $derived(userStore.users);
	const currentUser = $derived(userStore.currentUser);
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
					<Sidebar.MenuButton class="cursor-pointer">
						{#if currentUser}
							<Avatar.Root>
								<Avatar.Image src={currentUser.avatar_url} alt={currentUser.username} />
							</Avatar.Root>
							<div>
								<span>{currentUser.username}</span>
								<span>{currentUser.provider + currentUser.is_sandbox ? "Sandbox" : ""}</span>
							</div>
						{:else}
							<User />
							<span>No user configured</span>
						{/if}
					</Sidebar.MenuButton>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger disabled={users.length === 0}>
							{#snippet child({ props })}
								<Sidebar.MenuAction {...props}>
									<ChevronsUpDown />
								</Sidebar.MenuAction>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							{#each users as user (user.id)}
								<DropdownMenu.Item>
									<Avatar.Root>
										<Avatar.Image src={user.avatar_url} alt={user.username} />
									</Avatar.Root>
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
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
