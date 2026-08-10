<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import * as Avatar from "$lib/components/ui/avatar";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import { m } from "$lib/paraglide/messages";
	import { userStore } from "$lib/store/user.svelte";
	import { ChevronsUpDown, Settings2, User } from "@lucide/svelte";

	const users = $derived(userStore.users);
	const currentUser = $derived(userStore.currentUser);

	const fetchedUsers = $derived(page.data.users as typeof users);

	$effect(() => {
		userStore.setUsers(fetchedUsers || []);
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Sidebar.MenuButton
				{...props}
				class="cursor-pointer"
				size="lg"
				tooltipContent={currentUser ? currentUser.username : m.no_user_configured()}
			>
				{#if currentUser}
					<Avatar.Root class="group-data-[collapsible=icon]:size-8">
						<Avatar.Image src={currentUser.avatar_url} alt={currentUser.username} />
					</Avatar.Root>
					<div>
						<span class="font-bold">{currentUser.username}</span>
						<div class="text-xs uppercase">
							<span>{currentUser.provider}</span>
							{#if currentUser.is_sandbox}
								<span>{m.sandbox()}</span>
							{/if}
						</div>
					</div>
				{:else}
					<User class="group-data-[collapsible=icon]:ml-2" />
					<span>{m.no_user_configured()}</span>
				{/if}
				<div class="flex-1"></div>
				<ChevronsUpDown />
			</Sidebar.MenuButton>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content side="top" align="start">
		{#each users as user (user.id)}
			<DropdownMenu.Item onSelect={() => userStore.setCurrentUser(user)}>
				<Avatar.Root class="size-5">
					<Avatar.Image src={user.avatar_url} alt={user.username} />
				</Avatar.Root>
				<div>
					<span class="font-bold">{user.username}</span>
					<div class="text-xs uppercase">
						<span>{user.provider}</span>
						{#if user.is_sandbox}
							<span>{m.sandbox()}</span>
						{/if}
					</div>
				</div>
			</DropdownMenu.Item>
		{/each}
		<DropdownMenu.Separator />
		<DropdownMenu.Item onSelect={() => goto(resolve("/settings/user"))}>
			<Settings2 />
			<span>{m.configure()}</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
