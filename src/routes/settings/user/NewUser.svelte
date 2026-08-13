<script lang="ts">
	import { enhance } from "$app/forms";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Collapsible from "$lib/components/ui/collapsible";
	import Input from "$lib/components/ui/input/input.svelte";
	import * as Item from "$lib/components/ui/item";
	import * as Table from "$lib/components/ui/table";
	import * as Tabs from "$lib/components/ui/tabs";
	import { type MediaProvider } from "$lib/models/media";
	import { m } from "$lib/paraglide/messages";
	import { cn } from "$lib/utils";
	import { ExternalLink, Plus } from "@lucide/svelte";
	import type { SubmitFunction } from "./$types";
	import { invalidate } from "$app/navigation";
	import * as utils from "$lib/core/utils";
	import type { User } from "$lib/models/user";
	import { getOauthClient } from "$lib/services/oauth";
	import { toast } from "svelte-sonner";

	let isPanelOpen = $state(false);
	let isLoading = $state(false);

	const providerMap = {
		MAL: { label: "MyAnimeList", href: "https://myanimelist.net" },
		ANILIST: { label: "AniList", href: "https://anilist.co" }
	} satisfies Record<MediaProvider, { label: string; href: string }>;

	let userInfo = $state<Partial<User>>({
		is_sandbox: false,
		provider: Object.keys(providerMap)[0] as MediaProvider,
		access_token: "",
		username: "",
		avatar_url: undefined
	});

	const handleSubmit = (async ({ formData, cancel }) => {
		isLoading = true;
		// check if oauth
		if (!formData.get("is_sandbox")) {
			// perform oauth
			const oauthClient = getOauthClient(formData.get("provider") as MediaProvider);
			try {
				const { code, codeVerifier } = await oauthClient.getAuthCode();

				if (!code || !codeVerifier) {
					cancel();
					toast(m.unable_to_get_auth_code());
					isLoading = false;
					return;
				}

				formData.set("code", code);
				formData.set("code_verifier", codeVerifier);
			} catch {
				toast(m.error_getting_access_token(), {
					description: m.authentication_failed()
				});
				isLoading = false;
				cancel();
				return;
			}
		}

		return ({ result, update }) => {
			if (result.type === "success") {
				// TODO: Check if it works
				invalidate((url) => url.pathname.endsWith("user/all"));
				toast(m.successfully_authenticated());
			} else {
				// @ts-expect-error data maybe a FailureResponse
				utils.toastFailure(result.data || m.some_error_occurred());
			}
			isLoading = false;
			update();
		};
	}) satisfies SubmitFunction;
</script>

<Collapsible.Root bind:open={isPanelOpen}>
	<Collapsible.Trigger
		class={cn("mb-2", buttonVariants({ variant: isPanelOpen ? "ghost" : "default" }))}
	>
		<Plus />
		<span>{m.add_user()}</span>
	</Collapsible.Trigger>
	<Collapsible.Content>
		<Item.Root variant="outline">
			<form class="new-user-table" method="post" use:enhance={handleSubmit}>
				<input type="hidden" name="provider" value={userInfo.provider} />
				<input type="hidden" name="avatar_url" value={userInfo.avatar_url} />

				<Table.Root>
					<Table.Body>
						<Table.Row class="hover:bg-transparent">
							<Table.Head>{m.provider()}</Table.Head>
							<Table.Cell>
								<Tabs.Root bind:value={userInfo.provider}>
									<Tabs.List>
										{#each Object.entries(providerMap) as [k, v] (k)}
											<Tabs.Trigger value={k}>
												{v.label}
											</Tabs.Trigger>
										{/each}
									</Tabs.List>
									{#each Object.entries(providerMap) as [k, v] (k)}
										<Tabs.Content value={k}>
											<a
												class="flex items-center gap-1 font-mono text-xs"
												href={v.href}
												target="_blank"
												rel="external"
												data-no-translate
											>
												<span>{v.href}</span>
												<ExternalLink size="12" />
											</a>
										</Tabs.Content>
									{/each}
								</Tabs.Root>
							</Table.Cell>
						</Table.Row>
						<Table.Row class="hover:bg-transparent">
							<Table.Head>{m.link_type()}</Table.Head>
							<Table.Cell>
								<Tabs.Root
									value={userInfo.is_sandbox ? "sandbox" : "oauth"}
									onValueChange={(e) => (userInfo.is_sandbox = e === "sandbox")}
								>
									<Tabs.List>
										<Tabs.Trigger value="oauth">{m.oauth()}</Tabs.Trigger>
										<Tabs.Trigger value="sandbox">{m.sandbox()}</Tabs.Trigger>
									</Tabs.List>
									<Tabs.Content value="oauth">{m.oauth_msg()}</Tabs.Content>
									<Tabs.Content value="sandbox">{m.sandbox_msg()}</Tabs.Content>
								</Tabs.Root>
							</Table.Cell>
						</Table.Row>
						<Table.Row class="hover:bg-transparent">
							{#if userInfo.is_sandbox}
								<Table.Head>{m.username()}</Table.Head>
								<Table.Cell>
									<Input
										type="text"
										name="username"
										placeholder={m.enter_username()}
										bind:value={userInfo.username}
									/>
								</Table.Cell>
							{:else}
								<Table.Head>{m.access_token()}</Table.Head>
								<Table.Cell>
									<Input
										type="password"
										name="access_token"
										placeholder={m.enter_access_token()}
										bind:value={userInfo.access_token}
										disabled={userInfo.is_sandbox || isLoading}
									/>
								</Table.Cell>
							{/if}
						</Table.Row>
						<Table.Row class="hover:bg-transparent">
							<Table.Cell colspan={2}>
								<Button type="submit" formaction="?/addUser" class="w-full">
									{m.connect()}
								</Button>
							</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Root>
			</form>
		</Item.Root>
	</Collapsible.Content>
</Collapsible.Root>

<style>
	.new-user-table :global(td) {
		min-width: 500px;
	}
	.new-user-table :global(th) {
		width: 120px;
	}
</style>
