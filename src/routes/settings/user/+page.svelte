<script lang="ts">
	import { enhance } from "$app/forms";
	import * as Avatar from "$lib/components/ui/avatar";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Spinner } from "$lib/components/ui/spinner";
	import * as Table from "$lib/components/ui/table";
	import type { User } from "$lib/models/user";
	import { m } from "$lib/paraglide/messages";
	import { userStore } from "$lib/store/user.svelte";
	import { cn } from "$lib/utils";
	import { Trash2 } from "@lucide/svelte";
	import { toast } from "svelte-sonner";
	import NewUser from "./NewUser.svelte";
	import * as Item from "$lib/components/ui/item";
	import type { SubmitFunction } from "./$types";

	const users = $derived(userStore.users);
	const currentUser = $derived(userStore.currentUser);

	let isDialogOpen = $state(false);
	let userToDelete: User | undefined = $state(undefined);
	let isDeleting = $state(false);

	const handleFormSubmit = (() => {
		isDeleting = true;
		return ({ result, update }) => {
			isDeleting = false;
			if (result.type === "success") {
				isDialogOpen = false;
				userToDelete = undefined;
			} else if (result.type === "failure") {
				const msg = result.data;
				toast(`${msg?.error.code} : ${msg?.error.msg}`);
			}
			update();
		};
	}) satisfies SubmitFunction;
</script>

<div class="mb-2 text-2xl">{m.connected_users()}</div>
<Item.Root variant="outline">
	<Table.Root>
		<Table.Header>
			<Table.Row class="hover:bg-transparent">
				<Table.Head>{m.avatar()}</Table.Head>
				<Table.Head>{m.username()}</Table.Head>
				<Table.Head>{m.provider()}</Table.Head>
				<Table.Head>{m.link_type()}</Table.Head>
				<Table.Head>{m.actions()}</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each users as user (user.id)}
				<Table.Row class={cn("hover:bg-transparent", currentUser?.id === user.id && "font-bold")}>
					<Table.Cell>
						<Avatar.Root size="lg">
							<Avatar.Image src={user.avatar_url} />
						</Avatar.Root>
					</Table.Cell>
					<Table.Cell>{user.username}</Table.Cell>
					<Table.Cell>{user.provider}</Table.Cell>
					<Table.Cell>
						{#if user.is_sandbox}
							{m.sandbox()}
						{:else}
							{m.oauth()}
						{/if}
					</Table.Cell>
					<Table.Cell>
						<Button
							variant="ghost"
							onclick={() => {
								isDialogOpen = true;
								userToDelete = user;
							}}
						>
							<Trash2 size={16} />
						</Button>
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={5}>{m.no_users()}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</Item.Root>
{#if userToDelete}
	<Dialog.Root bind:open={isDialogOpen}>
		<Dialog.Content
			showCloseButton={false}
			onInteractOutside={(e) => {
				if (isDeleting) {
					e.preventDefault();
				}
			}}
		>
			<Dialog.Header>
				<Dialog.Title>{m.delete()}</Dialog.Title>
			</Dialog.Header>
			<div>
				{m.do_you_want_to_remove()}<span class="font-mono">&nbsp;@{userToDelete.username}</span> ?
			</div>
			<Dialog.Footer>
				<Dialog.Close
					disabled={isDeleting}
					type="button"
					class={buttonVariants({ variant: "outline" })}
				>
					{m.cancel()}
				</Dialog.Close>
				<form method="post" action="?/deleteUser" use:enhance={handleFormSubmit}>
					<input type="hidden" name="user_id" value={userToDelete.id} />
					{#if !isDeleting}
						<Button type="submit" class={buttonVariants({ variant: "destructive" })}>
							{m.delete()}
						</Button>
					{:else}
						<Button disabled class={buttonVariants({ variant: "destructive" })}>
							<Spinner />
							{m.deleting()}
						</Button>
					{/if}
				</form>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
<div class="mb-2"></div>
<NewUser />
